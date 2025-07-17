import { useLayoutEffect, useRef, useEffect, useState } from "react";
import gsap from "gsap";
import SplitType from "split-type";

export default function FancyServiceBox({ 
  heading, 
  description 
}: { 
  heading: string; 
  description: string; 
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isInView, setIsInView] = useState(false);
  const splitRef = useRef<SplitType | null>(null);
  const lastScrollY = useRef(0);

  // Intersection Observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const currentScrollY = window.scrollY;
          const isScrollingDown = currentScrollY > lastScrollY.current;
          
          if (entry.isIntersecting && isScrollingDown) {
            setIsInView(true);
          }
          
          lastScrollY.current = currentScrollY;
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the element is visible
        rootMargin: "0px 0px -10% 0px", // Add some margin for better UX
      }
    );

    if (boxRef.current) {
      observer.observe(boxRef.current);
    }

    return () => {
      if (boxRef.current) {
        observer.unobserve(boxRef.current);
      }
    };
  }, []);

  // Animation setup and trigger
  useLayoutEffect(() => {
    if (!textRef.current || !isInView) return;

    const ctx = gsap.context(() => {
      // Create new split or reuse existing one
      if (splitRef.current) {
        splitRef.current.revert();
      }
      
      if (!textRef.current) return;
      
      splitRef.current = new SplitType(textRef.current, { 
        types: "words,chars" 
      });
      
      const chars = splitRef.current.chars;

      // Set initial state
      gsap.set(chars, {
        opacity: 0,
        scale: 0,
        x: () => gsap.utils.random(-250, 150),
        y: () => gsap.utils.random(-100, 100),
        rotate: () => gsap.utils.random(-180, 180),
        filter: "blur(10px)",
      });

      // Animate in
      gsap.to(chars, {
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        rotate: 0,
        filter: "blur(0px)",
        duration: 1,
        ease: "power4.out",
        stagger: {
          each: 0.0075,
          from: "random",
        },
        delay: 1,
        onComplete: () => {
          // Reset the trigger so it can animate again
          setIsInView(false);
        }
      });
    }, boxRef);

    return () => {
      ctx.revert();
      if (splitRef.current) {
        splitRef.current.revert();
        splitRef.current = null;
      }
    };
  }, [isInView, description]);

  return (
    <div
      ref={boxRef}
      className="relative px-10 py-14 md:w-[25vw] w-[60vw] bg-black bg-opacity-70 rounded-lg text-center text-white overflow-hidden"
    >
      {/* Animated Corner Borders Only */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white animate-pulse opacity-80" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white animate-pulse opacity-80" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white animate-pulse opacity-80" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white animate-pulse opacity-80" />
      </div>

      {heading && (
        <h2 className="text-2xl font-semibold mb-2 uppercase tracking-wider">
          {heading}
        </h2>
      )}

      <p
        ref={textRef}
        className="text-base sm:text-lg font-medium leading-relaxed tracking-wide"
      >
        {description}
      </p>
    </div>
  );
}