import * as assert from "assert"

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode"
// import * as myExtension from '../../extension';

suite("Extension Test Suite", () => {
    vscode.window.showInformationMessage("Start all tests.")

    test("Check MCP service has been added", () => {
        const services = vscode.extensions.all.map((ext) => ext.id)
        console.log(services)
        assert.ok(
            services.includes("mcp.service"),
            "MCP service should be added"
        )
    })
})
