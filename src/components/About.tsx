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
      // About section animations
      const aboutElements = aboutContainerRef.current?.querySelectorAll('.reveal');
      if (aboutElements) {
        gsap.fromTo(aboutElements,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger: aboutContainerRef.current,
              start: 'top 70%',
            },
          }
        );
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

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full min-h-screen"
    >
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20">

        <div ref={aboutContainerRef} className="pt-20 pb-12 md:pt-28 md:pb-20">

          <div className="reveal mb-8 md:mb-10">
            <h1
              className="text-3xl md:text-4xl lg:text-6xl font-bold font-mont leading-[0.9] tracking-tight transition-colors duration-0"
              style={{ color: colors.text }}
            >
              Bravild
            </h1>
          </div>

          <div className="reveal mb-12 md:mb-12">
            <p
              className="text-sm md:text-base lg:text-lg font-medium tracking-widest uppercase transition-colors duration-0"
              style={{ color: colors.text, opacity: 0.5, letterSpacing: '0.2em' }}
            >
              Develop / Design / Build / dominate
            </p>
          </div>

          <div className="reveal max-w-[800px] mb-6 md:mb-8">
            <p
              className="text-2xl md:text-3xl lg:text-4xl font-light leading-[1.3] transition-colors duration-0"
              style={{ color: colors.text, letterSpacing: '-0.015em' }}
            >
              Building intelligent systems where automation, AI, and design converge into seamless experiences.
            </p>
          </div>

          <div className="reveal max-w-[600px]">
            <p
              className="text-base md:text-lg lg:text-xl font-serif leading-relaxed transition-colors duration-0"
              style={{ color: colors.text, opacity: 0.6, fontWeight: 300 }}
            >
              Every project balances clarity with creativity—tools that work effortlessly and scale naturally.
            </p>
          </div>

        </div>

        <div ref={skillsContainerRef} className="pt-20 md:pt-10 mb-20 md:mb-40 ">

          <div className="max-w-3xl mx-auto space-y-6 md:space-y-12">

            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-12">
              <h2 className={skillHeadingClass} style={{ color: colors.text }}>
                AI
              </h2>
              <h2 className={skillHeadingClass} style={{ color: colors.text }}>
                AUTOMATION
              </h2>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-[0.94rem]  md:gap-8">
              <h2 className={skillHeadingClass} style={{ color: colors.text }}>
                FRONTEND
              </h2>
              <div
                ref={(el) => { boxRefs.current[0] = el }}
                className="skill-box relative w-[25px] h-[25px] md:w-[50px]  md:h-[50px] cursor-pointer flex-shrink-0 overflow-hidden rounded-md md:rounded-lg transition-colors duration-0"
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
                    alt="Frontend"
                    fill
                    sizes="(max-width: 768px) 100px, 200px"
                    className="object-cover"
                    style={{ filter: 'brightness(0.9) contrast(1.1) saturate(1.2)' }}
                  />
                )}
              </div>
              <h2 className={skillHeadingClass} style={{ color: colors.text }}>
                BACKEND
              </h2>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-12">
              <h2 className={skillHeadingClass} style={{ color: colors.text }}>
                API INTEGRATION
              </h2>
            </div>

            <div ref={transitionTriggerRef} className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
              <h2 className={skillHeadingClass} style={{ color: colors.text }}>
                WEB APPS
              </h2>

              <div
                ref={(el) => { boxRefs.current[1] = el }}
                className="skill-box relative  w-[25px] h-[25px] md:w-[50px]  md:h-[50px] cursor-pointer flex-shrink-0 overflow-hidden rounded-md  md:rounded-lg transition-colors duration-0"
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
                    alt="Web Apps"
                    fill
                    sizes="(max-width: 768px) 100px, 200px"
                    className="object-cover"
                    style={{ filter: 'brightness(0.9) contrast(1.1) saturate(1.2)' }}
                  />
                )}
              </div>
              <h2 className={skillHeadingClass} style={{ color: colors.text }}>
                UI/UX
              </h2>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
              <h2 className={skillHeadingClass} style={{ color: colors.text }}>
                AI
              </h2>
              <div
                ref={(el) => { boxRefs.current[2] = el }}
                className="skill-box relative cursor-pointer  w-[25px] h-[25px] md:w-[50px]  md:h-[50px] flex-shrink-0 overflow-hidden rounded-md md:rounded-lg transition-colors duration-0"
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
                    alt="AI"
                    fill
                    sizes="(max-width: 768px) 100px, 200px"
                    className="object-cover"
                    style={{ filter: 'brightness(0.9) contrast(1.1) saturate(1.2)' }}
                  />
                )}
              </div>
              <h2 className={skillHeadingClass} style={{ color: colors.text }}>
                INTEGRATION
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