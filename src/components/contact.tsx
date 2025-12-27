"use client"

import { useRef, useEffect, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowRight } from "lucide-react"


gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
    const containerRef = useRef<HTMLDivElement>(null)
    const formRef = useRef<HTMLFormElement>(null)
    const infoRef = useRef<HTMLDivElement>(null)
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
                body: JSON.stringify(formData),
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

            // Animate info elements
            gsap.fromTo(".info-anim",
                { x: 50, opacity: 0 },
                {
                    x: 0,
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
        <div id="contact" ref={containerRef} className="relative min-h-screen text-white py-32 px-6 md:px-20 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-24 contact-anim">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="h-[1px] w-12 bg-white/20"></span>
                        <span className="text-sm font-rayl tracking-[0.3em] text-gray-500 uppercase">Contact</span>
                    </div>
                    <h1 className="text-4xl md:text-8xl lg:text-9xl font-black font-mont text-white leading-[0.9]">
                        LET&apos;S TALK
                    </h1>
                </div>

                <div className="grid lg:grid-cols-2 gap-20 lg:gap-32">
                    {/* Form Section */}
                    <div className="w-full px-2">
                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-12">
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
                                    placeholder="Tell me about your project"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-transparent border-b border-white/20 py-6 text-xl md:text-2xl font-mont text-white placeholder:text-gray-600 focus:outline-none focus:border-white transition-colors duration-300"
                                />
                                <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-500 group-hover:w-full group-focus-within:w-full" />
                            </div>

                            <div className="contact-anim pt-8">
                                <button
                                    type="submit"
                                    disabled={status === "loading"}
                                    className="group relative px-12 py-6 bg-white text-black font-bold font-mont tracking-wider uppercase rounded-full overflow-hidden transition-all hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
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

                    {/* Info Section */}
                    <div ref={infoRef} className="space-y-16">
                        <div className="info-anim">
                            <p className="text-xl md:text-2xl text-gray-400 font-rayl leading-relaxed mb-12">
                                We&apos;re here to help you with your next project. If you have a project that needs some creative injection, then that&apos;s where I come in!
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="info-anim group cursor-pointer">
                                <h3 className="text-xl font-rayl tracking-[0.2em] text-gray-500 uppercase mb-2">Email</h3>
                                <a href="mailto:hello@example.com" className="text-xl md:text-2xl font-mont text-white group-hover:text-gray-300 transition-colors flex items-center gap-3">
                                    connect@bravild.in
                                    <ArrowRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                </a>
                            </div>

                            <div className="info-anim group cursor-pointer">
                                <h3 className="text-xl font-rayl tracking-[0.2em] text-gray-500 uppercase mb-2">Phone</h3>
                                <a href="tel:+1234567890" className="text-xl md:text-2xl font-mont  text-white group-hover:text-gray-300 transition-colors flex items-center gap-3">
                                    +91 9664086233
                                    <ArrowRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                </a>
                            </div>

                            <div className="info-anim group cursor-pointer">
                                <h3 className="text-xl font-rayl tracking-[0.2em] text-gray-500 uppercase mb-2">Socials</h3>
                                <div className="flex flex-wrap gap-6">
                                    {['LinkedIn', 'Twitter', 'Instagram', 'GitHub'].map((social) => (
                                        <a
                                            key={social}
                                            href="#"
                                            className="text-md font-mont font-bold text-white hover:text-gray-400 transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-white hover:after:w-full after:transition-all after:duration-300"
                                        >
                                            {social}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="info-anim pt-12 border-t border-white/10">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm text-gray-600 font-rayl">
                                <p>© 2024 BraWeb Agency. All rights reserved.</p>
                                <div className="flex gap-6">
                                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
