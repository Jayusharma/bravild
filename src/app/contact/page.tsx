"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, X } from "lucide-react";
import { useTheme } from "@/provider/ThemeContext";

// Curated FAQ data matching the clean layout in the reference
interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqsData: FAQItem[] = [
  {
    id: "faq-1",
    question: "What is the initial architecture audit?",
    answer: "A focused technical diagnostic where we map your business bottlenecks, data flows, and operational leaks. We deliver a three-step fix plan and fixed-scope blueprint before a single line of production code is written."
  },
  {
    id: "faq-2",
    question: "How much does a project cost?",
    answer: "We operate on a strictly fixed-scope, fixed-price model with no hourly surprises. Engagements typically start at $5,000 for focused web platforms and automated pipelines, scaling to $20,000–$40,000+ for comprehensive enterprise AI architectures."
  },
  {
    id: "faq-3",
    question: "Do I have to sign a long-term contract?",
    answer: "No. Projects are structured in discrete, milestone-based sprint agreements. You approve each phase independently — no forced lock-in or recurring retainers unless you explicitly request ongoing post-launch scaling."
  },
  {
    id: "faq-4",
    question: "Who owns my code, accounts, and IP?",
    answer: "You do — 100%. Upon project completion, all source code repositories, databases, AI configurations, and design assets belong strictly to your company. We enforce zero vendor lock-in."
  },
  {
    id: "faq-5",
    question: "How fast will I see results?",
    answer: "Most platforms and automation tools go live on staging within 2 to 4 weeks. We work in fast weekly sprint releases on your real data, meaning you see tangible progress from week one."
  },
  {
    id: "faq-6",
    question: "Which industries do you work with?",
    answer: "We partner with high-growth businesses, modern service companies, and digital ventures looking to automate manual customer interactions, workflow bottlenecks, and high-conversion web platforms."
  },
  {
    id: "faq-7",
    question: "What does post-launch support look like?",
    answer: "Every build includes a 30-day warranty covering live uptime monitoring, bug fixes, and performance tuning. Afterward, optional monthly retention partnerships are available for continuous iteration."
  }
];

