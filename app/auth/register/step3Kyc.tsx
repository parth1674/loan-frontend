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
    if (!validateAadhaar(form.aadhaarNumber)) {
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
        <div>
          <label className="block text-sm mb-1">Aadhaar Number *</label>
          <input
            type="text"
            maxLength={12}
            value={form.aadhaarNumber}
            suppressHydrationWarning={true}
            onChange={(e) => update("aadhaarNumber", e.target.value.replace(/\D/g, ""))}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* PAN Number */}
        <div>
          <label className="block text-sm mb-1">PAN Number *</label>
          <input
            type="text"
            maxLength={10}
            value={form.panNumber}
            suppressHydrationWarning={true}
            onChange={(e) =>
              update("panNumber", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))
            }
            className="w-full border rounded px-3 py-2"
          />
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
