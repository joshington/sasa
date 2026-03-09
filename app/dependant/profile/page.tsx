
"use client";

import { useEffect, useState } from "react";

interface DependantProfile {
  name: string;
  smartCardId: string;
  balance: number;
  spendLimit: { daily?: number; weekly?: number; monthly?: number };
  institute: string;
  parentName: string;
  qrDataURL: string;
}

export default function DependantProfile() {
  const [profile, setProfile] = useState<DependantProfile | null>(null);

  useEffect(() => {
    fetch("/api/dependant/profile")
      .then((res) => res.json())
      .then((data) => setProfile(data));
  }, []);

  if (!profile) return <p className="p-8">Loading...</p>;

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dependant Profile</h1>

      <div className="mb-4">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Institute:</strong> {profile.institute}</p>
        <p><strong>Parent:</strong> {profile.parentName}</p>
        <p><strong>Balance:</strong> UGX {profile.balance}</p>
        <p>
          <strong>Spend Limits:</strong> Daily: {profile.spendLimit.daily || "-"} | Weekly: {profile.spendLimit.weekly || "-"} | Monthly: {profile.spendLimit.monthly || "-"}
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Smart Card QR</h2>
        <img src={profile.qrDataURL} alt="Smart Card QR" className="border p-2" />
      </div>
    </div>
  );
}