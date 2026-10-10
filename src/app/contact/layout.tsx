import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & FAQ | Bravild — Digital Agency",
  description:
    "Get in touch with Bravild. Tell us what you're building — AI systems, workflow automations, or flagship digital experiences. Review our frequently asked questions.",
  openGraph: {
    title: "Contact & FAQ | Bravild — Digital Agency",
    description:
      "Get in touch with Bravild. Tell us what you're building — AI systems, workflow automations, or flagship digital experiences. Review our frequently asked questions.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
