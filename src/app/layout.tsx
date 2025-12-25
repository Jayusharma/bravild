import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/provider/LenisProvider";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bravild",
  description: "Experience the future of interactive design",
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
