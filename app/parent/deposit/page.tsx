"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function DepositPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<"success" | "error" | "pending" | null>(null);
  const [message, setMessage] = useState("");
  const pollRef = useRef<NodeJS.Timeout | null>(null);

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

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const numAmount = Number(amount) || 0;
  const belowMin = numAmount > 0 && numAmount < MIN_DEPOSIT;

  // Normalize phone to +256XXXXXXXXX
  const normalizePhone = (raw: string): string => {
    let p = raw.trim().replace(/\s+/g, "");
    if (p.startsWith("+256")) return p;
    if (p.startsWith("256")) return "+" + p;
    if (p.startsWith("0")) return "+256" + p.slice(1); // 07x → +2567x
    return "+256" + p;
  };

  const phoneValid = (() => {
    const normalized = normalizePhone(phone);
    return /^\+256\d{9}$/.test(normalized);
  })();

  const canDeposit = numAmount >= MIN_DEPOSIT && phoneValid && !loading;

  const pollStatus = (reference: string) => {
    let attempts = 0;
    const MAX = 24; // 2 minutes max (24 × 5s)

    pollRef.current = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch(`/api/parent/deposit/status?reference=${reference}`);
        const data = await res.json();

        if (data.status === "completed") {
          clearInterval(pollRef.current!);
          setLoading(false);
          setResult("success");
          setMessage(`UGX ${numAmount.toLocaleString()} deposited successfully!`);
          setAmount("");
          setPhone("");
          // Refresh balance then redirect
          fetch("/api/parent/dashboard")
            .then((r) => r.json())
            .then((d) => {
              setWalletBalance(d.balance || 0);
              setTimeout(() => router.push("/parent/dashboard"), 2500);
            });
        } else if (data.status === "failed") {
          clearInterval(pollRef.current!);
          setLoading(false);
          setResult("error");
          setMessage("Payment was not completed. Please try again.");
        } else if (attempts >= MAX) {
          clearInterval(pollRef.current!);
          setLoading(false);
          setResult("error");
          setMessage("Payment timed out. If you approved the request, your balance will update shortly.");
        }
      } catch {
        // keep polling on network blip
      }
    }, 5000);
  };

  const handleDeposit = async () => {
    if (!canDeposit) return;
    setLoading(true);
    setResult(null);
    setMessage("");

    const msisdn = normalizePhone(phone);

    const res = await fetch("/api/parent/deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: numAmount, msisdn }),
    });

    const data = await res.json();

    if (res.ok && data.reference) {
      setResult("pending");
      setMessage(`A payment request of UGX ${numAmount.toLocaleString()} has been sent to ${msisdn}. Please approve it on your phone.`);
      pollStatus(data.reference);
    } else {
      setLoading(false);
      setResult("error");
      setMessage(data.error || "Failed to initiate payment. Please try again.");
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

        /* Phone input */
        .dp-phone-wrap {
          position: relative; margin-bottom: 18px;
        }
        .dp-phone-prefix {
          position: absolute; left: 16px; top: 50%;
          transform: translateY(-50%);
          font-size: 13px; font-weight: 700;
          color: #3ab54a; pointer-events: none;
          font-family: 'DM Mono', monospace;
          display: flex; align-items: center; gap: 6px;
        }
        .dp-phone-flag { font-size: 16px; }
        .dp-phone-input {
          width: 100%;
          padding: 13px 16px 13px 80px;
          border: 1.5px solid #d1fae5;
          border-radius: 12px;
          font-size: 15px; font-weight: 600;
          font-family: 'DM Mono', monospace;
          color: #1a5c1a; background: #f9fefb;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .dp-phone-input:focus {
          border-color: #3ab54a;
          box-shadow: 0 0 0 3px rgba(58,181,74,0.12);
        }
        .dp-phone-input::placeholder { color: #d1d5db; font-weight: 400; font-size: 13px; }
        .dp-phone-hint {
          font-size: 11px; color: #9ca3af; margin-top: 5px;
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
        .dp-feedback.success { background: #f0fdf4; border: 1px solid #bbf7d0; }
        .dp-feedback.error   { background: #fef2f2; border: 1px solid #fecaca; }
        .dp-feedback.pending { background: #fffbeb; border: 1px solid #fde68a; }

        .dp-feedback-icon {
          width: 26px; height: 26px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; flex-shrink: 0;
        }
        .dp-feedback.success .dp-feedback-icon { background: #3ab54a; color: #fff; }
        .dp-feedback.error   .dp-feedback-icon { background: #ef4444; color: #fff; }
        .dp-feedback.pending .dp-feedback-icon { background: #f59e0b; color: #fff; }

        .dp-feedback-title { font-size: 13px; font-weight: 700; margin-bottom: 2px; }
        .dp-feedback.success .dp-feedback-title { color: #166534; }
        .dp-feedback.error   .dp-feedback-title { color: #dc2626; }
        .dp-feedback.pending .dp-feedback-title { color: #92400e; }

        .dp-feedback-sub { font-size: 12px; line-height: 1.5; }
        .dp-feedback.success .dp-feedback-sub { color: #15803d; }
        .dp-feedback.error   .dp-feedback-sub { color: #ef4444; }
        .dp-feedback.pending .dp-feedback-sub { color: #b45309; }

        /* Pending pulse */
        .dp-pulse {
          display: inline-block;
          width: 8px; height: 8px; border-radius: 50%;
          background: #f59e0b;
          animation: pulse 1.2s ease-in-out infinite;
          margin-right: 6px;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.75); }
        }

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
              <div className="dp-balance-value">UGX {walletBalance.toLocaleString()}</div>
              <div className="dp-balance-note">Funds are available immediately after deposit</div>
            </div>

            {/* Main card */}
            <div className="dp-card">
              <div className="dp-card-header">
                <div className="dp-card-icon">💰</div>
                <h1 className="dp-card-title">Deposit to Wallet</h1>
                <p className="dp-card-sub">Top up your wallet using MTN or Airtel Mobile Money.</p>
              </div>

              <div className="dp-card-body">

                {/* Feedback */}
                {result === "success" && (
                  <div className="dp-feedback success">
                    <div className="dp-feedback-icon">✓</div>
                    <div>
                      <div className="dp-feedback-title">Deposit Successful!</div>
                      <div className="dp-feedback-sub">{message} Redirecting to dashboard…</div>
                    </div>
                  </div>
                )}
                {result === "pending" && (
                  <div className="dp-feedback pending">
                    <div className="dp-feedback-icon">⏳</div>
                    <div>
                      <div className="dp-feedback-title">
                        <span className="dp-pulse" />
                        Awaiting Payment Approval
                      </div>
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

                {/* Phone number */}
                <div className="dp-section">Mobile Money Number</div>
                <div className="dp-phone-wrap">
                  <span className="dp-phone-prefix">
                    <span className="dp-phone-flag">🇺🇬</span>
                    +256
                  </span>
                  <input
                    type="tel"
                    className="dp-phone-input"
                    placeholder="07X XXX XXXX or +256 7XX XXXXXX"
                    value={phone}
                    disabled={loading}
                    onChange={(e) => { setPhone(e.target.value); setResult(null); }}
                  />
                </div>
                <p className="dp-phone-hint" style={{ marginBottom: 18, marginTop: -10 }}>
                  Enter your MTN or Airtel number. You&apos;ll receive a prompt to approve the payment.
                </p>

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
                    disabled={loading}
                    onChange={(e) => { setAmount(e.target.value); setResult(null); }}
                  />
                </div>

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
                      disabled={loading}
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
                      <span className="dp-preview-value">UGX {numAmount.toLocaleString()}</span>
                    </div>
                    <div className="dp-preview-row">
                      <span className="dp-preview-label">From</span>
                      <span className="dp-preview-value">
                        {phone ? normalizePhone(phone) : "—"}
                      </span>
                    </div>
                    <div className="dp-preview-row">
                      <span className="dp-preview-label">Current balance</span>
                      <span className="dp-preview-value">UGX {walletBalance.toLocaleString()}</span>
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
                    <><div className="dp-spinner" /> Waiting for approval…</>
                  ) : (
                    <>
                      Deposit{numAmount >= MIN_DEPOSIT ? ` UGX ${numAmount.toLocaleString()}` : ""} →
                    </>
                  )}
                </button>

                {/* Payment methods */}
                <div className="dp-methods">
                  <div className="dp-method-pill">📱 MTN Mobile Money</div>
                  <div className="dp-method-pill">📱 Airtel Money</div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}