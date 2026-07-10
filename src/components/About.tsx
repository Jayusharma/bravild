// components/About.tsx
"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '@/provider/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

const AboutAndSkills = () => {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLDivElement>(null);
  const aboutContainerRef = useRef<HTMLDivElement>(null);
  const skillsContainerRef = useRef<HTMLDivElement>(null);
  const transitionTriggerRef = useRef<HTMLDivElement>(null);
  const [hoveredSkill, setHoveredSkill] = useState<number | null>(null);

  const boxImages = [
    '/front.png',
    '/website.png',
    '/ai.png'
  ];

  const boxRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Get theme colors based on current theme
  const getThemeColors = () => {
    if (theme === 'dark') {
      return {
        bg: '#000000',
        text: '#ffffff',
        box: '#ffffff'
      };
    }
    return {
      bg: '#dfdff2',
      text: '#0a0a0a',
      box: '#0a0a0a'
    };
  };

  const colors = getThemeColors();

  // Setup ScrollTrigger for theme switching (only once)
  // Theme transition moved to Process component

  // Setup content animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // About section animations - sequential word reveal line-by-line
      const revealWords1 = aboutContainerRef.current?.querySelectorAll('.reveal-word-1');
      const revealWords2 = aboutContainerRef.current?.querySelectorAll('.reveal-word-2');
      const revealWords3 = aboutContainerRef.current?.querySelectorAll('.reveal-word-3');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: aboutContainerRef.current,
          start: 'top 88%',
          end: 'bottom 60%',
          scrub: 0.6,
        }
      });

      // Section label rule draws in first
      const rule = aboutContainerRef.current?.querySelector('.about-rule');
      if (rule) {
        tl.fromTo(rule,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.25, ease: "none" },
          0
        );
      }

      if (revealWords1 && revealWords1.length) {
        tl.to(revealWords1, {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          stagger: 0.03,
          ease: "none",
        }, 0.05);
      }

      if (revealWords2 && revealWords2.length) {
        tl.to(revealWords2, {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          stagger: 0.03,
          ease: "none",
        }, "+=0.04");
      }

      // Paragraph keeps its slower, gentle pace
      if (revealWords3 && revealWords3.length) {
        tl.to(revealWords3, {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          stagger: 0.035,
          ease: "none",
        }, "+=0.04");
      }

      // Skills text animation
      const skillWords = skillsContainerRef.current?.querySelectorAll('.skill-word');
      if (skillWords) {
        gsap.fromTo(skillWords,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: skillsContainerRef.current,
              start: 'top 70%',
            },
          }
        );
      }

      // Animate boxes with subtle floating motion
      const boxes = skillsContainerRef.current?.querySelectorAll('.skill-box');
      if (boxes) {
        boxes.forEach((box, i) => {
          gsap.to(box, {
            scale: 0.8,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut",
            delay: i * 0.15
          });
        });
      }

    });

    return () => ctx.revert();
  }, []);

  const handleBoxEnter = (index: number) => {
    setHoveredSkill(index);
    const boxEl = boxRefs.current[index];

    if (boxEl) {
      gsap.to(boxEl, {
        scale: 4,
        duration: 0.5,
        ease: "back.out(1.7)"
      });
    }
  };

  const handleBoxMove = (index: number, e: React.MouseEvent<HTMLElement>) => {
    if (hoveredSkill !== index) return;

    const boxEl = boxRefs.current[index];
    if (!boxEl) return;

    const rect = boxEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const tiltX = ((mouseY - centerY) / (rect.height / 2)) * -25;
    const tiltY = ((mouseX - centerX) / (rect.width / 2)) * 25;

    gsap.to(boxEl, {
      rotateX: tiltX,
      rotateY: tiltY,
      duration: 0.3,
      ease: "power2.out",
      overwrite: false
    });
  };

  const handleBoxLeave = (index: number) => {
    const boxEl = boxRefs.current[index];
    if (boxEl) {
      gsap.killTweensOf(boxEl);

      gsap.to(boxEl, {
        scale: 1,
        x: 0,
        y: 0,
        rotation: 0,
        rotateX: 0,
        rotateY: 0,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          setHoveredSkill(null);
          gsap.to(boxEl, {
            y: `random(-4, 4)`,
            rotation: `random(-5, 5)`,
            duration: `random(2.5, 3.5)`,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          });
        }
      });
    }
  };

  const skillHeadingClass = "skill-word text-[2.6em] md:text-5xl lg:text-7xl font-bold font-nort transition-colors duration-0";

  const splitTextToSpans = (text: string, baseClass: string, color?: string) => {
    return text.split(" ").map((word, idx) => (
      <span
        key={idx}
        className={`${baseClass} inline-block mr-[0.25em]`}
        style={{
          opacity: 0.12,
          filter: "blur(4px)",
          transform: "translateY(0.35em)",
          color: color || undefined,
          willChange: "transform, filter, opacity",
        }}
      >
        {word}
      </span>
    ));
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full min-h-screen"
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20">

        <div ref={aboutContainerRef} className="pt-20 pb-12 md:pt-28 md:pb-20">

          {/* Section Header / Label */}
          <div className="reveal mb-10 md:mb-14 flex items-center gap-4">
            <span
              className="about-rule block h-px w-12 md:w-20 origin-left"
              style={{ backgroundColor: colors.text, opacity: 0.4 }}
            />
            <span className="text-[11px] md:text-xs font-rayl tracking-[0.35em] uppercase text-gray-500">
              The Problem
            </span>
          </div>

          {/* Headline 1 — the human statement */}
          <div className="mb-3 md:mb-5">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold font-mont tracking-tight leading-[1.08]">
              {splitTextToSpans("Your business runs on people?", "reveal-word-1", colors.text)}
            </h2>
          </div>

          {/* Headline 2 — the machine's correction, set as a code comment */}
          <div className="mb-10 md:mb-14 pl-[4%] md:pl-[6%] opacity-75">
            <h2 className="font-mono text-xl md:text-3xl lg:text-4xl font-medium tracking-tight leading-snug">
              {splitTextToSpans("// it should run on systems.", "reveal-word-2", colors.text)}
            </h2>
          </div>

          {/* Paragraph Hook */}
          <div
            className="max-w-[720px] pl-5 md:pl-8 border-l"
            style={{ borderColor: `${colors.text}2e` }}
          >
            <p className="text-base md:text-lg lg:text-xl font-light leading-relaxed md:leading-loose font-serif">
              {splitTextToSpans(
                "People sleep, forget, quit, and take Mondays off. Systems don't. We're the team that builds the systems — you keep the people for the work that needs a brain.",
                "reveal-word-3",
                colors.text
              )}
            </p>
          </div>

        </div>

        <div ref={skillsContainerRef} className="pt-20 md:pt-10 mb-20 md:mb-40">

          <div className="max-w-4xl mx-auto space-y-4 md:space-y-8">

            {/* Line 1: AI [box] SYSTEMS */}
            <div className="flex items-center justify-center gap-3 md:gap-6">
              <h2 className={skillHeadingClass} style={{ color: colors.text }}>
                AI
              </h2>
              <div
                ref={(el) => { boxRefs.current[0] = el }}
                className="skill-box relative w-[25px] h-[25px] md:w-[50px] md:h-[50px] cursor-pointer flex-shrink-0 overflow-hidden rounded-md md:rounded-lg"
                style={{
                  backgroundColor: colors.box,
                  perspective: '1000px',
                  transformStyle: 'preserve-3d'
                }}
                onMouseEnter={() => handleBoxEnter(0)}
                onMouseMove={(e) => handleBoxMove(0, e)}
                onMouseLeave={() => handleBoxLeave(0)}
              >
                {hoveredSkill === 0 && (
                  <Image
                    src={boxImages[0]}
                    alt="AI"
                    fill
                    sizes="(max-width: 768px) 100px, 200px"
                    className="object-cover"
                    style={{ filter: 'brightness(0.9) contrast(1.1) saturate(1.2)' }}
                  />
                )}
              </div>
              <h2 className={skillHeadingClass} style={{ color: colors.text }}>
                SYSTEMS
              </h2>
            </div>

            {/* Line 2: REVENUE ENGINES */}
            <div className="flex items-center justify-center gap-3 md:gap-6">
              <h2 className={skillHeadingClass} style={{ color: colors.text }}>
                REVENUE
              </h2>
              <h2 className={skillHeadingClass} style={{ color: colors.text }}>
                ENGINES
              </h2>
            </div>

            {/* Line 3: WORKFLOW [box] AUTOMATION */}
            <div ref={transitionTriggerRef} className="flex items-center justify-center gap-3 md:gap-6">
              <h2 className={skillHeadingClass} style={{ color: colors.text }}>
                WORKFLOW
              </h2>
              <div
                ref={(el) => { boxRefs.current[1] = el }}
                className="skill-box relative w-[25px] h-[25px] md:w-[50px] md:h-[50px] cursor-pointer flex-shrink-0 overflow-hidden rounded-md md:rounded-lg"
                style={{
                  backgroundColor: colors.box,
                  perspective: '1000px',
                  transformStyle: 'preserve-3d'
                }}
                onMouseEnter={() => handleBoxEnter(1)}
                onMouseMove={(e) => handleBoxMove(1, e)}
                onMouseLeave={() => handleBoxLeave(1)}
              >
                {hoveredSkill === 1 && (
                  <Image
                    src={boxImages[1]}
                    alt="Workflow"
                    fill
                    sizes="(max-width: 768px) 100px, 200px"
                    className="object-cover"
                    style={{ filter: 'brightness(0.9) contrast(1.1) saturate(1.2)' }}
                  />
                )}
              </div>
              <h2 className={skillHeadingClass} style={{ color: colors.text }}>
                AUTOMATION
              </h2>
            </div>

            {/* Line 4: CRM PIPELINES */}
            <div className="flex items-center justify-center gap-3 md:gap-6">
              <h2 className={skillHeadingClass} style={{ color: colors.text }}>
                CRM
              </h2>
              <h2 className={skillHeadingClass} style={{ color: colors.text }}>
                PIPELINES
              </h2>
            </div>

            {/* Line 5: DATA [box] INTELLIGENCE */}
            <div className="flex items-center justify-center gap-3 md:gap-6">
              <h2 className={skillHeadingClass} style={{ color: colors.text }}>
                DATA
              </h2>
              <div
                ref={(el) => { boxRefs.current[2] = el }}
                className="skill-box relative w-[25px] h-[25px] md:w-[50px] md:h-[50px] cursor-pointer flex-shrink-0 overflow-hidden rounded-md md:rounded-lg"
                style={{
                  backgroundColor: colors.box,
                  perspective: '1000px',
                  transformStyle: 'preserve-3d'
                }}
                onMouseEnter={() => handleBoxEnter(2)}
                onMouseMove={(e) => handleBoxMove(2, e)}
                onMouseLeave={() => handleBoxLeave(2)}
              >
                {hoveredSkill === 2 && (
                  <Image
                    src={boxImages[2]}
                    alt="Intelligence"
                    fill
                    sizes="(max-width: 768px) 100px, 200px"
                    className="object-cover"
                    style={{ filter: 'brightness(0.9) contrast(1.1) saturate(1.2)' }}
                  />
                )}
              </div>
              <h2 className={skillHeadingClass} style={{ color: colors.text }}>
                INTELLIGENCE
              </h2>
            </div>

          </div>


        </div>



      </div>

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
};

export default AboutAndSkills;