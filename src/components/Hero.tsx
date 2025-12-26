"use client"
import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { VisualMixText } from "./ui/blur"


gsap.registerPlugin(ScrollTrigger)

import { useLoader } from "@/provider/LoaderContext"

const Hero = () => {
  const { isLoading } = useLoader()
  const shapeRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const polygonRef = useRef<SVGForeignObjectElement>(null)
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 })
  const sideRef = useRef<HTMLVideoElement>(null)
  const ringRef1 = useRef<HTMLDivElement>(null)
  const ringRef2 = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)
  const BudRef = useRef<HTMLDivElement>(null)
  const DisRef1 = useRef<HTMLDivElement>(null)
  const DisRef2 = useRef<HTMLDivElement>(null)

  // Refs to store intervals and animations for cleanup
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const animationsInitialized = useRef(false)

  const [mounted, setMounted] = useState(false)

  // Memoized dimension update callback
  const updateDimensions = useCallback(() => {
    const newWidth = window.innerWidth
    const newHeight = window.innerHeight

    setDimensions(prev => {
      // Always update if width changes (orientation change or desktop resize)
      if (prev.width !== newWidth) {
        return { width: newWidth, height: newHeight }
      }

      // If width hasn't changed, check if we're on desktop
      // On mobile/tablet (<1024px), ignore height-only changes to prevent address bar jitter
      if (newWidth >= 1024) {
        if (prev.height !== newHeight) {
          return { width: newWidth, height: newHeight }
        }
      }

      return prev
    })
  }, [])

  // Debounced resize handler
  const debouncedUpdateDimensions = useMemo(() => {
    let timeoutId: NodeJS.Timeout
    return () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(updateDimensions, 100)
    }
  }, [updateDimensions])

  useEffect(() => {
    updateDimensions()
    setMounted(true)
    window.addEventListener('resize', debouncedUpdateDimensions, { passive: true })
    return () => {
      window.removeEventListener('resize', debouncedUpdateDimensions)
    }
  }, [debouncedUpdateDimensions, updateDimensions])

  // Control Video Playback
  useEffect(() => {
    if (sideRef.current) {
      if (isLoading) {
        sideRef.current.pause()
        sideRef.current.currentTime = 0
      } else {
        sideRef.current.play().catch(() => {
          // Handle autoplay restrictions if needed
        })
      }
    }
  }, [isLoading])

  // Initialize animations only once AFTER loading
  useEffect(() => {
    if (isLoading || animationsInitialized.current || !textRef.current) return

    const text = textRef.current.querySelectorAll('h1')

    const tl2 = gsap.timeline()
    tl2.fromTo(
      [ringRef1.current, ringRef2.current],
      { scale: 0.3, opacity: 0 },
      {
        scale: 1.2,
        opacity: 1,
        duration: 3.5,
        ease: "power2.out",
      }
    )
    tl2.fromTo(
      circleRef.current,
      { scale: 0.3, opacity: 0 },
      {
        scale: 1.2,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      }, "-=0.5"
    )
    tl2.fromTo(
      BudRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      }
    )



    gsap.fromTo(
      text,
      { x: 150, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.5,
        stagger: 0.3,
        ease: "power2.out",
      }
    )

    const tl3 = gsap.timeline()
    tl3.fromTo(DisRef1.current, {
      x: -150,
      opacity: 0
    }, {
      x: 0,
      opacity: 1,
      duration: 1,
      ease: "power4.out",
    })
    tl3.fromTo(DisRef2.current, {
      x: -150,
      opacity: 0
    }, {
      x: 0,
      opacity: 1, // Fixed: was opacity: 4
      duration: 1,
      ease: "power2.out",
    }, "-=0.5")

    animationsInitialized.current = true
  }, [isLoading])

  // Separate effect for dimension-dependent animations
  useEffect(() => {
    const shape = shapeRef.current
    const container = containerRef.current
    const foreign = polygonRef.current
    const side = sideRef.current

    if (!shape || !container || !foreign || !side) return

    const clipPolygon = shape.querySelector("#clipPolygon") as SVGPolygonElement | null
    if (!clipPolygon) return

    // Set viewBox to actual pixel dimensions
    const { width, height } = dimensions
    shape.setAttribute('viewBox', `0 0 ${width} ${height}`)

    // Update foreignObject to use pixel dimensions
    foreign.setAttribute('width', width.toString())
    foreign.setAttribute('height', height.toString())

    // Set initial polygon points using pixel coordinates
    gsap.set(clipPolygon, {
      attr: { points: `0,0 ${width},0 ${width},${height} 0,${height}` },
    })

    // Clear previous interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Optimize image scaling animation using requestAnimationFrame instead of setInterval


    // Cache scale calculations
    const scaleX = width / 100
    const scaleY = height / 100

    // Animate with pixel-based coordinates
    const ctx = gsap.context(() => {
      gsap.to(clipPolygon, {
        scrollTrigger: {
          id: 'hero-polygon',
          trigger: container,
          start: "top top",
          end: "+=600",
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress

            if (progress < 0.5) {
              const p = gsap.parseEase("power1.inOut")(progress / 0.5)
              const points = `${p * 15 * scaleX},0 ${width - p * 20 * scaleX},0 ${width - p * 5 * scaleX},${height - p * 10 * scaleY} ${p * 0 * scaleX},${height - p * 5 * scaleY}`
              clipPolygon.setAttribute("points", points)
            } else {
              const p = (progress - 0.5) / 0.5
              const points = `${(15 + p * 5) * scaleX},0 ${(80 - p * 5) * scaleX},0 ${(95 - p * 5) * scaleX},${(90 + p * 10) * scaleY} ${p * 5 * scaleX},${(95 - p * 10) * scaleY}`
              clipPolygon.setAttribute("points", points)
            }
          },
        },
      })
    }, container)
    return () => {
      // Clean up interval and scroll triggers
      if (intervalRef.current) {
        if (typeof intervalRef.current === 'number') {
          cancelAnimationFrame(intervalRef.current)
        } else {
          clearInterval(intervalRef.current)
        }
        intervalRef.current = null
      }
      ctx.revert()
    }
  }, [dimensions])

  // Memoized viewBox string to prevent unnecessary re-renders
  const viewBox = useMemo(() => `0 0 ${dimensions.width} ${dimensions.height}`, [dimensions.width, dimensions.height])
  const initialPoints = useMemo(() => `0,0 ${dimensions.width},0 ${dimensions.width},${dimensions.height} 0,${dimensions.height}`, [dimensions.width, dimensions.height])

  return (
    <div ref={containerRef} className="relative w-full h-[100vh]">
      <div className={`absolute inset-0 w-full h-full z-10 transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <svg
          ref={shapeRef}
          className="w-full h-full"
          viewBox={viewBox}
          preserveAspectRatio="none"
        >
          <defs>
            <clipPath id="heroClip">
              <polygon
                id="clipPolygon"
                points={initialPoints}
              />
            </clipPath>
          </defs>

          {/* Image background */}
          <foreignObject
            x="0"
            y="0"
            width={dimensions.width}
            height={dimensions.height}
            clipPath="url(#heroClip)"
          >
            <video
              ref={sideRef}
              src="/last.mp4"
              autoPlay={false}
              preload="auto"
              playsInline
              muted
              style={{
                width: '100%',
                height: dimensions.width < 768 ? '100%' : '120%',
                objectFit: "cover",
                willChange: "transform",
                filter: "brightness(1.1) contrast(1.1) saturate(1)",
              }}
            />
          </foreignObject>

          <foreignObject
            ref={polygonRef}
            x="0"
            y="0"
            width={dimensions.width}
            height={dimensions.height}
            clipPath="url(#heroClip)"
          >
            <div className="w-full h-full z-0">
              <div
                ref={ringRef1}
                className="hidden md:block absolute top-1/2 md:top-[60%] left-1/2 w-[60vw] h-[60vw] md:w-[30vw] md:h-[30vw] border-x border-white/30 rounded-full pointer-events-none opacity-0"
                style={{ transform: "translate(-50%, -50%)" }}
              />
              <div
                ref={ringRef2}
                className="hidden md:block absolute top-1/2 md:top-[60%] left-1/2 w-[85vw] h-[85vw] md:w-[50vw] md:h-[50vw] border-x border-x-white/50 rounded-full pointer-events-none opacity-0"
                style={{ transform: "translate(-50%, -50%)" }}
              />

              <div ref={textRef} className="absolute right-4 bottom-12  md:right-7 md:bottom-2 z-20 font-mont text-right md:text-right">
                <h1 className="text-3xl md:text-2xl lg:text-[2.5rem] font-bold text-white leading-tight md:leading-[0.8]">
                  BEYOND DESIGN
                </h1>
                <h1 className="text-3xl md:text-2xl lg:text-[2.5rem] font-bold text-white leading-tight ">
                  BEYOND LOGIC
                </h1>
              </div>


            </div>
          </foreignObject>
        </svg>
      </div>

      <div className="absolute left-6 top-24 md:left-[12%] md:top-[30%] tracking-widest text-[#c9c9c9] font-bold font-rayl uppercase z-30">
        <h1 ref={DisRef1} className="text-sm md:text-2xl">Disrupting the familiar</h1>
        <VisualMixText key={isLoading ? 'loading' : 'loaded'} ref={DisRef2} className="text-[1.3rem] md:text-4xl font-mont">Forward-Thinker</VisualMixText>
      </div>

      <div ref={BudRef} className="absolute left-[73%] top-[41%] md:left-[68%] md:top-[45%] text-right md:text-left text-sm md:text-2xl tracking-widest text-[#c9c9c9] font-bold font-rayl uppercase z-30">
        Building the <br /> unseen
      </div>

      <div ref={circleRef} className="size-4 md:size-6 bg-white/70 absolute top-[41%] right-[28%] md:top-[46%] md:left-[66.3%] rounded-full z-20" />

      <div className="absolute right-4 bottom-12  md:right-7 md:bottom-2 z-0 font-mont text-right md:text-right">
        <h1 className="text-3xl md:text-2xl lg:text-[2.5rem] font-bold text-black leading-tight md:leading-[0.8]">
          BEYOND DESIGN
        </h1>
        <h1 className="text-3xl md:text-2xl lg:text-[2.5rem] font-bold text-black leading-tight">
          BEYOND LOGIC
        </h1>
      </div>
    </div>
  )
}

export default Hero