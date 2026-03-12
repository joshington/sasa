
"use client";

import { useEffect, useState } from "react";

interface Dependant {
    _id: string;
    name: string;
}

export default function TransferPage() {
    const [dependants, setDependants] = useState<Dependant[]>([]);
    const [selectedChild, setSelectedChild] = useState("");
    const [amount, setAmount] = useState("");

    useEffect(() => {
        fetch("/api/parent/dashboard")
            .then((res) => res.json())
            .then((data) => {
                setDependants(data.dependants);
            });
    }, []);
    const handleTransfer = async () => {
        const res = await fetch("/api/parent/transfer", {
            method: "POST",
            body: JSON.stringify({
                dependantId: selectedChild,
                amount: Number(amount)
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await res.json();

        if (res.ok) {
            alert("Transfer successful");
        } else {
            alert(data.error);
        }
    };
    return (
        <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded-xl shadow">
            <h1 className="text-2xl font-bold mb-6">
                Transfer to Child
            </h1>

            <select
                className="w-full border p-2 rounded mb-4"
                onChange={(e) => setSelectedChild(e.target.value)}
            >
                <option value="">Select Child</option>

                {dependants.map((dep) => (
                    <option key={dep._id} value={dep._id}>
                    {dep.name}
                    </option>
                ))}
            </select>

            <input
                type="number"
                placeholder="Amount"
                className="w-full border p-2 rounded mb-4"
                onChange={(e) => setAmount(e.target.value)}
            />

            <button
                onClick={handleTransfer}
                className="w-full bg-blue-600 text-white py-2 rounded-lg"
            >
                Transfer
            </button>
        </div>
    )
}