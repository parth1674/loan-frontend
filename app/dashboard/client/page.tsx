"use client";

import { useEffect, useState } from "react";
import { getClientDashboard } from "@/api/client";
import { getInterestSummary, type InterestSummary } from "@/api/interest";
import DailyInterestSummary from "@/components/DailyInterestSummary";
import { applyForLoan, getMyLoanRequests } from "@/api/loanRequest";

export default function ClientDashboard() {
  const [data, setData] = useState<any>(null);
  const [interestSummary, setInterestSummary] = useState<InterestSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  // ========= LOAN REQUEST STATES (ADD-ON) =========
  const [loanForm, setLoanForm] = useState({
    requestedAmount: "",
    requestedRate: "",
    termDays: "",
    purpose: "",
  });

  const [loanRequests, setLoanRequests] = useState<any[]>([]);
  const [loanReqMsg, setLoanReqMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loanMsg, setLoanMsg] = useState<string>("");
  const [loadingReq, setLoadingReq] = useState(false);


  // ========= LOAD USER NAME + DASHBOARD =========
  useEffect(() => {
    // user name only for heading
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const u = JSON.parse(raw);
        setUserName(u.fullname || "");
      }
    } catch (e) {
      console.log("USER PARSE ERROR", e);
    }

    loadDashboard();
    loadLoanRequests();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const raw = localStorage.getItem("user");
      if (!raw) {
        setError("You are not logged in.");
        setLoading(false);
        return;
      }

      const user = JSON.parse(raw);
      const res = await getClientDashboard(user.id);
      setData(res.data);

      try {
        const interestRes = await getInterestSummary(user.id);
        setInterestSummary(interestRes.data);
      } catch (interestErr) {
        console.log("INTEREST SUMMARY UNAVAILABLE:", interestErr);
        setInterestSummary(null);
      }
    } catch (err) {
      console.log("DASHBOARD ERROR:", err);
      setError("Something went wrong while loading dashboard.");
    } finally {
      setLoading(false);
    }
  }

  // ========= LOAD MY LOAN REQUESTS =========
  async function loadLoanRequests() {
    try {
      setLoadingReq(true);
      const res = await getMyLoanRequests();
      setLoanRequests(res.data);
    } catch (e) {
      console.log("LOAD LOAN REQUESTS ERROR", e);
    } finally {
      setLoadingReq(false);
    }
  }


  // ========= SUBMIT LOAN REQUEST =========
  async function submitLoanRequest(e: any) {
    e.preventDefault();
    setSubmitting(true);
    setLoanReqMsg("");

    try {
      await applyForLoan({
        requestedAmount: Number(loanForm.requestedAmount),
        requestedRate: Number(loanForm.requestedRate),
        termDays: Number(loanForm.termDays),
        purpose: loanForm.purpose,
      });

      setLoanReqMsg("✅ Loan request submitted successfully");

      setLoanForm({
        requestedAmount: "",
        requestedRate: "",
        termDays: "",
        purpose: "",
      });

      loadLoanRequests();
    } catch (err) {
      setLoanReqMsg("❌ Failed to submit loan request");
    } finally {
      setSubmitting(false);
    }
  }


  // ========= SMALL HELPERS =========
  const loans = data?.loans ?? [];

  const formattedNextPayment =
    data?.nextPaymentDate
      ? new Date(data.nextPaymentDate).toDateString()
      : "N/A";

  return (
    <div className="p-6 space-y-6">

      {/* TOP HEADING */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome, {userName || "User"}
        </h1>
        <p className="text-sm text-gray-500">
          Here’s a summary of your loans and upcoming payments.
        </p>
      </div>

      {/* ERROR BANNER */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* LOADING STATE */}
      {loading && !data && !error && (
        <div className="bg-white border rounded-xl shadow p-6 text-gray-500">
          Loading your dashboard...
        </div>
      )}

      {/* ========== SUMMARY CARDS ========== */}
      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SummaryCard
              title="Outstanding Amount"
              value={`₹ ${data.totalOutstanding}`}
              description="Total amount you still have to repay."
              icon="💰"
            />
            <SummaryCard
              title="Active Loans"
              value={data.activeLoanCount}
              description="Number of loans currently running."
              icon="📌"
            />
            <SummaryCard
              title="Interest Accrued"
              value={`₹ ${data.totalInterestAccrued}`}
              description="Interest calculated till today."
              icon="📈"
            />
            <SummaryCard
              title="Next Payment Date"
              value={formattedNextPayment}
              description="Your upcoming EMI / due date."
              icon="📅"
            />

            <SummaryCard
              title="Total Principal"
              value={`₹ ${data.totalPrincipal ?? 0}`}
              description="Original loan amount without interest."
              icon="🏦"
            />

            <SummaryCard
              title="Interest Pending"
              value={`₹ ${data.interestPending ?? 0}`}
              description="Current interest added to your loans."
              icon="🔥"
            />

            <SummaryCard
              title="Overdue Amount"
              value={`₹ ${data.overdueAmount ?? 0}`}
              description="Amount overdue (if any)."
              icon="⚠️"
            />

            <SummaryCard
              title="Next EMI Amount"
              value={`₹ ${data.nextEmiAmount ?? 0}`}
              description="Estimated next EMI."
              icon="💳"
            />


          </div>

          <DailyInterestSummary summary={interestSummary} fallback={data} />

          {/* ========== MY LOAN REQUESTS ========== */}
          <div className="bg-white rounded-xl shadow border mt-4">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <div>
                <h2 className="text-lg font-semibold">My Loan Requests</h2>
                <p className="text-xs text-gray-500">
                  Track your loan applications and approval status.
                </p>
              </div>
            </div>

            <div className="p-5">
              {loadingReq ? (
                <p className="text-sm text-gray-500">Loading requests...</p>
              ) : loanRequests.length === 0 ? (
                <p className="text-sm text-gray-500">No loan requests found.</p>
              ) : (
                <div className="space-y-3">
                  {loanRequests.map((r) => (
                    <LoanRequestRow key={r.id} req={r} />
                  ))}
                </div>
              )}
            </div>
          </div>


          {/* ========== RECENT LOANS SECTION ========== */}
          <div className="bg-white rounded-xl shadow border mt-4">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <div>
                <h2 className="text-lg font-semibold">Your Loans</h2>
                <p className="text-xs text-gray-500">
                  Overview of your recent loans and their current status.
                </p>
              </div>

              {/* Future: My Loans page ke liye */}
              <a
                href="/dashboard/client/loans"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                View all
              </a>
            </div>

            <div className="p-5">
              {loans.length === 0 ? (
                <p className="text-gray-500 text-sm">No Data Found</p>
              ) : (
                <div className="space-y-3">
                  {loans.slice(0, 3).map((loan: any) => (
                    <LoanRow key={loan.id} loan={loan} />
                  ))}
                </div>
              )}
            </div>

            {/* ========== APPLY FOR LOAN ========== */}
            <div className="bg-white rounded-xl shadow border p-6 mt-6">
              <h2 className="text-lg font-semibold mb-4">Apply for Loan</h2>

              <form
                onSubmit={submitLoanRequest}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <input
                  placeholder="Loan Amount"
                  value={loanForm.requestedAmount}
                  onChange={(e) =>
                    setLoanForm({ ...loanForm, requestedAmount: e.target.value })
                  }
                  className="border rounded px-3 py-2"
                  required
                />

                <input
                  placeholder="Interest Rate (%)"
                  value={loanForm.requestedRate}
                  onChange={(e) =>
                    setLoanForm({ ...loanForm, requestedRate: e.target.value })
                  }
                  className="border rounded px-3 py-2"
                  required
                />

                <input
                  placeholder="Term (days)"
                  value={loanForm.termDays}
                  onChange={(e) =>
                    setLoanForm({ ...loanForm, termDays: e.target.value })
                  }
                  className="border rounded px-3 py-2"
                  required
                />

                <input
                  placeholder="Purpose (optional)"
                  value={loanForm.purpose}
                  onChange={(e) =>
                    setLoanForm({ ...loanForm, purpose: e.target.value })
                  }
                  className="border rounded px-3 py-2 md:col-span-2"
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded px-4 py-2 md:col-span-2"
                >
                  {submitting ? "Submitting..." : "Apply for Loan"}
                </button>
              </form>

              {loanMsg && (
                <p className="text-sm mt-3 text-gray-600">{loanMsg}</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ========== SMALL COMPONENTS ========== */

function SummaryCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: any;
  description: string;
  icon: string;
}) {
  return (
    <div className="bg-white shadow rounded-xl border px-5 py-4 flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-xs">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        <p className="text-[11px] text-gray-400 mt-1">{description}</p>
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
  );
}

function LoanRow({ loan }: { loan: any }) {
  const statusColor: Record<string, string> = {
    APPROVED: "bg-green-50 text-green-700 border border-green-200",
    REJECTED: "bg-red-50 text-red-700 border border-red-200",
    PENDING: "bg-gray-100 text-gray-700 border border-gray-200",
  };

  return (
    <div className="border rounded-lg px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <p className="text-sm font-semibold">
          Loan #{loan.id.slice(0, 8)}
        </p>
        <p className="text-xs text-gray-500">
          Principal: ₹ {loan.principal} &nbsp;•&nbsp; Outstanding: ₹{" "}
          {loan.outstanding}
        </p>
      </div>

      <div className="flex gap-4 items-center text-xs">
        <div>
          <p className="text-gray-400 text-[11px]">Next Payment</p>
          <p className="font-medium">
            {loan.nextPaymentDate
              ? new Date(loan.nextPaymentDate).toDateString()
              : "N/A"}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-[11px] font-semibold ${statusColor[loan.status] || "bg-gray-100 text-gray-700"
            }`}
        >
          {loan.status}
        </span>
      </div>
    </div>
  );
}

function LoanRequestRow({ req }: { req: any }) {
  return (
    <div className="border rounded-lg px-4 py-3 flex justify-between items-center">
      <div>
        <p className="text-sm font-medium">
          ₹ {req.requestedAmount} • {req.termDays} days
        </p>
        <p className="text-xs text-gray-500">
          Rate: {req.requestedRate}%
        </p>
      </div>

      <span
        className={`px-3 py-1 rounded-full text-[11px] font-semibold ${req.status === "PENDING"
          ? "bg-yellow-100 text-yellow-800"
          : req.status === "APPROVED"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
          }`}
      >
        {req.status}
      </span>
    </div>
  );
}
