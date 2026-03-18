

"use client";
import Image from "next/image";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

interface Stats {
  totalVolumeUGX:        number;
  totalTransactionCount: number;
  totalCommissionUGX:    number;
  totalCommissionUSDC:   number;
  pendingCommissionUGX:  number;
  pendingCommissionUSDC: number;
  conversionRate:        number;
}

interface MerchantInfo {
  username:            string;
  email:               string;
  institute:           string;
  status:              string;
  settlementFrequency: string;
  lastSettlementDate?: string;
}

interface Transaction {
  _id:          string;
  amount:       number;
  fee:          number;
  dependantId?: { name: string; smartCardId: string };
  reference:    string;
  status:       string;
  timestamp:    string;
}

export default function MerchantDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [merchant,     setMerchant]     = useState<MerchantInfo | null>(null);
  const [stats,        setStats]        = useState<Stats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [menuOpen,     setMenuOpen]     = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/merchant/signin");
  }, [status, session, router]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/merchant/dashboard")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { router.push("/merchant/signin"); return; }
        setMerchant(data.merchant);
        setStats(data.stats);
        setTransactions(data.recentTransactions || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [session, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent
                          rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading merchant portal…</p>
        </div>
      </div>
    );
  }
  if (!session || !merchant) return null;

  const commission = (tx: Transaction) =>
    Math.round(tx.amount * 0.005).toLocaleString();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image 
                src="/pesasa-logo.png" alt="Pesasa Logo"
                          width={36} height={36} priority />
            <span className="font-bold text-white tracking-tight">
                Pesasa
            </span>
            <span className="text-xs bg-green-900 
                text-white-300 px-2 py-0.5 rounded-full font-medium"
            >Merchant</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <span className="text-green-400 border-b border-green-400 pb-0.5">Dashboard</span>
            <Link href="/merchant/withdraw" className="hover:text-white transition-colors">
                Process Withdrawal
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <img
              src={session.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(merchant.username)}&background=2563eb&color=fff`}
              alt="avatar" className="w-8 h-8 rounded-full border border-slate-600 object-cover"
            />
            <span className="text-sm text-slate-300">{merchant.username}</span>
            <button onClick={() => signOut({ callbackUrl: "/" })}
              className="text-xs text-slate-500 hover:text-red-400 transition-colors ml-1">
              Sign out
            </button>
          </div>
          <button className="md:hidden p-2 rounded-lg hover:bg-slate-800"
            onClick={() => setMenuOpen(!menuOpen)}>
            <div className="w-5 flex flex-col gap-1">
              {[0,1,2].map(i => <span key={i} className="h-0.5 bg-slate-300 rounded block"/>)}
            </div>
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 py-3 space-y-1">
            <div className="flex items-center gap-3 pb-3 mb-2 border-b border-slate-800">
              <img src={session.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(merchant.username)}&background=2563eb&color=fff`}
                alt="avatar" className="w-9 h-9 rounded-full border border-slate-600"/>
              <div>
                <p className="text-sm font-semibold text-white">{merchant.username}</p>
                <p className="text-xs text-slate-400">{merchant.institute}</p>
              </div>
            </div>
            <Link href="/merchant/withdraw" onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800">
              ⚡ Process Withdrawal
            </Link>
            <button onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-slate-800">
              Sign out
            </button>
          </div>
        )}
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{merchant.username}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-slate-400 text-sm">{merchant.institute}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                ${merchant.status === "active" ? "bg-green-900 text-green-400" : "bg-red-900 text-red-400"}`}>
                {merchant.status}
              </span>
            </div>
          </div>
          <Link href="/merchant/withdraw">
            <button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white
                font-semibold px-6 py-3 rounded-xl text-sm transition-all
                duration-200 hover:scale-105 shadow-lg shadow-green-900/40"
            >
              ⚡ Process Withdrawal
            </button>
          </Link>
        </div>

        {merchant.status === "suspended" && (
          <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-3 text-red-300 text-sm">
            ⚠️ Your account is suspended. Contact support to reactivate.
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 col-span-2 lg:col-span-1">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Total volume</p>
            <p className="text-2xl font-bold text-white mt-1">UGX {(stats?.totalVolumeUGX || 0).toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-1">{stats?.totalTransactionCount || 0} transactions</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Total earned</p>
            <p className="text-2xl font-bold text-green-400 mt-1">UGX {(stats?.totalCommissionUGX || 0).toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-1">0.5% commission</p>
          </div>
        <div className="bg-gradient-to-br 
            from-green-900/60 
            to-green-800/30 border border-green-800/50 rounded-2xl p-5"
        >
            <p className="text-xs text-green-400 uppercase tracking-wide font-medium">Pending settlement</p>
            <p className="text-2xl font-bold text-blue-300 mt-1">UGX {(stats?.pendingCommissionUGX || 0).toLocaleString()}</p>
            <p className="text-xs text-green-500 mt-1">Paid weekly</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Next settlement</p>
            <p className="text-lg font-bold text-white mt-1 capitalize">{merchant.settlementFrequency || "Weekly"}</p>
            <p className="text-xs text-slate-500 mt-1">
              {merchant.lastSettlementDate
                ? `Last: ${new Date(merchant.lastSettlementDate).toLocaleDateString()}`
                : "No settlements yet"}
            </p>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
              <p className="text-xs text-slate-500 mt-0.5">Last {transactions.length} processed withdrawals</p>
            </div>
            <span className="text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-full">
              {transactions.length} records
            </span>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-xl">
              <p className="text-3xl mb-2">🧾</p>
              <p className="text-slate-500 text-sm">No transactions yet.</p>
              <Link href="/merchant/withdraw">
                <button className="mt-3 text-sm text-green-400 font-semibold hover:underline">
                  Process your first withdrawal →
                </button>
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 text-xs uppercase tracking-wide">
                      <th className="text-left py-3 font-medium">Dependant</th>
                      <th className="text-left py-3 font-medium">Reference</th>
                      <th className="text-right py-3 font-medium">Amount</th>
                      <th className="text-right py-3 font-medium">Commission (0.5%)</th>
                      <th className="text-left py-3 font-medium">Status</th>
                      <th className="text-left py-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {transactions.map((tx) => (
                      <tr key={tx._id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 font-medium text-white">{tx.dependantId?.name || "—"}</td>
                        <td className="py-3 text-slate-500 font-mono text-xs">{tx.reference}</td>
                        <td className="py-3 text-right font-semibold text-white">UGX {tx.amount.toLocaleString()}</td>
                        <td className="py-3 text-right text-green-400 font-semibold">UGX {commission(tx)}</td>
                        <td className="py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                            ${tx.status === "completed" ? "bg-green-900 text-green-400"
                              : tx.status === "failed" ? "bg-red-900 text-red-400"
                              : "bg-yellow-900 text-yellow-400"}`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3 text-slate-500 text-xs">
                          {new Date(tx.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="sm:hidden space-y-3">
                {transactions.map((tx) => (
                  <div key={tx._id} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold text-white text-sm">{tx.dependantId?.name || "Unknown"}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                        ${tx.status === "completed" ? "bg-green-900 text-green-400" : "bg-red-900 text-red-400"}`}>
                        {tx.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Amount</span>
                      <span className="text-white font-semibold">UGX {tx.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-slate-400">Commission</span>
                      <span className="text-green-400 font-semibold">UGX {commission(tx)}</span>
                    </div>
                    <p className="text-slate-600 text-xs mt-2 font-mono">{tx.reference}</p>
                    <p className="text-slate-600 text-xs">{new Date(tx.timestamp).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-40">
        <div className="grid grid-cols-2 h-16">
          <Link href="/merchant/dashboard"
            className="flex flex-col items-center justify-center gap-1 text-blue-400">
            <span className="text-lg">⊞</span>
            <span className="text-[10px] font-medium">Dashboard</span>
          </Link>
          <Link href="/merchant/withdraw"
            className="flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-white transition-colors">
            <span className="text-lg">⚡</span>
            <span className="text-[10px] font-medium">Withdraw</span>
          </Link>
        </div>
      </nav>
      <div className="h-16 md:hidden" />
    </div>
  );
}