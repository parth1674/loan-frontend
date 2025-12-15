"use client";

import { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "@/api/client";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);


export default function ClientProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const id = localStorage.getItem("userId");
    if (!id) return console.error("Missing userId!");

    try {
      const res = await getUserProfile(id);
      setProfile(res.data);
      setForm(res.data); // form ko bhi prefill
    } catch (err) {
      console.error("PROFILE ERROR:", err);
    }
  }

  function updateField(key: string, value: any) {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  }

  async function saveProfile() {
    const id = localStorage.getItem("userId");
    if (!id) return;

    try {
      const res = await updateUserProfile(id, form);

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile has been updated successfully!",
      });

      setEditMode(false);
      loadProfile();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Something went wrong. Try again!",
      });
    }
  }

  if (!profile) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 mt-6 rounded-2xl shadow-lg border">

      <h1 className="text-3xl font-bold mb-6 text-blue-700">My Profile</h1>

      {/* ==== BASIC DETAILS ==== */}
      <Section title="Basic Information">

        <InputField
          label="First Name"
          value={form.firstName}
          disabled={!editMode}
          onChange={(e: any) => updateField("firstName", e.target.value)}

        />

        <InputField
          label="Last Name"
          value={form.lastName}
          disabled={!editMode}
          onChange={(e:any) => updateField("lastName", e.target.value)}
        />

        <InputField
          label="Email"
          value={form.email}
          disabled={true}
        />

        <InputField
          label="Contact Number"
          value={form.contact}
          disabled={!editMode}
          onChange={(e:any) => updateField("contact", e.target.value)}
        />

        <InputField
          label="Alternate Contact"
          value={form.altContact}
          disabled={!editMode}
          onChange={(e:any) => updateField("altContact", e.target.value)}
        />

      </Section>

      {/* ==== PERSONAL DETAILS ==== */}
      <Section title="Personal Details">
        <InputField
          label="Father's Name"
          value={form.fatherName}
          disabled={!editMode}
          onChange={(e:any) => updateField("fatherName", e.target.value)}
        />

        <InputField
          label="Date of Birth"
          value={form.dob?.slice(0, 10)}
          disabled={true} // DOB cannot be edited
        />

        <InputField
          label="Profession"
          value={form.profession}
          disabled={!editMode}
          onChange={(e:any) => updateField("profession", e.target.value)}
        />

        <InputField
          label="Annual Income"
          value={form.annualIncome}
          disabled={true} // income locked
        />

        <InputField
          label="Communication Address"
          value={form.communicationAddress}
          disabled={!editMode}
          onChange={(e:any) =>
            updateField("communicationAddress", e.target.value)
          }
        />

        <InputField
          label="Permanent Address"
          value={form.permanentAddress}
          disabled={!editMode}
          onChange={(e:any) =>
            updateField("permanentAddress", e.target.value)
          }
        />
      </Section>

      {/* ==== KYC (READ ONLY) ==== */}
      <Section title="KYC Details (Locked)">
        <InputField
          label="Aadhaar Number"
          value={form.aadhaarNumber}
          disabled={true}
        />

        <InputField
          label="PAN Number"
          value={form.panNumber}
          disabled={true}
        />

        <FileThumb label="Aadhaar Card" url={form.aadhaarUrl} />
        <FileThumb label="PAN Card" url={form.panUrl} />
        <FileThumb label="Photo" url={form.photoUrl} />
        <FileThumb label="Cancelled Cheque" url={form.chequeUrl} />
      </Section>

      {/* ==== BANK DETAILS ==== */}
      <Section title="Bank Details">
        <InputField
          label="Account Holder Name"
          value={form.accountHolderName}
          disabled={!editMode}
          onChange={(e:any) => updateField("accountHolderName", e.target.value)}
        />

        <InputField
          label="Account Number"
          value={form.accountNumber}
          disabled={!editMode}
          onChange={(e:any) => updateField("accountNumber", e.target.value)}
        />

        <InputField
          label="IFSC Code"
          value={form.ifsc}
          disabled={!editMode}
          onChange={(e:any) => updateField("ifsc", e.target.value)}
        />

        <InputField
          label="Bank Name"
          value={form.bankName}
          disabled={!editMode}
          onChange={(e:any) => updateField("bankName", e.target.value)}
        />

        <InputField
          label="Branch"
          value={form.branch}
          disabled={!editMode}
          onChange={(e:any) => updateField("branch", e.target.value)}
        />

        <InputField
          label="City"
          value={form.city}
          disabled={!editMode}
          onChange={(e:any) => updateField("city", e.target.value)}
        />

        <InputField
          label="State"
          value={form.state}
          disabled={!editMode}
          onChange={(e:any) => updateField("state", e.target.value)}
        />
      </Section>

      {/* ACTION BUTTONS */}
      <div className="mt-8 flex justify-end gap-4">
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          >
            Edit Profile
          </button>
        ) : (
          <>
            <button
              onClick={() => {
                setEditMode(false);
                setForm(profile); // reset changes
              }}
              className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>

            <button
              onClick={saveProfile}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Save Changes
            </button>
          </>
        )}
      </div>

    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function Section({ title, children }: any) {
  return (
    <div className="mb-8 p-6 bg-gray-50 rounded-xl border">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>
    </div>
  );
}

function InputField({ label, value, disabled, onChange }: any) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-600 mb-1">{label}</label>
      <input
        className={`border px-3 py-2 rounded-lg ${disabled ? "bg-gray-200" : "bg-white"
          }`}
        value={value || ""}
        disabled={disabled}
        onChange={onChange}
      />
    </div>
  );
}

function FileThumb({ label, url }: any) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-600 mb-1">{label}</span>
      {url ? (
        <img
          src={url}
          className="h-24 w-24 rounded-lg border object-cover shadow"
        />
      ) : (
        <p className="text-red-500 text-xs">Not uploaded</p>
      )}
    </div>
  );
}
