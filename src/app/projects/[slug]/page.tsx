"use client"

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, ExternalLink, Github, Zap, Check } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Link from 'next/link'

gsap.registerPlugin(ScrollTrigger)

// Project data - each project has its own details
const projectsData = {
  "whatsapp-chatbot": {
    name: "WhatsApp Chatbot",
    tagline: "AI-Powered Customer Engagement",
    category: "AUTOMATION",
    date: "October 2024",
    duration: "3 weeks",
    status: "Active ",
    description: "An intelligent WhatsApp chatbot built with n8n automation platform that revolutionizes customer communication. This solution provides 24/7 automated responses, smart appointment scheduling, and seamless integration with business tools.",
    challenge: "Businesses struggled with manual customer support on WhatsApp, leading to delayed responses and missed opportunities. The challenge was to create an intelligent system that could handle multiple conversations simultaneously while maintaining a personal touch.",
    solution: "Developed a sophisticated n8n automation workflow that integrates with WhatsApp Business API, natural language processing, and a custom database. The bot intelligently routes queries, provides instant responses, and escalates complex issues to human agents.",
    impact: [
      "95% reduction in response time",
      "300+ conversations handled daily",
      "85% customer satisfaction rate",
      "60% decrease in support costs"
    ],
    technologies: [
      { name: "n8n", icon: "⚡" },
      { name: "WhatsApp API", icon: "💬" },
      { name: "Node.js", icon: "🟢" },
      { name: "postgress", icon: "📥" },
      { name: "OpenAI", icon: "🤖" },
      { name: "Webhook", icon: "🔗" }
    ],
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
    description: "A comprehensive client onboarding and management portal designed to streamline agency operations. Features include secure file uploads, automated invoice generation, real-time project status updates, and centralized communication channels.",
    challenge: "Managing client interactions via email and disparate tools led to communication gaps, lost files, and payment delays. The agency needed a centralized hub to manage the entire client lifecycle from onboarding to offboarding.",
    solution: "Built a robust Next.js application with role-based access control. Implemented a secure file management system using AWS S3, automated invoicing with Stripe integration, and a real-time activity feed using WebSockets.",
    impact: [
      "40% reduction in admin time",
      "Zero lost files or missed invoices",
      "100% client onboarding satisfaction",
      "Faster payment processing"
    ],
    technologies: [
      { name: "Next.js", icon: "⚛️" },
      { name: "Supabase", icon: "🔥" },
      { name: "Tailwind", icon: "🎨" },
      { name: "Stripe", icon: "💳" },
      { name: "AWS S3", icon: "☁️" },
      { name: "Resend", icon: "📧" }
    ],
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
      "/port1.png",
      "/port2.png",
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
    description: "A modern, responsive website for a premium salon featuring online booking system, service gallery, stylist profiles, and customer reviews. Built with elegant animations and mobile-first approach for the best user experience.",
    challenge: "The salon needed a digital presence that matched their premium brand while providing an easy booking experience. Traditional appointment systems were cumbersome and didn't showcase their services effectively.",
    solution: "Created a stunning website with Next.js featuring real-time appointment booking, interactive service galleries, stylist profiles with expertise areas, and an integrated review system. The design emphasizes visual appeal while maintaining functionality.",
    impact: [
      "200% increase in online bookings",
      "50% reduction in phone inquiries",
      "90% positive customer feedback",
      "300+ new clients in first month"
    ],
    technologies: [
      { name: "Next.js", icon: "⚛️" },
      { name: "Tailwind CSS", icon: "🎨" },
      { name: "TypeScript", icon: "📘" },
      { name: "Framer Motion", icon: "✨" },
      { name: "Stripe", icon: "💳" },
      { name: "Vercel", icon: "▲" }
    ],
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
    description: "Professional car detailing service website with stunning before/after galleries, service packages, online booking, and pricing calculator. Features high-quality visuals and smooth user experience that converts visitors into customers.",
    challenge: "Car detailing services needed to visually demonstrate their quality and make it easy for customers to understand packages and pricing. Most competitors had outdated websites that didn't showcase their work effectively.",
    solution: "Designed a visually striking website with large before/after image sliders, interactive package comparisons, and a dynamic pricing calculator. Integrated booking system with vehicle type selection and service customization.",
    impact: [
      "150% increase in quote requests",
      "80% of visitors view gallery",
      "45% conversion rate improvement",
      "40% higher average booking value"
    ],
    technologies: [
      { name: "React", icon: "⚛️" },
      { name: "GSAP", icon: "🎬" },
      { name: "Tailwind", icon: "🎨" },
      { name: "Cloudinary", icon: "☁️" },
      { name: "Calendly", icon: "📅" },
      { name: "Netlify", icon: "🌐" }
    ],
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
    description: "Portfolio website for a photography studio showcasing high-resolution galleries, client testimonials, package options, and contact forms. Optimized for visual storytelling with lazy-loading images and immersive viewing experience.",
    challenge: "Photographers needed a platform that would showcase their work in the best possible quality while maintaining fast load times. The site needed to handle hundreds of high-resolution images without performance issues.",
    solution: "Built a custom image optimization pipeline with progressive loading, implemented masonry gallery layouts, and created an immersive full-screen viewing mode. Added smart categorization and filtering for easy navigation through different photography styles.",
    impact: [
      "500+ high-res images optimized",
      "2 second average page load",
      "70% increase in inquiries",
      "Featured in design awards"
    ],
    technologies: [
      { name: "Next.js", icon: "⚛️" },
      { name: "Sharp", icon: "📸" },
      { name: "Lightbox", icon: "🖼️" },
      { name: "Sanity CMS", icon: "📝" },
      { name: "cloud s3", icon: "☁️" },
      { name: "Vercel", icon: "▲" }
    ],
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
    description: "A dynamic drag-and-drop form builder application allowing users to create custom forms without coding. Features include real-time preview, conditional logic, data validation, and export capabilities with webhook integrations.",
    challenge: "Non-technical users needed a way to create complex forms with conditional logic and validation rules without hiring developers. Existing solutions were either too simple or too complex with steep learning curves.",
    solution: "Developed an intuitive drag-and-drop interface with visual conditional logic builder. Implemented real-time preview, data validation engine, and flexible export options. Added webhook integrations for connecting forms to various services.",
    impact: [
      "1000+ forms created by users",
      "15-minute average build time",
      "95% user satisfaction score",
      "Zero coding knowledge required"
    ],
    technologies: [
      { name: "React", icon: "⚛️" },
      { name: "DnD Kit", icon: "🎯" },
      { name: "Zustand", icon: "🐻" },
      { name: "PostgreSQL", icon: "🐘" },
      { name: "Webhook.site", icon: "🔗" },
      { name: "Docker", icon: "🐳" }
    ],
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
    description: "Sophisticated email marketing automation system built with n8n. Includes drip campaigns, personalized templates, A/B testing, analytics dashboard, and CRM integration for targeted outreach and customer engagement.",
    challenge: "Businesses needed an affordable email automation solution that could compete with expensive enterprise platforms. The system needed to handle complex workflows while remaining easy to set up and manage.",
    solution: "Created a comprehensive n8n workflow system with visual campaign builders, template engines, and advanced segmentation. Integrated with popular email providers and CRMs. Built custom analytics dashboard for tracking performance metrics.",
    impact: [
      "10,000+ emails sent daily",
      "42% average open rate",
      "18% click-through rate",
      "80% cost savings vs alternatives"
    ],
    technologies: [
      { name: "n8n", icon: "⚡" },
      { name: "SendGrid", icon: "📧" },
      { name: "Redis", icon: "🔴" },
      { name: "PostgreSQL", icon: "🐘" },
      { name: "Chart.js", icon: "📊" },
      { name: "Docker", icon: "🐳" }
    ],
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

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [activeImage, setActiveImage] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const detailsRef = useRef<HTMLDivElement>(null)

  // Get the project data based on slug
  const project = projectsData[slug as keyof typeof projectsData]

  useEffect(() => {
    if (!project) return

    const tl = gsap.timeline()

    // Hero Animations
    const heroElements = heroRef.current?.querySelectorAll('.hero-anim')
    if (heroElements) {
      tl.fromTo(heroElements,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }
      )
    }

    // Image Section Animation
    gsap.fromTo(imageRef.current,
      { scale: 0.95, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: imageRef.current,
          start: "top 80%",
        }
      }
    )

    // Details Section Animation
    const detailElements = detailsRef.current?.querySelectorAll('.detail-anim')
    if (detailElements) {
      gsap.fromTo(detailElements,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: detailsRef.current,
            start: "top 80%",
          }
        }
      )
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [project])

  // If project doesn't exist, show 404
  if (!project) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center font-mont">
        <div className="text-center">
          <h1 className="text-6xl font-black mb-4">404</h1>
          <p className="text-gray-400 mb-8 font-rayl">Project not found</p>
          <button
            onClick={() => router.push('/')}
            className="px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] text-white selection:bg-white/20 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center mix-blend-difference">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold font-mont tracking-widest uppercase">Back</span>
        </button>
      </nav>

      {/* Hero Section */}
      <div ref={heroRef} className="relative min-h-[80vh] flex flex-col justify-center px-6 md:px-20 pt-32 pb-20">
        <div className="max-w-7xl">
          <div className="hero-anim flex flex-wrap items-center gap-6 mb-8">
            <span className="px-4 py-1 border border-white/20 text-white/60 text-xs font-bold font-rayl tracking-[0.2em] rounded-full uppercase">
              {project.category}
            </span>
            <div className="flex items-center gap-2 px-4 py-1 border border-green-500/20 bg-green-500/5 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-green-500 text-xs font-bold font-rayl tracking-widest uppercase">{project.status}</span>
            </div>
          </div>

          <div className="hero-anim mb-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-mont text-white leading-[0.9] tracking-tight">
              {project.name}
            </h1>
          </div>

          <p className="hero-anim text-xl md:text-3xl text-gray-400 font-rayl font-bold max-w-3xl mb-12 leading-relaxed">
            {project.tagline}
          </p>

          <div className="hero-anim flex flex-wrap gap-12 text-sm font-mont tracking-wider text-gray-500 uppercase">
            <div>
              <span className="block text-xs text-gray-600 mb-2">Date</span>
              <span className="text-white">{project.date}</span>
            </div>
            <div>
              <span className="block text-xs text-gray-600 mb-2">Duration</span>
              <span className="text-white">{project.duration}</span>
            </div>
            <div>
              <span className="block text-xs text-gray-600 mb-2">Role</span>
              <span className="text-white">Design & Development</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Image Gallery */}
      <div ref={imageRef} className="px-6 md:px-20 mb-32">
        <div className="max-w-[1920px] mx-auto">
          <div className="relative aspect-video w-full bg-gray-900 rounded-lg overflow-hidden mb-6 group">
            <Image
              src={project.images[activeImage]}
              alt={`${project.name} view`}
              fill
              className="object-contain transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {project.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`relative aspect-video rounded-lg overflow-hidden transition-all duration-500 ${activeImage === index
                  ? 'opacity-100 ring-1 ring-white'
                  : 'opacity-40 hover:opacity-80'
                  }`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-contain"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div ref={detailsRef} className="px-6 md:px-20 mb-32">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.5fr] gap-20">
          <div className="space-y-12">
            <div className="detail-anim">
              <h3 className="text-sm font-bold font-rayl tracking-[0.2em] text-gray-500 uppercase mb-6">Overview</h3>
              <p className="text-lg md:text-xl text-gray-300 font-mont leading-relaxed">
                {project.description}
              </p>
            </div>

            <div className="detail-anim">
              <h3 className="text-sm font-bold font-rayl tracking-[0.2em] text-gray-500 uppercase mb-6">Technologies</h3>
              <div className="flex flex-wrap gap-3">
                {project.technologies.map((tech, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-mont text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all"
                  >
                    <span className="mr-2">{tech.icon}</span>
                    {tech.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-anim flex flex-col gap-4 pt-8">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between px-8 py-6 bg-white text-black rounded-lg hover:bg-gray-200 transition-all duration-300"
                >
                  <span className="font-bold font-mont tracking-wider uppercase">View Live Project</span>
                  <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between px-8 py-6 bg-transparent border border-white/20 text-white rounded-lg hover:bg-white/5 transition-all duration-300"
                >
                  <span className="font-bold font-mont tracking-wider uppercase">View Source Code</span>
                  <Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </a>
              )}
            </div>
          </div>

          <div className="space-y-16">
            <div className="detail-anim">
              <h3 className="text-3xl font-bold font-mont mb-8">The Challenge</h3>
              <p className="text-gray-400 text-lg leading-relaxed font-mont">
                {project.challenge}
              </p>
            </div>

            <div className="detail-anim">
              <h3 className="text-3xl font-bold font-mont mb-8">The Solution</h3>
              <p className="text-gray-400 text-lg leading-relaxed font-mont mb-12">
                {project.solution}
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {project.features.map((feature, index) => (
                  <div key={index} className="p-6 bg-white/5 border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                    <h4 className="font-bold font-mont text-white mb-2">{feature.title}</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-anim">
              <div className="p-8 bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-2xl">
                <h3 className="text-xl font-bold font-mont mb-6 flex items-center gap-3">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Impact & Results
                </h3>
                <div className="space-y-4">
                  {project.impact.map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-green-500" />
                      </div>
                      <span className="text-gray-300 font-mont">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps / CTA Section */}
      <div className="border-t border-gray-900 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 md:px-20 py-40">
          <div className="grid lg:grid-cols-2 gap-20 items-end">
            <div>
              <p className="text-[13px] tracking-[0.3em] text-gray-500 mb-8 font-light">
                ( NEXT STEPS )
              </p>
              <h2 className="text-6xl md:text-8xl font-light leading-[0.9] tracking-tight mb-8">
                READY TO<br />
                SCALE?
              </h2>
              <p className="text-gray-400 text-lg max-w-md font-light leading-relaxed">
                Let&apos;s turn your vision into a high-performing digital reality. No fluff, just results.
              </p>
            </div>

            <div className="flex flex-col gap-6 items-start lg:items-end">
              <Link href="/#contact" className="w-full lg:w-auto">
                <button className="w-full lg:w-auto px-16 py-6 border border-white text-[13px] tracking-[0.2em] font-light hover:bg-white hover:text-black transition-all duration-300 uppercase">
                  Start a Project
                </button>
              </Link>
              <Link href="/" className="w-full lg:w-auto">
                <button className="w-full lg:w-auto px-16 py-6 text-[13px] tracking-[0.2em] font-light text-gray-500 hover:text-white transition-colors duration-300 uppercase">
                  View More Projects
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}