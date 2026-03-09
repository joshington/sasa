

import { useEffect, useState } from "react";

interface Transaction {
  _id: string;
  amount: number;
  type: string;
  timestamp: string;
}

export default function DependantDashboard() {
  const [balance, setBalance] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetch("/api/dependant/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setBalance(data.balance);
        setDailyLimit(data.spendLimit.daily || 0);
        setTransactions(data.transactions);
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dependant Dashboard</h1>
      <p className="text-xl mb-2">Balance: UGX {balance}</p>
      <p className="text-lg mb-4">Daily Limit: UGX {dailyLimit}</p>

      <h2 className="text-2xl font-semibold mb-2">Transactions</h2>
      <ul className="space-y-2">
        {transactions.map((txn) => (
          <li key={txn._id} className="p-2 border rounded flex justify-between">
            <span>{txn.type}</span>
            <span>UGX {txn.amount}</span>
            <span>{new Date(txn.timestamp).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}