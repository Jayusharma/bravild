"use client"

import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Link from 'next/link'

gsap.registerPlugin(ScrollTrigger)

function renderFormattedText(text: string) {
  if (!text) return null
  return text.replace(/\*\*/g, '')
}

function parseImpact(item: string) {
  const match = item.match(/^([\d%+-]+\b|Zero|Faster)\s*(.*)$/i)
  if (match) {
    return { num: match[1], desc: match[2] }
  }
  const spaceIndex = item.indexOf(' ')
  if (spaceIndex > 0) {
    return { num: item.substring(0, spaceIndex), desc: item.substring(spaceIndex + 1) }
  }
  return { num: '', desc: item }
}

// Project data - each project has its own details
const projectsData = {
  "bravi-ai": {
    name: "Bravi-AI",
    tagline: "AI Unified Inbox Platform",
    category: "AI SAAS",
    date: "January 2025",
    duration: "10 weeks",
    status: "Production Live",
    description: "An **intelligent, unified communications inbox** connecting WhatsApp, Email, Instagram, and more, equipped with automated AI responses, chat, and smart data infrastructure.",
    challenge: "Businesses struggled to manage customer messages across multiple platforms, causing delays and lost sales. They needed a **single unified dashboard** that could automate basic conversations while organizing multi-channel client inquiries.",
    solution: "Built a **robust Next.js and Node.js central inbox** platform integrating OpenAI agents, Twilio APIs, and Meta Messenger APIs. The system features real-time agent routing, AI-generated suggestion replies, and visual messaging analytics.",
    impact: [
      "99% multi-channel message sync",
      "70% automated AI answer rate",
      "5x faster response execution",
      "24/7 autonomous operations"
    ],
    technologies: ["Next.js", "Node.js", "OpenAI API", "Twilio Business", "PostgreSQL", "Socket.io"],
    features: [
      {
        title: "Multi-channel Inbox",
        description: "Unified stream for WhatsApp, Email, and Instagram"
      },
      {
        title: "AI Response Agents",
        description: "Autonomous agents that suggest and send replies"
      },
      {
        title: "Real-time Routing",
        description: "Seamlessly route complex queries to live team members"
      },
      {
        title: "Custom Pipelines",
        description: "Workflow automations triggered by client messages"
      }
    ],
    images: [
      "/ai.png",
      "/wa1.png",
      "/port.png"
    ],
    liveUrl: "https://bravi-ai.com",
    githubUrl: null
  },
  "accurizon": {
    name: "Accurizon",
    tagline: "Automated Bookkeeping Platform",
    category: "WEB APP",
    date: "November 2024",
    duration: "6 weeks",
    status: "Live",
    description: "A **premium bookkeeping and financial intelligence** platform designed for modern business operations. Features include automated expense tracking, balance sheets, and real-time tax accounting.",
    challenge: "Traditional bookkeeping was slow, manual, and prone to error, leaving businesses without **real-time financial clarity**. Managing receipts, invoices, and ledgers required constant manual input.",
    solution: "Designed a **secure financial app using Next.js** with Plaid and Stripe integrations. Implemented automated transaction categorization, real-time balance sheets, and automated receipt recognition.",
    impact: [
      "80% reduction in bookkeeping time",
      "100% tax filing readiness",
      "Real-time expense insights",
      "Zero manual data entries"
    ],
    technologies: ["Next.js", "Plaid API", "Stripe API", "Supabase", "Tesseract.js", "Tailwind CSS"],
    features: [
      {
        title: "Automated Categorization",
        description: "Transactions auto-sorted using trained models"
      },
      {
        title: "Plaid Connection",
        description: "Real-time bank feed sync with enterprise security"
      },
      {
        title: "Dynamic Invoicing",
        description: "Billing and reconciliation in one interface"
      },
      {
        title: "Tax Dashboard",
        description: "Instantly export tax-ready financial sheets"
      }
    ],
    images: [
      "/website.png",
      "/port2.png",
      "/port5.png"
    ],
    liveUrl: "https://accurizon.com",
    githubUrl: null
  },
  "whatsapp-chatbot": {
    name: "WhatsApp Chatbot",
    tagline: "AI-Powered Customer Engagement",
    category: "AUTOMATION",
    date: "October 2024",
    duration: "3 weeks",
    status: "Active",
    description: "An **intelligent WhatsApp chatbot** built with n8n automation platform that **revolutionizes customer communication**. This solution provides **24/7 automated responses**, smart appointment scheduling, and **seamless integration** with business tools.",
    challenge: "Businesses struggled with **manual customer support** on WhatsApp, leading to **delayed responses and missed opportunities**. The challenge was to create an intelligent system that could handle multiple conversations simultaneously while **maintaining a personal touch**.",
    solution: "Developed a **sophisticated n8n automation workflow** that integrates with WhatsApp Business API, natural language processing, and a custom database. The bot **intelligently routes queries**, provides instant responses, and **escalates complex issues** to human agents.",
    impact: [
      "95% reduction in response time",
      "300+ conversations handled daily",
      "85% customer satisfaction rate",
      "60% decrease in support costs"
    ],
    technologies: ["n8n", "WhatsApp API", "Node.js", "PostgreSQL", "OpenAI", "Webhooks"],
    features: [
      {
        title: "Intelligent Response System",
        description: "AI-powered responses that understand context and intent"
      },
      {
        title: "Appointment Scheduling",
        description: "Automated booking system with calendar integration"
      },
      {
        title: "Multi-language Support",
        description: "Communicate in 10+ languages automatically"
      },
      {
        title: "Analytics Dashboard",
        description: "Real-time insights into conversations and performance"
      },
      {
        title: "CRM Integration",
        description: "Seamless sync with popular CRM platforms"
      },
      {
        title: "Smart Escalation",
        description: "Automatically route complex queries to human agents"
      }
    ],
    images: [
      "/wa.png",
      "/wa1.png",
      "/wa2.png",
    ],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/yourusername/whatsapp-chatbot"
  },
  "client-portal": {
    name: "Client Portal",
    tagline: "Client Management System",
    category: "WEB APP",
    date: "December 2024",
    duration: "8 weeks",
    status: "Live & Active",
    description: "A **comprehensive client onboarding** and management portal designed to **streamline agency operations**. Features include secure file uploads, **automated invoice generation**, real-time project status updates, and centralized communication channels.",
    challenge: "Managing client interactions via email and disparate tools led to **communication gaps, lost files, and payment delays**. The agency needed a **centralized hub** to manage the entire client lifecycle from onboarding to offboarding.",
    solution: "Built a **robust Next.js application** with role-based access control. Implemented a secure file management system using AWS S3, **automated invoicing with Stripe integration**, and a real-time activity feed using WebSockets.",
    impact: [
      "40% reduction in admin time",
      "Zero lost files or missed invoices",
      "100% client onboarding satisfaction",
      "Faster payment processing"
    ],
    technologies: ["Next.js", "Supabase", "Tailwind", "Stripe", "AWS S3", "Resend"],
    features: [
      {
        title: "Secure File Sharing",
        description: "Drag-and-drop file uploads with version control"
      },
      {
        title: "Automated Invoicing",
        description: "Generate and send invoices automatically"
      },
      {
        title: "Real-time Updates",
        description: "Live project status tracking and notifications"
      },
      {
        title: "Role-Based Access",
        description: "Custom permissions for admins and clients"
      },
      {
        title: "Onboarding Flows",
        description: "Guided checklists for new client setup"
      },
      {
        title: "Communication Hub",
        description: "Centralized messaging and feedback system"
      }
    ],
    images: [
      "/port2.png",
      "/port.png",
      "/port4.png",
      "/port5.png"
    ],
    liveUrl: "https://portal.bravild.com",
    githubUrl: null
  },
  "salon-website": {
    name: "Salon Website",
    tagline: "Beauty & Wellness Platform",
    category: "WEB DESIGN",
    date: "September 2024",
    duration: "4 weeks",
    status: "Live & Active",
    description: "A **modern, responsive website** for a premium salon featuring an online booking system, service gallery, stylist profiles, and customer reviews. Built with **elegant animations** and a **mobile-first approach** for the best user experience.",
    challenge: "The salon needed a **digital presence** that matched their premium brand while providing an **easy booking experience**. Traditional appointment systems were cumbersome and didn't showcase their services effectively.",
    solution: "Created a **stunning website with Next.js** featuring real-time appointment booking, interactive service galleries, stylist profiles with expertise areas, and an integrated review system. The design emphasizes **visual appeal** while maintaining functionality.",
    impact: [
      "200% increase in online bookings",
      "50% reduction in phone inquiries",
      "90% positive customer feedback",
      "300+ new clients in first month"
    ],
    technologies: ["Next.js", "Tailwind CSS", "TypeScript", "Framer Motion", "Stripe", "Vercel"],
    features: [
      {
        title: "Online Booking System",
        description: "Real-time appointment scheduling with calendar integration"
      },
      {
        title: "Service Gallery",
        description: "Beautiful showcase of treatments with before/after photos"
      },
      {
        title: "Stylist Profiles",
        description: "Meet the team with detailed bios and specializations"
      },
      {
        title: "Customer Reviews",
        description: "Integrated review system with star ratings"
      },
      {
        title: "Mobile Responsive",
        description: "Perfect experience on all devices"
      },
      {
        title: "Payment Integration",
        description: "Secure online deposits and payments"
      }
    ],
    images: [
      "/sal4.png",
      "/sal2.png",
      "/sal3.png",
      "/salon1.png"
    ],
    liveUrl: "https://example-salon.com",
    githubUrl: null
  },
  "car-detailing": {
    name: "Car Detailing Website",
    tagline: "Automotive Care Services",
    category: "WEB DESIGN",
    date: "November 2024",
    duration: "3 weeks",
    status: "Live & Active",
    description: "Professional car detailing service website with **stunning before/after galleries**, service packages, online booking, and pricing calculator. Features **high-quality visuals** and smooth user experience that converts visitors into customers.",
    challenge: "Car detailing services needed to **visually demonstrate their quality** and make it easy for customers to understand packages and pricing. Most competitors had **outdated websites** that didn't showcase their work effectively.",
    solution: "Designed a **visually striking website** with large before/after image sliders, interactive package comparisons, and a **dynamic pricing calculator**. Integrated booking system with vehicle type selection and service customization.",
    impact: [
      "150% increase in quote requests",
      "80% of visitors view gallery",
      "45% conversion rate improvement",
      "40% higher average booking value"
    ],
    technologies: ["React", "GSAP", "Tailwind", "Cloudinary", "Calendly", "Netlify"],
    features: [
      {
        title: "Before/After Gallery",
        description: "Interactive slider showcasing transformation results"
      },
      {
        title: "Package Comparison",
        description: "Side-by-side service package comparisons"
      },
      {
        title: "Pricing Calculator",
        description: "Dynamic pricing based on vehicle type and services"
      },
      {
        title: "Online Booking",
        description: "Integrated scheduling with availability display"
      },
      {
        title: "Mobile App",
        description: "Progressive web app for on-the-go access"
      },
      {
        title: "Customer Portal",
        description: "Track service history and appointments"
      }
    ],
    images: [
      "/lux2.png",
      "/lux3.png",
      "/lux4.png",
      "/lux5.png"
    ],
    liveUrl: "https://example-detailing.com",
    githubUrl: "https://github.com/yourusername/car-detailing"
  },
  "photography-studio": {
    name: "Photography Studio Website",
    tagline: "Visual Arts Portfolio",
    category: "WEB DESIGN",
    date: "August 2024",
    duration: "5 weeks",
    status: "Live & Active",
    description: "Portfolio website for a photography studio showcasing **high-resolution galleries**, client testimonials, package options, and contact forms. Optimized for **visual storytelling** with lazy-loading images and immersive viewing experience.",
    challenge: "Photographers needed a platform that would showcase their work in the **best possible quality** while maintaining fast load times. The site needed to handle hundreds of high-resolution images **without performance issues**.",
    solution: "Built a **custom image optimization pipeline** with progressive loading, implemented masonry gallery layouts, and created an **immersive full-screen viewing mode**. Added smart categorization and filtering for easy navigation through different photography styles.",
    impact: [
      "500+ high-res images optimized",
      "2 second average page load",
      "70% increase in inquiries",
      "Featured in design awards"
    ],
    technologies: ["Next.js", "Sharp", "Lightbox", "Sanity CMS", "AWS S3", "Vercel"],
    features: [
      {
        title: "Masonry Gallery",
        description: "Pinterest-style layout with smooth animations"
      },
      {
        title: "Lightbox Viewer",
        description: "Full-screen image viewing with zoom and navigation"
      },
      {
        title: "Smart Filtering",
        description: "Filter by event type, style, or date"
      },
      {
        title: "Client Portal",
        description: "Private galleries for client photo delivery"
      },
      {
        title: "Booking System",
        description: "Schedule consultations and photo sessions"
      },
      {
        title: "Blog Integration",
        description: "Photography tips and recent projects"
      }
    ],
    images: [
      "/cine1.png",
      "/cine2.png",
      "/cine3.png",
      "/cine4.png",
      "/cine5.png",
      "/cine6.png",
    ],
    liveUrl: "https://example-photo.com",
    githubUrl: null
  },
  "form-builder": {
    name: "Form Builder App",
    tagline: "No-Code Form Creation Tool",
    category: "WEB APP",
    date: "July 2024",
    duration: "6 weeks",
    status: "Live & Active",
    description: "A dynamic **drag-and-drop form builder** application allowing users to create custom forms without coding. Features include **real-time preview**, conditional logic, data validation, and export capabilities with webhook integrations.",
    challenge: "Non-technical users needed a way to create **complex forms with conditional logic** and validation rules without hiring developers. Existing solutions were either too simple or too complex with **steep learning curves**.",
    solution: "Developed an **intuitive drag-and-drop interface** with visual conditional logic builder. Implemented real-time preview, **data validation engine**, and flexible export options. Connected forms to various services via webhooks.",
    impact: [
      "1000+ forms created by users",
      "15-minute average build time",
      "95% user satisfaction score",
      "Zero coding knowledge required"
    ],
    technologies: ["React", "DnD Kit", "Zustand", "PostgreSQL", "Webhooks", "Docker"],
    features: [
      {
        title: "Drag & Drop Builder",
        description: "Intuitive interface for building forms visually"
      },
      {
        title: "Conditional Logic",
        description: "Show/hide fields based on user responses"
      },
      {
        title: "Data Validation",
        description: "Built-in and custom validation rules"
      },
      {
        title: "Real-time Preview",
        description: "See changes instantly as you build"
      },
      {
        title: "Webhook Integration",
        description: "Connect forms to any service via webhooks"
      },
      {
        title: "Analytics Dashboard",
        description: "Track submissions and completion rates"
      }
    ],
    images: [
      "/frm1.png",
      "/frm2.png",
      "/frm3.png",
      "/frm4.png",
      "/form1.png",
    ],
    liveUrl: "https://example-forms.com",
    githubUrl: "https://github.com/yourusername/form-builder"
  },
  "email-automation": {
    name: "Email Automation System",
    tagline: "Marketing Automation Suite",
    category: "AUTOMATION",
    date: "June 2024",
    duration: "4 weeks",
    status: "Live & Active",
    description: "Sophisticated **email marketing automation system** built with n8n. Includes drip campaigns, personalized templates, A/B testing, analytics dashboard, and CRM integration for **targeted outreach** and customer engagement.",
    challenge: "Businesses needed an **affordable email automation solution** that could compete with expensive enterprise platforms. The system needed to handle complex workflows while remaining **easy to set up and manage**.",
    solution: "Created a comprehensive n8n workflow system with visual campaign builders, template engines, and advanced segmentation. Integrated with popular email providers and CRMs. Built **custom analytics dashboards** for tracking performance metrics.",
    impact: [
      "10,000+ emails sent daily",
      "42% average open rate",
      "18% click-through rate",
      "80% cost savings vs alternatives"
    ],
    technologies: ["n8n", "SendGrid", "Redis", "PostgreSQL", "Chart.js", "Docker"],
    features: [
      {
        title: "Drip Campaigns",
        description: "Automated email sequences with timing control"
      },
      {
        title: "A/B Testing",
        description: "Test subject lines and content variations"
      },
      {
        title: "Segmentation",
        description: "Target specific audience groups"
      },
      {
        title: "Template Builder",
        description: "Visual email template designer"
      },
      {
        title: "CRM Sync",
        description: "Two-way integration with popular CRMs"
      },
      {
        title: "Analytics Dashboard",
        description: "Real-time campaign performance metrics"
      }
    ],
    images: [
      "/email.webp",
      "/emaaa.jpg",
    ],
    liveUrl: "https://example-email.com",
    githubUrl: "https://github.com/yourusername/email-automation"
  }
}

