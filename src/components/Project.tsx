"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import Image from "next/image"
import { gsap } from "gsap"

interface Partner {
  name: string
  category: string
  isHeader?: boolean
  hasLogo?: boolean
  description: string
  image: string
  details: string
}

const partners: Partner[] = [
  {
    name: "OUR PROJECTS",
    category: "HEADER",
    isHeader: true,
    description:
      "Our backers include top-tier VCs, funds, and companies, providing expertise, network and resources to fuel our project's success.",
    image: "/placeholder.svg?height=400&width=600",
    details: "Building the future together",
  },
  {
    
    name: "YZILABS",
    category: "BACKERS",
    description:
      "YZI Labs is a leading venture capital firm focused on early-stage blockchain and Web3 startups. They provide strategic guidance and technical expertise to help projects scale globally.",
    image: "/placeholder.svg?height=400&width=600&text=YZILABS",
    details: "Blockchain & Web3 Specialists",
  },
  {
    name: "COINBASE VENTURES",
    category: "BACKERS",
    description:
      "Coinbase Ventures is the investment arm of Coinbase, backing the most promising companies building an open financial system. They invest across all stages and geographies.",
    image: "/placeholder.svg?height=400&width=600&text=COINBASE",
    details: "Open Financial System Builders",
  },
  {
    name: "PANTERA CAPITAL",
    category: "BACKERS",
    description:
      "Pantera Capital is the first institutional investment firm focused exclusively on blockchain technology. They manage over $5 billion in digital assets and blockchain investments.",
    image: "/placeholder.svg?height=400&width=600&text=PANTERA",
    details: "Blockchain Investment Pioneers",
  },
  {
    name: "DEFIANCE CAPITAL",
    category: "BACKERS",
    description:
      "Defiance Capital is a multi-strategy investment firm focused on digital assets, DeFi protocols, and NFTs. They provide both capital and strategic support to innovative projects.",
    image: "/placeholder.svg?height=400&width=600&text=DEFIANCE",
    details: "DeFi & Digital Assets Focus",
  },
  {
    name: "ANIMOCA BRANDS",
    category: "BACKERS",
    hasLogo: true,
    description:
      "Animoca Brands is a leader in digital entertainment, blockchain, and gamification. They develop and publish games while advancing digital property rights through NFTs and blockchain.",
    image: "/placeholder.svg?height=400&width=600&text=ANIMOCA",
    details: "Gaming & NFT Innovation",
  },
  {
    name: "SKYVISION CAPITAL",
    category: "BACKERS",
    description:
      "SkyVision Capital focuses on early-stage investments in emerging technologies, particularly in blockchain, AI, and fintech sectors with global expansion potential.",
    image: "/placeholder.svg?height=400&width=600&text=SKYVISION",
    details: "Emerging Tech Investments",
  },
  {
    name: "PLAY VENTURE",
    category: "BACKERS",
    description:
      "Play Venture invests in gaming, entertainment, and interactive media companies. They support innovative studios and platforms that are reshaping digital entertainment.",
    image: "/placeholder.svg?height=400&width=600&text=PLAY",
    details: "Gaming & Entertainment Focus",
  },
  {
    name: "VESSEL CAPITAL",
    category: "BACKERS",
    description:
      "Vessel Capital is a venture capital firm specializing in seed and early-stage investments in technology companies, with a focus on sustainable and impactful innovations.",
    image: "/placeholder.svg?height=400&width=600&text=VESSEL",
    details: "Sustainable Tech Ventures",
  },
  {
    name: "ARCHE FUND",
    category: "BACKERS",
    description:
      "Arche Fund is a crypto-native investment fund that backs ambitious founders building the next generation of decentralized applications and infrastructure.",
    image: "/placeholder.svg?height=400&width=600&text=ARCHE",
    details: "Decentralized Infrastructure",
  },
  {
    name: "MARBLEX",
    category: "GAMING",
    description:
      "Marblex is a blockchain gaming platform that creates and publishes Web3 games. They focus on creating sustainable gaming ecosystems with player-owned economies.",
    image: "/placeholder.svg?height=400&width=600&text=MARBLEX",
    details: "Web3 Gaming Platform",
  },
  {
    name: "FNATIC",
    category: "GAMING",
    description:
      "Fnatic is a leading esports organization with championship teams across multiple games. They're expanding into Web3 gaming and digital collectibles.",
    image: "/placeholder.svg?height=400&width=600&text=FNATIC",
    details: "Esports Champions",
  },
]

