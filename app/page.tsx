

import Image from "next/image";
import Link from "next/link";

export default function Home() {
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

        body {
          font-family: 'DM Sans', sans-serif;
          color: var(--text-dark);
          background: #ffffff;
          -webkit-font-smoothing: antialiased;
        }

        /* ── Utility ── */
        .container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ─────────────────────────────────────────
           NAVBAR
        ───────────────────────────────────────── */
        .nav {
          position: sticky; top: 0; z-index: 50;
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          height: 68px;
          display: flex; align-items: center;
        }
        .nav-inner {
          width: 100%; max-width: 1100px;
          margin: 0 auto; padding: 0 24px;
          display: flex; align-items: center;
          justify-content: space-between;
        }
        .nav-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none;
        }
        .nav-logo-text {
          font-family: 'Outfit', sans-serif;
          font-size: 20px; font-weight: 800;
          color: var(--green-mid); letter-spacing: -0.5px;
        }
        .nav-links {
          display: none;
          align-items: center;
          gap: 32px;
          list-style: none;
        }
        @media (min-width: 768px) { .nav-links { display: flex; } }
        .nav-links a {
          font-size: 14px; font-weight: 500;
          color: var(--text-soft); text-decoration: none;
          transition: color 0.15s;
        }
        .nav-links a:hover { color: var(--text-dark); }
        .nav-links .merchants-link {
          display: flex; align-items: center; gap: 6px;
        }
        .nav-dot {
          width: 6px; height: 6px;
          border-radius: 50%; background: var(--green-bright);
        }
        .nav-ctas {
          display: flex; align-items: center; gap: 8px;
        }
        .btn-outline {
          display: none;
          font-size: 13px; font-weight: 600;
          color: var(--green-core);
          border: 1.5px solid var(--green-light);
          padding: 8px 16px; border-radius: 10px;
          text-decoration: none;
          transition: background 0.15s, border-color 0.15s;
        }
        @media (min-width: 640px) { .btn-outline { display: inline-flex; } }
        .btn-outline:hover { background: var(--green-pale); border-color: var(--green-bright); }
        .btn-primary {
          font-size: 13px; font-weight: 700;
          color: #ffffff;
          background: var(--green-core);
          padding: 9px 20px; border-radius: 10px;
          text-decoration: none;
          transition: background 0.15s, transform 0.15s;
          box-shadow: 0 2px 8px rgba(45,138,45,0.25);
        }
        .btn-primary:hover { background: var(--green-mid); transform: translateY(-1px); }

        /* ─────────────────────────────────────────
           HERO
        ───────────────────────────────────────── */
        .hero {
          background: linear-gradient(135deg, var(--green-dark) 0%, var(--green-mid) 45%, var(--green-core) 100%);
          padding: 80px 0 90px;
          position: relative;
          overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute; top: -100px; right: -100px;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(58,181,74,0.18) 0%, transparent 70%);
        }
        .hero::after {
          content: '';
          position: absolute; bottom: -80px; left: -80px;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(15,61,15,0.4) 0%, transparent 70%);
        }
        .hero-inner {
          position: relative; z-index: 1;
          display: flex; flex-direction: column;
          align-items: center; gap: 48px;
        }
        @media (min-width: 900px) {
          .hero-inner { flex-direction: row; align-items: center; justify-content: space-between; }
        }
        .hero-text { max-width: 580px; text-align: center; }
        @media (min-width: 900px) { .hero-text { text-align: left; } }

        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 999px;
          padding: 5px 14px;
          font-size: 12px; font-weight: 600;
          color: rgba(255,255,255,0.85);
          letter-spacing: 0.4px;
          margin-bottom: 20px;
        }
        .hero-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #7ee07e;
          animation: pulse 2s infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }

        .hero-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(36px, 6vw, 64px);
          font-weight: 900;
          color: #ffffff;
          line-height: 1.1;
          letter-spacing: -1.5px;
          margin-bottom: 20px;
        }
        .hero-title-accent {
          color: #7ee07e;
          display: block;
        }
        .hero-desc {
          font-size: 17px; line-height: 1.7;
          color: rgba(255,255,255,0.75);
          margin-bottom: 32px;
          max-width: 480px;
        }
        .hero-desc strong { color: #ffffff; }
        .hero-ctas {
          display: flex; gap: 12px; flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 24px;
        }
        @media (min-width: 900px) { .hero-ctas { justify-content: flex-start; } }
        .hero-btn-white {
          display: inline-flex; align-items: center; gap: 8px;
          background: #ffffff; color: var(--green-mid);
          font-weight: 700; font-size: 15px;
          padding: 13px 28px; border-radius: 12px;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .hero-btn-white:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
        .hero-btn-ghost {
          display: inline-flex; align-items: center;
          background: rgba(255,255,255,0.12);
          border: 1.5px solid rgba(255,255,255,0.3);
          color: #ffffff; font-weight: 600; font-size: 15px;
          padding: 13px 28px; border-radius: 12px;
          text-decoration: none;
          transition: background 0.15s, border-color 0.15s;
        }
        .hero-btn-ghost:hover { background: rgba(255,255,255,0.2); border-color: rgba(255,255,255,0.5); }
        .hero-merchant-link {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 13px; color: rgba(255,255,255,0.6);
          text-decoration: none;
          transition: color 0.15s;
        }
        .hero-merchant-link:hover { color: #ffffff; }
        .hero-merchant-icon {
          width: 28px; height: 28px;
          background: rgba(255,255,255,0.15);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
        }
        .hero-merchant-link span { text-decoration: underline; text-underline-offset: 3px; }

        /* Hero image */
        .hero-image-wrap {
          flex-shrink: 0;
          position: relative;
        }
        .hero-image-wrap img {
          width: 100%; max-width: 380px;
          border-radius: 20px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.35);
          display: block;
        }
        .hero-image-card {
          position: absolute; bottom: -16px; left: -20px;
          background: #ffffff;
          border-radius: 14px;
          padding: 12px 16px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          display: flex; align-items: center; gap: 10px;
          min-width: 180px;
        }
        .hero-image-card-icon {
          width: 36px; height: 36px;
          background: var(--green-pale);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
        }
        .hero-image-card-label { font-size: 10px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; }
        .hero-image-card-value { font-size: 15px; font-weight: 700; color: var(--green-mid); font-family: 'Outfit', sans-serif; }

        /* ─────────────────────────────────────────
           TRUST BAR
        ───────────────────────────────────────── */
        .trust {
          background: #ffffff;
          border-bottom: 1px solid var(--border);
          padding: 36px 0;
        }
        .trust-inner {
          display: flex; flex-direction: column;
          align-items: center; gap: 28px;
        }
        @media (min-width: 640px) {
          .trust-inner { flex-direction: row; justify-content: center; gap: 48px; }
        }
        .trust-item { text-align: center; }
        .trust-value {
          font-family: 'Outfit', sans-serif;
          font-size: 28px; font-weight: 800;
          color: var(--green-core); letter-spacing: -0.5px;
          line-height: 1;
        }
        .trust-label { font-size: 13px; color: var(--text-soft); margin-top: 4px; }
        .trust-sep {
          width: 1px; height: 40px;
          background: var(--border); display: none;
        }
        @media (min-width: 640px) { .trust-sep { display: block; } }

        /* ─────────────────────────────────────────
           SECTIONS SHARED
        ───────────────────────────────────────── */
        .section { padding: 80px 0; }
        .section-alt { background: #f9fafb; }
        .section-label {
          font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 1px;
          color: var(--green-bright); margin-bottom: 12px;
          display: flex; align-items: center; gap: 8px;
          justify-content: center;
        }
        .section-label::before, .section-label::after {
          content: ''; flex: 1; max-width: 40px;
          height: 1px; background: var(--green-light);
        }
        .section-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 800;
          color: var(--text-dark);
          letter-spacing: -1px;
          text-align: center;
          margin-bottom: 12px;
        }
        .section-desc {
          font-size: 16px; color: var(--text-soft);
          text-align: center; max-width: 520px;
          margin: 0 auto 52px; line-height: 1.7;
        }

        /* ─────────────────────────────────────────
           USE CASES CARDS
        ───────────────────────────────────────── */
        .cards-3 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 640px) { .cards-3 { grid-template-columns: repeat(3, 1fr); } }

        .use-card {
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 28px 24px;
          transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
        }
        .use-card:hover {
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          transform: translateY(-3px);
          border-color: var(--green-light);
        }
        .use-card-icon {
          font-size: 36px; margin-bottom: 16px;
          display: block;
        }
        .use-card-title {
          font-family: 'Outfit', sans-serif;
          font-size: 18px; font-weight: 700;
          color: var(--text-dark); margin-bottom: 8px;
          letter-spacing: -0.3px;
        }
        .use-card-desc { font-size: 14px; color: var(--text-soft); line-height: 1.65; }

        /* ─────────────────────────────────────────
           REAL WORLD APPLICATIONS
        ───────────────────────────────────────── */
        .app-card {
          background: linear-gradient(135deg, var(--green-pale) 0%, #ffffff 100%);
          border: 1px solid var(--green-light);
          border-radius: 16px;
          padding: 28px 24px;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .app-card:hover {
          box-shadow: 0 8px 30px rgba(58,181,74,0.1);
          transform: translateY(-3px);
        }
        .app-card-num {
          font-family: 'Outfit', sans-serif;
          font-size: 11px; font-weight: 800;
          text-transform: uppercase; letter-spacing: 1px;
          color: var(--green-bright); margin-bottom: 10px;
        }
        .app-card-title {
          font-family: 'Outfit', sans-serif;
          font-size: 18px; font-weight: 700;
          color: var(--green-mid); margin-bottom: 8px;
          letter-spacing: -0.3px;
        }
        .app-card-desc { font-size: 14px; color: var(--text-soft); line-height: 1.65; }

        /* ─────────────────────────────────────────
           FEATURES
        ───────────────────────────────────────── */
        .feat-card {
          text-align: center;
          background: #ffffff;
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 32px 24px;
          transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
        }
        .feat-card:hover {
          box-shadow: 0 8px 30px rgba(0,0,0,0.07);
          transform: translateY(-3px);
          border-color: var(--green-light);
        }
        .feat-icon-wrap {
          width: 60px; height: 60px;
          background: var(--green-pale);
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          font-size: 28px; margin: 0 auto 18px;
        }
        .feat-title {
          font-family: 'Outfit', sans-serif;
          font-size: 17px; font-weight: 700;
          color: var(--text-dark); margin-bottom: 8px;
          letter-spacing: -0.3px;
        }
        .feat-desc { font-size: 14px; color: var(--text-soft); line-height: 1.65; }

        /* ─────────────────────────────────────────
           HOW IT WORKS
        ───────────────────────────────────────── */
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 28px;
        }
        @media (min-width: 768px) { .steps-grid { grid-template-columns: repeat(4, 1fr); } }
        .step {
          text-align: center; position: relative;
        }
        .step-num-wrap {
          width: 52px; height: 52px;
          background: linear-gradient(135deg, var(--green-core), var(--green-bright));
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
          box-shadow: 0 4px 12px rgba(58,181,74,0.35);
        }
        .step-num {
          font-family: 'Outfit', sans-serif;
          font-size: 20px; font-weight: 800; color: #ffffff;
        }
        .step-title {
          font-family: 'Outfit', sans-serif;
          font-size: 15px; font-weight: 700;
          color: var(--text-dark); margin-bottom: 6px;
        }
        .step-desc { font-size: 13px; color: var(--text-soft); line-height: 1.6; }

        /* ─────────────────────────────────────────
           MERCHANT CTA BANNER
        ───────────────────────────────────────── */
        .merchant-banner {
          background: linear-gradient(135deg, var(--green-dark) 0%, var(--green-mid) 50%, var(--green-core) 100%);
          padding: 64px 0;
          position: relative; overflow: hidden;
        }
        .merchant-banner::before {
          content: '';
          position: absolute; top: -60px; right: -60px;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
        }
        .merchant-banner-inner {
          position: relative; z-index: 1;
          display: flex; flex-direction: column;
          align-items: center; gap: 28px;
          text-align: center;
        }
        @media (min-width: 768px) {
          .merchant-banner-inner {
            flex-direction: row;
            justify-content: space-between;
            text-align: left;
          }
        }
        .merchant-banner-tag {
          font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 1px;
          color: #7ee07e; margin-bottom: 10px;
        }
        .merchant-banner-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(22px, 3vw, 32px);
          font-weight: 800; color: #ffffff;
          letter-spacing: -0.5px; margin-bottom: 10px;
        }
        .merchant-banner-desc {
          font-size: 15px; color: rgba(255,255,255,0.7);
          max-width: 480px; line-height: 1.6;
        }
        .merchant-banner-desc strong { color: #ffffff; }
        .merchant-banner-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: #ffffff; color: var(--green-mid);
          font-family: 'Outfit', sans-serif;
          font-weight: 800; font-size: 15px;
          padding: 14px 32px; border-radius: 12px;
          text-decoration: none; white-space: nowrap; flex-shrink: 0;
          box-shadow: 0 4px 16px rgba(0,0,0,0.2);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .merchant-banner-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.25); }

        /* ─────────────────────────────────────────
           FINAL CTA
        ───────────────────────────────────────── */
        .final-cta {
          background: var(--green-pale);
          border-top: 1px solid var(--green-light);
          padding: 80px 0;
          text-align: center;
        }
        .final-cta-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(28px, 4vw, 48px);
          font-weight: 900; color: var(--green-mid);
          letter-spacing: -1px; margin-bottom: 14px;
        }
        .final-cta-desc {
          font-size: 16px; color: var(--text-soft);
          max-width: 480px; margin: 0 auto 32px; line-height: 1.7;
        }
        .final-cta-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--green-core); color: #ffffff;
          font-family: 'Outfit', sans-serif;
          font-weight: 800; font-size: 16px;
          padding: 15px 36px; border-radius: 12px;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(45,138,45,0.35);
          transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
        }
        .final-cta-btn:hover {
          background: var(--green-mid);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(45,138,45,0.4);
        }

        /* ─────────────────────────────────────────
           FOOTER
        ───────────────────────────────────────── */
        .footer {
          background: var(--green-dark);
          padding: 60px 0 0;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          padding-bottom: 48px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        @media (min-width: 640px) {
          .footer-grid { grid-template-columns: 2fr 1fr 1fr; }
        }
        @media (min-width: 900px) {
          .footer-grid { grid-template-columns: 2.5fr 1fr 1fr 1.5fr; }
        }

        /* Brand col */
        .footer-brand-logo {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 16px;
        }
        .footer-brand-name {
          font-family: 'Outfit', sans-serif;
          font-size: 22px; font-weight: 800;
          color: #ffffff; letter-spacing: -0.5px;
        }
        .footer-brand-desc {
          font-size: 13px; color: rgba(255,255,255,0.55);
          line-height: 1.7; max-width: 280px; margin-bottom: 20px;
        }
        .footer-starknet-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(58,181,74,0.12);
          border: 1px solid rgba(58,181,74,0.25);
          border-radius: 999px;
          padding: 5px 12px;
          font-size: 11px; font-weight: 600;
          color: #7ee07e; letter-spacing: 0.3px;
        }

        /* Nav cols */
        .footer-col-title {
          font-family: 'Outfit', sans-serif;
          font-size: 12px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 1px;
          color: rgba(255,255,255,0.4); margin-bottom: 16px;
        }
        .footer-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .footer-links a {
          font-size: 14px; color: rgba(255,255,255,0.6);
          text-decoration: none; transition: color 0.15s;
        }
        .footer-links a:hover { color: #ffffff; }

        /* Contact col */
        .footer-contact { display: flex; flex-direction: column; gap: 12px; }
        .footer-contact-item {
          display: flex; align-items: flex-start; gap: 10px;
        }
        .footer-contact-icon {
          width: 32px; height: 32px;
          background: rgba(255,255,255,0.07);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; flex-shrink: 0; margin-top: 1px;
        }
        .footer-contact-label {
          font-size: 10px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.5px;
          color: rgba(255,255,255,0.35); margin-bottom: 2px;
        }
        .footer-contact-value {
          font-size: 13px; color: rgba(255,255,255,0.75);
          line-height: 1.4;
        }
        .footer-contact-value a {
          color: rgba(255,255,255,0.75); text-decoration: none;
          transition: color 0.15s;
        }
        .footer-contact-value a:hover { color: #7ee07e; }

        /* Bottom bar */
        .footer-bottom {
          padding: 20px 0;
          display: flex; flex-direction: column;
          align-items: center; gap: 10px;
          text-align: center;
        }
        @media (min-width: 640px) {
          .footer-bottom {
            flex-direction: row;
            justify-content: space-between;
            text-align: left;
          }
        }
        .footer-copyright {
          font-size: 12px; color: rgba(255,255,255,0.3);
        }
        .footer-bottom-links {
          display: flex; gap: 20px;
        }
        .footer-bottom-links a {
          font-size: 12px; color: rgba(255,255,255,0.3);
          text-decoration: none; transition: color 0.15s;
        }
        .footer-bottom-links a:hover { color: rgba(255,255,255,0.6); }
      `}</style>

      <main>

        {/* ── NAVBAR ── */}
        <nav className="nav">
          <div className="nav-inner">
            <a href="/" className="nav-logo">
              <Image src="/pesasa-logo.png" alt="Pesasa" width={36} height={36} priority />
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
              <Link href="/merchant/signin" className="btn-outline">
                Merchant sign in
              </Link>
              <Link href="/auth/signin" className="btn-primary">
                Get Started →
              </Link>
            </div>
          </div>
        </nav>

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
                  shilling reaches exactly where it's meant to go.
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
                  src="https://images.unsplash.com/photo-1556742031-c6961e8560b0?w=600&q=80"
                  alt="Digital payments in Africa"
                />
                <div className="hero-image-card">
                  <div className="hero-image-card-icon">✅</div>
                  <div>
                    <div className="hero-image-card-label">Payment confirmed</div>
                    <div className="hero-image-card-value">UGX 12,500</div>
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
              <div className="trust-item">
                <div className="trust-value">100%</div>
                <div className="trust-label">Cashless & Secure</div>
              </div>
              <div className="trust-sep" />
              <div className="trust-item">
                <div className="trust-value">Real-Time</div>
                <div className="trust-label">Transaction Visibility</div>
              </div>
              <div className="trust-sep" />
              <div className="trust-item">
                <div className="trust-value">MTN + Airtel</div>
                <div className="trust-label">Mobile Money Ready</div>
              </div>
              <div className="trust-sep" />
              <div className="trust-item">
                <div className="trust-value">Starknet</div>
                <div className="trust-label">USDC Settlements</div>
              </div>
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
            <div className="cards-3">
              {[
                { icon: "⚙️", title: "Programmable Payments",
                  desc: "Define where, when and how funds can be used. Set merchant categories, daily limits and expiry rules." },
                { icon: "🔒", title: "Controlled Spending",
                  desc: "Funds flow only to approved merchants. Unauthorised transactions are blocked in real time at the point of sale." },
                { icon: "📱", title: "Mobile Money Native",
                  desc: "Built for Africa. Deposit via MTN Mobile Money or Airtel Money. No bank account required." },
                { icon: "◈", title: "USDC on Starknet",
                  desc: "Merchants receive weekly USDC settlements on Starknet via StarkZap — instant, borderless, verifiable on-chain." },
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
                <div className="merchant-banner-tag">For merchants & institutions</div>
                <h2 className="merchant-banner-title">
                  Accept Pesasa payments at your outlet
                </h2>
                <p className="merchant-banner-desc">
                  Earn <strong>0.5% commission</strong> on every withdrawal.
                  Get settled weekly in USDC on Starknet. Serve your
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

              {/* Brand */}
              <div>
                <div className="footer-brand-logo">
                  <Image src="/pesasa-logo.png" alt="Pesasa" width={32} height={32} />
                  <span className="footer-brand-name">Pesasa</span>
                </div>
                <p className="footer-brand-desc">
                  Financial rails enabling institutions, families and
                  organisations to distribute money that is spent exactly
                  as intended. Built for emerging markets.
                </p>
                <div className="footer-starknet-badge">
                  <span>◈</span> Powered by Starknet
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

              {/* Contact */}
              <div>
                <div className="footer-col-title">Contact Us</div>
                <div className="footer-contact">
                  <div className="footer-contact-item">
                    <div className="footer-contact-icon">📍</div>
                    <div>
                      <div className="footer-contact-label">Location</div>
                      <div className="footer-contact-value">
                        Soliz House, Lumumba Avenue<br />
                        Kampala, Uganda
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