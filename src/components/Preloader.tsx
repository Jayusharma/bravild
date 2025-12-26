"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useLoader } from "@/provider/LoaderContext"

export default function Preloader() {
    const containerRef = useRef<HTMLDivElement>(null)
    const counterRef = useRef<HTMLDivElement>(null)
    const topTextRef = useRef<HTMLDivElement>(null)
    const bottomTextRef = useRef<HTMLDivElement>(null)
    const textWrapperRef = useRef<HTMLDivElement>(null)

    const { setIsLoading } = useLoader()
    const [isComplete, setIsComplete] = useState(false)

    useEffect(() => {
        // Lock body scroll to prevent scrollbars
        document.body.style.overflow = 'hidden'

        const tl = gsap.timeline({
            onComplete: () => {
                setIsLoading(false)
                setIsComplete(true)
                // Restore body scroll
                document.body.style.overflow = ''
            }
        })

        // Initial State
        gsap.set(containerRef.current, { yPercent: 0 })

        // Counter Animation Object
        const progress = { value: 0 }

        // Entrance Animation for Text
        tl.fromTo(textWrapperRef.current,
            {
                y: 50,
                x: 50,
                opacity: 0
            },
            {
                y: 0,
                x: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out"
            }
        )

            // 1. Count to 100
            .to(progress, {
                value: 100,
                duration: 2.5,
                ease: "power2.inOut",
                onUpdate: () => {
                    if (counterRef.current) {
                        counterRef.current.textContent = Math.round(progress.value).toString()
                    }
                }
            }, "-=0.5") // Start counting while text is entering

            // 2. The "Deconstruction" Animation
            // Move the bottom half of the text down
            .to(bottomTextRef.current, {
                y: 100,
                opacity: 0,
                duration: 0.8,
                ease: "power3.in",
            }, "-=0.5")

            // 3. Fade out top text and counter
            .to([topTextRef.current, counterRef.current], {
                opacity: 0,
                y: -20,
                duration: 0.5,
                ease: "power2.in",
                delay: 0.1
            })

            // 4. Slide up the curtain
            .to(containerRef.current, {
                yPercent: -100,
                duration: 1.2,
                ease: "power4.inOut"
            })
            .set(containerRef.current, { display: "none" })

        return () => {
            tl.kill()
            document.body.style.overflow = ''
        }
    }, [setIsLoading])

    if (isComplete) return null

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center text-white overflow-hidden h-[100dvh] w-screen"
        >
            {/* Main Text Wrapper */}
            <div ref={textWrapperRef} className="relative">
                {/* Top Half - Stays longer */}
                <div
                    ref={topTextRef}
                    className="text-4xl sm:text-6xl md:text-9xl font-black font-mont tracking-widest relative z-10"
                    style={{ clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)" }}
                >
                    BRAVILD
                </div>

                {/* Bottom Half - Falls away */}
                <div
                    ref={bottomTextRef}
                    className="text-4xl sm:text-6xl md:text-9xl font-black font-mont tracking-widest absolute top-0 left-0 w-full h-full text-white/90"
                    style={{ clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)" }}
                >
                    BRAVILD
                </div>
            </div>

            {/* Counter at Bottom Right - Smaller and Cleaner */}
            <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 flex items-end gap-2 overflow-hidden">
                <span
                    ref={counterRef}
                    className="text-4xl md:text-6xl font-bold font-mont tracking-tighter leading-none text-white"
                >
                    0
                </span>
                <span className="text-sm md:text-lg font-medium text-white/50 mb-1 md:mb-2">%</span>
            </div>

            {/* Background Grid Effect */}
            <div className="absolute inset-0 z-[-1] opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>
    )
}
