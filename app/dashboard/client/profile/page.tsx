"use client";

import { useEffect, useState } from "react";
import { getUserProfile } from "@/api/client";

export default function ClientProfilePage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const id = localStorage.getItem("userId");
    if (!id) {
      console.error("No userId found in localStorage");
      return;
    }

    try {
      const res = await getUserProfile(id);
      setProfile(res.data);
    } catch (err) {
      console.error("PROFILE ERROR:", err);
    }
  }

  if (!profile) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-lg bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      <p><strong>Full Name:</strong> {profile.fullname}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Status:</strong> {profile.status}</p>
      <p><strong>Role:</strong> {profile.role}</p>

      <hr className="my-4" />

      <p className="text-gray-600">More KYC fields coming soon...</p>
    </div>
  );
}
