// app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("If an account exists with that email, we have sent a password reset link.");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("A network error occurred. Please check your connection.");
    }
  };

  return (
    <main className="min-h-screen bg-white pt-32 pb-24">
      <div className="mx-auto w-full max-w-md px-6">
        
        <Link href="/login" className="inline-flex items-center text-[12px] uppercase tracking-widest text-gray-500 hover:text-[#B76E79] transition-colors mb-6">
          <ArrowLeft size={14} className="mr-2" /> Back to Login
        </Link>

        <div className="rounded-3xl border border-[#F7E7CE] bg-[#FFF8F2] p-10 shadow-sm">
          <h1 className="text-3xl font-light text-[#1A1A1A] mb-2" style={{ fontFamily: "var(--font-serif)" }}>
            Reset Password
          </h1>
          
          {status === "success" ? (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
                ✓
              </div>
              <p className="text-[#1A1A1A] text-sm leading-relaxed">
                {message}
              </p>
            </div>
          ) : (
            <>
              <p className="mb-8 text-sm text-[#1A1A1A]/70">
                Enter your email address and we will send you a link to reset your password.
              </p>

              {status === "error" && (
                <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-in fade-in duration-200">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#1A1A1A]">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-lg border border-[#D8C2B6] bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#B76E79]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full rounded-full bg-[#B76E79] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#8f4f5b] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "loading" ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}