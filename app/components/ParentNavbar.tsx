
import Link from "next/link";

export default function ParentNavbar() {
  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r p-6">
        <h2 className="text-xl font-bold mb-8 text-green-700">
          Pesasa Parent
        </h2>

        <nav className="flex flex-col gap-4">

          <Link href="/parent/dashboard">
            Dashboard
          </Link>

          <Link href="/parent/add-dependant">
            Add Child
          </Link>

          <Link href="/parent/deposit">
            Deposit
          </Link>

          <Link href="/parent/transactions">
            Transactions
          </Link>

        </nav>
      </aside>
    </div>
  );
}