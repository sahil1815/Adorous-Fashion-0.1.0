"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      router.push("/account");
    } catch (err) {
      setError("Unable to register. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white pt-32 pb-24">
      <div className="mx-auto w-full max-w-md px-6">
        <div className="rounded-3xl border border-[#F7E7CE] bg-[#FFF8F2] p-10 shadow-sm">
          <h1 className="text-3xl font-light text-[#1A1A1A] mb-2" style={{ fontFamily: "var(--font-serif)" }}>
            Create account
          </h1>
          <p className="mb-8 text-sm text-[#1A1A1A]/70">
            Start shopping faster and save your order history.
          </p>

          {error && (
            <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block text-sm font-medium text-[#1A1A1A]">
              Name
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-[#D8C2B6] bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#B76E79]"
              />
            </label>

            <label className="block text-sm font-medium text-[#1A1A1A]">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-[#D8C2B6] bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#B76E79]"
              />
            </label>

            <label className="block text-sm font-medium text-[#1A1A1A]">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={8}
                className="mt-2 w-full rounded-lg border border-[#D8C2B6] bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#B76E79]"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-[#B76E79] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#8f4f5b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#1A1A1A]/70">
            Already have an account?{' '}
            <a href="/login" className="font-semibold text-[#B76E79] hover:text-[#8f4f5b]">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
