"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (!token) {
    return (
      <main style={{
        minHeight: "100vh", background: "#f0faf0", display: "flex",
        alignItems: "center", justifyContent: "center",
        fontFamily: "'Segoe UI', sans-serif", padding: "24px",
      }}>
        <div style={{
          background: "#ffffff", borderRadius: "16px",
          boxShadow: "0 4px 24px rgba(58,181,74,0.12)",
          overflow: "hidden", width: "100%", maxWidth: "440px",
        }}>
          <div style={{
            background: "linear-gradient(135deg, #1a5c1a 0%, #2d8a2d 50%, #3ab54a 100%)",
            padding: "32px 40px", display: "flex", alignItems: "center", gap: "14px",
          }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "10px",
              background: "rgba(255,255,255,0.18)", display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: "22px", fontWeight: 800, color: "#ffffff",
            }}>P</div>
            <p style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.5px" }}>
              pesasa <span style={{ fontWeight: 400, opacity: 0.85 }}>merchant</span>
            </p>
          </div>
          <div style={{ padding: "40px" }}>
            <h1 style={{ margin: "0 0 12px", fontSize: "22px", fontWeight: 700, color: "#dc2626" }}>
              Invalid link
            </h1>
            <p style={{ margin: "0 0 24px", fontSize: "15px", color: "#475569", lineHeight: 1.6 }}>
              This password reset link is missing or invalid. Please request a new one.
            </p>
            <Link href="/merchant/forgot-password" style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #2d8a2d, #3ab54a)",
              color: "#ffffff", textDecoration: "none", padding: "12px 24px",
              borderRadius: "8px", fontSize: "14px", fontWeight: 600,
              boxShadow: "0 2px 8px rgba(58,181,74,0.30)",
            }}>
              Request new link
            </Link>
          </div>
        </div>
      </main>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/merchant/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setTimeout(() => router.push("/merchant/signin?reset=true"), 2500);
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <main style={{
      minHeight: "100vh", background: "#f0faf0", display: "flex",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif", padding: "24px",
    }}>
      <div style={{
        background: "#ffffff", borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(58,181,74,0.12)",
        overflow: "hidden", width: "100%", maxWidth: "440px",
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #1a5c1a 0%, #2d8a2d 50%, #3ab54a 100%)",
          padding: "32px 40px", display: "flex", alignItems: "center", gap: "14px",
        }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "10px",
            background: "rgba(255,255,255,0.18)", display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: "22px", fontWeight: 800, color: "#ffffff", flexShrink: 0,
          }}>P</div>
          <p style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "#ffffff", letterSpacing: "-0.5px" }}>
            pesasa <span style={{ fontWeight: 400, opacity: 0.85 }}>merchant</span>
          </p>
        </div>

        <div style={{ padding: "40px" }}>
          {status === "success" ? (
            <div>
              <div style={{
                width: "52px", height: "52px", borderRadius: "50%",
                background: "#f0faf0", border: "2px solid #3ab54a",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "20px", fontSize: "24px",
              }}>✅</div>
              <h1 style={{ margin: "0 0 12px", fontSize: "22px", fontWeight: 700, color: "#1a5c1a", letterSpacing: "-0.5px" }}>
                Password reset!
              </h1>
              <p style={{ margin: 0, fontSize: "15px", lineHeight: 1.6, color: "#475569" }}>
                Your password has been updated. Redirecting you to sign in…
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h1 style={{ margin: "0 0 8px", fontSize: "24px", fontWeight: 700, color: "#1a5c1a", letterSpacing: "-0.5px" }}>
                Reset your password
              </h1>
              <p style={{ margin: "0 0 28px", fontSize: "15px", lineHeight: 1.6, color: "#475569" }}>
                Choose a strong new password for your account.
              </p>

              {(status === "error" || errorMsg) && (
                <div style={{
                  background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px",
                  padding: "12px 16px", marginBottom: "20px", fontSize: "14px", color: "#dc2626",
                }}>
                  {errorMsg}
                </div>
              )}

              {/* New Password */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#1a5c1a", marginBottom: "8px" }}>
                  New password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    required
                    onFocus={(e) => (e.target.style.borderColor = "#3ab54a")}
                    onBlur={(e) => (e.target.style.borderColor = "#d1fae5")}
                    style={{
                      width: "100%", padding: "12px 44px 12px 14px", fontSize: "15px",
                      border: "1.5px solid #d1fae5", borderRadius: "8px",
                      outline: "none", boxSizing: "border-box",
                      color: "#1a5c1a", background: "#f9fefb",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute", right: "12px", top: "50%",
                      transform: "translateY(-50%)", background: "none",
                      border: "none", cursor: "pointer", fontSize: "16px",
                      color: "#6db96d", padding: 0,
                    }}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "#1a5c1a", marginBottom: "8px" }}>
                  Confirm new password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  required
                  onFocus={(e) => (e.target.style.borderColor = "#3ab54a")}
                  onBlur={(e) => (e.target.style.borderColor = confirmPassword && confirmPassword !== password ? "#fca5a5" : "#d1fae5")}
                  style={{
                    width: "100%", padding: "12px 14px", fontSize: "15px",
                    border: `1.5px solid ${confirmPassword && confirmPassword !== password ? "#fca5a5" : "#d1fae5"}`,
                    borderRadius: "8px", outline: "none", boxSizing: "border-box",
                    color: "#1a5c1a", background: "#f9fefb",
                  }}
                />
                {confirmPassword && confirmPassword !== password && (
                  <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#dc2626" }}>
                    Passwords don't match
                  </p>
                )}
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
                {status === "loading" ? "Resetting…" : "Reset Password →"}
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
