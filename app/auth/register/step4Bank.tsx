"use client";

import { useState } from "react";

interface StepProps {
  form: any;
  update: (key: string, value: any) => void;
  next: () => void;
  back: () => void;
}

export default function Step4Bank({
  form,
  update,
  next,
  back,
}: StepProps) {

  const [ifscLoading, setIfscLoading] = useState(false);
  const [nameError, setNameError] = useState("");

  // ----------------------------
  // NAME VALIDATION
  // ----------------------------
  function handleAccountHolderName(value: string) {
    // Allow only letters + spaces
    const cleaned = value.replace(/[^A-Za-z ]/g, "");

    // Auto capitalize first letter
    const formatted =
      cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();

    update("accountHolderName", formatted);

    // Real-time validation message
    if (cleaned !== value) {
      setNameError("Only letters are allowed");
    } else {
      setNameError("");
    }
  }

  // ----------------------------
  // IFSC AUTO FETCH API
  // ----------------------------
  async function fetchBankDetails(ifsc: string) {
    if (ifsc.length < 11) return;

    try {
      setIfscLoading(true);

      const res = await fetch(`https://ifsc.razorpay.com/${ifsc}`);
      const data = await res.json();

      if (data && data.BANK) {
        update("bankName", data.BANK);
        update("branch", data.BRANCH);
        update("city", data.CITY);
        update("state", data.STATE);
      } else {
        alert("Invalid IFSC Code");
      }
    } catch (err) {
      console.log(err);
      alert("Error fetching IFSC details");
    } finally {
      setIfscLoading(false);
    }
  }

  // ---------------------------
  // VALIDATE ALL FIELDS
  // ---------------------------
  function validate() {
    if (!form.accountHolderName.trim())
      return alert("Account holder name is required");

    if (nameError)
      return alert("Account Holder Name contains invalid characters");

    if (!form.accountNumber.trim())
      return alert("Account number is required");

    if (!form.ifsc.trim() || form.ifsc.length !== 11)
      return alert("Valid IFSC is required");

    if (!form.bankName.trim())
      return alert("Bank name is required");

    if (!form.branch.trim())
      return alert("Branch is required");

    if (!form.city.trim())
      return alert("City is required");

    if (!form.state.trim())
      return alert("State is required");

    if (!form.chequeUrl)
      return alert("Cancelled Cheque / Passbook upload is required");

    next();
  }

  // ----------------------------
  // FILE UPLOAD HANDLER
  // ----------------------------
  function handleFileUpload(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    update("chequeUrl", preview);
    update("cheque", file);
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Bank Account Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ACCOUNT HOLDER NAME */}
        <div>
          <label className="block text-sm mb-1">Account Holder Name *</label>
          <input
            type="text"
            value={form.accountHolderName}
            onChange={(e) => handleAccountHolderName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter account holder name"
          />

          {nameError && (
            <p className="text-red-500 text-xs mt-1">{nameError}</p>
          )}
        </div>

        {/* ACCOUNT NUMBER */}
        <div>
          <label className="block text-sm mb-1">Account Number *</label>
          <input
            type="text"
            value={form.accountNumber}
            onChange={(e) => update("accountNumber", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* IFSC CODE */}
        <div>
          <label className="block text-sm mb-1">IFSC Code *</label>
          <input
            type="text"
            maxLength={11}
            className="w-full border rounded px-3 py-2 uppercase"
            value={form.ifsc}
            onChange={(e) => {
              update("ifsc", e.target.value.toUpperCase());
              if (e.target.value.length === 11) {
                fetchBankDetails(e.target.value.toUpperCase());
              }
            }}
          />

          {ifscLoading && (
            <p className="text-blue-500 text-xs mt-1">Fetching bank details...</p>
          )}
        </div>

        {/* BANK NAME */}
        <div>
          <label className="block text-sm mb-1">Bank Name *</label>
          <input
            type="text"
            disabled
            value={form.bankName}
            className="w-full border rounded px-3 py-2 bg-gray-100"
          />
        </div>

        {/* BRANCH */}
        <div>
          <label className="block text-sm mb-1">Branch *</label>
          <input
            type="text"
            disabled
            value={form.branch}
            className="w-full border rounded px-3 py-2 bg-gray-100"
          />
        </div>

        {/* CITY */}
        <div>
          <label className="block text-sm mb-1">City *</label>
          <input
            type="text"
            disabled
            value={form.city}
            className="w-full border rounded px-3 py-2 bg-gray-100"
          />
        </div>

        {/* STATE */}
        <div>
          <label className="block text-sm mb-1">State *</label>
          <input
            type="text"
            disabled
            value={form.state}
            className="w-full border rounded px-3 py-2 bg-gray-100"
          />
        </div>

        {/* CHEQUE UPLOAD */}
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">
            Upload Cancelled Cheque / Passbook Front Page *
          </label>

          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileUpload}
            className="w-full border rounded px-3 py-2"
          />

          {form.chequeUrl && (
            <img
              src={form.chequeUrl}
              alt="Cheque Preview"
              className="mt-3 h-40 border rounded object-cover"
            />
          )}
        </div>
      </div>

      {/* BUTTONS */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={back}
          className="bg-gray-300 text-black px-6 py-2 rounded hover:bg-gray-400"
        >
          ← Back
        </button>

        <button
          onClick={validate}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
