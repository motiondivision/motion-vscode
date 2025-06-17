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

    vscode.window.showInformationMessage(
        "Motion for VS Code has been activated!"
    )
}

export function deactivate() {}
