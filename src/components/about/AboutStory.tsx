"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// TODO: replace with the founder's own words.
const story =
  "Bravild started with a simple frustration: good businesses losing hours and money to work a machine could do. So we stopped selling decks and started building. We are a small team on purpose. You talk to the people who build the thing, we ship in weeks, and we stay until the numbers prove it paid for itself.";

export default function AboutStory() {
  const ref = useRef<HTMLElement>(null);
  const words = story.split(" ");

  useEffect(() => {
    if (!ref.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) return;
      gsap.fromTo(
        ".about-story-word",
        { opacity: 0.15 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".about-story-text",
            start: "top 85%",
            end: "bottom 55%",
            scrub: 0.4,
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="px-6 sm:px-10 md:px-16 lg:px-20 py-16 md:py-24 max-w-[1600px] mx-auto"
    >
      <div className="grid md:grid-cols-12 gap-6 md:gap-10">
        <p className="md:col-span-3 font-mono text-xs uppercase tracking-[0.25em] text-white/45">
          Our story
        </p>
        <p className="about-story-text md:col-span-8 md:col-start-5 text-[clamp(1.05rem,1.7vw,1.4rem)] font-normal leading-[1.6] text-white">
          {words.map((w, i) => (
            <span key={i} className="about-story-word">
              {w}{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
