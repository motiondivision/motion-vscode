import * as vscode from "vscode"
import fs from "fs"
import path from "path"

const bezierRegex = /cubic-bezier\(([^)]+)\)/
const arrayRegex =
    /\[\s*([\-\d.]+)\s*,\s*([\-\d.]+)\s*,\s*([\-\d.]+)\s*,\s*([\-\d.]+)\s*\]/

export class MotionViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = "motion-editor"
    private _view?: vscode.WebviewView
    private _context: vscode.ExtensionContext

    constructor(context: vscode.ExtensionContext) {
        this._context = context
        vscode.window.onDidChangeTextEditorSelection(
            this._onSelectionChange,
            this,
            context.subscriptions
        )
    }

    resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView
        webviewView.webview.options = {
            enableScripts: true,
        }

        const htmlPath = path.join(
            this._context.extensionPath,
            "src",
            "editors",
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
