"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function AboutIntro() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) return;
      gsap.set(".about-intro-word", { yPercent: 110 });
      gsap.set(".about-intro-fade", { y: 12, opacity: 0 });
      gsap
        .timeline({ delay: 0.15 })
        .to(".about-intro-word", { yPercent: 0, duration: 1.1, ease: "power3.out", stagger: 0.12 })
        .to(".about-intro-fade", { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.6");
    }, ref);
    return () => ctx.revert();
  }, []);

  const lines = ["We build the quiet machines", "behind your business."];

  return (
    <section
      ref={ref}
      className="px-6 sm:px-10 md:px-16 lg:px-20 pt-36 md:pt-44 pb-10 md:pb-14 max-w-[1600px] mx-auto"
    >
      <div className="grid md:grid-cols-12 gap-6 md:gap-10">
        <p className="about-intro-fade md:col-span-3 font-mono text-xs uppercase tracking-[0.25em] text-white/45">
          About / Bravild®
        </p>
        <h1
          className="md:col-span-8 md:col-start-5 font-rayl font-bold tracking-tight leading-[1.1] text-[clamp(1.5rem,3vw,2.6rem)]"
          aria-label="We build the quiet machines behind your business."
        >
          {lines.map((l) => (
            <span key={l} className="block [clip-path:inset(0_-50vw)] pb-[0.08em]">
              <span className="about-intro-word block">{l}</span>
            </span>
          ))}
        </h1>
      </div>
    </section>
  );
}
