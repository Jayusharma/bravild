"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useLoader } from "@/provider/LoaderContext"

gsap.registerPlugin(ScrollTrigger)

const TOTAL_TILES = 60

export default function Preloader() {
    const containerRef = useRef<HTMLDivElement>(null)
    const gridRef = useRef<HTMLDivElement>(null)
    const counterRef = useRef<HTMLDivElement>(null)
    const counterNumberRef = useRef<HTMLSpanElement>(null)
    const topTextRef = useRef<HTMLDivElement>(null)
    const bottomTextRef = useRef<HTMLDivElement>(null)
    const textWrapperRef = useRef<HTMLDivElement>(null)

    const { setIsLoading } = useLoader()
    const [isComplete, setIsComplete] = useState(false)

    useEffect(() => {
        // Lock body scroll to prevent scrollbars during preloader
        document.body.style.overflow = 'hidden'

        const tl = gsap.timeline({
            onComplete: () => {
                setIsLoading(false)
                setIsComplete(true)
                // Restore body scroll
                document.body.style.overflow = ''
                // Remeasure pinned sections for Lenis & ScrollTrigger
                requestAnimationFrame(() => ScrollTrigger.refresh())
            }
        })

        // Initial State
        gsap.set(containerRef.current, { yPercent: 0 })

        // Counter Animation Object
        const progress = { value: 0 }

        // Entrance Animation for Text
        tl.fromTo(textWrapperRef.current,
            {
                y: 45,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.7,
                ease: "power3.out"
            }
        )

            // 1. Count to 100
            .to(progress, {
                value: 100,
                duration: 1.6,
                ease: "power2.inOut",
                onUpdate: () => {
                    if (counterNumberRef.current) {
                        counterNumberRef.current.textContent = Math.round(progress.value).toString()
                    }
                }
            }, "-=0.4")

            // 2. The "Deconstruction" & Break Animation
            .addLabel("breakStart")

            // Bottom Half fractures and drops away
            .to(bottomTextRef.current, {
                y: 80,
                x: 6,
                opacity: 0,
                duration: 0.5,
                ease: "power3.in",
            }, "breakStart")

            // Top Half lifts away
            .to(topTextRef.current, {
                y: -25,
                x: -6,
                opacity: 0,
                duration: 0.5,
                ease: "power2.in",
            }, "breakStart")

            // Fade out the counter
            .to(counterRef.current, {
                opacity: 0,
                y: -15,
                duration: 0.35,
                ease: "power2.in",
            }, "breakStart")

            // Wake up underlying page animations (Hero video & rings) right as break triggers
            .call(() => {
                setIsLoading(false)
            }, [], "breakStart")

            // Let clicks pass through as soon as break begins
            .set(containerRef.current, {
                pointerEvents: "none"
            }, "breakStart")

        // 3. Grid dissolve: every tile vanishes on its own random delay and speed,
        // spread over ~1s so the page appears in scattered patches, not a wave.
        const tiles = gridRef.current
            ? (Array.from(gridRef.current.children) as HTMLElement[])
            : []

        tiles.forEach((tile) => {
            tl.to(tile, {
                opacity: 0,
                duration: gsap.utils.random(0.3, 0.7),
                ease: "power1.inOut",
            }, `breakStart+=${0.3 + gsap.utils.random(0, 1)}`)
        })

        return () => {
            tl.kill()
            document.body.style.overflow = ''
        }
    }, [setIsLoading])

    if (isComplete) return null

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[9999] bg-transparent flex flex-col items-center justify-center text-white overflow-hidden h-[100dvh] w-screen pointer-events-auto"
        >
            {/* The Grid of Boxes */}
            <div
                ref={gridRef}
                className="absolute inset-0 grid grid-cols-6 md:grid-cols-10 w-full h-full pointer-events-none select-none z-0"
                style={{ gridAutoRows: "1fr" }}
            >
                {Array.from({ length: TOTAL_TILES }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-[#050505] w-full h-full relative"
                        style={{
                            margin: "-0.5px",
                            width: "calc(100% + 1px)",
                            height: "calc(100% + 1px)",
                        }}
                    />
                ))}
            </div>

            {/* Main Text Wrapper */}
            <div ref={textWrapperRef} className="relative z-10 pointer-events-none select-none">
                {/* Top Half */}
                <div
                    ref={topTextRef}
                    className="text-4xl sm:text-6xl md:text-9xl font-black font-mont tracking-widest relative z-10 text-white"
                    style={{ clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)" }}
                >
                    BRAVILD
                </div>

                {/* Bottom Half */}
                <div
                    ref={bottomTextRef}
                    className="text-4xl sm:text-6xl md:text-9xl font-black font-mont tracking-widest absolute top-0 left-0 w-full h-full text-white/90"
                    style={{ clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)" }}
                >
                    BRAVILD
                </div>
            </div>

            {/* Counter at Bottom Right */}
            <div
                ref={counterRef}
                className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-10 flex items-end gap-2 overflow-hidden pointer-events-none select-none"
            >
                <span
                    ref={counterNumberRef}
                    className="text-4xl md:text-6xl font-bold font-mont tracking-tighter leading-none text-white"
                >
                    0
                </span>
                <span className="text-sm md:text-lg font-medium text-white/50 mb-1 md:mb-2">%</span>
            </div>
        </div>
    )
}
