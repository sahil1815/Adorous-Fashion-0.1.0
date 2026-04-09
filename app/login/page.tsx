"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [redirectTo, setRedirectTo] = useState("/account");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirectTo");
    if (redirect) {
      setRedirectTo(redirect);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        // This triggers the red error box below!
        setError(data.error || "Incorrect email or password.");
        return;
      }

      router.push(redirectTo);
    } catch (err) {
      setError("Unable to log in. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white pt-32 pb-24">
      <div className="mx-auto w-full max-w-md px-6">
        <div className="rounded-3xl border border-[#F7E7CE] bg-[#FFF8F2] p-10 shadow-sm">
          <h1 className="text-3xl font-light text-[#1A1A1A] mb-2" style={{ fontFamily: "var(--font-serif)" }}>
            Sign in
          </h1>
          <p className="mb-8 text-sm text-[#1A1A1A]/70">
            Access your account to view orders, save favorites, and checkout faster.
          </p>

          {/* ERROR MESSAGE BOX */}
          {error && (
            <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-in fade-in duration-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#1A1A1A]">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-[#D8C2B6] bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#B76E79]"
              />
            </div>

            <div>
              {/* PASSWORD LABEL & FORGOT PASSWORD LINK */}
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-[#1A1A1A]">
                  Password
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-[12px] font-medium text-[#B76E79] hover:text-[#8f4f5b] hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-[#D8C2B6] bg-white px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#B76E79]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-[#B76E79] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#8f4f5b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#1A1A1A]/70">
            Don’t have an account?{' '}
            <Link href="/register" className="font-semibold text-[#B76E79] hover:text-[#8f4f5b]">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}