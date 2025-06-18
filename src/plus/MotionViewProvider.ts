import * as vscode from "vscode"
import fs from "fs"
import path from "path"
import { AuthManager } from "./AuthManager"

const bezierRegex = /cubic-bezier\(([^)]+)\)/
const arrayRegex =
    /\[\s*([\-\d.]+)\s*,\s*([\-\d.]+)\s*,\s*([\-\d.]+)\s*,\s*([\-\d.]+)\s*\]/

export class MotionViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = "motion-editor"
    private _view?: vscode.WebviewView
    private _context: vscode.ExtensionContext
    private _auth: AuthManager
    private _authenticated = false

    constructor(context: vscode.ExtensionContext) {
        this._context = context
        this._auth = new AuthManager(context)

        vscode.window.onDidChangeTextEditorSelection(
            this._onSelectionChange,
            this,
            context.subscriptions
        )
    }

    async resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView
        webviewView.webview.options = {
            enableScripts: true,
        }

        // Check authentication
        this._authenticated = await this._auth.isAuthenticated()

        if (!this._authenticated) {
            const htmlPath = path.join(
                this._context.extensionPath,
                "dist",
                "plus",
                "auth.html"
            )
            let html = fs.readFileSync(htmlPath, "utf8")
            webviewView.webview.html = html

            webviewView.webview.onDidReceiveMessage(async (message) => {
                if (message.type === "login") {
                    const success = await this._auth.authenticate()

                    if (success) {
                        this._authenticated = true
                        this.resolveWebviewView(webviewView) // Reload view
                    } else {
                        webviewView.webview.postMessage({ type: "loginFailed" })
                    }
                }
            })
            return
        }

        const htmlPath = path.join(
            this._context.extensionPath,
            "dist",
            "plus",
            "bezier.html"
        )
        let html = fs.readFileSync(htmlPath, "utf8")
        webviewView.webview.html = html

        webviewView.webview.onDidReceiveMessage(async (message) => {
            if (message.type === "updateBezier") {
                const editor = vscode.window.activeTextEditor
                if (!editor) return

                const { document, selection } = editor
                const lineNum = selection.active.line
                const line = document.lineAt(lineNum).text
                const match = line.match(bezierRegex) || line.match(arrayRegex)
                let newLine = line
                if (match && match[0].startsWith("cubic-bezier")) {
                    newLine = line.replace(
                        bezierRegex,
                        `cubic-bezier(${message.value})`
                    )
                } else if (match && match[0].startsWith("[")) {
                    newLine = line.replace(arrayRegex, `[${message.value}]`)
                }

                if (newLine !== line) {
                    await editor.edit((editBuilder) => {
                        editBuilder.replace(
                            document.lineAt(lineNum).range,
                            newLine
                        )
                    })

                    this.updateBezier(newLine)
                } else {
                    // If nothing changed, still send the current value
                    this._sendCurrentBezierToWebview()
                }
            }
        })
        this._sendCurrentBezierToWebview() // Initial update
    }

    private updateBezier(line: string) {
        if (!this._view) return
        let match = line.match(bezierRegex) || line.match(arrayRegex)
        if (!match) {
            this._view.webview.postMessage({ type: "clear" })
            return
        }

        let value = match[0]

        if (value.startsWith("cubic-bezier")) {
            value = value.match(bezierRegex)?.[1] || ""
        } else if (value.startsWith("[")) {
            value = value.replace(/[^\d.,\-]/g, "")
        }

        this._view.webview.postMessage({ type: "setBezier", value })
    }

    private _onSelectionChange(event: vscode.TextEditorSelectionChangeEvent) {
        this._sendCurrentBezierToWebview(event.textEditor)
    }

    private _sendCurrentBezierToWebview(editor?: vscode.TextEditor) {
        if (!this._view) return

        editor = editor || vscode.window.activeTextEditor

        if (!editor) {
            this._view.webview.postMessage({ type: "clear" })
            return
        }

        const { document, selection } = editor

        if (!document) {
            this._view.webview.postMessage({ type: "clear" })
            return
        }

        const line = document.lineAt(selection.active.line).text
        this.updateBezier(line)
    }
}
