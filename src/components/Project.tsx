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
      "A collection of innovative solutions we've built, ranging from automation engines to full-scale SaaS applications. Each system is designed to remove human overhead and establish high-speed automated growth.",
    image: "/projects_cover.png",
    details: "Building systems that scale",
  },
  {
    name: "BRAVI-AI",
    category: "AI SAAS",
    description:
      "An intelligent, unified inbox connecting WhatsApp, Email, Instagram, and more. Features automated AI responses, real-time agent chats, and custom system pipelines for multi-channel communication.",
    image: "/ai.png",
    details: "AI Unified Inbox Platform",
    projectUrl: "/projects/bravi-ai",
  },
  {
    name: "ACCURIZON",
    category: "WEB APP",
    description:
      "A premium bookkeeping and financial intelligence platform. Features expense automation, balance sheet pipelines, and real-time tax accounting strategy for modern business operations.",
    image: "/website.png",
    details: "Automated Bookkeeping Platform",
    projectUrl: "/projects/accurizon",
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
    description:
      "A dynamic drag-and-drop form builder application allowing users to create custom forms without coding. Features include real-time preview, conditional logic, data validation, and export capabilities.",
    image: "/frm1.png",
    details: "No-Code Form Creation Tool",
    projectUrl: "/projects/form-builder",
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
    name: "EMAIL AUTOMATION",
    category: "AUTOMATION",
    description:
      "Sophisticated email marketing automation system built with n8n. Includes drip campaigns, personalized templates, A/B testing, analytics dashboard, and CRM integration for targeted outreach.",
    image: "/email.webp",
    details: "Marketing Automation Suite",
    projectUrl: "/projects/email-automation",
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



  // Site palette — ink on lavender, or white on black; hierarchy via opacity
  const getThemeColors = () => {
    if (theme === 'dark') {
      return {
        text: '#ffffff',
        textSecondary: 'rgba(255,255,255,0.6)',
        border: 'rgba(255,255,255,0.14)'
      };
    }
    return {
      text: '#1d1d20',
      textSecondary: 'rgba(29,29,32,0.62)',
      border: 'rgba(29,29,32,0.14)'
    };
  };

  const colors = getThemeColors();
  const isDark = theme === 'dark';
  const projectCount = String(partners.filter(p => !p.isHeader).length).padStart(2, '0');

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



    currentTimelineRef.current = tl
  }, [])

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
    if (partners[index].isHeader) return

    const isCurrentlyExpanded = expandedMobileIndex === index
    const contentRef = mobileContentRefs.current[index] || document.getElementById(`mobile-content-${index}`)

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
        const prevContentRef = mobileContentRefs.current[expandedMobileIndex] || document.getElementById(`mobile-content-${expandedMobileIndex}`)
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
  }, [expandedMobileIndex])

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
            <div ref={imageRef} className="aspect-video bg-[#050505] overflow-hidden max-w-[35vw] relative border border-white/5">
              {currentContent.isHeader ? (
                <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
                  {/* Grid overlay — quiet, instrument-like */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"></div>

                  <div className="relative z-10 text-center">
                    {/* The site's square — slowly working, like the machine core */}
                    <div className="w-2.5 h-2.5 bg-white mx-auto mb-7 animate-slow-spin"></div>

                    <h3 className="text-4xl md:text-5xl font-black font-mont tracking-tight text-white leading-[0.95]">
                      SELECTED<br />WORKS
                    </h3>

                    <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40 mt-6">
                      {projectCount} systems — live
                    </p>
                  </div>
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
                  className="text-2xl font-bold font-mont tracking-tight mb-2 transition-colors duration-0"
                  style={{ color: colors.text }}
                >
                  {currentContent.name}
                </h3>
                <p
                  className="font-mono text-[11px] tracking-[0.25em] uppercase transition-colors duration-0"
                  style={{ color: colors.textSecondary }}
                >
                  {currentContent.details}
                </p>
              </div>

              <div ref={descriptionRef}>
                <p
                  className="text-base lg:text-lg font-serif font-light leading-[1.8] max-w-[520px] transition-colors duration-0"
                  style={{ color: colors.textSecondary }}
                >
                  {currentContent.description}
                </p>
              </div>

              <div ref={buttonRef} className="pt-4 min-h-[68px]">
                {!currentContent.isHeader && currentContent.projectUrl && (
                  <Link href={currentContent.projectUrl}>
                    <button
                      className={`group px-10 py-4 border text-[12px] tracking-[0.25em] font-mont uppercase transition-all duration-300 ${
                        isDark
                          ? 'border-white text-white hover:bg-white hover:text-black'
                          : 'border-[#1d1d20] text-[#1d1d20] hover:bg-[#1d1d20] hover:text-[#dfdff2]'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        View Full Details
                        <svg
                          className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="space-y-4 lg:space-y-5 xl:space-y-5.5" onMouseLeave={handleMouseLeave}>
            {partners.map((partner, index) => {
              const isHeader = partner.isHeader
              const isHovered = hoveredIndex === index
              const hasActiveSelection = hoveredIndex > 0 // index 0 is the header

              return (
                <div
                  key={`${partner.name}-${index}`}
                  className={`flex items-center group cursor-pointer transition-all duration-300 ease-out
                    ${isHeader ? 'opacity-100' : (hasActiveSelection ? (isHovered ? 'opacity-100 translate-x-3' : 'opacity-80') : 'opacity-85')}`}
                  onMouseEnter={() => handleHover(index)}
                  ref={(el) => { partnersRef.current[index] = el }}
                >
                  {!isHeader && (
                    <div className="w-28 flex-shrink-0">
                      <span
                        className={`font-mono text-[10px] lg:text-[11px] tracking-[0.2em] uppercase transition-colors duration-300
                          ${isHovered ? 'text-[#facc15]' : 'text-white/40'}`}
                      >
                        {partner.category}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center flex-1">
                    <h2
                      className={`partner-name text-xl md:text-2.5xl lg:text-3xl xl:text-[2.15rem] font-black tracking-tight transition-colors duration-300
                        ${isHeader ? 'text-white' : (isHovered ? 'text-[#facc15]' : 'text-white')}`}
                    >
                      {partner.name}
                    </h2>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="sm:hidden space-y-1">
          {partners.map((partner, index) => {
            const isExpanded = expandedMobileIndex === index
            const isDimmed = expandedMobileIndex !== null && expandedMobileIndex !== index

            return (
              <div key={`mobile-${partner.name}-${index}`} style={{ borderBottom: `1px solid ${colors.border}` }} className="last:border-b-0">
                <div
                  className={`flex items-center py-5 px-2 transition-all duration-200 relative z-10 ${!partner.isHeader ? "cursor-pointer active:bg-opacity-5" : "py-6"
                    }`}
                  style={{ backgroundColor: !partner.isHeader && isExpanded ? `${colors.text}0D` : 'transparent' }}
                  onClick={() => handleMobileClick(index)}
                >
                  {!partner.isHeader && (
                    <div className="w-20 flex-shrink-0">
                      <span
                        className={`font-mono text-[10px] tracking-[0.2em] uppercase transition-colors duration-300
                          ${isExpanded ? 'text-[#facc15]' : 'text-white/40'}`}
                      >
                        {partner.category}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between flex-1">
                    <h2
                      className={`text-xl sm:text-2xl font-black font-mont tracking-tight transition-all duration-300
                        ${!partner.isHeader && isDimmed ? "opacity-40" : "opacity-100"}`}
                      style={{ color: !partner.isHeader && isExpanded ? '#facc15' : colors.text }}
                    >
                      {partner.name}
                    </h2>

                    {!partner.isHeader && (
                      <div className="ml-4 flex-shrink-0">
                        <div
                          className={`w-8 h-8 flex items-center justify-center transition-transform duration-300 ${isExpanded ? "rotate-45" : "rotate-0"
                            }`}
                        >
                          <div className="w-5 h-0.5 absolute transition-colors duration-300" style={{ backgroundColor: isExpanded ? '#facc15' : colors.text }}></div>
                          <div className="w-0.5 h-5 absolute transition-colors duration-300" style={{ backgroundColor: isExpanded ? '#facc15' : colors.text }}></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              {!partner.isHeader && (
                <div
                  id={`mobile-content-${index}`}
                  ref={(el) => { mobileContentRefs.current[index] = el }}
                  className="overflow-hidden"
                  style={{ height: 0, opacity: 0 }}
                >
                  <div className="pb-6 px-2 space-y-4 pt-4">
                    <div className="relative w-full aspect-video bg-[#050505] overflow-hidden">
                      <Image
                        src={partner.image || "/placeholder.svg"}
                        alt={partner.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>

                    <div className="space-y-3">
                      <p
                        className="font-mono text-[11px] tracking-[0.25em] uppercase transition-colors duration-0"
                        style={{ color: colors.textSecondary }}
                      >
                        {partner.details}
                      </p>
                      <p
                        className="text-sm font-serif font-light leading-[1.7] transition-colors duration-0"
                        style={{ color: colors.textSecondary }}
                      >
                        {partner.description}
                      </p>

                      {partner.projectUrl && (
                        <div className="pt-3">
                          <Link href={partner.projectUrl}>
                            <button
                              className={`w-full group px-6 py-4 border text-[11px] tracking-[0.25em] font-mont uppercase transition-all duration-300 active:scale-[0.98] ${
                                theme === 'dark'
                                  ? 'border-white text-white active:bg-white active:text-black'
                                  : 'border-[#1d1d20] text-[#1d1d20] active:bg-[#1d1d20] active:text-[#dfdff2]'
                              }`}
                            >
                              <span className="flex items-center justify-center gap-2">
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
          )
        })}


        </div>
      </div>

      <style jsx>{`
        @keyframes slow-spin {
          to {
            transform: rotate(360deg);
          }
        }

        .animate-slow-spin {
          animation: slow-spin 9s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-slow-spin {
            animation: none;
            transform: rotate(45deg);
          }
        }
      `}</style>
    </div>
  )
}