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
    const stageRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const headRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLSpanElement>(null);
    // Vertical stage (mobile + tablet) — same language, rotated 90°
    const vertRef = useRef<HTMLDivElement>(null);
    const vProgressRef = useRef<HTMLDivElement>(null);
    const vHeadRef = useRef<HTMLDivElement>(null);
    const vCounterRef = useRef<HTMLSpanElement>(null);
    const { theme, setTheme } = useTheme();

    const isDark = theme === 'dark';
    const textColor = isDark ? '#ffffff' : '#000000';
    const pageBg = isDark ? '#000000' : '#dfdff2';
    // Numbers stay a calm grey in both themes — visible, never glowing
    const numberColor = isDark ? '#8a8a8f' : '#6f6f74';

    useEffect(() => {
        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();
            const TAIL = 0.6; // hold after the last step before the pin releases
            const total = steps.length + TAIL;

            // Desktop/laptop: horizontal rail — the screen pins, the rail fills
            // point to point, the cube rides the leading edge. 1280 cutoff so
            // iPad Pro portrait (1024w) still gets the vertical rail.
            mm.add("(min-width: 1280px)", () => {
                const cols = gsap.utils.toArray<HTMLElement>('.process-step', stageRef.current);
                const ticks = gsap.utils.toArray<HTMLElement>('.process-tick', stageRef.current);
                if (!cols.length) return;

                const tl = gsap.timeline({
                    defaults: { ease: "power3.out" },
                    scrollTrigger: {
                        trigger: stageRef.current,
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

            // Mobile + tablet (incl. iPad Pro portrait): the same rail rotated
            // vertical — the fill runs downward and the cube rides it
            mm.add("(max-width: 1279px)", () => {
                const cols = gsap.utils.toArray<HTMLElement>('.v-step', vertRef.current);
                const ticks = gsap.utils.toArray<HTMLElement>('.v-tick', vertRef.current);
                if (!cols.length) return;

                const tl = gsap.timeline({
                    defaults: { ease: "power3.out" },
                    scrollTrigger: {
                        trigger: vertRef.current,
                        start: 'top top',
                        end: '+=160%',
                        scrub: 0.7,
                        pin: true,
                        onUpdate: (self) => {
                            const t = self.progress * total;
                            setTheme(t >= steps.length - 1 ? 'dark' : 'light');
                            const idx = Math.min(steps.length - 1, Math.floor(t));
                            if (vCounterRef.current) vCounterRef.current.textContent = steps[idx].number;
                        },
                    },
                });

                tl.fromTo(vProgressRef.current,
                    { scaleY: 0 },
                    { scaleY: 1, duration: steps.length, ease: "none" },
                    0
                );

                if (vHeadRef.current) {
                    tl.fromTo(vHeadRef.current,
                        { top: '0%', rotation: 45 },
                        { top: '100%', rotation: 225, duration: steps.length, ease: "none" },
                        0
                    );
                }

                cols.forEach((col, i) => {
                    const els = col.querySelectorAll('.step-el');
                    const at = i === 0 ? 0.08 : i;

                    tl.fromTo(els,
                        { yPercent: 140 },
                        { yPercent: 0, duration: 0.5, stagger: 0.08 },
                        at
                    );
                    // Vertical ticks stretch sideways as the cube passes
                    if (ticks[i]) {
                        tl.to(ticks[i],
                            { opacity: 0.9, scaleX: 1.8, duration: 0.2 },
                            at
                        );
                    }
                });

                tl.to({}, { duration: TAIL }, steps.length);
            });

        }, containerRef);

        return () => ctx.revert();
    }, [setTheme]);

    return (
        <section ref={containerRef} className="relative w-full">

            {/* ============ Desktop: pinned horizontal rail — unchanged ============ */}
            {/* svh, not vh — browser chrome must not cut off the rail */}
            <div ref={stageRef} className="hidden xl:flex relative h-svh flex-col overflow-hidden">
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

            {/* ============ Mobile + tablet: the same rail, vertical ============ */}
            {/* The desktop stage rotated 90° — hairline, ticks, fill, and the
                rotating cube riding the leading edge downward while pinned */}
            <div ref={vertRef} className="xl:hidden relative h-svh flex flex-col overflow-hidden">
                <div className="w-full h-full px-6 md:px-12 flex flex-col pt-10 md:pt-14 pb-8 md:pb-12">

                    {/* Header */}
                    <div>
                        <div className="mb-4 md:mb-5 flex items-center gap-4">
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
                        <h2 className="text-2xl md:text-4xl font-black font-mont tracking-tight" style={{ color: textColor }}>
                            HOW WE WORK
                        </h2>
                    </div>

                    {/* Rail + steps fill the remaining height */}
                    <div className="flex-1 flex mt-8 md:mt-12 min-h-0">

                        {/* Progress rail — hairline, ruler ticks, and the traveling box */}
                        <div className="relative w-px" style={{ backgroundColor: `${textColor}20` }}>
                            {/* Fill */}
                            <div
                                ref={vProgressRef}
                                className="absolute inset-0 origin-top"
                                style={{ backgroundColor: textColor, transform: 'scaleY(0)' }}
                            />
                            {/* Ticks at each point */}
                            {steps.map((_, i) => (
                                <div
                                    key={i}
                                    className="v-tick absolute left-1/2 -translate-x-1/2 h-px w-3.5"
                                    style={{ top: `${(i / steps.length) * 100}%`, backgroundColor: textColor, opacity: 0.3 }}
                                />
                            ))}
                            {/* End cap */}
                            <div
                                className="absolute left-1/2 -translate-x-1/2 bottom-0 h-px w-2"
                                style={{ backgroundColor: textColor, opacity: 0.3 }}
                            />
                            {/* Traveling box — the site's square, riding the leading edge */}
                            <div
                                ref={vHeadRef}
                                className="absolute left-1/2 w-2.5 h-2.5 -translate-x-1/2 -translate-y-1/2 z-10"
                                style={{ top: '0%', backgroundColor: textColor }}
                            />
                        </div>

                        {/* Steps — one row per rail segment, so tick i sits beside step i */}
                        <div className="flex-1 grid grid-rows-4 pl-7 md:pl-12">
                            {steps.map((step) => (
                                <div key={step.number} className="v-step flex flex-col justify-start -mt-1.5">
                                    <div className="overflow-hidden">
                                        <span
                                            className="step-el block font-black font-mont leading-none text-3xl md:text-5xl lg:text-6xl mb-2 md:mb-4"
                                            style={{ color: numberColor }}
                                        >
                                            {step.number}
                                        </span>
                                    </div>
                                    <div className="overflow-hidden py-0.5">
                                        <h3
                                            className="step-el text-sm md:text-lg lg:text-2xl font-bold font-mont tracking-tight"
                                            style={{ color: textColor }}
                                        >
                                            {step.title}
                                        </h3>
                                    </div>
                                    <div className="overflow-hidden">
                                        <p
                                            className="step-el font-serif font-light text-xs md:text-[15px] lg:text-[17px] leading-[1.6] md:leading-[1.7] max-w-[300px] md:max-w-[440px] lg:max-w-[520px]"
                                            style={{ color: textColor, opacity: 0.65 }}
                                        >
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Counter under the rail */}
                    <div
                        className="flex items-center justify-end mt-4 md:mt-6 font-mono text-xs"
                        style={{ color: textColor, opacity: 0.5 }}
                    >
                        <span><span ref={vCounterRef}>01</span> / 04</span>
                    </div>

                </div>
            </div>

        </section>
    );
}
