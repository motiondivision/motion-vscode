import { createContext, useContext } from "react"

if (!window.acquireVsCodeApi) {
    console.warn(
        "acquireVsCodeApi is not available. Make sure this script is running in a VS Code webview."
    )
}

interface VSCodeAPI {
    postMessage: (message: { type: string; value?: string }) => void
}

declare global {
    interface Window {
        acquireVsCodeApi: () => VSCodeAPI
    }
}

const VSCodeContext = createContext<null | any>(window.acquireVsCodeApi())

export function useVSCode() {
    return useContext(VSCodeContext)
}
