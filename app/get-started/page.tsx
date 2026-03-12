

import Link from 'next/link';

export default function GetStarted() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-6">

      <div className="max-w-4xl w-full">

        {/* Header */}
        <div className="text-center mb-12">

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose how you want to use Pesasa
          </h1>

          <p className="text-gray-600 text-lg">
            Pesasa supports families, institutions and NGOs with controlled digital spending.
          </p>

        </div>

        {/* Options */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* Families */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-green-100 hover:shadow-xl transition">

            <div className="text-5xl mb-4 text-center">👨‍👩‍👧</div>

            <h3 className="text-xl font-semibold text-center mb-3">
              Families
            </h3>

            <p className="text-gray-600 text-center mb-6">
              Parents control how children spend allowance or school money.
            </p>

            <Link
              href="/auth/signin"
              className="block w-full text-center px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Proceed
            </Link>

          </div>

          {/* Institutions */}
          <div className="bg-white p-8 rounded-xl shadow border border-gray-100 opacity-70">

            <div className="text-5xl mb-4 text-center">🏫</div>

            <h3 className="text-xl font-semibold text-center mb-3">
              Companies
            </h3>

            <p className="text-gray-600 text-center mb-6">
                Companies control how employees spend corporate funds, 
                ensuring compliance and reducing fraud.
            </p>

            <button
              disabled
              className="w-full px-4 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold cursor-not-allowed"
            >
              Coming Soon
            </button>

          </div>

          {/* NGOs */}
          <div className="bg-white p-8 rounded-xl shadow border border-gray-100 opacity-70">

            <div className="text-5xl mb-4 text-center">🌍</div>

            <h3 className="text-xl font-semibold text-center mb-3">
              NGOs
            </h3>

            <p className="text-gray-600 text-center mb-6">
              Distribute humanitarian aid that can only be spent at approved merchants.
            </p>

            <button
              disabled
              className="w-full px-4 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold cursor-not-allowed"
            >
              Coming Soon
            </button>

          </div>

        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center mt-12">

          <Link
            href="/"
            className="px-6 py-3 border border-green-600 text-green-700 rounded-lg font-semibold hover:bg-green-600 hover:text-white transition"
          >
            ← Go Back
          </Link>

        </div>

      </div>

    </main>
  );
}
