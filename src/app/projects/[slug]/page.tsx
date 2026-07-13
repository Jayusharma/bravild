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
    description: "An **intelligent, unified communications inbox** connecting WhatsApp, Email, Instagram, and more, equipped with automated AI responses, real-time agent chat, and smart data infrastructure.",
    challenge: "Businesses struggled to manage customer messages across multiple platforms, causing delays and lost sales. They needed a **single unified dashboard** that could automate basic conversations while organizing multi-channel client inquiries.",
    solution: "Built a **full-stack CRM platform** using Next.js, Python microservices, and RAG-powered AI agents. Integrated WhatsApp Business API, Twilio, and Meta APIs with real-time agent routing, AI-generated reply suggestions, and a visual analytics layer.",
    impact: [
      "Messages across 4 channels in one inbox",
      "AI handles 7 out of 10 queries on its own",
      "Response time dropped from hours to seconds",
      "Runs 24/7 without a single person online"
    ],
    technologies: ["Next.js", "Python", "WhatsApp Business API", "RAG", "OpenAI", "PostgreSQL", "Socket.io", "Twilio"],
    features: [
      {
        title: "Multi-channel Inbox",
        description: "Unified stream for WhatsApp, Email, and Instagram"
      },
      {
        title: "AI Response Agents",
        description: "RAG-powered agents that suggest and send context-aware replies"
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
      "/bravi-ai/dashboard.png",
      "/bravi-ai/messaging page.png",
      "/bravi-ai/analytics.png",
      "/bravi-ai/channel page.png",
      "/bravi-ai/contacts page.png",
      "/bravi-ai/template page.png",
      "/bravi-ai/ai chat.png",
      "/bravi-ai/admin panel.png",
      "/bravi-ai/ai reply.png",
      "/bravi-ai/enquiry.png"
    ],
    imageBg: "#ffffff",
    imageFit: "contain",
    liveUrl: null,
    githubUrl: null
  },
  "accurizon": {
    name: "Accurizon",
    tagline: "Financial Services Website",
    category: "WEB DESIGN",
    date: "November 2024",
    duration: "4 weeks",
    status: "Live",
    description: "A **premium financial services website** designed for a modern bookkeeping firm. Built with smooth scroll-driven animations, interactive service breakdowns, and a polished brand identity that builds trust on first visit.",
    challenge: "The client had no digital presence and needed a website that would **instantly establish credibility** with potential business clients. The design had to feel institutional-grade while remaining approachable and easy to navigate.",
    solution: "Designed and built a **high-end marketing website using Next.js** with GSAP scroll animations and Splide carousels. Every section was crafted to guide visitors through the firm's services, team, and client success stories with cinematic transitions.",
    impact: [
      "3x more enquiries in the first month",
      "Average visitor spends over 2 minutes on site",
      "Bounce rate dropped below 30%",
      "Clients say the site sold them before the first call"
    ],
    technologies: ["Next.js", "GSAP", "Splide", "Tailwind CSS", "TypeScript", "Vercel"],
    features: [
      {
        title: "Scroll-driven Animations",
        description: "Cinematic GSAP transitions triggered on scroll"
      },
      {
        title: "Service Breakdowns",
        description: "Interactive cards with detailed service architecture"
      },
      {
        title: "Client Testimonials",
        description: "Rotating carousel with partner logos and quotes"
      },
      {
        title: "Contact Integration",
        description: "Inline enquiry forms with instant email delivery"
      }
    ],
    images: [
      "/accurizon/acu1.png",
      "/accurizon/acu2.png",
      "/accurizon/acu3.png",
      "/accurizon/acu4.png",
      "/accurizon/acu5.png",
      "/accurizon/acu6.png"
    ],
    imageBg: "#ffffff",
    imageFit: "contain",
    imagePositions: { 0: "center 65%", 1: "center 65%", 3: "center 30%" },
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
    description: "An **intelligent WhatsApp chatbot** powered by n8n automation workflows, AI agents, and RAG retrieval. Handles customer queries, books appointments, and syncs every conversation to a CRM — all without human intervention.",
    challenge: "The client's team was buried in WhatsApp messages — **manually replying to hundreds of enquiries daily**, missing follow-ups, and losing leads. They needed a system that could handle volume without losing the personal touch.",
    solution: "Built an **n8n automation pipeline** connecting WhatsApp Business API with an AI agent powered by RAG. Conversations are logged to Google Sheets and synced with CRM. The bot intelligently routes complex queries to humans only when needed.",
    impact: [
      "Replies go out in under 5 seconds, not 5 hours",
      "Handles 300+ conversations a day without breaking",
      "Clients can't tell it's a bot — that's the point",
      "Support costs cut by more than half"
    ],
    technologies: ["n8n", "WhatsApp Business API", "OpenAI", "RAG", "Google Sheets", "CRM", "AI Agents"],
    features: [
      {
        title: "AI Agent with RAG",
        description: "Context-aware responses using retrieval-augmented generation"
      },
      {
        title: "Appointment Scheduling",
        description: "Automated booking system with calendar integration"
      },
      {
        title: "CRM Sync",
        description: "Every conversation logged and synced to CRM automatically"
      },
      {
        title: "Spreadsheet Logging",
        description: "All enquiries captured in Google Sheets for reporting"
      },
      {
        title: "Smart Escalation",
        description: "Routes complex queries to human agents seamlessly"
      },
      {
        title: "Multi-language Support",
        description: "Communicate in multiple languages automatically"
      }
    ],
    images: [
      "/whatsapp-chatbot/sss.png",
      "/whatsapp-chatbot/sss4.png",
      "/whatsapp-chatbot/sss2.png",
      "/whatsapp-chatbot/sss3.png"
    ],
    imageBg: "#0a0a0c",
    imageFit: "contain",
    liveUrl: null,
    githubUrl: null
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
      "Admin time cut nearly in half",
      "Not a single file lost since launch",
      "Every client onboarded without a hitch",
      "Payments come in faster than ever"
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
      "/client-portal/cli1.png",
      "/client-portal/cli2.png",
      "/client-portal/cli4.png",
      "/client-portal/cli5.png"
    ],
    imageBg: "#0f0f11",
    imageFit: "contain",
    liveUrl: "https://portal.bravild.com",
    githubUrl: null
  },
  "salon-website": {
    name: "Salon Website",
    tagline: "Beauty & Wellness Platform",
    category: "WEB DESIGN",
    date: "September 2024",
    duration: "3 weeks",
    status: "Live & Active",
    description: "A **modern, responsive website** for a premium salon featuring elegant scroll animations, service showcases, stylist profiles, and a mobile-first design that reflects the brand's identity.",
    challenge: "The salon had no website and was relying entirely on word of mouth and Instagram. They needed a **digital presence that felt as premium as their salon**, with clear service information and easy contact options.",
    solution: "Designed a **visually rich website with Next.js**, GSAP scroll animations, and Splide galleries. Each section was crafted to guide visitors through the salon's story, team, and services with smooth, cinema-like transitions.",
    impact: [
      "Online enquiries doubled in the first month",
      "Clients stopped calling — they book through the site",
      "The brand finally feels as premium online as in person",
      "Google search visibility went from zero to page one"
    ],
    technologies: ["Next.js", "GSAP", "Splide", "Tailwind CSS", "TypeScript", "Vercel"],
    features: [
      {
        title: "Service Showcase",
        description: "Beautiful galleries with treatment details and pricing"
      },
      {
        title: "Stylist Profiles",
        description: "Meet the team with detailed bios and specializations"
      },
      {
        title: "Scroll Animations",
        description: "Smooth GSAP transitions for a premium feel"
      },
      {
        title: "Mobile-first Design",
        description: "Perfect experience on phones and tablets"
      },
      {
        title: "Contact Integration",
        description: "WhatsApp and email enquiry buttons throughout"
      },
      {
        title: "Image Galleries",
        description: "Splide carousels showcasing salon work"
      }
    ],
    images: [
      "/salon-website/sal4.png",
      "/salon-website/sal2.png",
      "/salon-website/sal3.png",
      "/salon-website/salon1.png"
    ],
    imageBg: "#fdf8f5",
    imageFit: "contain",
    liveUrl: null,
    githubUrl: null
  },
  "car-detailing": {
    name: "Car Detailing Website",
    tagline: "Automotive Care Services",
    category: "WEB DESIGN",
    date: "November 2024",
    duration: "3 weeks",
    status: "Live & Active",
    description: "A **professional car detailing website** with stunning service galleries, package breakdowns, and smooth scroll animations. Designed to convert visitors into customers with a premium look that matches the quality of the detailing work.",
    challenge: "The detailing business had no online presence and was losing potential clients to competitors with better websites. They needed something that **visually showcased their work quality** and made it easy to understand pricing.",
    solution: "Built a **visually striking website with Next.js** and GSAP animations. Designed large before/after galleries, interactive service package cards, and clear CTAs. The site loads fast and looks premium on every screen size.",
    impact: [
      "Quote requests went up 150% in the first quarter",
      "Most visitors check the gallery before anything else",
      "Average booking value went up by 40%",
      "The site pays for itself every single month"
    ],
    technologies: ["Next.js", "GSAP", "Splide", "Tailwind CSS", "TypeScript", "Vercel"],
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
        title: "Scroll Animations",
        description: "Smooth GSAP transitions for a premium feel"
      },
      {
        title: "Mobile Responsive",
        description: "Pixel-perfect on every device"
      },
      {
        title: "Contact CTAs",
        description: "WhatsApp and call buttons on every section"
      },
      {
        title: "Image Galleries",
        description: "Splide carousels for service showcases"
      }
    ],
    images: [
      "/car-detailing/lux2.png",
      "/car-detailing/lux3.png",
      "/car-detailing/lux4.png",
      "/car-detailing/lux5.png"
    ],
    imageBg: "#121216",
    imageFit: "contain",
    liveUrl: null,
    githubUrl: null
  },
  "photography-studio": {
    name: "CineStories",
    tagline: "Photography & Cinematic Portfolio",
    category: "WEB DESIGN",
    date: "August 2024",
    duration: "4 weeks",
    status: "Live & Active",
    description: "A **cinematic portfolio website** for a photography studio showcasing high-resolution galleries, client stories, and booking options. Built with smooth scroll-driven animations and optimized for fast loading despite hundreds of images.",
    challenge: "The photographer needed a website that did justice to their work — **fast, beautiful, and immersive**. Most portfolio templates felt generic and couldn't handle large image libraries without becoming painfully slow.",
    solution: "Designed a **custom Next.js portfolio** with GSAP scroll animations, Splide galleries, and lazy-loaded high-res images. Every section was crafted to tell a visual story, from the hero to the contact form.",
    impact: [
      "Enquiries went up 70% in the first quarter",
      "Site loads in under 2 seconds with 500+ images",
      "Clients share the portfolio link more than the Instagram",
      "The photographer says it finally does their work justice"
    ],
    technologies: ["Next.js", "GSAP", "Splide", "Tailwind CSS", "TypeScript", "Vercel"],
    features: [
      {
        title: "Cinematic Galleries",
        description: "Full-bleed image layouts with smooth transitions"
      },
      {
        title: "Scroll Animations",
        description: "GSAP-powered reveal effects throughout"
      },
      {
        title: "Lazy Loading",
        description: "Images load progressively without blocking the page"
      },
      {
        title: "Category Filtering",
        description: "Browse by wedding, portrait, commercial, or event"
      },
      {
        title: "Booking Section",
        description: "Schedule consultations directly from the site"
      },
      {
        title: "Mobile Optimized",
        description: "Full gallery experience on every screen size"
      }
    ],
    images: [
      "/photography-studio/cine1.png",
      "/photography-studio/cine2.png",
      "/photography-studio/cine3.png",
      "/photography-studio/cine4.png",
      "/photography-studio/cine5.png",
      "/photography-studio/cine6.png"
    ],
    imageBg: "#17171c",
    imageFit: "contain",
    liveUrl: "https://cinestories.vercel.app/",
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
      "Over a thousand forms built by users so far",
      "Most people finish a form in under 15 minutes",
      "95% satisfaction — almost zero support tickets",
      "Zero coding knowledge needed to use it"
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
      "/form-builder/frm1.png",
      "/form-builder/frm2.png",
      "/form-builder/frm3.png",
      "/form-builder/frm4.png",
      "/form-builder/form1.png"
    ],
    imageBg: "#f4f6f8",
    imageFit: "contain",
    liveUrl: null,
    githubUrl: null
  },
  "email-automation": {
    name: "Email Automation System",
    tagline: "Marketing Automation Suite",
    category: "AUTOMATION",
    date: "June 2024",
    duration: "4 weeks",
    status: "Live & Active",
    description: "A **sophisticated email automation system** built with n8n workflows, AI agents, and CRM integration. Automates drip campaigns, follow-ups, and lead nurturing — sending the right email to the right person at the right time.",
    challenge: "The client was sending emails manually — **copy-pasting templates, forgetting follow-ups, and losing track of leads**. They needed a system that could run campaigns on autopilot without the cost of enterprise platforms.",
    solution: "Built an **n8n automation pipeline** with AI-powered email composition, smart segmentation, and CRM sync. Connected Google Sheets for lead tracking and integrated with email providers for reliable delivery at scale.",
    impact: [
      "Sends 10,000+ emails daily without lifting a finger",
      "Open rates consistently above 40%",
      "Saved more than 80% vs enterprise platform pricing",
      "The system paid for itself in the first month"
    ],
    technologies: ["n8n", "AI Agents", "RAG", "Google Sheets", "CRM", "SendGrid", "Webhooks"],
    features: [
      {
        title: "Drip Campaigns",
        description: "Automated email sequences with smart timing"
      },
      {
        title: "AI Composition",
        description: "AI agents that draft personalized email content"
      },
      {
        title: "Lead Segmentation",
        description: "Target specific audience groups automatically"
      },
      {
        title: "CRM Sync",
        description: "Two-way integration keeping contacts in sync"
      },
      {
        title: "Spreadsheet Logging",
        description: "Every send, open, and click tracked in Google Sheets"
      },
      {
        title: "Smart Follow-ups",
        description: "Automatic follow-ups based on recipient behaviour"
      }
    ],
    images: [
      "/email-automation/em1.png",
      "/email-automation/em2.png",
      "/email-automation/em3.png",
      "/email-automation/em4.png"
    ],
    imageBg: "#1a1a1a",
    imageFit: "contain",
    liveUrl: null,
    githubUrl: null
  }
}

