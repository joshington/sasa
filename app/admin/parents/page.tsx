

"use client";
import React from "react";

import { useEffect, useState, useCallback } from "react";

interface Dependant {
  _id: string;
  name: string;
  institute: string;
  balance: number;
  dailySpendLimit: number;
}

interface Parent {
  _id: string;
  username: string;
  email: string;
  phoneNo?: string;
  createdAt: string;
  dependants: Dependant[];
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX", maximumFractionDigits: 0 }).format(n);
}

export default function AdminParentsPage() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [total, setTotal] = useState(0);
  const [totalDependants, setTotalDependants] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`/api/admin/parents?page=${page}`)
      .then((r) => r.json())
      .then((d) => {
        setParents(d.parents ?? []);
        setTotal(d.total ?? 0);
        setTotalDependants(d.totalDependants ?? 0);
        setPages(d.pages ?? 1);
        setLoading(false);
      });
  }, [page]);

  useEffect(() => { load(); }, [load]);

  return (
    <>
      <style>{`
        .p-heading { font-size: 24px; font-weight: 700; color: #f0f6fc; letter-spacing: -0.5px; margin-bottom: 4px; }
        .p-sub { font-size: 14px; color: #7d8590; margin-bottom: 24px; }

        .p-summary {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 14px;
          margin-bottom: 24px;
        }
        .summary-card {
          background: #161b22;
          border: 1px solid #21262d;
          border-radius: 10px;
          padding: 18px;
        }
        .summary-label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #7d8590; margin-bottom: 8px; }
        .summary-value { font-size: 28px; font-weight: 700; color: #f0f6fc; letter-spacing: -0.5px; }
        .summary-accent { color: #3ab54a; }

        .card { background: #161b22; border: 1px solid #21262d; border-radius: 12px; overflow: hidden; }
        .card-header {
          padding: 16px 20px; border-bottom: 1px solid #21262d;
          display: flex; align-items: center; justify-content: space-between;
        }
        .card-header-title { font-size: 14px; font-weight: 600; color: #e6edf3; }
        .card-header-count { font-size: 13px; color: #7d8590; }

        .p-table { width: 100%; border-collapse: collapse; }
        .p-table th {
          font-size: 11px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.5px; color: #7d8590;
          padding: 10px 16px; text-align: left;
          border-bottom: 1px solid #21262d; white-space: nowrap;
        }
        .p-table td {
          font-size: 13px; color: #e6edf3;
          padding: 13px 16px; border-bottom: 1px solid #0d1117;
          vertical-align: middle;
        }
        .p-table tr.parent-row:hover td { background: rgba(255,255,255,0.02); cursor: pointer; }
        .p-table tr.dep-row td {
          background: rgba(13,17,23,0.6);
          font-size: 12px;
          color: #8b949e;
          padding: 8px 16px 8px 36px;
          border-bottom: 1px solid #0d1117;
        }
        .p-table tr.dep-row:last-of-type td { border-bottom: 1px solid #21262d; }

        .expand-icon { display: inline-block; transition: transform 0.2s; margin-right: 8px; color: #484f58; }
        .expand-icon.open { transform: rotate(90deg); }

        .name-primary { font-weight: 500; color: #e6edf3; }
        .name-sub { font-size: 11px; color: #7d8590; margin-top: 1px; }

        .dep-badge {
          display: inline-block; padding: 2px 8px;
          border-radius: 999px; font-size: 11px; font-weight: 600;
          background: rgba(58,181,74,0.1); color: #3ab54a;
        }

        .dep-name { font-weight: 600; color: #c9d1d9; }
        .dep-school { font-size: 11px; color: #484f58; }

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

      <h1 className="p-heading">Parents & Dependants</h1>
      <p className="p-sub">All registered parent accounts and their linked dependants.</p>

      <div className="p-summary">
        <div className="summary-card">
          <div className="summary-label">Total Parents</div>
          <div className="summary-value">{loading ? "—" : total}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Total Dependants</div>
          <div className="summary-value summary-accent">{loading ? "—" : totalDependants}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Avg Kids / Parent</div>
          <div className="summary-value">
            {loading || !total ? "—" : (totalDependants / total).toFixed(1)}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-header-title">Parent Accounts</span>
          <span className="card-header-count">{total} total · click a row to see dependants</span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="p-table">
            <thead>
              <tr>
                <th>Parent</th>
                <th>Phone</th>
                <th>Dependants</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i} className="parent-row">
                    {[...Array(4)].map((__, j) => (
                      <td key={j}><div className="skeleton" style={{ height: 14, width: "80%" }} /></td>
                    ))}
                  </tr>
                ))
              ) : parents.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", color: "#484f58", padding: "40px" }}>
                    No parents registered yet.
                  </td>
                </tr>
              ) : parents.map((p) => (
                <React.Fragment key={p._id}>
                  <tr
                    className="parent-row"
                    onClick={() => setExpanded(expanded === p._id ? null : p._id)}
                  >
                    <td>
                      <span className={`expand-icon${expanded === p._id ? " open" : ""}`}>▶</span>
                      <div className="name-primary" style={{ display: "inline" }}>{p.username}</div>
                      <div className="name-sub" style={{ paddingLeft: 20 }}>{p.email}</div>
                    </td>
                    <td style={{ color: "#7d8590" }}>{p.phoneNo || "—"}</td>
                    <td>
                      <span className="dep-badge">{p.dependants?.length ?? 0} kids</span>
                    </td>
                    <td style={{ color: "#7d8590", fontSize: 12 }}>
                      {new Date(p.createdAt).toLocaleDateString("en-UG")}
                    </td>
                  </tr>
                  {expanded === p._id && p.dependants?.map((d) => (
                    <tr key={d._id} className="dep-row">
                      <td>
                        <span className="dep-name">↳ {d.name}</span>
                        <span className="dep-school"> · {d.institute}</span>
                      </td>
                      <td colSpan={1}>Balance: <strong style={{ color: "#3ab54a" }}>{fmt(d.balance)}</strong></td>
                      <td colSpan={2}>Daily limit: {fmt(d.dailySpendLimit)}</td>
                    </tr>
                  ))}
                </React.Fragment>
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