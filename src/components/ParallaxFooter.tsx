"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ArrowUp } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLoader } from "@/provider/LoaderContext";
import { services as serviceList } from "@/data/services";

gsap.registerPlugin(ScrollTrigger);

const EMAIL = "connect@bravild.in";
// TODO: add the business phone number (e.g. "+91 98765 43210") to show it in the footer.
const PHONE: string = "";


const pages = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/about#services" },
  { label: "FAQ", href: "/contact#faq" },
  { label: "Contact", href: "/contact" },
  { label: "Creative ↗", href: "https://creative.bravild.in/#work", external: true },
];

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jayditya-sharma-35ab14420" },
  { label: "Twitter", href: "https://x.com/Jayditya_sharma" },
  { label: "Instagram", href: "https://www.instagram.com/jayu_._sharma/" },
];

export default function ParallaxFooter() {
  const pathname = usePathname();
  const { isLoading } = useLoader();
  // Contact page is a light page: the callout + backdrop follow it, everywhere else stays black
  const light = pathname === "/contact";
  const tone = {
    "--cf": light ? "#171717" : "#ffffff",
    "--cb": light ? "#dfdff2" : "#050505",
  } as React.CSSProperties;
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const footerPanelRef = useRef<HTMLDivElement>(null);
  const calloutRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current || !imageRef.current || !footerPanelRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Image Parallax: as you scroll down, image drifts smoothly upward
      gsap.fromTo(
        imageRef.current,
        { yPercent: 0, scale: 1.05 },
        {
          yPercent: -25,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 0.8,
          },
        }
      );

      // 2. Footer Panel speed: accelerates upward faster than normal scroll,
      // gliding smoothly up and over/covering the bottom of the image
      gsap.fromTo(
        footerPanelRef.current,
        { yPercent: 18 },
        {
          yPercent: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",
            end: "bottom bottom",
            scrub: 1.1,
          },
        }
      );
    }, containerRef);

    // 3. Callout text: masked line reveal, then a subtle scroll-linked drift
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let io: IntersectionObserver | null = null;
    const calloutCtx = gsap.context(() => {
      if (reduceMotion) return;
      const root = calloutRef.current!;

      gsap.set(root.querySelectorAll(".callout-word"), { yPercent: 110 });
      gsap.set(root.querySelectorAll(".callout-fade"), { y: 12, opacity: 0 });

      const revealTl = gsap
        .timeline({ paused: true })
        .to(root.querySelectorAll(".callout-word"), {
          yPercent: 0,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.1,
        })
        .to(
          root.querySelectorAll(".callout-fade"),
          { y: 0, opacity: 1, duration: 0.7, ease: "power2.out", stagger: 0.1 },
          "-=0.5"
        );

      // Play the reveal when the section actually enters the viewport. Unlike a
      // ScrollTrigger start/end this does not depend on measured page height, which
      // is unreliable right after a client-side route change.
      const tlRef = revealTl
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((en) => en.isIntersecting)) {
            tlRef.play()
            io?.disconnect()
          }
        },
        { rootMargin: "0px 0px -8% 0px" }
      )
      io.observe(root)

      // Rows drift in opposite directions as the section scrolls through
      root.querySelectorAll(".callout-drift").forEach((row) => {
        const dir = Number((row as HTMLElement).dataset.dir) || 1;
        gsap.fromTo(
          row,
          { xPercent: dir * 4 },
          {
            xPercent: dir * -4,
            ease: "none",
            scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.6 },
          }
        );
      });
    }, calloutRef);

    // The footer mounts once, behind the preloader, before fonts/images/pins have
    // settled and long before the user scrolls here. Triggers measured at that
    // moment are wrong on a cold visit (a reload hits cache and happens to work),
    // so rebuild per route + loader state and re-measure once the layout is stable.
    const refresh = () => ScrollTrigger.refresh();
    let rafId = 0;
    let lastH = document.documentElement.scrollHeight;
    const ro = new ResizeObserver(() => {
      const h = document.documentElement.scrollHeight;
      if (Math.abs(h - lastH) < 4) return;
      lastH = h;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(refresh);
    });
    ro.observe(document.body);
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh).catch(() => {});
    const t1 = window.setTimeout(refresh, 300);
    const t2 = window.setTimeout(refresh, 1200);

    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      ro.disconnect();
      cancelAnimationFrame(rafId);
      io?.disconnect();
      ctx.revert();
      calloutCtx.revert();
    };
  }, [pathname, isLoading]);

  const scrollToTop = () => {
    if (window.lenis) {
      window.lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden select-none bg-[var(--cb)]"
      style={tone}
    >
      {/* ===================== TEXT CALLOUT (transparent, same canvas as the site) ===================== */}
      <section ref={calloutRef} className="bg-[var(--cb)] text-[var(--cf)] pt-20 sm:pt-24 md:pt-32 pb-3 md:pb-4">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 md:px-16 lg:px-20">
          <h2
            className=" uppercase tracking-tight leading-[0.95] text-[clamp(2rem,5.6vw,5.25rem)] select-none"
            aria-label="We scale your systems"
          >
            <span className="font-rayl font-bold block [clip-path:inset(0_-50vw)] pb-[0.08em]">
              <span className="callout-drift flex justify-between" data-dir="-1">
                <span className="callout-word inline-block">We</span>
                <span className="callout-word inline-block">Scale</span>
              </span>
            </span>

            <span className="block [clip-path:inset(0_-50vw)] pb-[0.08em]">
              <span className="callout-drift flex items-center justify-between gap-8" data-dir="1">
                <span className="callout-word inline-flex items-center gap-[0.2em]">
                  <span className="inline-block opacity-50">→</span>
                  <span>Your</span>
                </span>
                <span className="callout-fade hidden lg:block max-w-[13rem] text-right font-sans text-base normal-case tracking-normal leading-snug opacity-60">
                  Digital architectures for an ever-shifting world.
                </span>
              </span>
            </span>

            <span className="block [clip-path:inset(0_-50vw)] pb-[0.08em]">
              <span className="callout-drift flex items-end justify-between gap-8" data-dir="-1">
                <span className="callout-word inline-block">Systems</span>
                <Link
                  href="/contact"
                  className="callout-fade group hidden lg:inline-flex mb-[0.6em] items-center gap-3 rounded-full border border-[color-mix(in_srgb,var(--cf)_30%,transparent)] px-7 py-3 font-mono text-xs font-normal tracking-widest text-[var(--cf)] transition-colors duration-300 hover:bg-[var(--cf)] hover:text-[var(--cb)]"
                >
                  <span>LET&apos;S TALK</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </span>
            </span>
          </h2>

          <div className="callout-fade lg:hidden mt-8 flex flex-col items-start gap-5">
            <p className="max-w-xs text-sm sm:text-base opacity-60 leading-relaxed">
              Digital architectures for an ever-shifting world.
            </p>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 rounded-full border border-[color-mix(in_srgb,var(--cf)_30%,transparent)] px-6 py-2.5 font-mono text-xs tracking-widest uppercase text-[var(--cf)] transition-colors duration-300 hover:bg-[var(--cf)] hover:text-[var(--cb)]"
            >
              <span>Let&apos;s Talk</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== PARALLAX IMAGE STAGE ===================== */}
      <div
        ref={imageWrapperRef}
        className="relative w-full h-[55vh] sm:h-[65vh] md:h-[85vh] overflow-hidden"
      >
        <div
          ref={imageRef}
          className="absolute inset-0 w-full h-[125%] top-[20%] will-change-transform"
        >
          <Image
            src="/Futuristic VR Scene.png"
            alt="Futuristic VR Scene by Bravild"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center pointer-events-none contrast-[1.15] brightness-[0.97]"
          />

          {/* Black overlay layer for rich contrast & depth */}
          <div className="absolute inset-0 bg-black/20 pointer-events-none" />

          {/* Vignette gradients for seamless edge blend */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/15 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#09090b]/80 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* ===================== FOOTER PANEL (MATCHING OBSIDIAN COLOR, LITTLE SMALLER) ===================== */}
      <footer
        ref={footerPanelRef}
        className="relative z-20 -mt-16 sm:-mt-20 md:-mt-24 lg:-mt-28 bg-[#0f0f0f] text-white border-t border-white/10 will-change-transform shadow-2xl"
      >
        {/* Main Footer Grid with compact, refined padding */}
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 md:px-16 lg:px-20 pt-12 sm:pt-14 md:pt-16 pb-8 sm:pb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Column 1: Logo */}
            <div className="md:col-span-5">
              <Link href="/" className="inline-block hover:opacity-85 transition-opacity" aria-label="Bravild home">
                <Image
                  src="/brand/bravild-logo-on-dark.png"
                  alt="Bravild"
                  width={540}
                  height={240}
                  className="h-12 md:h-14 w-auto"
                />
              </Link>
            </div>

            {/* Column 2: Services */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/40 font-semibold mb-4">
                SERVICES
              </h4>
              <ul className="space-y-2.5 text-sm sm:text-base font-normal text-white/80">
                {serviceList.map(({ title: svc }) => (
                  <li key={svc}>
                    <Link href="/about#services" className="hover:text-white transition-colors">
                      {svc}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Pages + Connect */}
            <div className="md:col-span-4 grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/40 font-semibold mb-4">
                  PAGES
                </h4>
                <ul className="space-y-2.5 text-sm sm:text-base font-normal text-white/80">
                  {pages.map((pg) => (
                    <li key={pg.label}>
                      {"external" in pg && pg.external ? (
                        <a
                          href={pg.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-white transition-colors"
                        >
                          {pg.label}
                        </a>
                      ) : (
                        <Link href={pg.href} className="hover:text-white transition-colors">
                          {pg.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/40 font-semibold mb-4">
                  CONNECT
                </h4>
                <ul className="space-y-2.5 text-sm sm:text-base font-normal text-white/80">
                  {socials.map((so) => (
                    <li key={so.label}>
                      <a
                        href={so.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-white transition-colors"
                      >
                        <span>{so.label}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                      </a>
                    </li>
                  ))}
                  <li>
                    <a href={`mailto:${EMAIL}`} className="hover:text-white transition-colors">
                      {EMAIL}
                    </a>
                  </li>
                  {PHONE && (
                    <li>
                      <a href={`tel:${PHONE.replace(/s/g, "")}`} className="hover:text-white transition-colors">
                        {PHONE}
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </div>

          </div>

          {/* ===================== SUB-FOOTER / LEGAL ROW ===================== */}
          <div className="mt-10 sm:mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/50">
            <div>
              © {new Date().getFullYear()} Bravild Agency. All rights reserved.
            </div>

            <div className="flex items-center gap-6">

              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer uppercase"
              >
                <span>Back to Top</span>
                <ArrowUp className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
