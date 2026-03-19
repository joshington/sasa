import { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <main style={{
        minHeight: "100vh", background: "#f0faf0", display: "flex",
        alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ color: "#2d8a2d", fontSize: "16px", fontWeight: 500 }}>
          Loading…
        </div>
      </main>
    }>
      <ResetPasswordClient />
    </Suspense>
  );
}
