

"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

        :root {
          --green-dark:   #0f3d0f;
          --green-mid:    #1a5c1a;
          --green-core:   #2d8a2d;
          --green-bright: #3ab54a;
          --green-light:  #d1fae5;
          --green-pale:   #f0fdf4;
          --text-dark:    #0a1a0a;
          --text-mid:     #374151;
          --text-soft:    #6b7280;
          --text-muted:   #9ca3af;
          --border:       #e5e7eb;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        html { scroll-behavior: smooth; }

        body {
          font-family: 'DM Sans', sans-serif;
          color: var(--text-dark);
          background: #ffffff;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }

        .container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 20px;
        }
        @media (min-width: 640px) { .container { padding: 0 28px; } }

        /* ─────────────────────────────────────────
           NAVBAR
        ───────────────────────────────────────── */
        .nav {
          position: sticky; top: 0; z-index: 50;
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          height: 64px;
          display: flex; align-items: center;
        }
        .nav-inner {
          width: 100%;
          display: flex; align-items: center;
          justify-content: space-between;
        }
        .nav-logo {
          display: flex; align-items: center; gap: 9px;
          text-decoration: none; flex-shrink: 0;
        }
        .nav-logo-text {
          font-family: 'Outfit', sans-serif;
          font-size: 19px; font-weight: 800;
          color: var(--green-mid); letter-spacing: -0.5px;
        }

        /* Desktop links — hidden on mobile */
        .nav-links {
          display: none;
          align-items: center;
          gap: 28px;
          list-style: none;
        }
        @media (min-width: 768px) { .nav-links { display: flex; } }
        .nav-links a {
          font-size: 14px; font-weight: 500;
          color: var(--text-soft); text-decoration: none;
          transition: color 0.15s;
        }
        .nav-links a:hover { color: var(--text-dark); }
        .merchants-link { display: flex; align-items: center; gap: 6px; }
        .nav-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green-bright); }

        /* Desktop CTAs */
        .nav-ctas { display: flex; align-items: center; gap: 8px; }
        .btn-outline {
          display: none;
          font-size: 13px; font-weight: 600;
          color: var(--green-core);
          border: 1.5px solid var(--green-light);
          padding: 8px 16px; border-radius: 10px;
          text-decoration: none;
          transition: background 0.15s, border-color 0.15s;
        }
        @media (min-width: 768px) { .btn-outline { display: inline-flex; } }
        .btn-outline:hover { background: var(--green-pale); border-color: var(--green-bright); }
        .btn-primary {
          font-size: 13px; font-weight: 700; color: #ffffff;
          background: var(--green-core);
          padding: 9px 18px; border-radius: 10px;
          text-decoration: none;
          transition: background 0.15s, transform 0.15s;
          box-shadow: 0 2px 8px rgba(45,138,45,0.25);
        }
        .btn-primary:hover { background: var(--green-mid); transform: translateY(-1px); }

        /* Hamburger button */
        .nav-hamburger {
          display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          gap: 5px;
          width: 40px; height: 40px;
          background: none; border: none; cursor: pointer;
          padding: 8px; border-radius: 8px;
          transition: background 0.15s;
          flex-shrink: 0;
        }
        .nav-hamburger:hover { background: var(--green-pale); }
        @media (min-width: 768px) { .nav-hamburger { display: none; } }
        .ham-line {
          width: 20px; height: 2px;
          background: var(--text-dark);
          border-radius: 2px;
          transition: all 0.25s ease;
          transform-origin: center;
        }
        .ham-line.open-1 { transform: translateY(7px) rotate(45deg); }
        .ham-line.open-2 { opacity: 0; transform: scaleX(0); }
        .ham-line.open-3 { transform: translateY(-7px) rotate(-45deg); }

        /* Mobile drawer */
        .mobile-menu {
          position: fixed; top: 64px; left: 0; right: 0; bottom: 0;
          background: #ffffff;
          z-index: 49;
          padding: 24px 20px;
          display: flex; flex-direction: column; gap: 4px;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          border-top: 1px solid var(--border);
          overflow-y: auto;
        }
        .mobile-menu.open { transform: translateX(0); }
        @media (min-width: 768px) { .mobile-menu { display: none !important; } }

        .mobile-menu-link {
          display: flex; align-items: center; gap: 10px;
          padding: 13px 16px;
          border-radius: 10px;
          font-size: 15px; font-weight: 600;
          color: var(--text-dark); text-decoration: none;
          transition: background 0.15s;
        }
        .mobile-menu-link:hover { background: var(--green-pale); color: var(--green-mid); }
        .mobile-menu-divider {
          height: 1px; background: var(--border); margin: 10px 0;
        }
        .mobile-menu-ctas {
          display: flex; flex-direction: column; gap: 10px; margin-top: 8px;
        }
        .mobile-btn-primary {
          display: flex; align-items: center; justify-content: center;
          padding: 14px; border-radius: 12px;
          font-size: 15px; font-weight: 700;
          background: var(--green-core); color: #ffffff;
          text-decoration: none;
          box-shadow: 0 2px 8px rgba(45,138,45,0.25);
        }
        .mobile-btn-outline {
          display: flex; align-items: center; justify-content: center;
          padding: 13px; border-radius: 12px;
          font-size: 15px; font-weight: 600;
          border: 1.5px solid var(--green-light);
          color: var(--green-core); text-decoration: none;
        }

        /* ─────────────────────────────────────────
           HERO
        ───────────────────────────────────────── */
        .hero {
          background: linear-gradient(135deg, var(--green-dark) 0%, var(--green-mid) 45%, var(--green-core) 100%);
          padding: 56px 0 64px;
          position: relative; overflow: hidden;
        }
        @media (min-width: 768px) { .hero { padding: 80px 0 90px; } }
        .hero::before {
          content: '';
          position: absolute; top: -100px; right: -100px;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(58,181,74,0.18) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero::after {
          content: '';
          position: absolute; bottom: -80px; left: -80px;
          width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(15,61,15,0.4) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-inner {
          position: relative; z-index: 1;
          display: flex; flex-direction: column;
          align-items: center; gap: 40px;
        }
        @media (min-width: 900px) {
          .hero-inner { flex-direction: row; justify-content: space-between; gap: 48px; }
        }
        .hero-text { max-width: 580px; text-align: center; width: 100%; }
        @media (min-width: 900px) { .hero-text { text-align: left; } }

        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 999px; padding: 5px 14px;
          font-size: 12px; font-weight: 600;
          color: rgba(255,255,255,0.85); letter-spacing: 0.4px;
          margin-bottom: 18px;
        }
        .hero-badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #7ee07e; animation: pulse 2s infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }

        .hero-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(32px, 7vw, 64px);
          font-weight: 900; color: #ffffff;
          line-height: 1.1; letter-spacing: -1.5px;
          margin-bottom: 18px;
        }
        .hero-title-accent { color: #7ee07e; display: block; }
        .hero-desc {
          font-size: 16px; line-height: 1.7;
          color: rgba(255,255,255,0.75);
          margin-bottom: 28px;
        }
        @media (min-width: 640px) { .hero-desc { font-size: 17px; } }
        .hero-desc strong { color: #ffffff; }

        .hero-ctas {
          display: flex; gap: 10px; flex-wrap: wrap;
          justify-content: center; margin-bottom: 20px;
        }
        @media (min-width: 900px) { .hero-ctas { justify-content: flex-start; } }
        .hero-btn-white {
          display: inline-flex; align-items: center; gap: 8px;
          background: #ffffff; color: var(--green-mid);
          font-weight: 700; font-size: 14px;
          padding: 12px 24px; border-radius: 12px;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        @media (min-width: 640px) {
          .hero-btn-white { font-size: 15px; padding: 13px 28px; }
        }
        .hero-btn-white:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
        .hero-btn-ghost {
          display: inline-flex; align-items: center;
          background: rgba(255,255,255,0.12);
          border: 1.5px solid rgba(255,255,255,0.3);
          color: #ffffff; font-weight: 600; font-size: 14px;
          padding: 12px 24px; border-radius: 12px;
          text-decoration: none;
          transition: background 0.15s;
        }
        @media (min-width: 640px) {
          .hero-btn-ghost { font-size: 15px; padding: 13px 28px; }
        }
        .hero-btn-ghost:hover { background: rgba(255,255,255,0.2); }

        .hero-merchant-link {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 13px; color: rgba(255,255,255,0.6);
          text-decoration: none; transition: color 0.15s;
          justify-content: center;
        }
        @media (min-width: 900px) { .hero-merchant-link { justify-content: flex-start; } }
        .hero-merchant-link:hover { color: #ffffff; }
        .hero-merchant-icon {
          width: 26px; height: 26px;
          background: rgba(255,255,255,0.15);
          border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px;
        }
        .hero-merchant-link span { text-decoration: underline; text-underline-offset: 3px; }

        /* Hero image — hidden on small mobile, shown from sm */
        .hero-image-wrap {
          flex-shrink: 0; position: relative;
          width: 100%; max-width: 340px;
          display: none;
        }
        @media (min-width: 600px) { .hero-image-wrap { display: block; } }
        @media (min-width: 900px) { .hero-image-wrap { max-width: 400px; } }
        .hero-image-wrap img {
          width: 100%; border-radius: 20px; display: block;
        }
        .hero-image-card {
          position: absolute; bottom: -14px; left: -16px;
          background: #ffffff; border-radius: 12px;
          padding: 10px 14px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          display: flex; align-items: center; gap: 10px;
          min-width: 160px;
        }
        .hero-image-card-icon {
          width: 32px; height: 32px;
          background: var(--green-pale); border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; flex-shrink: 0;
        }
        .hero-image-card-label { font-size: 9px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; }
        .hero-image-card-value { font-size: 14px; font-weight: 700; color: var(--green-mid); font-family: 'Outfit', sans-serif; }

        /* ─────────────────────────────────────────
           TRUST BAR
        ───────────────────────────────────────── */
        .trust {
          background: #ffffff;
          border-bottom: 1px solid var(--border);
          padding: 28px 0;
        }
        @media (min-width: 640px) { .trust { padding: 36px 0; } }
        .trust-inner {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        @media (min-width: 640px) {
          .trust-inner {
            grid-template-columns: repeat(4, 1fr);
            gap: 0;
          }
        }
        .trust-item { text-align: center; }
        .trust-value {
          font-family: 'Outfit', sans-serif;
          font-size: 22px; font-weight: 800;
          color: var(--green-core); letter-spacing: -0.5px; line-height: 1;
        }
        @media (min-width: 640px) { .trust-value { font-size: 26px; } }
        .trust-label { font-size: 12px; color: var(--text-soft); margin-top: 4px; }
        .trust-sep {
          display: none; width: 1px; background: var(--border);
        }
        @media (min-width: 640px) { .trust-sep { display: block; } }

        /* ─────────────────────────────────────────
           SECTIONS SHARED
        ───────────────────────────────────────── */
        .section { padding: 56px 0; }
        @media (min-width: 768px) { .section { padding: 80px 0; } }
        .section-alt { background: #f9fafb; }

        .section-label {
          font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 1px;
          color: var(--green-bright); margin-bottom: 10px;
          display: flex; align-items: center; gap: 8px;
          justify-content: center;
        }
        .section-label::before, .section-label::after {
          content: ''; flex: 1; max-width: 36px;
          height: 1px; background: var(--green-light);
        }
        .section-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(24px, 4vw, 42px);
          font-weight: 800; color: var(--text-dark);
          letter-spacing: -0.8px; text-align: center;
          margin-bottom: 10px;
        }
        .section-desc {
          font-size: 15px; color: var(--text-soft);
          text-align: center; max-width: 500px;
          margin: 0 auto 40px; line-height: 1.7;
        }
        @media (min-width: 640px) { .section-desc { font-size: 16px; margin-bottom: 48px; } }

        /* ─────────────────────────────────────────
           CARDS GRIDS
        ───────────────────────────────────────── */
        .cards-3 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 640px) { .cards-3 { grid-template-columns: repeat(3, 1fr); gap: 20px; } }

        .cards-6 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        @media (min-width: 480px) { .cards-6 { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 768px) { .cards-6 { grid-template-columns: repeat(3, 1fr); gap: 18px; } }

        /* ─────────────────────────────────────────
           USE CASE CARDS
        ───────────────────────────────────────── */
        .use-card {
          background: #ffffff; border: 1px solid var(--border);
          border-radius: 14px; padding: 24px 20px;
          transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
        }
        .use-card:hover {
          box-shadow: 0 8px 28px rgba(0,0,0,0.07);
          transform: translateY(-2px); border-color: var(--green-light);
        }
        .use-card-icon { font-size: 32px; margin-bottom: 14px; display: block; }
        .use-card-title {
          font-family: 'Outfit', sans-serif;
          font-size: 17px; font-weight: 700;
          color: var(--text-dark); margin-bottom: 7px; letter-spacing: -0.3px;
        }
        .use-card-desc { font-size: 14px; color: var(--text-soft); line-height: 1.65; }

        /* App cards */
        .app-card {
          background: linear-gradient(135deg, var(--green-pale) 0%, #ffffff 100%);
          border: 1px solid var(--green-light); border-radius: 14px;
          padding: 24px 20px;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .app-card:hover {
          box-shadow: 0 8px 28px rgba(58,181,74,0.1); transform: translateY(-2px);
        }
        .app-card-num {
          font-family: 'Outfit', sans-serif;
          font-size: 11px; font-weight: 800;
          text-transform: uppercase; letter-spacing: 1px;
          color: var(--green-bright); margin-bottom: 8px;
        }
        .app-card-title {
          font-family: 'Outfit', sans-serif;
          font-size: 17px; font-weight: 700;
          color: var(--green-mid); margin-bottom: 7px; letter-spacing: -0.3px;
        }
        .app-card-desc { font-size: 14px; color: var(--text-soft); line-height: 1.65; }

        /* Feature cards */
        .feat-card {
          text-align: center; background: #ffffff;
          border: 1px solid var(--border); border-radius: 14px;
          padding: 26px 20px;
          transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
        }
        .feat-card:hover {
          box-shadow: 0 8px 28px rgba(0,0,0,0.06);
          transform: translateY(-2px); border-color: var(--green-light);
        }
        .feat-icon-wrap {
          width: 54px; height: 54px;
          background: var(--green-pale); border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 26px; margin: 0 auto 14px;
        }
        .feat-title {
          font-family: 'Outfit', sans-serif;
          font-size: 16px; font-weight: 700;
          color: var(--text-dark); margin-bottom: 7px; letter-spacing: -0.3px;
        }
        .feat-desc { font-size: 13px; color: var(--text-soft); line-height: 1.65; }

        /* ─────────────────────────────────────────
           STEPS
        ───────────────────────────────────────── */
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }
        @media (min-width: 768px) { .steps-grid { grid-template-columns: repeat(4, 1fr); } }
        .step { text-align: center; }
        .step-num-wrap {
          width: 48px; height: 48px;
          background: linear-gradient(135deg, var(--green-core), var(--green-bright));
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 14px;
          box-shadow: 0 4px 12px rgba(58,181,74,0.35);
        }
        .step-num {
          font-family: 'Outfit', sans-serif;
          font-size: 18px; font-weight: 800; color: #ffffff;
        }
        .step-title {
          font-family: 'Outfit', sans-serif;
          font-size: 14px; font-weight: 700;
          color: var(--text-dark); margin-bottom: 6px;
        }
        .step-desc { font-size: 13px; color: var(--text-soft); line-height: 1.6; }

        /* ─────────────────────────────────────────
           MERCHANT BANNER
        ───────────────────────────────────────── */
        .merchant-banner {
          background: linear-gradient(135deg, var(--green-dark) 0%, var(--green-mid) 50%, var(--green-core) 100%);
          padding: 52px 0; position: relative; overflow: hidden;
        }
        @media (min-width: 768px) { .merchant-banner { padding: 64px 0; } }
        .merchant-banner::before {
          content: '';
          position: absolute; top: -60px; right: -60px;
          width: 300px; height: 300px; border-radius: 50%;
          background: rgba(255,255,255,0.05);
        }
        .merchant-banner-inner {
          position: relative; z-index: 1;
          display: flex; flex-direction: column;
          align-items: center; gap: 28px; text-align: center;
        }
        @media (min-width: 768px) {
          .merchant-banner-inner {
            flex-direction: row; justify-content: space-between; text-align: left;
          }
        }
        .merchant-banner-tag {
          font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 1px;
          color: #7ee07e; margin-bottom: 8px;
        }
        .merchant-banner-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(20px, 3vw, 30px);
          font-weight: 800; color: #ffffff;
          letter-spacing: -0.5px; margin-bottom: 10px;
        }
        .merchant-banner-desc {
          font-size: 14px; color: rgba(255,255,255,0.7);
          max-width: 460px; line-height: 1.6;
        }
        @media (min-width: 640px) { .merchant-banner-desc { font-size: 15px; } }
        .merchant-banner-desc strong { color: #ffffff; }
        .merchant-banner-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: #ffffff; color: var(--green-mid);
          font-family: 'Outfit', sans-serif;
          font-weight: 800; font-size: 14px;
          padding: 13px 28px; border-radius: 12px;
          text-decoration: none; white-space: nowrap; flex-shrink: 0;
          box-shadow: 0 4px 16px rgba(0,0,0,0.2);
          transition: transform 0.15s, box-shadow 0.15s;
          width: 100%;
          justify-content: center;
        }
        @media (min-width: 480px) { .merchant-banner-btn { width: auto; font-size: 15px; padding: 14px 32px; } }
        .merchant-banner-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.25); }

        /* ─────────────────────────────────────────
           FINAL CTA
        ───────────────────────────────────────── */
        .final-cta {
          background: var(--green-pale);
          border-top: 1px solid var(--green-light);
          padding: 60px 0; text-align: center;
        }
        @media (min-width: 768px) { .final-cta { padding: 80px 0; } }
        .final-cta-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(24px, 4vw, 46px);
          font-weight: 900; color: var(--green-mid);
          letter-spacing: -0.8px; margin-bottom: 12px;
        }
        .final-cta-desc {
          font-size: 15px; color: var(--text-soft);
          max-width: 460px; margin: 0 auto 28px; line-height: 1.7;
        }
        @media (min-width: 640px) { .final-cta-desc { font-size: 16px; margin-bottom: 32px; } }
        .final-cta-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--green-core); color: #ffffff;
          font-family: 'Outfit', sans-serif;
          font-weight: 800; font-size: 15px;
          padding: 14px 32px; border-radius: 12px;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(45,138,45,0.35);
          transition: background 0.15s, transform 0.15s;
        }
        @media (min-width: 640px) { .final-cta-btn { font-size: 16px; padding: 15px 36px; } }
        .final-cta-btn:hover { background: var(--green-mid); transform: translateY(-2px); }

        /* ─────────────────────────────────────────
           FOOTER
        ───────────────────────────────────────── */
        .footer { background: var(--green-dark); padding: 52px 0 0; }
        @media (min-width: 768px) { .footer { padding: 60px 0 0; } }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 36px;
          padding-bottom: 40px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        @media (min-width: 480px) {
          .footer-grid { grid-template-columns: repeat(2, 1fr); gap: 32px; }
        }
        @media (min-width: 900px) {
          .footer-grid { grid-template-columns: 2.2fr 1fr 1fr 1.5fr; gap: 40px; padding-bottom: 48px; }
        }

        .footer-brand-logo {
          display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
        }
        .footer-brand-name {
          font-family: 'Outfit', sans-serif;
          font-size: 20px; font-weight: 800;
          color: #ffffff; letter-spacing: -0.5px;
        }
        .footer-brand-desc {
          font-size: 13px; color: rgba(255,255,255,0.5);
          line-height: 1.7; max-width: 280px; margin-bottom: 18px;
        }
        .footer-stablecoin-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(58,181,74,0.12);
          border: 1px solid rgba(58,181,74,0.25);
          border-radius: 999px; padding: 5px 12px;
          font-size: 11px; font-weight: 600; color: #7ee07e; letter-spacing: 0.3px;
        }

        /* On mobile, brand takes full width */
        .footer-brand-col {
          grid-column: 1 / -1;
        }
        @media (min-width: 900px) { .footer-brand-col { grid-column: auto; } }

        .footer-col-title {
          font-family: 'Outfit', sans-serif;
          font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 1px;
          color: rgba(255,255,255,0.35); margin-bottom: 14px;
        }
        .footer-links { list-style: none; display: flex; flex-direction: column; gap: 9px; }
        .footer-links a {
          font-size: 13px; color: rgba(255,255,255,0.55);
          text-decoration: none; transition: color 0.15s;
        }
        .footer-links a:hover { color: #ffffff; }

        /* Contact */
        .footer-contact { display: flex; flex-direction: column; gap: 12px; }
        .footer-contact-item { display: flex; align-items: flex-start; gap: 10px; }
        .footer-contact-icon {
          width: 30px; height: 30px;
          background: rgba(255,255,255,0.07); border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; flex-shrink: 0; margin-top: 1px;
        }
        .footer-contact-label {
          font-size: 9px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.5px;
          color: rgba(255,255,255,0.3); margin-bottom: 2px;
        }
        .footer-contact-value {
          font-size: 12px; color: rgba(255,255,255,0.65); line-height: 1.5;
        }
        .footer-contact-value a {
          color: rgba(255,255,255,0.65); text-decoration: none; transition: color 0.15s;
        }
        .footer-contact-value a:hover { color: #7ee07e; }

        /* Contact col full width on small screens */
        .footer-contact-col {
          grid-column: 1 / -1;
        }
        @media (min-width: 900px) { .footer-contact-col { grid-column: auto; } }

        /* Bottom bar */
        .footer-bottom {
          padding: 18px 0;
          display: flex; flex-direction: column;
          align-items: center; gap: 8px; text-align: center;
        }
        @media (min-width: 640px) {
          .footer-bottom { flex-direction: row; justify-content: space-between; text-align: left; }
        }
        .footer-copyright { font-size: 12px; color: rgba(255,255,255,0.28); }
        .footer-bottom-links { display: flex; gap: 18px; }
        .footer-bottom-links a {
          font-size: 12px; color: rgba(255,255,255,0.28);
          text-decoration: none; transition: color 0.15s;
        }
        .footer-bottom-links a:hover { color: rgba(255,255,255,0.55); }
      `}</style>

      <main>

        {/* ── NAVBAR ── */}
        <nav className="nav">
          <div className="nav-inner container">
            <a href="/" className="nav-logo">
              <Image src="/pesasa-logo.png" alt="Pesasa" width={34} height={34} priority />
              <span className="nav-logo-text">Pesasa</span>
            </a>

            <ul className="nav-links">
              <li><a href="#usecases">Use Cases</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#how">How it works</a></li>
              <li>
                <Link href="/merchant/signin" className="merchants-link">
                  <span className="nav-dot" />
                  Merchants
                </Link>
              </li>
            </ul>

            <div className="nav-ctas">
              {/*
                <Link href="/merchant/signin" className="btn-outline">
                Merchant sign in
              </Link>
              */}
              
              <Link href="/auth/signin" className="btn-primary">
                Get Started →
              </Link>

              {/* Hamburger */}
              <button
                className="nav-hamburger"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                <span className={`ham-line${menuOpen ? " open-1" : ""}`} />
                <span className={`ham-line${menuOpen ? " open-2" : ""}`} />
                <span className={`ham-line${menuOpen ? " open-3" : ""}`} />
              </button>
            </div>
          </div>
        </nav>

        {/* ── MOBILE MENU DRAWER ── */}
        <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
          <a href="#usecases" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>
            📋 Use Cases
          </a>
          <a href="#features" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>
            ⚙️ Features
          </a>
          <a href="#how" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>
            🗺️ How it works
          </a>
          <div className="mobile-menu-divider" />
          <div className="mobile-menu-ctas">
            <Link href="/auth/signin" className="mobile-btn-primary" onClick={() => setMenuOpen(false)}>
              Get Started Free →
            </Link>
            <Link href="/merchant/signin" className="mobile-btn-outline" onClick={() => setMenuOpen(false)}>
              Merchant Sign In
            </Link>
          </div>
        </div>

        {/* ── HERO ── */}
        <section className="hero">
          <div className="container">
            <div className="hero-inner">
              <div className="hero-text">
                <div className="hero-badge">
                  <span className="hero-badge-dot" />
                  Now live in Uganda
                </div>
                <h1 className="hero-title">
                  Money that moves
                  <span className="hero-title-accent">with purpose.</span>
                </h1>
                <p className="hero-desc">
                  Pesasa gives institutions, families and NGOs
                  <strong> programmable spending accounts</strong> — so every
                  shilling reaches exactly where it&apos;s meant to go.
                </p>
                <div className="hero-ctas">
                  <Link href="/auth/signin" className="hero-btn-white">
                    Get Started Free
                  </Link>
                  <a href="#usecases" className="hero-btn-ghost">
                    See how it works
                  </a>
                </div>
                <Link href="/merchant/signin" className="hero-merchant-link">
                  <span className="hero-merchant-icon">🏪</span>
                  Are you a merchant?
                  <span>Sign in here →</span>
                </Link>
              </div>

              <div className="hero-image-wrap">
                <img
                  src="/mer.png"
                  alt="Mobile payment approved on Pesasa"
                  style={{
                    width: "100%",
                    borderRadius: "20px",
                    boxShadow: "0 24px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)",
                    display: "block",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
                {/* Subtle green glow behind image */}
                <div style={{
                  position: "absolute",
                  inset: "-12px",
                  borderRadius: "28px",
                  background: "radial-gradient(ellipse at center, rgba(58,181,74,0.15) 0%, transparent 70%)",
                  zIndex: -1,
                  pointerEvents: "none",
                }} />
                {/* Bottom-left: payment approved badge */}
                <div className="hero-image-card">
                  <div className="hero-image-card-icon">✅</div>
                  <div>
                    <div className="hero-image-card-label">Payment approved</div>
                    <div className="hero-image-card-value">UGX 12,500</div>
                  </div>
                </div>
                {/* Top-right: Pesasa Pay badge */}
                <div style={{
                  position: "absolute",
                  top: "-14px",
                  right: "-14px",
                  background: "linear-gradient(135deg, #1a5c1a, #3ab54a)",
                  borderRadius: "12px",
                  padding: "10px 14px",
                  boxShadow: "0 8px 20px rgba(58,181,74,0.35)",
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  minWidth: "130px",
                }}>
                  <div style={{
                    width: "28px", height: "28px",
                    background: "rgba(255,255,255,0.15)",
                    borderRadius: "8px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "14px", flexShrink: 0,
                  }}>📱</div>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: 700, 
                      textTransform: "uppercase", letterSpacing: "0.5px", color: "#ffffff", marginBottom: "1px" }}>
                      Pesasa
                    </div>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#ffffff", fontFamily: "'Outfit', sans-serif" }}>
                    
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TRUST BAR ── */}
        <section className="trust">
          <div className="container">
            <div className="trust-inner">
              {[
                { value: "100%",       label: "Cashless & Secure"      },
                { value: "Real-Time",  label: "Transaction Visibility"  },
                { value: "MTN+Airtel", label: "Mobile Money Ready"      },
                { value: "Stablecoins", label: "USDC Settlements"        },
              ].map((t) => (
                <div key={t.label} className="trust-item">
                  <div className="trust-value">{t.value}</div>
                  <div className="trust-label">{t.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHO USES PESASA ── */}
        <section id="usecases" className="section section-alt">
          <div className="container">
            <div className="section-label">Who it&apos;s for</div>
            <h2 className="section-title">Built for every institution</h2>
            <p className="section-desc">
              Whether you&apos;re a parent, an employer or an NGO — Pesasa gives you
              full control over how funds are spent.
            </p>
            <div className="cards-3">
              {[
                { icon: "👨‍👩‍👧", title: "Families",
                  desc: "Parents top up children's smart accounts. Kids spend only at approved school merchants — cafeterias, bookshops, tuck shops." },
                { icon: "🏢", title: "Companies",
                  desc: "Issue controlled allowances for transport, meals or fieldwork. Real-time visibility into every employee spend." },
                { icon: "🌍", title: "NGOs",
                  desc: "Distribute humanitarian aid as digital vouchers redeemable only at approved merchants — eliminating leakage." },
              ].map((c) => (
                <div key={c.title} className="use-card">
                  <span className="use-card-icon">{c.icon}</span>
                  <h3 className="use-card-title">{c.title}</h3>
                  <p className="use-card-desc">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── REAL WORLD APPLICATIONS ── */}
        <section className="section">
          <div className="container">
            <div className="section-label">Real world</div>
            <h2 className="section-title">Applications that matter</h2>
            <p className="section-desc">
              From school canteens in Kampala to aid programmes across East Africa —
              Pesasa is already at work.
            </p>
            <div className="cards-3">
              {[
                { n: "01", title: "Student Allowances",
                  desc: "Parents send money that students spend only at approved school merchants like cafeterias and bookstores. Zero cash leakage." },
                { n: "02", title: "Aid Distribution",
                  desc: "NGOs distribute food vouchers that beneficiaries redeem at approved merchants. Every shilling tracked, none wasted." },
                { n: "03", title: "Employee Allowances",
                  desc: "Companies provide controlled spending for transport, fuel or meals with full transparency and monthly reporting." },
              ].map((c) => (
                <div key={c.title} className="app-card">
                  <div className="app-card-num">{c.n}</div>
                  <h3 className="app-card-title">{c.title}</h3>
                  <p className="app-card-desc">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" className="section section-alt">
          <div className="container">
            <div className="section-label">Why Pesasa</div>
            <h2 className="section-title">Why institutions choose us</h2>
            <p className="section-desc">
              Purpose-built for emerging markets with the infrastructure
              and controls that matter.
            </p>
            <div className="cards-6">
              {[
                { icon: "⚙️", title: "Programmable Payments",
                  desc: "Define where, when and how funds can be used. Set merchant categories, daily limits and expiry rules." },
                { icon: "🔒", title: "Controlled Spending",
                  desc: "Funds flow only to approved merchants. Unauthorised transactions are blocked in real time at the point of sale." },
                { icon: "📱", title: "Mobile Money Native",
                  desc: "Built for Africa. Deposit via MTN Mobile Money or Airtel Money. No bank account required." },
                { icon: "◈", title: "Stablecoin Settlements",
                  desc: "Merchants receive weekly settlements in USDC or other stablecoins — instant, borderless, and verifiable on-chain." },
                { icon: "📊", title: "Real-Time Analytics",
                  desc: "Live dashboards for every transaction. Parents, employers and NGOs see exactly where every shilling went." },
                { icon: "🛡️", title: "Enterprise Security",
                  desc: "PIN-protected smart cards, hashed credentials, encrypted data at rest. Built to bank-grade security standards." },
              ].map((f) => (
                <div key={f.title} className="feat-card">
                  <div className="feat-icon-wrap">{f.icon}</div>
                  <h3 className="feat-title">{f.title}</h3>
                  <p className="feat-desc">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how" className="section">
          <div className="container">
            <div className="section-label">The process</div>
            <h2 className="section-title">Up and running in minutes</h2>
            <p className="section-desc">
              No paperwork, no bank visits. Create an account and start
              distributing controlled funds today.
            </p>
            <div className="steps-grid">
              {[
                { n: "1", title: "Create Your Wallet",
                  desc: "Sign up with Google. Your Pesasa wallet is ready instantly." },
                { n: "2", title: "Add Beneficiaries",
                  desc: "Add children, employees or aid recipients. Set their daily spend limits." },
                { n: "3", title: "Fund Your Wallet",
                  desc: "Deposit via MTN or Airtel Mobile Money. Funds appear immediately." },
                { n: "4", title: "Controlled Spending",
                  desc: "Beneficiaries spend only at approved Pesasa merchants. You see it all in real time." },
              ].map((s) => (
                <div key={s.title} className="step">
                  <div className="step-num-wrap">
                    <span className="step-num">{s.n}</span>
                  </div>
                  <h3 className="step-title">{s.title}</h3>
                  <p className="step-desc">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MERCHANT BANNER ── */}
        <section className="merchant-banner">
          <div className="container">
            <div className="merchant-banner-inner">
              <div>
                <div className="merchant-banner-tag">For merchants &amp; institutions</div>
                <h2 className="merchant-banner-title">
                  Accept Pesasa payments at your outlet
                </h2>
                <p className="merchant-banner-desc">
                  Earn <strong>0.5% commission</strong> on every withdrawal.
                  Get settled weekly in stablecoins. Serve your
                  institution&apos;s students or employees with zero friction.
                </p>
              </div>
              <Link href="/merchant/signin" className="merchant-banner-btn">
                Become a Merchant →
              </Link>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="final-cta">
          <div className="container">
            <h2 className="final-cta-title">Ready to move money with purpose?</h2>
            <p className="final-cta-desc">
              Join families, institutions and NGOs already using Pesasa
              to power controlled digital spending across Uganda.
            </p>
            <Link href="/auth/signin" className="final-cta-btn">
              Get Started Free →
            </Link>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="footer">
          <div className="container">
            <div className="footer-grid">

              {/* Brand — full width on mobile */}
              <div className="footer-brand-col">
                <div className="footer-brand-logo">
                  <Image src="/pesasa-logo.png" alt="Pesasa" width={30} height={30} />
                  <span className="footer-brand-name">Pesasa</span>
                </div>
                <p className="footer-brand-desc">
                  Financial rails enabling institutions, families and
                  organisations to distribute money that is spent exactly
                  as intended. Built for emerging markets.
                </p>
                <div className="footer-stablecoin-badge">
                  <span>◈</span> Stablecoin Settlements
                </div>
              </div>

              {/* Platform */}
              <div>
                <div className="footer-col-title">Platform</div>
                <ul className="footer-links">
                  <li><Link href="/auth/signin">For Families</Link></li>
                  <li><Link href="/merchant/signin">For Merchants</Link></li>
                  <li><a href="#usecases">Use Cases</a></li>
                  <li><a href="#features">Features</a></li>
                  <li><a href="#how">How it works</a></li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <div className="footer-col-title">Company</div>
                <ul className="footer-links">
                  <li><a href="#">About Pesasa</a></li>
                  <li><a href="#">Careers</a></li>
                  <li><a href="#">Privacy Policy</a></li>
                  <li><a href="#">Terms of Service</a></li>
                  <li><a href="#">Support</a></li>
                </ul>
              </div>

              {/* Contact — full width on mobile */}
              <div className="footer-contact-col">
                <div className="footer-col-title">Contact Us</div>
                <div className="footer-contact">
                  <div className="footer-contact-item">
                    <div className="footer-contact-icon">📍</div>
                    <div>
                      <div className="footer-contact-label">Location</div>
                      <div className="footer-contact-value">
                        Soliz House, Lumumba Avenue<br />Kampala, Uganda
                      </div>
                    </div>
                  </div>
                  <div className="footer-contact-item">
                    <div className="footer-contact-icon">📞</div>
                    <div>
                      <div className="footer-contact-label">Phone</div>
                      <div className="footer-contact-value">
                        <a href="tel:+256706626855">+256 706 626 855</a>
                      </div>
                    </div>
                  </div>
                  <div className="footer-contact-item">
                    <div className="footer-contact-icon">✉️</div>
                    <div>
                      <div className="footer-contact-label">Email</div>
                      <div className="footer-contact-value">
                        <a href="mailto:info@pesasa.xyz">info@pesasa.xyz</a>
                      </div>
                    </div>
                  </div>
                  <div className="footer-contact-item">
                    <div className="footer-contact-icon">🌐</div>
                    <div>
                      <div className="footer-contact-label">Website</div>
                      <div className="footer-contact-value">
                        <a href="https://pesasa.xyz">pesasa.xyz</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom bar */}
            <div className="footer-bottom">
              <p className="footer-copyright">
                © {new Date().getFullYear()} Pesasa Technologies Ltd. All rights reserved.
              </p>
              <div className="footer-bottom-links">
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
                <a href="#">Cookies</a>
              </div>
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}