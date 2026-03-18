

"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";

// Routes where the global landing nav should NOT appear
// (these pages have their own nav built in)
const HIDDEN_ON = [

  "/","/parent/", "/merchant/", "/admin/", "/auth/", //sign-in pages have their own nav too
];

export default function ConditionalHeader() {
  const pathname = usePathname();

  const shouldHide = HIDDEN_ON.some((route) =>
    route === "/" ? pathname === "/" :  pathname.startsWith(route)
  );
  if (shouldHide) return null;

  return (
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
          <span className="text-xl font-bold text-green-700">Pesasa</span>
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
            className="px-4 py-2 bg-green-600 text-white rounded-lg
                       hover:bg-green-700 transition"
          >
            Join Waitlist
          </a>
        </nav>
      </div>
    </header>
  );
}