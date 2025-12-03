"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/api/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // 🔥 FIXED LOGIN FUNCTION
  async function handleLogin() {
    try {
      setError("");

      const res = await loginUser(email, password);

      // ====== SAVE LOGIN DATA PROPERLY ======
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("userId", res.data.user.id);   // ⭐ MOST IMPORTANT FIX

      // ====== REDIRECT BASED ON ROLE ======
      if (res.data.user.role === "ADMIN") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/client");
      }

    } catch (err: any) {
      console.log("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg p-8 rounded-xl w-[380px]">

        <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Login
        </h2>

        {error && (
          <p className="text-red-500 mb-3 text-center">{error}</p>
        )}

        <input
          className="w-full p-3 border border-gray-300 rounded mb-3"
          placeholder="Email"
          type="email"
          suppressHydrationWarning={true}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-3 border border-gray-300 rounded mb-3"
          type="password"
          placeholder="Password"
          suppressHydrationWarning={true}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          suppressHydrationWarning={true}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded"
        >
          Login
        </button>

        <p className="text-center mt-4 text-gray-500">
          Don't have an account?{" "}
          <a href="/auth/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>

      </div>
    </div>
  );
}
