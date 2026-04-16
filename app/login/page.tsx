"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// 1. We create an inner component to handle the smart routing logic safely
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // ✅ SMART REDIRECT LOGIC: Check the URL for a destination, default to /account
  const redirectTo = searchParams.get("redirectTo") || "/account";
  
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: identifier, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Invalid credentials. Please try again.");
        return;
      }

      // ✅ Instantly push them to their destination
      router.push(redirectTo);
      router.refresh(); 
    } catch (err) {
      setError("Unable to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl bg-white rounded-sm shadow-xl flex overflow-hidden min-h-[600px] border border-[#F7E7CE]">
      
      {/* Left Side: Elegant Image */}
      <div className="hidden md:block w-1/2 relative bg-[#E5D5BC]">
        <Image 
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1000" 
          alt="Adorous Luxury Jewelry" 
          fill 
          className="object-cover mix-blend-multiply opacity-90"
          priority
        />
      </div>

      {/* Right Side: Form Content */}
      <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
        
        <h1 className="text-3xl md:text-4xl font-light text-[#1A1A1A] mb-3" style={{ fontFamily: "var(--font-serif)" }}>
          Sign in
        </h1>
        <p className="mb-8 text-sm tracking-wide text-[#1A1A1A]/70">
          Access your account to view orders, save favorites, and checkout faster.
        </p>

        {error && (
          <div className="mb-6 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-[12px] uppercase tracking-[0.1em] font-medium text-[#1A1A1A]/70">
            Email or Phone Number
            <input
              type="text"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder="adorous.fashion@gmail.com or +880..."
              required
              className="mt-2 w-full rounded-sm border border-[#D8C2B6] bg-transparent px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#B76E79] placeholder:text-gray-300"
            />
          </label>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-[12px] uppercase tracking-[0.1em] font-medium text-[#1A1A1A]/70">
                Password
              </label>
              <Link href="/forgot-password" className="text-[11px] text-[#B76E79] hover:text-[#1A1A1A] transition-colors">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-sm border border-[#D8C2B6] bg-transparent px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#B76E79] placeholder:text-gray-300"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 bg-[#1A1A1A] px-5 py-4 text-[11px] uppercase tracking-[0.2em] font-semibold text-white transition-colors duration-300 hover:bg-[#B76E79] disabled:cursor-not-allowed disabled:opacity-60 rounded-sm"
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm tracking-wide text-[#1A1A1A]/70">
          Don't have an account?{' '}
          <Link href="/register" className="font-semibold text-[#B76E79] hover:text-[#1A1A1A] transition-colors">
            Create one
          </Link>
        </p>

      </div>
    </div>
  );
}

// 2. The main page component wraps the form in a Suspense boundary for Next.js safety
export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#F7E7CE]/30 pt-[140px] md:pt-[180px] pb-24 px-6 flex items-center justify-center">
      <Suspense fallback={
        <div className="w-full max-w-5xl min-h-[600px] flex items-center justify-center text-[#1A1A1A]/50 tracking-[0.2em] uppercase text-sm">
          Loading...
        </div>
      }>
        <LoginForm />
      </Suspense>
    </main>
  );
}