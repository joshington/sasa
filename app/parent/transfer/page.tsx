

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Dependant {
  _id: string;
  name: string;
  balance: number;
}

export default function TransferPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [dependants,    setDependants]    = useState<Dependant[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [selectedChild, setSelectedChild] = useState("");
  const [amount,        setAmount]        = useState("");
  const [loading,       setLoading]       = useState(false);
  const [fetching,      setFetching]      = useState(true);
  const [result,        setResult]        = useState<"success" | "error" | null>(null);
  const [errorMsg,      setErrorMsg]      = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/");
  }, [session, status, router]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/parent/dashboard")
      .then((r) => r.json())
      .then((data) => {
        setDependants(data.dependants || []);
        setWalletBalance(data.balance || 0);
        setFetching(false);
      });
  }, [session]);

  const selectedDep = dependants.find((d) => d._id === selectedChild);
  const numAmount   = Number(amount) || 0;
  const afterBalance = walletBalance - numAmount;
  const minReserve   = walletBalance * 0.1;
  const belowReserve = numAmount > 0 && afterBalance < minReserve;
  const canTransfer  = selectedChild && numAmount > 0 && !belowReserve && !loading;

  const handleTransfer = async () => {
    if (!canTransfer) return;
    setLoading(true);
    setResult(null);
    setErrorMsg("");

    const res = await fetch("/api/parent/transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dependantId: selectedChild, amount: numAmount }),
    });
    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setResult("success");
      setAmount("");
      // Refresh balance, then redirect
      fetch("/api/parent/dashboard")
        .then((r) => r.json())
        .then((d) => {
          setWalletBalance(d.balance || 0);
          setTimeout(() => router.push("/parent/dashboard"), 2000); // redirect to dashboard after 2 secs
        });
    } else {
      setResult("error");
      setErrorMsg(data.error || "Transfer failed. Please try again.");
    }
  };

  const quickAmounts = [5000, 10000, 20000, 50000];

  if (status === "loading" || fetching) {
    return (
      <div style={{
        minHeight: "100vh", background: "#f7fdf7",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 40, height: 40, border: "4px solid #d1fae5",
            borderTopColor: "#3ab54a", borderRadius: "50%",
            animation: "spin 0.7s linear infinite", margin: "0 auto 12px",
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

        .tr-root {
          min-height: 100vh;
          background: #f7fdf7;
          font-family: 'DM Sans', sans-serif;
          display: flex;
          flex-direction: column;
        }

        /* ── Navbar ── */
        .tr-nav {
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky; top: 0; z-index: 40;
        }
        .tr-nav-logo {
          display: flex; align-items: center; gap: 8px;
          text-decoration: none;
        }
        .tr-nav-logo-text {
          font-size: 17px; font-weight: 700;
          color: #1a5c1a; letter-spacing: -0.3px;
        }
        .tr-back {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 14px;
          background: none;
          border: 1px solid #d1fae5;
          border-radius: 8px;
          font-size: 13px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          color: #2d8a2d; cursor: pointer;
          transition: background 0.15s;
          text-decoration: none;
        }
        .tr-back:hover { background: #f0faf0; }

        /* ── Body ── */
        .tr-body {
          flex: 1;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 40px 20px 60px;
        }

        .tr-wrap {
          width: 100%;
          max-width: 460px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Balance summary bar */
        .tr-balance-bar {
          background: linear-gradient(135deg, #1a5c1a 0%, #2d8a2d 55%, #3ab54a 100%);
          border-radius: 16px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          position: relative;
          overflow: hidden;
        }
        .tr-balance-bar::before {
          content: '';
          position: absolute; top: -30px; right: -30px;
          width: 100px; height: 100px;
          border-radius: 50%;
          background: rgba(255,255,255,0.07);
        }
        .tr-balance-label { font-size: 12px; color: rgba(255,255,255,0.7); font-weight: 500; margin-bottom: 4px; }
        .tr-balance-value { font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; font-family: 'DM Mono', monospace; }
        .tr-balance-note  { font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 3px; }

        /* Card */
        .tr-card {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          overflow: hidden;
        }
        .tr-card-header {
          padding: 22px 28px 0;
        }
        .tr-card-title {
          font-size: 19px; font-weight: 700;
          color: #111827; letter-spacing: -0.4px;
          margin-bottom: 4px;
        }
        .tr-card-sub { font-size: 13px; color: #9ca3af; }
        .tr-card-body { padding: 22px 28px 28px; }

        /* Section label */
        .tr-section {
          font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.6px;
          color: #9ca3af; margin-bottom: 10px;
        }

        /* Child selector */
        .tr-child-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 8px;
          margin-bottom: 20px;
        }
        .tr-child-btn {
          display: flex; flex-direction: column;
          align-items: center; gap: 8px;
          padding: 12px 8px;
          border-radius: 12px;
          border: 1.5px solid #e5e7eb;
          background: #fafafa;
          cursor: pointer;
          transition: all 0.18s;
          font-family: 'DM Sans', sans-serif;
        }
        .tr-child-btn:hover {
          border-color: #3ab54a;
          background: #f0faf0;
        }
        .tr-child-btn.selected {
          border-color: #3ab54a;
          background: #f0fdf4;
          box-shadow: 0 0 0 3px rgba(58,181,74,0.12);
        }
        .tr-child-avatar {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #d1fae5, #a7f3d0);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 700; color: #1a5c1a;
          flex-shrink: 0;
        }
        .tr-child-btn.selected .tr-child-avatar {
          background: linear-gradient(135deg, #3ab54a, #2d8a2d);
          color: #ffffff;
        }
        .tr-child-name {
          font-size: 12px; font-weight: 600; color: #374151;
          text-align: center; line-height: 1.3;
        }
        .tr-child-bal {
          font-size: 10px; color: #9ca3af; text-align: center;
        }
        .tr-child-btn.selected .tr-child-name { color: #1a5c1a; }

        /* No children state */
        .tr-no-children {
          text-align: center; padding: 24px;
          border: 2px dashed #d1fae5; border-radius: 12px;
          margin-bottom: 20px;
        }
        .tr-no-children p { font-size: 13px; color: #9ca3af; margin-bottom: 10px; }

        /* Amount input */
        .tr-amount-wrap {
          position: relative;
          margin-bottom: 12px;
        }
        .tr-amount-prefix {
          position: absolute; left: 16px; top: 50%;
          transform: translateY(-50%);
          font-size: 15px; font-weight: 700;
          color: #6b7280; pointer-events: none;
          font-family: 'DM Mono', monospace;
        }
        .tr-amount-input {
          width: 100%;
          padding: 14px 16px 14px 64px;
          border: 1.5px solid #d1fae5;
          border-radius: 12px;
          font-size: 22px; font-weight: 700;
          font-family: 'DM Mono', monospace;
          color: #1a5c1a;
          background: #f9fefb;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .tr-amount-input:focus {
          border-color: #3ab54a;
          box-shadow: 0 0 0 3px rgba(58,181,74,0.12);
        }
        .tr-amount-input::placeholder { color: #d1d5db; font-size: 20px; }
        .tr-amount-input.error-input {
          border-color: #fca5a5;
          background: #fef2f2;
        }

        /* Quick amounts */
        .tr-quick {
          display: flex; gap: 8px; flex-wrap: wrap;
          margin-bottom: 20px;
        }
        .tr-quick-btn {
          padding: 6px 14px;
          border: 1px solid #d1fae5;
          border-radius: 999px;
          background: #f9fefb;
          font-size: 12px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          color: #2d8a2d; cursor: pointer;
          transition: all 0.15s;
        }
        .tr-quick-btn:hover {
          background: #f0faf0; border-color: #3ab54a;
        }
        .tr-quick-btn.active {
          background: #3ab54a; border-color: #3ab54a;
          color: #ffffff;
        }

        /* Reserve warning */
        .tr-reserve-warn {
          display: flex; align-items: flex-start; gap: 8px;
          padding: 10px 14px;
          background: #fef3c7; border: 1px solid #fde68a;
          border-radius: 10px;
          font-size: 12px; color: #92400e;
          margin-bottom: 16px;
          line-height: 1.5;
        }

        /* After transfer preview */
        .tr-preview {
          background: #f9fefb;
          border: 1px solid #d1fae5;
          border-radius: 10px;
          padding: 12px 16px;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .tr-preview-row {
          display: flex; align-items: center; justify-content: space-between;
          font-size: 12px;
        }
        .tr-preview-label { color: #9ca3af; }
        .tr-preview-value { font-weight: 600; color: #374151; font-family: 'DM Mono', monospace; }
        .tr-preview-value.green { color: #2d8a2d; }
        .tr-preview-value.red   { color: #dc2626; }
        .tr-preview-divider {
          border: none; border-top: 1px solid #d1fae5; margin: 2px 0;
        }

        /* Error / success */
        .tr-error {
          display: flex; align-items: center; gap: 8px;
          padding: 11px 14px;
          background: #fef2f2; border: 1px solid #fecaca;
          border-radius: 10px; font-size: 13px; color: #dc2626;
          margin-bottom: 16px;
        }
        .tr-success {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 14px 16px;
          background: #f0fdf4; border: 1px solid #bbf7d0;
          border-radius: 12px; margin-bottom: 16px;
          animation: fadeIn 0.3s ease;
        }
        .tr-success-icon {
          width: 28px; height: 28px; border-radius: 50%;
          background: #3ab54a; display: flex; align-items: center;
          justify-content: center; font-size: 14px; flex-shrink: 0;
        }
        .tr-success-title { font-size: 14px; font-weight: 700; color: #166534; margin-bottom: 2px; }
        .tr-success-sub   { font-size: 12px; color: #15803d; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; } }

        /* Submit button */
        .tr-submit {
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
        .tr-submit:hover:not(:disabled) {
          opacity: 0.91; transform: translateY(-1px);
          box-shadow: 0 4px 18px rgba(58,181,74,0.38);
        }
        .tr-submit:disabled {
          opacity: 0.45; cursor: not-allowed; transform: none; box-shadow: none;
        }
        .tr-spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.65s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .tr-divider {
          border: none; border-top: 1px solid #f0faf0; margin: 16px 0;
        }
      `}</style>

      <div className="tr-root">

        {/* Navbar */}
        <nav className="tr-nav">
          <Link href="/parent/dashboard" className="tr-nav-logo">
            <Image src="/pesasa-logo.png" alt="Pesasa" width={32} height={32} />
            <span className="tr-nav-logo-text">Pesasa</span>
          </Link>
          <Link href="/parent/dashboard" className="tr-back">
            ← Dashboard
          </Link>
        </nav>

        {/* Body */}
        <div className="tr-body">
          <div className="tr-wrap">

            {/* Wallet balance bar */}
            <div className="tr-balance-bar">
              <div>
                <div className="tr-balance-label">Your Wallet Balance</div>
                <div className="tr-balance-value">
                  UGX {walletBalance.toLocaleString()}
                </div>
                <div className="tr-balance-note">
                  Min. reserve (10%): UGX {Math.ceil(minReserve).toLocaleString()}
                </div>
              </div>
              <div style={{
                background: "rgba(255,255,255,0.12)",
                borderRadius: 12,
                padding: "10px 16px",
                textAlign: "center",
              }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 2 }}>Children</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#ffffff" }}>{dependants.length}</div>
              </div>
            </div>

            {/* Main card */}
            <div className="tr-card">
              <div className="tr-card-header">
                <h1 className="tr-card-title">Transfer to Child</h1>
                <p className="tr-card-sub">Move funds from your wallet to a child's spending account.</p>
              </div>

              <div className="tr-card-body">

                {/* Success state */}
                {result === "success" && (
                  <div className="tr-success">
                    <div className="tr-success-icon">✓</div>
                    <div>
                      <div className="tr-success-title">Transfer Successful!</div>
                      <div className="tr-success-sub">
                        UGX {numAmount > 0 ? numAmount.toLocaleString() : "—"} sent to{" "}
                        {selectedDep?.name ?? "child"}.
                      </div>
                    </div>
                  </div>
                )}

                {/* Error state */}
                {result === "error" && (
                  <div className="tr-error">
                    <span>⚠️</span> {errorMsg}
                  </div>
                )}

                {/* Step 1 — Select child */}
                <div className="tr-section">1 · Select Child</div>

                {dependants.length === 0 ? (
                  <div className="tr-no-children">
                    <p>No children added yet.</p>
                    <Link href="/parent/add-dependant" style={{
                      fontSize: 13, fontWeight: 600, color: "#3ab54a",
                      textDecoration: "none",
                    }}>
                      Add a child first →
                    </Link>
                  </div>
                ) : (
                  <div className="tr-child-grid">
                    {dependants.map((dep) => (
                      <button
                        key={dep._id}
                        type="button"
                        className={`tr-child-btn${selectedChild === dep._id ? " selected" : ""}`}
                        onClick={() => setSelectedChild(dep._id)}
                      >
                        <div className="tr-child-avatar">
                          {dep.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="tr-child-name">{dep.name}</div>
                          <div className="tr-child-bal">
                            UGX {(dep.balance || 0).toLocaleString()}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                <hr className="tr-divider" />

                {/* Step 2 — Amount */}
                <div className="tr-section">2 · Enter Amount (UGX)</div>

                <div className="tr-amount-wrap">
                  <span className="tr-amount-prefix">UGX</span>
                  <input
                    type="number"
                    className={`tr-amount-input${belowReserve ? " error-input" : ""}`}
                    placeholder="0"
                    value={amount}
                    min={0}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setResult(null);
                    }}
                  />
                </div>

                {/* Quick amounts */}
                <div className="tr-quick">
                  {quickAmounts.map((q) => (
                    <button
                      key={q}
                      type="button"
                      className={`tr-quick-btn${numAmount === q ? " active" : ""}`}
                      onClick={() => { setAmount(String(q)); setResult(null); }}
                    >
                      {(q / 1000).toFixed(0)}k
                    </button>
                  ))}
                </div>

                {/* Reserve warning */}
                {belowReserve && (
                  <div className="tr-reserve-warn">
                    <span>⚠️</span>
                    <span>
                      You must keep at least <strong>10%</strong> of your balance
                      (UGX {Math.ceil(minReserve).toLocaleString()}) in your wallet.
                      Max you can transfer: <strong>UGX {Math.floor(walletBalance * 0.9).toLocaleString()}</strong>.
                    </span>
                  </div>
                )}

                {/* Transfer preview */}
                {numAmount > 0 && selectedDep && !belowReserve && (
                  <div className="tr-preview">
                    <div className="tr-preview-row">
                      <span className="tr-preview-label">Sending to</span>
                      <span className="tr-preview-value">{selectedDep.name}</span>
                    </div>
                    <div className="tr-preview-row">
                      <span className="tr-preview-label">Amount</span>
                      <span className="tr-preview-value">UGX {numAmount.toLocaleString()}</span>
                    </div>
                    <hr className="tr-preview-divider" />
                    <div className="tr-preview-row">
                      <span className="tr-preview-label">Your balance after</span>
                      <span className={`tr-preview-value${afterBalance < minReserve * 1.5 ? " red" : " green"}`}>
                        UGX {afterBalance.toLocaleString()}
                      </span>
                    </div>
                    <div className="tr-preview-row">
                      <span className="tr-preview-label">{selectedDep.name}'s balance after</span>
                      <span className="tr-preview-value green">
                        UGX {((selectedDep.balance || 0) + numAmount).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="button"
                  className="tr-submit"
                  disabled={!canTransfer}
                  onClick={handleTransfer}
                >
                  {loading ? (
                    <><div className="tr-spinner" /> Processing…</>
                  ) : (
                    <>
                      Transfer
                      {selectedDep && numAmount > 0
                        ? ` UGX ${numAmount.toLocaleString()} to ${selectedDep.name}`
                        : ""
                      } →
                    </>
                  )}
                </button>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
