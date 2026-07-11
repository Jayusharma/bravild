"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/provider/ThemeContext";

type Star = {
    x: number;
    y: number;
    r: number;
    baseAlpha: number;
    phase: number;
    twinkle: number;
    drift: number;
};

type Meteor = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
};

// Quiet universe: small twinkling stars, a slow drift, and a rare shooting
// star. Renders only while the theme is dark; fades in/out with it.
export default function Starfield() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme();
    const isDark = theme === "dark";

    useEffect(() => {
        if (!isDark) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let stars: Star[] = [];
        let meteor: Meteor | null = null;
        let nextMeteorAt = performance.now() + 3000 + Math.random() * 5000;
        let raf = 0;
        let w = 0;
        let h = 0;

        const build = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            // ~110 stars on a 1080p screen; a few larger ones get a halo
            const count = Math.round((w * h) / 14000);
            stars = Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() < 0.92 ? 0.3 + Math.random() * 0.9 : 1.2 + Math.random() * 0.6,
                baseAlpha: 0.2 + Math.random() * 0.55,
                phase: Math.random() * Math.PI * 2,
                twinkle: 0.3 + Math.random() * 1.1,
                drift: 0.004 + Math.random() * 0.016,
            }));
        };

        const drawStars = (t: number) => {
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = "#ffffff";
            for (const s of stars) {
                s.x += s.drift;
                if (s.x > w + 2) s.x = -2;
                const alpha = reduceMotion
                    ? s.baseAlpha
                    : s.baseAlpha * (0.55 + 0.45 * Math.sin(t * s.twinkle + s.phase));
                ctx.globalAlpha = Math.max(alpha, 0.05);
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fill();
                // Soft halo on the handful of bigger stars
                if (s.r > 1.1) {
                    ctx.globalAlpha = alpha * 0.16;
                    ctx.beginPath();
                    ctx.arc(s.x, s.y, s.r * 3.2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            ctx.globalAlpha = 1;
        };

        const drawMeteor = (now: number) => {
            if (!meteor && now >= nextMeteorAt) {
                meteor = {
                    x: w * (0.15 + Math.random() * 0.7),
                    y: -20,
                    vx: (Math.random() < 0.5 ? -1 : 1) * (2.4 + Math.random() * 1.4),
                    vy: 3.6 + Math.random() * 1.6,
                    life: 0,
                    maxLife: 70,
                };
                nextMeteorAt = now + 6000 + Math.random() * 8000;
            }
            if (!meteor) return;

            meteor.x += meteor.vx;
            meteor.y += meteor.vy;
            meteor.life++;

            const fade = Math.sin((meteor.life / meteor.maxLife) * Math.PI);
            const tailX = meteor.x - meteor.vx * 12;
            const tailY = meteor.y - meteor.vy * 12;
            const grad = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
            grad.addColorStop(0, `rgba(255,255,255,${0.75 * fade})`);
            grad.addColorStop(1, "rgba(255,255,255,0)");
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(meteor.x, meteor.y);
            ctx.lineTo(tailX, tailY);
            ctx.stroke();

            if (meteor.life >= meteor.maxLife || meteor.y > h + 40) meteor = null;
        };

        const frame = (now: number) => {
            drawStars(now / 1000);
            drawMeteor(now);
            raf = requestAnimationFrame(frame);
        };

        build();
        if (reduceMotion) {
            // Static sky — no animation loop, no meteors
            drawStars(0);
        } else {
            raf = requestAnimationFrame(frame);
        }

        window.addEventListener("resize", build);
        // Note: the canvas is NOT cleared on cleanup — the last frame stays
        // put so the CSS opacity fade-out has something to fade
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", build);
        };
    }, [isDark]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ opacity: isDark ? 1 : 0, transition: "opacity 1.4s ease" }}
        />
    );
}