// Words from each client — swap names/roles for the real ones anytime
const testimonials: Record<string, { quote: string; name: string; role: string; note: string }> = {
  "bravi-ai": {
    quote: "Our support agents now manage three channels in a single browser tab, with AI handling 70% of the load.",
    name: "Viktor Petrov",
    role: "CEO, InboxFlow",
    note: "Bravi-AI has completely solved our fragmented support lines. Customer response times dropped below two minutes on average, and the AI agent behaves perfectly within our brand voice."
  },
  "accurizon": {
    quote: "Accurizon gave us real-time financial clarity that used to take our accounting team weeks to prepare.",
    name: "Sarah Chen",
    role: "CFO, ScaleGroup",
    note: "The Plaid sync is seamless and tax season is no longer a stress. Having automatic categorization on every transaction keeps our balance sheets current 24/7."
  },
  "whatsapp-chatbot": {
    quote: "It answers before customers finish typing. Bookings come in while we sleep.",
    name: "Rohan Mehta",
    role: "Owner, ServiceFirst",
    note: "From mapping the response flows to going live, the bot was handling real conversations within three weeks — and it hasn't missed one since. Escalations reach a human only when they should."
  },
  "client-portal": {
    quote: "Onboarding went from a week of emails to a single login link.",
    name: "Priya Sharma",
    role: "Operations Lead",
    note: "Bravild sat with our actual onboarding mess before writing any code. The portal now runs the client lifecycle end to end — files, invoices, and updates in one place, nothing lost."
  },
  "salon-website": {
    quote: "The site sells the experience before we say a single word.",
    name: "Sana Kapoor",
    role: "Founder",
    note: "Bookings doubled in the first month. The design carries our brand, and the booking flow is so simple our clients stopped calling to make appointments."
  },
  "car-detailing": {
    quote: "The before/after gallery closes customers for us.",
    name: "Arjun Patel",
    role: "Owner",
    note: "Quote requests are up 150% and the average booking is bigger — the pricing calculator lets people build their own package before they ever talk to us."
  },
  "photography-studio": {
    quote: "Hundreds of high-res images, and it still loads in two seconds.",
    name: "Kabir Nair",
    role: "Studio Principal",
    note: "The gallery finally does the work justice. Client delivery moved into private portals, and inquiries went up 70% within the first quarter."
  },
  "form-builder": {
    quote: "Our team builds in minutes what we used to brief developers for.",
    name: "Neha Gupta",
    role: "Product Manager",
    note: "Conditional logic without code was the unlock. A thousand forms in, the tool has paid for itself many times over — and nobody has filed a support ticket to use it."
  },
  "email-automation": {
    quote: "42% open rates, and I haven't touched a campaign by hand since.",
    name: "Vikram Rao",
    role: "Head of Marketing",
    note: "The system runs drip campaigns, testing, and segmentation on its own. We got enterprise-level automation at a fraction of the platform pricing we were quoted elsewhere."
  }
}

