
"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activated = searchParams.get("activated") === "true";
  const reset = searchParams.get("reset") === "true";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("merchant-credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    router.push("/merchant/dashboard");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .signin-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background: #f7fdf7;
        }

        /* ── Left panel ── */
        .signin-left {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 420px;
          flex-shrink: 0;
          background: linear-gradient(160deg, #1a5c1a 0%, #2d8a2d 55%, #3ab54a 100%);
          padding: 48px 44px;
          position: relative;
          overflow: hidden;
        }

        @media (min-width: 900px) {
          .signin-left { display: flex; }
        }

        .signin-left::before {
          content: '';
          position: absolute;
          top: -120px; right: -120px;
          width: 380px; height: 380px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
        }
        .signin-left::after {
          content: '';
          position: absolute;
          bottom: -80px; left: -80px;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
        }

        .left-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          z-index: 1;
        }
        .left-logo-text {
          font-size: 22px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.4px;
        }
        .left-logo-text span {
          font-weight: 400;
          opacity: 0.75;
        }

        .left-body {
          position: relative;
          z-index: 1;
        }
        .left-tagline {
          font-family: 'DM Serif Display', serif;
          font-size: 34px;
          line-height: 1.25;
          color: #ffffff;
          margin-bottom: 16px;
        }
        .left-tagline em {
          font-style: normal;
          color: #a8f0b4;
        }
        .left-desc {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(255,255,255,0.72);
        }

        .left-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          position: relative;
          z-index: 1;
        }
        .pill {
          padding: 7px 14px;
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.22);
          border-radius: 999px;
          font-size: 12px;
          font-weight: 500;
          color: #ffffff;
          backdrop-filter: blur(4px);
        }

        /* ── Right panel ── */
        .signin-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }

        .signin-card {
          width: 100%;
          max-width: 420px;
        }

        /* Mobile logo */
        .mobile-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 36px;
        }
        @media (min-width: 900px) {
          .mobile-logo { display: none; }
        }
        .mobile-logo-text {
          font-size: 20px;
          font-weight: 700;
          color: #1a5c1a;
          letter-spacing: -0.4px;
        }
        .mobile-logo-text span {
          color: #3ab54a;
          font-weight: 500;
        }

        .card-heading {
          font-size: 28px;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.6px;
          margin-bottom: 6px;
        }
        .card-sub {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 28px;
          line-height: 1.5;
        }

        .banner {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 20px;
        }
        .banner-success {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #15803d;
        }
        .banner-info {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #1d4ed8;
        }

        .field {
          margin-bottom: 16px;
        }
        .field label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 7px;
        }
        .input-wrap {
          position: relative;
        }
        .field input {
          width: 100%;
          padding: 12px 44px 12px 14px;
          border: 1.5px solid #d1d5db;
          border-radius: 10px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #111827;
          background: #ffffff;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .field input:focus {
          border-color: #3ab54a;
          box-shadow: 0 0 0 3px rgba(58,181,74,0.12);
        }
        .toggle-pw {
          position: absolute;
          right: 13px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 15px;
          color: #9ca3af;
          padding: 0;
          line-height: 1;
          transition: color 0.15s;
        }
        .toggle-pw:hover { color: #3ab54a; }

        .forgot-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 6px;
        }
        .forgot-link {
          font-size: 12px;
          font-weight: 500;
          color: #3ab54a;
          text-decoration: none;
        }
        .forgot-link:hover { text-decoration: underline; }

        .error-box {
          padding: 11px 14px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          font-size: 13px;
          color: #dc2626;
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
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          letter-spacing: 0.1px;
          box-shadow: 0 2px 12px rgba(58,181,74,0.35);
          transition: opacity 0.18s, transform 0.15s, box-shadow 0.18s;
        }
        .submit-btn:hover:not(:disabled) {
          opacity: 0.93;
          transform: translateY(-1px);
          box-shadow: 0 4px 18px rgba(58,181,74,0.40);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
          color: #d1d5db;
          font-size: 12px;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e5e7eb;
        }

        .footer-links {
          text-align: center;
          font-size: 13px;
          color: #6b7280;
        }
        .footer-links a {
          color: #2d8a2d;
          font-weight: 600;
          text-decoration: none;
        }
        .footer-links a:hover { text-decoration: underline; }
        .footer-links .separator {
          margin: 0 10px;
          color: #d1d5db;
        }
      `}</style>

      <div className="signin-root">
        {/* ── Left decorative panel ── */}
        <div className="signin-left">
          <div className="left-logo">
            <Image
              src="/pesasa-logo.png"
              alt="Pesasa"
              width={36}
              height={36}
              style={{ borderRadius: 8, background: "rgba(255,255,255,0.15)", padding: 4 }}
            />
            <span className="left-logo-text">
              pesasa <span>merchant</span>
            </span>
          </div>

          <div className="left-body">
            <p className="left-tagline">
              Grow your business<br />with <em>smarter</em> payments.
            </p>
            <p className="left-desc">
              Accept school fee payments, track transactions, and manage your merchant account all in one place.
            </p>
          </div>

          <div className="left-pills">
            <span className="pill">✓ Real-time settlements</span>
            <span className="pill">✓ Secure & encrypted</span>
            <span className="pill">✓ 24/7 support</span>
            <span className="pill">✓ Instant notifications</span>
          </div>
        </div>

        {/* ── Right sign-in panel ── */}
        <div className="signin-right">
          <div className="signin-card">

            {/* Mobile logo */}
            <div className="mobile-logo">
              <Image
                src="/pesasa-logo.png"
                alt="Pesasa"
                width={32}
                height={32}
              />
              <span className="mobile-logo-text">
                pesasa <span>merchant</span>
              </span>
            </div>

            <h1 className="card-heading">Welcome back</h1>
            <p className="card-sub">Sign in to your merchant account to continue.</p>

            {activated && (
              <div className="banner banner-success">
                🎉 Account activated! You can now sign in.
              </div>
            )}
            {reset && (
              <div className="banner banner-info">
                ✅ Password updated! Please sign in with your new password.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="email">Email address</label>
                <div className="input-wrap">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="password">Password</label>
                <div className="input-wrap">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="toggle-pw"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                <div className="forgot-row">
                  <Link href="/merchant/forgot-password" className="forgot-link">
                    Forgot password?
                  </Link>
                </div>
              </div>

              {error && (
                <div className="error-box">
                  <span>⚠️</span> {error}
                </div>
              )}

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Signing in…" : "Sign in →"}
              </button>
            </form>

            <div className="divider">or</div>

            <div className="footer-links">
              Don&apos;t have an account?{" "}
              <Link href="/merchant/signup">Create one</Link>
              <span className="separator">|</span>
              <Link href="/">Back to home</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function MerchantSignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
