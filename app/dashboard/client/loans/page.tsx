"use client";

import { useEffect, useState, useMemo } from "react";
import { getMyLoans, payLoan } from "@/api/client";

type Loan = {
  id: string;
  principal: number;
  outstanding: number;
  status: "ACTIVE" | "CLOSED" | "OVERDUE" | string;
  nextPaymentDate?: string | null;
  createdAt?: string;
};

export default function ClientLoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // payment modal state
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [step, setStep] = useState<"FORM" | "PROCESSING" | "SUCCESS" | "ERROR">("FORM");
  const [payError, setPayError] = useState<string>("");

  // ================= LOAD LOANS =================
  useEffect(() => {
    loadLoans();
  }, []);

  async function loadLoans() {
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

      const res = await getMyLoans(user.id);
      setLoans(res.data.loans || []);
    } catch (err) {
      console.log("GET LOANS ERROR:", err);
      setError("Failed to load loans.");
    } finally {
      setLoading(false);
    }
  }

  // =============== OPEN PAYMENT MODAL ===============
  function openPaymentModal(loan: Loan) {
    setSelectedLoan(loan);
    // default: minimum 1000 or full outstanding if less
    const defaultAmount =
      Number(loan.outstanding) < 1000 ? Number(loan.outstanding) : 1000;
    setAmount(defaultAmount.toString());
    setStep("FORM");
    setPayError("");
  }

  function closePaymentModal() {
    setSelectedLoan(null);
    setAmount("");
    setStep("FORM");
    setPayError("");
  }

  // =============== HANDLE PAYMENT ===============
  async function handleSimulatePayment() {
    if (!selectedLoan) return;

    const amt = Number(amount);
    if (!amt || amt <= 0) {
      setPayError("Please enter a valid amount.");
      return;
    }
    if (amt > Number(selectedLoan.outstanding)) {
      setPayError("Amount cannot be more than outstanding.");
      return;
    }

    setStep("PROCESSING");
    setPayError("");

    try {
      // Thoda artificial delay for "processing" feel
      await new Promise((res) => setTimeout(res, 1800));

      await payLoan(selectedLoan.id, amt, "EMI");

      setStep("SUCCESS");

      // Loans list refresh
      await loadLoans();
    } catch (err) {
      console.log("PAYMENT ERROR:", err);
      setStep("ERROR");
      setPayError("Payment failed. Please try again.");
    }
  }

  // =============== FILTER / SORT (optional) ===============
  const activeLoans = useMemo(
    () => loans.filter((l) => l.status === "ACTIVE"),
    [loans]
  );

  // =================== UI START ===================
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold">My Loans</h1>
        <p className="text-sm text-gray-500">
          Track all your active and closed loans, and pay using UPI-style flow.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white border rounded-xl shadow p-6 text-gray-500">
          Loading loans...
        </div>
      ) : loans.length === 0 ? (
        <div className="bg-white border rounded-xl shadow p-6 text-gray-600 text-sm">
          You do not have any loans right now.
        </div>
      ) : (
        <>
          {/* SUMMARY BAR */}
          <div className="bg-white border rounded-xl shadow p-4 flex flex-wrap gap-4 justify-between items-center text-sm">
            <div>
              <p className="text-gray-400 text-xs">Total Loans</p>
              <p className="font-semibold">{loans.length}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Active Loans</p>
              <p className="font-semibold">{activeLoans.length}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Closed Loans</p>
              <p className="font-semibold">
                {loans.filter((l) => l.status === "CLOSED").length}
              </p>
            </div>
          </div>

          {/* LOANS LIST */}
          <div className="space-y-3">
            {loans.map((loan) => (
              <LoanRow
                key={loan.id}
                loan={loan}
                onPay={() => openPaymentModal(loan)}
              />
            ))}
          </div>
        </>
      )}

      {/* PAYMENT MODAL */}
      {selectedLoan && (
        <PaymentModal
          loan={selectedLoan}
          amount={amount}
          setAmount={setAmount}
          step={step}
          payError={payError}
          onClose={closePaymentModal}
          onSimulate={handleSimulatePayment}
        />
      )}
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function LoanRow({
  loan,
  onPay,
}: {
  loan: Loan;
  onPay: () => void;
}) {
  const statusColor: Record<string, string> = {
    ACTIVE: "bg-green-50 text-green-700 border border-green-200",
    OVERDUE: "bg-red-50 text-red-700 border border-red-200",
    CLOSED: "bg-gray-100 text-gray-700 border border-gray-200",
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <p className="text-sm font-semibold">
          Loan #{loan.id.slice(0, 8)}
        </p>
        <p className="text-xs text-gray-500">
          Principal: ₹ {loan.principal} • Outstanding: ₹ {loan.outstanding}
        </p>
        <p className="text-[11px] text-gray-400 mt-1">
          Next Payment:{" "}
          {loan.nextPaymentDate
            ? new Date(loan.nextPaymentDate).toDateString()
            : "N/A"}
        </p>
      </div>

      <div className="flex items-center gap-3 justify-between md:justify-end">
        <span
          className={`px-3 py-1 rounded-full text-[11px] font-semibold ${
            statusColor[loan.status] || "bg-gray-100 text-gray-700"
          }`}
        >
          {loan.status}
        </span>

        {loan.status === "ACTIVE" && (
          <button
            onClick={onPay}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            Pay Now
          </button>
        )}
      </div>
    </div>
  );
}

