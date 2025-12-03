"use client";

export default function Step5Review({
  form,
  next,
  back,
  finalSubmit,
}: {
  form: any;
  next: () => void;
  back: () => void;
  finalSubmit: () => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Review Your Details</h2>

      <p className="text-gray-600 mb-4">
        Please check all details carefully before submitting. You cannot edit after submission.
      </p>

      <div className="space-y-6">

        {/* ---------------- BASIC DETAILS ---------------- */}
        <Section title="Basic Information">
          <Item label="First Name" value={form.firstName} />
          <Item label="Last Name" value={form.lastName || "—"} />
          <Item label="Email" value={form.email} />
          <Item
            label="Contact"
            value={`+${form.countryDialCode} ${form.contact}`}
          />
          <Item label="Alternate Contact" value={form.altContact || "—"} />
        </Section>

        {/* ---------------- PERSONAL DETAILS ---------------- */}
        <Section title="Personal Details">
          <Item label="Father's Name" value={form.fatherName} />
          <Item label="Date of Birth" value={form.dob} />
          <Item label="Profession" value={form.profession} />
          <Item label="Annual Income" value={`₹ ${form.annualIncome}`} />
          <Item label="Communication Address" value={form.communicationAddress} />
          <Item label="Permanent Address" value={form.permanentAddress} />
        </Section>

        {/* ---------------- KYC DETAILS ---------------- */}
        <Section title="KYC Verification">
          <Item label="Aadhaar Number" value={form.aadhaarNumber} />
          <PreviewImage label="Aadhaar Card" url={form.aadhaarUrl} />

          <Item label="PAN Number" value={form.panNumber} />
          <PreviewImage label="PAN Card" url={form.panUrl} />

          <PreviewImage label="Passport Size Photo" url={form.photoUrl} />
        </Section>

        {/* ---------------- BANK DETAILS ---------------- */}
        <Section title="Bank Account Details">
          <Item label="Account Holder Name" value={form.accountHolderName} />
          <Item label="Account Number" value={form.accountNumber} />
          <Item label="IFSC Code" value={form.ifsc} />
          <Item label="Bank Name" value={form.bankName} />
          <Item label="Branch" value={form.branch} />
          <Item label="City" value={form.city} />
          <Item label="State" value={form.state} />

          <PreviewImage
            label="Cancelled Cheque / Passbook"
            url={form.chequeUrl}
          />
        </Section>

      </div>

      {/* BUTTONS */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={back}
          className="bg-gray-300 text-black px-6 py-2 rounded hover:bg-gray-400"
        >
          ← Back
        </button>

        <button
          onClick={finalSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Confirm & Submit →
        </button>
      </div>
    </div>
  );
}

/* ============================================================= */
/* SMALL COMPONENTS BELOW — DO NOT CHANGE */
/* ============================================================= */

function Section({ title, children }: any) {
  return (
    <div className="bg-white border rounded-xl p-5 shadow">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Item({ label, value }: any) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="font-semibold text-sm">{value}</span>
    </div>
  );
}

function PreviewImage({ label, url }: any) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500 mb-1">{label}</span>

      {url ? (
        <img
          src={url}
          alt={label}
          className="h-32 w-auto border rounded object-cover"
        />
      ) : (
        <p className="text-red-500 text-xs">Not Uploaded</p>
      )}
    </div>
  );
}
