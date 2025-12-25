import React, { useState, useEffect, useRef, forwardRef, useMemo, useCallback } from 'react';

interface VisualMixTextProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
}

export const VisualMixText = forwardRef<HTMLDivElement, VisualMixTextProps>(({
  children,
  className = "",
  duration = 2000
}, forwardedRef) => {
  const [phase, setPhase] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const animationIdRef = useRef<number | null>(null);

  // Memoize intersection observer callback
  const handleIntersection = useCallback(([entry]: IntersectionObserverEntry[]) => {
    if (entry.isIntersecting) {
      setIsVisible(true);
      if (observerRef.current) {
        observerRef.current.unobserve(entry.target);
      }
    }
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleIntersection, { threshold: 0.1 });

    if (textRef.current && observerRef.current) {
      observerRef.current.observe(textRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [handleIntersection]);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth ease-out for motion blur to clear
      const easedProgress = 1 - Math.pow(1 - progress, 2.5);
      setPhase(easedProgress);

      if (progress < 1) {
        animationIdRef.current = requestAnimationFrame(animate);
      } else {
        animationIdRef.current = null;
      }
    };

    animate();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
    };
  }, [isVisible, duration]);

  // Memoize all calculated values to prevent recalculation on every render
  const calculatedStyles = useMemo(() => {
    const blurIntensity = Math.max(0, 1 - phase);
    const horizontalBlur = blurIntensity * 15;
    const verticalBlur = blurIntensity * 2;
    const opacity = 0.5 + (phase * 0.5);
    const scale = 0.98 + (phase * 0.02);

    return {
      blurIntensity,
      horizontalBlur,
      verticalBlur,
      opacity,
      scale,
      // Pre-calculate all text shadow values
      textShadow: `${blurIntensity * 5}px 0 currentColor, ${blurIntensity * -5}px 0 currentColor, ${blurIntensity * 10}px 0 rgba(255,255,255,0.3), ${blurIntensity * -10}px 0 rgba(255,255,255,0.3), ${blurIntensity * 15}px 0 rgba(255,255,255,0.1), ${blurIntensity * -15}px 0 rgba(255,255,255,0.1)`
    };
  }, [phase]);

  // Memoize individual layer styles
  const mainStyle = useMemo(() => ({
    opacity: calculatedStyles.opacity,
    filter: `blur(${calculatedStyles.verticalBlur}px)`,
    transform: `scaleX(${1 + calculatedStyles.blurIntensity * 0.1}) scaleY(${calculatedStyles.scale})`,
    transition: 'none',
    textShadow: calculatedStyles.textShadow
  }), [calculatedStyles]);

  const layer1Style = useMemo(() => ({
    opacity: calculatedStyles.blurIntensity * 0.6,
    filter: `blur(${calculatedStyles.horizontalBlur * 1.3}px)`,
    transform: `scaleX(${1 + calculatedStyles.blurIntensity * 0.3}) translateX(${calculatedStyles.blurIntensity * 3}px)`,
    mixBlendMode: 'screen' as const,
    transition: 'none'
  }), [calculatedStyles]);

  const layer2Style = useMemo(() => ({
    opacity: calculatedStyles.blurIntensity * 1.4,
    filter: `blur(${calculatedStyles.horizontalBlur * 0.5}px)`,
    transform: `scaleX(${1 + calculatedStyles.blurIntensity * 0.5}) translateX(${calculatedStyles.blurIntensity * -3}px)`,
    mixBlendMode: 'screen' as const,
    transition: 'none'
  }), [calculatedStyles]);

  const wideStreakStyle = useMemo(() => ({
    opacity: calculatedStyles.blurIntensity * 10,
    filter: `blur(${calculatedStyles.horizontalBlur}px)`,
    transform: `scaleX(${1 + calculatedStyles.blurIntensity * 0.8}) scaleY(0.9)`,
    mixBlendMode: 'screen' as const,
    transition: 'none'
  }), [calculatedStyles]);

  // Memoize ref handler
  const refHandler = useCallback((node: HTMLDivElement | null) => {
    textRef.current = node;
    if (typeof forwardedRef === 'function') {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  }, [forwardedRef]);

  // Memoize className concatenation
  const containerClassName = useMemo(() =>
    `relative inline-block ${className}`, [className]
  );

  return (
    <div
      ref={refHandler}
      className={containerClassName}
    >
      {/* Main text with horizontal motion blur */}
      <div style={mainStyle}>
        {children}
      </div>

      {/* Horizontal streak layer 1 */}
      <div className="absolute inset-0" style={layer1Style}>
        {children}
      </div>

      {/* Horizontal streak layer 2 */}
      <div className="absolute inset-0" style={layer2Style}>
        {children}
      </div>

      {/* Wide horizontal streak */}
      <div className="absolute inset-0" style={wideStreakStyle}>
        {children}
      </div>
    </div>
  );
});

VisualMixText.displayName = 'VisualMixText';