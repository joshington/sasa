

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";

const NAV = [
  { href: "/admin/dashboard",    icon: "◈", label: "Overview" },
  { href: "/admin/transactions", icon: "⇄", label: "Transactions" },
  { href: "/admin/merchants",    icon: "🏪", label: "Merchants" },
  { href: "/admin/settlements",  icon: "💳", label: "Settlements" },
  { href: "/admin/parents",      icon: "👥", label: "Parents & Kids" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    //await signOut({ redirect: false });
    //since we have built our own signout
    await fetch("/api/admin/logout", {method: "POST" });
    router.push("/admin/signin");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .al-root {
          display: flex;
          min-height: 100vh;
          background: #0d1117;
          font-family: 'DM Sans', sans-serif;
          color: #e6edf3;
        }

        /* Sidebar */
        .al-sidebar {
          width: 240px;
          flex-shrink: 0;
          background: #161b22;
          border-right: 1px solid #21262d;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0; left: 0; bottom: 0;
          z-index: 50;
          transition: transform 0.25s ease;
        }
        @media (max-width: 768px) {
          .al-sidebar {
            transform: ${sidebarOpen ? "translateX(0)" : "translateX(-100%)"};
          }
        }

        .al-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 24px 20px;
          border-bottom: 1px solid #21262d;
        }
        .al-logo-text {
          font-size: 16px;
          font-weight: 700;
          color: #f0f6fc;
          letter-spacing: -0.3px;
        }
        .al-logo-text span { color: #3ab54a; font-weight: 500; }

        .al-admin-badge {
          margin: 12px 16px;
          padding: 6px 10px;
          background: rgba(58,181,74,0.08);
          border: 1px solid rgba(58,181,74,0.2);
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
          color: #3ab54a;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          text-align: center;
        }

        .al-nav {
          flex: 1;
          padding: 8px 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow-y: auto;
        }

        .al-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #7d8590;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
        }
        .al-nav-item:hover {
          background: rgba(255,255,255,0.05);
          color: #e6edf3;
        }
        .al-nav-item.active {
          background: rgba(58,181,74,0.12);
          color: #3ab54a;
          font-weight: 600;
        }
        .al-nav-icon {
          font-size: 16px;
          width: 20px;
          text-align: center;
          flex-shrink: 0;
        }

        .al-signout {
          padding: 16px 12px;
          border-top: 1px solid #21262d;
        }
        .al-signout button {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 8px;
          border: none;
          background: none;
          font-size: 14px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          color: #7d8590;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .al-signout button:hover {
          background: rgba(220,38,38,0.1);
          color: #f87171;
        }

        /* Main */
        .al-main {
          margin-left: 240px;
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        @media (max-width: 768px) {
          .al-main { margin-left: 0; }
        }

        /* Topbar */
        .al-topbar {
          height: 60px;
          border-bottom: 1px solid #21262d;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          position: sticky;
          top: 0;
          z-index: 40;
          background: #161b22;
        }
        .al-topbar-title {
          font-size: 16px;
          font-weight: 600;
          color: #f0f6fc;
        }
        .al-topbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .al-avatar {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2d8a2d, #3ab54a);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
        }

        .al-hamburger {
          display: none;
          background: none;
          border: none;
          color: #e6edf3;
          font-size: 20px;
          cursor: pointer;
        }
        @media (max-width: 768px) {
          .al-hamburger { display: block; }
        }

        .al-content {
          flex: 1;
          padding: 28px;
          overflow-x: hidden;
        }

        /* Overlay for mobile */
        .al-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 49;
        }
        @media (max-width: 768px) {
          .al-overlay.open { display: block; }
        }
      `}</style>

      <div className="al-root">
        {/* Sidebar */}
        <aside className="al-sidebar">
          <div className="al-logo">
            <Image src="/pesasa-logo.png" alt="Pesasa" width={28} height={28} />
            <span className="al-logo-text">pesasa <span>admin</span></span>
          </div>
          <div className="al-admin-badge">⚡ Admin Portal</div>
          <nav className="al-nav">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`al-nav-item${pathname === item.href ? " active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="al-nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="al-signout">
            <button onClick={handleSignOut}>
              <span>🚪</span> Sign out
            </button>
          </div>
        </aside>

        {/* Mobile overlay */}
        <div
          className={`al-overlay${sidebarOpen ? " open" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Main content */}
        <main className="al-main">
          <div className="al-topbar">
            <button className="al-hamburger" onClick={() => setSidebarOpen((v) => !v)}>☰</button>
            <span className="al-topbar-title">
              {NAV.find((n) => n.href === pathname)?.label ?? "Admin"}
            </span>
            <div className="al-topbar-right">
              <div className="al-avatar">A</div>
            </div>
          </div>
          <div className="al-content">{children}</div>
        </main>
      </div>
    </>
  );
}