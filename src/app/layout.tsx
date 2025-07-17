import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/provider/LenisProvider";
import Myhead from "@/components/header";
import { HeaderProvider } from "@/components/headerContext";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bravild",
  description: "Experience the future of interactive design",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <LenisProvider>
          <div>
          <HeaderProvider>
         <Myhead />
          {children}
         </HeaderProvider>
          </div>
        </LenisProvider>
       
      </body>
    </html>
  );
}
