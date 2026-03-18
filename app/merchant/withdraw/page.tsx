

"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Step = "form" | "confirm" | "success" | "error";

interface SuccessData {
  reference:        string;
  amount:           number;
  fee:              number;
  commissionEarned: number;
  dependantBalance: number;
  dependantName:    string;
}

// ── OTP PIN input component ───────────────────────────────────────────────────
function PinInput({
  values,
  onChange,
  label,
}: {
  values: string[];
  onChange: (vals: string[]) => void;
  label: string;
}) {
  function handleDigit(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const updated = [...values];
    updated[index] = value;
    onChange(updated);
    if (value && index < 3) {
      (document.getElementById(`wd-pin-${index + 1}`) as HTMLInputElement)?.focus();
    }
  }
  function handleBackspace(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      (document.getElementById(`wd-pin-${index - 1}`) as HTMLInputElement)?.focus();
    }
  }
  return (
    <div>
      <label className="block text-xs text-slate-400 font-medium uppercase
                         tracking-wide mb-3">{label}</label>
      <div className="flex gap-3">
        {values.map((v, i) => (
          <input
            key={i}
            id={`wd-pin-${i}`}
            type="password"
            inputMode="numeric"
            maxLength={1}
            value={v}
            onChange={(e) => handleDigit(i, e.target.value)}
            onKeyDown={(e) => handleBackspace(i, e)}
            autoFocus={i === 0}
            className="w-14 h-14 text-center text-xl font-bold bg-slate-800
                       border-2 border-slate-700 rounded-xl text-white
                       focus:border-blue-500 focus:outline-none focus:ring-2
                       focus:ring-blue-500/20 transition-all duration-200"
          />
        ))}
      </div>
      {/* dot indicators */}
      <div className="flex gap-2 mt-3">
        {values.map((v, i) => (
          <div key={i} className={`w-2 h-2 rounded-full transition-all duration-150
            ${v ? "bg-blue-400 scale-110" : "bg-slate-700"}`} />
        ))}
      </div>
    </div>
  );
}

