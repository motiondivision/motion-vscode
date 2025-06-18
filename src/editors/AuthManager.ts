import * as vscode from "vscode"
import fetch from "node-fetch"

export class AuthManager {
    private static endpoint = "http://api.motion.dev/me/is-valid-token"
    private static readonly TOKEN_KEY = "motion-auth-token"
    private context: vscode.ExtensionContext

    constructor(context: vscode.ExtensionContext) {
        this.context = context
    }

    async isAuthenticated(): Promise<boolean> {
        const token = await this.context.secrets.get(AuthManager.TOKEN_KEY)
        if (!token) return false

        try {
            const res = await fetch(AuthManager.endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

            const text = await res.text()
            console.log("Raw response from /me/is-valid-token:", text)
            let data
            try {
                data = JSON.parse(text)
            } catch (e) {
                console.error("Failed to parse JSON:", e)
                return false
            }
            return !!data.isPlus
        } catch (e) {
            console.error("Fetch error:", e)
            return false
        }
    }

    async authenticate(): Promise<boolean> {
        const token = await vscode.window.showInputBox({
            prompt: "Enter your Motion+ personal access token",
            password: true,
            ignoreFocusOut: true,
        })

        if (!token) return false

        // Optionally, validate token with endpoint
        try {
            const res = await fetch(AuthManager.endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

            const text = await res.text()

            let data
            try {
                data = JSON.parse(text)
            } catch (e) {
                vscode.window.showErrorMessage(
                    "Invalid JSON response from server."
                )
                return false
            }
            if (data.isPlus) {
                await this.context.secrets.store(AuthManager.TOKEN_KEY, token)
                return true
            } else {
                vscode.window.showErrorMessage("Invalid token.")
                return false
            }
        } catch (e) {
            vscode.window.showErrorMessage("Authentication error: " + e)
            return false
        }
    }

    async logout() {
        await this.context.secrets.delete(AuthManager.TOKEN_KEY)
    }
}
