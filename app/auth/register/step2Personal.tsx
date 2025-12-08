"use client";

import { useState } from "react";

interface StepProps {
  form: any;
  update: (key: string, value: any) => void;
  next: () => void;
  prev: () => void;
}

export default function Step2Personal({
  form,
  update,
  next,
  prev,
}: StepProps) {
  const [sameAddress, setSameAddress] = useState(false);

  // ---------- VALIDATIONS ----------
  const formatName = (v: string) =>
    v ? v.charAt(0).toUpperCase() + v.slice(1).toLowerCase() : "";

  const isValidName = (v: string) => /^[A-Za-z ]+$/.test(v);

  const is18Plus = (dobStr: string) => {
    const dob = new Date(dobStr);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();

    return age > 18 || (age === 18 && m >= 0);
  };

  function validate() {
    // Father’s Name
    if (!form.fatherName.trim())
      return alert("Father’s Name is required");
    if (!isValidName(form.fatherName))
      return alert("Father’s Name must contain only letters");

    // DOB
    if (!form.dob) return alert("Date of Birth is required");
    if (!is18Plus(form.dob))
      return alert("Age must be 18 or above");

    // Profession
    if (!form.profession.trim())
      return alert("Profession is required");
    if (!isValidName(form.profession))
      return alert("Profession should contain only letters");

    // Annual Income
    if (!form.annualIncome.trim())
      return alert("Annual Income is required");

    if (isNaN(Number(form.annualIncome)))
      return alert("Annual Income must be a number");

    if (Number(form.annualIncome) <= 0)
      return alert("Annual Income must be positive");

    // Communication Address
    if (!form.communicationAddress.trim())
      return alert("Communication Address is required");

    if (form.communicationAddress.length < 10)
      return alert("Address must be at least 10 characters");

    // Permanent Address
    if (!form.permanentAddress.trim())
      return alert("Permanent Address is required");

    if (form.permanentAddress.length < 10)
      return alert("Permanent Address must be at least 10 characters");

    next();
  }

  // ---------- UI ----------
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Personal Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Father’s Name */}
        <div>
          <label className="block text-sm mb-1">Father’s Name *</label>
          <input
            type="text"
            value={form.fatherName}
            onChange={(e) =>
              update("fatherName", formatName(e.target.value))
            }
            className="w-full border rounded px-3 py-2"
            placeholder="Enter father's full name"
          />
        </div>

        {/* DOB */}
        <div>
          <label className="block text-sm mb-1">Date of Birth *</label>
          <input
            type="date"
            value={form.dob}
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) => update("dob", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Profession */}
        <div>
          <label className="block text-sm mb-1">Profession *</label>
          <input
            type="text"
            value={form.profession}
            onChange={(e) =>
              update("profession", formatName(e.target.value))
            }
            className="w-full border rounded px-3 py-2"
            placeholder="Enter profession"
          />
        </div>

        {/* Annual Income */}
        <div>
          <label className="block text-sm mb-1">Annual Income *</label>
          <input
            type="number"
            min="0"
            value={form.annualIncome}
            onChange={(e) =>
              update("annualIncome", e.target.value.replace(/[^0-9]/g, ""))
            }
            className="w-full border rounded px-3 py-2"
            placeholder="Enter yearly income"
          />
        </div>
      </div>

      {/* Addresses */}
      <div className="mt-4">
        <label className="block text-sm mb-1">
          Communication Address *
        </label>
        <textarea
          value={form.communicationAddress}
          onChange={(e) => update("communicationAddress", e.target.value)}
          className="w-full border rounded px-3 py-2 h-24"
          placeholder="Enter communication address"
        ></textarea>

        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={sameAddress}
            onChange={(e) => {
              setSameAddress(e.target.checked);
              if (e.target.checked) {
                update("permanentAddress", form.communicationAddress);
              }
            }}
          />
          <label className="text-sm">
            Same as communication address
          </label>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm mb-1">
          Permanent Address *
        </label>
        <textarea
          value={form.permanentAddress}
          onChange={(e) =>
            update("permanentAddress", e.target.value)
          }
          className="w-full border rounded px-3 py-2 h-24"
          placeholder="Enter permanent address"
        ></textarea>
      </div>

      {/* BUTTONS */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={prev}
          className="bg-gray-300 text-black px-6 py-2 rounded"
        >
          ← Back
        </button>

        <button
          onClick={validate}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
