"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLoader } from "@/provider/LoaderContext";

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "/about" },
    { name: "Work", href: "#work" },
    { name: "Contact", href: "/contact" },
];

const CREATIVE_URL = "https://creative.bravild.in/#work";

export default function SiteHeader() {
    const headerRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    const pathname = usePathname();
    const router = useRouter();

    // Toggle Menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    const { isLoading } = useLoader();

    // Handle Active State based on pathname and scroll
    useEffect(() => {
        if (pathname === "/contact") {
            setActiveSection("contact");
            return;
        }
        if (pathname === "/about") {
            setActiveSection("about");
            return;
        }

        if (pathname !== "/" || isLoading) return;

        // Handle initial hash scroll
        if (window.location.hash) {
            const targetId = window.location.hash.substring(1);
            if (targetId === "contact") return; // Do not auto-scroll to contact
            const element = document.getElementById(targetId);
            if (element) {
                setTimeout(() => {
                    if (window.lenis) {
                        window.lenis.scrollTo(element);
                    } else {
                        element.scrollIntoView({ behavior: "smooth" });
                    }
                    setActiveSection(targetId);
                }, 500);
            }
        }

        const handleScroll = () => {
            if (window.scrollY < 50) {
                setActiveSection("home");
                return;
            }
            const scrollPosition = window.scrollY + window.innerHeight / 3;

            for (const link of navLinks) {
                if (link.name === "Contact" || link.href.startsWith("/")) continue;
                const sectionId = link.href.substring(1);
                const element = document.getElementById(sectionId);

                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (
                        scrollPosition >= offsetTop &&
                        scrollPosition < offsetTop + offsetHeight
                    ) {
                        setActiveSection(sectionId);
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, [pathname, isLoading]);

    // Smooth Scroll / Multi-page navigation Handler
    const handleNavClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        destination: string | { name: string; href: string }
    ) => {
        const href = typeof destination === "string" ? destination : destination.href;
        const name = typeof destination === "string" ? "" : destination.name;

        if (href === "/contact" || href === "#contact" || name === "Contact") {
            e.preventDefault();
            if (pathname === "/contact") {
                if (window.lenis) {
                    window.lenis.scrollTo(0);
                } else {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }
            } else {
                router.push("/contact");
            }
            setActiveSection("contact");
            setIsMenuOpen(false);
            return;
        }

        if (href === "/about") {
            e.preventDefault();
            if (pathname === "/about") {
                if (window.lenis) {
                    window.lenis.scrollTo(0);
                } else {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }
            } else {
                router.push("/about");
            }
            setActiveSection("about");
            setIsMenuOpen(false);
            return;
        }

        e.preventDefault();
        const targetId = href.startsWith("#") ? href.substring(1) : href.replace(/^\//, "");

        if (pathname === "/") {
            // We are on home page
            const element = document.getElementById(targetId);
            if (element) {
                if (window.lenis) {
                    window.lenis.scrollTo(element);
                } else {
                    element.scrollIntoView({ behavior: "smooth" });
                }
                setActiveSection(targetId);
            } else if (targetId === "home") {
                if (window.lenis) {
                    window.lenis.scrollTo(0);
                } else {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }
                setActiveSection("home");
            }
        } else {
            // We are on another page, navigate to home with hash
            router.push(`/#${targetId}`);
        }

        setIsMenuOpen(false);
    };

    // Header Animation on Scroll
    useEffect(() => {
        const ctx = gsap.context(() => {
            const showAnim = gsap.from(headerRef.current, {
                yPercent: -100,
                paused: true,
                duration: 0.4,
                ease: "power2.out",
            }).progress(1);

            ScrollTrigger.create({
                start: "top top",
                end: "max",
                onUpdate: (self) => {
                    // Always show if near the top
                    if (self.scroll() < 50) {
                        showAnim.play();
                        return;
                    }

                    if (self.direction === -1) {
                        showAnim.play();
                    } else {
                        showAnim.reverse();
                    }
                },
            });
        });

        return () => ctx.revert();
    }, []);

    // Mobile Menu Animation
    useEffect(() => {
        gsap.set(menuRef.current, { xPercent: 100 });

        if (isMenuOpen) {
            gsap.to(menuRef.current, {
                xPercent: 0,
                duration: 0.6,
                ease: "power3.out",
            });
            gsap.fromTo(
                ".mobile-link",
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    stagger: 0.1,
                    delay: 0.2,
                    ease: "power2.out",
                }
            );
        } else {
            gsap.to(menuRef.current, {
                xPercent: 100,
                duration: 0.6,
                ease: "power3.in",
            });
        }
    }, [isMenuOpen]);

    return (
        <>
            <header
                ref={headerRef}
                className="fixed top-0 left-0 w-full z-50 px-6 py-6 md:px-12 transition-all duration-300"
            >
                <div className="max-w-[1800px] mx-auto flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="relative z-50 group">
                        {/* White logo + mix-blend-difference: reads white on dark, dark on light */}
                        <Image
                            src="/brand/bravild-logo-on-dark.png"
                            alt="Bravild"
                            width={540}
                            height={240}
                            priority
                            className="h-10 md:h-9 lg:h-11 w-auto mix-blend-difference"
                        />
                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full mix-blend-difference" />
                    </Link>

                    {/* Right Side Group (Nav + CTA) */}
                    <div className="hidden md:flex items-center gap-6">
                        {/* Desktop Nav - Glass Capsule */}
                        <nav className="flex items-center gap-1 p-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
                            {navLinks.map((link) => {
                                const isContact = link.name === "Contact" || link.href === "/contact";
                                const isActive = isContact
                                    ? pathname === "/contact"
                                    : activeSection === link.href.substring(1) ||
                                      activeSection === link.name.toLowerCase();

                                if (isContact) {
                                    return (
                                        <Link
                                            key={link.name}
                                            href="/contact"
                                            onClick={(e) => {
                                                if (pathname === "/contact") {
                                                    e.preventDefault();
                                                    if (window.lenis) {
                                                        window.lenis.scrollTo(0);
                                                    } else {
                                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                                    }
                                                }
                                                setIsMenuOpen(false);
                                            }}
                                            className={`relative px-5 py-2 md:px-3 md:py-1.5 lg:px-6 lg:py-2.5 xl:px-5 xl:py-2 rounded-full text-xs md:text-[0.7rem] lg:text-[0.85rem] xl:text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${isActive
                                                ? "bg-white text-black shadow-lg shadow-white/10"
                                                : "text-white/80 hover:text-white hover:bg-white/10"
                                                }`}
                                        >
                                            {link.name}
                                        </Link>
                                    );
                                }

                                return (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        onClick={(e) => handleNavClick(e, link)}
                                        className={`relative px-5 py-2 md:px-3 md:py-1.5 lg:px-6 lg:py-2.5 xl:px-5 xl:py-2 rounded-full text-xs md:text-[0.7rem] lg:text-[0.85rem] xl:text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${isActive
                                            ? "bg-white text-black shadow-lg shadow-white/10"
                                            : "text-white/80 hover:text-white hover:bg-white/10"
                                            }`}
                                    >
                                        {link.name}
                                    </a>
                                );
                            })}
                        </nav>

                        {/* Sister studio: external, opens creative.bravild.in projects */}
                        <a
                            href={CREATIVE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Bravild Creative (opens in a new tab)"
                            className="group relative hidden md:inline-flex items-center gap-2 rounded-full border border-white/15 hover:border-white/50 bg-white/[0.03] px-3.5 py-2 md:px-3 md:py-1.5 lg:px-4 lg:py-2.5 xl:px-4 xl:py-2 text-xs md:text-[0.7rem] lg:text-[0.85rem] xl:text-xs font-bold uppercase tracking-wider text-white/80 hover:text-white transition-colors duration-300"
                        >
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/70 animate-ping motion-reduce:animate-none" />
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            </span>
                            <span className="relative block h-[1.2em] overflow-hidden leading-[1.2em]">
                                <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-full">Creative</span>
                                <span className="absolute left-0 top-full block whitespace-nowrap transition-transform duration-300 ease-out group-hover:-translate-y-full">Bravild Creative</span>
                            </span>
                            <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                        </a>

                        {/* CTA Button */}
                        <Link
                            href="/contact"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <button className="group relative px-6 py-2.5 md:px-4 md:py-2 lg:px-7 lg:py-3 xl:px-6 xl:py-2.5 overflow-hidden rounded-full bg-white text-black font-bold text-xs md:text-[0.7rem] lg:text-[0.85rem] xl:text-xs tracking-widest uppercase transition-transform hover:scale-105 cursor-pointer">
                                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                                    Let&apos;s Talk
                                </span>
                                <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out" />
                            </button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden relative z-50 w-10 h-10 flex flex-col justify-center items-end gap-1.5 group mix-blend-difference cursor-pointer"
                    >
                        <span
                            className={`h-[2px] bg-white transition-all duration-300 ${isMenuOpen ? "w-8 rotate-45 translate-y-2" : "w-8"
                                }`}
                        />
                        <span
                            className={`h-[2px] bg-white transition-all duration-300 ${isMenuOpen ? "opacity-0" : "w-6 group-hover:w-8"
                                }`}
                        />
                        <span
                            className={`h-[2px] bg-white transition-all duration-300 ${isMenuOpen ? "w-8 -rotate-45 -translate-y-2" : "w-4 group-hover:w-8"
                                }`}
                        />
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                ref={menuRef}
                className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-xl md:hidden flex items-center justify-center ${isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
            >
                <div className="flex flex-col items-center gap-8">
                    {navLinks.map((link) => {
                        if (link.name === "Contact" || link.href === "/contact") {
                            return (
                                <Link
                                    key={link.name}
                                    href="/contact"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="mobile-link text-5xl font-black text-white/90 hover:text-white tracking-tight transition-colors font-mont"
                                >
                                    {link.name}
                                </Link>
                            );
                        }
                        return (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link)}
                                className="mobile-link text-5xl font-black text-white/90 hover:text-white tracking-tight transition-colors font-mont"
                            >
                                {link.name}
                            </a>
                        );
                    })}
                    <a
                        href={CREATIVE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsMenuOpen(false)}
                        className="mobile-link flex flex-col items-center gap-1 text-white/90 hover:text-white transition-colors"
                    >
                        <span className="flex items-center gap-3 text-5xl font-black tracking-tight font-mont">
                            Creative <span className="text-3xl font-light">↗</span>
                        </span>
                        <span className="text-xs font-mono uppercase tracking-[0.25em] text-white/45">Our creative studio</span>
                    </a>
                    <div className="mobile-link mt-8">
                        <Link
                            href="/contact"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <button className="px-8 py-4 border border-white/20 rounded-full text-white font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 cursor-pointer">
                                Start a Project
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
