import { BezierDefinition, progress, resize } from "motion"
import { useIsomorphicLayoutEffect } from "motion/react"
import { PointerEventHandler, useRef, useState } from "react"
import { EasingCurve } from "./EasingCurve"

export interface BezierCurveEditorProps {
    onChange: (newCurve: BezierDefinition) => void
    curve: BezierDefinition

    // @internal
    insetAsPercentage?: number
}

export function BezierCurveEditor({
    curve,
    onChange,
    insetAsPercentage = 10,
}: BezierCurveEditorProps) {
    const [size, setSize] = useState({ width: 0, height: 0 })
    const svg = useRef<SVGSVGElement>(null)
    const inset = (insetAsPercentage / 100) * size.width
    const point1 = useRef<SVGCircleElement>(null)
    const point2 = useRef<SVGCircleElement>(null)

    // Calculate drawable area
    const left = inset
    const top = inset
    const right = size.width - inset
    const bottom = size.height - inset
    const drawableWidth = right - left
    const drawableHeight = bottom - top
    const [x1, y1, x2, y2] = curve

    const x1Pos = left + x1 * drawableWidth
    const y1Pos = bottom - y1 * drawableHeight
    const x2Pos = left + x2 * drawableWidth
    const y2Pos = bottom - y2 * drawableHeight

    useIsomorphicLayoutEffect(() => {
        if (!svg.current) return

        const updateSize = () => {
            if (!svg.current) return
            setSize({
                width: svg.current.clientWidth,
                height: svg.current.clientHeight,
            })
        }

        return resize(svg.current, updateSize)
    }, [])

    const drag =
        (point: number): PointerEventHandler =>
        (startEvent) => {
            const xi = point * 2
            const yi = xi + 1

            const { currentTarget } = startEvent

            let hasMoved = false

            startEvent.preventDefault()
            startEvent.stopPropagation()

            const element = point === 0 ? point1.current : point2.current
            if (!element) return

            element.style.cursor = "grabbing"
            element.setPointerCapture(startEvent.pointerId)

            const svgElement = svg.current
            if (!svgElement) return

            const rect = svgElement.getBoundingClientRect()

            const onMove = (x: number, y: number) => {
                const newBezier = [...curve]
                newBezier[xi] = Math.max(0, Math.min(1, x))
                newBezier[yi] = y
                onChange(newBezier as unknown as BezierDefinition)
            }

            function moveHandler({ clientX, clientY }: PointerEvent) {
                hasMoved = true

                const x = progress(
                    rect.left + inset,
                    rect.right - inset,
                    clientX
                )
                const y = progress(
                    rect.bottom - inset,
                    rect.top + inset,
                    clientY
                )

                // Limit x and y to max 3 decimal places
                const xFixed = Math.round(x * 1000) / 1000
                const yFixed = Math.round(y * 1000) / 1000
                onMove(xFixed, yFixed)
            }

            function upHandler() {
                if (
                    !hasMoved &&
                    currentTarget.classList.contains("reset-control-point")
                ) {
                    if (point === 0) {
                        onMove(0, 0)
                    } else {
                        onMove(1, 1)
                    }
                }

                element!.releasePointerCapture(startEvent.pointerId)
                element!.style.cursor = "grab"
                document.removeEventListener("pointermove", moveHandler)
                document.removeEventListener("pointerup", upHandler)
            }

            document.addEventListener("pointermove", moveHandler)
            document.addEventListener("pointerup", upHandler)
        }

    return (
        <svg
            ref={svg}
            className="bezier-svg"
            viewBox={`0 0 ${size.width} ${size.height}`}
        >
            <EasingCurve
                curve={curve}
                {...size}
                left={left}
                top={top}
                right={right}
                bottom={bottom}
            />
            <polyline
                id="control-1-tether"
                fill="none"
                stroke="var(--vscode-editor-selectionHighlightBackground)"
                strokeWidth="2"
                strokeDasharray="4, 2"
                points={`${left},${bottom} ${x1Pos},${y1Pos}`}
            ></polyline>
            <polyline
                id="control-2-tether"
                fill="none"
                stroke="var(--vscode-editor-selectionHighlightBackground)"
                strokeWidth="2"
                strokeDasharray="4, 2"
                points={`${right},${top} ${x2Pos},${y2Pos}`}
            ></polyline>
            <circle
                id="reset-control-1"
                className="reset-control-point"
                r="7"
                cx={left}
                cy={bottom}
                fill="var(--vscode-editor-selectionHighlightBackground)"
                onPointerDown={drag(0)}
            ></circle>
            <circle
                id="reset-control-2"
                className="reset-control-point"
                cx={right}
                cy={top}
                r="7"
                fill="var(--vscode-editor-selectionHighlightBackground)"
                onPointerDown={drag(1)}
            ></circle>
            <circle
                ref={point1}
                id="control-1"
                className="control-point"
                r="7"
                fill="var(--accent)"
                cx={x1Pos}
                cy={y1Pos}
                onPointerDown={drag(0)}
            />
            <circle
                ref={point2}
                id="control-2"
                className="control-point"
                r="7"
                fill="var(--accent)"
                cx={x2Pos}
                cy={y2Pos}
                onPointerDown={drag(1)}
            />
        </svg>
    )
}