const scopeByCategory: Record<string, string> = {
  "AUTOMATION": "Automation Strategy, Workflow Development",
  "WEB APP": "Product Design, Full-stack Development",
  "WEB DESIGN": "Web Design, Development"
}

const INK = '#1d1d20'

// Near-fullscreen slider: click the right half to advance, left half to go
// back. The cursor becomes a directional arrow box over the images.
// Three clone sets make the loop endless in both directions.
function CaseSlider({ images, name }: { images: string[]; name: string }) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef(images.length) // start in the middle clone set
  const animatingRef = useRef(false)
  const [dir, setDir] = useState<'left' | 'right'>('right')
  const [hovering, setHovering] = useState(false)

  const slides = [...images, ...images, ...images]

  const xFor = (i: number) => {
    const track = trackRef.current
    if (!track || !track.children.length) return 0
    const wrapper = track.children[0] as HTMLElement
    const inner = wrapper.firstElementChild as HTMLElement
    const step = wrapper.offsetWidth
    const center = (window.innerWidth - inner.offsetWidth) / 2
    return center - i * step
  }

  useEffect(() => {
    const setPos = () => {
      if (trackRef.current) gsap.set(trackRef.current, { x: xFor(indexRef.current) })
    }
    setPos()
    window.addEventListener('resize', setPos)
    return () => window.removeEventListener('resize', setPos)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const go = (delta: number) => {
    if (animatingRef.current || !trackRef.current) return
    animatingRef.current = true
    indexRef.current += delta
    gsap.to(trackRef.current, {
      x: xFor(indexRef.current),
      duration: 0.85,
      ease: "power3.inOut",
      onComplete: () => {
        // Snap silently back into the middle clone set — visually identical
        const n = images.length
        if (indexRef.current >= 2 * n) indexRef.current -= n
        else if (indexRef.current < n) indexRef.current += n
        gsap.set(trackRef.current, { x: xFor(indexRef.current) })
        animatingRef.current = false
      },
    })
  }

  const handleMove = (e: React.MouseEvent) => {
    const cursor = cursorRef.current
    const viewport = viewportRef.current
    if (!cursor || !viewport) return
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    const rect = viewport.getBoundingClientRect()
    const next = e.clientX > rect.left + rect.width / 2 ? 'right' : 'left'
    setDir((d) => (d === next ? d : next))
  }

  const handleClick = (e: React.MouseEvent) => {
    const viewport = viewportRef.current
    if (!viewport) return
    const rect = viewport.getBoundingClientRect()
    go(e.clientX > rect.left + rect.width / 2 ? 1 : -1)
  }

  return (
    <>
      <div
        ref={viewportRef}
        className="overflow-hidden md:cursor-none select-none"
        onMouseMove={handleMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onClick={handleClick}
      >
        <div ref={trackRef} className="flex w-max">
          {slides.map((src, i) => (
            <div key={i} className="pr-3 md:pr-5 shrink-0">
              <div className="relative w-[92vw] md:w-[70vw] h-[62vh] md:h-[calc(100vh-6.5rem)] rounded-xl md:rounded-2xl overflow-hidden bg-black/5">
                <Image
                  src={src}
                  alt={`${name} — view ${(i % images.length) + 1}`}
                  fill
                  sizes="(max-width: 768px) 92vw, 70vw"
                  className="object-cover"
                  priority={i >= images.length && i < images.length + 2}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Directional cursor box */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[60] pointer-events-none hidden md:block"
        style={{ transform: 'translate(-200px, -200px)' }}
      >
        <div
          className={`-translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-xl bg-[#1d1d20]/90 text-white flex items-center justify-center transition-[opacity,scale] duration-200 ${hovering ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
        >
          {dir === 'right'
            ? <ArrowRight className="w-5 h-5" strokeWidth={1.8} />
            : <ArrowLeft className="w-5 h-5" strokeWidth={1.8} />}
        </div>
      </div>
    </>
  )
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const pageRef = useRef<HTMLDivElement>(null)

  const project = projectsData[slug as keyof typeof projectsData]
  const testimonial = testimonials[slug]

  useEffect(() => {
    if (!project) return

    const ctx = gsap.context(() => {

      // Hero entrance
      const heroEls = gsap.utils.toArray<HTMLElement>('.hero-anim', pageRef.current)
      gsap.fromTo(heroEls,
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1, stagger: 0.12, ease: "power3.out", delay: 0.1 }
      )

      // Generic scroll reveals
      gsap.utils.toArray<HTMLElement>('.reveal-up', pageRef.current).forEach((el) => {
        gsap.fromTo(el,
          { y: 44, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: 'top 82%' },
          }
        )
      })

      // Money-loop diagram — tangle draws in, the machine core pops, one
      // clean line leaves, then the machine emits revenue packets forever.
      // Reduced motion: markup already renders the finished state, skip it all.
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const strands = gsap.utils.toArray<SVGGeometryElement>('.d-strand', pageRef.current)
      if (strands.length && !reduceMotion) {
        gsap.set('.d-strand, .d-clean', { strokeDasharray: 1, strokeDashoffset: 1 })
        gsap.set('.d-core, .d-cap, .d-tick', { scale: 0, transformOrigin: '50% 50%' })
        gsap.set('.d-fade', { autoAlpha: 0, y: 12 })
        gsap.set('.d-packet', { autoAlpha: 0 })

        // Ambient loops, armed by the entrance timeline once the line exists
        const packetX = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1.6 })
        packetX
          .fromTo('.d-packet-x', { attr: { x: 487 }, autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: 'none' }, 0)
          .to('.d-packet-x', { attr: { x: 824 }, duration: 2.1, ease: 'power1.inOut' }, 0)
          .to('.d-packet-x', { autoAlpha: 0, duration: 0.25, ease: 'none' }, 1.85)
        const packetY = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1.6 })
        packetY
          .fromTo('.d-packet-y', { attr: { y: 264 }, autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: 'none' }, 0)
          .to('.d-packet-y', { attr: { y: 449 }, duration: 2.1, ease: 'power1.inOut' }, 0)
          .to('.d-packet-y', { autoAlpha: 0, duration: 0.25, ease: 'none' }, 1.85)

        const dtl = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: { trigger: '.diagram-stage', start: 'top 72%' },
        })
        dtl
          .to('.d-strand', { strokeDashoffset: 0, duration: 1.15, stagger: 0.16 })
          .to('.d-core', { scale: 1, duration: 0.45, ease: 'back.out(2.2)' }, '-=0.55')
          .to('.d-clean', { strokeDashoffset: 0, duration: 0.9 }, '-=0.15')
          .to('.d-tick', { scale: 1, duration: 0.3, stagger: 0.06, ease: 'power3.out' }, '-=0.45')
          .to('.d-cap', { scale: 1, duration: 0.4, ease: 'back.out(2.5)' }, '-=0.2')
          .to('.d-fade', { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }, '-=0.3')
          .call(() => { packetX.play(); packetY.play() })
      }

    }, pageRef)

    return () => ctx.revert()
  }, [project])

  if (!project) {
    return (
      <div className="min-h-screen bg-[#dfdff2] text-[#1d1d20] flex items-center justify-center font-mont">
        <div className="text-center">
          <h1 className="text-6xl font-black mb-4">404</h1>
          <p className="opacity-60 mb-8 font-rayl">Project not found</p>
          <button
            onClick={() => router.push('/')}
            className="px-8 py-4 bg-[#1d1d20] text-white font-bold rounded-lg hover:opacity-80 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-[#dfdff2] text-[#1d1d20] selection:bg-black/10">

      {/* Back nav */}
      <nav className="fixed top-0 left-0 z-50 px-6 md:px-12 py-6">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-[#1d1d20] transition-opacity hover:opacity-60"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold font-mont tracking-[0.25em] uppercase">Back</span>
        </button>
      </nav>

      {/* ============ Hero ============ */}
      <header className="pt-32 md:pt-40 pb-12 md:pb-16">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="hero-anim mb-6 flex items-center gap-3">
            <span className="block h-px w-8 bg-black/20" />
            <span className="text-base md:text-lg font-serif italic text-black/60">
              {project.category.charAt(0) + project.category.slice(1).toLowerCase()}
            </span>
          </div>
          <h1 className="hero-anim text-3xl md:text-5xl lg:text-6xl font-light font-mont tracking-tight leading-[1.05] max-w-4xl">
            {project.name}
          </h1>
          <p className="hero-anim font-sans text-sm md:text-base font-light tracking-wide text-black/55 mt-4">
            {project.tagline}
          </p>
        </div>
      </header>

      {/* ============ Image slider — click sides to navigate ============ */}
      <section className="hero-anim mb-24 md:mb-40">
        <CaseSlider images={project.images} name={project.name} />
      </section>

      {/* ============ Description — editorial two-column ============ */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 mb-28 md:mb-44">
        <div className="grid lg:grid-cols-[1fr_1.6fr] gap-14 lg:gap-24">

          {/* Meta rail */}
          <div className="reveal-up space-y-8 lg:space-y-10 border-l border-black/10 pl-6 md:pl-8">
            <div>
              <p className="text-[10px] md:text-[11px] font-mont font-bold tracking-[0.18em] uppercase text-black/45 mb-1.5">Industry</p>
              <p className="text-base font-sans text-black/85 font-normal leading-snug">{project.category.charAt(0) + project.category.slice(1).toLowerCase()}</p>
            </div>
            <div>
              <p className="text-[10px] md:text-[11px] font-mont font-bold tracking-[0.18em] uppercase text-black/45 mb-1.5">Scope</p>
              <p className="text-base font-sans text-black/85 font-normal leading-snug">{scopeByCategory[project.category]}</p>
            </div>
            <div>
              <p className="text-[10px] md:text-[11px] font-mont font-bold tracking-[0.18em] uppercase text-black/45 mb-1.5">Timeline</p>
              <p className="text-base font-sans text-black/85 font-normal leading-snug">{project.duration}</p>
            </div>
            <div>
              <p className="text-[10px] md:text-[11px] font-mont font-bold tracking-[0.18em] uppercase text-black/45 mb-1.5">Status</p>
              <p className="text-base font-sans text-black/85 font-normal leading-snug">{project.status}</p>
            </div>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-xs font-bold font-mont tracking-[0.18em] uppercase border-b border-black/20 pb-1 hover:border-black/60 transition-colors"
              >
                View live
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            )}
          </div>

          {/* The big statement */}
          <div className="space-y-6">
            <p className="reveal-up text-xl md:text-2xl lg:text-3xl font-light font-sans leading-relaxed text-black/80 tracking-tight">
              {renderFormattedText(project.description)}
            </p>
            <p className="reveal-up text-sm md:text-base font-sans font-light leading-relaxed text-black/55 max-w-[620px] pt-6 border-t border-black/5">
              {renderFormattedText(project.challenge)}
            </p>
          </div>
        </div>
      </section>

      {/* ============ Details — label left, content right ============ */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 mb-28 md:mb-44 space-y-24 md:space-y-32">

        {/* The fix */}
        <div className="reveal-up grid lg:grid-cols-[1fr_1.6fr] gap-8 lg:gap-24 border-t border-black/10 pt-10 md:pt-14">
          <h3 className="font-mont font-bold text-xs md:text-sm tracking-[0.2em] uppercase text-black">THE SOLUTION</h3>
          <p className="text-base md:text-lg font-sans font-light leading-relaxed max-w-[720px] text-black/75">
            {renderFormattedText(project.solution)}
          </p>
        </div>

        {/* What it does */}
        <div className="reveal-up grid lg:grid-cols-[1fr_1.6fr] gap-8 lg:gap-24 border-t border-black/10 pt-10 md:pt-14">
          <h3 className="font-mont font-bold text-xs md:text-sm tracking-[0.2em] uppercase text-black">THE FEATURES</h3>
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
            {project.features.map((feature, index) => (
              <div key={index} className="border-t border-black/5 pt-4">
                <h4 className="font-mont font-bold text-sm tracking-tight mb-2 text-black">{feature.title}</h4>
                <p className="text-xs md:text-sm font-sans font-light leading-relaxed text-black/60">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* The numbers */}
        <div className="reveal-up grid lg:grid-cols-[1fr_1.6fr] gap-8 lg:gap-24 border-t border-black/10 pt-10 md:pt-14">
          <h3 className="font-mont font-bold text-xs md:text-sm tracking-[0.2em] uppercase text-black">THE METRICS</h3>
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
            {project.impact.map((item, index) => {
              const { num, desc } = parseImpact(item)
              return (
                <div key={index} className="border-t border-black/5 pt-4 flex flex-col gap-1.5">
                  {num && <span className="text-3xl md:text-4xl font-bold font-mont tracking-tight text-black">{num}</span>}
                  <p className="text-xs md:text-sm font-sans font-light leading-relaxed text-black/60">{desc}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* The stack */}
        <div className="reveal-up grid lg:grid-cols-[1fr_1.6fr] gap-8 lg:gap-24 border-t border-black/10 pt-10 md:pt-14">
          <h3 className="font-mont font-bold text-xs md:text-sm tracking-[0.2em] uppercase text-black">THE STACK</h3>
          <p className="font-sans text-sm md:text-base leading-loose text-black/70 tracking-wide font-medium">
            {project.technologies.join('   ·   ')}
          </p>
        </div>
      </section>

      {/* ============ Words from the Client ============ */}
      {testimonial && (
        <section className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 mb-28 md:mb-44">
          <h2 className="reveal-up text-2xl md:text-3xl lg:text-4xl font-mont font-semibold tracking-tight leading-none uppercase">
            Words from the Client
          </h2>
          <div className="reveal-up border-t border-black/15 mt-8 mb-14" />

          <div className="grid lg:grid-cols-2 gap-14 lg:gap-24 items-start">
            <div className="reveal-up">
              <span className="block font-serif text-7xl leading-[0.5] mb-8 select-none">“</span>
              <blockquote className="text-2xl md:text-3xl font-light font-serif italic leading-relaxed tracking-tight max-w-[580px] text-[#1d1d20]">
                “{testimonial.quote}”
              </blockquote>
              <div className="border-b border-dashed border-black/25 w-2/3 my-10" />
              <p className="font-bold font-mont">{testimonial.name}</p>
              <p className="text-sm opacity-55 mt-1">{testimonial.role}</p>
            </div>

            <div className="reveal-up">
              <div className="relative aspect-[16/10] rounded-xl md:rounded-2xl overflow-hidden bg-black/5">
                <Image
                  src={project.images[1] || project.images[0]}
                  alt={`${project.name} — client work`}
                  fill
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="object-cover"
                />
              </div>
              <p className="mt-8 text-base md:text-lg font-serif font-light leading-[1.8] opacity-60 max-w-[560px]">
                {testimonial.note}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ============ The money loop — how Bravild pays for itself ============ */}
      <section className="diagram-stage max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 mb-28 md:mb-40">
        <div className="reveal-up mb-10 md:mb-16 flex items-center gap-4">
          <span className="block h-px w-12 md:w-20 bg-black/40" />
          <span className="text-[11px] md:text-xs font-rayl tracking-[0.35em] uppercase opacity-50">
            How the money flows
          </span>
        </div>

        {/* Desktop: three tangled workflows enter the machine, one measured line leaves */}
        <div className="hidden md:block">
          <svg viewBox="0 0 900 260" className="w-full h-auto" fill="none" aria-label="Three tangled lines enter a black square and leave as one straight, measured line ending in a small square">
            {/* Shared styles — <style> in SVG is document-scoped, so this also covers the mobile SVG */}
            <style>{`
              .d-strand {
                fill: none;
                stroke: ${INK};
                stroke-linecap: round;
              }
              .d-clean {
                stroke: ${INK};
                stroke-width: 2.5;
                stroke-linecap: round;
              }
              .d-tick {
                stroke: ${INK};
                stroke-width: 1;
                opacity: 0.3;
              }
              .d-cap, .d-packet {
                fill: ${INK};
              }
              .core-spin {
                fill: #dfdff2;
                transform-box: fill-box;
                transform-origin: center;
                animation: coreSpin 9s linear infinite;
              }
              .lbl {
                font-family: var(--font-mono), monospace;
                font-size: 11px;
                letter-spacing: .18em;
                fill: ${INK};
                opacity: 0.55;
                text-transform: uppercase;
              }
              .lbl-strong {
                opacity: 1;
              }
              .note {
                font-family: var(--font-mono), monospace;
                font-size: 10px;
                letter-spacing: .08em;
                fill: ${INK};
                opacity: 0.38;
              }
              .sub {
                font-family: Georgia, 'Times New Roman', serif;
                font-size: 12.5px;
                fill: ${INK};
                opacity: 0.55;
              }
              @keyframes coreSpin {
                to { transform: rotate(360deg); }
              }
              @media(prefers-reduced-motion:reduce){
                .core-spin {
                  animation: none;
                  transform: rotate(45deg);
                }
              }
            `}</style>

            {/* the tangle — three workflows braided together, each a little fainter */}
            <path className="d-strand" pathLength={1} strokeWidth="2" strokeOpacity="0.45"
              d="M60,60 C120,20 140,150 200,110 C250,78 230,190 300,140 C350,105 370,130 415,105"/>
            <path className="d-strand" pathLength={1} strokeWidth="1.8" strokeOpacity="0.34"
              d="M60,125 C110,180 150,45 210,100 C260,148 290,55 330,110 C370,162 390,125 415,120"/>
            <path className="d-strand" pathLength={1} strokeWidth="1.6" strokeOpacity="0.26"
              d="M60,185 C130,215 160,85 230,148 C280,188 320,95 360,132 C390,158 400,138 415,135"/>

            {/* the machine — with a working core */}
            <rect x="415" y="85" width="70" height="70" fill={INK}/>
            <g className="d-core">
              <rect className="core-spin" x="443" y="113" width="14" height="14"/>
            </g>

            {/* one measured line out */}
            <line className="d-clean" pathLength={1} x1="485" y1="120" x2="830" y2="120"/>
            <line className="d-tick" x1="540" y1="126" x2="540" y2="133"/>
            <line className="d-tick" x1="597" y1="126" x2="597" y2="133"/>
            <line className="d-tick" x1="655" y1="126" x2="655" y2="133"/>
            <line className="d-tick" x1="712" y1="126" x2="712" y2="133"/>
            <line className="d-tick" x1="770" y1="126" x2="770" y2="133"/>
            <rect className="d-cap" x="833" y="115" width="10" height="10"/>

            {/* revenue packet — emitted by the machine, travels the line forever */}
            <rect className="d-packet d-packet-x" x="487" y="117" width="6" height="6"/>

            {/* annotations in the site's comment voice */}
            <text className="note d-fade" x="60" y="22">{'// manual chaos'}</text>
            <text className="note d-fade" x="843" y="96" textAnchor="end">{'// measured monthly'}</text>

            {/* labels; only the result speaks at full strength */}
            <text className="lbl d-fade" x="60" y="245">Your busywork</text>
            <text className="lbl d-fade" x="450" y="245" textAnchor="middle">Bravild</text>
            <text className="lbl lbl-strong d-fade" x="843" y="245" textAnchor="end">Revenue</text>
          </svg>
        </div>

        {/* Mobile: the same story, falling vertically */}
        <div className="md:hidden mt-4">
          <svg viewBox="0 0 340 500" className="w-full h-auto" fill="none" aria-label="Three tangled lines fall into a black square and leave as one straight, measured line ending in a small square">
            {/* the tangle, descending */}
            <path className="d-strand" pathLength={1} strokeWidth="2" strokeOpacity="0.45"
              d="M60,18 C20,70 130,95 85,135 C50,168 95,175 65,205"/>
            <path className="d-strand" pathLength={1} strokeWidth="1.8" strokeOpacity="0.34"
              d="M85,18 C140,60 35,95 90,130 C135,160 70,170 80,205"/>
            <path className="d-strand" pathLength={1} strokeWidth="1.6" strokeOpacity="0.26"
              d="M110,18 C155,75 60,110 105,150 C140,180 100,182 95,205"/>

            {/* the machine */}
            <rect x="52" y="205" width="56" height="56" fill={INK}/>
            <g className="d-core">
              <rect className="core-spin" x="74" y="227" width="12" height="12"/>
            </g>

            {/* the measured line down */}
            <line className="d-clean" pathLength={1} x1="80" y1="261" x2="80" y2="455"/>
            <line className="d-tick" x1="84" y1="300" x2="90" y2="300"/>
            <line className="d-tick" x1="84" y1="340" x2="90" y2="340"/>
            <line className="d-tick" x1="84" y1="380" x2="90" y2="380"/>
            <line className="d-tick" x1="84" y1="420" x2="90" y2="420"/>
            <rect className="d-cap" x="75" y="460" width="10" height="10"/>

            {/* revenue packet */}
            <rect className="d-packet d-packet-y" x="77" y="264" width="6" height="6"/>

            {/* labels beside each zone */}
            <text className="lbl d-fade" x="150" y="105">Your busywork</text>
            <text className="sub d-fade" x="150" y="127">The manual operational
              <tspan x="150" dy="17">tangle and overhead</tspan>
            </text>

            <text className="lbl d-fade" x="150" y="228">Bravild</text>
            <text className="sub d-fade" x="150" y="250">The systems engine that
              <tspan x="150" dy="17">handles and solves the mess</tspan>
            </text>

            <text className="lbl lbl-strong d-fade" x="150" y="360">Revenue</text>
            <text className="sub d-fade" x="150" y="382">Clean, compounding
              <tspan x="150" dy="17">automated yields</tspan>
            </text>
            <text className="note d-fade" x="150" y="420">{'// measured monthly'}</text>
          </svg>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="bg-[#101014] text-white">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 py-28 md:py-40">
          <div className="grid lg:grid-cols-2 gap-16 items-end">
            <div>
              <p className="reveal-up font-mono text-sm opacity-50 mb-8">{'// next steps'}</p>
              <h2 className="reveal-up text-4xl md:text-6xl lg:text-7xl font-light leading-[0.95] tracking-tight mb-8 font-mont">
                READY TO<br />SCALE?
              </h2>
              <p className="reveal-up text-white/50 text-base md:text-lg max-w-md font-serif font-light leading-[1.8]">
                Your business could run on a system like this one. No fluff — we find the leak, we build the machine.
              </p>
            </div>

            <div className="reveal-up flex flex-col gap-6 items-start lg:items-end">
              <Link href="/#contact" className="w-full lg:w-auto">
                <button className="w-full lg:w-auto px-14 py-6 border border-white text-[12px] tracking-[0.25em] font-mont hover:bg-white hover:text-black transition-all duration-300 uppercase">
                  Start a Project
                </button>
              </Link>
              <Link href="/" className="w-full lg:w-auto">
                <button className="w-full lg:w-auto px-14 py-6 text-[12px] tracking-[0.25em] font-mont text-white/40 hover:text-white transition-colors duration-300 uppercase">
                  View More Projects
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
