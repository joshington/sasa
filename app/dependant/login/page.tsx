
import dynamic from "next/dynamic";
import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner"

// QR reader dynamically because Next.js SSR
//const QrReader = dynamic(() => import("react-qr-scanner"), { ssr: false });

export default function DependantLogin() {
  const [smartCardId, setSmartCardId] = useState("");
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    const res = await fetch("/api/dependant/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ smartCardId, pin }),
    });
    const data = await res.json();
    setMessage(data.message || data.error);
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dependant Login</h1>

        <Scanner
            onScan={(result) => {
                if (result && result.length > 0) {
                setSmartCardId(result[0].rawValue);
                }
            }}
            onError={(error) => console.error(error)}
            styles={{ container: { width: "100%" } }}
        />
        {/* 
            //delay={300}
        //onScan={(result, error) => {
        //  if (!!result) setSmartCardId(result?.text);
        //}}
        //style={{ width: "100%" }}
      ///>
        */}
      


      <input
        placeholder="Enter PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        className="w-full mt-2 p-2 border rounded"
      />
      <button onClick={handleLogin} className="w-full bg-green-600 text-white py-2 rounded mt-2">
        Login
      </button>

      {message && <p className="mt-2 text-red-600">{message}</p>}
    </div>
  );
}