// Words from each client — swap names/roles for the real ones anytime
const testimonials: Record<string, { quote: string; name: string; role: string; note: string }> = {
  "bravi-ai": {
    quote: "Bravild didn't just build us a platform — they understood the chaos we were drowning in and turned it into something elegant.",
    name: "Viktor Petrov",
    role: "CEO, InboxFlow",
    note: "From the very first call, they listened more than they pitched. The team moved fast, communicated clearly, and delivered something that genuinely changed how we operate day to day."
  },
  "accurizon": {
    quote: "They took our messy spreadsheets and turned them into a system we actually trust. Bravild gets how real businesses work.",
    name: "Sarah Chen",
    role: "CFO, ScaleGroup",
    note: "What stood out was how deeply they understood our pain points before writing a single line of code. The result feels like it was built by someone who sat in our office for months."
  },
  "whatsapp-chatbot": {
    quote: "Bravild built us a bot that talks like us. Our customers don't even realise it's automated — that's how good it is.",
    name: "Rohan Mehta",
    role: "Owner, ServiceFirst",
    note: "They mapped our entire customer flow, asked the right questions, and delivered a working system in three weeks. Honest, fast, and zero hand-holding needed after launch."
  },
  "client-portal": {
    quote: "Bravild sat with our actual onboarding mess before writing any code. That's rare — and it shows in the final product.",
    name: "Priya Sharma",
    role: "Operations Lead",
    note: "They treated our problem like their own. No unnecessary features, no bloat — just a clean system that does exactly what we need, built by people who clearly care about the craft."
  },
  "salon-website": {
    quote: "They designed something that feels like us — not a template, not generic. Bravild captured our vibe perfectly.",
    name: "Sana Kapoor",
    role: "Founder",
    note: "Working with Bravild felt personal. They took the time to understand our brand, our clients, and what makes our space special. The website now does the selling for us."
  },
  "car-detailing": {
    quote: "Bravild gave us a website that actually converts. People book before they even call us now.",
    name: "Arjun Patel",
    role: "Owner",
    note: "They didn't just make it look good — they thought about how our customers think. The gallery, the pricing flow, everything was designed to move people from browsing to booking."
  },
  "photography-studio": {
    quote: "Bravild understood that for us, speed and quality can't be a trade-off. They delivered both.",
    name: "Himanshu Chopra",
    role: "Founder, CineStories",
    note: "Every photographer I know struggles with slow portfolios. Bravild solved it without compromising a single pixel of image quality. The site feels as premium as the work it shows."
  },
  "form-builder": {
    quote: "Bravild built us a tool that our entire team adopted in a day. No training, no support tickets — it just works.",
    name: "Neha Gupta",
    role: "Product Manager",
    note: "What impressed me most was their product thinking. They didn't just code what we asked — they challenged our assumptions and built something better than what we imagined."
  },
  "email-automation": {
    quote: "Bravild gave us enterprise-level automation without the enterprise price tag. The ROI was immediate.",
    name: "Vikram Rao",
    role: "Head of Marketing",
    note: "They understood our budget constraints and still delivered something powerful. The system runs itself now, and we've saved more in the first month than the entire project cost."
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
function CaseSlider({ images, name, bg, imageFit = "contain", imagePositions = {} }: { images: string[]; name: string; bg?: string; imageFit?: "cover" | "contain"; imagePositions?: Record<number, string> }) {
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
            <div key={i} className="pr-3 md:pr-5 shrink-0 flex items-center">
              <div 
                className="relative w-[92vw] md:w-[70vw] aspect-[16/10] max-h-[70vh] md:max-h-[calc(100vh-10rem)] rounded-xl md:rounded-2xl overflow-hidden flex items-center justify-center"
                style={{ backgroundColor: bg || 'rgba(0,0,0,0.03)' }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={src}
                    alt={`${name} — view ${(i % images.length) + 1}`}
                    fill
                    sizes="(max-width: 768px) 92vw, 70vw"
                    className={`${imageFit === "contain" ? "object-contain" : "object-cover"} select-none pointer-events-none`}
                    style={imagePositions[i % images.length] ? { objectPosition: imagePositions[i % images.length] } : undefined}
                    priority={i >= images.length && i < images.length + 2}
                  />
                </div>
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
        <CaseSlider images={project.images} name={project.name} bg={project.imageBg} imageFit={(project as any).imageFit} imagePositions={(project as any).imagePositions} />
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
                  {num && <span className="text-xl md:text-4xl font-bold font-mont tracking-tight text-black">{num}</span>}
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
          <h2 className="reveal-up text-xl md:text-3xl lg:text-4xl font-mont font-semibold tracking-tight leading-none uppercase">
            Words from the Client
          </h2>
          <div className="reveal-up border-t border-black/15 mt-8 mb-14" />

          <div className="grid lg:grid-cols-2 gap-14 lg:gap-24 items-start">
            <div className="reveal-up">
              <span className="block font-serif text-5xl md:text-7xl leading-[0.5] mb-6 md:mb-8 select-none">“</span>
              <blockquote className="text-lg md:text-3xl font-light font-serif italic leading-relaxed tracking-tight max-w-[580px] text-[#1d1d20]">
                “{testimonial.quote}”
              </blockquote>
              <div className="border-b border-dashed border-black/25 w-2/3 my-8 md:my-10" />
              <p className="font-bold font-mont text-sm md:text-base">{testimonial.name}</p>
              <p className="text-xs md:text-sm opacity-55 mt-1">{testimonial.role}</p>
            </div>

            <div className="reveal-up">
              <p className="text-sm md:text-lg font-serif font-light leading-[1.8] opacity-60 max-w-[560px]">
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

        {/* Mobile: same horizontal layout, just smaller */}
        <div className="md:hidden mt-4 overflow-x-auto">
          <svg viewBox="0 0 900 260" className="w-full h-auto min-w-[320px]" fill="none" aria-label="Three tangled lines enter a black square and leave as one straight, measured line ending in a small square">
            {/* the tangle */}
            <path className="d-strand" pathLength={1} strokeWidth="2.5" strokeOpacity="0.45"
              d="M18,70 C75,15 95,135 165,80 C225,30 205,105 245,80 C270,65 280,100 310,100"/>
            <path className="d-strand" pathLength={1} strokeWidth="2" strokeOpacity="0.34"
              d="M18,120 C55,170 100,60 155,120 C195,165 215,70 255,110 C275,130 285,115 310,115"/>
            <path className="d-strand" pathLength={1} strokeWidth="1.8" strokeOpacity="0.26"
              d="M18,170 C60,95 120,185 185,140 C240,105 225,150 270,130 C290,120 295,125 310,125"/>

            {/* the machine */}
            <rect x="310" y="80" width="70" height="70" fill={INK}/>
            <g className="d-core">
              <rect className="core-spin" x="337" y="107" width="16" height="16"/>
            </g>

            {/* the measured line */}
            <line className="d-clean" pathLength={1} x1="380" y1="118" x2="833" y2="118"/>
            <line className="d-tick" x1="480" y1="122" x2="480" y2="130"/>
            <line className="d-tick" x1="570" y1="122" x2="570" y2="130"/>
            <line className="d-tick" x1="660" y1="122" x2="660" y2="130"/>
            <line className="d-tick" x1="750" y1="122" x2="750" y2="130"/>
            <rect className="d-cap" x="833" y="115" width="10" height="10"/>

            {/* revenue packet */}
            <rect className="d-packet d-packet-x" x="487" y="117" width="6" height="6"/>

            {/* annotations */}
            <text className="note d-fade" x="60" y="22">{'// manual chaos'}</text>
            <text className="note d-fade" x="843" y="96" textAnchor="end">{'// measured monthly'}</text>

            {/* labels */}
            <text className="lbl d-fade" x="60" y="245">Your busywork</text>
            <text className="lbl d-fade" x="450" y="245" textAnchor="middle">Bravild</text>
            <text className="lbl lbl-strong d-fade" x="843" y="245" textAnchor="end">Revenue</text>
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
