

"use client";

import { useEffect, useState, useCallback } from "react";

interface Transaction {
  _id: string;
  reference: string;
  type: "withdraw" | "deposit";
  status: "completed" | "pending" | "failed";
  amount: number;
  fee: number;
  timestamp: string;
  parentId?: { username: string; email: string };
  dependantId?: { name: string; institute: string };
  merchantId?: { username: string; institute: string };
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX", maximumFractionDigits: 0 }).format(n);
}

export default function AdminTransactionsPage() {
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (typeFilter) params.set("type", typeFilter);
    if (statusFilter) params.set("status", statusFilter);
    fetch(`/api/admin/transactions?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setTxs(d.transactions ?? []);
        setTotal(d.total ?? 0);
        setPages(d.pages ?? 1);
        setLoading(false);
      });
  }, [page, typeFilter, statusFilter]);

  useEffect(() => { load(); }, [load]);

  return (
    <>
      <style>{`
        .tx-page-heading { font-size: 24px; font-weight: 700; color: #f0f6fc; letter-spacing: -0.5px; margin-bottom: 4px; }
        .tx-page-sub { font-size: 14px; color: #7d8590; margin-bottom: 24px; }

        .filters {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .filter-select {
          padding: 9px 14px;
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

        .card {
          background: #161b22;
          border: 1px solid #21262d;
          border-radius: 12px;
          overflow: hidden;
        }
        .card-header {
          padding: 16px 20px;
          border-bottom: 1px solid #21262d;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .card-header-title { font-size: 14px; font-weight: 600; color: #e6edf3; }
        .card-header-count { font-size: 13px; color: #7d8590; }

        .tx-table { width: 100%; border-collapse: collapse; }
        .tx-table th {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #7d8590;
          padding: 10px 16px;
          text-align: left;
          border-bottom: 1px solid #21262d;
          white-space: nowrap;
        }
        .tx-table td {
          font-size: 13px;
          color: #e6edf3;
          padding: 12px 16px;
          border-bottom: 1px solid #0d1117;
          vertical-align: middle;
        }
        .tx-table tr:last-child td { border-bottom: none; }
        .tx-table tr:hover td { background: rgba(255,255,255,0.02); }

        .ref-code {
          font-family: monospace;
          font-size: 11px;
          color: #7d8590;
          background: #0d1117;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
        }
        .b-completed { background: rgba(58,181,74,0.1); color: #3ab54a; }
        .b-pending   { background: rgba(240,168,74,0.1); color: #f0a84a; }
        .b-failed    { background: rgba(248,113,113,0.1); color: #f87171; }
        .b-withdraw  { background: rgba(99,102,241,0.1); color: #818cf8; }
        .b-deposit   { background: rgba(34,211,238,0.1); color: #22d3ee; }

        .pagination {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 20px;
          border-top: 1px solid #21262d;
          justify-content: flex-end;
        }
        .pg-btn {
          padding: 6px 14px;
          background: #0d1117;
          border: 1px solid #30363d;
          border-radius: 6px;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          color: #e6edf3;
          cursor: pointer;
          transition: border-color 0.15s;
        }
        .pg-btn:hover:not(:disabled) { border-color: #3ab54a; color: #3ab54a; }
        .pg-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .pg-info { font-size: 13px; color: #7d8590; }

        .skeleton {
          background: linear-gradient(90deg, #161b22 25%, #1c2128 50%, #161b22 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 4px;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        .fee-cell { color: #3ab54a; font-weight: 600; }
        .name-primary { font-weight: 500; color: #e6edf3; }
        .name-sub { font-size: 11px; color: #7d8590; margin-top: 1px; }
      `}</style>

      <h1 className="tx-page-heading">Transactions</h1>
      <p className="tx-page-sub">All transactions across the platform.</p>

      <div className="filters">
        <select
          className="filter-select"
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
        >
          <option value="">All types</option>
          <option value="withdraw">Withdraw</option>
          <option value="deposit">Deposit</option>
        </select>
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">All statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-header-title">All Transactions</span>
          <span className="card-header-count">{total} total</span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="tx-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Type</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Fee (3%)</th>
                <th>Parent</th>
                <th>Dependant</th>
                <th>Merchant</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(9)].map((__, j) => (
                      <td key={j}><div className="skeleton" style={{ height: 14, width: "80%" }} /></td>
                    ))}
                  </tr>
                ))
              ) : txs.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", color: "#484f58", padding: "40px" }}>
                    No transactions found.
                  </td>
                </tr>
              ) : txs.map((tx) => (
                <tr key={tx._id}>
                  <td><span className="ref-code">{tx.reference?.slice(0, 12)}…</span></td>
                  <td><span className={`badge b-${tx.type}`}>{tx.type}</span></td>
                  <td><span className={`badge b-${tx.status}`}>{tx.status}</span></td>
                  <td>{fmt(tx.amount)}</td>
                  <td className="fee-cell">{fmt(tx.fee)}</td>
                  <td>
                    <div className="name-primary">{tx.parentId?.username ?? "—"}</div>
                    <div className="name-sub">{tx.parentId?.email}</div>
                  </td>
                  <td>
                    <div className="name-primary">{tx.dependantId?.name ?? "—"}</div>
                    <div className="name-sub">{tx.dependantId?.institute}</div>
                  </td>
                  <td>
                    <div className="name-primary">{tx.merchantId?.username ?? "—"}</div>
                    <div className="name-sub">{tx.merchantId?.institute}</div>
                  </td>
                  <td style={{ color: "#7d8590", whiteSpace: "nowrap" }}>
                    {new Date(tx.timestamp).toLocaleDateString("en-UG")}
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