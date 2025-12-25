"use client";

import { useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Global map to store scroll positions across component remounts
const scrollPositions = new Map<string, number>();

function LenisInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lenisRef = useRef<Lenis | null>(null);
  const isPopState = useRef(false);

  // Initialize Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;
    window.lenis = lenis; // Expose for debugging if needed

    // Disable native scroll restoration to let Lenis handle it
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Save scroll position on scroll
    // We use the current window.location.pathname to ensure we save for the correct page
    const handleScroll = ({ scroll }: { scroll: number }) => {
      scrollPositions.set(window.location.pathname, scroll);
    };

    lenis.on('scroll', handleScroll);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, []);

  // Listen for PopState (Back/Forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      isPopState.current = true;
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle Scroll Restoration
  useEffect(() => {
    if (!lenisRef.current) return;

    const lenis = lenisRef.current;
    const targetScroll = scrollPositions.get(pathname) || 0;

    // We need to wait for the DOM to be ready for the new page
    // A small timeout ensures the new content is rendered
    const timeoutId = setTimeout(() => {
      if (isPopState.current) {
        // Back/Forward: Restore saved position
        lenis.scrollTo(targetScroll, { immediate: true });
        isPopState.current = false; // Reset flag
      } else {
        // New Navigation: Scroll to Top
        // But we must also reset the saved position for this new page to 0
        // so if we come back to it later, it doesn't jump
        lenis.scrollTo(0, { immediate: true });
        scrollPositions.set(pathname, 0);
      }
    }, 100); // 100ms delay is usually sufficient for Next.js hydration

    return () => clearTimeout(timeoutId);
  }, [pathname, searchParams]);

  return <>{children}</>;
}

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={children}>
      <LenisInner>{children}</LenisInner>
    </Suspense>
  );
}

// Add type definition for window.lenis
declare global {
  interface Window {
    lenis: Lenis;
  }
}