"use client"

import { useState } from "react";

export default function DepositPage() {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleDeposit = async () => {
    if (Number(amount) < 5000) {
      setMessage("Minimum deposit is 5000 UGX");
      return;
    }

    const res = await fetch("/api/parent/deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(amount), parentId: "PARENT_ID_HERE" }),
    });

    const data = await res.json();
    setMessage(data.message || data.error);
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Deposit to Wallet</h1>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <button
        onClick={handleDeposit}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Deposit
      </button>
      {message && <p className="mt-2 text-green-600">{message}</p>}
    </div>
  );
}