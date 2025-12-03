"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "@/api/axios"; // jo pehle se kaam kar raha hai, wahi rehne do

export default function AdminUserDetailsPage() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [id]);

  async function fetchUser() {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`/auth/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("ADMIN USER DETAILS:", res.data); // 👀 yahan se check kar sakte ho kya aa raha hai
      setUser(res.data);
    } catch (err) {
      console.log("ERROR FETCHING USER", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p className="p-6">Loading...</p>;
  if (!user) return <p className="p-6 text-red-500">User not found</p>;

  // ------- yahan se KYC / BANK images ke URLs bana rahe hain -------
  const aadhaarSrc = buildFileUrl(user.aadhaarUrl);
  const panSrc = buildFileUrl(user.panUrl);
  const photoSrc = buildFileUrl(user.photoUrl);
  const chequeSrc = buildFileUrl(user.chequeUrl);

  console.log("KYC URLS:", {
    aadhaar: user.aadhaarUrl,
    pan: user.panUrl,
    photo: user.photoUrl,
    cheque: user.chequeUrl,
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">User Details</h1>

      {/* USER BASIC INFO */}
      <section className="bg-white shadow rounded-xl p-6 border">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

        <Grid>
          <Field label="Full Name" value={user.fullname} />
          <Field label="Email" value={user.email} />
          <Field label="Contact" value={user.contact} />
          <Field label="Alternate Contact" value={user.altContact || "-"} />
          <Field label="Father's Name" value={user.fatherName} />
          <Field label="Date of Birth" value={user.dob?.slice(0, 10)} />
          <Field label="Profession" value={user.profession} />
          <Field label="Annual Income" value={user.annualIncome} />
        </Grid>

        <Grid>
          <Field label="Communication Address" value={user.communicationAddress} />
          <Field label="Permanent Address" value={user.permanentAddress} />
        </Grid>
      </section>

      {/* KYC SECTION */}
      <section className="bg-white shadow rounded-xl p-6 border">
        <h2 className="text-xl font-semibold mb-4">KYC Details</h2>

        <Grid>
          <Field label="Aadhaar Number" value={user.aadhaarNumber} />
          <Field label="PAN Number" value={user.panNumber} />
        </Grid>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {/* Aadhaar */}
          <div>
            <p className="font-medium mb-1">Aadhaar Card</p>
            {aadhaarSrc ? (
              <img
                src={user.aadhaarUrl}
                alt="Aadhaar Card"
                width={400}
                height={250}
                className="h-40 rounded border object-cover"
              />
            ) : (
              <p className="text-gray-500 text-sm">Not uploaded</p>
            )}
          </div>

          {/* PAN */}
          <div>
            <p className="font-medium mb-1">PAN Card</p>
            {panSrc ? (
              <img
                src={user.panUrl}
                alt="PAN Card"
                width={400}
                height={250}
                className="h-40 rounded border object-cover"
              />
            ) : (
              <p className="text-gray-500 text-sm">Not uploaded</p>
            )}
          </div>

          {/* Photo */}
          <div>
            <p className="font-medium mb-1">Passport Size Photo</p>
            {photoSrc ? (
              <img
                src={user.photoUrl}
                alt="Passport Size Photo"
                width={400}
                height={250}
                className="h-40 rounded border object-cover"
              />
            ) : (
              <p className="text-gray-500 text-sm">Not uploaded</p>
            )}
          </div>
        </div>
      </section>

      {/* BANK DETAILS */}
      <section className="bg-white shadow rounded-xl p-6 border">
        <h2 className="text-xl font-semibold mb-4">Bank Details</h2>

        <Grid>
          <Field label="Account Holder Name" value={user.accountHolderName} />
          <Field label="Account Number" value={user.accountNumber} />
          <Field label="IFSC" value={user.ifsc} />
          <Field label="Bank Name" value={user.bankName} />
          <Field label="Branch" value={user.branch} />
          <Field label="City" value={user.city} />
          <Field label="State" value={user.state} />
        </Grid>

        <div className="mt-4">
          <p className="font-medium mb-1">Cancelled Cheque / Passbook</p>
          {chequeSrc ? (
            <img
              src={user.chequeUrl}
              alt="Cancelled Cheque / Passbook"
              width={400}
              height={250}
              className="h-40 rounded border object-cover"
            />
          ) : (
            <p className="text-gray-500 text-sm">Not uploaded</p>
          )}
        </div>
      </section>

      {/* STATUS */}
      <section className="bg-white shadow rounded-xl p-6 border">
        <h2 className="text-xl font-semibold mb-2">Account Status</h2>

        <p className="font-medium text-lg">
          Current Status:{" "}
          <span
            className={
              user.status === "ACTIVE"
                ? "text-green-600"
                : user.status === "PENDING"
                ? "text-yellow-600"
                : "text-red-600"
            }
          >
            {user.status}
          </span>
        </p>
      </section>
    </div>
  );
}

/* ---------------------------------- */
/* SMALL UI HELPERS */
/* ---------------------------------- */

function Grid({ children }: any) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>;
}

function Field({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium">{value || "-"}</p>
    </div>
  );
}

/**
 * Helper: backend ne agar sirf filename store kiya hai
 *   - "abc.jpg" → http://localhost:3000/uploads/abc.jpg
 * Agar full URL store hai (http / https / blob:), to direct wahi use karenge.
 */
function buildFileUrl(path?: string | null): string | null {
  if (!path) return null;

  const val = String(path).trim();
  if (!val) return null;

  if (val.startsWith("http://") || val.startsWith("https://") || val.startsWith("blob:")) {
    return val;
  }

  // 🔴 Yahan correct backend port use karo (NestJS = 3000)
  return `https://finance-app-i0ff.onrender.com/uploads/${val}`;
}
