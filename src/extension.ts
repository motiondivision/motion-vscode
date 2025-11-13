import * as vscode from "vscode"
import { MotionViewProvider } from "./plus/MotionViewProvider"

export function activate(context: vscode.ExtensionContext) {
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

    /**
     * TODO: Restore MCP server definition provider when Cursor upgrades
     * to 1.101.0.
     */

    // const didChangeEmitter = new vscode.EventEmitter<void>()

    // context.subscriptions.push(
    //     vscode.lm.registerMcpServerDefinitionProvider("motion.mcp-servers", {
    //         onDidChangeMcpServerDefinitions: didChangeEmitter.event,
    //         provideMcpServerDefinitions: async () => {
    //             try {
    //                 const servers = [
    //                     new vscode.McpStdioServerDefinition(
    //                         "Motion",
    //                         "npx",
    //                         ["-y", "motion-ai"],
    //                         {}
    //                     ),
    //                 ]

    //                 return servers
    //             } catch (error) {
    //                 logError(
    //                     error instanceof Error
    //                         ? error
    //                         : new Error(String(error))
    //                 )

    //                 return []
    //             }
    //         },
    //     })
    // )
}

export function deactivate() {}
