

"use client";

import { useEffect, useState, useCallback } from "react";

interface Merchant {
  _id: string;
  username: string;
  email: string;
  phoneNo: string;
  institute: string;
  status: "pending" | "active" | "suspended";
  commissionBalance: number;
  settlementFrequency: string;
  lastSettlementDate?: string;
  createdAt: string;
  totalVolume: number;
  totalEarned: number;
  txCount: number;
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX", maximumFractionDigits: 0 }).format(n);
}

export default function AdminMerchantsPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (statusFilter) params.set("status", statusFilter);
    fetch(`/api/admin/merchants?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setMerchants(d.merchants ?? []);
        setTotal(d.total ?? 0);
        setPages(d.pages ?? 1);
        setLoading(false);
      });
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const toggleStatus = async (merchantId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    setActionLoading(merchantId);
    await fetch("/api/admin/merchants", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ merchantId, status: newStatus }),
    });
    setActionLoading(null);
    load();
  };

  return (
    <>
      <style>{`
        .m-heading { font-size: 24px; font-weight: 700; color: #f0f6fc; letter-spacing: -0.5px; margin-bottom: 4px; }
        .m-sub { font-size: 14px; color: #7d8590; margin-bottom: 24px; }

        .filters { display: flex; gap: 10px; margin-bottom: 20px; }
        .filter-select {
          padding: 9px 14px;
          background: #161b22; border: 1px solid #30363d;
          border-radius: 8px; font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          color: #e6edf3; outline: none; cursor: pointer;
        }
        .filter-select:focus { border-color: #3ab54a; }

        .card { background: #161b22; border: 1px solid #21262d; border-radius: 12px; overflow: hidden; }
        .card-header {
          padding: 16px 20px; border-bottom: 1px solid #21262d;
          display: flex; align-items: center; justify-content: space-between;
        }
        .card-header-title { font-size: 14px; font-weight: 600; color: #e6edf3; }
        .card-header-count { font-size: 13px; color: #7d8590; }

        .m-table { width: 100%; border-collapse: collapse; }
        .m-table th {
          font-size: 11px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.5px; color: #7d8590;
          padding: 10px 16px; text-align: left;
          border-bottom: 1px solid #21262d; white-space: nowrap;
        }
        .m-table td {
          font-size: 13px; color: #e6edf3;
          padding: 13px 16px; border-bottom: 1px solid #0d1117;
          vertical-align: middle;
        }
        .m-table tr:last-child td { border-bottom: none; }
        .m-table tr:hover td { background: rgba(255,255,255,0.02); }

        .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; }
        .b-active    { background: rgba(58,181,74,0.1); color: #3ab54a; }
        .b-pending   { background: rgba(240,168,74,0.1); color: #f0a84a; }
        .b-suspended { background: rgba(248,113,113,0.1); color: #f87171; }

        .toggle-btn {
          padding: 5px 12px;
          border-radius: 6px;
          border: 1px solid;
          font-size: 12px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .toggle-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-suspend {
          background: rgba(248,113,113,0.08);
          border-color: rgba(248,113,113,0.3);
          color: #f87171;
        }
        .btn-activate {
          background: rgba(58,181,74,0.08);
          border-color: rgba(58,181,74,0.3);
          color: #3ab54a;
        }

        .earned { color: #3ab54a; font-weight: 600; }
        .balance-warn { color: #f0a84a; }

        .name-primary { font-weight: 500; color: #e6edf3; }
        .name-sub { font-size: 11px; color: #7d8590; margin-top: 1px; }

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

      <h1 className="m-heading">Merchants</h1>
      <p className="m-sub">{total} registered merchants on the platform.</p>

      <div className="filters">
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-header-title">All Merchants</span>
          <span className="card-header-count">{total} total</span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="m-table">
            <thead>
              <tr>
                <th>Merchant</th>
                <th>Institute</th>
                <th>Status</th>
                <th>Total Volume</th>
                <th>Total Earned (0.5%)</th>
                <th>Commission Balance</th>
                <th>Transactions</th>
                <th>Joined</th>
                <th>Action</th>
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
              ) : merchants.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", color: "#484f58", padding: "40px" }}>
                    No merchants found.
                  </td>
                </tr>
              ) : merchants.map((m) => (
                <tr key={m._id}>
                  <td>
                    <div className="name-primary">{m.username || "—"}</div>
                    <div className="name-sub">{m.email}</div>
                    <div className="name-sub">{m.phoneNo}</div>
                  </td>
                  <td>{m.institute}</td>
                  <td><span className={`badge b-${m.status}`}>{m.status}</span></td>
                  <td>{fmt(m.totalVolume)}</td>
                  <td className="earned">{fmt(m.totalEarned)}</td>
                  <td className={m.commissionBalance > 0 ? "balance-warn" : ""}>{fmt(m.commissionBalance)}</td>
                  <td>{m.txCount}</td>
                  <td style={{ color: "#7d8590", whiteSpace: "nowrap" }}>
                    {new Date(m.createdAt).toLocaleDateString("en-UG")}
                  </td>
                  <td>
                    {m.status !== "pending" && (
                      <button
                        className={`toggle-btn ${m.status === "active" ? "btn-suspend" : "btn-activate"}`}
                        disabled={actionLoading === m._id}
                        onClick={() => toggleStatus(m._id, m.status)}
                      >
                        {actionLoading === m._id ? "…" : m.status === "active" ? "Suspend" : "Activate"}
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