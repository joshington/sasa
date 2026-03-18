

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function SetPinPage() {
  const router   = useRouter();
  const { data: session, status } = useSession();

  const [pin,        setPin]        = useState(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", ""]);
  const [step,       setStep]       = useState<"set" | "confirm">("set");
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState(false);

  // Redirect if not authenticated
  if (status === "loading") return <p>Loading...</p>;
  if (!session)  { router.push("/"); return null; }

  // ── OTP-style input handler ──────────────────────────────────────────────
  function handleDigit(
    index: number,
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    current: string[]
  ) {
    if (!/^\d?$/.test(value)) return; // digits only

    const updated = [...current];
    updated[index] = value;
    setter(updated);

    // Auto-advance focus
    if (value && index < 3) {
      const next = document.getElementById(
        `${setter === setPin ? "pin" : "confirm"}-${index + 1}`
      );
      (next as HTMLInputElement)?.focus();
    }
  }

  function handleBackspace(
    index: number,
    e: React.KeyboardEvent,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    current: string[]
  ) {
    if (e.key === "Backspace" && !current[index] && index > 0) {
      const prev = document.getElementById(
        `${setter === setPin ? "pin" : "confirm"}-${index - 1}`
      );
      (prev as HTMLInputElement)?.focus();
    }
  }

  // ── Step 1 — set PIN ──────────────────────────────────────────────────────
  function handleSetPin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const value = pin.join("");
    if (value.length < 4) { setError("Enter all 4 digits"); return; }
    setStep("confirm");
  }

  // ── Step 2 — confirm + submit ─────────────────────────────────────────────
  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const pinValue     = pin.join("");
    const confirmValue = confirmPin.join("");

    if (confirmValue.length < 4) { setError("Enter all 4 digits"); return; }
    if (pinValue !== confirmValue) {
      setError("PINs do not match. Please try again.");
      setConfirmPin(["", "", "", ""]);
      document.getElementById("confirm-0")?.focus();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/parent/set-pin", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ pin: pinValue, confirmPin: confirmValue }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to set PIN");

      setSuccess(true);
      setTimeout(() => router.push("/parent/dashboard"), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ── Dot display for entered digits ────────────────────────────────────────
  const PinDots = ({ values }: { values: string[] }) => (
    <div className="flex justify-center gap-3 my-4">
      {values.map((v, i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full transition-all duration-200 ${
            v ? "bg-green-600 scale-110" : "bg-gray-200"
          }`}
        />
      ))}
    </div>
  );

  // ── PIN input row ─────────────────────────────────────────────────────────
  const PinInputs = ({
    values,
    setter,
    prefix,
  }: {
    values: string[];
    setter: React.Dispatch<React.SetStateAction<string[]>>;
    prefix: string;
  }) => (
    <div className="flex justify-center gap-3">
      {values.map((v, i) => (
        <input
          key={i}
          id={`${prefix}-${i}`}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={v}
          onChange={(e) => handleDigit(i, e.target.value, setter, values)}
          onKeyDown={(e) => handleBackspace(i, e, setter, values)}
          className="w-14 h-14 text-center text-xl font-bold border-2 rounded-xl
                     border-gray-200 focus:border-green-500 focus:outline-none
                     focus:ring-2 focus:ring-green-100 transition-all duration-200"
          autoFocus={i === 0}
        />
      ))}
    </div>
  );

  // ── Success state ─────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-10 rounded-2xl shadow-md text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">PIN Set!</h2>
          <p className="text-gray-500">Redirecting to dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-sm p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {step === "set" ? "Create your PIN" : "Confirm your PIN"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {step === "set"
              ? "This PIN protects your transfers and payments"
              : "Enter the same PIN again to confirm"}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex justify-center gap-2 mb-6">
          <div className="w-8 h-1 rounded-full bg-green-500" />
          <div className={`w-8 h-1 rounded-full transition-all duration-300 ${
            step === "confirm" ? "bg-green-500" : "bg-gray-200"
          }`} />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm
                          rounded-lg px-4 py-3 mb-4 text-center">
            {error}
          </div>
        )}

        {/* Step 1 */}
        {step === "set" && (
          <form onSubmit={handleSetPin}>
            <PinDots values={pin} />
            <PinInputs values={pin} setter={setPin} prefix="pin" />
            <button
              type="submit"
              className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white
                         font-semibold py-3 rounded-xl transition-colors duration-200"
            >
              Continue
            </button>
          </form>
        )}

        {/* Step 2 */}
        {step === "confirm" && (
          <form onSubmit={handleConfirm}>
            <PinDots values={confirmPin} />
            <PinInputs values={confirmPin} setter={setConfirmPin} prefix="confirm" />
            <div className="flex gap-3 mt-8">
              <button
                type="button"
                onClick={() => { setStep("set"); setError(""); setConfirmPin(["","","",""]); }}
                className="flex-1 border border-gray-200 text-gray-600 font-medium
                           py-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white
                           font-semibold py-3 rounded-xl transition-colors duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving…" : "Set PIN"}
              </button>
            </div>
          </form>
        )}

        <button
          onClick={() => router.back()}
          className="mt-4 w-full text-gray-400 text-sm hover:text-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}