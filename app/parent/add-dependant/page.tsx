
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function AddDependant() {
  const { data: session } = useSession();
  const router = useRouter();

  const [name,       setName]       = useState("");
  const [pin,        setPin]        = useState("");
  const [institute,  setInstitute]  = useState("");
  const [dailyLimit, setDailyLimit] = useState("");
  const [showPin,    setShowPin]    = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setError("PIN must be exactly 4 digits.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/parent/add-dependant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          pin,
          institute,
          dailySpendLimit: Number(dailyLimit) || 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error adding child");
      router.push("/parent/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ad-root {
          min-height: 100vh;
          background: #f7fdf7;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          flex-direction: column;
        }

        /* ── Navbar ── */
        .ad-nav {
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 40;
        }
        .ad-nav-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }
        .ad-nav-logo-text {
          font-size: 17px;
          font-weight: 700;
          color: #1a5c1a;
          letter-spacing: -0.3px;
        }
        .ad-back-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: none;
          border: 1px solid #d1fae5;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          color: #2d8a2d;
          cursor: pointer;
          transition: background 0.15s;
          text-decoration: none;
        }
        .ad-back-btn:hover { background: #f0faf0; }

        /* ── Body ── */
        .ad-body {
          flex: 1;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 40px 20px 60px;
        }

        .ad-card {
          width: 100%;
          max-width: 480px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
          overflow: hidden;
        }

        /* Card header strip */
        .ad-card-header {
          background: linear-gradient(135deg, #1a5c1a 0%, #2d8a2d 55%, #3ab54a 100%);
          padding: 28px 32px;
          position: relative;
          overflow: hidden;
        }
        .ad-card-header::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 140px; height: 140px;
          border-radius: 50%;
          background: rgba(255,255,255,0.07);
        }
        .ad-card-header::after {
          content: '';
          position: absolute;
          bottom: -30px; left: -20px;
          width: 100px; height: 100px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
        }
        .ad-header-icon {
          width: 48px; height: 48px;
          background: rgba(255,255,255,0.18);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          margin-bottom: 14px;
          position: relative; z-index: 1;
        }
        .ad-header-title {
          font-size: 22px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.5px;
          margin-bottom: 4px;
          position: relative; z-index: 1;
        }
        .ad-header-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.7);
          position: relative; z-index: 1;
        }

        /* Form body */
        .ad-form-body { padding: 32px; }

        /* Error box */
        .ad-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 14px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          font-size: 13px;
          color: #dc2626;
          margin-bottom: 20px;
        }

        /* Field group */
        .ad-field-group {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 24px;
        }

        .ad-field { display: flex; flex-direction: column; gap: 7px; }

        .ad-label {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #374151;
        }
        .ad-label-sub {
          font-size: 11px;
          font-weight: 400;
          text-transform: none;
          letter-spacing: 0;
          color: #9ca3af;
          margin-left: 4px;
        }

        .ad-input-wrap { position: relative; }

        .ad-input {
          width: 100%;
          padding: 12px 14px;
          border: 1.5px solid #d1fae5;
          border-radius: 10px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #1a5c1a;
          background: #f9fefb;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .ad-input:focus {
          border-color: #3ab54a;
          box-shadow: 0 0 0 3px rgba(58,181,74,0.12);
        }
        .ad-input::placeholder { color: #9ca3af; }
        .ad-input.has-toggle { padding-right: 46px; }

        /* PIN dots display */
        .ad-pin-wrap { position: relative; }
        .ad-pin-dots {
          position: absolute;
          left: 14px; top: 50%;
          transform: translateY(-50%);
          display: flex; gap: 8px;
          pointer-events: none;
        }
        .ad-pin-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: #3ab54a;
        }
        .ad-pin-dot.empty {
          background: none;
          border: 1.5px solid #d1fae5;
        }

        /* Toggle button */
        .ad-toggle {
          position: absolute;
          right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 15px;
          color: #9ca3af;
          padding: 0;
          transition: color 0.15s;
          display: flex; align-items: center;
        }
        .ad-toggle:hover { color: #3ab54a; }

        /* Hint text */
        .ad-hint {
          font-size: 11px;
          color: #9ca3af;
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Divider */
        .ad-divider {
          border: none;
          border-top: 1px solid #f0faf0;
          margin: 4px 0 20px;
        }

        /* Section label */
        .ad-section-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: #9ca3af;
          margin-bottom: 14px;
        }

        /* Footer buttons */
        .ad-footer {
          display: flex;
          gap: 10px;
          padding-top: 8px;
        }
        .ad-btn-cancel {
          flex: 1;
          padding: 13px;
          background: #f9fafb;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          color: #6b7280;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }
        .ad-btn-cancel:hover { background: #f3f4f6; border-color: #d1d5db; }

        .ad-btn-submit {
          flex: 2;
          padding: 13px;
          background: linear-gradient(135deg, #2d8a2d, #3ab54a);
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          color: #ffffff;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(58,181,74,0.30);
          transition: opacity 0.18s, transform 0.15s, box-shadow 0.18s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .ad-btn-submit:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(58,181,74,0.38);
        }
        .ad-btn-submit:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

        .ad-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.65s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* PIN strength indicator */
        .pin-strength {
          display: flex;
          gap: 4px;
          margin-top: 6px;
        }
        .pin-seg {
          flex: 1; height: 3px;
          border-radius: 999px;
          background: #e5e7eb;
          transition: background 0.2s;
        }
        .pin-seg.filled { background: #3ab54a; }
      `}</style>

      <div className="ad-root">

        {/* Navbar */}
        <nav className="ad-nav">
          <Link href="/parent/dashboard" className="ad-nav-logo">
            <Image src="/pesasa-logo.png" alt="Pesasa" width={32} height={32} />
            <span className="ad-nav-logo-text">Pesasa</span>
          </Link>
          <Link href="/parent/dashboard" className="ad-back-btn">
            ← Back to Dashboard
          </Link>
        </nav>

        {/* Body */}
        <div className="ad-body">
          <div className="ad-card">

            {/* Header */}
            <div className="ad-card-header">
              <div className="ad-header-icon">👶</div>
              <h1 className="ad-header-title">Add a Child</h1>
              <p className="ad-header-sub">
                Set up your child's spending wallet and daily limits.
              </p>
            </div>

            {/* Form */}
            <div className="ad-form-body">
              <form onSubmit={handleSubmit}>

                {error && (
                  <div className="ad-error">
                    <span>⚠️</span> {error}
                  </div>
                )}

                {/* Child info */}
                <div className="ad-section-label">Child Information</div>
                <div className="ad-field-group">

                  <div className="ad-field">
                    <label className="ad-label">
                      Full Name
                    </label>
                    <div className="ad-input-wrap">
                      <input
                        className="ad-input"
                        type="text"
                        placeholder="e.g. Sarah Nakato"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="ad-field">
                    <label className="ad-label">
                      School / Institution
                    </label>
                    <div className="ad-input-wrap">
                      <input
                        className="ad-input"
                        type="text"
                        placeholder="e.g. Kampala Parents School"
                        value={institute}
                        onChange={(e) => setInstitute(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                </div>

                <hr className="ad-divider" />

                {/* Security */}
                <div className="ad-section-label">Security</div>
                <div className="ad-field-group">

                  <div className="ad-field">
                    <label className="ad-label">
                      Spending PIN
                      <span className="ad-label-sub">— 4 digits, used at merchants</span>
                    </label>
                    <div className="ad-input-wrap ad-pin-wrap">
                      <input
                        className="ad-input has-toggle"
                        type={showPin ? "text" : "password"}
                        placeholder={showPin ? "e.g. 1234" : "• • • •"}
                        value={pin}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                          setPin(val);
                        }}
                        required
                        maxLength={4}
                        inputMode="numeric"
                        pattern="\d{4}"
                      />
                      <button
                        type="button"
                        className="ad-toggle"
                        onClick={() => setShowPin((v) => !v)}
                        aria-label={showPin ? "Hide PIN" : "Show PIN"}
                      >
                        {showPin ? "🙈" : "👁️"}
                      </button>
                    </div>

                    {/* PIN strength dots */}
                    <div className="pin-strength">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`pin-seg${pin.length > i ? " filled" : ""}`}
                        />
                      ))}
                    </div>
                    <p className="ad-hint">
                      🔒 Your child enters this PIN when buying at merchants.
                    </p>
                  </div>

                </div>

                <hr className="ad-divider" />

                {/* Spending limits */}
                <div className="ad-section-label">Spending Controls</div>
                <div className="ad-field-group">

                  <div className="ad-field">
                    <label className="ad-label">
                      Daily Spending Limit
                      <span className="ad-label-sub">— optional</span>
                    </label>
                    <div className="ad-input-wrap">
                      <input
                        className="ad-input"
                        type="number"
                        placeholder="e.g. 10,000 UGX — leave blank for no limit"
                        value={dailyLimit}
                        min={0}
                        onChange={(e) => setDailyLimit(e.target.value)}
                      />
                    </div>
                    <p className="ad-hint">
                      💡 Maximum amount this child can spend per day across all merchants.
                    </p>
                  </div>

                </div>

                {/* Footer */}
                <div className="ad-footer">
                  <button
                    type="button"
                    className="ad-btn-cancel"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ad-btn-submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <><div className="ad-spinner" /> Adding child…</>
                    ) : (
                      <>Add Child →</>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}