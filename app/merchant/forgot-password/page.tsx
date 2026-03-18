"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/merchant/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#f0faf0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif",
      padding: "24px",
    }}>
      <div style={{
        background: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(58,181,74,0.12)",
        overflow: "hidden",
        width: "100%",
        maxWidth: "440px",
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #1a5c1a 0%, #2d8a2d 50%, #3ab54a 100%)",
          padding: "32px 40px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
        }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "10px",
            background: "rgba(255,255,255,0.18)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "22px", fontWeight: 800, color: "#ffffff", flexShrink: 0,
          }}>P</div>
          <p style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.5px" }}>
            pesasa <span style={{ fontWeight: 400, opacity: 0.85 }}>merchant</span>
          </p>
        </div>

        <div style={{ padding: "40px" }}>
          {status === "sent" ? (
            <div>
              <div style={{
                width: "52px", height: "52px", borderRadius: "50%",
                background: "#f0faf0", border: "2px solid #3ab54a",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "20px", fontSize: "24px",
              }}>✉️</div>
              <h1 style={{ margin: "0 0 12px", fontSize: "22px", fontWeight: 700, color: "#1a5c1a", letterSpacing: "-0.5px" }}>
                Check your email
              </h1>
              <p style={{ margin: "0 0 28px", fontSize: "15px", lineHeight: 1.6, color: "#475569" }}>
                If <strong>{email}</strong> is registered, you'll receive a reset link shortly.
                It expires in <strong>1 hour</strong>.
              </p>
              <Link href="/merchant/signin" style={{ color: "#2d8a2d", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}>
                ← Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h1 style={{ margin: "0 0 8px", fontSize: "24px", fontWeight: 700, color: "#1a5c1a", letterSpacing: "-0.5px" }}>
                Forgot your password?
              </h1>
              <p style={{ margin: "0 0 28px", fontSize: "15px", lineHeight: 1.6, color: "#475569" }}>
                Enter your email and we'll send you a link to reset your password.
              </p>

              {status === "error" && (
                <div style={{
                  background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px",
                  padding: "12px 16px", marginBottom: "20px", fontSize: "14px", color: "#dc2626",
                }}>
                  {errorMsg}
                </div>
              )}

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#1a5c1a", marginBottom: "8px" }}>
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  onFocus={(e) => (e.target.style.borderColor = "#3ab54a")}
                  onBlur={(e) => (e.target.style.borderColor = "#d1fae5")}
                  style={{
                    width: "100%", padding: "12px 14px", fontSize: "15px",
                    border: "1.5px solid #d1fae5", borderRadius: "8px",
                    outline: "none", boxSizing: "border-box",
                    color: "#1a5c1a", background: "#f9fefb",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                style={{
                  width: "100%",
                  background: status === "loading" ? "#6db96d" : "linear-gradient(135deg, #2d8a2d, #3ab54a)",
                  color: "#ffffff", border: "none", padding: "14px",
                  borderRadius: "8px", fontSize: "15px", fontWeight: 600,
                  cursor: status === "loading" ? "not-allowed" : "pointer",
                  boxShadow: "0 2px 8px rgba(58,181,74,0.30)",
                }}
              >
                {status === "loading" ? "Sending…" : "Send Reset Link →"}
              </button>

              <div style={{ marginTop: "24px", textAlign: "center" }}>
                <Link href="/merchant/signin" style={{ fontSize: "14px", color: "#2d8a2d", textDecoration: "none", fontWeight: 500 }}>
                  ← Back to sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
