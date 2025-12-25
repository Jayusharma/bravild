// components/Project.tsx
"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from "@/provider/ThemeContext"

gsap.registerPlugin(ScrollTrigger);

interface Partner {
  name: string
  category: string
  isHeader?: boolean
  hasLogo?: boolean
  description: string
  image: string
  details: string
  projectUrl?: string
}

const partners: Partner[] = [
  {
    name: "OUR PROJECTS",
    category: "HEADER",
    isHeader: true,
    description:
      "A collection of innovative solutions I've built, ranging from automation tools to modern web applications. Each project showcases different aspects of full-stack development and creative problem-solving.",
    image: "/projects_cover.png",
    details: "Building innovative digital solutions",
  },
  {
    name: "WHATSAPP CHATBOT",
    category: "AUTOMATION",
    description:
      "An intelligent WhatsApp chatbot built with n8n automation platform. Features include automated responses, customer support, appointment scheduling, and integration with various business tools for seamless communication.",
    image: "/wa.png",
    details: "AI-Powered Customer Engagement",
    projectUrl: "/projects/whatsapp-chatbot",
  },
  {
    name: "CLIENT PORTAL",
    category: "WEB APP",
    description:
      "A comprehensive client onboarding and management portal. Features include secure file uploads, automated invoice generation, real-time project status updates, and centralized communication.",
    image: "/port2.png",
    details: "Client Management System",
    projectUrl: "/projects/client-portal",
  },
  {
    name: "SALON WEBSITE",
    category: "WEB DESIGN",
    description:
      "A modern, responsive website for a premium salon featuring online booking system, service gallery, stylist profiles, and customer reviews. Built with elegant animations and mobile-first approach.",
    image: "/sal3.png",
    details: "Beauty & Wellness Platform",
    projectUrl: "/projects/salon-website",
  },
  {
    name: "CAR DETAILING SITE",
    category: "WEB DESIGN",
    description:
      "Professional car detailing service website with before/after galleries, service packages, online booking, and pricing calculator. Features stunning visuals and smooth user experience.",
    image: "/lux1.png",
    details: "Automotive Care Services",
    projectUrl: "/projects/car-detailing",
  },
  {
    name: "PHOTOGRAPHY STUDIO",
    category: "WEB DESIGN",
    description:
      "Portfolio website for a photography studio showcasing high-resolution galleries, client testimonials, package options, and contact forms. Optimized for visual storytelling with lazy-loading images.",
    image: "/cine4.png",
    details: "Visual Arts Portfolio",
    projectUrl: "/projects/photography-studio",
  },
  {
    name: "FORM BUILDER",
    category: "WEB APP",
    hasLogo: true,
    description:
      "A dynamic drag-and-drop form builder application allowing users to create custom forms without coding. Features include real-time preview, conditional logic, data validation, and export capabilities.",
    image: "/frm1.png",
    details: "No-Code Form Creation Tool",
    projectUrl: "/projects/form-builder",
  },
  {
    name: "EMAIL AUTOMATION",
    category: "AUTOMATION",
    description:
      "Sophisticated email marketing automation system built with n8n. Includes drip campaigns, personalized templates, A/B testing, analytics dashboard, and CRM integration for targeted outreach.",
    image: "/email.webp",
    details: "Marketing Automation Suite",
    projectUrl: "/projects/email-automation",
  },
]

