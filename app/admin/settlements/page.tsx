

"use client";

import { useEffect, useState, useCallback } from "react";

interface Settlement {
  _id: string;
  amount: number;
  periodStart: string;
  periodEnd: string;
  status: "unpaid" | "paid";
  paidAt?: string;
  txHash?: string;
  transactionCount: number;
  createdAt: string;
  merchantId: {
    _id: string;
    username: string;
    email: string;
    institute: string;
    phoneNo: string;
  };
}

interface BatchResult {
  message: string;
  txHashes?: string[];
  paid?: number;
  skipped?: { noWallet: number; tooSoon: number; belowMin: number };
  reasons?: { noWallet: number; tooSoon: number; belowMin: number };
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-UG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function shortHash(hash: string) {
  return `${hash.slice(0, 10)}…${hash.slice(-6)}`;
}

export default function AdminSettlementsPage() {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const [generating, setGenerating] = useState(false);
  const [genMsg, setGenMsg] = useState("");

  const [batching, setBatching] = useState(false);
  const [batchResult, setBatchResult] = useState<BatchResult | null>(null);
  const [batchError, setBatchError] = useState("");

  const [payingId, setPayingId] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (statusFilter) params.set("status", statusFilter);
    fetch(`/api/admin/settlements?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setSettlements(d.settlements ?? []);
        setTotal(d.total ?? 0);
        setPages(d.pages ?? 1);
        setLoading(false);
      });
  }, [page, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const generateSettlements = async () => {
    setGenerating(true);
    setGenMsg("");
    setBatchResult(null);
    setBatchError("");
    const res = await fetch("/api/admin/settlements", { method: "POST" });
    const data = await res.json();
    setGenMsg(data.message);
    setGenerating(false);
    load();
  };

  const runBatchSettle = async () => {
    setBatching(true);
    setBatchResult(null);
    setBatchError("");
    setGenMsg("");
    const res = await fetch("/api/admin/settlements/batch", { method: "POST" });
    const data = await res.json();
    if (!res.ok) {
      setBatchError(data.error ?? "Batch settlement failed.");
    } else {
      setBatchResult(data);
      load();
    }
    setBatching(false);
  };

  const markPaid = async (settlementId: string) => {
    setPayingId(settlementId);
    await fetch("/api/admin/settlements", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settlementId }),
    });
    setPayingId(null);
    load();
  };

  const unpaidCount = settlements.filter((s) => s.status === "unpaid").length;
  const unpaidTotal = settlements
    .filter((s) => s.status === "unpaid")
    .reduce((acc, s) => acc + s.amount, 0);
  const paidTotal = settlements
    .filter((s) => s.status === "paid")
    .reduce((acc, s) => acc + s.amount, 0);

  const skipped = batchResult?.skipped ?? batchResult?.reasons;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Mono:wght@400;500&display=swap');

        .sp-root {
          font-family: 'DM Sans', sans-serif;
          color: #e6edf3;
        }

        /* ── Header ── */
        .sp-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 28px;
        }
        .sp-heading {
          font-size: 26px;
          font-weight: 700;
          color: #f0f6fc;
          letter-spacing: -0.6px;
          margin-bottom: 4px;
        }
        .sp-sub { font-size: 14px; color: #7d8590; }

        /* ── Summary cards ── */
        .sp-summary {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 12px;
          margin-bottom: 24px;
        }
        .sum-card {
          background: #161b22;
          border: 1px solid #21262d;
          border-radius: 10px;
          padding: 16px 18px;
          transition: border-color 0.2s;
        }
        .sum-card:hover { border-color: #30363d; }
        .sum-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: #7d8590;
          margin-bottom: 8px;
        }
        .sum-value {
          font-size: 22px;
          font-weight: 700;
          color: #f0f6fc;
          letter-spacing: -0.4px;
          line-height: 1;
        }
        .sum-accent { color: #3ab54a; }
        .sum-warn   { color: #f0a84a; }
        .sum-muted  { color: #7d8590; font-size: 12px; margin-top: 4px; }

        /* ── Outstanding banner ── */
        .outstanding-banner {
          background: linear-gradient(135deg, rgba(240,168,74,0.06), rgba(240,168,74,0.03));
          border: 1px solid rgba(240,168,74,0.22);
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        .ob-left { display: flex; align-items: center; gap: 14px; }
        .ob-icon {
          width: 40px; height: 40px;
          background: rgba(240,168,74,0.12);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; flex-shrink: 0;
        }
        .ob-label { font-size: 12px; font-weight: 600; color: #f0a84a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .ob-value { font-size: 22px; font-weight: 700; color: #f0f6fc; letter-spacing: -0.4px; }
        .ob-desc  { font-size: 13px; color: #484f58; }

        /* ── Controls row ── */
        .sp-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 16px;
        }
        .sp-filters { display: flex; gap: 8px; }
        .filter-select {
          padding: 8px 13px;
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 8px;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          color: #e6edf3;
          outline: none;
          cursor: pointer;
          transition: border-color 0.15s;
        }
        .filter-select:focus { border-color: #3ab54a; }

        .sp-btn-row { display: flex; gap: 8px; flex-wrap: wrap; }

        .btn-gen {
          padding: 9px 16px;
          background: #1c2128;
          border: 1px solid #30363d;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          color: #c9d1d9;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
          white-space: nowrap;
        }
        .btn-gen:hover:not(:disabled) { border-color: #3ab54a; color: #3ab54a; }
        .btn-gen:disabled { opacity: 0.45; cursor: not-allowed; }

        .btn-batch {
          padding: 9px 18px;
          background: linear-gradient(135deg, #1a5c1a, #2d8a2d, #3ab54a);
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          color: #ffffff;
          cursor: pointer;
          box-shadow: 0 2px 12px rgba(58,181,74,0.25);
          transition: opacity 0.18s, transform 0.15s, box-shadow 0.18s;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }
        .btn-batch:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 4px 18px rgba(58,181,74,0.35);
        }
        .btn-batch:disabled { opacity: 0.45; cursor: not-allowed; transform: none; box-shadow: none; }

        .spinner {
          width: 13px; height: 13px;
          border: 2px solid rgba(255,255,255,0.25);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.65s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Feedback boxes ── */
        .fb-box {
          border-radius: 10px;
          padding: 14px 18px;
          font-size: 13px;
          line-height: 1.6;
          margin-bottom: 16px;
          animation: fadeIn 0.25s ease;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }

        .fb-success {
          background: rgba(58,181,74,0.07);
          border: 1px solid rgba(58,181,74,0.22);
          color: #3ab54a;
        }
        .fb-error {
          background: rgba(248,113,113,0.07);
          border: 1px solid rgba(248,113,113,0.22);
          color: #f87171;
        }
        .fb-info {
          background: rgba(240,168,74,0.07);
          border: 1px solid rgba(240,168,74,0.22);
          color: #f0a84a;
        }
        .fb-title {
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Tx hashes */
        .tx-list { display: flex; flex-direction: column; gap: 5px; margin-top: 10px; }
        .tx-item {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0,0,0,0.25);
          border-radius: 6px;
          padding: 6px 10px;
        }
        .tx-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #3ab54a;
          flex-shrink: 0;
        }
        .tx-hash-text {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #7d8590;
          flex: 1;
          word-break: break-all;
        }
        .tx-link {
          font-size: 11px;
          color: #3ab54a;
          text-decoration: none;
          white-space: nowrap;
          font-weight: 600;
        }
        .tx-link:hover { text-decoration: underline; }

        /* Skipped pills */
        .skip-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid rgba(58,181,74,0.12);
        }
        .skip-label { font-size: 12px; color: #484f58; }
        .skip-pill {
          padding: 2px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          background: rgba(255,255,255,0.05);
          color: #7d8590;
          border: 1px solid #21262d;
        }

        /* ── Table card ── */
        .sp-card {
          background: #161b22;
          border: 1px solid #21262d;
          border-radius: 12px;
          overflow: hidden;
        }
        .sp-card-header {
          padding: 14px 20px;
          border-bottom: 1px solid #21262d;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .sp-card-title { font-size: 14px; font-weight: 600; color: #e6edf3; }
        .sp-card-count { font-size: 13px; color: #484f58; }

        .sp-table { width: 100%; border-collapse: collapse; }
        .sp-table th {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.7px;
          color: #484f58;
          padding: 10px 16px;
          text-align: left;
          border-bottom: 1px solid #21262d;
          white-space: nowrap;
          background: #0d1117;
        }
        .sp-table td {
          font-size: 13px;
          color: #c9d1d9;
          padding: 13px 16px;
          border-bottom: 1px solid #0d1117;
          vertical-align: middle;
        }
        .sp-table tr:last-child td { border-bottom: none; }
        .sp-table tr:hover td { background: rgba(255,255,255,0.018); }

        .merchant-name { font-weight: 600; color: #e6edf3; margin-bottom: 2px; }
        .merchant-meta { font-size: 11px; color: #484f58; }

        .period-text { font-size: 11px; color: #7d8590; font-family: 'DM Mono', monospace; }

        .amount-unpaid { font-weight: 700; color: #f0a84a; }
        .amount-paid   { font-weight: 700; color: #3ab54a; }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 9px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
        }
        .b-paid   { background: rgba(58,181,74,0.1); color: #3ab54a; border: 1px solid rgba(58,181,74,0.2); }
        .b-unpaid { background: rgba(240,168,74,0.1); color: #f0a84a; border: 1px solid rgba(240,168,74,0.2); }
        .badge-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

        .inline-hash {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: #484f58;
          margin-top: 3px;
        }
        .inline-hash a { color: #3ab54a; text-decoration: none; }
        .inline-hash a:hover { text-decoration: underline; }

        .pay-btn {
          padding: 5px 13px;
          background: rgba(58,181,74,0.08);
          border: 1px solid rgba(58,181,74,0.25);
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          color: #3ab54a;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
          white-space: nowrap;
        }
        .pay-btn:hover { background: rgba(58,181,74,0.15); border-color: rgba(58,181,74,0.4); }
        .pay-btn:disabled { opacity: 0.35; cursor: not-allowed; }

        .empty-state {
          padding: 56px 20px;
          text-align: center;
          color: #484f58;
        }
        .empty-icon { font-size: 32px; margin-bottom: 12px; }
        .empty-title { font-size: 15px; font-weight: 600; color: #7d8590; margin-bottom: 6px; }
        .empty-desc { font-size: 13px; line-height: 1.6; }

        /* ── Pagination ── */
        .sp-pagination {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          padding: 14px 20px;
          border-top: 1px solid #21262d;
        }
        .pg-btn {
          padding: 6px 14px;
          background: #0d1117;
          border: 1px solid #21262d;
          border-radius: 6px;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          color: #c9d1d9;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
        }
        .pg-btn:hover:not(:disabled) { border-color: #3ab54a; color: #3ab54a; }
        .pg-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .pg-info { font-size: 13px; color: #484f58; }

        /* ── Skeleton ── */
        .skeleton {
          background: linear-gradient(90deg, #161b22 25%, #1c2128 50%, #161b22 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 4px;
          height: 13px;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        /* ── Step guide ── */
        .step-guide {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .step-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #484f58;
        }
        .step-num {
          width: 20px; height: 20px;
          border-radius: 50%;
          background: #21262d;
          border: 1px solid #30363d;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px;
          font-weight: 700;
          color: #7d8590;
          flex-shrink: 0;
        }
        .step-arrow { color: #21262d; font-size: 14px; }
      `}</style>

      <div className="sp-root">
        {/* Header */}
        <div className="sp-header">
          <div>
            <h1 className="sp-heading">Settlements</h1>
            <p className="sp-sub">Weekly USDC commission payouts to merchants via Starknet.</p>
          </div>
        </div>

        {/* Summary cards */}
        <div className="sp-summary">
          <div className="sum-card">
            <div className="sum-label">Total Records</div>
            <div className="sum-value">{loading ? "—" : total}</div>
            <div className="sum-muted">all time</div>
          </div>
          <div className="sum-card">
            <div className="sum-label">Unpaid</div>
            <div className="sum-value sum-warn">{loading ? "—" : unpaidCount}</div>
            <div className="sum-muted">awaiting payout</div>
          </div>
          <div className="sum-card">
            <div className="sum-label">Outstanding</div>
            <div className="sum-value sum-warn">{loading ? "—" : fmt(unpaidTotal)}</div>
            <div className="sum-muted">owed to merchants</div>
          </div>
          <div className="sum-card">
            <div className="sum-label">Total Paid Out</div>
            <div className="sum-value sum-accent">{loading ? "—" : fmt(paidTotal)}</div>
            <div className="sum-muted">settled (this page)</div>
          </div>
        </div>

        {/* Outstanding banner */}
        {!loading && unpaidTotal > 0 && (
          <div className="outstanding-banner">
            <div className="ob-left">
              <div className="ob-icon">⚠️</div>
              <div>
                <div className="ob-label">Outstanding Settlements</div>
                <div className="ob-value">{fmt(unpaidTotal)}</div>
              </div>
            </div>
            <div className="ob-desc">
              {unpaidCount} merchant{unpaidCount !== 1 ? "s" : ""} on this page awaiting payout.
            </div>
          </div>
        )}

        {/* Step guide */}
        <div className="step-guide">
          <div className="step-item">
            <div className="step-num">1</div>
            <span>Generate settlement records from transactions</span>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-item">
            <div className="step-num">2</div>
            <span>Run batch USDC payout via Starknet</span>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-item">
            <div className="step-num">3</div>
            <span>Or manually mark individual settlements as paid</span>
          </div>
        </div>

        {/* Controls */}
        <div className="sp-controls">
          <div className="sp-filters">
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            >
              <option value="">All settlements</option>
              <option value="unpaid">Unpaid only</option>
              <option value="paid">Paid only</option>
            </select>
          </div>

          <div className="sp-btn-row">
            <button
              className="btn-gen"
              onClick={generateSettlements}
              disabled={generating}
            >
              {generating ? "Generating…" : "⚡ Generate Records"}
            </button>

            <button
              className="btn-batch"
              onClick={runBatchSettle}
              disabled={batching || unpaidCount === 0}
              title={unpaidCount === 0 ? "No unpaid settlements to process" : ""}
            >
              {batching ? (
                <><div className="spinner" /> Processing batch…</>
              ) : (
                <>💸 Run Batch Settlement {unpaidCount > 0 ? `(${unpaidCount})` : ""}</>
              )}
            </button>
          </div>
        </div>

        {/* Step 1 feedback */}
        {genMsg && (
          <div className="fb-box fb-info">
            <div className="fb-title">⚡ Records Generated</div>
            {genMsg}
          </div>
        )}

        {/* Step 2 error */}
        {batchError && (
          <div className="fb-box fb-error">
            <div className="fb-title">⚠️ Batch Failed</div>
            {batchError}
          </div>
        )}

        {/* Step 2 success */}
        {batchResult && (
          <div className="fb-box fb-success">
            <div className="fb-title">✓ Batch Settlement Complete</div>
            {batchResult.message}

            {/* Tx hashes */}
            {batchResult.txHashes && batchResult.txHashes.length > 0 && (
              <div className="tx-list">
                {batchResult.txHashes.map((hash) => (
                  <div key={hash} className="tx-item">
                    <div className="tx-dot" />
                    <span className="tx-hash-text">{shortHash(hash)}</span>
                    <a
                      href={`https://starkscan.co/tx/${hash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="tx-link"
                    >
                      View on Starkscan ↗
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* Skipped breakdown */}
            {skipped && (skipped.noWallet + skipped.tooSoon + skipped.belowMin) > 0 && (
              <div className="skip-row">
                <span className="skip-label">Skipped:</span>
                {skipped.noWallet > 0 && (
                  <span className="skip-pill">🔑 {skipped.noWallet} no wallet</span>
                )}
                {skipped.tooSoon > 0 && (
                  <span className="skip-pill">⏳ {skipped.tooSoon} too soon</span>
                )}
                {skipped.belowMin > 0 && (
                  <span className="skip-pill">📉 {skipped.belowMin} below 10k UGX</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Table */}
        <div className="sp-card">
          <div className="sp-card-header">
            <span className="sp-card-title">Settlement Records</span>
            <span className="sp-card-count">{total} total</span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="sp-table">
              <thead>
                <tr>
                  <th>Merchant</th>
                  <th>Institute</th>
                  <th>Period</th>
                  <th style={{ textAlign: "center" }}>Txns</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Paid At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(7)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(8)].map((__, j) => (
                        <td key={j}>
                          <div className="skeleton" style={{ width: j === 0 ? "70%" : "55%" }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : settlements.length === 0 ? (
                  <tr>
                    <td colSpan={8}>
                      <div className="empty-state">
                        <div className="empty-icon">💳</div>
                        <div className="empty-title">No settlements yet</div>
                        <div className="empty-desc">
                          Click <strong>Generate Records</strong> to create settlement
                          records from recent transactions,<br />
                          then <strong>Run Batch Settlement</strong> to pay merchants in USDC.
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  settlements.map((s) => (
                    <tr key={s._id}>
                      <td>
                        <div className="merchant-name">{s.merchantId?.username || "—"}</div>
                        <div className="merchant-meta">{s.merchantId?.email}</div>
                        <div className="merchant-meta">{s.merchantId?.phoneNo}</div>
                      </td>
                      <td style={{ color: "#7d8590" }}>{s.merchantId?.institute}</td>
                      <td>
                        <div className="period-text">{fmtDate(s.periodStart)}</div>
                        <div className="period-text">→ {fmtDate(s.periodEnd)}</div>
                      </td>
                      <td style={{ textAlign: "center", color: "#7d8590" }}>
                        {s.transactionCount}
                      </td>
                      <td>
                        <div className={s.status === "paid" ? "amount-paid" : "amount-unpaid"}>
                          {fmt(s.amount)}
                        </div>
                      </td>
                      <td>
                        <span className={`badge b-${s.status}`}>
                          <span className="badge-dot" />
                          {s.status}
                        </span>
                      </td>
                      <td>
                        {s.paidAt ? (
                          <>
                            <div style={{ color: "#7d8590", fontSize: 12 }}>
                              {fmtDate(s.paidAt)}
                            </div>
                            {s.txHash && (
                              <div className="inline-hash">
                                <a
                                  href={`https://starkscan.co/tx/${s.txHash}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {shortHash(s.txHash)} ↗
                                </a>
                              </div>
                            )}
                          </>
                        ) : (
                          <span style={{ color: "#30363d" }}>—</span>
                        )}
                      </td>
                      <td>
                        {s.status === "unpaid" && (
                          <button
                            className="pay-btn"
                            disabled={payingId === s._id}
                            onClick={() => markPaid(s._id)}
                          >
                            {payingId === s._id ? "…" : "Mark Paid ✓"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="sp-pagination">
            <button
              className="pg-btn"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Prev
            </button>
            <span className="pg-info">Page {page} of {pages}</span>
            <button
              className="pg-btn"
              disabled={page >= pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}