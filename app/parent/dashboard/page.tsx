

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Dependant {
  _id: string;
  name: string;
  balance: number;
}

interface Transaction {
  _id: string;
  dependantName: string;
  merchant: string;
  amount: number;
}

export default function ParentDashboard() {
  const [balance, setBalance] = useState(0);
  const [dependants, setDependants] = useState<Dependant[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetch("/api/parent/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setBalance(data.balance);
        setDependants(data.dependants);
        setTransactions(data.transactions || []);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Parent Dashboard</h1>
        <p className="text-gray-500">Control and monitor your children's spending</p>
      </div>

      {/* WALLET + ACTIONS */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">

        {/* Wallet Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow-lg col-span-2">
          <p className="text-sm opacity-80">Total Wallet Balance</p>
          <h2 className="text-4xl font-bold mt-2">
            UGX {balance.toLocaleString()}
          </h2>

          <div className="mt-6 flex gap-4">
            <Link href="/parent/deposit">
              <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold">
                Deposit
              </button>
            </Link>

            <Link href="/parent/transfer">
              <button className="border border-white px-4 py-2 rounded-lg">
                Transfer to Child
              </button>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-4 text-gray-700">Quick Actions</h3>

          <div className="flex flex-col gap-3">
            <Link href="/parent/add-dependant">
              <button className="bg-green-600 text-white py-2 rounded-lg w-full">
                Add Child
              </button>
            </Link>

            <Link href="/parent/create-pin">
              <button className="bg-gray-100 py-2 rounded-lg w-full">
                Change PIN
              </button>
            </Link>

            <Link href="/parent/transactions">
              <button className="bg-gray-100 py-2 rounded-lg w-full">
                View Transactions
              </button>
            </Link>
          </div>
        </div>

      </div>

      {/* DEPENDANTS */}
      <div className="bg-white rounded-xl shadow p-6 mb-10">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Your Dependants</h2>

          <Link href="/parent/add-dependant">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
              + Add Dependant
            </button>
          </Link>
        </div>

        {dependants.length === 0 ? (
          <p className="text-gray-500">
            No dependants yet. Add a child to start managing their spending.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {dependants.map((dep) => (
              <div
                key={dep._id}
                className="border rounded-lg p-4 hover:shadow-md transition"
              >
                <h3 className="font-semibold text-lg">{dep.name}</h3>

                <p className="text-gray-500 text-sm mt-1">
                  Balance
                </p>

                <p className="text-xl font-bold text-blue-600">
                  UGX {dep.balance.toLocaleString()}
                </p>

                <Link href={`/parent/dependant/${dep._id}`}>
                  <button className="mt-3 text-blue-600 hover:underline">
                    Manage
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* RECENT TRANSACTIONS */}
      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-2xl font-semibold mb-6">Recent Transactions</h2>

        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions yet.</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx._id}
                className="flex justify-between border-b pb-2"
              >
                <div>
                  <p className="font-medium">
                    {tx.dependantName}
                  </p>

                  <p className="text-sm text-gray-500">
                    {tx.merchant}
                  </p>
                </div>

                <p className="text-red-600 font-semibold">
                  - UGX {tx.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}