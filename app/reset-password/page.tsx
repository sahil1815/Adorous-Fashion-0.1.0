"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to reset password. Link may be expired.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("A network error occurred.");
    }
  };

  if (!token) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">Invalid or missing reset token.</p>
        <Link href="/login" className="text-[#B76E79] underline mt-4 block">Back to Login</Link>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[#F7E7CE] bg-[#FFF8F2] p-10 shadow-sm">
      <h1 className="text-3xl font-light text-[#1A1A1A] mb-2" style={{ fontFamily: "var(--font-serif)" }}>
        New Password
      </h1>
      
      {status === "success" ? (
        <div className="py-6">
          <p className="text-green-600 font-medium mb-4">Password reset successful!</p>
          <p className="text-sm text-gray-600">Redirecting you to login...</p>
        </div>
      ) : (
        <>
          <p className="mb-8 text-sm text-[#1A1A1A]/70">
            Please enter your new password below.
          </p>

          {status === "error" && (
            <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A]">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="mt-2 w-full rounded-lg border border-[#D8C2B6] bg-white px-4 py-3 text-sm outline-none focus:border-[#B76E79]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A]">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-[#D8C2B6] bg-white px-4 py-3 text-sm outline-none focus:border-[#B76E79]"
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-full bg-[#B76E79] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#8f4f5b] disabled:opacity-60"
            >
              {status === "loading" ? "Updating..." : "Update Password"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-white pt-32 pb-24">
      <div className="mx-auto w-full max-w-md px-6">
        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}