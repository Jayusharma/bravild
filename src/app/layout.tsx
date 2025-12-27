import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/provider/LenisProvider";
import Header from "../components/SiteHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bravild",
  description: "Experience the future of interactive design",
  openGraph: {
    title: "Bravild",
    description: "Experience the future of interactive design",
    images: [
      {
        url: "/ss.png",
        width: 1200,
        height: 630,
        alt: "Bravild Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bravild",
    description: "Experience the future of interactive design",
    images: ["/ss.png"],
  },
};

import Preloader from "@/components/Preloader";

import { LoaderProvider } from "@/provider/LoaderContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LoaderProvider>
          <Preloader />
          <LenisProvider>
            <Header />
            <main>
              {children}
            </main>
          </LenisProvider>
        </LoaderProvider>
      </body>
    </html>
  );
}
