


import { useState } from "react";

export default function Withdraw() {
  const [merchantId, setMerchantId] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");

  const handleWithdraw = async () => {
    const res = await fetch("/api/dependant/withdraw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ smartCardId: "SMARTCARD_ID_HERE", merchantId, amount: Number(amount), pin }),
    });
    const data = await res.json();
    setMessage(data.message || data.error);
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Withdraw</h1>
      <input
        placeholder="Merchant ID"
        value={merchantId}
        onChange={(e) => setMerchantId(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
        type="number"
      />
      <input
        placeholder="PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <button onClick={handleWithdraw} className="w-full bg-green-600 text-white py-2 rounded">
        Withdraw
      </button>
      {message && <p className="mt-2 text-red-600">{message}</p>}
    </div>
  );
}