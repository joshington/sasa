

import Providers from "./providers";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import ConditionalHeader from "@/app/components/ConditionalHeader";
import PageWrapper       from "@/app/components/PageWrapper";
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
  },
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
          <ConditionalHeader /> {/* ← replaces the old hardcoded <header> */}

          <PageWrapper>{children}</PageWrapper>
        </Providers>
      </body>
    </html>
  );
}