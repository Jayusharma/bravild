"use client"

import { useCallback, useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useLoader } from "@/provider/LoaderContext"

const TOTAL_TILES = 60

// Timings (ms). Tiles use CSS opacity transitions with a random per-tile delay,
// so the browser animates them on the compositor: no JS work per frame.
const COVER_SPREAD = 120
const COVER_DUR = 190
const REVEAL_WAIT = 70
const REVEAL_SPREAD = 250
const REVEAL_DUR = 260

// Route change transition: the same black grid as the preloader. Tiles fade in
// at random to cover the screen, the route swaps underneath, then tiles fade out
// at random to reveal the new page. About 0.8s end to end.
export default function PageTransition() {
    const router = useRouter()
    const pathname = usePathname()
    const { isLoading } = useLoader()

    const containerRef = useRef<HTMLDivElement>(null)
    const gridRef = useRef<HTMLDivElement>(null)
    const firstRun = useRef(true)
    const covered = useRef(false)
    const navigating = useRef(false)
    const timers = useRef<ReturnType<typeof setTimeout>[]>([])

    const later = (fn: () => void, ms: number) => {
        const t = setTimeout(fn, ms)
        timers.current.push(t)
    }
    const clearTimers = () => {
        timers.current.forEach(clearTimeout)
        timers.current = []
    }

    const paint = (opacity: 0 | 1, spread: number, dur: number) => {
        const tiles = gridRef.current?.children
        if (!tiles) return
        for (let i = 0; i < tiles.length; i++) {
            const el = tiles[i] as HTMLElement
            el.style.transition = spread || dur
                ? `opacity ${dur}ms ease-in-out ${Math.round(Math.random() * spread)}ms`
                : "none"
            el.style.opacity = String(opacity)
        }
    }

    const show = () => {
        const c = containerRef.current
        if (!c) return
        c.style.visibility = "visible"
        c.style.pointerEvents = "auto"
    }
    const hide = () => {
        const c = containerRef.current
        if (!c) return
        c.style.visibility = "hidden"
        c.style.pointerEvents = "none"
        covered.current = false
        navigating.current = false
    }

    const cover = useCallback((onDone: () => void) => {
        clearTimers()
        show()
        covered.current = true
        // reflow so the transition starts from the current (transparent) state
        void containerRef.current?.offsetWidth
        paint(1, COVER_SPREAD, COVER_DUR)
        later(onDone, COVER_SPREAD + COVER_DUR)
    }, [])

    const reveal = useCallback(() => {
        clearTimers()
        show()
        paint(1, 0, 0) // fully covered, no animation
        void containerRef.current?.offsetWidth
        later(() => {
            paint(0, REVEAL_SPREAD, REVEAL_DUR)
            later(hide, REVEAL_SPREAD + REVEAL_DUR + 30)
        }, REVEAL_WAIT)
    }, [])

    // Intercept internal link clicks so the screen is covered *before* navigating
    useEffect(() => {
        if (isLoading) return
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

        const onClick = (e: MouseEvent) => {
            if (e.defaultPrevented || e.button !== 0) return
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
            const a = (e.target as Element | null)?.closest?.("a") as HTMLAnchorElement | null
            if (!a || !a.href) return
            if (a.target && a.target !== "_self") return
            if (a.hasAttribute("download")) return
            const url = new URL(a.href, window.location.href)
            if (url.origin !== window.location.origin) return
            if (url.pathname === window.location.pathname) return // same page / hash scroll

            e.preventDefault()
            e.stopPropagation()
            if (navigating.current) return

            navigating.current = true
            cover(() => router.push(url.pathname + url.search + url.hash))
            // If the route never arrives, don't leave the user behind a black screen
            later(reveal, 4000)
        }

        document.addEventListener("click", onClick, true)
        return () => document.removeEventListener("click", onClick, true)
    }, [isLoading, cover, reveal, router])

    // Route changed: reveal (back/forward and programmatic pushes arrive uncovered)
    useEffect(() => {
        if (firstRun.current) {
            firstRun.current = false
            return
        }
        if (isLoading) return
        navigating.current = true
        covered.current = true
        reveal()
    }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => clearTimers, [])

    return (
        <div
            ref={containerRef}
            aria-hidden
            className="fixed inset-0 z-[9998] h-[100dvh] w-screen invisible pointer-events-none"
            style={{ contain: "strict" }}
        >
            <div
                ref={gridRef}
                className="absolute inset-0 grid grid-cols-6 md:grid-cols-10 w-full h-full select-none"
                style={{ gridAutoRows: "1fr" }}
            >
                {Array.from({ length: TOTAL_TILES }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-[#050505] w-full h-full opacity-0"
                        style={{ margin: "-0.5px", width: "calc(100% + 1px)", height: "calc(100% + 1px)" }}
                    />
                ))}
            </div>
        </div>
    )
}
