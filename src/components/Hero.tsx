"use client"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useHeader } from "./headerContext"

gsap.registerPlugin(ScrollTrigger)

const Hero = () => {
  const shapeRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const polygonRef = useRef<SVGForeignObjectElement>(null)
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 })
  const { setSvgColor } = useHeader()

  useEffect(() => {
    // Set initial color to cream
    setSvgColor("#DFDFF2")

    // Create a scroll event listener for real-time color changes
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      
      // Hero section (0 to 100vh)
      if (scrollY < windowHeight * 0.9) {
        setSvgColor("#DFDFF2") // Cream for hero
      } else {
        setSvgColor("#DFDFF2") // Black for other sections
      }
    }

    // Add scroll listener
    window.addEventListener('scroll', handleScroll)
    
    // Also create ScrollTrigger for more precise control
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      
    }
  }, [setSvgColor])

  useEffect(() => {
    // Get initial dimensions
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    const shape = shapeRef.current
    const text = textRef.current
    const container = containerRef.current
    const foreign = polygonRef.current
    if (!shape || !container || !text || !foreign) return

    const polygon = shape.querySelector("#heroPolygon") as SVGPolygonElement | null
    const clipPolygon = shape.querySelector("#clipPolygon") as SVGPolygonElement | null
    if (!polygon || !clipPolygon) return

    // Set viewBox to actual pixel dimensions
    const { width, height } = dimensions
    shape.setAttribute('viewBox', `0 0 ${width} ${height}`)

    // Update foreignObject to use pixel dimensions
    foreign.setAttribute('width', width.toString())
    foreign.setAttribute('height', height.toString())

    // Set initial polygon points using pixel coordinates
    gsap.set([polygon, clipPolygon], {
      attr: { points: `0,0 ${width},0 ${width},${height} 0,${height}` },
    })

    // Animate with pixel-based coordinates
    gsap.to([polygon, clipPolygon], {
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=600",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress
          
          // Calculate scaling factors from the original 100x100 coordinate system
          const scaleX = width / 100
          const scaleY = height / 100

          if (progress < 0.5) {
            const p = gsap.parseEase("power1.inOut")(progress / 0.5)
            const points = `${p * 15 * scaleX},0 ${width - p * 20 * scaleX},0 ${width - p * 5 * scaleX},${height - p * 10 * scaleY} ${p * 0 * scaleX},${height - p * 5 * scaleY}`
            polygon.setAttribute("points", points)
            clipPolygon.setAttribute("points", points)
          } else {
            const p = (progress - 0.5) / 0.5
            const points = `${(15 + p * 5) * scaleX},0 ${(80 - p * 5) * scaleX},0 ${(95 - p * 5) * scaleX},${(90 + p * 10) * scaleY} ${p * 5 * scaleX},${(95 - p * 10) * scaleY}`
            polygon.setAttribute("points", points)
            clipPolygon.setAttribute("points", points)
          }
        },
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [dimensions])
  
  return (
    <div ref={containerRef} className="relative w-full h-[100vh] ">
      <div className="absolute inset-0 w-full h-full z-0 px-3 ">
        <svg 
          ref={shapeRef} 
          className="w-full h-full" 
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          preserveAspectRatio="none"
        >
          <defs>
            <pattern 
              id="heroImage" 
              patternUnits="userSpaceOnUse" 
              width={dimensions.width} 
              height={dimensions.height}
            >
              <image 
                href="/last.png" 
                x="0" 
                y="0" 
                width={dimensions.width} 
                height={dimensions.height} 
                preserveAspectRatio="none" 
              />
            </pattern>
            <clipPath id="heroClip">
              <polygon 
                id="clipPolygon" 
                points={`0,0 ${dimensions.width},0 ${dimensions.width},${dimensions.height} 0,${dimensions.height}`} 
              />
            </clipPath>
          </defs>

          <polygon
            id="heroPolygon"
            points={`0,0 ${dimensions.width},0 ${dimensions.width},${dimensions.height} 0,${dimensions.height}`}
            fill="url(#heroImage)"
            stroke="rgba(0 ,0,0 ,0)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            filter="url(#heroGlow)"
          />

          <foreignObject 
            ref={polygonRef} 
            x="0" 
            y="0" 
            width={dimensions.width} 
            height={dimensions.height} 
            clipPath="url(#heroClip)"
          >
            <div className="w-full h-full z-0">
              <div className="absolute z-20 w-[30%] h-[70%] top-[12%]">
                <div className="bg-[#ebe9e3] shadow-float relative z-30 py-4 px-6 w-[80%] h-[35%] left-10">
                  <h1 className="font-extrabold tracking-tighter text-lg md:text-xl lg:text-2xl">
                    Design That Moves
                  </h1>
                  <h1 className="font-extrabold tracking-tighter text-lg md:text-xl lg:text-2xl">
                    Code That thinks
                  </h1>
                  <h1 className="font-extrabold text-lg md:text-xl lg:text-2xl">
                    Bravild
                  </h1>
                </div>
                
                <div className="bg-[#ebe9e3] shadow-float relative z-20 p-6 w-[42%] h-[20%] left-2.5 top-[-2%]">
                  <h1 className="tracking-tighter font-medium text-sm md:text-base">
                    AI • ANDROID • WEB
                  </h1>
                </div>
                
                <div className="bg-[#ebe9e3] shadow-float relative z-10 pt-8 w-[35%] h-[20%] left-28 top-[-6%]">
                  <h1 className="tracking-tighter font-medium text-center text-sm md:text-base">
                    Engineered to
                  </h1>
                  <h1 className="tracking-tighter font-medium text-center text-sm md:text-base">
                    obsess
                  </h1>
                </div>
                
                <div className="bg-[#ebe9e3] shadow-float relative z-20 pt-6 w-[30%] h-[20%] left-2.5 top-[-3%]">
                  <h1 className="tracking-tighter font-medium text-center text-sm md:text-base">
                    Where Design
                  </h1>
                  <h1 className="tracking-tighter font-medium text-center text-sm md:text-base">
                    Thinks
                  </h1>
                </div>
                
                <div className="bg-[#ebe9e3] shadow-float relative z-10 pt-9 w-[27%] h-[15%] left-32 top-[-10%]">
                  <h1 className="tracking-tighter font-medium text-center text-sm md:text-base">
                    Let's build
                  </h1>
                </div>
              </div>
              <div className="w-[30%] h-[30%] absolute left-[75%] top-[80%] p-10 -z-[10]">
                <h1 className="text-xl md:text-2xl lg:text-4xl font-black text-[#ebe9e3] tracking-wider">
                  BEYOND DESIGN
                </h1>
                <h1 className="text-xl md:text-2xl lg:text-4xl font-black text-[#ebe9e3] tracking-wider text-center">
                  BEYOND LOGIC
                </h1>
              </div>
            </div>
          </foreignObject>
        </svg>
      </div>

      <div className="w-[43%] h-[20%] absolute left-[26%] top-[48%] z-30 flex justify-between items-center">
        <h1 className="text-black text-4xl md:text-6xl lg:text-7xl font-black tracking-[1rem] md:tracking-[2rem]">
          BRA
        </h1>
        <h1 className="text-[#ebe9e3] text-4xl md:text-6xl lg:text-7xl font-black tracking-[1rem] md:tracking-[2rem]">
          VILD
        </h1>
      </div>
      
      <div ref={textRef} className="w-[30%] h-[30%] absolute left-[75%] top-[80%] p-10 -z-[10]">
        <h1 className="text-xl md:text-2xl lg:text-4xl font-black text-black tracking-wider">
          BEYOND DESIGN
        </h1>
        <h1 className="text-xl md:text-2xl lg:text-4xl font-black text-black tracking-wider text-center">
          BEYOND LOGIC
        </h1>
      </div>
    </div>
  )
}

export default Hero