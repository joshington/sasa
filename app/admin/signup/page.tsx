

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminSignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", secret: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      return;
    }

    router.push("/admin/signin?created=true");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .setup-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0d1117;
          font-family: 'DM Sans', sans-serif;
          padding: 24px;
        }

        .setup-box { width: 100%; max-width: 400px; }

        .logo-row {
          display: flex; align-items: center; justify-content: center;
          gap: 12px; margin-bottom: 36px;
        }
        .logo-text { font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px; }
        .logo-text span { color: #3ab54a; font-weight: 500; }

        .warn-banner {
          background: rgba(240,168,74,0.08);
          border: 1px solid rgba(240,168,74,0.25);
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 13px;
          color: #f0a84a;
          margin-bottom: 20px;
          text-align: center;
        }

        .card {
          background: #161b22;
          border: 1px solid #21262d;
          border-radius: 16px;
          padding: 36px;
        }
        .card h1 { font-size: 22px; font-weight: 700; color: #f0f6fc; letter-spacing: -0.5px; margin-bottom: 6px; }
        .card p { font-size: 14px; color: #7d8590; margin-bottom: 28px; line-height: 1.5; }

        .field { margin-bottom: 16px; }
        .field label {
          display: block; font-size: 12px; font-weight: 600;
          color: #8b949e; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;
        }
        .input-wrap { position: relative; }
        .field input {
          width: 100%; padding: 12px 42px 12px 14px;
          background: #0d1117; border: 1px solid #30363d;
          border-radius: 8px; font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #f0f6fc; outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .field input:focus { border-color: #3ab54a; box-shadow: 0 0 0 3px rgba(58,181,74,0.15); }
        .toggle-pw {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          font-size: 14px; color: #7d8590; padding: 0;
        }

        .error-box {
          padding: 10px 14px;
          background: rgba(220,38,38,0.1); border: 1px solid rgba(220,38,38,0.3);
          border-radius: 8px; font-size: 13px; color: #f87171; margin-bottom: 16px;
        }

        .submit-btn {
          width: 100%; padding: 13px; margin-top: 8px;
          background: linear-gradient(135deg, #2d8a2d, #3ab54a);
          color: #ffffff; border: none; border-radius: 8px;
          font-size: 15px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; box-shadow: 0 2px 12px rgba(58,181,74,0.25);
          transition: opacity 0.18s;
        }
        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        .signin-link { margin-top: 20px; text-align: center; font-size: 13px; color: #484f58; }
        .signin-link a { color: #3ab54a; text-decoration: none; font-weight: 500; }
      `}</style>

      <div className="setup-root">
        <div className="setup-box">
          <div className="logo-row">
            <Image src="/pesasa-logo.png" alt="Pesasa" width={30} height={30} />
            <span className="logo-text">pesasa <span>admin</span></span>
          </div>

          <div className="warn-banner">
            ⚠️ One-time setup — run this once to create your admin account.
          </div>

          <div className="card">
            <h1>Create admin account</h1>
            <p>You&apos;ll need your setup secret key from your environment variables (<code>ADMIN_SETUP_SECRET</code>).</p>

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
                  />
                </div>
              </div>

              <div className="field">
                <label>Password</label>
                <div className="input-wrap">
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="Minimum 8 characters"
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                    required
                  />
                  <button type="button" className="toggle-pw" onClick={() => setShowPw((v) => !v)}>
                    {showPw ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div className="field">
                <label>Setup Secret</label>
                <div className="input-wrap">
                  <input
                    type="password"
                    placeholder="Your ADMIN_SETUP_SECRET"
                    value={form.secret}
                    onChange={(e) => setForm((p) => ({ ...p, secret: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {error && <div className="error-box">⚠️ {error}</div>}

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Creating account…" : "Create Admin Account →"}
              </button>
            </form>
          </div>

          <p className="signin-link">
            Already have an account? <a href="/admin/signin">Sign in</a>
          </p>
        </div>
      </div>
    </>
  );
}