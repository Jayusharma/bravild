"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
    { name: "Home", href: "#home" }, // Changed to #home for consistent scrolling
    { name: "Work", href: "#work" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
];

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

    // Handle Active State on Scroll
    useEffect(() => {
        if (pathname !== "/") return;

        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight / 3;

            for (const link of navLinks) {
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
        handleScroll(); // Check on mount

        return () => window.removeEventListener("scroll", handleScroll);
    }, [pathname]);

    // Smooth Scroll Handler
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const targetId = href.substring(1);

        if (pathname === "/") {
            // We are on home page
            const element = document.getElementById(targetId);
            if (element) {
                // Use Lenis if available, otherwise native smooth scroll
                if (window.lenis) {
                    window.lenis.scrollTo(element);
                } else {
                    element.scrollIntoView({ behavior: "smooth" });
                }
                // Update active state immediately for responsiveness
                setActiveSection(targetId);
            } else if (targetId === 'home') {
                if (window.lenis) {
                    window.lenis.scrollTo(0);
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
                setActiveSection('home');
            }
        } else {
            // We are on another page, navigate to home with hash
            router.push(`/${href}`);
        }

        setIsMenuOpen(false);
    };

    // Header Animation on Scroll
    useEffect(() => {
        const showAnim = gsap.from(headerRef.current, {
            yPercent: -100,
            paused: true,
            duration: 0.4,
            ease: "power2.out",
        }).progress(1);

        ScrollTrigger.create({
            start: "top top",
            end: 99999,
            onUpdate: (self) => {
                if (self.direction === -1) {
                    showAnim.play();
                } else {
                    showAnim.reverse();
                }
            },
        });
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
                        <span className="text-2xl font-black tracking-widest text-white mix-blend-difference font-mont">
                            BRAVILD
                        </span>
                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full mix-blend-difference" />
                    </Link>

                    {/* Right Side Group (Nav + CTA) */}
                    <div className="hidden md:flex items-center gap-6">
                        {/* Desktop Nav - Glass Capsule */}
                        <nav className="flex items-center gap-1 p-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
                            {navLinks.map((link) => {
                                const isActive = activeSection === link.href.substring(1);
                                return (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        onClick={(e) => handleNavClick(e, link.href)}
                                        className={`relative px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${isActive
                                            ? "bg-white text-black shadow-lg shadow-white/10"
                                            : "text-white/80 hover:text-white hover:bg-white/10"
                                            }`}
                                    >
                                        {link.name}
                                    </a>
                                );
                            })}
                        </nav>

                        {/* CTA Button */}
                        <a
                            href="#contact"
                            onClick={(e) => handleNavClick(e, "#contact")}
                        >
                            <button className="group relative px-6 py-2.5 overflow-hidden rounded-full bg-white text-black font-bold text-xs tracking-widest uppercase transition-transform hover:scale-105">
                                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                                    Let&apos;s Talk
                                </span>
                                <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out" />
                            </button>
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden relative z-50 w-10 h-10 flex flex-col justify-center items-end gap-1.5 group mix-blend-difference"
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
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => handleNavClick(e, link.href)}
                            className="mobile-link text-5xl font-black text-white/90 hover:text-white tracking-tight transition-colors font-mont"
                        >
                            {link.name}
                        </a>
                    ))}
                    <div className="mobile-link mt-8">
                        <a
                            href="#contact"
                            onClick={(e) => handleNavClick(e, "#contact")}
                        >
                            <button className="px-8 py-4 border border-white/20 rounded-full text-white font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300">
                                Start a Project
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
