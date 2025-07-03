import { BezierDefinition } from "motion"
import { useEffect, useState } from "react"
import { AnimationPreview } from "./AnimationPreview"
import { BezierCurveEditor } from "./BezierCurveEditor/BezierCurveEditor"
import { useVSCode } from "./VSCode"

type View = "default" | "bezier"

export function OptionsEditor() {
    const [view, setView] = useState<View>("default")
    const [bezier, setBezier] = useState<BezierDefinition>([0.25, 0.1, 0.25, 1])
    const vscode = useVSCode()

    /**
     * Set up event listeners for messages from VS Code.
     * - "clear": Reset the view to default.
     * - "setBezier": Update the bezier curve and switch to the bezier view
     */
    useEffect(() => {
        const eventHandlers = {
            clear: () => {
                setView("default")
            },
            setBezier: ({ value }: any) => {
                if (view === "default") setView("bezier")

                const newBezier = value
                    .split(",")
                    .map((n: string) => parseFloat(n.trim()))

                if (
                    newBezier.length === 4 &&
                    newBezier.every((n: number) => !isNaN(n))
                ) {
                    setBezier(newBezier as BezierDefinition)
                }
            },
        }

        window.addEventListener("message", ({ data }) => {
            const { type } = data

            const handler = eventHandlers[type as keyof typeof eventHandlers]
            if (handler) {
                handler(data)
            }
        })
    }, [])

    if (view === "default") {
        return (
            <div className="message empty">
                <h1>No animation selected</h1>
                <p>Select a CSS or Motion bezier curve to edit it here.</p>
            </div>
        )
    }

    return (
        <div className="curve-container" id="curve-container">
            <h1>Edit Bezier Curve</h1>
            <BezierCurveEditor
                curve={bezier}
                onChange={(newCurve) => {
                    vscode.postMessage({
                        type: "updateBezier",
                        value: newCurve.join(", "),
                    })
                }}
            />
            <AnimationPreview
                duration={500}
                easing={`cubic-bezier(${bezier.join(", ")})`}
            />
        </div>
    )
}
