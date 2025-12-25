"use client";
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Zoom = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const divRef1 = useRef<HTMLDivElement>(null);
  const divRef2 = useRef<HTMLDivElement>(null);
  const divRef3 = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const lastPhaseRef = useRef(0);
  const animatingRef = useRef(false);
  const lastProgressRef = useRef(0);
  const reversingRef = useRef(false); // NEW: Track reverse animations

  useEffect(() => {
    const container = containerRef.current;
    const div = divRef.current;
    const div1 = divRef1.current;
    const div2 = divRef2.current;
    const div3 = divRef3.current;
    const text = textRef.current;

    if (!container || !div || !div1 || !div2 || !div3 || !text) return;

    const animation = gsap.to(div, {
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom top",
        scrub: true,
        pin: true,
        markers: true,
        onUpdate: (self: ScrollTrigger) => {
          const progress = self.progress;
          const isScrollingUp = progress < lastProgressRef.current;

          if (!div || !div.style) return;

          // Handle reverse animations first - BEFORE phase logic
          if (isScrollingUp && progress < 0.6 && lastPhaseRef.current === 3 && !animatingRef.current && !reversingRef.current) {
            reversingRef.current = true;
            animatingRef.current = true;

            // Kill any ongoing forward animations first
            gsap.killTweensOf([div1, div2, div3]);

            // Brown div (div2) slides RIGHT back to original position
            gsap.to(div2, {
              x: '0%',
              duration: 1.2,
              ease: "power2.inOut"
            });

            // Blue div (div3) slides DOWN back to bottom
            gsap.to(div3, {
              opacity: 0,
              y: '0%',
              duration: 1.2,
              ease: "power2.inOut"
            });

            // Amber div (div1) scales back up and full opacity
            gsap.to(div1, {
              scale: 1,
              opacity: 1,
              duration: 1.2,
              ease: "power2.inOut",
              onComplete: () => {
                animatingRef.current = false;
                reversingRef.current = false; // Reset reverse flag
                lastPhaseRef.current = 2; // Set phase AFTER animation completes
              }
            });

            // Don't process other phases while reversing
            lastProgressRef.current = progress;
            return;
          }

          // Skip phase logic if currently reversing
          if (reversingRef.current) {
            lastProgressRef.current = progress;
            return;
          }

          if (progress < 0.4) {
            // Phase 1: Expansion
            const p = progress / 0.4;

            // Reset any ongoing animations
            if (animatingRef.current && !reversingRef.current) {
              gsap.killTweensOf([div1, div2, div3]);
              animatingRef.current = false;
            }

            // Animate expansion
            div.style.height = `${30 + p * 70}vh`;
            div.style.width = `${30 + p * 70}vw`;

            // Move text from center (45%) to top (10%)
            text.style.top = `${45 - p * 35}%`;

            // Add delay to opacity increase - start opacity at 30% progress
            const opacityStart = 0.3;
            const opacityProgress = p > opacityStart ? (p - opacityStart) / (1 - opacityStart) : 0;

            // Only set if not reversing
            if (!reversingRef.current) {
              gsap.set(div1, {
                opacity: opacityProgress,
                x: 0,
                scale: 1
              });
              gsap.set(div2, {
                opacity: opacityProgress,
                x: 0,
                scale: 1
              });
              gsap.set(div3, {
                opacity: 0,
                y: 0
              });
            }

            lastPhaseRef.current = 1;

          } else if (progress < 0.6) {
            // Phase 2: Full expansion - cards visible
            div.style.height = "100vh";
            div.style.width = "100vw";
            text.style.top = "10%";

            // Reset any ongoing animations (except reverse)
            if (animatingRef.current && !reversingRef.current) {
              gsap.killTweensOf([div1, div2, div3]);
              animatingRef.current = false;
            }

            // Only set if not reversing and not already in correct phase
            if (!reversingRef.current && lastPhaseRef.current !== 2) {
              gsap.set(div1, {
                opacity: 1,
                x: 0,
                scale: 1
              });
              gsap.set(div2, {
                opacity: 1,
                x: 0,
                scale: 1
              });
              gsap.set(div3, {
                opacity: 0,
                y: 0
              });

              lastPhaseRef.current = 2;
            }

          } else {
            // Phase 3: Both card swaps happen simultaneously
            div.style.height = "100vh";
            div.style.width = "100vw";
            text.style.top = "10%";

            // Trigger forward animation
            const shouldTriggerForward = (lastPhaseRef.current === 2 && !isScrollingUp) || lastPhaseRef.current < 3;

            if (shouldTriggerForward && !animatingRef.current && !reversingRef.current) {
              animatingRef.current = true;

              // Kill any ongoing animations first
              gsap.killTweensOf([div1, div2, div3]);

              // Only scale down and fade the amber div (div1)
              gsap.to(div1, {
                scale: 0.9,
                opacity: 0.6,
                duration: 1.2,
                ease: "power2.inOut"
              });

              // Brown div (div2) slides LEFT to cover amber div
              gsap.to(div2, {
                x: '-100%',
                duration: 1.2,
                ease: "power2.inOut"
              });

              // Blue div (div3) slides UP from bottom
              gsap.to(div3, {
                opacity: 1,
                y: '-100%',
                duration: 1.2,
                ease: "power2.inOut",
                onComplete: () => {
                  animatingRef.current = false;
                }
              });

              lastPhaseRef.current = 3;
            }
          }

          // Store current progress for next frame
          lastProgressRef.current = progress;
        }
      },
    });

    // Cleanup function
    return () => {
      if (animation && animation.kill) {
        animation.kill();
      }
      gsap.killTweensOf([div1, div2, div3]);
    };
  }, [])

  return (
    <div ref={containerRef} className='min-h-screen bg-white w-full relative'>
      <div ref={divRef} className='w-[30vw] h-[30vh] bg-black absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-mont text-white rounded-2xl overflow-hidden'>

        <div ref={textRef} className='w-full h-[25%] bg-black text-3xl text-center absolute top-[45%] z-0'>
          Why Bravild ?
        </div>

        <div ref={divRef1} className='w-[50%] h-[75%] top-[25%] left-0 absolute bg-amber-200 shrink-0 z-20 opacity-0 m-2 origin-center'></div>

        <div ref={divRef2} className='w-[50%] h-[75%] top-[25%] left-[50%] absolute bg-amber-900 shrink-0 z-30 opacity-0 m-2 origin-center'></div>

        <div ref={divRef3} className='w-[50%] h-[75%] top-[100%] left-[50%] absolute bg-blue-500 z-10 opacity-0 m-2 origin-center'></div>

      </div>
    </div>
  )
}

export default Zoom