export default function ProjectGallery() {
  const [hoveredIndex, setHoveredIndex] = useState<number>(0)
  const [currentContent, setCurrentContent] = useState(partners[0])
  const [expandedMobileIndex, setExpandedMobileIndex] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [pendingIndex, setPendingIndex] = useState<number | null>(null)

  const imageRef = useRef<HTMLDivElement>(null)
  const descriptionRef = useRef<HTMLDivElement>(null)
  const detailsRef = useRef<HTMLDivElement>(null)
  const partnersRef = useRef<(HTMLDivElement | null)[]>([])
  const mobileContentRefs = useRef<(HTMLDivElement | null)[]>([])
  const currentTimelineRef = useRef<gsap.core.Timeline | null>(null)
  const partnerAnimationsRef = useRef<gsap.core.Tween[]>([])
  const transitionQueueRef = useRef<number[]>([])

  // Memoize non-header partners for better performance
  const nonHeaderPartners = useMemo(() => 
    partners.filter(partner => !partner.isHeader), 
    []
  )

  // Handle window resize with debouncing
  useEffect(() => {
    let resizeTimer: NodeJS.Timeout

    const checkMobile = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        setIsMobile(window.innerWidth < 640)
      }, 100)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
      clearTimeout(resizeTimer)
    }
  }, [])

  // Initial desktop animations
  useEffect(() => {
    if (!isMobile && imageRef.current && descriptionRef.current) {
      gsap.fromTo(
        imageRef.current, 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      )
      gsap.fromTo(
        descriptionRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power2.out" }
      )
    }
  }, [isMobile])

  // Optimized hover handler with proper transition state management
  const handleHover = useCallback((index: number) => {
    if (isMobile || index === hoveredIndex) return

    // Add to transition queue
    transitionQueueRef.current.push(index)
    
    // If already transitioning, just update the pending index
    if (isTransitioning) {
      setPendingIndex(index)
      return
    }

    // Start the transition
    executeTransition(index)
  }, [isMobile, hoveredIndex, isTransitioning])

  // Execute transition with proper cleanup and priority handling
  const executeTransition = useCallback((targetIndex: number) => {
    setIsTransitioning(true)
    setPendingIndex(null)
    
    // Clear any existing animations immediately
    if (currentTimelineRef.current) {
      currentTimelineRef.current.kill()
    }
    
    // Kill all partner animations
    partnerAnimationsRef.current.forEach(tween => tween.kill())
    partnerAnimationsRef.current = []

    // Immediate state update for responsiveness
    setHoveredIndex(targetIndex)

    // Fast transition - prioritize speed over smoothness for rapid hovers
    const tl = gsap.timeline({
      onComplete: () => {
        setIsTransitioning(false)
        
        // Check if there's a pending transition
        const queue = transitionQueueRef.current
        if (queue.length > 0) {
          // Get the latest index from queue and clear it
          const latestIndex = queue[queue.length - 1]
          transitionQueueRef.current = []
          
          if (latestIndex !== targetIndex) {
            // Small delay to prevent immediate retrigger
            setTimeout(() => executeTransition(latestIndex), 50)
          }
        }
      }
    })

    // Faster animation for better responsiveness
    tl.to([imageRef.current, descriptionRef.current, detailsRef.current], {
      opacity: 0,
      y: -15,
      duration: 0.15,
      ease: "power2.in",
    })
    .call(() => {
      setCurrentContent(partners[targetIndex])
    })
    .to([imageRef.current, descriptionRef.current, detailsRef.current], {
      opacity: 1,
      y: 0,
      duration: 0.2,
      ease: "power2.out",
      stagger: 0.05,
    })

    // Animate partner text with immediate updates
    partnersRef.current.forEach((ref, i) => {
      if (ref && !partners[i].isHeader) {
        const partnerName = ref.querySelector('.partner-name')
        if (partnerName) {
          const tween = gsap.to(partnerName, {
            x: i === targetIndex ? 16 : 0,
            color: i === targetIndex ? "#facc15" : "#ffffff",
            duration: 0.2,
            ease: "power2.out",
          })
          partnerAnimationsRef.current.push(tween)
        }
      }
    })

    currentTimelineRef.current = tl
  }, [])

  // Handle mouse leave to clear queue
  const handleMouseLeave = useCallback(() => {
    // Clear the transition queue when mouse leaves the partners section
    transitionQueueRef.current = []
    setPendingIndex(null)
  }, [])

  // Optimized mobile click handler
  const handleMobileClick = useCallback((index: number) => {
    if (!isMobile || partners[index].isHeader) return

    const isCurrentlyExpanded = expandedMobileIndex === index
    const contentRef = mobileContentRefs.current[index]

    if (!contentRef) return

    if (isCurrentlyExpanded) {
      gsap.to(contentRef, {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => setExpandedMobileIndex(null),
      })
    } else {
      // Close currently expanded content
      if (expandedMobileIndex !== null) {
        const prevContentRef = mobileContentRefs.current[expandedMobileIndex]
        if (prevContentRef) {
          gsap.to(prevContentRef, {
            height: 0,
            opacity: 0,
            duration: 0.3,
            ease: "power2.inOut",
          })
        }
      }

      setExpandedMobileIndex(index)

      // Animate new content
      gsap.set(contentRef, { height: "auto", opacity: 0 })
      const autoHeight = contentRef.scrollHeight
      gsap.set(contentRef, { height: 0 })

      gsap.to(contentRef, {
        height: autoHeight,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
        delay: expandedMobileIndex !== null ? 0.3 : 0,
      })
    }
  }, [isMobile, expandedMobileIndex])

  // Cleanup function
  useEffect(() => {
    return () => {
      if (currentTimelineRef.current) {
        currentTimelineRef.current.kill()
      }
      partnerAnimationsRef.current.forEach(tween => tween.kill())
      transitionQueueRef.current = []
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white pt-[110vh]  md:pt-[25vh] sm:p-8  mt-[20vh] md:mt-0">
      <div className="max-w-9xl mx-auto ">
        {/* Desktop Layout */}
        <div className="hidden sm:grid lg:grid-cols-2 gap-16  lg:gap-52 items-start">
          {/* Left Section - Dynamic Content */}
          <div className="space-y-12 sticky top-[10rem] left-20 ">
            {/* Image Section */}
            <div ref={imageRef} className="aspect-video bg-gray-900 rounded-lg overflow-hidden max-w-[35vw]">
              <Image
                src={currentContent.image || "/placeholder.svg"}
                alt={currentContent.name}
                width={600}
                height={400}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                priority={hoveredIndex === 0}
              />
            </div>

            {/* Content Details */}
            <div className="space-y-6">
              <div ref={detailsRef}>
                <h3 className="text-2xl font-bold text-yellow-400 mb-2">{currentContent.name}</h3>
                <p className="text-gray-400 text-sm font-medium tracking-wider">{currentContent.details}</p>
              </div>

              <div ref={descriptionRef}>
                <p className="text-gray-300 text-lg leading-relaxed">{currentContent.description}</p>
              </div>
            </div>
          </div>

          {/* Right Section - Partners List */}
          <div className="space-y-8 " onMouseLeave={handleMouseLeave}>
            {partners.map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="flex items-center group cursor-pointer"
                onMouseEnter={() => handleHover(index)}
                ref={(el) => { partnersRef.current[index] = el }}
              >
                {/* Category Label */}
                {!partner.isHeader && (
                  <div className="w-16 flex-shrink-0">
                    <span className="text-xs text-gray-500 font-medium tracking-wider">{partner.category}</span>
                  </div>
                )}

                {/* Partner Name */}
                <div className="flex items-center flex-1">
                  <h2
                    className={`partner-name text-4xl lg:text-5xl xl:text-5xl font-black tracking-tight transition-all duration-300 ease-out ${
                      partner.isHeader ? "text-white" : "text-white hover:text-yellow-400"
                    }`}
                  >
                    {partner.name}
                  </h2>

                  {/* Logo placeholder for partners with logos */}
                  {partner.hasLogo && hoveredIndex === index && (
                    <div className="ml-8 animate-fade-in">
                      <div className="w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center shadow-lg">
                        <span className="text-black font-bold text-sm">LOGO</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="sm:hidden space-y-2">
          {partners.map((partner, index) => (
            <div key={`mobile-${partner.name}-${index}`} className="border-b border-gray-800 last:border-b-0">
              {/* Partner Header */}
              <div
                className={`flex items-center py-4 transition-colors duration-200 ${
                  !partner.isHeader ? "cursor-pointer hover:bg-gray-900/30" : ""
                }`}
                onClick={() => handleMobileClick(index)}
              >
                {/* Category Label */}
                {!partner.isHeader && (
                  <div className="w-12 flex-shrink-0">
                    <span className="text-xs text-gray-500 font-medium tracking-wider">{partner.category}</span>
                  </div>
                )}

                {/* Partner Name */}
                <div className="flex items-center justify-between flex-1">
                  <h2
                    className={`text-2xl sm:text-3xl font-black tracking-tight transition-colors duration-300 ${
                      partner.isHeader ? "text-white" : expandedMobileIndex === index ? "text-yellow-400" : "text-white"
                    }`}
                  >
                    {partner.name}
                  </h2>

                  {/* Expand/Collapse Indicator */}
                  {!partner.isHeader && (
                    <div className="ml-4">
                      <div
                        className={`w-6 h-6 flex items-center justify-center transition-transform duration-300 ${
                          expandedMobileIndex === index ? "rotate-45" : "rotate-0"
                        }`}
                      >
                        <div className="w-4 h-0.5 bg-yellow-400 absolute"></div>
                        <div className="w-0.5 h-4 bg-yellow-400 absolute"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Expandable Content */}
              {!partner.isHeader && (
                <div
                  ref={(el) => { mobileContentRefs.current[index] = el }}
                  className="overflow-hidden"
                  style={{ height: 0, opacity: 0 }}
                >
                  <div className="pb-6 space-y-4">
                    {/* Image */}
                    <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                      <Image
                        src={partner.image || "/placeholder.svg"}
                        alt={partner.name}
                        width={600}
                        height={300}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Details */}
                    <div className="space-y-3">
                      <p className="text-gray-400 text-sm font-medium tracking-wider">{partner.details}</p>
                      <p className="text-gray-300 text-base leading-relaxed">{partner.description}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}