

"use client";

import { useState } from "react";
//import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminSignInPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    //dont use the signIN from nextauth coz it calls the merchant auth instead
    //call the admin nextauth instance directly
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers:  { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, password: form.password }),
    });

    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Invalid email or password.");
      return;
    }
    {/*
        if (data.error || !data.url) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/admin/dashboard");

    const result = await signIn("admin-credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
      callbackUrl: "/admin/dashboard",
    });
      
      if (!result?.error) {
        router.push("/admin/dashboard");
    }

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

      
    */}

    

    // Don't rely on NextAuth to redirect — always do it yourself
    //goes straight to dashboard, no NextAuth interference
    router.push("/admin/dashboard");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .admin-signin {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0d1117;
          font-family: 'DM Sans', sans-serif;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        .admin-signin::before {
          content: '';
          position: absolute;
          top: -200px; left: 50%;
          transform: translateX(-50%);
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(58,181,74,0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        .signin-box {
          width: 100%;
          max-width: 400px;
          position: relative;
          z-index: 1;
        }

        .logo-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 36px;
        }
        .logo-label {
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.3px;
        }
        .logo-label span {
          color: #3ab54a;
          font-weight: 500;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(58,181,74,0.1);
          border: 1px solid rgba(58,181,74,0.25);
          border-radius: 999px;
          padding: 4px 12px;
          font-size: 11px;
          font-weight: 600;
          color: #3ab54a;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 20px;
        }
        .badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #3ab54a;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .card {
          background: #161b22;
          border: 1px solid #21262d;
          border-radius: 16px;
          padding: 36px;
        }

        .card h1 {
          font-size: 24px;
          font-weight: 700;
          color: #f0f6fc;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }
        .card p {
          font-size: 14px;
          color: #7d8590;
          margin-bottom: 28px;
          line-height: 1.5;
        }

        .field { margin-bottom: 16px; }
        .field label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #8b949e;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }
        .input-wrap { position: relative; }
        .field input {
          width: 100%;
          padding: 12px 42px 12px 14px;
          background: #0d1117;
          border: 1px solid #30363d;
          border-radius: 8px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #f0f6fc;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .field input:focus {
          border-color: #3ab54a;
          box-shadow: 0 0 0 3px rgba(58,181,74,0.15);
        }
        .toggle-pw {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          font-size: 14px; color: #7d8590; padding: 0;
          transition: color 0.15s;
        }
        .toggle-pw:hover { color: #3ab54a; }

        .error-box {
          padding: 10px 14px;
          background: rgba(220,38,38,0.1);
          border: 1px solid rgba(220,38,38,0.3);
          border-radius: 8px;
          font-size: 13px;
          color: #f87171;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .submit-btn {
          width: 100%;
          padding: 13px;
          margin-top: 8px;
          background: linear-gradient(135deg, #2d8a2d, #3ab54a);
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          box-shadow: 0 2px 12px rgba(58,181,74,0.25);
          transition: opacity 0.18s, transform 0.15s;
        }
        .submit-btn:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        .footer-note {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
          color: #484f58;
        }
      `}</style>

      <div className="admin-signin">
        <div className="signin-box">
          <div className="logo-row">
            <Image src="/pesasa-logo.png" alt="Pesasa" width={30} height={30} />
            <span className="logo-label">pesasa <span>admin</span></span>
          </div>

          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <span className="badge">
              <span className="badge-dot" />
              Admin Portal
            </span>
          </div>

          <div className="card">
            <h1>Sign in</h1>
            <p>Access the Pesasa admin dashboard.</p>

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Email address</label>
                <div className="input-wrap">
                  <input
                    type="email"
                    placeholder="admin@pesasa.xyz"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="field">
                <label>Password</label>
                <div className="input-wrap">
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                    required
                    autoComplete="current-password"
                  />
                  <button type="button" className="toggle-pw" onClick={() => setShowPw((v) => !v)}>
                    {showPw ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {error && <div className="error-box"><span>⚠️</span>{error}</div>}

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Signing in…" : "Sign in →"}
              </button>
            </form>
          </div>

          <p className="footer-note">Restricted access — authorised personnel only.</p>
        </div>
      </div>
    </>
  );
}