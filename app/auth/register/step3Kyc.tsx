"use client";

interface StepProps {
  form: any;
  update: (key: string, value: any) => void;
  next: () => void;
  back: () => void;
}

export default function Step3KYC({
  form,
  update,
  next,
  back,
}: StepProps) {

  function validateAadhaar(value: string) {
    return /^[0-9]{12}$/.test(value);
  }

  function validatePAN(value: string) {
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value);
  }

  function validateFile(file: File, allowed: string[], maxMB: number) {
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (!allowed.includes(ext || "")) {
      alert(`Allowed formats: ${allowed.join(", ")}`);
      return false;
    }

    if (file.size > maxMB * 1024 * 1024) {
      alert(`File too large. Max allowed ${maxMB}MB`);
      return false;
    }

    return true;
  }

  // FIXED MAPPING
  const fileKeyMap: any = {
    aadhaarUrl: "aadhaar",
    panUrl: "pan",
    photoUrl: "photo",
  };

  function handleFileUpload(e: any, key: string) {
    const file = e.target.files?.[0];
    if (!file) return;

    const backendKey = fileKeyMap[key]; // convert to correct backend key

    let allowed: string[] = [];
    let maxSize = 5;

    if (key === "aadhaarUrl") allowed = ["jpg", "jpeg", "png", "pdf"];
    if (key === "panUrl") allowed = ["jpg", "jpeg", "png", "pdf"];
    if (key === "photoUrl") {
      allowed = ["jpg", "jpeg", "png"];
      maxSize = 3;
    }

    if (!validateFile(file, allowed, maxSize)) return;

    const preview = URL.createObjectURL(file);

    update(key, preview);
    update(backendKey, file); // correct field for backend
  }

  function validate() {
    const cleanAadhaar = form.aadhaarNumber.replace(/\s/g, "");

    if (!validateAadhaar(cleanAadhaar)) {
      return alert("Invalid Aadhaar. Must be 12 digits.");
    }

    if (!validatePAN(form.panNumber)) {
      return alert("Invalid PAN format.");
    }

    if (!form.aadhaarUrl) return alert("Upload Aadhaar.");
    if (!form.panUrl) return alert("Upload PAN.");
    if (!form.photoUrl) return alert("Upload Photo.");

    next();
  }


  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">KYC Verification</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Aadhaar Number */}
        {/* AADHAAR NUMBER */}
        <div>
          <label className="block text-sm font-medium mb-1 flex items-center gap-1">
            Aadhaar Number *
            <span className="text-gray-400 text-[11px]">(12 digits)</span>
          </label>

          <div className="relative">
            <input
              type="text"
              maxLength={14} // because of spaces
              value={form.aadhaarNumber}
              suppressHydrationWarning={true}
              onChange={(e) => {
                let v = e.target.value.replace(/\D/g, "");
                if (v.length > 12) v = v.slice(0, 12);
                const formatted = v.replace(/(\d{4})(?=\d)/g, "$1 ");
                update("aadhaarNumber", formatted);
              }}
              className={`w-full border rounded px-3 py-2 pr-10 transition 
        focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        ${form.aadhaarNumber.replace(/\s/g, "").length === 12 &&
                  validateAadhaar(form.aadhaarNumber.replace(/\s/g, ""))
                  ? "border-green-500"
                  : ""
                }
      `}
              placeholder="1234 5678 9012"
            />

            {/* ✔ GREEN CHECK */}
            {form.aadhaarNumber.replace(/\s/g, "").length === 12 &&
              validateAadhaar(form.aadhaarNumber.replace(/\s/g, "")) && (
                <span className="absolute right-3 top-2.5 text-green-600 font-bold text-lg">
                  ✓
                </span>
              )}
          </div>

          {/* ❌ ERROR TEXT */}
          {form.aadhaarNumber.length > 0 &&
            !validateAadhaar(form.aadhaarNumber.replace(/\s/g, "")) && (
              <p className="text-red-500 text-xs mt-1 animate-pulse">
                Aadhaar must be exactly 12 digits.
              </p>
            )}

          {/* 👁 Masked Preview */}
          {validateAadhaar(form.aadhaarNumber.replace(/\s/g, "")) && (
            <p className="text-green-600 text-xs mt-1">
              Preview: xxxx-xxxx-{form.aadhaarNumber.replace(/\s/g, "").slice(8)}
            </p>
          )}
        </div>



        {/* PAN Number */}
        {/* PAN NUMBER */}
        <div>
          <label className="block text-sm font-medium mb-1 flex items-center gap-1">
            PAN Number *
            <span className="text-gray-400 text-[11px]">(ABCDE1234F)</span>
          </label>

          <div className="relative group">
            <input
              type="text"
              maxLength={10}
              value={form.panNumber}
              suppressHydrationWarning={true}
              onChange={(e) => {
                const v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
                update("panNumber", v);
              }}
              className={`w-full border rounded px-3 py-2 pr-10 transition
        focus:ring-2 focus:ring-purple-500 focus:border-purple-500
        ${validatePAN(form.panNumber) && form.panNumber.length === 10
                  ? "border-green-500"
                  : ""
                }
      `}
              placeholder="ABCDE1234F"
            />

            {/* ✔ GREEN CHECK */}
            {form.panNumber.length === 10 && validatePAN(form.panNumber) && (
              <span className="absolute right-3 top-2.5 text-green-600 font-bold text-lg">
                ✓
              </span>
            )}

            {/* Tooltip */}
            <div className="absolute -top-8 right-0 hidden group-hover:block 
      bg-black text-white text-[10px] px-2 py-1 rounded shadow">
              Format: 5 letters + 4 digits + 1 letter
            </div>
          </div>

          {/* ❌ ERROR */}
          {form.panNumber.length > 0 &&
            !validatePAN(form.panNumber) && (
              <p className="text-red-500 text-xs mt-1 animate-pulse">
                PAN must follow ABCDE1234F format.
              </p>
            )}
        </div>



        {/* Aadhaar Upload */}
        <div>
          <label className="block text-sm mb-1">Upload Aadhaar *</label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => handleFileUpload(e, "aadhaarUrl")}
            className="w-full border rounded px-3 py-2"
          />

          {form.aadhaarUrl && (
            <img src={form.aadhaarUrl} className="mt-2 h-32 border rounded object-cover" />
          )}
        </div>

        {/* PAN Upload */}
        <div>
          <label className="block text-sm mb-1">Upload PAN *</label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => handleFileUpload(e, "panUrl")}
            className="w-full border rounded px-3 py-2"
          />



          {form.panUrl && (
            <img src={form.panUrl} className="mt-2 h-32 border rounded object-cover" />
          )}
        </div>

        {/* Photo Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Passport Photo *</label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => handleFileUpload(e, "photoUrl")}
            className="w-full border rounded px-3 py-2"
          />

          {form.photoUrl && (
            <img
              src={form.photoUrl}
              className="mt-3 h-32 w-32 rounded-full border shadow object-cover"
            />
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button onClick={back} className="bg-gray-300 text-black px-6 py-2 rounded">
          ← Back
        </button>

        <button onClick={validate} className="bg-blue-600 text-white px-6 py-2 rounded">
          Next →
        </button>
      </div>
    </div>
  );
}
