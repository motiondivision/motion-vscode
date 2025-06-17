import * as vscode from "vscode"

export function activate(context: vscode.ExtensionContext) {
    const didChangeEmitter = new vscode.EventEmitter<void>()

    vscode.window.showInformationMessage(
        "Motion for VS Code has been activated!"
    )

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
            // resolveMcpServerDefinition: async (definition) => {
            //     /**
            //      * if definition.label === "motion-plus" then fetch authentication
            //      */
            //     vscode.window.showInformationMessage(
            //         "Resolving ",
            //         definition.label
            //     )
            //     return definition
            // },
        })
    )
}

export function deactivate() {}
