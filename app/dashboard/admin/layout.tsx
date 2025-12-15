"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Users, BadgeDollarSign, Mail, LogOut } from "lucide-react";

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
    <div className="min-h-screen flex bg-[#0A0F1F]">

      {/* =============== SIDEBAR =============== */}
      <aside className="w-64 bg-[#0F172A] text-white shadow-lg border-r border-white/10 
                 backdrop-blur-lg flex flex-col">

        {/* TOP SECTION */}
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Loan Admin
          </h1>
          <p className="text-xs text-gray-400 mt-1">Control & Monitoring Panel</p>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 p-4 space-y-2 text-sm font-medium">
          <SidebarLink href="/dashboard/admin" icon={<LayoutDashboard size={18} />}>Dashboard</SidebarLink>
          <SidebarLink href="/dashboard/admin/users" icon={<Users size={18} />}>Users</SidebarLink>
          <SidebarLink href="/dashboard/admin/loans" icon={<BadgeDollarSign size={18} />}>Loans</SidebarLink>
          <SidebarLink href="/dashboard/admin/newsletter" icon={<Mail size={18} />}>Newsletter</SidebarLink>
        </nav>

        {/* PROFILE + LOGOUT → ALWAYS BOTTOM */}
        <div className="p-4 border-t border-white/10">
          {/* Profile */}
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center font-bold text-white">
              A
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Admin</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>

          {/* Logout Button → BOTTOM */}
          <button
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 
                 p-3 rounded-lg text-sm font-semibold transition-all shadow-lg"
            onClick={() => {
              localStorage.clear();
              router.push("/");
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>


      {/* MAIN SECTION */}
      <main className="flex-1 p-6 bg-[#F5F7FB]">{children}</main>
    </div>
  );
}

function SidebarLink({ href, icon, children }: any) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 p-2 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-all"
    >
      {icon}
      {children}
    </a>
  );
}
