"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    // Target position (where mouse actually is)
    let targetX = 0;
    let targetY = 0;
    // Current rendered position (where the dot is drawn)
    let currentX = 0;
    let currentY = 0;

    let hasMoved = false;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX - 5;
      targetY = e.clientY - 5;
      // Snap to the pointer on first move instead of flying in from (0,0)
      if (!hasMoved) {
        hasMoved = true;
        currentX = targetX;
        currentY = targetY;
      }
    };

    // Smoothing rate per second — frame-rate independent, so the trail
    // feels identical on 60Hz and 144Hz displays
    const smoothing = 12;
    let raf: number;
    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const alpha = 1 - Math.exp(-smoothing * dt);
      currentX += (targetX - currentX) * alpha;
      currentY += (targetY - currentY) * alpha;
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 10,
        height: 10,
        borderRadius: "50%",
        backgroundColor: "#000",
        pointerEvents: "none",
        zIndex: 99999,
        willChange: "transform",
      }}
    />
  );
}
