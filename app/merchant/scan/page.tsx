

"use client";

import { useState } from "react";

export default function MerchantScanPage() {
  const [student, setStudent] = useState<any>(null);
  const [amount, setAmount] = useState("");

  const simulateScan = () => {
    // simulate QR scan result
    setStudent({
      id: "123",
      name: "John Doe",
      balance: 15000,
    });
  };

  const handlePayment = async () => {
    if (!student || !amount) return;

    const res = await fetch("/api/merchant/pay", {
      method: "POST",
      body: JSON.stringify({
        studentId: student.id,
        amount,
      }),
    });

    const data = await res.json();

    alert("Payment successful");

    setStudent(null);
    setAmount("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Merchant POS</h1>
        <p className="text-gray-500">
          Scan student QR and process payment
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">

        {/* QR SCANNER */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="text-xl font-semibold mb-4">
            Scan Student QR
          </h2>

          {/* Placeholder scanner */}
          <div className="border-2 border-dashed border-gray-300 h-64 flex items-center justify-center rounded-lg">
            <button
              onClick={simulateScan}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              Simulate QR Scan
            </button>
          </div>

        </div>

        {/* PAYMENT PANEL */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="text-xl font-semibold mb-4">
            Payment Details
          </h2>

          {!student ? (
            <p className="text-gray-500">
              Scan a student QR code to begin.
            </p>
          ) : (
            <div className="space-y-4">

              {/* Student Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold">{student.name}</p>
                <p className="text-sm text-gray-500">
                  Balance: UGX {student.balance.toLocaleString()}
                </p>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm mb-1">
                  Enter Amount
                </label>

                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="Enter amount"
                />
              </div>

              {/* Confirm Payment */}
              <button
                onClick={handlePayment}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold"
              >
                Confirm Payment
              </button>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}