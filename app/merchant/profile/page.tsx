

import { useEffect, useState } from "react";

interface MerchantProfile {
  username: string;
  email: string;
  phoneNo: string;
  institute: string;
  commissionBalance: number;
  settlementFrequency: string;
}

export default function MerchantProfile() {
  const [profile, setProfile] = useState<MerchantProfile | null>(null);

  useEffect(() => {
    fetch("/api/merchant/profile")
      .then((res) => res.json())
      .then((data) => setProfile(data));
  }, []);

  if (!profile) return <p className="p-8">Loading...</p>;

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Merchant Profile</h1>

      <div className="space-y-2">
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Phone:</strong> {profile.phoneNo}</p>
        <p><strong>Institute:</strong> {profile.institute}</p>
        <p><strong>Commission Balance:</strong> UGX {profile.commissionBalance}</p>
        <p><strong>Settlement Frequency:</strong> {profile.settlementFrequency}</p>
      </div>
    </div>
  );
}