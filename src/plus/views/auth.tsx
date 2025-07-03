declare const acquireVsCodeApi: () => {
    postMessage: (message: { type: string }) => void
}

const vscode = acquireVsCodeApi()

document.getElementById("login-btn")?.addEventListener("click", () => {
    vscode.postMessage({ type: "login" })
})

window.addEventListener("message", (event) => {
    if (event.data && event.data.type === "loginFailed") {
        const error = document.getElementById("error")

        if (error) {
            error.textContent = "Login failed. Ensure your auth token is valid."
            error.style.display = "block"
        }
    }
})
