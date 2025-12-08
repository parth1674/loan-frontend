"use client";

import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface StepProps {
  form: any;
  update: (key: string, value: any) => void;
  next: () => void;
}

export default function Step1Basic({
  form,
  update,
  next,
}: StepProps) {
  // Country-wise mobile length
  const COUNTRY_DIGITS: Record<string, number> = {
    IN: 10,
    AE: 9,
    SA: 9,
    US: 10,
    NP: 10,
    UK: 10,
    CA: 10,
    AU: 9,
    SG: 8,
    PK: 11,
    BD: 11,
    QA: 8,
  };

  const formatName = (value: string) =>
    value
      ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
      : "";

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,16}$/.test(password);

  function validate() {
    if (!form.firstName.trim()) return alert("First Name is required");
    if (!/^[A-Za-z]+$/.test(form.firstName))
      return alert("First Name should contain only letters");

    // Last Name (optional but if entered → must be letters only)
    if (form.lastName.trim() && !/^[A-Za-z]+$/.test(form.lastName))
      return alert("Last Name should contain only letters");

    if (!form.email.trim()) return alert("Email is required");
    if (!isValidEmail(form.email)) return alert("Invalid Email");

    if (form.contact.length !== form.maxLength)
      return alert(
        `Please enter valid ${form.maxLength}-digit mobile number`
      );

    if (!form.password.trim()) return alert("Password is required");
    if (!isValidPassword(form.password))
      return alert(
        "Password must be 8–16 chars with uppercase, lowercase, number & special character"
      );

    next();
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Basic Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* First Name */}
        <div>
          <label className="block text-sm mb-1">First Name *</label>
          <input
            type="text"
            value={form.firstName}
            suppressHydrationWarning={true}
            onChange={(e) => {
              let v = e.target.value.replace(/[^A-Za-z]/g, "");   // letters only
              v = v.charAt(0).toUpperCase() + v.slice(1).toLowerCase(); // auto format
              update("firstName", v);
            }}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter first name"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm mb-1">Last Name</label>
          <input
            type="text"
            value={form.lastName}
            suppressHydrationWarning={true}
            onChange={(e) => {
              let v = e.target.value.replace(/[^A-Za-z]/g, "");   // letters only
              v = v.charAt(0).toUpperCase() + v.slice(1).toLowerCase(); // auto format
              update("lastName", v);
            }}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter last name"
          />

        </div>

        {/* Contact */}
        <div>
          <label className="block text-sm mb-1">Contact Number *</label>

          <PhoneInput
            country={"in"}
            value={form.fullPhone}
            inputStyle={{ width: "100%", height: "42px" }}
            buttonClass="bg-white"
            containerClass="w-full"
            disableDropdown={false}
            countryCodeEditable={false}
            enableAreaCodes={false}
            enableLongNumbers={false}
            onChange={(value, country: any) => {
              const dial = country.dialCode;
              const iso = country.countryCode.toUpperCase();
              const maxDigits = COUNTRY_DIGITS[iso] || 10;

              // Only digits
              let digitsOnly = value.replace(/\D/g, "");

              // remove country dial from editing value
              if (digitsOnly.startsWith(dial)) {
                digitsOnly = digitsOnly.slice(dial.length);
              }

              // HARD STOP - prevent typing more
              digitsOnly = digitsOnly.slice(0, maxDigits);

              const finalFullPhone = dial + digitsOnly;

              update("fullPhone", finalFullPhone);
              update("contact", digitsOnly);
              update("maxLength", maxDigits);
              update("countryIso", iso);
              update("countryDialCode", dial);
            }}
          />

          {/* Error Display */}
          {form.contact &&
            form.contact.length !== form.maxLength && (
              <p className="text-red-500 text-xs mt-1">
                Enter {form.maxLength}-digit mobile number
              </p>
            )}
        </div>

        {/* Alternate Contact */}
        <div>
          <label className="block text-sm mb-1">Alternate Contact</label>
          <input
            type="text"
            value={form.altContact}
            onChange={(e) =>
              update("altContact", e.target.value.replace(/[^0-9]/g, ""))
            }
            className="w-full border rounded px-3 py-2"
            placeholder="Enter alternate number"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm mb-1">Email *</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter email"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm mb-1">Password *</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter secure password"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={validate}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
