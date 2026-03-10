


import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-white text-gray-900">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 to-green-700 text-white px-6 md:px-20 py-24">

        {/* decorative blur */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-green-500 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-green-900 opacity-20 rounded-full blur-3xl"></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">

          {/* HERO TEXT */}
          <div className="max-w-xl space-y-6">

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Pesasa —
              <span className="block text-green-200">
                Financial rails for controlled digital spending
              </span>
            </h1>

            <p className="text-lg md:text-xl text-green-100">
              Pesasa enables institutions, families, companies and NGOs
              to distribute funds with <strong>built-in spending control</strong> ,ensuring money is used exactly as intended
            </p>

            <p className="text-green-200 font-semibold">
              Move money with Control.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Link
                href="/auth/signin"
                className="px-6 py-3 bg-white text-green-700 font-semibold rounded-lg shadow hover:bg-gray-100 transition text-center"
              >
                Get Started
              </Link>

              <a
                href="#usecases"
                className="px-6 py-3 border border-white font-semibold rounded-lg hover:bg-white hover:text-green-700 transition text-center"
              >
                Explore Use Cases
              </a>
            </div>
          </div>

          {/* HERO IMAGE */}
          <img
            src="https://images.unsplash.com/photo-1556742031-c6961e8560b0"
            alt="Digital payments"
            className="rounded-2xl shadow-2xl w-full max-w-md"
          />
        </div>
      </section>

      {/* ================= TRUST BAR ================= */}
      <section className="px-6 md:px-20 py-12 bg-white text-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-6">
          Built for Emerging Market Institutions
        </h3>

        <div className="flex flex-col md:flex-row justify-center gap-10 text-gray-600">

          <div>
            <p className="text-3xl font-bold text-green-600">100%</p>
            <p>Cashless & Secure</p>
          </div>

          <div>
            <p className="text-3xl font-bold text-green-600">Real-Time</p>
            <p>Transaction Visibility</p>
          </div>

          <div>
            <p className="text-3xl font-bold text-green-600">Mobile Money</p>
            <p>MTN & Airtel Ready</p>
          </div>

        </div>
      </section>

      {/* ================= USE CASES ================= */}
      <section id="usecases" className="px-6 md:px-20 py-20 bg-gray-50">

        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
          Who Uses Pesasa
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="p-6 bg-white rounded-xl shadow text-center">
            <div className="text-4xl mb-3">👨‍👩‍👧</div>
            <h3 className="font-semibold text-lg mb-2">Families</h3>
            <p className="text-gray-600">
              Parents control how children spend school or allowance money.
            </p>
          </div>

          {/*
             <div className="p-6 bg-white rounded-xl shadow text-center">
            <div className="text-4xl mb-3">🏫</div>
            <h3 className="font-semibold text-lg mb-2">Schools</h3>
            <p className="text-gray-600">
              Digitize student spending across cafeterias and campus merchants.
            </p>
          </div>
          */}
         

          <div className="p-6 bg-white rounded-xl shadow text-center">
            <div className="text-4xl mb-3">🏢</div>
            <h3 className="font-semibold text-lg mb-2">Companies</h3>
            <p className="text-gray-600">
              Issue controlled allowances for transport, meals or field work.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow text-center">
            <div className="text-4xl mb-3">🌍</div>
            <h3 className="font-semibold text-lg mb-2">NGOs</h3>
            <p className="text-gray-600">
              Distribute humanitarian aid that can only be spent at approved merchants.
            </p>
          </div>

        </div>

      </section>

      {/* ================= REAL USE CASES ================= */}
      <section className="px-6 md:px-20 py-20 bg-white">

        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
          Real World Applications
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          <div className="bg-gray-50 p-6 rounded-xl shadow">
            <h3 className="font-semibold text-xl mb-3">
              Student Allowances
            </h3>
            <p className="text-gray-600">
              Parents send money that students spend only at approved
              school merchants like cafeterias and bookstores.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl shadow">
            <h3 className="font-semibold text-xl mb-3">
              Aid Distribution
            </h3>
            <p className="text-gray-600">
              NGOs distribute food vouchers that beneficiaries redeem
              at approved merchants such as farmers or grocery stores.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl shadow">
            <h3 className="font-semibold text-xl mb-3">
              Employee Allowances
            </h3>
            <p className="text-gray-600">
              Companies provide controlled spending for transport,
              fuel or meals with full transparency.
            </p>
          </div>

        </div>

      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="px-6 md:px-20 py-20 bg-gray-50">

        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
          Why Institutions Choose Pesasa
        </h2>

        <div className="grid md:grid-cols-3 gap-10">

          <div className="p-6 bg-white rounded-xl shadow text-center">
            <div className="text-5xl mb-4">⚙️</div>
            <h3 className="text-xl font-semibold mb-2">
              Programmable Payments
            </h3>
            <p className="text-gray-600">
              Define where, when and how funds can be used.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow text-center">
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">
              Controlled Spending
            </h3>
            <p className="text-gray-600">
              Ensure funds are spent only on approved merchants or categories.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow text-center">
            <div className="text-5xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-2">
              Mobile Money Native
            </h3>
            <p className="text-gray-600">
              Built for Africa with MTN and Airtel money integrations.
            </p>
          </div>

        </div>

      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how" className="px-6 md:px-20 py-20 bg-white">

        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
          How Pesasa Works
        </h2>

        <div className="grid md:grid-cols-4 gap-10">

          <div className="text-center">
            <div className="text-4xl mb-3">1️⃣</div>
            <h3 className="font-semibold mb-2">Create Wallet</h3>
            <p className="text-gray-600">
              Institutions or individuals create a Pesasa wallet.
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-3">2️⃣</div>
            <h3 className="font-semibold mb-2">Add Beneficiaries</h3>
            <p className="text-gray-600">
              Add students, employees or beneficiaries.
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-3">3️⃣</div>
            <h3 className="font-semibold mb-2">Fund Wallet</h3>
            <p className="text-gray-600">
              Deposit money using mobile money or other rails.
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-3">4️⃣</div>
            <h3 className="font-semibold mb-2">Controlled Spending</h3>
            <p className="text-gray-600">
              Funds can only be spent at approved merchants.
            </p>
          </div>

        </div>

      </section>

      {/* ================= CTA ================= */}
      <section className="bg-green-700 text-white py-20 px-6 md:px-20 text-center">

        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Build smarter money flows
        </h2>

        <p className="text-green-100 max-w-xl mx-auto mb-8">
          Pesasa powers controlled digital spending across institutions,
          families and organizations in emerging markets.
        </p>

        <Link
          href="/auth/signin"
          className="px-8 py-4 bg-white text-green-700 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
        >
          Get Started
        </Link>

      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-green-800 text-white py-12 text-center">

        <h3 className="text-xl font-semibold mb-2">
          Pesasa — Controlled Digital Spending Infrastructure
        </h3>

        <p className="text-green-200 max-w-md mx-auto">
          Financial rails enabling institutions, families and organizations
          to distribute money that is spent exactly as intended.
        </p>

        <p className="text-green-300 text-sm mt-6">
          © {new Date().getFullYear()} Pesasa Technologies
        </p>

      </footer>

    </main>
  );
}