export default function ProjectGallery() {
  const { theme } = useTheme();
  const [hoveredIndex, setHoveredIndex] = useState<number>(0)
  const [currentContent, setCurrentContent] = useState(partners[0])
  const [expandedMobileIndex, setExpandedMobileIndex] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)


  const imageRef = useRef<HTMLDivElement>(null)
  const descriptionRef = useRef<HTMLDivElement>(null)
  const detailsRef = useRef<HTMLDivElement>(null)

  const buttonRef = useRef<HTMLDivElement>(null)
  const partnersRef = useRef<(HTMLDivElement | null)[]>([])
  const mobileContentRefs = useRef<(HTMLDivElement | null)[]>([])
  const currentTimelineRef = useRef<gsap.core.Timeline | null>(null)
  const partnerAnimationsRef = useRef<gsap.core.Tween[]>([])
  const transitionQueueRef = useRef<number[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)



  // Get theme colors
  const getThemeColors = () => {
    if (theme === 'dark') {
      return {
        bg: '#000000',
        text: '#ffffff',
        textSecondary: '#ffffff',
        accent: '#facc15',
        border: '#1f2937'
      };
    }
    return {
      bg: '#ffffff',
      text: '#000000',
      textSecondary: '#6b7280',
      accent: '#facc15',
      border: '#e5e7eb'
    };
  };

  const colors = getThemeColors();

  // Setup ScrollTrigger for switching back to light theme
  // DISABLED: Keep dark theme after project section
  // useEffect(() => {
  //   const trigger = ScrollTrigger.create({
  //     trigger: transitionTriggerRef.current,
  //     start: 'top center',
  //     onEnter: () => setTheme('light'),
  //     onLeaveBack: () => setTheme('dark')
  //   });

  //   return () => trigger.kill();
  // }, [setTheme]);

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

  const executeTransition = useCallback((targetIndex: number) => {
    setIsTransitioning(true)

    if (currentTimelineRef.current) {
      currentTimelineRef.current.kill()
    }

    partnerAnimationsRef.current.forEach(tween => tween.kill())
    partnerAnimationsRef.current = []

    setHoveredIndex(targetIndex)

    const tl = gsap.timeline({
      onComplete: () => {
        setIsTransitioning(false)

        const queue = transitionQueueRef.current
        if (queue.length > 0) {
          const latestIndex = queue[queue.length - 1]
          transitionQueueRef.current = []

          if (latestIndex !== targetIndex) {
            setTimeout(() => executeTransition(latestIndex), 50)
          }
        }
      }
    })

    tl.to([imageRef.current, descriptionRef.current, detailsRef.current, buttonRef.current], {
      opacity: 0,
      y: -15,
      duration: 0.15,
      ease: "power2.in",
    })
      .call(() => {
        setCurrentContent(partners[targetIndex])
      })
      .to([imageRef.current, descriptionRef.current, detailsRef.current, buttonRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.2,
        ease: "power2.out",
        stagger: 0.05,
      })

    partnersRef.current.forEach((ref, i) => {
      if (ref && !partners[i].isHeader) {
        const partnerName = ref.querySelector('.partner-name')
        if (partnerName) {
          const tween = gsap.to(partnerName, {
            x: i === targetIndex ? 16 : 0,
            color: i === targetIndex ? colors.accent : colors.text,
            duration: 0.2,
            ease: "power2.out",
          })
          partnerAnimationsRef.current.push(tween)
        }
      }
    })

    currentTimelineRef.current = tl
  }, [colors])

  const handleHover = useCallback((index: number) => {
    if (isMobile || index === hoveredIndex) return

    transitionQueueRef.current.push(index)

    if (isTransitioning) {
      return
    }

    executeTransition(index)
  }, [isMobile, hoveredIndex, isTransitioning, executeTransition])

  const handleMouseLeave = useCallback(() => {
    transitionQueueRef.current = []
  }, [])

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
    <div
      id="work"
      ref={sectionRef}
      className=" pt-24 md:pt-[25vh] sm:p-8 px-4 md:px-8"
    >
      <div className="max-w-9xl mx-auto">
        {/* Desktop Layout */}
        <div className="hidden sm:grid lg:grid-cols-2 gap-16 lg:gap-52 items-start">
          {/* Left Section */}
          <div className="space-y-12 sticky top-[10rem] left-20">
            <div ref={imageRef} className="aspect-video bg-[#050505] rounded-lg overflow-hidden max-w-[35vw] relative border border-white/5">
              {currentContent.isHeader ? (
                <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden group">
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)] animate-pulse-slow"></div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                  {/* Minimalist Content */}
                  <div className="relative z-10 text-center space-y-6">
                    <div className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:border-yellow-500/50 transition-colors duration-500">
                      <div className="w-1.5 h-1.5 bg-white rounded-full group-hover:bg-yellow-500 transition-colors duration-500"></div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-4xl md:text-5xl font-thin tracking-tighter text-white mix-blend-difference">
                        Selected<br />
                        <span className="font-bold text-white/10 group-hover:text-white transition-colors duration-700">Works</span>
                      </h3>
                    </div>

                    <div className="flex items-center justify-center gap-4 text-[10px] uppercase tracking-[0.3em] text-white/30">
                      <span>Design</span>
                      <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                      <span>Dev</span>
                      <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                      <span>Create</span>
                    </div>
                  </div>

                  {/* Grid Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"></div>
                </div>
              ) : (
                <Image
                  src={currentContent.image || "/placeholder.svg"}
                  alt={currentContent.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 35vw"
                  className="object-contain bg-black/50 transition-transform duration-300 hover:scale-105"
                  priority={hoveredIndex === 0}
                />
              )}
            </div>

            <div className="space-y-6">
              <div ref={detailsRef}>
                <h3
                  className="text-2xl font-bold mb-2 transition-colors duration-0"
                  style={{ color: colors.accent }}
                >
                  {currentContent.name}
                </h3>
                <p
                  className="text-sm font-medium tracking-wider transition-colors duration-0"
                  style={{ color: colors.textSecondary }}
                >
                  {currentContent.details}
                </p>
              </div>

              <div ref={descriptionRef}>
                <p
                  className="text-lg leading-relaxed transition-colors duration-0"
                  style={{ color: colors.textSecondary }}
                >
                  {currentContent.description}
                </p>
              </div>

              <div ref={buttonRef} className="pt-4 min-h-[68px]">
                {!currentContent.isHeader && currentContent.projectUrl && (
                  <Link href={currentContent.projectUrl}>
                    <button className="group relative px-8 py-4 bg-yellow-400 text-black font-bold text-sm tracking-wider uppercase rounded-lg overflow-hidden transition-all duration-300 hover:bg-yellow-500 hover:shadow-xl hover:shadow-yellow-400/20 hover:scale-105 active:scale-95">
                      <span className="relative z-10 flex items-center gap-3">
                        View Full Details
                        <svg
                          className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="space-y-8" onMouseLeave={handleMouseLeave}>
            {partners.map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="flex items-center group cursor-pointer"
                onMouseEnter={() => handleHover(index)}
                ref={(el) => { partnersRef.current[index] = el }}
              >
                {!partner.isHeader && (
                  <div className="w-16 flex-shrink-0">
                    <span
                      className="text-xs font-medium tracking-wider transition-colors duration-0"
                      style={{ color: colors.textSecondary }}
                    >
                      {partner.category}
                    </span>
                  </div>
                )}

                <div className="flex items-center flex-1">
                  <h2
                    className={`partner-name text-4xl lg:text-5xl xl:text-5xl font-black tracking-tight transition-all duration-300 ease-out ${partner.isHeader ? "" : "hover:text-yellow-400"
                      }`}
                    style={{
                      color: partner.isHeader ? colors.text : (hoveredIndex === index ? colors.accent : colors.text),
                      transitionProperty: 'transform, color',
                      transitionDuration: '0.3s'
                    }}
                  >
                    {partner.name}
                  </h2>

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
        <div className="sm:hidden space-y-1">
          {partners.map((partner, index) => (
            <div key={`mobile-${partner.name}-${index}`} style={{ borderBottom: `1px solid ${colors.border}` }} className="last:border-b-0">
              <div
                className={`flex items-center py-5 px-2 transition-all duration-200 ${!partner.isHeader ? "cursor-pointer active:bg-opacity-5" : "py-6"
                  }`}
                style={{ backgroundColor: !partner.isHeader && expandedMobileIndex === index ? `${colors.text}0D` : 'transparent' }}
                onClick={() => handleMobileClick(index)}
              >
                {!partner.isHeader && (
                  <div className="w-20 flex-shrink-0">
                    <span
                      className="text-[10px] font-semibold tracking-widest uppercase transition-colors duration-0"
                      style={{ color: colors.textSecondary }}
                    >
                      {partner.category}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between flex-1">
                  <h2
                    className={`text-xl sm:text-2xl font-black tracking-tight transition-colors duration-0 ${partner.isHeader ? "text-2xl" : ""
                      }`}
                    style={{ color: partner.isHeader ? colors.text : (expandedMobileIndex === index ? colors.accent : colors.text) }}
                  >
                    {partner.name}
                  </h2>

                  {!partner.isHeader && (
                    <div className="ml-4 flex-shrink-0">
                      <div
                        className={`w-8 h-8 flex items-center justify-center transition-transform duration-300 ${expandedMobileIndex === index ? "rotate-45" : "rotate-0"
                          }`}
                      >
                        <div className="w-5 h-0.5 bg-yellow-400 absolute rounded-full"></div>
                        <div className="w-0.5 h-5 bg-yellow-400 absolute rounded-full"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {!partner.isHeader && (
                <div
                  ref={(el) => { mobileContentRefs.current[index] = el }}
                  className="overflow-hidden"
                  style={{ height: 0, opacity: 0 }}
                >
                  <div className="pb-6 px-2 space-y-4">
                    <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-lg">
                      <Image
                        src={partner.image || "/placeholder.svg"}
                        alt={partner.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-contain bg-black/50"
                        loading="lazy"
                      />
                    </div>

                    <div className="space-y-3">
                      <p
                        className="text-sm font-bold tracking-wider uppercase transition-colors duration-0"
                        style={{ color: colors.accent }}
                      >
                        {partner.details}
                      </p>
                      <p
                        className="text-sm leading-relaxed transition-colors duration-0"
                        style={{ color: colors.textSecondary }}
                      >
                        {partner.description}
                      </p>

                      {partner.projectUrl && (
                        <div className="pt-3">
                          <Link href={partner.projectUrl}>
                            <button className="w-full group relative px-6 py-3 bg-yellow-400 text-black font-bold text-xs tracking-wider uppercase rounded-lg overflow-hidden transition-all duration-300 active:scale-95">
                              <span className="relative z-10 flex items-center justify-center gap-2">
                                View Full Details
                                <svg
                                  className="w-4 h-4 transition-transform duration-300 group-active:translate-x-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                              </span>
                            </button>
                          </Link>
                        </div>
                      )}
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