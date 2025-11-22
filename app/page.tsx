export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-white text-gray-900">

      {/* ================= HERO SECTION ================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 to-green-700 text-white px-6 md:px-20 py-20 md:py-24">

        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-40 h-40 md:w-72 md:h-72 bg-green-500 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 md:w-72 md:h-72 bg-green-900 opacity-20 rounded-full blur-3xl"></div>

        <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
          {/* TEXT */}
          <div className="max-w-xl space-y-6 animate-fadeInUp text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              SASA —  
              <span className="block text-green-200">Cashless School Payments</span>
            </h1>

            <p className="text-lg md:text-xl text-green-100">
              Safe, smart and instant spending for students.
              Managed fully by parents through WhatsApp.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center md:justify-start">
              <a
                href="#how"
                className="px-6 py-3 bg-white text-green-700 font-semibold rounded-lg shadow hover:bg-gray-100 transition text-center"
              >
                How It Works
              </a>
              <a
                href="#features"
                className="px-6 py-3 border border-white font-semibold rounded-lg hover:bg-white hover:text-green-700 transition text-center"
              >
                Join WaitList
              </a>
            </div>
          </div>

          {/* VISUAL */}
          <img
            src="https://images.unsplash.com/photo-1588072432836-e10032774350"
            alt="School Wallet"
            className="rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md mt-10 md:mt-0 animate-fadeIn"
          />
        </div>
      </section>

      {/* CURVED DIVIDER */}
      <div className="w-full overflow-hidden leading-none">
        <svg
          className="w-full h-16 md:h-20 text-white rotate-180"
          viewBox="0 0 1440 320"
          fill="currentColor"
        >
          <path d="M0,192L1440,64L1440,0L0,0Z" />
        </svg>
      </div>

      {/* ================= WHATSAPP CHAT DEMO ================== */}
      <section className="px-6 md:px-20 py-20 bg-white">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">WhatsApp Chat Demo</h2>

        <div className="max-w-md mx-auto bg-gray-100 rounded-xl shadow-lg border p-4">
          <div className="flex flex-col space-y-3 text-sm">

            {/* Parent Message */}
            <div className="self-end bg-green-600 text-white px-4 py-2 rounded-2xl rounded-br-none max-w-[80%]">
              Hi, register my child for SASA.
            </div>

            {/* Bot Response */}
            <div className="self-start bg-white border px-4 py-2 rounded-2xl rounded-bl-none max-w-[80%] shadow">
              Sure! Please provide the student's name.
            </div>

            {/* Parent */}
            <div className="self-end bg-green-600 text-white px-4 py-2 rounded-2xl rounded-br-none max-w-[80%]">
              John Junior
            </div>

            {/* Bot */}
            <div className="self-start bg-white border px-4 py-2 rounded-2xl rounded-bl-none max-w-[80%] shadow">
              Great. Set a daily spend limit.
            </div>

            {/* Parent */}
            <div className="self-end bg-green-600 text-white px-4 py-2 rounded-2xl rounded-br-none max-w-[80%]">
              5,000 UGX
            </div>

            {/* Bot */}
            <div className="self-start bg-white border px-4 py-2 rounded-2xl rounded-bl-none max-w-[80%] shadow">
              Done! John is now registered.
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================== */}
      <section id="features" className="px-6 md:px-20 py-20 bg-gray-50">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
          Why Students & Parents Love SASA
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-xl transition transform hover:-translate-y-1 text-center">
            <div className="text-green-600 text-5xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">WhatsApp-Based</h3>
            <p className="text-gray-600">Parents manage all actions through a simple chat interface. No app needed.</p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow hover:shadow-xl transition transform hover:-translate-y-1 text-center">
            <div className="text-green-600 text-5xl mb-4">🎒</div>
            <h3 className="text-xl font-semibold mb-2">Student Smart Cards</h3>
            <p className="text-gray-600">QR-based student ID cards allow instant spending at school canteens.</p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow hover:shadow-xl transition transform hover:-translate-y-1 text-center">
            <div className="text-green-600 text-5xl mb-4">🏪</div>
            <h3 className="text-xl font-semibold mb-2">Merchant App</h3>
            <p className="text-gray-600">Merchants accept payments, scan QR codes, and earn commissions automatically.</p>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================== */}
      <section id="how" className="px-6 md:px-20 py-20 bg-white">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">How SASA Works</h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div className="p-6 bg-gray-50 rounded-xl shadow text-center hover:shadow-lg transition">
            <img src="https://img.icons8.com/fluency/96/user.png" className="mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">1. Parent Registers</h3>
            <p className="text-gray-600">Using the WhatsApp agent.</p>
          </div>

          <div className="p-6 bg-gray-50 rounded-xl shadow text-center hover:shadow-lg transition">
            <img src="https://img.icons8.com/fluency/96/schoolboy-at-a-desk.png" className="mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">2. Add Children</h3>
            <p className="text-gray-600">Parents add students & set spending limits.</p>
          </div>

          <div className="p-6 bg-gray-50 rounded-xl shadow text-center hover:shadow-lg transition">
            <img src="https://img.icons8.com/fluency/96/money-bag.png" className="mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">3. Deposit Money</h3>
            <p className="text-gray-600">Via Mobile Money (MTN/Airtel).</p>
          </div>

          <div className="p-6 bg-gray-50 rounded-xl shadow text-center hover:shadow-lg transition">
            <img src="https://img.icons8.com/fluency/96/qr-code.png" className="mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">4. Student Spends</h3>
            <p className="text-gray-600">Merchant scans QR → instant payment.</p>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================== */}
      <footer className="bg-green-700 text-white py-10 text-center">
        <h3 className="text-xl font-semibold">SASA — Smart School Payments</h3>
        <p className="text-green-200 mt-2">© {new Date().getFullYear()} SASA Technologies.</p>
      </footer>

    </main>
  );
}