
"use client"

import { useState } from "react";

export default function AddDependant() {
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [institute, setInstitute] = useState("");
  const [daily, setDaily] = useState("");
  const [qr, setQr] = useState("");

  const handleSubmit = async () => {
    const res = await fetch("/api/parent/add-dependant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        parentId: "PARENT_ID_HERE", // Replace with session/real parent id
        name,
        pin,
        institute,
        spendLimit: { daily: Number(daily) },
      }),
    });
    const data = await res.json();
    if (data.qrDataURL) setQr(data.qrDataURL);
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Dependant</h1>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        placeholder="PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        placeholder="Institute"
        value={institute}
        onChange={(e) => setInstitute(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        placeholder="Daily Spend Limit"
        type="number"
        value={daily}
        onChange={(e) => setDaily(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 text-white py-2 rounded mb-4"
      >
        Add Dependant
      </button>

      {qr && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Dependant QR Code:</h2>
          <img src={qr} alt="QR Code" className="border p-2" />
        </div>
      )}
    </div>
  );
}