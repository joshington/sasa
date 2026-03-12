

"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-xl shadow-md text-center space-y-6">
        <h1 className="text-2xl font-bold">Sign in to Pesasa</h1>
        <button
          onClick={() => signIn("google")}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}


