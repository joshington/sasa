

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

type Step = "current" | "new" | "confirm";

export default function ChangePinPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [step,       setStep]       = useState<Step>("current");
  const [currentPin, setCurrentPin] = useState(["", "", "", ""]);
  const [newPin,     setNewPin]     = useState(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", ""]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState(false);
  const [shaking,    setShaking]    = useState(false);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent
                        rounded-full animate-spin" />
      </div>
    );
  }
  if (!session) { router.push("/"); return null; }

  // ── Helpers ───────────────────────────────────────────────────────────────
  function shake() {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  }

  function handleDigit(
    index: number,
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    current: string[],
    prefix: string
  ) {
    if (!/^\d?$/.test(value)) return;
    const updated  = [...current];
    updated[index] = value;
    setter(updated);
    if (value && index < 3) {
      (document.getElementById(`${prefix}-${index + 1}`) as HTMLInputElement)?.focus();
    }
  }

  function handleBackspace(
    index: number,
    e: React.KeyboardEvent,
    current: string[],
    prefix: string
  ) {
    if (e.key === "Backspace" && !current[index] && index > 0) {
      (document.getElementById(`${prefix}-${index - 1}`) as HTMLInputElement)?.focus();
    }
  }

  // ── Step handlers ─────────────────────────────────────────────────────────
  function handleCurrentPin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (currentPin.join("").length < 4) { setError("Enter all 4 digits"); return; }
    setStep("new");
  }

  function handleNewPin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (newPin.join("").length < 4) { setError("Enter all 4 digits"); return; }
    setStep("confirm");
  }

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const confirmValue = confirmPin.join("");
    if (confirmValue.length < 4) { setError("Enter all 4 digits"); return; }

    if (newPin.join("") !== confirmValue) {
      setError("PINs do not match. Try again.");
      shake();
      setConfirmPin(["", "", "", ""]);
      document.getElementById("confirm-0")?.focus();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/parent/change-pin", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          currentPin:    currentPin.join(""),
          newPin:        newPin.join(""),
          confirmNewPin: confirmValue,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        // If current PIN was wrong, send back to step 1
        if (res.status === 401) {
          shake();
          setStep("current");
          setCurrentPin(["", "", "", ""]);
          setNewPin([    "", "", "", ""]);
          setConfirmPin(["", "", "", ""]);
        }
        throw new Error(data.error || "Failed to change PIN");
      }

      setSuccess(true);
      setTimeout(() => router.push("/parent/dashboard"), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ── Sub-components ────────────────────────────────────────────────────────
  const PinDots = ({ values }: { values: string[] }) => (
    <div className="flex justify-center gap-3 my-4">
      {values.map((v, i) => (
        <div key={i} className={`w-3 h-3 rounded-full transition-all duration-200
          ${v ? "bg-green-600 scale-110" : "bg-gray-200"}`} />
      ))}
    </div>
  );

  const PinInputs = ({
    values, setter, prefix,
  }: {
    values: string[];
    setter: React.Dispatch<React.SetStateAction<string[]>>;
    prefix: string;
  }) => (
    <div className={`flex justify-center gap-3 ${shaking ? "animate-bounce" : ""}`}>
      {values.map((v, i) => (
        <input
          key={i}
          id={`${prefix}-${i}`}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={v}
          onChange={(e) => handleDigit(i, e.target.value, setter, values, prefix)}
          onKeyDown={(e) => handleBackspace(i, e, values, prefix)}
          autoFocus={i === 0}
          className="w-14 h-14 text-center text-xl font-bold border-2 rounded-xl
                     border-gray-200 focus:border-green-500 focus:outline-none
                     focus:ring-2 focus:ring-green-100 transition-all duration-200"
        />
      ))}
    </div>
  );

  // ── Step config ───────────────────────────────────────────────────────────
  const steps: Record<Step, { index: number; title: string; subtitle: string }> = {
    current: {
      index:    0,
      title:    "Enter current PIN",
      subtitle: "Confirm your identity before making changes",
    },
    new: {
      index:    1,
      title:    "Enter new PIN",
      subtitle: "Choose a new 4-digit PIN",
    },
    confirm: {
      index:    2,
      title:    "Confirm new PIN",
      subtitle: "Re-enter your new PIN to confirm",
    },
  };

  const current = steps[step];

  // ── Success screen ────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-10 rounded-2xl shadow-md text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center
                          justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">PIN Changed!</h2>
          <p className="text-gray-500 text-sm">Redirecting to dashboard…</p>
        </div>
      </div>
    );
  }

  // ── Main UI ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Mini nav */}
      <nav className="bg-white border-b border-gray-100 px-4 h-14
                      flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/pesasa-logo.png" alt="Pesasa" width={30} height={30} priority />
          <span className="font-bold text-gray-900 tracking-tight">Pesasa</span>
        </div>
        <Link href="/parent/dashboard"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
          ← Back to dashboard
        </Link>
      </nav>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-md w-full max-w-sm p-8">

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center
                            justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{current.title}</h1>
            <p className="text-gray-500 text-sm mt-1">{current.subtitle}</p>
          </div>

          {/* Step indicators */}
          <div className="flex justify-center gap-2 mb-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-300
                ${i <= current.index
                  ? "bg-green-500 w-8"
                  : "bg-gray-200 w-8"
                }`} />
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm
                            rounded-lg px-4 py-3 mb-4 text-center">
              {error}
            </div>
          )}

          {/* Step: current PIN */}
          {step === "current" && (
            <form onSubmit={handleCurrentPin}>
              <PinDots values={currentPin} />
              <PinInputs values={currentPin} setter={setCurrentPin} prefix="current" />
              <button type="submit"
                className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white
                           font-semibold py-3 rounded-xl transition-colors duration-200">
                Continue
              </button>
            </form>
          )}

          {/* Step: new PIN */}
          {step === "new" && (
            <form onSubmit={handleNewPin}>
              <PinDots values={newPin} />
              <PinInputs values={newPin} setter={setNewPin} prefix="new" />
              <div className="flex gap-3 mt-8">
                <button type="button"
                  onClick={() => { setStep("current"); setError(""); setNewPin(["","","",""]); }}
                  className="flex-1 border border-gray-200 text-gray-600 font-medium
                             py-3 rounded-xl hover:bg-gray-50 transition-colors">
                  Back
                </button>
                <button type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white
                             font-semibold py-3 rounded-xl transition-colors">
                  Continue
                </button>
              </div>
            </form>
          )}

          {/* Step: confirm new PIN */}
          {step === "confirm" && (
            <form onSubmit={handleConfirm}>
              <PinDots values={confirmPin} />
              <PinInputs values={confirmPin} setter={setConfirmPin} prefix="confirm" />
              <div className="flex gap-3 mt-8">
                <button type="button"
                  onClick={() => { setStep("new"); setError(""); setConfirmPin(["","","",""]); }}
                  className="flex-1 border border-gray-200 text-gray-600 font-medium
                             py-3 rounded-xl hover:bg-gray-50 transition-colors">
                  Back
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white
                             font-semibold py-3 rounded-xl transition-colors
                             disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? "Saving…" : "Change PIN"}
                </button>
              </div>
            </form>
          )}

          <button onClick={() => router.push("/parent/dashboard")}
            className="mt-4 w-full text-gray-400 text-sm hover:text-gray-600
                       transition-colors text-center">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}