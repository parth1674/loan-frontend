"use client";

import { useState, useEffect } from "react";
import { getAllUsers } from "@/api/admin";
import API from "@/api/axios";
import { useRouter } from "next/navigation";

export default function CreateLoanPage() {
  const router = useRouter();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState("");
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [termDays, setTermDays] = useState("");
  const [startDate, setStartDate] = useState("");
  const [frequency, setFrequency] = useState("MONTHLY");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load user list
  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (err) {
      console.log("User load error:", err);
    }
    setLoading(false);
  }

  // Create Loan
  async function handleCreateLoan() {
    if (!userId || !principal || !rate || !termDays) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      const res = await API.post(
        `/loan/create/${userId}`,
        {
          principal: Number(principal),
          annualRate: Number(rate),
          termDays: Number(termDays),
          startDate,
          paymentFrequency: frequency,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess("Loan created successfully!");

      setTimeout(() => router.push("/dashboard/admin/loans"), 1500);
    } catch (err: any) {
      console.log(err);
      setError(err.response?.data?.message || "Loan creation failed");
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Create Loan</h1>

      {error && <p className="text-red-500 mb-3">{error}</p>}
      {success && <p className="text-green-600 mb-3">{success}</p>}

      {/* USER SELECT */}
      <label className="block font-semibold mb-1">Select User</label>
      <select
        className="border px-3 py-2 rounded w-full mb-4"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      >
        <option value="">-- Select User --</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.fullname} ({u.email})
          </option>
        ))}
      </select>

      {/* PRINCIPAL */}
      <label className="block font-semibold mb-1">Principal Amount (₹)</label>
      <input
        type="number"
        className="border px-3 py-2 rounded w-full mb-4"
        value={principal}
        onChange={(e) => setPrincipal(e.target.value)}
        placeholder="50000"
      />

      {/* INTEREST RATE */}
      <label className="block font-semibold mb-1">Annual Interest Rate (%)</label>
      <input
        type="number"
        className="border px-3 py-2 rounded w-full mb-4"
        value={rate}
        onChange={(e) => setRate(e.target.value)}
        placeholder="10"
      />

      {/* DURATION */}
      <label className="block font-semibold mb-1">Term (days)</label>
      <input
        type="number"
        className="border px-3 py-2 rounded w-full mb-4"
        value={termDays}
        onChange={(e) => setTermDays(e.target.value)}
        placeholder="For example: 90"
      />

      {/* START DATE */}
      <label className="block font-semibold mb-1">Start Date</label>
      <input
        type="date"
        className="border px-3 py-2 rounded w-full mb-4"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      {/* PAYMENT FREQUENCY */}
      <label className="block font-semibold mb-1">Payment Frequency</label>
      <select
        className="border px-3 py-2 rounded w-full mb-6"
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
      >
        <option value="DAILY">Daily</option>
        <option value="WEEKLY">Weekly</option>
        <option value="MONTHLY">Monthly</option>
      </select>

      <button
        onClick={handleCreateLoan}
        className="bg-blue-600 text-white px-5 py-2 rounded"
      >
        Create Loan
      </button>
    </div>
  );
}
