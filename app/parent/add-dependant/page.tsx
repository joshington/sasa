
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AddDependant() {
  const { data: session } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  //const [smartCardId, setSmartCardId] = useState("");
  const [institute, setInstitute] = useState("");
  const [dailyLimit, setDailyLimit] = useState(0);
  

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/parent/add-dependant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          pin,
          institute,
          dailySpendLimit: dailyLimit,
       
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error adding dependant");

      // Redirect back to dashboard
      router.push("/parent/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-green-700">Add Dependant</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Full Name"
          className="mb-3 w-full p-3 border rounded-lg"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="PIN (4 digits)"
          className="mb-3 w-full p-3 border rounded-lg"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          required
          maxLength={4}
        />

        <input
          type="text"
          placeholder="Institution / School"
          className="mb-3 w-full p-3 border rounded-lg"
          value={institute}
          onChange={(e) => setInstitute(e.target.value)}
          required
        />

        <input
            type="number"
            placeholder="Daily Spending Limit"
            className="mb-3 w-full p-3 border rounded-lg"
            value={dailyLimit}
            onChange={(e) => setDailyLimit(Number(e.target.value))}
        />
        

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            Go Back
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Dependant"}
          </button>
        </div>
      </form>
    </div>
  );
}

