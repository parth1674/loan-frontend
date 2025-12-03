"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Step1Basic from "./step1Basic";
import Step2Personal from "./step2Personal";
import Step3Kyc from "./step3Kyc";
import Step4Bank from "./step4Bank";
import Step5Review from "./step5Review";
import { registerUser } from "@/api/auth";
export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<any>({
    // Step 1
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    contact: "",
    altContact: "",

    // Step 2
    fatherName: "",
    dob: "",
    profession: "",
    annualIncome: "",
    communicationAddress: "",
    permanentAddress: "",

    // Step 3
    aadhaarNumber: "",
    panNumber: "",
    aadhaarUrl: "",
    panUrl: "",
    photoUrl: "",

    // Step 4
    accountHolderName: "",
    accountNumber: "",
    ifsc: "",
    bankName: "",
    branch: "",
    city: "",
    state: "",
    chequeUrl: "",
  });

  function updateField(key: string, value: any) {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  }

  async function finalSubmit() {
    try {
      setLoading(true);

      const fd = new FormData();

      // BASIC DETAILS
      fd.append("firstName", form.firstName);
      fd.append("lastName", form.lastName || "");
      fd.append("email", form.email);
      fd.append("password", form.password);
      fd.append("contact", form.contact);
      fd.append("countryDialCode", form.countryDialCode.toString());
      fd.append("altContact", form.altContact || "");

      // PERSONAL DETAILS
      fd.append("fatherName", form.fatherName);
      fd.append("dob", form.dob);
      fd.append("profession", form.profession);
      fd.append("annualIncome", form.annualIncome);
      fd.append("communicationAddress", form.communicationAddress);
      fd.append("permanentAddress", form.permanentAddress);

      // KYC DETAILS
      fd.append("aadhaarNumber", form.aadhaarNumber);
      fd.append("panNumber", form.panNumber);

      if (form.aadhaarUrl_file) fd.append("aadhaar", form.aadhaarUrl_file);
      if (form.panUrl_file) fd.append("pan", form.panUrl_file);
      if (form.photoUrl_file) fd.append("photo", form.photoUrl_file);

      // BANK DETAILS
      fd.append("accountHolderName", form.accountHolderName);
      fd.append("accountNumber", form.accountNumber);
      fd.append("ifsc", form.ifsc);
      fd.append("bankName", form.bankName);
      fd.append("branch", form.branch);
      fd.append("city", form.city);
      fd.append("state", form.state);

      if (form.chequeFile) fd.append("cheque", form.chequeFile);

      // HIT API
      const res = await fetch("https://finance-app-i0ff.onrender.com/auth/register-complete", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      router.push("/auth/registration-success");
    } catch (err) {
      console.log(err);
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-2xl p-6">

        <h1 className="text-3xl font-bold text-center mb-6">
          Register Account
        </h1>

        {/* STEP VIEW */}
        {step === 1 && <Step1Basic form={form} update={updateField} next={() => setStep(2)} />}
        {step === 2 && <Step2Personal form={form} update={updateField} next={() => setStep(3)} prev={() => setStep(1)} />}
        {step === 3 && <Step3Kyc form={form} update={updateField} next={() => setStep(4)} back={() => setStep(2)} />}
        {step === 4 && <Step4Bank form={form} update={updateField} next={() => setStep(5)} back={() => setStep(3)} />}
        {step === 5 && <Step5Review form={form} back={() => setStep(4)} next={() => setStep(4)} finalSubmit={finalSubmit} />}

        {/* Step Indicator */}
        <div className="mt-6 text-center text-gray-500">
          Step {step} / 5
        </div>
      </div>
    </div>
  );
}
