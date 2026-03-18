


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MerchantSignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phoneNo: "",
    institute: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/merchant/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }

      setDone(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <main style={styles.root}>
        <div style={styles.card}>
          <div style={styles.iconWrap}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#0f172a" />
              <path d="M7 12.5l3.5 3.5 6.5-7" stroke="#38bdf8" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 style={styles.heading}>Check your inbox</h1>
          <p style={styles.sub}>
            We sent an activation link to <strong>{form.email}</strong>.
            Click it to activate your merchant account.
          </p>
          <p style={styles.note}>The link expires in 24 hours.</p>
          <Link href="/merchant/signin" style={styles.link}>
            Back to sign in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.root}>
      <div style={styles.card}>
        {/* Brand */}
        <div style={styles.brand}>
          <span style={styles.brandDot} />
          <span style={styles.brandText}>
            Pesasa <span style={styles.brandAccent}>Merchant</span>
          </span>
        </div>

        <h1 style={styles.heading}>Create your account</h1>
        <p style={styles.sub}>
          Set up your merchant account to start accepting payments.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <Field
            label="Institute / School name"
            name="institute"
            type="text"
            placeholder="e.g. Greenfield Academy"
            value={form.institute}
            onChange={handleChange}
            required
          />
          <Field
            label="Email address"
            name="email"
            type="email"
            placeholder="you@school.com"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Field
            label="Phone number"
            name="phoneNo"
            type="tel"
            placeholder="+256 700 000 000"
            value={form.phoneNo}
            onChange={handleChange}
            required
          />
          <Field
            label="Password"
            name="password"
            type="password"
            placeholder="At least 8 characters"
            value={form.password}
            onChange={handleChange}
            required
          />
          <Field
            label="Confirm password"
            name="confirmPassword"
            type="password"
            placeholder="Repeat your password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? "Creating account…" : "Create account →"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link href="/merchant/signin" style={styles.link}>
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

// ── Small reusable field ─────────────────────────────────────────────────────
function Field({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  required,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div style={styles.fieldWrap}>
      <label style={styles.label}>{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        style={styles.input}
      />
    </div>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f8fafc",
    padding: "40px 16px",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "40px",
    width: "100%",
    maxWidth: "460px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "28px",
  },
  brandDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#0f172a",
  },
  brandText: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#0f172a",
    letterSpacing: "-0.3px",
  },
  brandAccent: {
    color: "#38bdf8",
  },
  heading: {
    margin: "0 0 6px",
    fontSize: "26px",
    fontWeight: 700,
    color: "#0f172a",
    letterSpacing: "-0.5px",
  },
  sub: {
    margin: "0 0 28px",
    fontSize: "14px",
    color: "#64748b",
    lineHeight: "1.5",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  fieldWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
  },
  input: {
    padding: "11px 14px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    color: "#0f172a",
    outline: "none",
    transition: "border-color 0.15s",
    background: "#fafafa",
  },
  btn: {
    marginTop: "4px",
    padding: "13px",
    background: "#0f172a",
    color: "#ffffff",
    border: "none",
    borderRadius: "9px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    letterSpacing: "0.1px",
  },
  error: {
    margin: "0",
    padding: "10px 14px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    fontSize: "13px",
    color: "#dc2626",
  },
  footer: {
    marginTop: "24px",
    textAlign: "center",
    fontSize: "13px",
    color: "#64748b",
  },
  link: {
    color: "#0f172a",
    fontWeight: 600,
    textDecoration: "none",
  },
  iconWrap: {
    marginBottom: "20px",
  },
  note: {
    fontSize: "13px",
    color: "#94a3b8",
    margin: "8px 0 24px",
  },
};