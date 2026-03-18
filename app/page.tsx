



import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-white text-gray-900">

      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16
                        flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image src="/pesasa-logo.png" alt="Pesasa Logo"
              width={36} height={36} priority />
            <span className="text-lg font-bold text-green-700 tracking-tight">
              Pesasa
            </span>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8 text-sm
                          font-medium text-gray-500">
            <a href="#usecases" className="hover:text-gray-900 transition-colors">
              Use Cases
            </a>
            <a href="#features" className="hover:text-gray-900 transition-colors">
              Features
            </a>
            <a href="#how" className="hover:text-gray-900 transition-colors">
              How it works
            </a>
            <Link href="/merchant/signin"
              className="flex items-center gap-1.5 hover:text-gray-900 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"/>
              Merchants
            </Link>
          </div>

          {/* CTA buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/merchant/signin"
              className="hidden sm:inline-flex items-center text-sm font-medium
                         text-green-700 border border-green-200 px-3 py-2 rounded-lg
                         hover:bg-green-50 transition-colors">
              Merchant sign in
            </Link>
            <Link href="/auth/signin"
              className="bg-green-600 hover:bg-green-700 text-white text-sm
                         font-semibold px-4 py-2 rounded-lg transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br
                           from-green-600 to-green-700 text-white
                           px-4 sm:px-6 md:px-20 py-16 sm:py-24">
        <div className="absolute top-0 right-0 w-72 h-72 bg-green-500
                        opacity-20 rounded-full blur-3xl pointer-events-none"/>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-green-900
                        opacity-20 rounded-full blur-3xl pointer-events-none"/>

        <div className="flex flex-col md:flex-row items-center justify-between
                        gap-10 relative z-10 max-w-6xl mx-auto">
          <div className="max-w-xl space-y-5 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold
                           leading-tight">
              Pesasa —
              <span className="block text-green-200">
                Financial rails for controlled digital spending
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-green-100">
              Pesasa enables institutions, families, companies and NGOs to
              distribute funds with{" "}
              <strong>built-in spending control</strong>, ensuring money is
              used exactly as intended.
            </p>
            <p className="text-green-200 font-semibold">
              Move money with Control.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2
                            justify-center md:justify-start">
              <Link href="/auth/signin"
                className="px-6 py-3 bg-white text-green-700 font-semibold
                           rounded-lg shadow hover:bg-gray-100 transition text-center">
                Get Started
              </Link>
              <a href="#usecases"
                className="px-6 py-3 border border-white font-semibold rounded-lg
                           hover:bg-white hover:text-green-700 transition text-center">
                Explore Use Cases
              </a>
            </div>
            <div className="pt-1 flex justify-center md:justify-start">
              <Link href="/merchant/signin"
                className="inline-flex items-center gap-2 text-green-200 text-sm
                           hover:text-white transition-colors">
                <span className="w-6 h-6 bg-white/20 rounded-md flex items-center
                                 justify-center text-xs">🏪</span>
                Are you a merchant?
                <span className="underline underline-offset-2">Sign in here →</span>
              </Link>
            </div>
          </div>

          <img
            src="https://images.unsplash.com/photo-1556742031-c6961e8560b0"
            alt="Digital payments"
            className="rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md"
          />
        </div>
      </section>

      {/* ================= TRUST BAR ================= */}
      <section className="px-4 sm:px-6 md:px-20 py-10 sm:py-12 bg-white text-center">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-8">
          Built for Emerging Market Institutions
        </h3>
        <div className="flex flex-col sm:flex-row justify-center
                        gap-8 sm:gap-10 text-gray-600">
          <div>
            <p className="text-3xl font-bold text-green-600">100%</p>
            <p className="text-sm sm:text-base">Cashless & Secure</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-600">Real-Time</p>
            <p className="text-sm sm:text-base">Transaction Visibility</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-600">Mobile Money</p>
            <p className="text-sm sm:text-base">MTN & Airtel Ready</p>
          </div>
        </div>
      </section>

      {/* ================= USE CASES ================= */}
      <section id="usecases" className="px-4 sm:px-6 md:px-20 py-16 sm:py-20 bg-gray-50">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold
                       text-center mb-10 sm:mb-16">
          Who Uses Pesasa
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { icon: "👨‍👩‍👧", title: "Families",
              desc: "Parents control how children spend school or allowance money." },
            { icon: "🏢", title: "Companies",
              desc: "Issue controlled allowances for transport, meals or field work." },
            { icon: "🌍", title: "NGOs",
              desc: "Distribute humanitarian aid that can only be spent at approved merchants." },
          ].map((c) => (
            <div key={c.title}
              className="p-6 bg-white rounded-xl shadow text-center
                         hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">{c.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{c.title}</h3>
              <p className="text-gray-600 text-sm sm:text-base">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= REAL USE CASES ================= */}
      <section className="px-4 sm:px-6 md:px-20 py-16 sm:py-20 bg-white">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold
                       text-center mb-10 sm:mb-16">
          Real World Applications
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { title: "Student Allowances",
              desc: "Parents send money that students spend only at approved school merchants like cafeterias and bookstores." },
            { title: "Aid Distribution",
              desc: "NGOs distribute food vouchers that beneficiaries redeem at approved merchants such as farmers or grocery stores." },
            { title: "Employee Allowances",
              desc: "Companies provide controlled spending for transport, fuel or meals with full transparency." },
          ].map((c) => (
            <div key={c.title} className="bg-gray-50 p-6 rounded-xl shadow
                                          hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg sm:text-xl mb-3">{c.title}</h3>
              <p className="text-gray-600 text-sm sm:text-base">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features"
        className="px-4 sm:px-6 md:px-20 py-16 sm:py-20 bg-gray-50">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold
                       text-center mb-10 sm:mb-16">
          Why Institutions Choose Pesasa
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { icon: "⚙️", title: "Programmable Payments",
              desc: "Define where, when and how funds can be used." },
            { icon: "🔒", title: "Controlled Spending",
              desc: "Ensure funds are spent only on approved merchants or categories." },
            { icon: "📱", title: "Mobile Money Native",
              desc: "Built for Africa with MTN and Airtel money integrations." },
          ].map((f) => (
            <div key={f.title}
              className="p-6 bg-white rounded-xl shadow text-center
                         hover:shadow-md transition-shadow">
              <div className="text-4xl sm:text-5xl mb-4">{f.icon}</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm sm:text-base">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how"
        className="px-4 sm:px-6 md:px-20 py-16 sm:py-20 bg-white">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold
                       text-center mb-10 sm:mb-16">
          How Pesasa Works
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {[
            { n: "1️⃣", title: "Create Wallet",
              desc: "Institutions or individuals create a Pesasa wallet." },
            { n: "2️⃣", title: "Add Beneficiaries",
              desc: "Add students, employees or beneficiaries." },
            { n: "3️⃣", title: "Fund Wallet",
              desc: "Deposit money using mobile money or other rails." },
            { n: "4️⃣", title: "Controlled Spending",
              desc: "Funds can only be spent at approved merchants." },
          ].map((s) => (
            <div key={s.title} className="text-center">
              <div className="text-3xl sm:text-4xl mb-3">{s.n}</div>
              <h3 className="font-semibold text-sm sm:text-base mb-2">
                {s.title}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= MERCHANT CTA BANNER ================= */}
      {/* Replaced dark slate with green gradient to stay on-brand */}
      <section className="px-4 sm:px-6 md:px-20 py-12 sm:py-16
                           bg-gradient-to-br from-green-700 to-green-800
                           relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500
                        opacity-10 rounded-full blur-3xl pointer-events-none"/>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-900
                        opacity-20 rounded-full blur-2xl pointer-events-none"/>

        <div className="max-w-5xl mx-auto relative z-10
                        flex flex-col sm:flex-row items-center
                        justify-between gap-6 text-center sm:text-left">
          <div>
            <span className="inline-block text-green-300 text-xs font-semibold
                             uppercase tracking-widest mb-3">
              For merchants & institutions
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
              Accept Pesasa payments at your outlet
            </h2>
            <p className="text-green-200 mt-2 text-sm sm:text-base max-w-md">
              Earn <strong className="text-white">0.5% commission</strong> on every
              withdrawal, get settled weekly, and serve your institution's students
              or employees.
            </p>
          </div>
          <Link href="/merchant/signin" className="shrink-0">
            <button className="bg-white text-green-700 hover:bg-green-50
                               font-bold px-8 py-4 rounded-xl transition-colors
                               shadow-lg whitespace-nowrap text-sm sm:text-base">
              Merchant Sign In →
            </button>
          </Link>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="bg-green-600 text-white py-16 sm:py-20
                           px-4 sm:px-6 md:px-20 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6">
          Build smarter money flows
        </h2>
        <p className="text-green-100 max-w-xl mx-auto mb-6 sm:mb-8
                      text-sm sm:text-base">
          Pesasa powers controlled digital spending across institutions,
          families and organizations in emerging markets.
        </p>
        <Link href="/auth/signin"
          className="inline-block px-8 py-4 bg-white text-green-700
                     font-semibold rounded-lg shadow hover:bg-gray-100 transition">
          Get Started
        </Link>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-green-800 text-white py-10 sm:py-12
                          px-4 sm:px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Image src="/pesasa-logo.png" alt="Pesasa" width={28} height={28}/>
          <span className="font-bold text-lg">Pesasa</span>
        </div>
        <p className="text-green-200 max-w-md mx-auto text-sm">
          Financial rails enabling institutions, families and organizations
          to distribute money that is spent exactly as intended.
        </p>
        <div className="flex justify-center gap-6 mt-6 text-sm text-green-300">
          <Link href="/auth/signin"
            className="hover:text-white transition-colors">
            For Families
          </Link>
          <Link href="/merchant/signin"
            className="hover:text-white transition-colors">
            For Merchants
          </Link>
        </div>
        <p className="text-green-400 text-xs mt-6">
          © {new Date().getFullYear()} Pesasa Technologies
        </p>
      </footer>
    </main>
  );
}