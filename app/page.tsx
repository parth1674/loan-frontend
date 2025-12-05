"use client";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle,
  Shield,
  Zap,
  PhoneCall,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [amount, setAmount] = useState(50000);
  const [months, setMonths] = useState(12);
  const [menuOpen, setMenuOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [subMsg, setSubMsg] = useState<string | null>(null);

  const interestRate = 0.02; // 2% per month
  const emi = Math.round(
    (amount * interestRate) / (1 - Math.pow(1 + interestRate, -months))
  );

  async function handleSubscribe(e?: any) {
    if (e) e.preventDefault();
    setSubmitting(true);
    setSubMsg("");

    try {
      const res = await fetch("https://finance-app-i0ff.onrender.com/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubMsg(data.message || "Something went wrong");
        return;
      }

      setSubMsg("Subscribed successfully!");
      setEmail("");
    } catch (err) {
      setSubMsg("Subscription failed");
    } finally {
      setSubmitting(false);
    }
  }



  return (
    <div className="bg-slate-50 font-sans text-slate-900">
      {/* ================= NAVBAR ================= */}
      <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* LOGO */}
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-md">
              <span className="text-white font-semibold text-lg">F</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-blue-700 bg-clip-text text-transparent">
                FinanceCorp
              </span>
              <span className="text-xs text-slate-500">
                Smart lending platform
              </span>
            </div>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="nav-link">
              Features
            </a>
            <a href="#calculator" className="nav-link">
              Calculator
            </a>
            <a href="#testimonials" className="nav-link">
              Testimonials
            </a>
            <a href="#faq" className="nav-link">
              FAQ
            </a>
          </div>

          {/* DESKTOP ACTION BUTTONS */}
          <div className="hidden md:flex items-center gap-3 text-sm font-medium">
            <a
              href="/auth/login"
              className="px-4 py-2 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
            >
              Login
            </a>

            <a
              href="/auth/register"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-500 text-white shadow-md hover:shadow-lg hover:from-blue-700 hover:via-indigo-600 hover:to-sky-600 transition-all"
            >
              Apply Now
              <ArrowRight size={18} />
            </a>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden text-slate-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </nav>

        {/* MOBILE DROPDOWN MENU */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 shadow-sm px-4 pb-4 space-y-4">
            <div className="flex flex-col gap-3 text-sm font-medium pt-2">
              <a
                href="#features"
                className="mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#calculator"
                className="mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                Calculator
              </a>
              <a
                href="#testimonials"
                className="mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                Testimonials
              </a>
              <a
                href="#faq"
                className="mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                FAQ
              </a>
            </div>

            <hr className="border-slate-200" />

            <div className="flex flex-col gap-3 text-sm font-medium">
              <a
                href="/auth/login"
                className="w-full text-center px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </a>
              <a
                href="/auth/register"
                className="w-full text-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-500 text-white shadow-md hover:shadow-lg transition-all"
                onClick={() => setMenuOpen(false)}
              >
                Apply Now
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-28 pb-20 lg:pb-28 overflow-hidden">
        {/* Gradient background band */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-900" />
        <div className="absolute inset-x-0 -bottom-40 h-80 bg-gradient-to-t from-blue-500/25 via-indigo-500/20 to-transparent blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: text */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs text-sky-100 mb-4">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/80 text-white">
                  <CheckCircle size={14} />
                </span>
                <span>RBI-compliant digital lending experience</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
                Ready To Get{" "}
                <span className="bg-gradient-to-r from-blue-300 via-sky-400 to-indigo-300 bg-clip-text text-transparent">
                  Your Loan?
                </span>
              </h1>

              <p className="mt-4 text-lg text-slate-200 max-w-xl">
                Apply in minutes. Fast approval. Zero paperwork. Built for
                salaried professionals, small businesses and modern borrowers.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="/auth/register"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-500 text-white text-sm font-semibold shadow-lg hover:shadow-xl hover:translate-y-[1px] transition-all"
                >
                  Apply Now
                  <ArrowRight size={18} />
                </a>

                <a
                  href="#calculator"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-slate-500/60 bg-white/5 text-sm text-slate-100 hover:bg-white/10 transition-colors"
                >
                  Calculate EMI
                </a>
              </div>

              {/* Hero highlights */}
              <div className="mt-8 grid grid-cols-3 gap-4 max-w-lg text-xs sm:text-sm text-slate-200">
                <HeroStat label="Approval time" value="< 10 min" />
                <HeroStat label="Max loan" value="₹ 5,00,000" />
                <HeroStat label="Customer rating" value="4.8 / 5" />
              </div>
            </div>

            {/* Right: quick card */}
            <div className="lg:justify-self-end">
              <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  Instant EMI Preview
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Adjust the sliders below to get a quick estimate.
                </p>

                <div className="space-y-5 text-sm">
                  <div>
                    <label className="font-medium text-slate-800">
                      Loan Amount (₹)
                    </label>
                    <input
                      type="range"
                      min="5000"
                      max="500000"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full mt-2 accent-blue-600"
                    />
                    <p className="mt-1 text-slate-600">
                      ₹ {amount.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <label className="font-medium text-slate-800">
                      Tenure (Months)
                    </label>
                    <input
                      type="range"
                      min="3"
                      max="60"
                      value={months}
                      onChange={(e) => setMonths(Number(e.target.value))}
                      className="w-full mt-2 accent-indigo-600"
                    />
                    <p className="mt-1 text-slate-600">{months} Months</p>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-300">
                      Estimated EMI
                    </p>
                    <p className="text-3xl font-bold mt-1">
                      ₹ {emi.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-xs text-slate-200 flex flex-col items-end gap-1">
                    <span className="inline-flex items-center gap-1">
                      <Shield size={14} /> Secure processing
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Zap size={14} /> No hidden charges
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-[11px] text-slate-500">
                  *This is an indicative EMI. Actual EMI may vary based on your
                  profile and final approval.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- FEATURES SECTION ---------------- */}
      <section id="features" className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">
            Why Choose{" "}
            <span className="text-blue-600">Our Loan Platform?</span>
          </h2>
          <p className="text-center text-slate-500 max-w-2xl mx-auto mb-12 text-sm sm:text-base">
            Fast, secure and transparent loans designed for today&apos;s digital
            customers.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="h-9 w-9 text-blue-500" />}
              title="Instant Approval"
              desc="Get loan approval in minutes with minimal documentation."
            />

            <FeatureCard
              icon={<Shield className="h-9 w-9 text-indigo-500" />}
              title="Secure & Encrypted"
              desc="Your data is fully protected with enterprise-grade security."
            />

            <FeatureCard
              icon={<PhoneCall className="h-9 w-9 text-sky-500" />}
              title="24/7 Support"
              desc="Our team is always available to help you whenever needed."
            />
          </div>
        </div>
      </section>

      {/* ---------------- LOAN CALCULATOR ---------------- */}
      <section
        id="calculator"
        className="py-16 lg:py-20 bg-slate-50 border-y border-slate-100"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">
            Loan EMI <span className="text-blue-600">Calculator</span>
          </h2>
          <p className="text-center text-slate-500 max-w-2xl mx-auto mb-10 text-sm sm:text-base">
            Adjust the loan amount and tenure to understand your monthly
            repayment.
          </p>

          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 grid lg:grid-cols-[2fr,1.3fr] gap-8 items-center">
            <div>
              <label className="font-medium text-slate-800">
                Loan Amount (₹)
              </label>
              <input
                type="range"
                min="5000"
                max="500000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full mt-2 accent-blue-600"
              />
              <p className="text-slate-700 mt-1">
                ₹ {amount.toLocaleString()}
              </p>

              <label className="font-medium text-slate-800 mt-6 block">
                Tenure (Months)
              </label>
              <input
                type="range"
                min="3"
                max="60"
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="w-full mt-2 accent-indigo-600"
              />
              <p className="text-slate-700 mt-1">{months} Months</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 flex flex-col justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-300">
                  Your Monthly EMI
                </p>
                <h3 className="text-4xl font-bold mt-2">
                  ₹ {emi.toLocaleString()}
                </h3>
                <p className="text-xs text-slate-300 mt-3">
                  Calculated at 2% per month. This is an estimate only.
                </p>
              </div>
              <a
                href="/auth/register"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-white text-slate-900 text-sm font-semibold px-4 py-3 hover:bg-slate-100 transition-colors"
              >
                Apply with this plan
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section id="testimonials" className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">
            What Our Customers <span className="text-blue-600">Say</span>
          </h2>
          <p className="text-center text-slate-500 max-w-2xl mx-auto mb-10 text-sm sm:text-base">
            Real feedback from borrowers who used FinanceCorp for their loans.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              "Very smooth loan process and lightning fast approval!",
              "Great platform! Secure and transparent. Highly recommended.",
              "Customer support was amazing. Helped me through every step.",
            ].map((text, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-100 shadow-md rounded-2xl p-6 flex flex-col justify-between"
              >
                <p className="text-slate-700 mb-4 text-sm">“{text}”</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">
                      User {idx + 1}
                    </p>
                    <p className="text-xs text-slate-500">Verified borrower</p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 text-xs">
                    ★★★★☆
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section id="faq" className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">
            Frequently Asked <span className="text-blue-600">Questions</span>
          </h2>
          <p className="text-center text-slate-500 max-w-2xl mx-auto mb-10 text-sm sm:text-base">
            Answers to the most common questions about our loan process.
          </p>

          <div className="space-y-4">
            {[
              [
                "How fast is the loan approval?",
                "Approval usually takes 5–10 minutes.",
              ],
              ["Is my data secure?", "Yes, we use bank-level encryption for all data."],
              [
                "Are there any hidden charges?",
                "No. Everything is fully transparent.",
              ],
            ].map(([q, a], idx) => (
              <details
                key={idx}
                className="bg-white border border-slate-200 rounded-xl px-4 sm:px-5 py-3 shadow-sm"
              >
                <summary className="font-semibold cursor-pointer text-sm sm:text-base">
                  {q}
                </summary>
                <p className="mt-2 text-slate-600 text-sm">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA SECTION ---------------- */}
      <section className="py-16 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Ready To Get Your Loan?
          </h2>
          <p className="mt-3 text-slate-300">
            Apply in minutes. Fast approval. Zero paperwork.
          </p>

          <a
            href="/auth/register"
            className="mt-8 inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-8 py-3 rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:bg-slate-100 transition-colors"
          >
            Apply Now
            <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-950 text-slate-100 pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Company */}
          <div>
            <h2 className="text-2xl font-bold mb-3">FinanceCorp</h2>
            <p className="text-sm text-slate-400">
              Secure, fast and transparent loans for everyone.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold mb-3 tracking-wide">
              QUICK LINKS
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <a href="/" className="hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="/auth/login" className="hover:text-white">
                  Login
                </a>
              </li>
              <li>
                <a href="/auth/register" className="hover:text-white">
                  Apply Loan
                </a>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-semibold mb-3 tracking-wide">
              PRODUCTS
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>Personal Loan</li>
              <li>Instant Loan</li>
              <li>Small Business Loan</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold mb-3 tracking-wide">
              SUBSCRIBE
            </h3>
            <p className="text-sm text-slate-400 mb-3">
              Get the latest updates and rate changes directly in your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm text-slate-900 bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your email"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-sm font-semibold hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
              {subMsg && (
                <p className="text-xs mt-1 text-slate-300">{subMsg}</p>
              )}
            </form>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 mt-10 border-t border-slate-800 pt-4">
          © {new Date().getFullYear()} FinanceCorp. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

/* ---------------- Reusable components ---------------- */

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white shadow-sm hover:shadow-md border border-slate-100 rounded-2xl p-6 transition-shadow flex flex-col gap-3">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600">{desc}</p>
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/5 rounded-xl border border-white/10 px-3 py-3 text-left">
      <p className="text-[10px] uppercase tracking-wide text-slate-300">
        {label}
      </p>
      <p className="text-sm font-semibold text-white mt-1">{value}</p>
    </div>
  );
}
