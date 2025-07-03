import { useEffect, useRef } from "react"

interface AnimationPreviewProps {
    duration: number // in milliseconds
    easing: string // CSS easing function, e.g., 'ease-in-out', 'linear', etc.
}

export function AnimationPreview({ duration, easing }: AnimationPreviewProps) {
    const container = useRef<HTMLDivElement>(null)
    const box = useRef<HTMLDivElement>(null)

    function playAnimation(delay: number = 0 /** ms */) {
        if (!container.current || !box.current) return

        const initialX = -(
            container.current.clientWidth -
            box.current.clientWidth -
            parseFloat(getComputedStyle(container.current).paddingLeft) * 2
        )

        box.current.animate(
            { transform: [`translate3d(${initialX}px, 0, 0)`, "none"] },
            { duration, easing, fill: "backwards", delay }
        )
    }

    useEffect(() => {
        playAnimation(500)
    }, [easing, duration])

    return (
        <section
            ref={container}
            className="preview"
            onClick={() => playAnimation()}
        >
            <div ref={box} className="preview-box"></div>
        </section>
    )
}
