"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Step1Basic from "./step1Basic";
import Step2Personal from "./step2Personal";
import Step3Kyc from "./step3Kyc";
import Step4Bank from "./step4Bank";
import Step5Review from "./step5Review";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<any>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    contact: "",
    altContact: "",

    fatherName: "",
    dob: "",
    profession: "",
    annualIncome: "",
    communicationAddress: "",
    permanentAddress: "",

    aadhaarNumber: "",
    panNumber: "",
    aadhaarUrl: "",
    panUrl: "",
    photoUrl: "",

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
    setForm((p: any) => ({ ...p, [key]: value }));
  }

  async function finalSubmit() {
    try {
      setLoading(true);
      const fd = new FormData();

      Object.entries(form).forEach(([k, v]: any) => {
        if (v) fd.append(k, v);
      });

      const res = await fetch(
        "https://finance-app-i0ff.onrender.com/auth/register-complete",
        {
          method: "POST",
          body: fd,
        }
      );

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed");
        return;
      }

      router.push("/auth/registration-success");
    } catch (e) {
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0F1D] flex items-center justify-center p-4 relative overflow-hidden">

      {/* BEAUTIFUL BG LIGHTS */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/30 blur-[140px] rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-600/30 blur-[140px] rounded-full"></div>

      {/* CARD */}
      <div className="relative w-full max-w-2xl bg-white/10 backdrop-blur-2xl border border-white/20 
        rounded-3xl shadow-2xl p-8 animate-fadeIn">

        {/* TITLE */}
        <h1 className="text-4xl font-extrabold text-center mb-8 
          bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent tracking-wide">
          Create Your Account
        </h1>

        {/* STEP CONTAINER */}
        <div className="transition-all duration-300 ease-in-out text-gray-200 
                [&_input]:text-black [&_input::placeholder]:text-gray-400">
          {step === 1 && <Step1Basic form={form} update={updateField} next={() => setStep(2)} />}
          {step === 2 && <Step2Personal form={form} update={updateField} next={() => setStep(3)} prev={() => setStep(1)} />}
          {step === 3 && <Step3Kyc form={form} update={updateField} next={() => setStep(4)} back={() => setStep(2)} />}
          {step === 4 && <Step4Bank form={form} update={updateField} next={() => setStep(5)} back={() => setStep(3)} />}
          {step === 5 && <Step5Review form={form} back={() => setStep(4)} next={() => setStep(4)} finalSubmit={finalSubmit} />}
        </div>

        {/* PROGRESS BAR */}
        <div className="mt-10">
          <div className="flex justify-between text-white/60 text-xs font-medium mb-1 px-1">
            <span>Step {step}</span>
            <span>5 Steps</span>
          </div>

          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${(step / 5) * 100}%` }}
            ></div>
          </div>
        </div>

      </div>
    </div>
  );
}
