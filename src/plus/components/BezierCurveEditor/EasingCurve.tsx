import { BezierDefinition } from "motion"

export interface EasingCurveProps {
    curve: BezierDefinition
    width: number
    height: number
    left?: number
    top?: number
    right?: number
    bottom?: number
}

export function EasingCurve({
    curve,
    width,
    height,
    left = 0,
    top = 0,
    right = width,
    bottom = height,
}: EasingCurveProps) {
    const drawableWidth = right - left
    const drawableHeight = bottom - top

    const [x1, y1, x2, y2] = curve

    const borderPoints = `${left},${top} ${left},${bottom} ${right},${bottom}`
    const curvePath = `M ${left},${bottom} C ${left + x1 * drawableWidth},${
        bottom - y1 * drawableHeight
    } ${left + x2 * drawableWidth},${
        bottom - y2 * drawableHeight
    } ${right},${top}`

    return (
        <>
            <polyline
                fill="none"
                stroke="var(--vscode-editor-selectionHighlightBackground)"
                strokeWidth="1"
                points={borderPoints}
            ></polyline>
            <path
                d={curvePath}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="3"
            ></path>
        </>
    )
}
