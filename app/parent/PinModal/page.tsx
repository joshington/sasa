

"use client";

import { useState, useEffect } from "react";

interface PinModalProps {
  isOpen:    boolean;
  onSuccess: () => void;       // called when PIN verified — proceed with action
  onCancel:  () => void;       // called when user dismisses
  actionLabel?: string;        // e.g. "Confirm Transfer"
}

export default function PinModal({
  isOpen,
  onSuccess,
  onCancel,
  actionLabel = "Confirm",
}: PinModalProps) {
  const [digits,  setDigits]  = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [shaking, setShaking] = useState(false);

  // Reset on open
  useEffect(() => {
    if (isOpen) { setDigits(["", "", "", ""]); setError(""); }
  }, [isOpen]);

  if (!isOpen) return null;

  function handleDigit(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const updated = [...digits];
    updated[index] = value;
    setDigits(updated);
    if (value && index < 3) {
      (document.getElementById(`modal-pin-${index + 1}`) as HTMLInputElement)?.focus();
    }
  }

  function handleBackspace(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      (document.getElementById(`modal-pin-${index - 1}`) as HTMLInputElement)?.focus();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const pin = digits.join("");
    if (pin.length < 4) { setError("Enter all 4 digits"); return; }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/parent/verify-pin", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ pin }),
      });
      const data = await res.json();

      if (!res.ok) {
        // Shake animation on wrong PIN
        setShaking(true);
        setTimeout(() => setShaking(false), 500);
        setDigits(["", "", "", ""]);
        document.getElementById("modal-pin-0")?.focus();
        throw new Error(data.error || "Incorrect PIN");
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    // Backdrop
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xs p-6"
           onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center
                          justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900">Enter your PIN</h2>
          <p className="text-sm text-gray-500 mt-1">{actionLabel}</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Dot indicators */}
          <div className="flex justify-center gap-3 mb-4">
            {digits.map((d, i) => (
              <div key={i} className={`w-3 h-3 rounded-full transition-all duration-150 ${
                d ? "bg-green-600 scale-110" : "bg-gray-200"
              }`} />
            ))}
          </div>

          {/* OTP inputs */}
          <div className={`flex justify-center gap-3 mb-6 ${shaking ? "animate-bounce" : ""}`}>
            {digits.map((d, i) => (
              <input
                key={i}
                id={`modal-pin-${i}`}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleDigit(i, e.target.value)}
                onKeyDown={(e) => handleBackspace(i, e)}
                autoFocus={i === 0}
                className="w-12 h-12 text-center text-lg font-bold border-2 rounded-xl
                           border-gray-200 focus:border-green-500 focus:outline-none
                           focus:ring-2 focus:ring-green-100 transition-all duration-200"
              />
            ))}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 border border-gray-200 text-gray-600 py-2.5
                         rounded-xl hover:bg-gray-50 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || digits.join("").length < 4}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5
                         rounded-xl text-sm font-semibold transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying…" : "Confirm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}