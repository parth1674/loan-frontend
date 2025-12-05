"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/api/auth";
import { Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin() {
    try {
      setError("");

      const res = await loginUser(email, password);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("userId", res.data.user.id);

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-900 p-6">
      <div className="w-full max-w-md backdrop-blur-xl bg-white/10 p-8 rounded-3xl shadow-[0_0_30px_rgba(255,255,255,0.1)] border border-white/20">

        {/* Title */}
        <h2 className="text-4xl font-bold text-center mb-8 text-white drop-shadow-md">
          Welcome Back
        </h2>

        {/* Error Box */}
        {error && (
          <div className="bg-red-500/20 border border-red-400/40 text-red-200 text-sm px-3 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Email Field */}
        <div className="relative mb-4">
          <Mail className="absolute left-3 top-3.5 text-slate-300" size={18} />
          <input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-3 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-slate-300 
                       focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
          />
        </div>

        {/* Password Field */}
        <div className="relative mb-4">
          <Lock className="absolute left-3 top-3.5 text-slate-300" size={18} />
          <input
            type="password"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-3 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-slate-300 
                       focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-md"
          />
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                     text-white font-semibold py-3 mt-2 rounded-lg shadow-lg transition-all"
        >
          Login
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="h-px bg-white/20 flex-1" />
          <span className="text-white/60 text-xs px-3">OR</span>
          <div className="h-px bg-white/20 flex-1" />
        </div>

        {/* Register Redirect */}
        <p className="text-center text-slate-200 text-sm">
          Don’t have an account?{" "}
          <a
            href="/auth/register"
            className="text-blue-300 hover:text-blue-400 font-semibold underline"
          >
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
