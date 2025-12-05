"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(userData);

    if (user.role !== "ADMIN") {
      router.push("/auth/login");
      return;
    }

    setLoading(false);
  }, []);

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-[#0D1B2A] text-white flex flex-col">
        <div className="p-5 border-b border-gray-700">
          <h1 className="text-xl font-bold">Loan Admin Panel</h1>
          <p className="text-gray-400 text-xs">Control & Monitoring</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 text-sm">
          <a
            href="/dashboard/admin"
            className="block p-2 rounded hover:bg-gray-800"
          >
            📊 Dashboard
          </a>

          <a
            href="/dashboard/admin/users"
            className="block p-2 rounded hover:bg-gray-800"
          >
            👤 Users
          </a>

          <a
            href="/dashboard/admin/loans"
            className="block p-2 rounded hover:bg-gray-800"
          >
            💳 Loans
          </a>

          <a
            href="/dashboard/admin/newsletter"
            className="block p-2 rounded hover:bg-gray-800"
          >
            Newsletter
          </a>

        </nav>

        <div className="border-t border-gray-800 p-4 flex items-center gap-3">
          <div className="h-10 w-10 bg-gray-700 rounded-full flex items-center justify-center font-bold">
            A
          </div>
          <div>
            <p className="text-sm font-semibold">Admin</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
        </div>

        <button
          className="bg-red-600 hover:bg-red-700 p-3 m-4 rounded text-sm"
          onClick={() => {
            localStorage.clear();
            router.push("/");
          }}
        >
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
