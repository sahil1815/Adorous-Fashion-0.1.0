"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // New Phone state with +880 default
  const [phone, setPhone] = useState("+880");
  const [password, setPassword] = useState("");
  // New Confirm Password state
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate passwords match before sending to server
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Sending phone to the database
        body: JSON.stringify({ name, email, phone, password }),
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
    // Fixed Overlap: pt-[140px] md:pt-[180px] pushes it below the Navbar safely
    <main className="min-h-screen bg-[#F7E7CE]/30 pt-[140px] md:pt-[180px] pb-24 px-6 flex items-center justify-center">
      
      {/* Fixed Layout: Split-screen card for large displays */}
      <div className="w-full max-w-5xl bg-white rounded-sm shadow-xl flex overflow-hidden min-h-[650px] border border-[#F7E7CE]">
        
        {/* Left Side: Image (Hidden on mobile) */}
        <div className="hidden md:block w-1/2 relative bg-[#E5D5BC]">
          <Image 
            src="https://images.unsplash.com/photo-1599643478524-fb66f70362f7?auto=format&fit=crop&q=80&w=1000" 
            alt="Adorous Luxury Jewelry" 
            fill 
            className="object-cover mix-blend-multiply opacity-90"
            priority
          />
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          
          <h1 className="text-3xl md:text-4xl font-light text-[#1A1A1A] mb-3" style={{ fontFamily: "var(--font-serif)" }}>
            Create account
          </h1>
          <p className="mb-8 text-sm tracking-wide text-[#1A1A1A]/70">
            Start shopping faster, track your orders, and save your favorites.
          </p>

          {error && (
            <div className="mb-6 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block text-[12px] uppercase tracking-[0.1em] font-medium text-[#1A1A1A]/70">
              Name
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g., Jane Doe"
                required
                className="mt-2 w-full rounded-sm border border-[#D8C2B6] bg-transparent px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#B76E79] placeholder:text-gray-300"
              />
            </label>

            <label className="block text-[12px] uppercase tracking-[0.1em] font-medium text-[#1A1A1A]/70">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="e.g., jane@example.com"
                required
                className="mt-2 w-full rounded-sm border border-[#D8C2B6] bg-transparent px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#B76E79] placeholder:text-gray-300"
              />
            </label>

            {/* Added Phone Field */}
            <label className="block text-[12px] uppercase tracking-[0.1em] font-medium text-[#1A1A1A]/70">
              Phone Number
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+880 1XXX-XXXXXX"
                required
                className="mt-2 w-full rounded-sm border border-[#D8C2B6] bg-transparent px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#B76E79] placeholder:text-gray-300"
              />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <label className="block text-[12px] uppercase tracking-[0.1em] font-medium text-[#1A1A1A]/70">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="mt-2 w-full rounded-sm border border-[#D8C2B6] bg-transparent px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#B76E79] placeholder:text-gray-300"
                />
              </label>

              {/* Added Confirm Password Field */}
              <label className="block text-[12px] uppercase tracking-[0.1em] font-medium text-[#1A1A1A]/70">
                Confirm Password
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="mt-2 w-full rounded-sm border border-[#D8C2B6] bg-transparent px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#B76E79] placeholder:text-gray-300"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-[#1A1A1A] px-5 py-4 text-[11px] uppercase tracking-[0.2em] font-semibold text-white transition-colors duration-300 hover:bg-[#B76E79] disabled:cursor-not-allowed disabled:opacity-60 rounded-sm"
            >
              {isSubmitting ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm tracking-wide text-[#1A1A1A]/70">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-[#B76E79] hover:text-[#1A1A1A] transition-colors">
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}