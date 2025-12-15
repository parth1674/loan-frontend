"use client";

import { useEffect, useState, useMemo } from "react";
import { getAllUsers, approveUser, getAdminSummary } from "@/api/admin";

export default function AdminDashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  async function fetchSummary() {
    const res = await getAdminSummary();
    setSummary(res.data);
  }

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (err) {
      console.log("USER API ERROR:", err);
    }
    setLoading(false);
  }

  async function handleApprove(id: string) {
    setApproving(id);
    await approveUser(id);
    await fetchUsers();
    await fetchSummary();
    setApproving(null);
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) return;

    fetchSummary();
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => (filterStatus === "ALL" ? true : u.status === filterStatus))
      .filter((u) => {
        const s = search.toLowerCase();
        return u.fullname.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
      });
  }, [users, search, filterStatus]);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of users & loan performance</p>
      </div>

      {/* SUMMARY CARDS */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
          <SummaryCard title="Total Users" value={summary.totalUsers} icon="👥" />
          <SummaryCard title="Pending Users" value={summary.pendingUsers} icon="⏳" />
          <SummaryCard title="Active Users" value={summary.activeUsers} icon="✅" />
          <SummaryCard title="Total Loans" value={summary.totalLoans} icon="📄" />
          <SummaryCard title="Active Loans" value={summary.activeLoans} icon="📌" />
          <SummaryCard title="Overdue Loans" value={summary.overdueLoans} icon="⚠️" />
          <SummaryCard wide title="Total Outstanding" value={`₹ ${summary.totalOutstanding}`} icon="💰" />
        </div>
      )}

      {/* USERS SECTION */}
      <div className="bg-white rounded-xl shadow-lg border">

        {/* TABLE HEADER */}
        <div className="p-4 border-b flex flex-col md:flex-row gap-3 justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">User List</h2>
            <p className="text-xs text-gray-500">Approve or manage registered users</p>
          </div>

          {/* SEARCH + FILTER */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm w-48 shadow-sm focus:ring-2 focus:ring-indigo-300"
            />

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-indigo-300"
            >
              <option value="ALL">All</option>
              <option value="PENDING">Pending</option>
              <option value="ACTIVE">Active</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          {loading ? (
            <p className="p-4">Loading...</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-t hover:bg-gray-50 transition">
                    <td className="p-3">{u.fullname}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                        {u.role}
                      </span>
                    </td>

                    <td className="p-3">
                      <StatusBadge status={u.status} />
                    </td>

                    <td className="p-3 text-right">
                      {u.status === "PENDING" ? (
                        <button
                          onClick={() => handleApprove(u.id)}
                          disabled={approving === u.id}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm shadow 
                                     disabled:bg-indigo-300 transition"
                        >
                          {approving === u.id ? "Approving..." : "Approve"}
                        </button>
                      ) : (
                        <span className="text-green-600 text-sm font-semibold">Approved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon, wide }: any) {
  return (
    <div
      className={`bg-gradient-to-br from-white to-gray-50 shadow-md px-5 py-4 rounded-xl border 
      hover:shadow-xl transition-all ${wide ? "md:col-span-2" : ""}`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-xs">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-gray-800">{value}</h3>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: any) {
  if (status === "PENDING")
    return (
      <span className="bg-yellow-100 text-yellow-800 border border-yellow-300 px-2 py-1 rounded text-xs font-medium">
        ⏳ Pending
      </span>
    );

  if (status === "ACTIVE")
    return (
      <span className="bg-green-100 text-green-700 border border-green-300 px-2 py-1 rounded text-xs font-medium">
        ✅ Active
      </span>
    );

  return (
    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
      Inactive
    </span>
  );
}
