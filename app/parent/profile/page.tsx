
"use client"

import { useState } from "react";

export default function ParentProfile() {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [message, setMessage] = useState("");

  const handleSetPin = async () => {
    if (pin !== confirmPin) {
      setMessage("PINs do not match!");
      return;
    }

    const res = await fetch("/api/parent/set-pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin, parentId: "PARENT_ID_HERE" }), // Replace with session ID
    });

    const data = await res.json();
    setMessage(data.message || data.error);
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Set Your PIN</h1>
      <input
        type="password"
        placeholder="Enter PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Confirm PIN"
        value={confirmPin}
        onChange={(e) => setConfirmPin(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <button
        onClick={handleSetPin}
        className="w-full bg-blue-600 text-white py-2 rounded mt-2"
      >
        Set PIN
      </button>
      {message && <p className="mt-2 text-red-600">{message}</p>}
    </div>
  );
}