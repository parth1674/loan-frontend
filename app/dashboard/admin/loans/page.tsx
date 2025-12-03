"use client";

import { useEffect, useState, useMemo } from "react";
import { getAdminLoans } from "@/api/admin";
import API from "@/api/axios";
export default function AdminLoansPage() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [freqFilter, setFreqFilter] = useState("ALL");
  const [sort, setSort] = useState("latest");

  // ===================
  // LOAD LOANS
  // ===================
  async function fetchLoans() {
    try {
      setLoading(true);

      const res = await API.get("/loan/admin-list", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("LOAN LIST:", res.data.loans);
      setLoans(res.data.loans || []);

    } catch (err) {
      console.log("LOAN LIST ERROR:", err);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchLoans();
  }, []);

  // Filter + Search
  const filteredLoans = useMemo(() => {
    return loans
      .filter((l) => {
        if (statusFilter === "ALL") return true;
        return l.status === statusFilter;
      })
      .filter((l) => {
        const s = search.toLowerCase();
        return (
          (l.user?.fullname?.toLowerCase() || "").includes(s) ||
          (l.user?.email?.toLowerCase() || "").includes(s)
        );
      });
  }, [loans, search, statusFilter]);

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Loans</h1>

        <a
          href="/dashboard/admin/loans/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          + Create Loan
        </a>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow mb-4 flex flex-col md:flex-row gap-3 justify-between">
        <input
          className="border px-3 py-2 rounded w-full md:w-64"
          placeholder="Search user..."
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded w-full md:w-40"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All</option>
          <option value="ACTIVE">Active</option>
          <option value="OVERDUE">Overdue</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <p className="p-4 text-center text-gray-500">Loading loans...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2">User</th>
                <th className="p-2">Principal</th>
                <th className="p-2">Outstanding</th>
                <th className="p-2">Status</th>
                <th className="p-2">Next Payment</th>
                <th className="p-2 text-right">Created</th>
              </tr>
            </thead>

            <tbody>
              {filteredLoans.map((loan) => (
                <tr
                  key={loan.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-2">
                    <div className="font-semibold">{loan.user?.fullname || "N/A"}</div>
                    <div className="text-xs text-gray-500">{loan.user?.email}</div>
                  </td>

                  <td className="p-2 font-medium">₹ {loan.principal}</td>

                  <td className="p-2 font-semibold text-blue-700">
                    ₹ {loan.outstanding}
                  </td>

                  <td className="p-2">
                    <StatusBadge status={loan.status} />
                  </td>

                  <td className="p-2">
                    {loan.nextPaymentDate
                      ? new Date(loan.nextPaymentDate).toDateString()
                      : "N/A"}
                  </td>

                  <td className="p-2 text-right text-gray-500">
                    {new Date(loan.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}

              {filteredLoans.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-4 text-center text-gray-500"
                  >
                    No loans found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: any = {
    ACTIVE: "bg-green-100 text-green-700 border border-green-200",
    OVERDUE: "bg-red-100 text-red-700 border border-red-200",
    CLOSED: "bg-gray-100 text-gray-600 border border-gray-200",
  };

  return (
    <span
      className={`px-3 py-1 rounded text-xs font-semibold ${map[status]}`}
    >
      {status}
    </span>
  );
}