"use client";

import { useEffect, useState } from "react";
import {
  getAllLoanRequests,
  approveLoanRequest,
  rejectLoanRequest,
} from "@/api/loanRequestAdmin";

export default function AdminLoanRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [note, setNote] = useState("");

  async function loadRequests() {
    setLoading(true);
    const res = await getAllLoanRequests();
    setRequests(res.data);
    setLoading(false);
  }

  async function approve(id: string) {
    setActionId(id);
    await approveLoanRequest(id, note);
    setNote("");
    await loadRequests();
    setActionId(null);
  }

  async function reject(id: string) {
    setActionId(id);
    await rejectLoanRequest(id, note);
    setNote("");
    await loadRequests();
    setActionId(null);
  }

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Loan Requests</h1>

      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-500">No loan requests found.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((r) => (
            <div
              key={r.id}
              className="bg-white border rounded-xl p-4 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">
                    {r.user?.fullname || "User"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Amount: ₹{r.requestedAmount} | Rate: {r.requestedRate}% |
                    Term: {r.termDays} days
                  </p>
                  <p className="text-xs mt-1">
                    Status:{" "}
                    <span className="font-semibold">{r.status}</span>
                  </p>
                </div>

                {r.status === "PENDING" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => approve(r.id)}
                      disabled={actionId === r.id}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => reject(r.id)}
                      disabled={actionId === r.id}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>

              {r.status === "PENDING" && (
                <textarea
                  placeholder="Admin note (optional)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="mt-3 w-full border rounded p-2 text-sm"
                />
              )}

              {r.adminNote && (
                <p className="text-xs text-gray-600 mt-2">
                  Admin note: {r.adminNote}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