export default function ContactAndFAQPage() {
  const { setTheme } = useTheme();

  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // FAQ Accordion State (first open by default as in reference)
  const [openFaq, setOpenFaq] = useState<string | null>("faq-1");

  // Ensure light theme for clean minimal aesthetic
  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    const fullMessage = `
[NEW INQUIRY VIA BRAVILD CONTACT PAGE]

• Name: ${firstName} ${lastName}
• Email: ${email}
• Phone: ${phone || "Not provided"}

• Message:
${message}
    `.trim();

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          email,
          message: fullMessage,
          website: String(new FormData(e.currentTarget as HTMLFormElement).get("website") ?? "")
        })
      });

      if (res.ok) {
        setStatus("success");
        setFirstName("");
        setLastName("");
        setPhone("");
        setEmail("");
        setMessage("");
        setTimeout(() => setStatus("idle"), 6000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 5000);
      }
    } catch (err) {
      console.error("Submission error:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-[#dfdff2] text-[#171717] selection:bg-black/15 font-sans pt-28 md:pt-36">
      
      {/* ===================== TICKER / MARQUEE BANNER ===================== */}
      <div className="w-full overflow-hidden border-b border-dashed border-black/20 select-none py-6 md:py-10">
        <div className="animate-marquee flex items-center gap-10 md:gap-16 whitespace-nowrap text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-normal tracking-tight text-black">
          <span>Connect <span className="font-light">→</span></span>
          <span>Connect <span className="font-light">→</span></span>
          <span>Connect <span className="font-light">→</span></span>
          <span>Connect <span className="font-light">→</span></span>
          <span>Connect <span className="font-light">→</span></span>
          <span>Connect <span className="font-light">→</span></span>
          <span>Connect <span className="font-light">→</span></span>
          <span>Connect <span className="font-light">→</span></span>
        </div>
      </div>

      {/* ===================== MINIMAL CONTACT FORM ===================== */}
      <section className="border-b border-dashed border-black/20">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24">
          <form onSubmit={handleSubmit} className="w-full max-w-4xl">
            {/* Honeypot: hidden from people, bots fill it */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
            />
            
            {/* Field: FIRST NAME */}
            <div className="border-b border-dashed border-black/20 py-6 md:py-8 group focus-within:border-black/50 transition-colors">
              <label className="text-[11px] md:text-xs font-mono uppercase tracking-widest text-black/60 block mb-2">
                FIRST NAME <span className="text-[#e63946]">*</span>
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                className="w-full bg-transparent text-xl md:text-2xl text-black placeholder:text-black/30 focus:outline-none transition-colors"
              />
            </div>

            {/* Field: LAST NAME */}
            <div className="border-b border-dashed border-black/20 py-6 md:py-8 group focus-within:border-black/50 transition-colors">
              <label className="text-[11px] md:text-xs font-mono uppercase tracking-widest text-black/60 block mb-2">
                LAST NAME <span className="text-[#e63946]">*</span>
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                className="w-full bg-transparent text-xl md:text-2xl text-black placeholder:text-black/30 focus:outline-none transition-colors"
              />
            </div>

            {/* Field: PHONE NUMBER */}
            <div className="border-b border-dashed border-black/20 py-6 md:py-8 group focus-within:border-black/50 transition-colors">
              <label className="text-[11px] md:text-xs font-mono uppercase tracking-widest text-black/60 block mb-2">
                PHONE NUMBER <span className="text-black/30">(Optional)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-transparent text-xl md:text-2xl text-black placeholder:text-black/30 focus:outline-none transition-colors"
              />
            </div>

            {/* Field: EMAIL */}
            <div className="border-b border-dashed border-black/20 py-6 md:py-8 group focus-within:border-black/50 transition-colors">
              <label className="text-[11px] md:text-xs font-mono uppercase tracking-widest text-black/60 block mb-2">
                EMAIL <span className="text-[#e63946]">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-transparent text-xl md:text-2xl text-black placeholder:text-black/30 focus:outline-none transition-colors"
              />
            </div>

            {/* Field: MESSAGE */}
            <div className="border-b border-dashed border-black/20 py-6 md:py-8 group focus-within:border-black/50 transition-colors">
              <label className="text-[11px] md:text-xs font-mono uppercase tracking-widest text-black/60 block mb-2">
                MESSAGE <span className="text-[#e63946]">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your project, timeline, or objectives..."
                className="w-full bg-transparent text-xl md:text-2xl text-black placeholder:text-black/30 focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Submit Action: Curved Black Bubble Button */}
            <div className="pt-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-9 py-4 rounded-full bg-black text-white text-sm md:text-base font-medium tracking-wide hover:bg-black/85 active:scale-95 transition-all duration-200 cursor-pointer shadow-md flex items-center gap-3 disabled:opacity-50"
              >
                <span>
                  {status === "loading"
                    ? "Sending..."
                    : status === "success"
                    ? "Message Dispatched"
                    : status === "error"
                    ? "Error — Try Again"
                    : "Send Message"}
                </span>
                <span className="text-lg">→</span>
              </button>

              {status === "success" && (
                <p className="text-sm font-mono text-black/70">
                  {"// Received. We will reply to your inbox within hours."}
                </p>
              )}
              {status === "error" && (
                <p className="text-sm font-mono text-[#e63946]">
                  {"// Transmission failed. Please email connect@bravild.in directly."}
                </p>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* ===================== FAQ SECTION ===================== */}
      <section id="faq" className="py-24 md:py-36">
        <div className="max-w-[1500px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            
            {/* Left Column: Heading & Subtitle */}
            <div className="lg:col-span-5 lg:sticky lg:top-36">
              {/* Title */}
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-black leading-[1.05] mb-4">
                Questions,<br />
                answered<span className="text-[#ff4400]">.</span>
              </h2>

              {/* Subtitle */}
              <p className="text-base md:text-lg text-black/60 font-normal leading-relaxed">
                Can&apos;t find yours? Call us and ask.
              </p>
            </div>

            {/* Right Column: Minimal Dashed Accordion */}
            <div className="lg:col-span-7 border-t border-dashed border-black/20">
              {faqsData.map((faq) => {
                const isOpen = openFaq === faq.id;

                return (
                  <div
                    key={faq.id}
                    className="border-b border-dashed border-black/20 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                      className="w-full py-6 md:py-7 flex items-center justify-between text-left gap-6 cursor-pointer group"
                      aria-expanded={isOpen}
                    >
                      <span className="text-lg md:text-xl font-normal text-black tracking-tight group-hover:opacity-70 transition-opacity">
                        {faq.question}
                      </span>

                      {/* Circle Plus / Cross Toggle */}
                      <span className="shrink-0 w-8 h-8 rounded-full border border-black/30 flex items-center justify-center text-black/70 group-hover:border-black group-hover:text-black transition-colors bg-black/[0.02]">
                        {isOpen ? (
                          <X className="w-4 h-4 stroke-[1.5]" />
                        ) : (
                          <Plus className="w-4 h-4 stroke-[1.5]" />
                        )}
                      </span>
                    </button>

                    {/* Smooth Expandable Answer */}
                    <div
                      className={`grid transition-[grid-template-rows] duration-250 ease-out ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="text-base md:text-lg text-black/70 font-normal leading-relaxed pb-7 max-w-2xl">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