/* ================= PAYMENT MODAL ================= */

function PaymentModal({
  loan,
  amount,
  setAmount,
  step,
  payError,
  onClose,
  onSimulate,
}: {
  loan: Loan;
  amount: string;
  setAmount: (v: string) => void;
  step: "FORM" | "PROCESSING" | "SUCCESS" | "ERROR";
  payError: string;
  onClose: () => void;
  onSimulate: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
        {/* HEADER */}
        <div className="flex justify-between items-center px-5 py-3 border-b">
          <div>
            <h2 className="text-lg font-semibold">UPI Payment Simulation</h2>
            <p className="text-xs text-gray-500">
              Loan #{loan.id.slice(0, 8)} • Outstanding ₹ {loan.outstanding}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* LEFT: DETAILS + AMOUNT INPUT */}
          <div className="p-5 border-r border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Paying to</p>
            <p className="font-semibold">Loan App Pvt Ltd</p>
            <p className="text-xs text-gray-400 mb-4">
              UPI ID: loanapp@upi
            </p>

            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1">Amount</p>
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold">₹</span>
                <input
                  type="number"
                  className="border rounded-lg px-3 py-2 w-full text-lg"
                  value={amount}
                  min={1}
                  max={loan.outstanding}
                  disabled={step !== "FORM"}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Outstanding: ₹ {loan.outstanding}
              </p>
            </div>

            {payError && (
              <p className="text-xs text-red-500 mb-2">{payError}</p>
            )}

            {step === "FORM" && (
              <button
                onClick={onSimulate}
                className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
              >
                Proceed to Pay
              </button>
            )}

            {step === "ERROR" && (
              <button
                onClick={onSimulate}
                className="w-full bg-red-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-red-700"
              >
                Retry Payment
              </button>
            )}

            {step === "SUCCESS" && (
              <button
                onClick={onClose}
                className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-700"
              >
                Close
              </button>
            )}
          </div>

          {/* RIGHT: QR + STATUS */}
          <div className="p-5 flex flex-col items-center justify-center gap-4 bg-gray-50">
            {step === "FORM" && (
              <>
                <div className="w-40 h-40 bg-white border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-md" />
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Scan this QR with any UPI app (simulation).
                </p>
                <div className="flex gap-2 text-[11px] text-gray-500">
                  <span className="px-2 py-1 bg-white border rounded-full">
                    GPay
                  </span>
                  <span className="px-2 py-1 bg-white border rounded-full">
                    PhonePe
                  </span>
                  <span className="px-2 py-1 bg-white border rounded-full">
                    Paytm
                  </span>
                </div>
              </>
            )}

            {step === "PROCESSING" && (
              <>
                <div className="w-16 h-16 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
                <p className="text-sm font-medium text-gray-700">
                  Processing UPI payment...
                </p>
                <p className="text-[11px] text-gray-400 text-center">
                  Please do not refresh or close this window.
                </p>
              </>
            )}

            {step === "SUCCESS" && (
              <>
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-3xl">✅</span>
                </div>
                <p className="text-sm font-semibold text-green-700">
                  Payment Successful
                </p>
                <p className="text-[11px] text-gray-500 text-center">
                  Your payment has been applied to this loan. Dashboard and
                  amounts are now updated.
                </p>
              </>
            )}

            {step === "ERROR" && (
              <>
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-3xl">⚠️</span>
                </div>
                <p className="text-sm font-semibold text-red-700">
                  Payment Failed
                </p>
                <p className="text-[11px] text-gray-500 text-center">
                  We could not complete the simulated payment. Please try
                  again.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
