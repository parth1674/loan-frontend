"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", path: "/dashboard/client", icon: "🏠" },
    { name: "My Loans", path: "/dashboard/client/loans", icon: "💳" },
    { name: "Payments", path: "/dashboard/client/payments", icon: "📄" },
    { name: "Profile", path: "/dashboard/client/profile", icon: "👤" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-6 border-b border-blue-800">
          <h1 className="text-lg font-bold">Client Portal</h1>
          <p className="text-xs text-blue-300">Your Loan Overview</p>
        </div>

        <nav className="flex-1 mt-4">
          {menu.map((m) => (
            <Link key={m.path} href={m.path}>
              <div
                className={`px-5 py-3 cursor-pointer flex items-center gap-2 
                ${pathname === m.path ? "bg-blue-700" : "hover:bg-blue-800"}`}
              >
                <span>{m.icon}</span> <span>{m.name}</span>
              </div>
            </Link>
          ))}
        </nav>

        <div className="border-t border-blue-800 p-5">
          <p className="text-sm font-semibold">Logged In User</p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