export default function WithdrawPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Form fields
  const [dependantName, setDependantName] = useState("");
  const [pin,           setPin]           = useState(["", "", "", ""]);
  const [amount,        setAmount]        = useState("");

  // UI state
  const [step,        setStep]        = useState<Step>("form");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [successData, setSuccessData] = useState<SuccessData | null>(null);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent
                        rounded-full animate-spin" />
      </div>
    );
  }
  if (!session) { router.push("/merchant/signin"); return null; }

  const pinValue     = pin.join("");
  const amountNumber = Number(amount);

  // ── Validate before showing confirm ──────────────────────────────────────
  function handleReview(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!dependantName.trim()) { setError("Enter the dependant's name"); return; }
    if (pinValue.length < 4)   { setError("Enter the full 4-digit PIN");  return; }
    if (!amount || amountNumber < 1000) {
      setError("Minimum withdrawal is UGX 1,000");
      return;
    }
    setStep("confirm");
  }

  // ── Submit withdrawal ─────────────────────────────────────────────────────
  async function handleSubmit() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/merchant/withdraw", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          dependantName: dependantName.trim(),
          pin:           pinValue,
          amount:        amountNumber,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Withdrawal failed");
        setStep("error");
        return;
      }

      setSuccessData({
        reference:        data.reference,
        amount:           data.amount,
        fee:              data.fee,
        commissionEarned: data.commissionEarned,
        dependantBalance: data.dependantBalance,
        dependantName:    dependantName.trim(),
      });
      setStep("success");
    } catch {
      setError("Network error. Please try again.");
      setStep("error");
    } finally {
      setLoading(false);
    }
  }

  // ── Reset for new transaction ─────────────────────────────────────────────
  function reset() {
    setDependantName("");
    setPin(["", "", "", ""]);
    setAmount("");
    setError("");
    setSuccessData(null);
    setStep("form");
  }

  const fee = Math.round(amountNumber * 0.03);

  // ── SUCCESS ───────────────────────────────────────────────────────────────
  if (step === "success" && successData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl
                        p-8 w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-green-900 rounded-full flex items-center
                          justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Withdrawal Successful</h2>
          <p className="text-slate-400 text-sm mb-6">Transaction processed</p>

          <div className="bg-slate-800 rounded-xl p-4 text-left space-y-3 mb-6">
            {[
              { label: "Dependant",   value: successData.dependantName },
              { label: "Amount",      value: `UGX ${successData.amount.toLocaleString()}` },
              { label: "Platform fee (3%)", value: `UGX ${successData.fee.toLocaleString()}` },
              { label: "Your commission",   value: `UGX ${successData.commissionEarned.toLocaleString()}`,
                green: true },
              { label: "Remaining balance",
                value: `UGX ${successData.dependantBalance.toLocaleString()}` },
            ].map((row) => (
              <div key={row.label} className="flex justify-between text-sm">
                <span className="text-slate-400">{row.label}</span>
                <span className={`font-semibold ${row.green ? "text-green-400" : "text-white"}`}>
                  {row.value}
                </span>
              </div>
            ))}
            <div className="border-t border-slate-700 pt-3">
              <p className="text-xs text-slate-500 font-mono break-all">
                Ref: {successData.reference}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={reset}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold
                         py-3 rounded-xl text-sm transition-colors">
              New Transaction
            </button>
            <Link href="/merchant/dashboard" className="flex-1">
              <button className="w-full border border-slate-700 text-slate-300
                                 hover:bg-slate-800 font-medium py-3 rounded-xl
                                 text-sm transition-colors">
                Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── ERROR ──────────────────────────────────────────────────────────────────
  if (step === "error") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-red-900 rounded-2xl
                        p-8 w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-red-950 rounded-full flex items-center
                          justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Transaction Failed</h2>
          <p className="text-red-300 text-sm mb-6">{error}</p>
          <div className="flex gap-3">
            <button onClick={reset}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold
                         py-3 rounded-xl text-sm transition-colors">
              Try Again
            </button>
            <Link href="/merchant/dashboard" className="flex-1">
              <button className="w-full border border-slate-700 text-slate-300
                                 hover:bg-slate-800 font-medium py-3 rounded-xl
                                 text-sm transition-colors">
                Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── CONFIRM ────────────────────────────────────────────────────────────────
  if (step === "confirm") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl
                        p-8 w-full max-w-sm">
          <h2 className="text-xl font-bold text-white mb-1">Confirm Withdrawal</h2>
          <p className="text-slate-400 text-sm mb-6">
            Review the details before processing
          </p>

          <div className="bg-slate-800 rounded-xl p-4 space-y-3 mb-6">
            {[
              { label: "Dependant",       value: dependantName },
              { label: "Amount",          value: `UGX ${amountNumber.toLocaleString()}` },
              { label: "Platform fee (3%)", value: `UGX ${fee.toLocaleString()}` },
              { label: "Total deducted",  value: `UGX ${(amountNumber + fee).toLocaleString()}` },
            ].map((row) => (
              <div key={row.label} className="flex justify-between text-sm">
                <span className="text-slate-400">{row.label}</span>
                <span className="font-semibold text-white">{row.value}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep("form")} disabled={loading}
              className="flex-1 border border-slate-700 text-slate-300 hover:bg-slate-800
                         font-medium py-3 rounded-xl text-sm transition-colors
                         disabled:opacity-40">
              Back
            </button>
            <button onClick={handleSubmit} disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold
                         py-3 rounded-xl text-sm transition-colors disabled:opacity-50
                         disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent
                                   rounded-full animate-spin"/>
                  Processing…
                </span>
              ) : "Confirm & Process"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── FORM (default) ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Back link */}
        <Link href="/merchant/dashboard"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white
                     text-sm mb-6 transition-colors">
          ← Back to dashboard
        </Link>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">

          {/* Header */}
          <div className="mb-7">
            <div className="w-12 h-12 bg-blue-900 rounded-xl flex items-center
                            justify-center mb-4">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Process Withdrawal</h1>
            <p className="text-slate-400 text-sm mt-1">
              Dependant must be enrolled at your institution
            </p>
          </div>

          {error && (
            <div className="bg-red-950 border border-red-800 text-red-300 text-sm
                            rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleReview} className="space-y-6">

            {/* Dependant name */}
            <div>
              <label className="block text-xs text-slate-400 font-medium uppercase
                                 tracking-wide mb-2">
                Dependant UserName
              </label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                value={dependantName}
                onChange={(e) => setDependantName(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 text-white
                           placeholder-slate-500 rounded-xl px-4 py-3 text-sm
                           focus:border-blue-500 focus:outline-none focus:ring-2
                           focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* PIN */}
            <PinInput values={pin} onChange={setPin} label="Dependant PIN" />

            {/* Amount */}
            <div>
              <label className="block text-xs text-slate-400 font-medium uppercase
                                 tracking-wide mb-2">
                Amount (UGX)
              </label>
              <input
                type="number"
                placeholder="Minimum UGX 1,000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={1000}
                required
                className="w-full bg-slate-800 border border-slate-700 text-white
                           placeholder-slate-500 rounded-xl px-4 py-3 text-sm
                           focus:border-blue-500 focus:outline-none focus:ring-2
                           focus:ring-blue-500/20 transition-all"
              />
              {amountNumber >= 1000 && (
                <p className="text-xs text-slate-500 mt-2">
                  Fee (3%): UGX {fee.toLocaleString()} · 
                  Total deducted: UGX {(amountNumber + fee).toLocaleString()}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold
                         py-3.5 rounded-xl text-sm transition-colors duration-200"
            >
              Review Withdrawal
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}