// app/page.tsx
"use client";

import About from "@/components/About";
import Hero from "@/components/Hero";
import Process from "@/components/Process";
import Project from "@/components/Project";
import Contact from "@/components/contact";
import GlobalBackground from "@/components/GlobalBackground";
import { ThemeProvider } from "@/provider/ThemeContext";


export default function Home() {
  return (
    <ThemeProvider>
      <div>
        <GlobalBackground />
        <Hero />
        <About />
        <Process />
        <Project />
        <Contact />
      </div>
    </ThemeProvider>
  );
}