"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '@/provider/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

const steps = [
    {
        number: "01",
        title: "Discovery",
        description: "Understanding your vision, goals, and target audience to build a solid foundation."
    },
    {
        number: "02",
        title: "Strategy",
        description: "Planning the architecture, user experience, and technical approach for scalability."
    },
    {
        number: "03",
        title: "Build",
        description: "Crafting pixel-perfect designs and robust code with modern technologies."
    },
    {
        number: "04",
        title: "Launch",
        description: "Testing, optimizing, and deploying your digital product to the world."
    }
];

export default function Process() {
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const mobileProgressRef = useRef<HTMLDivElement>(null);
    const { theme, setTheme } = useTheme();

    // Determine colors based on theme
    // Note: This section sits between About (light/dark) and Projects (dark).
    // We'll make it adapt to the current theme but ensure it looks good in transition.
    const isDark = theme === 'dark';
    const textColor = isDark ? '#ffffff' : '#000000';
    const dimColor = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)';
    const accentColor = isDark ? '#ffffff' : '#000000';

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Desktop Animation
            const mm = gsap.matchMedia();

            mm.add("(min-width: 768px)", () => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: triggerRef.current,
                        start: "top center",
                        end: "bottom center",
                        scrub: 1,
                    }
                });

                // Animate Progress Line
                tl.fromTo(progressRef.current,
                    { scaleX: 0 },
                    { scaleX: 1, ease: "none", duration: 1 }
                );

                // Animate Steps Opacity
                steps.forEach((_, index) => {
                    const stepEl = document.getElementById(`step-${index}`);
                    if (stepEl) {
                        tl.to(stepEl, {
                            opacity: 1,
                            duration: 0.2,
                            ease: "power2.out"
                        }, index * 0.25); // Stagger based on progress
                    }
                });

                // Theme Switch Trigger - Synced with Progress Bar
                // Triggers when progress is around 85% (near the end of the section)
                ScrollTrigger.create({
                    trigger: triggerRef.current,
                    start: "85% center", // Relative to the trigger element's height
                    onEnter: () => setTheme('dark'),
                    onLeaveBack: () => setTheme('light')
                });
            });

            // Mobile Animation (Vertical)
            mm.add("(max-width: 767px)", () => {
                // Animate Mobile Progress Line
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

                // Mobile Theme Switch
                ScrollTrigger.create({
                    trigger: containerRef.current,
                    start: "bottom 80%", // Near the end of the mobile section
                    onEnter: () => setTheme('dark'),
                    onLeaveBack: () => setTheme('light')
                });
            });

        }, containerRef);

        return () => ctx.revert();
    }, [setTheme]);

    return (
        <section ref={containerRef} className="relative w-full py-10 md:py-5 overflow-hidden">
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20">

                {/* Section Header */}
                <div className="mb-16 md:mb-32">
                    <p className="text-sm font-bold tracking-[0.2em] uppercase mb-4" style={{ color: dimColor }}>
                        Workflow
                    </p>
                    <h2 className="text-4xl md:text-6xl font-black font-mont" style={{ color: textColor }}>
                        HOW WE WORK
                    </h2>
                </div>

                {/* Desktop Layout (Horizontal) */}
                <div ref={triggerRef} className="hidden md:block relative">
                    {/* Progress Line Container */}
                    <div className="absolute top-[60px] left-0 w-full h-[2px] bg-gray-200/20 rounded-full overflow-hidden">
                        {/* Animated Progress Bar */}
                        <div
                            ref={progressRef}
                            className="h-full w-full origin-left transform scale-x-0"
                            style={{ backgroundColor: accentColor }}
                        />
                    </div>

                    <div className="grid grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                id={`step-${index}`}
                                className="relative pt-24 opacity-20 transition-opacity duration-300"
                            >
                                {/* Dot on the line */}
                                <div
                                    className="absolute top-[53px] left-0 w-4 h-4 rounded-full border-2 bg-transparent z-10"
                                    style={{ borderColor: accentColor, backgroundColor: isDark ? '#000' : '#fff' }}
                                />

                                <span className="block text-6xl font-black font-mont mb-6 opacity-30" style={{ color: textColor }}>
                                    {step.number}
                                </span>
                                <h3 className="text-2xl font-bold font-mont mb-4" style={{ color: textColor }}>
                                    {step.title}
                                </h3>
                                <p className="text-sm leading-relaxed font-rayl max-w-[250px]" style={{ color: textColor, opacity: 0.7 }}>
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile Layout (Vertical) */}
                <div className="md:hidden space-y-12 relative">
                    {/* Vertical Line */}
                    <div className="absolute top-0 left-[19px] w-[2px] h-full bg-gray-200/10" />
                    {/* Animated Mobile Progress Line */}
                    <div
                        ref={mobileProgressRef}
                        className="absolute top-0 left-[19px] w-[2px] h-full origin-top transform scale-y-0"
                        style={{ backgroundColor: accentColor }}
                    />

                    {steps.map((step, index) => (
                        <div
                            key={index}
                            id={`step-mobile-${index}`}
                            className="relative pl-16 opacity-20"
                        >
                            {/* Dot */}
                            <div
                                className="absolute top-2 left-[12px] w-4 h-4 rounded-full border-2 z-10"
                                style={{ borderColor: accentColor, backgroundColor: isDark ? '#000' : '#fff' }}
                            />

                            <span className="block text-4xl font-black font-mont mb-2 opacity-30" style={{ color: textColor }}>
                                {step.number}
                            </span>
                            <h3 className="text-xl font-bold font-mont mb-2" style={{ color: textColor }}>
                                {step.title}
                            </h3>
                            <p className="text-sm leading-relaxed font-rayl" style={{ color: textColor, opacity: 0.7 }}>
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>


            </div>
        </section>
    );
}
