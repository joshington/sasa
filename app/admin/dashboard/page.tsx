

"use client";

import { useEffect, useState } from "react";

interface Stats {
  totalParents: number;
  totalDependants: number;
  totalMerchants: number;
  activeMerchants: number;
  totalTransactions: number;
  totalVolume: number;
  grossRevenue: number;
  merchantCommissions: number;
  netProfit: number;
}

interface MonthlyData {
  _id: string;
  revenue: number;
  volume: number;
  count: number;
}

interface RecentTx {
  _id: string;
  reference: string;
  type: string;
  status: string;
  amount: number;
  fee: number;
  timestamp: string;
  parentId?: { username: string; email: string };
  merchantId?: { username: string; institute: string };
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    maximumFractionDigits: 0,
  }).format(n);
}

function pct(n: number, total: number) {
  if (!total) return "0%";
  return ((n / total) * 100).toFixed(1) + "%";
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [monthly, setMonthly] = useState<MonthlyData[]>([]);
  const [recent, setRecent] = useState<RecentTx[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        setStats(d.stats);
        setMonthly(d.monthlyRevenue ?? []);
        setRecent(d.recentTransactions ?? []);
        setLoading(false);
      });
  }, []);

  const maxRevenue = Math.max(...monthly.map((m) => m.revenue), 1);

  return (
    <>
      <style>{`
        .db-grid { display: grid; gap: 16px; }
        .db-grid-4 { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
        .db-grid-3 { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
        .db-grid-2 { grid-template-columns: 1fr 1fr; }
        @media (max-width: 900px) { .db-grid-2 { grid-template-columns: 1fr; } }

        .db-heading {
          font-size: 24px;
          font-weight: 700;
          color: #f0f6fc;
          letter-spacing: -0.5px;
          margin-bottom: 4px;
        }
        .db-sub {
          font-size: 14px;
          color: #7d8590;
          margin-bottom: 28px;
        }

        .stat-card {
          background: #161b22;
          border: 1px solid #21262d;
          border-radius: 12px;
          padding: 20px;
          transition: border-color 0.2s;
        }
        .stat-card:hover { border-color: #30363d; }
        .stat-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #7d8590;
          margin-bottom: 10px;
        }
        .stat-value {
          font-size: 26px;
          font-weight: 700;
          color: #f0f6fc;
          letter-spacing: -0.5px;
          line-height: 1;
          margin-bottom: 6px;
        }
        .stat-sub {
          font-size: 12px;
          color: #484f58;
        }
        .stat-accent { color: #3ab54a; }
        .stat-warn { color: #f0a84a; }
        .stat-red { color: #f87171; }

        .revenue-card {
          background: linear-gradient(135deg, #1a2e1a 0%, #0f1f0f 100%);
          border: 1px solid rgba(58,181,74,0.2);
          border-radius: 12px;
          padding: 24px;
        }
        .revenue-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #3ab54a;
          margin-bottom: 10px;
        }
        .revenue-value {
          font-size: 32px;
          font-weight: 700;
          color: #f0f6fc;
          letter-spacing: -1px;
          margin-bottom: 6px;
        }
        .revenue-sub { font-size: 13px; color: #4d6b4d; }

        .section-title {
          font-size: 15px;
          font-weight: 600;
          color: #e6edf3;
          margin-bottom: 14px;
          padding-bottom: 10px;
          border-bottom: 1px solid #21262d;
        }

        .chart-card {
          background: #161b22;
          border: 1px solid #21262d;
          border-radius: 12px;
          padding: 24px;
        }

        .bar-chart {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          height: 120px;
          margin-top: 8px;
        }
        .bar-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          height: 100%;
          justify-content: flex-end;
        }
        .bar-fill {
          width: 100%;
          border-radius: 4px 4px 0 0;
          background: linear-gradient(to top, #2d8a2d, #3ab54a);
          min-height: 4px;
          transition: height 0.4s ease;
        }
        .bar-label {
          font-size: 10px;
          color: #484f58;
          text-align: center;
        }

        .tx-table {
          width: 100%;
          border-collapse: collapse;
        }
        .tx-table th {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #7d8590;
          padding: 8px 12px;
          text-align: left;
          border-bottom: 1px solid #21262d;
        }
        .tx-table td {
          font-size: 13px;
          color: #e6edf3;
          padding: 11px 12px;
          border-bottom: 1px solid #161b22;
        }
        .tx-table tr:last-child td { border-bottom: none; }
        .tx-table tr:hover td { background: rgba(255,255,255,0.02); }

        .badge-status {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
        }
        .badge-completed { background: rgba(58,181,74,0.1); color: #3ab54a; }
        .badge-pending   { background: rgba(240,168,74,0.1); color: #f0a84a; }
        .badge-failed    { background: rgba(248,113,113,0.1); color: #f87171; }
        .badge-withdraw  { background: rgba(99,102,241,0.1); color: #818cf8; }
        .badge-deposit   { background: rgba(34,211,238,0.1); color: #22d3ee; }

        .skeleton {
          background: linear-gradient(90deg, #161b22 25%, #1c2128 50%, #161b22 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 8px;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <h1 className="db-heading">Overview</h1>
      <p className="db-sub">
        {new Date().toLocaleDateString("en-UG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
      </p>

      {loading ? (
        <div className="db-grid db-grid-4" style={{ marginBottom: 24 }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 100 }} />
          ))}
        </div>
      ) : stats ? (
        <>
          {/* Revenue highlights */}
          <div className="db-grid db-grid-3" style={{ marginBottom: 16 }}>
            <div className="revenue-card">
              <div className="revenue-label">💰 Net Profit (2.5%)</div>
              <div className="revenue-value">{fmt(stats.netProfit)}</div>
              <div className="revenue-sub">Your share after merchant commissions</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Gross Revenue (3%)</div>
              <div className="stat-value stat-accent">{fmt(stats.grossRevenue)}</div>
              <div className="stat-sub">Total fees collected from withdrawals</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Merchant Commissions (0.5%)</div>
              <div className="stat-value stat-warn">{fmt(stats.merchantCommissions)}</div>
              <div className="stat-sub">{pct(stats.merchantCommissions, stats.grossRevenue)} of gross revenue</div>
            </div>
          </div>

          {/* Key stats */}
          <div className="db-grid db-grid-4" style={{ marginBottom: 28 }}>
            <div className="stat-card">
              <div className="stat-label">Total Volume</div>
              <div className="stat-value">{fmt(stats.totalVolume)}</div>
              <div className="stat-sub">{stats.totalTransactions} transactions</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Merchants</div>
              <div className="stat-value">{stats.totalMerchants}</div>
              <div className="stat-sub stat-accent">{stats.activeMerchants} active</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Parents</div>
              <div className="stat-value">{stats.totalParents}</div>
              <div className="stat-sub">Registered accounts</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Dependants</div>
              <div className="stat-value">{stats.totalDependants}</div>
              <div className="stat-sub">Avg {stats.totalParents ? (stats.totalDependants / stats.totalParents).toFixed(1) : 0} per parent</div>
            </div>
          </div>

          {/* Chart + Recent Transactions */}
          <div className="db-grid db-grid-2" style={{ gap: 16 }}>
            <div className="chart-card">
              <div className="section-title">Monthly Revenue</div>
              {monthly.length === 0 ? (
                <p style={{ fontSize: 13, color: "#484f58" }}>No data yet.</p>
              ) : (
                <div className="bar-chart">
                  {monthly.map((m) => (
                    <div key={m._id} className="bar-col">
                      <div
                        className="bar-fill"
                        style={{ height: `${(m.revenue / maxRevenue) * 100}%` }}
                        title={fmt(m.revenue)}
                      />
                      <div className="bar-label">{m._id.slice(5)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="chart-card">
              <div className="section-title">Recent Transactions</div>
              <div style={{ overflowX: "auto" }}>
                <table className="tx-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Fee</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((tx) => (
                      <tr key={tx._id}>
                        <td>
                          <span className={`badge-status badge-${tx.type}`}>{tx.type}</span>
                        </td>
                        <td>{fmt(tx.amount)}</td>
                        <td style={{ color: "#3ab54a" }}>{fmt(tx.fee)}</td>
                        <td>
                          <span className={`badge-status badge-${tx.status}`}>{tx.status}</span>
                        </td>
                      </tr>
                    ))}
                    {recent.length === 0 && (
                      <tr>
                        <td colSpan={4} style={{ color: "#484f58", textAlign: "center" }}>
                          No transactions yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p style={{ color: "#f87171" }}>Failed to load stats.</p>
      )}
    </>
  );
}