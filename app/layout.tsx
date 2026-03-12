
import Providers from "./providers";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Pesasa | Controlled Digital Spending",
    description:
      "Pesasa enables institutions, NGOs, families and companies to distribute programmable money that can only be spent for its intended purpose.",
    icons: {
      icon: "/pesa32.png",
    }
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {/* NAVBAR */}
          <header className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
            <div className="max-w-7xl mx-auto px-6 md:px-20 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src="/pesasa-logo.png"
                  alt="Pesasa Logo"
                  width={40}
                  height={40}
                  priority
                />
                <span className="text-xl font-bold text-green-700">
                  Pesasa
                </span>
              </div>

              <nav className="hidden md:flex gap-8 text-gray-700 font-medium">
                <a href="#features" className="hover:text-green-600 transition">
                  Features
                </a>
                <a href="#how" className="hover:text-green-600 transition">
                  How It Works
                </a>
                <a
                  href="#waitlist"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Join Waitlist
                </a>
              </nav>
            </div>
          </header>

          {/* Push content below fixed navbar */}
          <div className="pt-20">{children}</div>
        </Providers>
      </body>
    </html>
  );
}