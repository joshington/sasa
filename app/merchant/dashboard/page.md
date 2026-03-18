

"use client";

import { useEffect, useState } from "react";

interface Transaction {
  _id: string;
  amount: number;
  dependantName: string;
  timestamp: string;
}

export default function MerchantDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [commissionBalance, setCommissionBalance] = useState(0);

  useEffect(() => {
    fetch("/api/merchant/transactions")
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data.transactions || []);
        setCommissionBalance(data.commissionBalance || 0);
      });
  }, []);

  const totalSales = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800">
          Merchant Dashboard
        </h1>
        <p className="text-gray-500">
          Monitor student purchases and earnings
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">

        {/* Commission Balance */}
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Commission Balance</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">
            UGX {commissionBalance.toLocaleString()}
          </h2>
        </div>

        {/* Total Sales */}
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Sales</p>
          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            UGX {totalSales.toLocaleString()}
          </h2>
        </div>

        {/* Transactions Count */}
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Transactions</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            {transactions.length}
          </h2>
        </div>

      </div>

      {/* TRANSACTION TABLE */}
      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-2xl font-semibold mb-6">
          Recent Transactions
        </h2>

        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions yet.</p>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>
                <tr className="border-b text-gray-500 text-sm">
                  <th className="py-3">Student</th>
                  <th className="py-3">Amount</th>
                  <th className="py-3">Date</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((txn) => (
                  <tr
                    key={txn._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-3 font-medium">
                      {txn.dependantName}
                    </td>

                    <td className="py-3 text-blue-600 font-semibold">
                      UGX {txn.amount.toLocaleString()}
                    </td>

                    <td className="py-3 text-gray-500">
                      {new Date(txn.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}
      </div>

    </div>
  );
}