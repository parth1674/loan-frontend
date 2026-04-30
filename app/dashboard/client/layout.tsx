"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const menu = [
    { name: "Dashboard", path: "/dashboard/client", icon: "🏠" },
    { name: "My Loans", path: "/dashboard/client/loans", icon: "💳" },
    { name: "Payments", path: "/dashboard/client/payments", icon: "📄" },
    { name: "Profile", path: "/dashboard/client/profile", icon: "👤" },
  ];

  // 🔹 Load logged-in user name
  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        const u = JSON.parse(raw);
        setUserName(u.fullname || "User");
      } catch {
        setUserName("User");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        
        {/* HEADER */}
        <div className="p-6 border-b border-blue-800">
          <h1 className="text-lg font-bold">Client Portal</h1>
          <p className="text-xs text-blue-300">Welcome, {userName}</p>
        </div>

        {/* MENU */}
        <nav className="flex-1 mt-4">
          {menu.map((m) => (
            <Link key={m.path} href={m.path}>
              <div
                className={`px-5 py-3 cursor-pointer flex items-center gap-2 transition
                ${pathname === m.path ? "bg-blue-700" : "hover:bg-blue-800"}`}
              >
                <span>{m.icon}</span> <span>{m.name}</span>
              </div>
            </Link>
          ))}
        </nav>

        {/* LOGOUT */}
        <div className="border-t border-blue-800 p-5 mt-auto">
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full bg-red-500 hover:bg-red-600 transition py-2 rounded-lg text-sm font-semibold"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 relative">
        {children}

        {/* CONFIRM MODAL */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 w-80 shadow-xl">
              <h3 className="text-lg font-semibold mb-2">Confirm Logout</h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to logout?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
