"use client"

import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowRight } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
    const containerRef = useRef<HTMLDivElement>(null)
    const formRef = useRef<HTMLFormElement>(null)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    })
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus("loading")

        try {
            const res = await fetch("/api/send", {
                method: "POST",
                body: JSON.stringify({
                    ...formData,
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    message: formData.message.trim(),
                    website: String(new FormData(e.currentTarget as HTMLFormElement).get("website") ?? ""),
                }),
                headers: { "Content-Type": "application/json" },
            })

            if (res.ok) {
                setStatus("success")
                setFormData({ name: "", email: "", message: "" })
                setTimeout(() => setStatus("idle"), 3000)
            } else {
                setStatus("error")
                setTimeout(() => setStatus("idle"), 3000)
            }
        } catch (error) {
            console.error("Submission error:", error)
            setStatus("error")
            setTimeout(() => setStatus("idle"), 3000)
        }
    }

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate form elements
            gsap.fromTo(".contact-anim",
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 60%",
                    }
                }
            )
        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <div id="contact" ref={containerRef} className="relative min-h-[85vh] text-white py-28 md:py-36 px-6 md:px-20 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-start">
                    {/* Left Column: Heading & Tag */}
                    <div className="contact-anim">
                      <div className="flex items-center gap-4 mb-6">
                        <span className="h-[1px] w-8 bg-white/20"></span>
                        <span className="text-base font-serif italic text-gray-500">Contact</span>
                      </div>
                      <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-mont text-white leading-tight mb-8">
                        GOT AN IDEA?
                      </h1>
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-white/50 hover:text-white transition-colors group px-3.5 py-1.5 rounded-full border border-white/10 hover:border-white/30 bg-white/[0.02]"
                      >
                        <span>Explore Dedicated Contact & FAQ</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>

                    {/* Right Column: Form (same size and right-aligned as before) */}
                    <div className="w-full px-2">
                      <form ref={formRef} onSubmit={handleSubmit} className="space-y-12">
                        {/* Honeypot: hidden from people, bots fill it */}
                        <input
                          type="text"
                          name="website"
                          tabIndex={-1}
                          autoComplete="off"
                          aria-hidden="true"
                          className="absolute left-[-9999px] h-0 w-0 opacity-0"
                        />
                        <div className="contact-anim group relative">
                          <input
                            type="text"
                            required
                            placeholder="What's your name?"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-transparent border-b border-white/20 py-6 text-xl md:text-2xl font-mont text-white placeholder:text-gray-600 focus:outline-none focus:border-white transition-colors duration-300"
                          />
                          <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-500 group-hover:w-full group-focus-within:w-full" />
                        </div>

                        <div className="contact-anim group relative">
                          <input
                            type="email"
                            required
                            placeholder="Your email address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-transparent border-b border-white/20 py-6 text-xl md:text-2xl font-mont text-white placeholder:text-gray-600 focus:outline-none focus:border-white transition-colors duration-300"
                          />
                          <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-500 group-hover:w-full group-focus-within:w-full" />
                        </div>

                        <div className="contact-anim group relative">
                          <input
                            type="text"
                            required
                            placeholder="Tell us about your project"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full bg-transparent border-b border-white/20 py-6 text-md md:text-2xl font-mont text-white placeholder:text-gray-600 focus:outline-none focus:border-white transition-colors duration-300"
                          />
                          <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-500 group-hover:w-full group-focus-within:w-full" />
                        </div>

                        <div className="contact-anim pt-6">
                          <button
                            type="submit"
                            disabled={status === "loading"}
                            className="group relative px-12 py-5 bg-white text-black font-bold font-mont tracking-wider uppercase rounded-full overflow-hidden transition-all hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 cursor-pointer shadow-lg"
                          >
                            <span className="relative z-10 flex items-center gap-3">
                              {status === "loading" ? "Sending..." : status === "success" ? "Message Sent!" : status === "error" ? "Error, Try Again" : "Send Message"}
                              {status === "idle" && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                            </span>
                            <div className={`absolute inset-0 ${status === "success" ? "bg-green-500" : status === "error" ? "bg-red-500" : "bg-gray-200"} transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500`} />
                          </button>
                        </div>
                      </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
