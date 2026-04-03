

"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SpendingChart from "@/app/components/SpendingChart";

interface Dependant {
  _id: string;
  name: string;
  balance: number;
}

interface Transaction {
  _id: string;
  dependantName: string;
  merchant: string;
  amount: number;
  type: string;
  timestamp: string;
}

export default function ParentDashboard() {
  const [balance,      setBalance]      = useState(0);
  const [dependants,   setDependants]   = useState<Dependant[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hasPinSet,    setHasPinSet]    = useState(true);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [loading,      setLoading]      = useState(true);
  const [stableToast,  setStableToast]  = useState(false);

  // 1. Add chartData to state
  const [chartData, setChartData] = useState<{ day: string; amount: number }[]>([]);

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) window.location.href = "/";
  }, [status, session]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/parent/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setBalance(data.balance || 0);
        setDependants(data.dependants || []);
        setTransactions(data.transactions || []);
        setHasPinSet(data.hasPinSet);
        setChartData(data.chartData || []); // ✅ use real data
        setLoading(false);
      });
  }, [session]);

  const handleStablecoinClick = () => {
    setStableToast(true);
    setTimeout(() => setStableToast(false), 3500);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent
                          rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading dashboard…</p>
        </div>
      </div>
    );
  }
  if (!session) return null;

  const firstName = session.user?.name?.split(" ")[0] || "there";

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── COMING SOON TOAST ───────────────────────────────────────────────── */}
      {stableToast && (
        <div
          style={{
            position: "fixed",
            bottom: "84px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            background: "#0d1117",
            border: "1px solid rgba(58,181,74,0.3)",
            borderRadius: "12px",
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            animation: "slideUp 0.25s ease",
            whiteSpace: "nowrap",
          }}
        >
          <style>{`
            @keyframes slideUp {
              from { opacity: 0; transform: translateX(-50%) translateY(8px); }
              to   { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
          `}</style>
          <span style={{
            width: 28, height: 28,
            background: "rgba(58,181,74,0.12)",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, flexShrink: 0,
          }}>⚡</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#f0f6fc", marginBottom: 1 }}>
              Coming Soon — Stablecoin Deposits
            </p>
            <p style={{ fontSize: 11, color: "#7d8590" }}>
              Deposit USDC via Starknet. Powered by StarkZap.
            </p>
          </div>
        </div>
      )}

      {/* ── TOP NAV ─────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image
              src="/pesasa-logo.png"
              alt="Pesasa Logo"
              width={36}
              height={36}
              priority
            />
            <span className="font-bold text-gray-900 text-lg tracking-tight">Pesasa</span>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
            <Link href="/parent/dashboard"
              className="text-green-600 border-b-2 border-green-600 pb-0.5">
              Dashboard
            </Link>
            <Link href="/parent/transactions"
              className="hover:text-gray-900 transition-colors">
              Transactions
            </Link>
            <Link href="/parent/add-dependant"
              className="hover:text-gray-900 transition-colors">
              Add Child
            </Link>
          </div>

          {/* Desktop user */}
          <div className="hidden md:flex items-center gap-3">
            <img
              src={
                session.user?.image ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user?.name || "P")}&background=16a34a&color=fff`
              }
              alt="Profile"
              className="w-9 h-9 rounded-full border-2 border-green-500 object-cover"
            />
            <span className="text-sm font-medium text-gray-700">{session.user?.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-sm text-gray-500 hover:text-red-500 transition-colors ml-1"
            >
              Sign out
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="w-5 flex flex-col gap-1">
              <span className={`h-0.5 bg-gray-700 rounded transition-all duration-200
                ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
              <span className={`h-0.5 bg-gray-700 rounded transition-all duration-200
                ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`h-0.5 bg-gray-700 rounded transition-all duration-200
                ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
            </div>
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
            <div className="flex items-center gap-3 pb-3 mb-2 border-b border-gray-100">
              <img
                src={
                  session.user?.image ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user?.name || "P")}&background=16a34a&color=fff`
                }
                alt="Profile"
                className="w-9 h-9 rounded-full border-2 border-green-500 object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900">{session.user?.name}</p>
                <p className="text-xs text-gray-400">{session.user?.email}</p>
              </div>
            </div>
            {[
              { href: "/parent/dashboard",     label: "Dashboard"        },
              { href: "/parent/transactions",  label: "Transactions"     },
              { href: "/parent/add-dependant", label: "Add Child"        },
              { href: "/parent/set-pin",       label: "Set / Change PIN" },
            ].map((item) => (
              <Link key={item.href} href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-gray-700
                           hover:bg-gray-50 transition-colors">
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-500
                         hover:bg-red-50 transition-colors mt-1"
            >
              Sign out
            </button>
          </div>
        )}
      </nav>

      {/* ── PAGE BODY ──────────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Greeting */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Good day, {firstName} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Here&apos;s an overview of your family&apos;s spending
          </p>
        </div>

        {/* PIN warning banner */}
        {!hasPinSet && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl
                          px-4 py-3 flex flex-col sm:flex-row sm:items-center
                          justify-between gap-3">
            <div className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5 shrink-0">⚠️</span>
              <p className="text-amber-800 text-sm font-medium">
                Set your transaction PIN to enable transfers and payments
              </p>
            </div>
            <Link href="/parent/set-pin" className="shrink-0">
              <button className="w-full sm:w-auto bg-amber-400 hover:bg-amber-500
                                 text-amber-900 text-sm font-semibold px-4 py-2
                                 rounded-lg transition-colors">
                Set PIN now
              </button>
            </Link>
          </div>
        )}

        {/* ── BALANCE + QUICK ACTIONS ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Wallet card */}
          <div className="md:col-span-2 bg-gradient-to-br from-green-500 via-green-600
                          to-emerald-700 text-white rounded-2xl p-6 shadow-lg
                          shadow-green-200 relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10
                            rounded-full pointer-events-none" />
            <div className="absolute -bottom-10 -right-4 w-32 h-32 bg-white/5
                            rounded-full pointer-events-none" />

            <p className="text-sm text-green-100 font-medium">Total Wallet Balance</p>
            <h2 className="text-3xl sm:text-4xl font-bold mt-1 tracking-tight">
              UGX {(balance || 0).toLocaleString()}
            </h2>
            <p className="text-green-200 text-xs mt-1">
              Available for transfers
            </p>

            {/* Action buttons */}
            <div className="mt-6 flex flex-wrap gap-3">

              {/* Mobile money deposit */}
              <Link href="/parent/deposit">
                <button className="bg-white text-green-700 px-5 py-2.5 rounded-xl
                                   font-semibold text-sm hover:shadow-md
                                   transition-all duration-200 hover:scale-105">
                  + Deposit
                </button>
              </Link>

              {/* Transfer to child */}
              <Link href="/parent/transfer">
                <button
                  disabled={!hasPinSet}
                  className="border-2 border-white/70 text-white px-5 py-2.5 rounded-xl
                             font-semibold text-sm hover:bg-white hover:text-green-700
                             transition-all duration-200 hover:scale-105
                             disabled:opacity-40 disabled:cursor-not-allowed
                             disabled:hover:bg-transparent disabled:hover:text-white
                             disabled:hover:scale-100"
                >
                  Transfer to Child
                </button>
              </Link>

              {/* Stablecoin deposit — coming soon */}
              <button
                onClick={handleStablecoinClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "10px 18px",
                  borderRadius: "12px",
                  border: "1.5px dashed rgba(255,255,255,0.45)",
                  background: "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.75)",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  backdropFilter: "blur(4px)",
                  transition: "all 0.2s",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.14)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.65)";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.45)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                }}
              >
                {/* Starknet-ish icon */}
                <span style={{
                  width: 20, height: 20,
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  flexShrink: 0,
                }}>◈</span>
                Deposit USDC
                {/* Coming soon pill */}
                <span style={{
                  fontSize: 9,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  background: "rgba(58,181,74,0.35)",
                  border: "1px solid rgba(58,181,74,0.5)",
                  borderRadius: "999px",
                  padding: "1px 6px",
                  color: "#a8f0b4",
                  marginLeft: 2,
                }}>
                  Soon
                </span>
              </button>

            </div>

            {/* Starknet attribution line */}
            <p style={{
              marginTop: 14,
              fontSize: 10,
              color: "rgba(255,255,255,0.35)",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}>
              {/*
                  <span style={{ fontSize: 11 }}>◈</span>
                USDC deposits powered by{" "}
                <span style={{ color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>
                  StarkZap on Starknet
                </span>
              */}
              
            </p>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-500 uppercase
                           tracking-wide mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              {[
                { href: "/parent/add-dependant", label: "＋  Add Child",        primary: true  },
                { href: "/parent/change-pin",    label: "🔒  Change PIN",       primary: false },
                { href: "/parent/transactions",  label: "📋  All Transactions", primary: false },
              ].map((action) => (
                <Link key={action.href} href={action.href}>
                  <button className={`w-full text-left px-4 py-2.5 rounded-xl
                    text-sm font-medium transition-all duration-200
                    ${action.primary
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}>
                    {action.label}
                  </button>
                </Link>
              ))}

              {/* Stablecoin quick action */}
              <button
                onClick={handleStablecoinClick}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm
                           font-medium transition-all duration-200
                           bg-gray-50 text-gray-400 cursor-pointer
                           hover:bg-gray-100"
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <span>◈  Deposit USDC</span>
                <span style={{
                  fontSize: 9,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.4px",
                  background: "rgba(58,181,74,0.1)",
                  border: "1px solid rgba(58,181,74,0.25)",
                  borderRadius: "999px",
                  padding: "1px 7px",
                  color: "#2d8a2d",
                }}>
                  Soon
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ── STATS ROW ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Children",     value: dependants.length,   suffix: "" },
            { label: "Transactions", value: transactions.length, suffix: "" },
            {
              label: "Total spent",
              value: `UGX ${transactions
                .filter(t => t.type === "withdraw")
                .reduce((s, t) => s + t.amount, 0)
                .toLocaleString()}`,
              suffix: "",
            },
            {
              label: "Avg per child",
              value: dependants.length
                ? `UGX ${Math.round(
                    dependants.reduce((s, d) => s + d.balance, 0) / dependants.length
                  ).toLocaleString()}`
                : "—",
              suffix: "",
            },
          ].map((stat) => (
            <div key={stat.label}
              className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                {stat.label}
              </p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* ── SPENDING CHART ───────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Spending — last 7 days</h3>
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
              Weekly view
            </span>
          </div>
          <SpendingChart data={chartData} />
        </div>

        {/* ── DEPENDANTS ───────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Children
                <span className="ml-2 text-sm font-medium text-gray-400 bg-gray-100
                                 px-2 py-0.5 rounded-full">
                  {dependants.length}
                </span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Manage each child&apos;s wallet and limits
              </p>
            </div>
            <Link href="/parent/add-dependant">
              <button className="bg-green-600 text-white px-4 py-2 rounded-xl
                                 text-sm font-semibold hover:bg-green-700
                                 transition-colors hidden sm:block">
                + Add Child
              </button>
            </Link>
          </div>

          {dependants.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-gray-200
                            rounded-xl">
              <p className="text-3xl mb-2">👶</p>
              <p className="text-gray-500 text-sm">No children added yet.</p>
              <Link href="/parent/add-dependant">
                <button className="mt-3 text-sm text-green-600 font-semibold
                                   hover:underline">
                  Add your first child →
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dependants.map((dep) => (
                <div key={dep._id}
                  className="border border-gray-100 rounded-xl p-4 hover:shadow-md
                             hover:border-green-200 transition-all duration-200 group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center
                                    justify-center text-green-700 font-bold text-sm shrink-0">
                      {dep.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                        {dep.name}
                      </h3>
                      <p className="text-xs text-gray-400">Active</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg px-3 py-2 mb-3">
                    <p className="text-xs text-gray-400">Balance</p>
                    <p className="text-lg font-bold text-green-600">
                      UGX {(dep.balance || 0).toLocaleString()}
                    </p>
                  </div>

                  <Link href={`/parent/dependant/${dep._id}`}>
                    <button className="w-full text-sm text-green-600 font-semibold
                                       py-1.5 rounded-lg border border-green-200
                                       hover:bg-green-50 transition-colors">
                      Manage →
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RECENT TRANSACTIONS ──────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
              <p className="text-xs text-gray-400 mt-0.5">Last 5 activities</p>
            </div>
            <Link href="/parent/transactions">
              <button className="text-sm text-green-600 font-semibold hover:underline">
                View all
              </button>
            </Link>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-gray-200
                            rounded-xl">
              <p className="text-3xl mb-2">💳</p>
              <p className="text-gray-500 text-sm">No transactions yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {transactions.map((tx) => (
                <div key={tx._id}
                  className="flex items-center justify-between py-3
                             hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center
                                     text-sm shrink-0
                      ${tx.type === "withdraw"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                      }`}>
                      {tx.type === "withdraw" ? "↑" : "↓"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 leading-tight">
                        {tx.dependantName || "Deposit"}
                      </p>
                      <p className="text-xs text-gray-400">{tx.merchant}</p>
                    </div>
                  </div>
                  <p className={`text-sm font-bold tabular-nums
                    ${tx.type === "withdraw" ? "text-red-500" : "text-green-600"}`}>
                    {tx.type === "withdraw" ? "−" : "+"}
                    UGX {(tx.amount || 0).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* ── MOBILE BOTTOM NAV ───────────────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t
                      border-gray-100 shadow-lg z-40">
        <div className="grid grid-cols-4 h-16">
          {[
            { href: "/parent/dashboard",     icon: "⊞", label: "Home"     },
            { href: "/parent/transfer",      icon: "↗", label: "Transfer" },
            { href: "/parent/add-dependant", icon: "+", label: "Add Child" },
            { href: "/parent/transactions",  icon: "☰", label: "History"  },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className="flex flex-col items-center justify-center gap-1
                         text-gray-400 hover:text-green-600 transition-colors">
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Bottom padding for mobile nav */}
      <div className="h-16 md:hidden" />
    </div>
  );
}
