import * as vscode from "vscode"
import { MotionViewProvider } from "./editors/MotionViewProvider"

export function activate(context: vscode.ExtensionContext) {
    const didChangeEmitter = new vscode.EventEmitter<void>()

    context.subscriptions.push(
        vscode.lm.registerMcpServerDefinitionProvider("motion.mcp-servers", {
            onDidChangeMcpServerDefinitions: didChangeEmitter.event,
            provideMcpServerDefinitions: async () => {
                return [
                    new vscode.McpStdioServerDefinition(
                        "Motion",
                        "npx",
                        ["-y", "motion-ai"],
                        {}
                    ),
                ]
            },
        })
    )

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            MotionViewProvider.viewType,
            new MotionViewProvider(context)
        )
    )

    context.subscriptions.push(
        vscode.commands.registerCommand("motion.clearAuthToken", async () => {
            await context.secrets.delete("motion-auth-token")
            vscode.window.showInformationMessage("Motion+ token deleted.")
        })
    )
}

export function deactivate() {}
