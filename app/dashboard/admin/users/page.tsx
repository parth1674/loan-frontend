"use client";

import { useEffect, useState, useMemo } from "react";
import { getAllUsers, approveUser } from "@/api/admin";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // ===================
  // API LOAD USERS
  // ===================
  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (err) {
      console.log("USER PAGE ERROR:", err);
    }
    setLoading(false);
  }

  async function handleApprove(id: string) {
    setApproving(id);
    await approveUser(id);
    await fetchUsers();
    setApproving(null);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  // ===================
  // FILTER + SEARCH
  // ===================
  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => (filterStatus === "ALL" ? true : u.status === filterStatus))
      .filter((u) => {
        const s = search.toLowerCase();
        return (
          u.fullname.toLowerCase().includes(s) ||
          u.email.toLowerCase().includes(s)
        );
      });
  }, [users, search, filterStatus]);

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-sm text-gray-500">
          Manage and approve registered users
        </p>
      </div>

      {/* SEARCH + FILTER PANEL */}
      <div className="bg-white p-4 rounded-xl shadow border mb-4 flex flex-col md:flex-row gap-3 justify-between">

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name or email..."
          className="border rounded px-3 py-2 text-sm w-full md:w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Filter */}
        <select
          className="border rounded px-3 py-2 text-sm w-full md:w-40"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="ALL">All Users</option>
          <option value="PENDING">Pending</option>
          <option value="ACTIVE">Active</option>
        </select>
      </div>

      {/* USERS TABLE */}
      <div className="bg-white rounded-xl shadow border overflow-x-auto">
        {loading ? (
          <p className="p-4">Loading...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{u.fullname}</td>
                  <td className="p-2">{u.email}</td>

                  <td className="p-2">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                      {u.role}
                    </span>
                  </td>

                  {/* STATUS BADGE */}
                  <td className="p-2">
                    <StatusBadge status={u.status} />
                  </td>

                  {/* ACTION BUTTONS */}
                  <td className="p-2 flex items-center justify-end gap-2">

                    {/* 🔍 VIEW DETAILS */}
                    <a
                      href={`/dashboard/admin/users/${u.id}`}
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300"
                    >
                      View
                    </a>

                    {/* APPROVE BUTTON */}
                    {u.status === "PENDING" ? (
                      <button
                        onClick={() => handleApprove(u.id)}
                        disabled={approving === u.id}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm disabled:bg-blue-300"
                      >
                        {approving === u.id ? "Approving..." : "Approve"}
                      </button>
                    ) : (
                      <span className="text-green-600 text-sm font-semibold">
                        Approved
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>
    </div>
  );
}

/* STATUS BADGE UI */
function StatusBadge({ status }: any) {
  if (status === "PENDING")
    return (
      <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-1 rounded text-xs">
        ⏳ Pending
      </span>
    );

  if (status === "ACTIVE")
    return (
      <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded text-xs">
        ✅ Active
      </span>
    );

  return (
    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
      Inactive
    </span>
  );
}
