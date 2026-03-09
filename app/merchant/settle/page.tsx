

import { useState } from "react";

export default function MerchantSettle() {
  const [frequency, setFrequency] = useState("daily");
  const [message, setMessage] = useState("");

  const handleSettle = async () => {
    const res = await fetch("/api/merchant/settle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ merchantId: "MERCHANT_ID_HERE", frequency }),
    });

    const data = await res.json();
    setMessage(data.message || data.error);
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Settle Commissions</h1>
      <select
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>
      <button
        onClick={handleSettle}
        className="w-full bg-purple-600 text-white py-2 rounded"
      >
        Settle
      </button>
      {message && <p className="mt-2 text-green-600">{message}</p>}
    </div>
  );
}