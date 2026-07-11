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
  // Box opened by the idle auto-demo cycle (not by the user)
  const [autoSkill, setAutoSkill] = useState<number | null>(null);
  // Tracks the cursor synchronously (state lags behind by a render/animation)
  const hoveredSkillRef = useRef<number | null>(null);

  const boxImages = [
    '/front.png',
    '/website.png',
    '/ai.png'
  ];

  // Solid lines carry the hover-image boxes; outline lines sit between them
  const serviceLines: {
    left: string;
    right?: string;
    boxIndex?: number;
    outline?: boolean;
    alt?: string;
  }[] = [
    { left: 'AI', right: 'SYSTEMS', boxIndex: 0, alt: 'AI' },
    { left: 'REVENUE', right: 'ENGINES', outline: true },
    { left: 'WORKFLOW', right: 'AUTOMATION', boxIndex: 1, alt: 'Workflow' },
    { left: 'CRM', right: 'PIPELINES', outline: true },
    { left: 'DATA', right: 'INTELLIGENCE', boxIndex: 2, alt: 'Intelligence' },
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

      // Skills label rule draws in
      const skillsRule = skillsContainerRef.current?.querySelector('.skills-rule');
      if (skillsRule) {
        gsap.fromTo(skillsRule,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: skillsContainerRef.current,
              start: 'top 80%',
            },
          }
        );
      }

      // Skills — masked line-by-line reveal
      const lineMasks = gsap.utils.toArray<HTMLElement>('.skill-line-mask', skillsContainerRef.current);
      const lineInners = gsap.utils.toArray<HTMLElement>('.skill-line', skillsContainerRef.current);
      if (lineInners.length) {
        gsap.fromTo(lineInners,
          { yPercent: 120 },
          {
            yPercent: 0,
            duration: 1.1,
            ease: "power4.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: skillsContainerRef.current,
              start: 'top 75%',
            },
            // Masks clip the reveal, then release so box hover-zoom isn't clipped
            onComplete: () => {
              lineMasks.forEach((m) => { m.style.overflow = 'visible'; });
            },
          }
        );

        // Subtle alternating horizontal drift while scrolling through
        lineInners.forEach((line, i) => {
          gsap.to(line, {
            xPercent: i % 2 === 0 ? 3 : -3,
            ease: "none",
            scrollTrigger: {
              trigger: skillsContainerRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          });
        });
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

  const openBoxAnim = (boxEl: HTMLDivElement) => {
    gsap.killTweensOf(boxEl);
    gsap.to(boxEl, {
      scale: 4,
      duration: 0.5,
      ease: "back.out(1.7)"
    });
  };

  const closeBoxAnim = (boxEl: HTMLDivElement, onClosed?: () => void) => {
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
        onClosed?.();
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
  };

  // Lets the hover handlers immediately close a demo box the moment the user
  // hovers any box themselves
  const interruptAutoRef = useRef<((hoveredIndex: number) => void) | null>(null);

  // Idle auto-demo chain: 5s after the previous box closes, the next one
  // opens, shows its image for 3s, then closes. Pauses while the user hovers.
  useEffect(() => {
    let nextIndex = 0;
    let autoIndex: number | null = null;
    let openTimer: ReturnType<typeof setTimeout> | undefined;
    let closeTimer: ReturnType<typeof setTimeout> | undefined;

    const scheduleNext = (delay: number) => {
      if (openTimer) clearTimeout(openTimer);
      openTimer = setTimeout(tryOpen, delay);
    };

    const closeAuto = () => {
      if (autoIndex === null) return;
      const index = autoIndex;
      autoIndex = null;
      if (closeTimer) clearTimeout(closeTimer);
      const boxEl = boxRefs.current[index];
      if (boxEl && hoveredSkillRef.current !== index) {
        closeBoxAnim(boxEl, () => setAutoSkill(null));
      } else {
        // The user grabbed this box mid-demo — hover handlers own it now
        setAutoSkill(null);
      }
      scheduleNext(5000);
    };

    const tryOpen = () => {
      // User is interacting — wait and check again
      if (hoveredSkillRef.current !== null) {
        scheduleNext(5000);
        return;
      }

      const index = nextIndex % boxImages.length;
      const boxEl = boxRefs.current[index];
      if (!boxEl) {
        scheduleNext(5000);
        return;
      }

      // Only demo while the box is actually on screen
      const rect = boxEl.getBoundingClientRect();
      if (rect.top < 0 || rect.bottom > window.innerHeight) {
        scheduleNext(2000);
        return;
      }

      nextIndex++;
      autoIndex = index;
      setAutoSkill(index);
      openBoxAnim(boxEl);
      closeTimer = setTimeout(closeAuto, 3000);
    };

    interruptAutoRef.current = (hoveredIndex: number) => {
      if (autoIndex === null) return;
      if (autoIndex !== hoveredIndex) {
        // User hovered a different box — close the demo box right away
        closeAuto();
      } else {
        // User hovered the demo box itself — hand it over to the hover handlers
        if (closeTimer) clearTimeout(closeTimer);
        autoIndex = null;
        setAutoSkill(null);
        scheduleNext(5000);
      }
    };

    scheduleNext(5000);

    return () => {
      interruptAutoRef.current = null;
      if (openTimer) clearTimeout(openTimer);
      if (closeTimer) clearTimeout(closeTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBoxEnter = (index: number) => {
    hoveredSkillRef.current = index;
    setHoveredSkill(index);
    interruptAutoRef.current?.(index);
    const boxEl = boxRefs.current[index];
    if (boxEl) {
      openBoxAnim(boxEl);
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
      // 'auto' kills only conflicting rotateX/rotateY tweens from earlier
      // mousemoves — without it they pile up ~18 deep while hovering
      overwrite: 'auto'
    });
  };

  const handleBoxLeave = (index: number) => {
    if (hoveredSkillRef.current === index) {
      hoveredSkillRef.current = null;
    }
    const boxEl = boxRefs.current[index];
    if (boxEl) {
      // Guard the clear: a newer hover on another box must not be clobbered
      // when this box's close animation finishes
      closeBoxAnim(boxEl, () =>
        setHoveredSkill((prev) => (prev === index ? null : prev))
      );
    }
  };

  const skillHeadingClass = "text-[2.6em] md:text-5xl lg:text-7xl font-bold font-nort";

  const skillHeadingStyle = (line: (typeof serviceLines)[number]): React.CSSProperties => ({
    // Outline lines render as stroked text between the solid ones
    color: line.outline ? 'transparent' : colors.text,
    WebkitTextStroke: line.outline ? `1.2px ${colors.text}` : undefined,
    letterSpacing: '-0.01em',
  });

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

          {/* Section label — answers "The Problem" above */}
          <div className="mb-12 md:mb-16 flex items-center gap-4">
            <span
              className="skills-rule block h-px w-12 md:w-20 origin-left"
              style={{ backgroundColor: colors.text, opacity: 0.4 }}
            />
            <span className="text-[12px] md:text-md font-rayl tracking-[0.35em] uppercase text-gray-500">
              Services
            </span>
          </div>

          <div className="max-w-4xl mx-auto">
            {serviceLines.map((line, i) => {
              const boxOpen =
                line.boxIndex !== undefined &&
                (hoveredSkill === line.boxIndex || autoSkill === line.boxIndex);

              return (
                <div
                  key={line.left}
                  className="skill-line-mask relative overflow-hidden py-2 md:py-4"
                  style={{
                    // Lift the whole line while its box is open so the scaled
                    // image renders above the neighbouring lines
                    zIndex: boxOpen ? 50 : 1,
                  }}
                >
                  <div
                    ref={i === 2 ? transitionTriggerRef : undefined}
                    className="skill-line flex flex-wrap items-center justify-center gap-3 md:gap-6"
                  >
                    <h2 className={skillHeadingClass} style={skillHeadingStyle(line)}>
                      {line.left}
                    </h2>

                    {line.boxIndex !== undefined && (
                      <div
                        ref={(el) => { boxRefs.current[line.boxIndex!] = el }}
                        className="skill-box relative w-[25px] h-[25px] md:w-[50px] md:h-[50px] cursor-pointer flex-shrink-0 overflow-hidden rounded-md md:rounded-lg"
                        style={{
                          backgroundColor: colors.box,
                          perspective: '1000px',
                          transformStyle: 'preserve-3d',
                          zIndex: boxOpen ? 60 : undefined,
                        }}
                        onMouseEnter={() => handleBoxEnter(line.boxIndex!)}
                        onMouseMove={(e) => handleBoxMove(line.boxIndex!, e)}
                        onMouseLeave={() => handleBoxLeave(line.boxIndex!)}
                      >
                        {/* Always mounted so the image is preloaded — a box
                            must never enlarge before its image can show */}
                        <Image
                          src={boxImages[line.boxIndex]}
                          alt={line.alt || line.left}
                          fill
                          sizes="(max-width: 768px) 100px, 200px"
                          className="object-cover"
                          style={{
                            filter: 'brightness(0.9) contrast(1.1) saturate(1.2)',
                            opacity: boxOpen ? 1 : 0,
                            transition: 'opacity 0.25s ease',
                          }}
                        />
                      </div>
                    )}

                    {line.right && (
                      <h2 className={skillHeadingClass} style={skillHeadingStyle(line)}>
                        {line.right}
                      </h2>
                    )}
                  </div>
                </div>
              );
            })}
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