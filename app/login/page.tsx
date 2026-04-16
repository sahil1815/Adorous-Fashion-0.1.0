"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  
  // Changed from "email" to "identifier" so it can hold either an email or a phone number
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
        // We send the 'identifier' state. Note: see the warning below about your backend!
        body: JSON.stringify({ email: identifier, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Invalid credentials. Please try again.");
        return;
      }

      router.push("/account");
      router.refresh(); 
    } catch (err) {
      setError("Unable to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Fixed Overlap: pt-[140px] md:pt-[180px] safely pushes it below the Navbar
    <main className="min-h-screen bg-[#F7E7CE]/30 pt-[140px] md:pt-[180px] pb-24 px-6 flex items-center justify-center">
      
      {/* Fixed Layout: Beautiful premium split-screen card */}
      <div className="w-full max-w-5xl bg-white rounded-sm shadow-xl flex overflow-hidden min-h-[600px] border border-[#F7E7CE]">
        
        {/* Left Side: Elegant Image (Hidden on mobile) */}
        <div className="hidden md:block w-1/2 relative bg-[#E5D5BC]">
          <Image 
            // Using a different but matching beautiful jewelry image for the login page
            src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=1000" 
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
            {/* 1. Combined Email / Phone Field */}
            <label className="block text-[12px] uppercase tracking-[0.1em] font-medium text-[#1A1A1A]/70">
              Email or Phone Number
              <input
                // Changed type to "text" so the browser doesn't block phone numbers
                type="text"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder="jane@example.com or +880..."
                required
                className="mt-2 w-full rounded-sm border border-[#D8C2B6] bg-transparent px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#B76E79] placeholder:text-gray-300"
              />
            </label>

            {/* 2. Password Field with "Forgot Password" link */}
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
    </main>
  );
}