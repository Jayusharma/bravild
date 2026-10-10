import type { Metadata } from "next";
import Link from "next/link";
import AboutIntro from "@/components/about/AboutIntro";
import AboutStory from "@/components/about/AboutStory";
import AboutServices from "@/components/about/AboutServices";

export const metadata: Metadata = {
  title: "About | Bravild",
  description:
    "The story behind Bravild and the services we provide: AI systems, workflow automation, web platforms, CRM and enterprise architecture.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#050505] text-white">
      <AboutIntro />
      <AboutStory />
      <AboutServices />
      {/* <section className="px-6 sm:px-10 md:px-16 lg:px-20 py-24 md:py-32 max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <p className="font-mont font-normal text-[clamp(1.4rem,2.6vw,2.4rem)] leading-tight max-w-2xl">
          Got something that needs fixing? Let&apos;s talk.
        </p>
        <Link
          href="/contact"
          className="group inline-flex w-fit items-center gap-3 rounded-full border border-white/30 px-7 py-3 font-mono text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-300"
        >
          <span>Let&apos;s Talk</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>
      </section> */}
    </div>
  );
}
