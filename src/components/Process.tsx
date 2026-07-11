"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '@/provider/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

const steps = [
    {
        number: "01",
        title: "FIND THE LEAK",
        tag: "// before any code",
        description: "We find where your business bleeds money. The map is yours to keep."
    },
    {
        number: "02",
        title: "LOCK THE MACHINE",
        tag: "// in writing",
        description: "Fixed scope. Fixed price. Approved before we build a thing."
    },
    {
        number: "03",
        title: "SHIP IN WEEKS",
        tag: "// shipped beats presented",
        description: "Live on your real data. Watch it work — then we switch it on."
    },
    {
        number: "04",
        title: "PROVE THE NUMBERS",
        tag: "// does it pay?",
        description: "Monthly numbers on what it saved and earned. No vanishing."
    }
];

export default function Process() {
    const containerRef = useRef<HTMLDivElement>(null);
    const desktopRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const headRef = useRef<HTMLDivElement>(null);
    const mobileProgressRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLSpanElement>(null);
    const { theme, setTheme } = useTheme();

    const isDark = theme === 'dark';
    const textColor = isDark ? '#ffffff' : '#000000';
    const pageBg = isDark ? '#000000' : '#dfdff2';
    // Numbers stay a calm grey in both themes — visible, never glowing
    const numberColor = isDark ? '#8a8a8f' : '#6f6f74';

    useEffect(() => {
        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            // Desktop: screen pins, the rail fills point to point,
            // each step pops above its diamond as the fill arrives
            mm.add("(min-width: 768px)", () => {
                const cols = gsap.utils.toArray<HTMLElement>('.process-step', desktopRef.current);
                const ticks = gsap.utils.toArray<HTMLElement>('.process-tick', desktopRef.current);
                if (!cols.length) return;

                const TAIL = 0.6; // hold after the last step before the pin releases
                const total = steps.length + TAIL;

                const tl = gsap.timeline({
                    defaults: { ease: "power3.out" },
                    scrollTrigger: {
                        trigger: desktopRef.current,
                        start: 'top top',
                        end: '+=160%',
                        scrub: 0.7,
                        pin: true,
                        onUpdate: (self) => {
                            const t = self.progress * total;
                            // Background flips the moment the fill hits the 4th diamond
                            setTheme(t >= steps.length - 1 ? 'dark' : 'light');
                            // Live counter
                            const idx = Math.min(steps.length - 1, Math.floor(t));
                            if (counterRef.current) counterRef.current.textContent = steps[idx].number;
                        },
                    },
                });

                // Rail fill — linear, so it reaches tick i exactly at time i
                tl.fromTo(progressRef.current,
                    { scaleX: 0 },
                    { scaleX: 1, duration: steps.length, ease: "none" },
                    0
                );

                // The little box rides the leading edge, rotating half a turn
                // over the whole journey
                if (headRef.current) {
                    tl.fromTo(headRef.current,
                        { left: '0%', rotation: 45 },
                        { left: '100%', rotation: 225, duration: steps.length, ease: "none" },
                        0
                    );
                }

                cols.forEach((col, i) => {
                    const els = col.querySelectorAll('.step-el');
                    const at = i === 0 ? 0.08 : i;

                    // Step content rises out of its masks when the fill arrives
                    tl.fromTo(els,
                        { yPercent: 140 },
                        { yPercent: 0, duration: 0.5, stagger: 0.08 },
                        at
                    );
                    // Tick sharpens and stretches as the box passes it
                    if (ticks[i]) {
                        tl.to(ticks[i],
                            { opacity: 0.9, scaleY: 1.8, duration: 0.2 },
                            at
                        );
                    }
                });

                // Hold the finished state before the pin releases
                tl.to({}, { duration: TAIL }, steps.length);
            });

            // Mobile: vertical timeline (no pinning)
            mm.add("(max-width: 767px)", () => {
                gsap.fromTo(mobileProgressRef.current,
                    { scaleY: 0 },
                    {
                        scaleY: 1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: "top center",
                            end: "bottom center",
                            scrub: 1,
                        }
                    }
                );

                steps.forEach((_, index) => {
                    const stepEl = document.getElementById(`step-mobile-${index}`);
                    if (stepEl) {
                        gsap.fromTo(stepEl,
                            { opacity: 0.2, x: -20 },
                            {
                                opacity: 1,
                                x: 0,
                                duration: 0.5,
                                scrollTrigger: {
                                    trigger: stepEl,
                                    start: "top 80%",
                                    end: "top 50%",
                                    scrub: 0.5,
                                }
                            }
                        );
                    }
                });

                // Mobile theme switch
                ScrollTrigger.create({
                    trigger: containerRef.current,
                    start: "bottom 80%",
                    onEnter: () => setTheme('dark'),
                    onLeaveBack: () => setTheme('light')
                });
            });

        }, containerRef);

        return () => ctx.revert();
    }, [setTheme]);

    return (
        <section ref={containerRef} className="relative w-full">

            {/* ============ Desktop: pinned rail sequence ============ */}
            <div ref={desktopRef} className="hidden md:flex relative h-screen flex-col overflow-hidden">
                <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 flex flex-col h-full pt-14 lg:pt-20 pb-14 lg:pb-16">

                    {/* Header */}
                    <div>
                        <div className="mb-5 flex items-center gap-4">
                            <span
                                className="block h-px w-12 md:w-20"
                                style={{ backgroundColor: textColor, opacity: 0.4 }}
                            />
                            <span
                                className="text-[11px] md:text-xs font-rayl tracking-[0.35em] uppercase"
                                style={{ color: textColor, opacity: 0.5 }}
                            >
                                The Process
                            </span>
                        </div>
                        <h2 className="text-4xl lg:text-6xl font-black font-mont tracking-tight" style={{ color: textColor }}>
                            HOW WE WORK
                        </h2>
                       
                    </div>

                    {/* Steps — pushed down toward the rail */}
                    <div className="flex-1 flex flex-col justify-end">
                        {/* Columns are top-aligned so every number sits on the same line,
                            independent of description length */}
                        <div className="grid grid-cols-4 gap-8 lg:gap-14 mb-10 lg:mb-14">
                            {steps.map((step) => (
                                <div key={step.number} className="process-step flex flex-col justify-start">
                                    <div className="overflow-hidden">
                                        <span
                                            className="step-el block font-black font-mont leading-none text-5xl lg:text-6xl mb-5 lg:mb-6"
                                            style={{ color: numberColor }}
                                        >
                                            {step.number}
                                        </span>
                                    </div>
                                    <div className="overflow-hidden py-0.5">
                                        <h3
                                            className="step-el text-base lg:text-xl font-bold font-mont tracking-tight"
                                            style={{ color: textColor }}
                                        >
                                            {step.title}
                                        </h3>
                                    </div>
                                    {/* <div className="overflow-hidden">
                                        <p className="step-el font-mono text-[11px] lg:text-xs mt-1.5 mb-4" style={{ color: textColor, opacity: 0.5 }}>
                                            {step.tag}
                                        </p>
                                    </div> */}
                                    <div className="overflow-hidden">
                                        <p
                                            className="step-el font-serif font-light text-sm lg:text-[15px] leading-[1.7] max-w-[210px]"
                                            style={{ color: textColor, opacity: 0.65 }}
                                        >
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Progress rail — hairline, ruler ticks, and a traveling box */}
                        <div className="relative h-px" style={{ backgroundColor: `${textColor}20` }}>
                            {/* Fill */}
                            <div
                                ref={progressRef}
                                className="absolute inset-0 origin-left"
                                style={{ backgroundColor: textColor, transform: 'scaleX(0)' }}
                            />
                            {/* Ticks at each point */}
                            {steps.map((_, i) => (
                                <div
                                    key={i}
                                    className="process-tick absolute top-1/2 -translate-y-1/2 w-px h-3.5"
                                    style={{ left: `${(i / steps.length) * 100}%`, backgroundColor: textColor, opacity: 0.3 }}
                                />
                            ))}
                            {/* End cap */}
                            <div
                                className="absolute top-1/2 -translate-y-1/2 right-0 w-px h-2"
                                style={{ backgroundColor: textColor, opacity: 0.3 }}
                            />
                            {/* Traveling box — the site's square, riding the leading edge */}
                            <div
                                ref={headRef}
                                className="absolute top-1/2 w-2.5 h-2.5 -translate-x-1/2 -translate-y-1/2 z-10"
                                style={{ left: '0%', backgroundColor: textColor }}
                            />
                        </div>

                        {/* Counter under the rail */}
                        <div
                            className="flex items-center justify-end mt-5 font-mono text-xs"
                            style={{ color: textColor, opacity: 0.5 }}
                        >
                            
                            <span><span ref={counterRef}>01</span> / 04</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* ============ Mobile: vertical timeline ============ */}
            <div className="md:hidden py-10">
                <div className="px-6">

                    <div className="mb-16">
                        <div className="mb-5 flex items-center gap-4">
                            <span
                                className="block h-px w-12"
                                style={{ backgroundColor: textColor, opacity: 0.4 }}
                            />
                            <span
                                className="text-[11px] font-rayl tracking-[0.35em] uppercase"
                                style={{ color: textColor, opacity: 0.5 }}
                            >
                                The Process
                            </span>
                        </div>
                        <h2 className="text-4xl font-black font-mont tracking-tight" style={{ color: textColor }}>
                            HOW WE WORK
                        </h2>
                        <p className="font-mono text-sm mt-3" style={{ color: textColor, opacity: 0.55 }}>
                            {'// every leak costs money.'}
                        </p>
                    </div>

                    <div className="space-y-12 relative">
                        {/* Vertical rail */}
                        <div className="absolute top-0 left-[19px] w-[2px] h-full" style={{ backgroundColor: `${textColor}1a` }} />
                        <div
                            ref={mobileProgressRef}
                            className="absolute top-0 left-[19px] w-[2px] h-full origin-top transform scale-y-0"
                            style={{ backgroundColor: textColor }}
                        />

                        {steps.map((step, index) => (
                            <div
                                key={index}
                                id={`step-mobile-${index}`}
                                className="relative pl-16 opacity-20"
                            >
                                {/* Solid square marker on the rail */}
                                <div
                                    className="absolute top-2.5 left-[15px] w-2.5 h-2.5 z-10"
                                    style={{ backgroundColor: textColor }}
                                />

                                <span
                                    className="block text-4xl font-black font-mont mb-3 leading-none"
                                    style={{ color: numberColor }}
                                >
                                    {step.number}
                                </span>
                                <h3 className="text-xl font-bold font-mont tracking-tight mb-1" style={{ color: textColor }}>
                                    {step.title}
                                </h3>
                                {/* <p className="font-mono text-xs mb-3" style={{ color: textColor, opacity: 0.5 }}>
                                    {step.tag}
                                </p> */}
                                <p className="font-serif font-light text-sm leading-[1.7] max-w-[300px]" style={{ color: textColor, opacity: 0.65 }}>
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </section>
    );
}
