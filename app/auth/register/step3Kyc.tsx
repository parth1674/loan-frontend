"use client";

export default function Step3KYC({
  form,
  update,
  next,
  back,
}: {
  form: any;
  update: (key: string, value: any) => void;
  next: () => void;
  back: () => void;
}) {
  // ----------------------------
  // STRICT VALIDATION HELPERS
  // ----------------------------

  function validateAadhaar(value: string) {
    return /^[0-9]{12}$/.test(value);
  }

  function validatePAN(value: string) {
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value);
  }

  // ✔ File validation for upload fields
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

  // ✔ Upload handler with strict validation
  function handleFileUpload(e: any, key: string) {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    update(key, preview);           // for preview
    update(key + "_file", file);    // store actual file for backend

    let allowed: string[] = [];
    let maxSize = 5;

    if (key === "aadhaarUrl") {
      allowed = ["jpg", "jpeg", "png", "pdf"];
      maxSize = 5;
    }

    if (key === "panUrl") {
      allowed = ["jpg", "jpeg", "png", "pdf"];
      maxSize = 5;
    }

    if (key === "photoUrl") {
      allowed = ["jpg", "jpeg", "png"];
      maxSize = 3;
    }

    // validate file
    if (!validateFile(file, allowed, maxSize)) return;

    // preview URL
    const previewUrl = URL.createObjectURL(file);

    update(key, previewUrl);
    update(key + "_file", file); // actual file store also
  }

  // ----------------------------
  // VALIDATE BEFORE NEXT
  // ----------------------------
  function validate() {
    // Aadhaar number strict validation
    if (!validateAadhaar(form.aadhaarNumber)) {
      return alert("Invalid Aadhaar. Must be exactly 12 digits.");
    }

    // PAN strict validation
    if (!validatePAN(form.panNumber)) {
      return alert("Invalid PAN Format. Should be ABCDE1234F");
    }

    // Upload validation
    if (!form.aadhaarUrl) return alert("Please upload Aadhaar card.");
    if (!form.panUrl) return alert("Please upload PAN card.");
    if (!form.photoUrl) return alert("Please upload Passport photo.");

    next();
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">KYC Verification</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Aadhaar Number (UNCHANGED) */}
        <div>
          <label className="block text-sm mb-1">Aadhaar Number *</label>
          <input
            type="text"
            maxLength={12}
            value={form.aadhaarNumber}
            suppressHydrationWarning={true}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "");
              update("aadhaarNumber", v);
            }}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter 12-digit Aadhaar"
          />
          {!validateAadhaar(form.aadhaarNumber) &&
            form.aadhaarNumber.length > 0 && (
              <p className="text-red-500 text-xs mt-1">
                Aadhaar must be exactly 12 digits.
              </p>
            )}
        </div>

        {/* PAN Number (UNCHANGED) */}
        <div>
          <label className="block text-sm mb-1">PAN Number *</label>
          <input
            type="text"
            maxLength={10}
            value={form.panNumber}
            suppressHydrationWarning={true}
            onChange={(e) => {
              const v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
              update("panNumber", v);
            }}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter PAN (ABCDE1234F)"
          />
          {!validatePAN(form.panNumber) &&
            form.panNumber.length > 0 && (
              <p className="text-red-500 text-xs mt-1">
                PAN must be ABCDE1234F format.
              </p>
            )}
        </div>

        {/* Aadhaar Upload (VALIDATED NOW) */}
        <div>
          <label className="block text-sm mb-1">Upload Aadhaar Card *</label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => handleFileUpload(e, "aadhaarUrl")}
            className="w-full border rounded px-3 py-2"
          />

          {form.aadhaarUrl && form.aadhaarUrl.endsWith(".pdf") ? (
            <p className="mt-2 text-green-600 text-sm">PDF Uploaded</p>
          ) : form.aadhaarUrl ? (
            <img
              src={form.aadhaarUrl}
              className="mt-2 h-32 border rounded object-cover"
            />
          ) : null}
        </div>

        {/* PAN Upload (VALIDATED NOW) */}
        <div>
          <label className="block text-sm mb-1">Upload PAN Card *</label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => handleFileUpload(e, "panUrl")}
            className="w-full border rounded px-3 py-2"
          />

          {form.panUrl && (
            <img
              src={form.panUrl}
              className="mt-2 h-32 border rounded object-cover"
            />
          )}
        </div>

        {/* Passport Photo Upload (VALIDATED NOW) */}
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
