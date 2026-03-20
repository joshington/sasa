

"use client";

import { useEffect, useState, useCallback } from "react";

interface Settlement {
  _id: string;
  amount: number;
  periodStart: string;
  periodEnd: string;
  status: "unpaid" | "paid";
  paidAt?: string;
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

function fmt(n: number) {
  return new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX", maximumFractionDigits: 0 }).format(n);
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-UG", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminSettlementsPage() {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [genMsg, setGenMsg] = useState("");

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

  useEffect(() => { load(); }, [load]);

  const generateSettlements = async () => {
    setGenerating(true);
    setGenMsg("");
    const res = await fetch("/api/admin/settlements", { method: "POST" });
    const data = await res.json();
    setGenMsg(data.message);
    setGenerating(false);
    load();
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

  const unpaidTotal = settlements
    .filter((s) => s.status === "unpaid")
    .reduce((acc, s) => acc + s.amount, 0);

  return (
    <>
      <style>{`
        .s-heading { font-size: 24px; font-weight: 700; color: #f0f6fc; letter-spacing: -0.5px; margin-bottom: 4px; }
        .s-sub { font-size: 14px; color: #7d8590; margin-bottom: 24px; }

        .s-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 20px;
        }

        .unpaid-banner {
          background: rgba(240,168,74,0.08);
          border: 1px solid rgba(240,168,74,0.25);
          border-radius: 10px;
          padding: 14px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }
        .unpaid-label { font-size: 13px; color: #f0a84a; font-weight: 600; }
        .unpaid-value { font-size: 20px; font-weight: 700; color: #f0f6fc; }

        .filters { display: flex; gap: 10px; }
        .filter-select {
          padding: 9px 14px; background: #161b22; border: 1px solid #30363d;
          border-radius: 8px; font-size: 13px; font-family: 'DM Sans', sans-serif;
          color: #e6edf3; outline: none; cursor: pointer;
        }
        .filter-select:focus { border-color: #3ab54a; }

        .gen-btn {
          padding: 9px 18px;
          background: linear-gradient(135deg, #2d8a2d, #3ab54a);
          border: none; border-radius: 8px;
          font-size: 13px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          color: #ffffff; cursor: pointer;
          transition: opacity 0.18s;
        }
        .gen-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .gen-msg {
          padding: 10px 14px;
          background: rgba(58,181,74,0.08);
          border: 1px solid rgba(58,181,74,0.2);
          border-radius: 8px;
          font-size: 13px;
          color: #3ab54a;
          margin-bottom: 16px;
        }

        .card { background: #161b22; border: 1px solid #21262d; border-radius: 12px; overflow: hidden; }
        .card-header {
          padding: 16px 20px; border-bottom: 1px solid #21262d;
          display: flex; align-items: center; justify-content: space-between;
        }
        .card-header-title { font-size: 14px; font-weight: 600; color: #e6edf3; }
        .card-header-count { font-size: 13px; color: #7d8590; }

        .s-table { width: 100%; border-collapse: collapse; }
        .s-table th {
          font-size: 11px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.5px; color: #7d8590;
          padding: 10px 16px; text-align: left;
          border-bottom: 1px solid #21262d; white-space: nowrap;
        }
        .s-table td {
          font-size: 13px; color: #e6edf3;
          padding: 13px 16px; border-bottom: 1px solid #0d1117;
          vertical-align: middle;
        }
        .s-table tr:last-child td { border-bottom: none; }
        .s-table tr:hover td { background: rgba(255,255,255,0.02); }

        .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; }
        .b-paid   { background: rgba(58,181,74,0.1); color: #3ab54a; }
        .b-unpaid { background: rgba(240,168,74,0.1); color: #f0a84a; }

        .pay-btn {
          padding: 5px 14px;
          background: rgba(58,181,74,0.1);
          border: 1px solid rgba(58,181,74,0.3);
          border-radius: 6px;
          font-size: 12px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          color: #3ab54a; cursor: pointer;
          transition: background 0.15s;
        }
        .pay-btn:hover { background: rgba(58,181,74,0.2); }
        .pay-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .name-primary { font-weight: 500; color: #e6edf3; }
        .name-sub { font-size: 11px; color: #7d8590; margin-top: 1px; }
        .amount-cell { font-weight: 700; color: #f0a84a; }
        .amount-paid { font-weight: 700; color: #3ab54a; }

        .pagination {
          display: flex; align-items: center; gap: 8px;
          padding: 14px 20px; border-top: 1px solid #21262d;
          justify-content: flex-end;
        }
        .pg-btn {
          padding: 6px 14px; background: #0d1117;
          border: 1px solid #30363d; border-radius: 6px;
          font-size: 13px; font-family: 'DM Sans', sans-serif;
          color: #e6edf3; cursor: pointer;
        }
        .pg-btn:hover:not(:disabled) { border-color: #3ab54a; color: #3ab54a; }
        .pg-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .pg-info { font-size: 13px; color: #7d8590; }

        .skeleton {
          background: linear-gradient(90deg, #161b22 25%, #1c2128 50%, #161b22 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite; border-radius: 4px;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}</style>

      <h1 className="s-heading">Settlements</h1>
      <p className="s-sub">Manage weekly merchant commission payouts.</p>

      {unpaidTotal > 0 && (
        <div className="unpaid-banner">
          <div>
            <div className="unpaid-label">⚠️ Outstanding Settlements</div>
            <div className="unpaid-value">{fmt(unpaidTotal)}</div>
          </div>
          <div style={{ fontSize: 13, color: "#7d8590" }}>
            Total owed to merchants currently showing on this page.
          </div>
        </div>
      )}

      <div className="s-top">
        <div className="filters">
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
        <button className="gen-btn" onClick={generateSettlements} disabled={generating}>
          {generating ? "Generating…" : "⚡ Generate Weekly Settlements"}
        </button>
      </div>

      {genMsg && <div className="gen-msg">✓ {genMsg}</div>}

      <div className="card">
        <div className="card-header">
          <span className="card-header-title">Settlement Records</span>
          <span className="card-header-count">{total} total</span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="s-table">
            <thead>
              <tr>
                <th>Merchant</th>
                <th>Institute</th>
                <th>Period</th>
                <th>Transactions</th>
                <th>Amount Owed</th>
                <th>Status</th>
                <th>Paid At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(8)].map((__, j) => (
                      <td key={j}><div className="skeleton" style={{ height: 14, width: "80%" }} /></td>
                    ))}
                  </tr>
                ))
              ) : settlements.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", color: "#484f58", padding: "40px" }}>
                    No settlements yet. Click &quot;Generate Weekly Settlements&quot; to create them.
                  </td>
                </tr>
              ) : settlements.map((s) => (
                <tr key={s._id}>
                  <td>
                    <div className="name-primary">{s.merchantId?.username || "—"}</div>
                    <div className="name-sub">{s.merchantId?.email}</div>
                    <div className="name-sub">{s.merchantId?.phoneNo}</div>
                  </td>
                  <td>{s.merchantId?.institute}</td>
                  <td style={{ whiteSpace: "nowrap", color: "#7d8590", fontSize: 12 }}>
                    {fmtDate(s.periodStart)} → {fmtDate(s.periodEnd)}
                  </td>
                  <td style={{ textAlign: "center" }}>{s.transactionCount}</td>
                  <td className={s.status === "paid" ? "amount-paid" : "amount-cell"}>
                    {fmt(s.amount)}
                  </td>
                  <td><span className={`badge b-${s.status}`}>{s.status}</span></td>
                  <td style={{ color: "#7d8590", fontSize: 12 }}>
                    {s.paidAt ? fmtDate(s.paidAt) : "—"}
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
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button className="pg-btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
          <span className="pg-info">Page {page} of {pages}</span>
          <button className="pg-btn" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Next →</button>
        </div>
      </div>
    </>
  );
}