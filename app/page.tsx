"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { HiMenuAlt3, HiX } from "react-icons/hi";
import {
  FaArrowRight, FaCheckCircle, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe,
  FaBolt, FaLink, FaMobileAlt, FaBuilding, FaStore, FaUniversity,
} from "react-icons/fa";
import { MdCurrencyExchange, MdOutlineAccountBalanceWallet, MdOutlineRoute, MdLock } from "react-icons/md";
import { BsLightningChargeFill, BsGraphUpArrow, BsPlugFill } from "react-icons/bs";
import { RiExchangeFundsLine } from "react-icons/ri";

// Waitlist submissions are POSTed here. See app/api/waitlist/route.ts
const WAITLIST_ENDPOINT = "/api/waitlist";

type Status = "idle" | "loading" | "success" | "error";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch(WAITLIST_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again or email info@pesasa.xyz.");
    }
  }

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
        body { font-family: 'DM Sans', sans-serif; color: var(--text-dark); background: #ffffff; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
        .container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
        @media (min-width: 640px) { .container { padding: 0 28px; } }
        section[id] { scroll-margin-top: 72px; }

        /* NAV */
        .nav { position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.97); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); height: 64px; display: flex; align-items: center; }
        .nav-inner { width: 100%; display: flex; align-items: center; justify-content: space-between; }
        .nav-logo { display: flex; align-items: center; gap: 9px; text-decoration: none; flex-shrink: 0; }
        .nav-logo-text { font-family: 'Outfit', sans-serif; font-size: 19px; font-weight: 800; color: var(--green-mid); letter-spacing: -0.5px; }
        .nav-links { display: none; align-items: center; gap: 28px; list-style: none; }
        @media (min-width: 768px) { .nav-links { display: flex; } }
        .nav-links a { font-size: 14px; font-weight: 500; color: var(--text-soft); text-decoration: none; transition: color 0.15s; }
        .nav-links a:hover { color: var(--text-dark); }
        .nav-ctas { display: flex; align-items: center; gap: 8px; }
        .btn-primary { font-size: 13px; font-weight: 700; color: #fff; background: var(--green-core); padding: 9px 18px; border-radius: 10px; text-decoration: none; transition: background 0.15s, transform 0.15s; box-shadow: 0 2px 8px rgba(45,138,45,0.25); display: inline-flex; align-items: center; gap: 6px; }
        .btn-primary:hover { background: var(--green-mid); transform: translateY(-1px); }
        .nav-hamburger { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: none; border: none; cursor: pointer; padding: 8px; border-radius: 8px; transition: background 0.15s; flex-shrink: 0; }
        .nav-hamburger:hover { background: var(--green-pale); }
        @media (min-width: 768px) { .nav-hamburger { display: none; } }
        .mobile-menu { position: fixed; top: 64px; left: 0; right: 0; bottom: 0; background: #fff; z-index: 49; padding: 24px 20px; display: flex; flex-direction: column; gap: 4px; transform: translateX(-100%); transition: transform 0.3s ease; border-top: 1px solid var(--border); overflow-y: auto; }
        .mobile-menu.open { transform: translateX(0); }
        @media (min-width: 768px) { .mobile-menu { display: none !important; } }
        .mobile-menu-link { display: flex; align-items: center; gap: 10px; padding: 13px 16px; border-radius: 10px; font-size: 15px; font-weight: 600; color: var(--text-dark); text-decoration: none; }
        .mobile-menu-link:hover { background: var(--green-pale); color: var(--green-mid); }
        .mobile-menu-divider { height: 1px; background: var(--border); margin: 10px 0; }
        .mobile-btn-primary { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 700; background: var(--green-core); color: #fff; text-decoration: none; box-shadow: 0 2px 8px rgba(45,138,45,0.25); }
        .mobile-btn-outline { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 13px; border-radius: 12px; font-size: 15px; font-weight: 600; border: 1.5px solid var(--green-light); color: var(--green-core); text-decoration: none; margin-top: 10px; }

        /* HERO */
        .hero { background: linear-gradient(135deg, var(--green-dark) 0%, var(--green-mid) 45%, var(--green-core) 100%); padding: 56px 0 72px; position: relative; overflow: hidden; }
        @media (min-width: 768px) { .hero { padding: 84px 0 96px; } }
        .hero::before { content: ''; position: absolute; top: -100px; right: -100px; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(58,181,74,0.18) 0%, transparent 70%); pointer-events: none; }
        .hero::after { content: ''; position: absolute; bottom: -80px; left: -80px; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(15,61,15,0.4) 0%, transparent 70%); pointer-events: none; }
        .hero-inner { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 44px; }
        @media (min-width: 900px) { .hero-inner { flex-direction: row; justify-content: space-between; gap: 48px; } }
        .hero-text { max-width: 580px; text-align: center; width: 100%; }
        @media (min-width: 900px) { .hero-text { text-align: left; } }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 999px; padding: 5px 14px; font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.85); letter-spacing: 0.4px; margin-bottom: 18px; }
        .hero-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #7ee07e; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
        .hero-title { font-family: 'Outfit', sans-serif; font-size: clamp(32px, 6.4vw, 60px); font-weight: 900; color: #fff; line-height: 1.1; letter-spacing: -1.5px; margin-bottom: 18px; }
        .hero-title-accent { color: #7ee07e; display: block; }
        .hero-desc { font-size: 16px; line-height: 1.7; color: rgba(255,255,255,0.75); margin-bottom: 28px; }
        @media (min-width: 640px) { .hero-desc { font-size: 17px; } }
        .hero-desc strong { color: #fff; }
        .hero-ctas { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-bottom: 22px; }
        @media (min-width: 900px) { .hero-ctas { justify-content: flex-start; } }
        .hero-btn-white { display: inline-flex; align-items: center; gap: 8px; background: #fff; color: var(--green-mid); font-weight: 700; font-size: 14px; padding: 12px 24px; border-radius: 12px; text-decoration: none; box-shadow: 0 4px 16px rgba(0,0,0,0.15); transition: transform 0.15s, box-shadow 0.15s; }
        @media (min-width: 640px) { .hero-btn-white { font-size: 15px; padding: 13px 28px; } }
        .hero-btn-white:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
        .hero-btn-ghost { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.12); border: 1.5px solid rgba(255,255,255,0.3); color: #fff; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 12px; text-decoration: none; transition: background 0.15s; }
        @media (min-width: 640px) { .hero-btn-ghost { font-size: 15px; padding: 13px 28px; } }
        .hero-btn-ghost:hover { background: rgba(255,255,255,0.2); }
        .hero-chains { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
        @media (min-width: 900px) { .hero-chains { justify-content: flex-start; } }
        .chain-pill { display: inline-flex; align-items: center; gap: 7px; font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 999px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18); color: rgba(255,255,255,0.85); }
        .chain-pill.soon { opacity: 0.65; border-style: dashed; }

        /* HERO FLOW CARD */
        .flow-card { width: 100%; max-width: 380px; background: #fff; border-radius: 20px; padding: 22px 20px; box-shadow: 0 24px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08); position: relative; flex-shrink: 0; }
        .flow-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .flow-head-title { font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 14px; color: var(--green-mid); }
        .flow-head-tag { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: var(--text-muted); }
        .flow-row { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 12px; background: var(--green-pale); border: 1px solid var(--green-light); }
        .flow-row-icon { width: 36px; height: 36px; border-radius: 10px; background: #fff; display: flex; align-items: center; justify-content: center; color: var(--green-core); flex-shrink: 0; }
        .flow-row-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; color: var(--text-muted); }
        .flow-row-value { font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 700; color: var(--text-dark); }
        .flow-connector { display: flex; align-items: center; gap: 10px; margin: 6px 0 6px 17px; }
        .flow-line { width: 2px; height: 22px; background: linear-gradient(var(--green-bright), var(--green-light)); border-radius: 2px; }
        .flow-connector-text { font-size: 11px; color: var(--text-soft); font-weight: 500; }
        .flow-foot { margin-top: 16px; display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--green-mid); font-weight: 600; background: var(--green-pale); border-radius: 10px; padding: 9px 12px; }
        .flow-badge { position: absolute; top: -14px; right: -10px; background: linear-gradient(135deg, #1a5c1a, #3ab54a); color: #fff; border-radius: 12px; padding: 8px 14px; font-family: 'Outfit', sans-serif; font-size: 12px; font-weight: 700; box-shadow: 0 8px 20px rgba(58,181,74,0.35); display: flex; align-items: center; gap: 6px; }

        /* TRUST */
        .trust { background: #fff; border-bottom: 1px solid var(--border); padding: 28px 0; }
        @media (min-width: 640px) { .trust { padding: 36px 0; } }
        .trust-inner { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        @media (min-width: 640px) { .trust-inner { grid-template-columns: repeat(4, 1fr); gap: 0; } }
        .trust-item { text-align: center; }
        .trust-value { font-family: 'Outfit', sans-serif; font-size: 22px; font-weight: 800; color: var(--green-core); letter-spacing: -0.5px; line-height: 1; }
        @media (min-width: 640px) { .trust-value { font-size: 26px; } }
        .trust-label { font-size: 12px; color: var(--text-soft); margin-top: 4px; }

        /* SECTIONS */
        .section { padding: 56px 0; }
        @media (min-width: 768px) { .section { padding: 84px 0; } }
        .section-alt { background: #f9fafb; }
        .section-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--green-bright); margin-bottom: 10px; display: flex; align-items: center; gap: 8px; justify-content: center; }
        .section-label::before, .section-label::after { content: ''; flex: 1; max-width: 36px; height: 1px; background: var(--green-light); }
        .section-title { font-family: 'Outfit', sans-serif; font-size: clamp(24px, 4vw, 42px); font-weight: 800; color: var(--text-dark); letter-spacing: -0.8px; text-align: center; margin-bottom: 10px; }
        .section-desc { font-size: 15px; color: var(--text-soft); text-align: center; max-width: 560px; margin: 0 auto 40px; line-height: 1.7; }
        @media (min-width: 640px) { .section-desc { font-size: 16px; margin-bottom: 48px; } }

        .cards-3 { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 640px) { .cards-3 { grid-template-columns: repeat(3, 1fr); gap: 20px; } }
        .cards-6 { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 480px) { .cards-6 { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 768px) { .cards-6 { grid-template-columns: repeat(3, 1fr); gap: 18px; } }

        /* PROBLEM / SOLUTION */
        .compare { display: grid; grid-template-columns: 1fr; gap: 18px; }
        @media (min-width: 768px) { .compare { grid-template-columns: 1fr 1fr; gap: 24px; } }
        .compare-card { border-radius: 16px; padding: 26px 24px; border: 1px solid var(--border); background: #fff; }
        .compare-card.good { background: linear-gradient(135deg, var(--green-pale) 0%, #fff 100%); border-color: var(--green-light); }
        .compare-tag { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; color: var(--text-muted); font-family: 'Outfit', sans-serif; }
        .compare-card.good .compare-tag { color: var(--green-bright); }
        .compare-title { font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 700; margin-bottom: 14px; letter-spacing: -0.3px; }
        .compare-card.good .compare-title { color: var(--green-mid); }
        .compare-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .compare-list li { font-size: 14px; color: var(--text-mid); line-height: 1.6; display: flex; gap: 10px; align-items: flex-start; }
        .compare-list .mark { flex-shrink: 0; margin-top: 2px; font-weight: 800; color: var(--text-muted); width: 16px; }
        .compare-card.good .mark { color: var(--green-core); }

        /* CARDS */
        .feat-card { text-align: center; background: #fff; border: 1px solid var(--border); border-radius: 14px; padding: 26px 20px; transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s; }
        .feat-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.06); transform: translateY(-2px); border-color: var(--green-light); }
        .feat-icon-wrap { width: 56px; height: 56px; background: var(--green-pale); border-radius: 14px; display: flex; align-items: center; justify-content: center; color: var(--green-core); margin: 0 auto 14px; }
        .feat-title { font-family: 'Outfit', sans-serif; font-size: 16px; font-weight: 700; color: var(--text-dark); margin-bottom: 7px; letter-spacing: -0.3px; }
        .feat-desc { font-size: 13px; color: var(--text-soft); line-height: 1.65; }
        .use-card { background: #fff; border: 1px solid var(--border); border-radius: 14px; padding: 24px 20px; transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s; }
        .use-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.07); transform: translateY(-2px); border-color: var(--green-light); }
        .use-card-icon { width: 50px; height: 50px; background: var(--green-pale); border-radius: 13px; display: flex; align-items: center; justify-content: center; color: var(--green-core); margin-bottom: 16px; }
        .use-card-title { font-family: 'Outfit', sans-serif; font-size: 17px; font-weight: 700; margin-bottom: 7px; letter-spacing: -0.3px; }
        .use-card-desc { font-size: 14px; color: var(--text-soft); line-height: 1.65; }

        /* STEPS */
        .steps-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 28px 20px; }
        @media (min-width: 768px) { .steps-grid { grid-template-columns: repeat(4, 1fr); } }
        .step { text-align: center; }
        .step-icon-wrap { width: 52px; height: 52px; background: linear-gradient(135deg, var(--green-core), var(--green-bright)); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; box-shadow: 0 4px 12px rgba(58,181,74,0.35); color: #fff; }
        .step-num { font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 800; letter-spacing: 1px; color: var(--green-bright); margin-bottom: 4px; }
        .step-title { font-family: 'Outfit', sans-serif; font-size: 15px; font-weight: 700; margin-bottom: 6px; }
        .step-desc { font-size: 13px; color: var(--text-soft); line-height: 1.6; }

        /* NETWORKS */
        .net-grid { display: grid; grid-template-columns: 1fr; gap: 18px; max-width: 760px; margin: 0 auto; }
        @media (min-width: 640px) { .net-grid { grid-template-columns: 1fr 1fr; } }
        .net-card { border: 1px solid var(--border); background: #fff; border-radius: 16px; padding: 24px 22px; }
        .net-card.primary { border-color: var(--green-light); background: linear-gradient(135deg, var(--green-pale) 0%, #fff 100%); }
        .net-status { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 999px; margin-bottom: 12px; background: #f3f4f6; color: var(--text-soft); }
        .net-card.primary .net-status { background: var(--green-light); color: var(--green-mid); }
        .net-name { font-family: 'Outfit', sans-serif; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 6px; }
        .net-card.primary .net-name { color: var(--green-mid); }
        .net-desc { font-size: 14px; color: var(--text-soft); line-height: 1.65; }

        /* WAITLIST */
        .waitlist { background: linear-gradient(135deg, var(--green-dark) 0%, var(--green-mid) 50%, var(--green-core) 100%); padding: 60px 0; position: relative; overflow: hidden; }
        @media (min-width: 768px) { .waitlist { padding: 84px 0; } }
        .waitlist::before { content: ''; position: absolute; top: -80px; left: -80px; width: 340px; height: 340px; border-radius: 50%; background: rgba(255,255,255,0.05); }
        .waitlist-inner { position: relative; z-index: 1; display: grid; grid-template-columns: 1fr; gap: 36px; align-items: center; }
        @media (min-width: 900px) { .waitlist-inner { grid-template-columns: 1fr 1.05fr; gap: 56px; } }
        .waitlist-text { text-align: center; }
        @media (min-width: 900px) { .waitlist-text { text-align: left; } }
        .waitlist-tag { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #7ee07e; margin-bottom: 10px; }
        .waitlist-title { font-family: 'Outfit', sans-serif; font-size: clamp(26px, 4vw, 40px); font-weight: 900; color: #fff; letter-spacing: -0.8px; margin-bottom: 14px; line-height: 1.15; }
        .waitlist-desc { font-size: 15px; color: rgba(255,255,255,0.72); line-height: 1.7; margin-bottom: 20px; }
        .waitlist-perks { list-style: none; display: inline-flex; flex-direction: column; gap: 10px; text-align: left; }
        .waitlist-perks li { display: flex; align-items: center; gap: 10px; font-size: 14px; color: rgba(255,255,255,0.88); }
        .waitlist-perks svg { color: #7ee07e; flex-shrink: 0; }

        .form-card { background: #fff; border-radius: 18px; padding: 24px 20px; box-shadow: 0 24px 60px rgba(0,0,0,0.3); }
        @media (min-width: 640px) { .form-card { padding: 30px 28px; } }
        .form-title { font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 800; color: var(--green-mid); margin-bottom: 4px; letter-spacing: -0.4px; }
        .form-sub { font-size: 13px; color: var(--text-soft); margin-bottom: 18px; }
        .form-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 560px) { .form-grid.two { grid-template-columns: 1fr 1fr; } }
        .field { display: flex; flex-direction: column; gap: 6px; }
        .field label { font-size: 12px; font-weight: 600; color: var(--text-mid); }
        .field input, .field select, .field textarea { font-family: inherit; font-size: 14px; padding: 11px 13px; border: 1.5px solid var(--border); border-radius: 10px; background: #fff; color: var(--text-dark); outline: none; transition: border-color 0.15s, box-shadow 0.15s; width: 100%; }
        .field textarea { resize: vertical; min-height: 78px; }
        .field input:focus, .field select:focus, .field textarea:focus { border-color: var(--green-core); box-shadow: 0 0 0 3px rgba(45,138,45,0.14); }
        .hp { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }
        .submit-btn { width: 100%; margin-top: 16px; display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: var(--green-core); color: #fff; font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 15px; padding: 14px; border: none; border-radius: 12px; cursor: pointer; box-shadow: 0 4px 16px rgba(45,138,45,0.35); transition: background 0.15s, transform 0.15s; }
        .submit-btn:hover:not(:disabled) { background: var(--green-mid); transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .form-note { font-size: 11px; color: var(--text-muted); text-align: center; margin-top: 12px; line-height: 1.5; }
        .form-error { margin-top: 12px; font-size: 13px; color: #b91c1c; background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 10px 12px; }
        .success { text-align: center; padding: 18px 6px; }
        .success-icon { width: 60px; height: 60px; border-radius: 50%; background: var(--green-pale); display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; color: var(--green-core); }
        .success-title { font-family: 'Outfit', sans-serif; font-size: 22px; font-weight: 800; color: var(--green-mid); margin-bottom: 8px; }
        .success-desc { font-size: 14px; color: var(--text-soft); line-height: 1.65; margin-bottom: 16px; }
        .success-link { font-size: 13px; font-weight: 600; color: var(--green-core); background: none; border: none; cursor: pointer; text-decoration: underline; text-underline-offset: 3px; font-family: inherit; }

        /* LEGACY BANNER */
        .legacy { background: var(--green-pale); border-top: 1px solid var(--green-light); border-bottom: 1px solid var(--green-light); padding: 34px 0; }
        .legacy-inner { display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center; }
        @media (min-width: 768px) { .legacy-inner { flex-direction: row; justify-content: space-between; text-align: left; } }
        .legacy-title { font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 800; color: var(--green-mid); margin-bottom: 4px; }
        .legacy-desc { font-size: 14px; color: var(--text-soft); max-width: 560px; line-height: 1.6; }
        .legacy-btns { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
        .legacy-btn { display: inline-flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 700; padding: 10px 18px; border-radius: 10px; text-decoration: none; border: 1.5px solid var(--green-light); color: var(--green-core); background: #fff; transition: border-color 0.15s, color 0.15s; }
        .legacy-btn:hover { border-color: var(--green-core); color: var(--green-mid); }

        /* FAQ */
        .faq { max-width: 760px; margin: 0 auto; display: flex; flex-direction: column; gap: 10px; }
        .faq details { background: #fff; border: 1px solid var(--border); border-radius: 12px; padding: 0 18px; }
        .faq details[open] { border-color: var(--green-light); }
        .faq summary { cursor: pointer; list-style: none; padding: 16px 0; font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 15px; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
        .faq summary::-webkit-details-marker { display: none; }
        .faq summary::after { content: '+'; font-size: 20px; color: var(--green-core); font-weight: 500; flex-shrink: 0; }
        .faq details[open] summary::after { content: '−'; }
        .faq p { font-size: 14px; color: var(--text-soft); line-height: 1.7; padding-bottom: 16px; }

        /* FOOTER */
        .footer { background: var(--green-dark); padding: 52px 0 0; }
        @media (min-width: 768px) { .footer { padding: 60px 0 0; } }
        .footer-grid { display: grid; grid-template-columns: 1fr; gap: 36px; padding-bottom: 40px; border-bottom: 1px solid rgba(255,255,255,0.08); }
        @media (min-width: 480px) { .footer-grid { grid-template-columns: repeat(2, 1fr); gap: 32px; } }
        @media (min-width: 900px) { .footer-grid { grid-template-columns: 2.2fr 1fr 1fr 1.5fr; gap: 40px; padding-bottom: 48px; } }
        .footer-brand-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
        .footer-brand-name { font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
        .footer-brand-desc { font-size: 13px; color: rgba(255,255,255,0.5); line-height: 1.7; max-width: 300px; margin-bottom: 18px; }
        .footer-badge { display: inline-flex; align-items: center; gap: 7px; background: rgba(58,181,74,0.12); border: 1px solid rgba(58,181,74,0.25); border-radius: 999px; padding: 5px 12px; font-size: 11px; font-weight: 600; color: #7ee07e; letter-spacing: 0.3px; }
        .footer-brand-col { grid-column: 1 / -1; }
        @media (min-width: 900px) { .footer-brand-col { grid-column: auto; } }
        .footer-col-title { font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.35); margin-bottom: 14px; }
        .footer-links { list-style: none; display: flex; flex-direction: column; gap: 9px; }
        .footer-links a { font-size: 13px; color: rgba(255,255,255,0.55); text-decoration: none; transition: color 0.15s; }
        .footer-links a:hover { color: #fff; }
        .footer-contact { display: flex; flex-direction: column; gap: 12px; }
        .footer-contact-item { display: flex; align-items: flex-start; gap: 10px; }
        .footer-contact-icon { width: 30px; height: 30px; background: rgba(255,255,255,0.07); border-radius: 7px; display: flex; align-items: center; justify-content: center; color: #7ee07e; flex-shrink: 0; margin-top: 1px; }
        .footer-contact-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.3); margin-bottom: 2px; }
        .footer-contact-value { font-size: 12px; color: rgba(255,255,255,0.65); line-height: 1.5; }
        .footer-contact-value a { color: rgba(255,255,255,0.65); text-decoration: none; }
        .footer-contact-value a:hover { color: #7ee07e; }
        .footer-contact-col { grid-column: 1 / -1; }
        @media (min-width: 900px) { .footer-contact-col { grid-column: auto; } }
        .footer-bottom { padding: 18px 0; display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center; }
        @media (min-width: 640px) { .footer-bottom { flex-direction: row; justify-content: space-between; text-align: left; } }
        .footer-copyright { font-size: 12px; color: rgba(255,255,255,0.28); }
        .footer-bottom-links { display: flex; gap: 18px; }
        .footer-bottom-links a { font-size: 12px; color: rgba(255,255,255,0.28); text-decoration: none; }
        .footer-bottom-links a:hover { color: rgba(255,255,255,0.55); }
      `}</style>

      <main>
        {/* NAVBAR */}
        <nav className="nav">
          <div className="nav-inner container">
            <a href="/" className="nav-logo">
              <Image src="/pesasa-logo.png" alt="Pesasa" width={34} height={34} priority />
              <span className="nav-logo-text">Pesasa</span>
            </a>
            <ul className="nav-links">
              <li><a href="#problem">The problem</a></li>
              <li><a href="#how">How it works</a></li>
              <li><a href="#networks">Networks</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
            <div className="nav-ctas">
              <a href="#waitlist" className="btn-primary">
                Join Waitlist <FaArrowRight size={11} />
              </a>
              <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
                {menuOpen ? <HiX size={22} color="var(--text-dark)" /> : <HiMenuAlt3 size={22} color="var(--text-dark)" />}
              </button>
            </div>
          </div>
        </nav>

        {/* MOBILE MENU */}
        <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
          <a href="#problem" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>The problem</a>
          <a href="#how" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#networks" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>Networks</a>
          <a href="#faq" className="mobile-menu-link" onClick={() => setMenuOpen(false)}>FAQ</a>
          <div className="mobile-menu-divider" />
          <a href="#waitlist" className="mobile-btn-primary" onClick={() => setMenuOpen(false)}>
            Join the Waitlist <FaArrowRight size={14} />
          </a>
          <Link href="/auth/signin" className="mobile-btn-outline" onClick={() => setMenuOpen(false)}>
            Sign in to Pesasa Spend
          </Link>
        </div>

        {/* HERO */}
        <section className="hero">
          <div className="container">
            <div className="hero-inner">
              <div className="hero-text">
                <div className="hero-badge">
                  <span className="hero-badge-dot" />
                  Early access · Building on Stellar
                </div>
                <h1 className="hero-title">
                  Cross-border payouts,
                  <span className="hero-title-accent">zero liquidity.</span>
                </h1>
                <p className="hero-desc">
                  Pesasa is an on-chain FX aggregator for businesses that move money into Africa.
                  Your clients send <strong>stablecoins</strong>, we route the conversion on-chain,
                  and local currency lands in <strong>M-Pesa and UGX</strong> — without you
                  pre-funding a single float account.
                </p>
                <div className="hero-ctas">
                  <a href="#waitlist" className="hero-btn-white">
                    Join the Waitlist <FaArrowRight size={13} />
                  </a>
                  <a href="#how" className="hero-btn-ghost">See how it works</a>
                </div>
                <div className="hero-chains">
                  <span className="chain-pill"><span className="hero-badge-dot" /> Stellar · first</span>
                  <span className="chain-pill soon">Base · coming next</span>
                </div>
              </div>

              {/* Illustrative flow card */}
              <div className="flow-card" aria-label="Illustrative payout flow">
                <div className="flow-badge"><BsLightningChargeFill size={12} /> Zero pre-funding</div>
                <div className="flow-head">
                  <div className="flow-head-title">Payout flow</div>
                  <div className="flow-head-tag">Illustrative</div>
                </div>
                <div className="flow-row">
                  <div className="flow-row-icon"><MdOutlineAccountBalanceWallet size={20} /></div>
                  <div>
                    <div className="flow-row-label">Client sends</div>
                    <div className="flow-row-value">100 USDC · Stellar</div>
                  </div>
                </div>
                <div className="flow-connector">
                  <div className="flow-line" />
                  <div className="flow-connector-text">Best route found on-chain</div>
                </div>
                <div className="flow-row">
                  <div className="flow-row-icon"><RiExchangeFundsLine size={20} /></div>
                  <div>
                    <div className="flow-row-label">Pesasa routes</div>
                    <div className="flow-row-value">Aggregated FX swap</div>
                  </div>
                </div>
                <div className="flow-connector">
                  <div className="flow-line" />
                  <div className="flow-connector-text">Settled to local rails</div>
                </div>
                <div className="flow-row">
                  <div className="flow-row-icon"><FaMobileAlt size={18} /></div>
                  <div>
                    <div className="flow-row-label">Recipient gets</div>
                    <div className="flow-row-value">M-Pesa / UGX</div>
                  </div>
                </div>
                <div className="flow-foot">
                  <FaCheckCircle size={14} /> No liquidity pools for you to fund or manage
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST BAR */}
        <section className="trust">
          <div className="container">
            <div className="trust-inner">
              {[
                { value: "Zero",       label: "Pre-funded liquidity" },
                { value: "Stellar",    label: "First supported network" },
                { value: "M-Pesa+UGX", label: "Local payout rails" },
                { value: "Base",       label: "Coming next" },
              ].map((t) => (
                <div key={t.label} className="trust-item">
                  <div className="trust-value">{t.value}</div>
                  <div className="trust-label">{t.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROBLEM / SOLUTION */}
        <section id="problem" className="section section-alt">
          <div className="container">
            <div className="section-label">The problem</div>
            <h2 className="section-title">Liquidity is the bottleneck</h2>
            <p className="section-desc">
              Paying out in local currency usually means locking up capital in float accounts
              across every corridor. We remove that requirement.
            </p>
            <div className="compare">
              <div className="compare-card">
                <div className="compare-tag">Today</div>
                <h3 className="compare-title">The traditional way</h3>
                <ul className="compare-list">
                  <li><span className="mark">✕</span> Pre-fund local float in every corridor</li>
                  <li><span className="mark">✕</span> Idle capital that can&apos;t be redeployed</li>
                  <li><span className="mark">✕</span> Multiple intermediaries and layered FX margins</li>
                  <li><span className="mark">✕</span> Slow settlement and limited visibility</li>
                </ul>
              </div>
              <div className="compare-card good">
                <div className="compare-tag">With Pesasa</div>
                <h3 className="compare-title">Zero-liquidity routing</h3>
                <ul className="compare-list">
                  <li><span className="mark">✓</span> Clients send stablecoins; conversion is routed on-chain</li>
                  <li><span className="mark">✓</span> No float to pre-fund or rebalance</li>
                  <li><span className="mark">✓</span> Aggregated routing seeks the best available rate</li>
                  <li><span className="mark">✓</span> Transparent, verifiable settlement on-chain</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="section">
          <div className="container">
            <div className="section-label">How it works</div>
            <h2 className="section-title">Four steps, no float</h2>
            <p className="section-desc">
              Plug Pesasa into your cross-border product and let your clients pay in stablecoins.
            </p>
            <div className="steps-grid">
              {[
                { icon: <BsPlugFill size={20} />,          title: "Integrate",  desc: "Connect your business to Pesasa&apos;s API. No liquidity setup or float accounts." },
                { icon: <MdOutlineAccountBalanceWallet size={22} />, title: "Client pays", desc: "Your client sends stablecoins from their wallet on Stellar." },
                { icon: <MdOutlineRoute size={22} />,      title: "We route",   desc: "Our aggregator finds the best on-chain path and executes the FX conversion." },
                { icon: <FaMobileAlt size={20} />,         title: "Local payout", desc: "Funds land in M-Pesa or UGX for the recipient." },
              ].map((s, i) => (
                <div key={s.title} className="step">
                  <div className="step-icon-wrap">{s.icon}</div>
                  <div className="step-num">STEP 0{i + 1}</div>
                  <h3 className="step-title">{s.title}</h3>
                  <p className="step-desc" dangerouslySetInnerHTML={{ __html: s.desc }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="section section-alt">
          <div className="container">
            <div className="section-label">Why Pesasa</div>
            <h2 className="section-title">Built for cross-border businesses</h2>
            <p className="section-desc">
              Infrastructure for the teams moving money between stablecoins and African mobile money.
            </p>
            <div className="cards-6">
              {[
                { icon: <BsLightningChargeFill size={24} />, title: "Zero Liquidity", desc: "Skip pre-funding. Capital stays with you, not locked in corridor float." },
                { icon: <BsGraphUpArrow size={22} />,        title: "Best-Route FX", desc: "We aggregate on-chain liquidity sources and route each conversion for competitive rates." },
                { icon: <FaMobileAlt size={24} />,           title: "Mobile Money Native", desc: "Payouts designed for M-Pesa and UGX, where your recipients already are." },
                { icon: <FaLink size={22} />,                title: "On-Chain Transparency", desc: "Every conversion is verifiable on-chain from the client&apos;s send to settlement." },
                { icon: <FaBolt size={22} />,                title: "Simple Integration", desc: "One integration for routing, conversion and local payout. Less to build and maintain." },
                { icon: <MdLock size={26} />,                title: "Security First", desc: "Non-custodial routing principles and hardened infrastructure from day one." },
              ].map((f) => (
                <div key={f.title} className="feat-card">
                  <div className="feat-icon-wrap">{f.icon}</div>
                  <h3 className="feat-title">{f.title}</h3>
                  <p className="feat-desc" dangerouslySetInnerHTML={{ __html: f.desc }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHO IT'S FOR */}
        <section className="section">
          <div className="container">
            <div className="section-label">Who it&apos;s for</div>
            <h2 className="section-title">Who we&apos;re building for</h2>
            <p className="section-desc">
              If your customers pay in stablecoins and your recipients need local currency, this is for you.
            </p>
            <div className="cards-3">
              {[
                { icon: <FaBuilding size={24} />,  title: "Remittance & payout companies", desc: "Offer stablecoin-funded transfers to East Africa without managing local float." },
                { icon: <FaStore size={22} />,     title: "Marketplaces & platforms",      desc: "Pay out sellers, freelancers and creators in M-Pesa or UGX from stablecoin balances." },
                { icon: <FaUniversity size={22} />, title: "Fintechs & wallets",           desc: "Add an off-ramp to local currency for your users through a single integration." },
              ].map((c) => (
                <div key={c.title} className="use-card">
                  <div className="use-card-icon">{c.icon}</div>
                  <h3 className="use-card-title">{c.title}</h3>
                  <p className="use-card-desc">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* NETWORKS */}
        <section id="networks" className="section section-alt">
          <div className="container">
            <div className="section-label">Networks</div>
            <h2 className="section-title">Stellar first. Base next.</h2>
            <p className="section-desc">
              We&apos;re starting with Stellar for fast, low-cost stablecoin payments, then expanding to Base.
            </p>
            <div className="net-grid">
              <div className="net-card primary">
                <div className="net-status"><span className="hero-badge-dot" /> In development</div>
                <div className="net-name">Stellar</div>
                <p className="net-desc">Our launch network. Low fees and fast settlement make it ideal for stablecoin payouts into M-Pesa and UGX.</p>
              </div>
              <div className="net-card">
                <div className="net-status">Planned</div>
                <div className="net-name">Base</div>
                <p className="net-desc">Next on the roadmap, giving clients on Base the same zero-liquidity payout experience.</p>
              </div>
            </div>
          </div>
        </section>

        {/* WAITLIST */}
        <section id="waitlist" className="waitlist">
          <div className="container">
            <div className="waitlist-inner">
              <div className="waitlist-text">
                <div className="waitlist-tag">Early access</div>
                <h2 className="waitlist-title">Be first to move money with zero liquidity.</h2>
                <p className="waitlist-desc">
                  We&apos;re onboarding a small group of cross-border businesses ahead of launch.
                  Join the waitlist and tell us about your corridor.
                </p>
                <ul className="waitlist-perks">
                  <li><FaCheckCircle size={15} /> Priority access to the Stellar launch</li>
                  <li><FaCheckCircle size={15} /> Help shape the product with direct founder access</li>
                  <li><FaCheckCircle size={15} /> Be first in line for Base support</li>
                </ul>
              </div>

              <div className="form-card">
                {status === "success" ? (
                  <div className="success">
                    <div className="success-icon"><FaCheckCircle size={28} /></div>
                    <div className="success-title">You&apos;re on the list!</div>
                    <p className="success-desc">
                      Thanks for joining. We&apos;ll be in touch with updates and early access details.
                    </p>
                    <button className="success-link" onClick={() => setStatus("idle")}>
                      Add another business
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="form-title">Join the waitlist</div>
                    <p className="form-sub">Takes less than a minute.</p>

                    {/* honeypot */}
                    <div className="hp" aria-hidden="true">
                      <label>Leave blank<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
                    </div>

                    <div className="form-grid two">
                      <div className="field">
                        <label htmlFor="name">Your name</label>
                        <input id="name" name="name" type="text" required placeholder="Jane Doe" autoComplete="name" />
                      </div>
                      <div className="field">
                        <label htmlFor="email">Work email</label>
                        <input id="email" name="email" type="email" required placeholder="jane@company.com" autoComplete="email" />
                      </div>
                    </div>

                    <div className="form-grid two" style={{ marginTop: 14 }}>
                      <div className="field">
                        <label htmlFor="company">Company</label>
                        <input id="company" name="company" type="text" required placeholder="Company name" autoComplete="organization" />
                      </div>
                      <div className="field">
                        <label htmlFor="corridor">Corridor of interest</label>
                        <select id="corridor" name="corridor" defaultValue="" required>
                          <option value="" disabled>Select one</option>
                          <option>Stellar → M-Pesa</option>
                          <option>Stellar → UGX</option>
                          <option>Base → M-Pesa</option>
                          <option>Base → UGX</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-grid" style={{ marginTop: 14 }}>
                      <div className="field">
                        <label htmlFor="volume">Expected monthly volume</label>
                        <select id="volume" name="volume" defaultValue="">
                          <option value="">Prefer not to say</option>
                          <option>Under $10k</option>
                          <option>$10k – $100k</option>
                          <option>$100k – $1M</option>
                          <option>Over $1M</option>
                        </select>
                      </div>
                      <div className="field">
                        <label htmlFor="notes">Anything we should know? (optional)</label>
                        <textarea id="notes" name="notes" placeholder="Your use case, current setup, timelines…" />
                      </div>
                    </div>

                    <button type="submit" className="submit-btn" disabled={status === "loading"}>
                      {status === "loading" ? "Joining…" : <>Join the Waitlist <FaArrowRight size={13} /></>}
                    </button>
                    {status === "error" && <div className="form-error">{errorMsg}</div>}
                    <p className="form-note">No spam. We&apos;ll only email you about Pesasa early access.</p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* LEGACY PRODUCT */}
        <section className="legacy">
          <div className="container">
            <div className="legacy-inner">
              <div>
                <div className="legacy-title">Already using Pesasa?</div>
                <p className="legacy-desc">
                  Our controlled-spending wallets for families, companies and NGOs are still live in Uganda.
                  Sign in to continue as usual.
                </p>
              </div>
              <div className="legacy-btns">
                <Link href="/auth/signin" className="legacy-btn">Sign in</Link>
                <Link href="/merchant/signin" className="legacy-btn"><FaStore size={12} /> Merchant sign in</Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="section">
          <div className="container">
            <div className="section-label">FAQ</div>
            <h2 className="section-title">Common questions</h2>
            <p className="section-desc">Quick answers about what we&apos;re building.</p>
            <div className="faq">
              <details>
                <summary>What does &quot;zero liquidity&quot; mean?</summary>
                <p>You don&apos;t need to pre-fund or maintain local-currency float to pay out. Conversion is routed on-chain at the time of each payment.</p>
              </details>
              <details>
                <summary>Which networks and payout methods are supported?</summary>
                <p>We&apos;re building on Stellar first, with Base planned next. Payouts target M-Pesa and UGX.</p>
              </details>
              <details>
                <summary>Is this live yet?</summary>
                <p>Not yet. We&apos;re in development and onboarding early-access businesses from the waitlist ahead of launch.</p>
              </details>
              <details>
                <summary>What happens to the existing Pesasa app?</summary>
                <p>Our controlled-spending product remains available. You can sign in at any time using the links above.</p>
              </details>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="container">
            <div className="footer-grid">
              <div className="footer-brand-col">
                <div className="footer-brand-logo">
                  <Image src="/pesasa-logo.png" alt="Pesasa" width={30} height={30} />
                  <span className="footer-brand-name">Pesasa</span>
                </div>
                <p className="footer-brand-desc">
                  On-chain FX infrastructure for cross-border businesses. Stablecoins in, local currency out — zero liquidity required.
                </p>
                <div className="footer-badge"><MdCurrencyExchange size={12} /> Stellar · Base soon</div>
              </div>

              <div>
                <div className="footer-col-title">Product</div>
                <ul className="footer-links">
                  <li><a href="#how">How it works</a></li>
                  <li><a href="#networks">Networks</a></li>
                  <li><a href="#waitlist">Waitlist</a></li>
                  <li><a href="#faq">FAQ</a></li>
                </ul>
              </div>

              <div>
                <div className="footer-col-title">Company</div>
                <ul className="footer-links">
                  <li><Link href="/auth/signin">Pesasa Spend</Link></li>
                  <li><Link href="/merchant/signin">Merchants</Link></li>
                  <li><a href="#">Privacy Policy</a></li>
                  <li><a href="#">Terms of Service</a></li>
                </ul>
              </div>

              <div className="footer-contact-col">
                <div className="footer-col-title">Contact Us</div>
                <div className="footer-contact">
                  <div className="footer-contact-item">
                    <div className="footer-contact-icon"><FaMapMarkerAlt size={13} /></div>
                    <div>
                      <div className="footer-contact-label">Location</div>
                      <div className="footer-contact-value">Soliz House, Lumumba Avenue<br />Kampala, Uganda</div>
                    </div>
                  </div>
                  <div className="footer-contact-item">
                    <div className="footer-contact-icon"><FaPhone size={12} /></div>
                    <div>
                      <div className="footer-contact-label">Phone</div>
                      <div className="footer-contact-value"><a href="tel:+256706626855">+256 706 626 855</a></div>
                    </div>
                  </div>
                  <div className="footer-contact-item">
                    <div className="footer-contact-icon"><FaEnvelope size={12} /></div>
                    <div>
                      <div className="footer-contact-label">Email</div>
                      <div className="footer-contact-value"><a href="mailto:info@pesasa.xyz">info@pesasa.xyz</a></div>
                    </div>
                  </div>
                  <div className="footer-contact-item">
                    <div className="footer-contact-icon"><FaGlobe size={12} /></div>
                    <div>
                      <div className="footer-contact-label">Website</div>
                      <div className="footer-contact-value"><a href="https://pesasa.xyz">pesasa.xyz</a></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="footer-bottom">
              <p className="footer-copyright">© {new Date().getFullYear()} Pesasa Technologies Ltd. All rights reserved.</p>
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
