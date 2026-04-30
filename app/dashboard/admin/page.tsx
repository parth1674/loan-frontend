"use client";

import { useEffect, useState, useMemo } from "react";
import { getAllUsers, approveUser, getAdminSummary } from "@/api/admin";
import LoanStatusChart from "../../../components/LoanStatusChart";
import {
  getAllLoanRequests,
  approveLoanRequest,
  rejectLoanRequest,
} from "@/api/loanRequestAdmin";


export default function AdminDashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [loanRequests, setLoanRequests] = useState<any[]>([]);
  const [loadingLoans, setLoadingLoans] = useState(false);


  async function fetchSummary() {
    const res = await getAdminSummary();
    console.log("ADMIN SUMMARY:", res.data);
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
    loadLoanRequests();
  }, []);

  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => (filterStatus === "ALL" ? true : u.status === filterStatus))
      .filter((u) => {
        const s = search.toLowerCase();
        return u.fullname.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
      });
  }, [users, search, filterStatus]);

  async function loadLoanRequests() {
    setLoadingLoans(true);
    try {
      const res = await getAllLoanRequests();
      setLoanRequests(res.data || []);
    } catch (e) {
      console.log("ADMIN LOAN REQUEST ERROR", e);
    } finally {
      setLoadingLoans(false);
    }
  }


  // ======================
  // CALCULATED UI VALUES
  // ======================
  const totalOutstanding = summary?.totalOutstanding || 0;
  const totalPrincipal = summary?.totalPrincipal || 0;
  const totalInterest = Math.max(totalOutstanding - totalPrincipal, 0);

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
          <SummaryCard title="Total Users" value={summary.totalUsers} icon="👥" color="blue" />
          <SummaryCard title="Pending Users" value={summary.pendingUsers} icon="⏳" color="yellow" />
          <SummaryCard title="Active Users" value={summary.activeUsers} icon="✅" color="green" />
          <SummaryCard title="Total Loans" value={summary.totalLoans} icon="📄" color="blue" />

          <SummaryCard title="Active Loans" value={summary.activeLoans} icon="📌" color="green" />
          <SummaryCard title="Overdue Loans" value={summary.overdueLoans} icon="⚠️" color="red" />

          <SummaryCard
            wide
            title="Total Principal (Without Interest)"
            value={`₹ ${summary.totalPrincipal.toLocaleString("en-IN")}`}
            icon="🏦"
            color="blue"
          />

          <SummaryCard
            wide
            title="Total Outstanding (With Interest)"
            value={`₹ ${summary.totalOutstanding.toLocaleString("en-IN")}`}
            icon="💰"
            color="orange"
          />

          <SummaryCard
            wide
            title="Total Interest Earned"
            value={`₹ ${summary.totalInterest.toLocaleString("en-IN")}`}
            icon="📈"
            color="green"
          />

          {/* 🔥 NEW ENHANCED CARDS */}
          <SummaryCard
            title="Running Loans"
            value={summary.runningLoans}
            icon="🔄"
            color="indigo"
          />

          <SummaryCard
            title="Recovered Amount"
            value={`₹ ${summary.recoveredAmount.toLocaleString("en-IN")}`}
            icon="💵"
            color="green"
          />

          <SummaryCard
            title="Interest Pending"
            value={`₹ ${summary.interestPending.toFixed(2)}`}
            icon="🔥"
            color="red"
          />

          <SummaryCard
            title="Daily Interest"
            value={`INR ${Number(summary.totalDailyInterest ?? summary.dailyInterestAccrued ?? 0).toLocaleString("en-IN", {
              maximumFractionDigits: 2,
            })}`}
            icon="%"
            color="green"
          />

          <SummaryCard
            title="Avg Interest Rate"
            value={`${summary.avgInterestRate.toFixed(2)}%`}
            icon="📊"
            color="purple"
          />

          {/* 🔥 FINANCIAL ANALYTICS */}

          <SummaryCard
            wide
            title="Net Profit"
            value={`₹ ${summary.netProfit?.toLocaleString("en-IN") || 0}`}
            icon="💹"
            color="green"
          />

          <SummaryCard
            title="Portfolio Risk %"
            value={`${summary.riskPercentage?.toFixed(2) || 0}%`}
            icon="⚠️"
            color="red"
          />

          <SummaryCard
            title="Recovery Efficiency %"
            value={`${summary.recoveryPercentage?.toFixed(2) || 0}%`}
            icon="🎯"
            color="blue"
          />

          <SummaryCard
            title="NPA Accounts"
            value={summary.npaCount}
            icon="🚨"
            color="red"
          />

          <SummaryCard
            title="NPA Outstanding"
            value={`₹ ${summary.totalNPAOutstanding?.toLocaleString("en-IN")}`}
            icon="💀"
            color="red"
          />

          <SummaryCard
            title="Substandard NPAs"
            value={`${summary.substandard} (₹ ${summary.substandardAmt.toLocaleString("en-IN")})`}
            icon="🟡"
            color="yellow"
          />

          <SummaryCard
            title="Doubtful NPAs"
            value={`${summary.doubtful} (₹ ${summary.doubtfulAmt.toLocaleString("en-IN")})`}
            icon="🟠"
            color="orange"
          />

          <SummaryCard
            title="Loss Assets"
            value={`${summary.loss} (₹ ${summary.lossAmt.toLocaleString("en-IN")})`}
            icon="🔴"
            color="red"
          />

          <SummaryCard
            wide
            title="Provision Required"
            value={`₹ ${summary.totalProvision.toLocaleString("en-IN")}`}
            icon="🏦"
            color="purple"
          />
        </div>
      )}

      {/* ================= LOAN REQUESTS ================= */}
      <div className="bg-white rounded-xl shadow border mt-6">
        <div className="px-5 py-4 border-b">
          <h2 className="text-xl font-semibold">Loan Requests</h2>
          <p className="text-xs text-gray-500">
            Review and approve/reject loan requests
          </p>
        </div>

        <div className="p-5">
          {loadingLoans ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : loanRequests.length === 0 ? (
            <p className="text-sm text-gray-500">No loan requests found</p>
          ) : (
            <div className="space-y-4">
              {loanRequests.map((r) => (
                <div
                  key={r.id}
                  className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <p className="font-semibold text-sm">
                      {r.user?.fullname} ({r.user?.email})
                    </p>
                    <p className="text-xs text-gray-500">
                      ₹ {r.requestedAmount} • {r.termDays} days • {r.requestedRate}%
                    </p>
                    {r.purpose && (
                      <p className="text-xs text-gray-400 mt-1">
                        Purpose: {r.purpose}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${r.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : r.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {r.status}
                    </span>

                    {r.status === "PENDING" && (
                      <>
                        <button
                          onClick={async () => {
                            await approveLoanRequest(r.id);
                            loadLoanRequests();
                            fetchSummary();
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                        >
                          Approve
                        </button>

                        <button
                          onClick={async () => {
                            await rejectLoanRequest(r.id);
                            loadLoanRequests();
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>


      {/* CHARTS SECTION */}
      {summary && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <LoanStatusChart summary={summary} />
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

function SummaryCard({ title, value, icon, wide, color = "gray" }: any) {
  const colorMap: any = {
    green: "text-green-600 bg-green-100",
    red: "text-red-600 bg-red-100",
    yellow: "text-yellow-600 bg-yellow-100",
    blue: "text-blue-600 bg-blue-100",
    orange: "text-orange-600 bg-orange-100",
    indigo: "text-indigo-600 bg-indigo-100",
    purple: "text-purple-600 bg-purple-100",
    gray: "text-gray-600 bg-gray-100",
  };

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

        {icon && (
          <div
            className={`text-3xl p-2 rounded-lg ${colorMap[color]}`}
          >
            {icon}
          </div>
        )}
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
