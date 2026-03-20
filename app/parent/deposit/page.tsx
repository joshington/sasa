

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function DepositPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [amount,        setAmount]        = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const [fetching,      setFetching]      = useState(true);
  const [loading,       setLoading]       = useState(false);
  const [result,        setResult]        = useState<"success" | "error" | null>(null);
  const [message,       setMessage]       = useState("");

  const MIN_DEPOSIT = 5000;
  const quickAmounts = [5000, 10000, 20000, 50000, 100000];

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/");
  }, [session, status, router]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/parent/dashboard")
      .then((r) => r.json())
      .then((d) => {
        setWalletBalance(d.balance || 0);
        setFetching(false);
      });
  }, [session]);

  const numAmount   = Number(amount) || 0;
  const belowMin    = numAmount > 0 && numAmount < MIN_DEPOSIT;
  const canDeposit  = numAmount >= MIN_DEPOSIT && !loading;

  const handleDeposit = async () => {
    if (!canDeposit) return;
    setLoading(true);
    setResult(null);
    setMessage("");

    const res = await fetch("/api/parent/deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: numAmount }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setResult("success");
      setMessage(`UGX ${numAmount.toLocaleString()} deposited successfully.`);
      setAmount("");
      // Refresh balance
      fetch("/api/parent/dashboard")
        .then((r) => r.json())
        .then((d) => setWalletBalance(d.balance || 0));
    } else {
      setResult("error");
      setMessage(data.error || data.message || "Deposit failed. Please try again.");
    }
  };

  if (status === "loading" || fetching) {
    return (
      <div style={{
        minHeight: "100vh", background: "#f7fdf7",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 40, height: 40,
            border: "4px solid #d1fae5",
            borderTopColor: "#3ab54a",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
            margin: "0 auto 12px",
          }} />
          <p style={{ color: "#6b7280", fontSize: 14 }}>Loading…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .dp-root {
          min-height: 100vh;
          background: #f7fdf7;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          flex-direction: column;
        }

        /* ── Navbar ── */
        .dp-nav {
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          padding: 0 24px;
          height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 40;
        }
        .dp-nav-logo {
          display: flex; align-items: center; gap: 8px;
          text-decoration: none;
        }
        .dp-nav-logo-text {
          font-size: 17px; font-weight: 700;
          color: #1a5c1a; letter-spacing: -0.3px;
        }
        .dp-back {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 14px;
          background: none; border: 1px solid #d1fae5;
          border-radius: 8px; font-size: 13px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          color: #2d8a2d; cursor: pointer;
          transition: background 0.15s; text-decoration: none;
        }
        .dp-back:hover { background: #f0faf0; }

        /* ── Body ── */
        .dp-body {
          flex: 1;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 40px 20px 60px;
        }

        .dp-wrap {
          width: 100%;
          max-width: 460px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* ── Balance bar ── */
        .dp-balance-bar {
          background: linear-gradient(135deg, #1a5c1a 0%, #2d8a2d 55%, #3ab54a 100%);
          border-radius: 16px;
          padding: 22px 24px;
          position: relative;
          overflow: hidden;
        }
        .dp-balance-bar::before {
          content: '';
          position: absolute; top: -40px; right: -40px;
          width: 120px; height: 120px;
          border-radius: 50%;
          background: rgba(255,255,255,0.07);
        }
        .dp-balance-bar::after {
          content: '';
          position: absolute; bottom: -20px; left: -20px;
          width: 80px; height: 80px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
        }
        .dp-balance-label {
          font-size: 11px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.5px;
          color: rgba(255,255,255,0.65); margin-bottom: 6px;
          position: relative; z-index: 1;
        }
        .dp-balance-value {
          font-size: 28px; font-weight: 700;
          color: #ffffff; letter-spacing: -0.6px;
          font-family: 'DM Mono', monospace;
          position: relative; z-index: 1;
        }
        .dp-balance-note {
          font-size: 11px; color: rgba(255,255,255,0.45);
          margin-top: 4px; position: relative; z-index: 1;
        }

        /* ── Card ── */
        .dp-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          overflow: hidden;
        }
        .dp-card-header { padding: 24px 28px 0; }
        .dp-card-icon {
          width: 48px; height: 48px;
          background: linear-gradient(135deg, #d1fae5, #a7f3d0);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; margin-bottom: 14px;
        }
        .dp-card-title {
          font-size: 20px; font-weight: 700;
          color: #111827; letter-spacing: -0.4px; margin-bottom: 4px;
        }
        .dp-card-sub { font-size: 13px; color: #9ca3af; }
        .dp-card-body { padding: 22px 28px 28px; }

        /* Section label */
        .dp-section {
          font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.6px;
          color: #9ca3af; margin-bottom: 10px;
        }

        /* Minimum notice */
        .dp-min-notice {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 14px;
          background: #f0fdf4; border: 1px solid #bbf7d0;
          border-radius: 10px;
          font-size: 12px; color: #166534; font-weight: 500;
          margin-bottom: 18px;
        }
        .dp-min-badge {
          background: #3ab54a; color: #ffffff;
          font-size: 10px; font-weight: 700;
          padding: 2px 7px; border-radius: 999px;
          letter-spacing: 0.3px; flex-shrink: 0;
        }

        /* Amount input */
        .dp-amount-wrap {
          position: relative; margin-bottom: 12px;
        }
        .dp-amount-prefix {
          position: absolute; left: 16px; top: 50%;
          transform: translateY(-50%);
          font-size: 15px; font-weight: 700;
          color: #6b7280; pointer-events: none;
          font-family: 'DM Mono', monospace;
        }
        .dp-amount-input {
          width: 100%;
          padding: 14px 16px 14px 64px;
          border: 1.5px solid #d1fae5;
          border-radius: 12px;
          font-size: 24px; font-weight: 700;
          font-family: 'DM Mono', monospace;
          color: #1a5c1a; background: #f9fefb;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .dp-amount-input:focus {
          border-color: #3ab54a;
          box-shadow: 0 0 0 3px rgba(58,181,74,0.12);
        }
        .dp-amount-input::placeholder { color: #d1d5db; font-size: 20px; }
        .dp-amount-input.below-min {
          border-color: #fca5a5; background: #fef2f2; color: #dc2626;
        }

        /* Below min warning */
        .dp-below-min {
          font-size: 12px; color: #dc2626;
          margin-bottom: 12px;
          display: flex; align-items: center; gap: 5px;
        }

        /* Quick amounts */
        .dp-quick {
          display: flex; gap: 8px; flex-wrap: wrap;
          margin-bottom: 20px;
        }
        .dp-quick-btn {
          padding: 6px 14px;
          border: 1px solid #d1fae5;
          border-radius: 999px;
          background: #f9fefb;
          font-size: 12px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          color: #2d8a2d; cursor: pointer;
          transition: all 0.15s;
        }
        .dp-quick-btn:hover { background: #f0faf0; border-color: #3ab54a; }
        .dp-quick-btn.active {
          background: #3ab54a; border-color: #3ab54a; color: #ffffff;
        }

        /* Divider */
        .dp-divider {
          border: none; border-top: 1px solid #f0faf0; margin: 8px 0 18px;
        }

        /* Preview */
        .dp-preview {
          background: #f9fefb;
          border: 1px solid #d1fae5;
          border-radius: 10px;
          padding: 12px 16px;
          margin-bottom: 20px;
        }
        .dp-preview-row {
          display: flex; align-items: center;
          justify-content: space-between;
          font-size: 12px; padding: 3px 0;
        }
        .dp-preview-label { color: #9ca3af; }
        .dp-preview-value {
          font-weight: 600; color: #374151;
          font-family: 'DM Mono', monospace;
        }
        .dp-preview-value.green { color: #2d8a2d; }

        /* Feedback */
        .dp-feedback {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 13px 16px; border-radius: 12px; margin-bottom: 16px;
          animation: fadeIn 0.3s ease;
        }
        .dp-feedback.success {
          background: #f0fdf4; border: 1px solid #bbf7d0;
        }
        .dp-feedback.error {
          background: #fef2f2; border: 1px solid #fecaca;
        }
        .dp-feedback-icon {
          width: 26px; height: 26px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; flex-shrink: 0;
        }
        .dp-feedback.success .dp-feedback-icon { background: #3ab54a; }
        .dp-feedback.error   .dp-feedback-icon { background: #ef4444; }
        .dp-feedback-title {
          font-size: 13px; font-weight: 700; margin-bottom: 2px;
        }
        .dp-feedback.success .dp-feedback-title { color: #166534; }
        .dp-feedback.error   .dp-feedback-title { color: #dc2626; }
        .dp-feedback-sub { font-size: 12px; }
        .dp-feedback.success .dp-feedback-sub { color: #15803d; }
        .dp-feedback.error   .dp-feedback-sub { color: #ef4444; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Submit button */
        .dp-submit {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #2d8a2d, #3ab54a);
          border: none; border-radius: 12px;
          font-size: 15px; font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          color: #ffffff; cursor: pointer;
          box-shadow: 0 2px 12px rgba(58,181,74,0.30);
          transition: opacity 0.18s, transform 0.15s, box-shadow 0.18s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .dp-submit:hover:not(:disabled) {
          opacity: 0.91; transform: translateY(-1px);
          box-shadow: 0 4px 18px rgba(58,181,74,0.38);
        }
        .dp-submit:disabled {
          opacity: 0.45; cursor: not-allowed;
          transform: none; box-shadow: none;
        }

        .dp-spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.65s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Payment methods note */
        .dp-methods {
          display: flex; align-items: center; gap: 8px;
          justify-content: center;
          margin-top: 16px;
          flex-wrap: wrap;
        }
        .dp-method-pill {
          display: flex; align-items: center; gap: 5px;
          padding: 4px 12px;
          background: #f9fafb; border: 1px solid #e5e7eb;
          border-radius: 999px; font-size: 11px; font-weight: 600;
          color: #6b7280;
        }
      `}</style>

      <div className="dp-root">

        {/* Navbar */}
        <nav className="dp-nav">
          <Link href="/parent/dashboard" className="dp-nav-logo">
            <Image src="/pesasa-logo.png" alt="Pesasa" width={32} height={32} />
            <span className="dp-nav-logo-text">Pesasa</span>
          </Link>
          <Link href="/parent/dashboard" className="dp-back">
            ← Dashboard
          </Link>
        </nav>

        {/* Body */}
        <div className="dp-body">
          <div className="dp-wrap">

            {/* Balance bar */}
            <div className="dp-balance-bar">
              <div className="dp-balance-label">Current Wallet Balance</div>
              <div className="dp-balance-value">
                UGX {walletBalance.toLocaleString()}
              </div>
              <div className="dp-balance-note">
                Funds are available immediately after deposit
              </div>
            </div>

            {/* Main card */}
            <div className="dp-card">
              <div className="dp-card-header">
                <div className="dp-card-icon">💰</div>
                <h1 className="dp-card-title">Deposit to Wallet</h1>
                <p className="dp-card-sub">
                  Top up your wallet using mobile money or bank transfer.
                </p>
              </div>

              <div className="dp-card-body">

                {/* Feedback */}
                {result === "success" && (
                  <div className="dp-feedback success">
                    <div className="dp-feedback-icon">✓</div>
                    <div>
                      <div className="dp-feedback-title">Deposit Successful!</div>
                      <div className="dp-feedback-sub">{message}</div>
                    </div>
                  </div>
                )}
                {result === "error" && (
                  <div className="dp-feedback error">
                    <div className="dp-feedback-icon">✕</div>
                    <div>
                      <div className="dp-feedback-title">Deposit Failed</div>
                      <div className="dp-feedback-sub">{message}</div>
                    </div>
                  </div>
                )}

                {/* Minimum notice */}
                <div className="dp-min-notice">
                  <span className="dp-min-badge">MIN</span>
                  Minimum deposit is <strong>UGX 5,000</strong> per transaction.
                </div>

                {/* Amount */}
                <div className="dp-section">Enter Amount (UGX)</div>

                <div className="dp-amount-wrap">
                  <span className="dp-amount-prefix">UGX</span>
                  <input
                    type="number"
                    className={`dp-amount-input${belowMin ? " below-min" : ""}`}
                    placeholder="0"
                    value={amount}
                    min={0}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setResult(null);
                    }}
                  />
                </div>

                {/* Below min warning */}
                {belowMin && (
                  <p className="dp-below-min">
                    ⚠️ Minimum deposit is UGX {MIN_DEPOSIT.toLocaleString()}.
                  </p>
                )}

                {/* Quick amounts */}
                <div className="dp-quick">
                  {quickAmounts.map((q) => (
                    <button
                      key={q}
                      type="button"
                      className={`dp-quick-btn${numAmount === q ? " active" : ""}`}
                      onClick={() => { setAmount(String(q)); setResult(null); }}
                    >
                      {q >= 1000 ? `${q / 1000}k` : q}
                    </button>
                  ))}
                </div>

                <hr className="dp-divider" />

                {/* Preview */}
                {numAmount >= MIN_DEPOSIT && (
                  <div className="dp-preview">
                    <div className="dp-preview-row">
                      <span className="dp-preview-label">Depositing</span>
                      <span className="dp-preview-value">
                        UGX {numAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="dp-preview-row">
                      <span className="dp-preview-label">Current balance</span>
                      <span className="dp-preview-value">
                        UGX {walletBalance.toLocaleString()}
                      </span>
                    </div>
                    <div className="dp-preview-row">
                      <span className="dp-preview-label">Balance after deposit</span>
                      <span className="dp-preview-value green">
                        UGX {(walletBalance + numAmount).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="button"
                  className="dp-submit"
                  disabled={!canDeposit}
                  onClick={handleDeposit}
                >
                  {loading ? (
                    <><div className="dp-spinner" /> Processing…</>
                  ) : (
                    <>
                      Deposit
                      {numAmount >= MIN_DEPOSIT
                        ? ` UGX ${numAmount.toLocaleString()}`
                        : ""
                      } →
                    </>
                  )}
                </button>

                {/* Payment methods */}
                <div className="dp-methods">
                  <div className="dp-method-pill">📱 MTN Mobile Money</div>
                  <div className="dp-method-pill">📱 Airtel Money</div>
                  <div className="dp-method-pill">🏦 Bank Transfer</div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}