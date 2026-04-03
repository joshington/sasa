

import Providers from "./providers";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import ConditionalHeader from "@/app/components/ConditionalHeader";
import InactivityGuard from "@/app/components/InactivityGuard";
import PageWrapper       from "@/app/components/PageWrapper";
import WhatsAppButton from "@/app/components/WhatsAppButton";
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
  title: {
    default: "Pesasa — Send Money. Control How It's Spent.",
    template: "%s | Pesasa",
  },
  description:
        "Pesasa is a controlled spending platform for families, companies and NGOs. Send money to children, employees or beneficiaries and control exactly how every shilling is spent.",
  keywords: [
    "controlled spending Uganda",
    "school allowance app Uganda",
    "send money Uganda family",
    "black tax solution",
    "diaspora remittance control",
    "fintech Uganda",
    "employee allowance management Africa",
    "NGO aid distribution Africa",
  ],
  metadataBase: new URL("https://pesasa.xyz"),
  openGraph: {
    title: "Pesasa — Send Money. Control How It's Spent.",
    description:
      "Send money to children, employees or beneficiaries and control exactly how every shilling is spent.",
    url: "https://pesasa.xyz",
    siteName: "Pesasa",
    images: [
      {
        url: "/newli.png", // create a 1200x630px image
        width: 1200,
        height: 630,
        alt: "Pesasa — Controlled Spending Platform",
      },
    ],
    locale: "en_UG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pesasa — Send Money. Control How It's Spent.",
    description:
      "Controlled spending platform for families, companies and NGOs in Uganda.",
    images: ["/newli.png"],
    creator: "@pesasapp", 
  },
   robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: "https://pesasa.xyz",
  },
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
          <InactivityGuard /> {/* ← new component to auto-logout after inactivity */}
          <ConditionalHeader /> {/* ← replaces the old hardcoded <header> */}
          <WhatsAppButton /> {/* ← new floating WhatsApp contact button */}
          <PageWrapper>{children}</PageWrapper>
        </Providers>
      </body>
    </html>
  );
}
