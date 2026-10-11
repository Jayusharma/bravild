"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { services, type Service } from "@/data/services";

gsap.registerPlugin(ScrollTrigger);

const pad = (n: number) => String(n).padStart(2, "0");

function Frame({ s, i }: { s: Service; i: number }) {
  if (s.image) {
    return <Image src={s.image} alt={s.title} fill sizes="(min-width:1024px) 30vw, 70vw" className="object-cover" />;
  }
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#1b1b1f] to-[#0c0c0e] flex items-end p-5">
      <span className="font-mont font-normal text-6xl lg:text-7xl text-white/10">{pad(i + 1)}</span>
    </div>
  );
}

export default function AboutServices() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const n = services.length;

  const commit = useCallback((i: number) => {
    if (activeRef.current !== i) {
      activeRef.current = i;
      setActive(i);
    }
  }, []);

  // Desktop: pinned stage, continuous horizontal travel driven by scroll
  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const stage = stageRef.current;
        if (!stage) return;
        const titles = gsap.utils.toArray<HTMLElement>(".svc-title", stage);
        const frames = gsap.utils.toArray<HTMLElement>(".svc-frame", stage);
        const bar = stage.querySelector<HTMLElement>(".svc-progress");

        const render = (p: number) => {
          const pos = p * (n - 1);
          gsap.set(trackRef.current, { xPercent: -(50 / n) - pos * (100 / n) });
          titles.forEach((t, i) => {
            const d = Math.abs(pos - i);
            gsap.set(t, { opacity: Math.max(0.2, 1 - d * 0.8) });
          });
          frames.forEach((f, i) => {
            const d = Math.abs(pos - i);
            const v = Math.max(0, 1 - d * 1.8);
            gsap.set(f, { opacity: v, yPercent: (1 - v) * 6 });
          });
          if (bar) gsap.set(bar, { scaleX: p });
          commit(Math.round(pos));
        };
        render(0);

        ScrollTrigger.create({
          trigger: stage,
          start: "10% top",
          end: `+=${(n - 1) * 70}%`,
          pin: true,
          scrub: true,
         
          onUpdate: (self) => render(self.progress),
        });
      });
      return () => mm.revert();
    }, rootRef);
    return () => ctx.revert();
  }, [n, commit]);

  // Mobile: native snap carousel, centre card is active
  const onCarouselScroll = () => {
    const el = carouselRef.current;
    const card = el?.querySelector<HTMLElement>(".svc-card");
    if (!el || !card) return;
    const stride = card.offsetWidth + 16;
    commit(Math.min(n - 1, Math.max(0, Math.round(el.scrollLeft / stride))));
  };

  const go = (dir: number) => {
    const el = carouselRef.current;
    const card = el?.querySelector<HTMLElement>(".svc-card");
    if (!el || !card) return;
    const target = Math.min(n - 1, Math.max(0, activeRef.current + dir));
    el.scrollTo({ left: target * (card.offsetWidth + 16), behavior: "smooth" });
  };

  const cur = services[active];

  return (
    <section ref={rootRef} id="services" className="relative">
      {/* ---------- Desktop: pinned horizontal stage ---------- */}
      <div ref={stageRef} className="hidden lg:block relative h-screen overflow-hidden px-20">
        <p className="absolute top-28 left-20 font-mono text-xl uppercase tracking-[0.25em] text-white/85">
          What we do
        </p>

        {/* titles */}
        <div className="absolute left-0 right-0 top-[24%]">
          <div ref={trackRef} className="relative left-1/2 flex" style={{ width: `${n * 36}vw` }}>
            {services.map((s) => (
              <h3
                key={s.title}
                className="svc-title shrink-0 text-center font-serif font-normal tracking-tight text-[clamp(1.5rem,2.5vw,2.5rem)] leading-tight"
                style={{ width: `${100 / n}%` }}
              >
                {s.title}
              </h3>
            ))}
          </div>
        </div>

        {/* image frames, centred under the active title */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[40%] h-[50vh] aspect-[4/5]">
          {services.map((s, i) => (
            <div key={s.title} className="svc-frame absolute inset-0 overflow-hidden rounded-sm opacity-0">
              <Frame s={s} i={i} />
            </div>
          ))}
        </div>

        {/* description + counter */}
        <p
          key={active}
          className="absolute left-20 bottom-20 max-w-sm text-lg leading-snug text-white/80 animate-[svcfade_.5s_ease_both]"
        >
          {cur.description}
        </p>
        <div className="absolute right-20 bottom-20 flex items-center gap-4 font-mono text-xs uppercase tracking-widest text-white/60">
          <span className="text-white">{cur.title}</span>
          <span>{pad(active + 1)}</span>
          <span className="h-3 w-px bg-white/30" />
          <span>{pad(n)}</span>
        </div>
        <div className="absolute left-20 right-20 bottom-10 h-px bg-white/10">
          <div className="svc-progress h-full origin-left bg-white/70" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>

      {/* ---------- Mobile / tablet: simple snap carousel ---------- */}
      <div className="lg:hidden py-20 sm:py-24">
        <p className="px-6 sm:px-10 mb-6 font-mono text-xs uppercase tracking-[0.25em] text-white/45">
          What we do
        </p>
        <h2 className="px-6 sm:px-10 font-mont font-normal uppercase text-3xl sm:text-4xl leading-none mb-10">
          We do
        </h2>

        <div className="relative">
          <div
            ref={carouselRef}
            onScroll={onCarouselScroll}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth px-[19vw] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {services.map((s, i) => (
              <div
                key={s.title}
                className={`svc-card snap-center shrink-0 w-[62vw] max-w-[320px] aspect-[4/5] relative overflow-hidden transition-all duration-500 ${
                  i === active ? "opacity-100 scale-100" : "opacity-40 scale-90"
                }`}
              >
                <Frame s={s} i={i} />
              </div>
            ))}
          </div>

          <button
            type="button"
            aria-label="Previous service"
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-white/80 active:scale-90"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            aria-label="Next service"
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/80 active:scale-90"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="mt-6 text-center font-mono text-xs uppercase tracking-widest text-white/60">
          {cur.title} <span className="mx-2">{pad(active + 1)}</span>|<span className="mx-2">{pad(n)}</span>
        </div>

        <div key={active} className="mt-8 px-6 text-center animate-[svcfade_.5s_ease_both]">
          <h3 className="font-mont font-normal text-2xl">{cur.title}</h3>
          <p className="mt-3 mx-auto max-w-sm text-base text-white/70 leading-relaxed">{cur.description}</p>
        </div>
      </div>
    </section>
  );
}
