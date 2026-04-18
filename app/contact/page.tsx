"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  
  // State to hold the data the user types
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orderId: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      // Send the data to our new API!
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        // Clear the form for the next time
        setFormData({ name: "", email: "", orderId: "", message: "" });
      } else {
        const data = await response.json();
        setStatus("error");
        setErrorMessage(data.error || "Failed to send message.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("A network error occurred. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-[#FCFBFA] pt-32 pb-24 px-4 sm:px-6">
      <div className="mx-auto w-full max-w-5xl">
        
        {/* Back Button & Page Title */}
        <div className="mb-10 flex flex-col items-start">
          <Link 
            href="/" 
            className="inline-flex items-center text-[12px] uppercase tracking-widest text-gray-500 hover:text-[#B76E79] transition-colors mb-6"
          >
            <ChevronLeft size={16} className="mr-1" /> Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-light text-[#1A1A1A] mb-3" style={{ fontFamily: "var(--font-serif)" }}>
            Get in Touch
          </h1>
          <p className="text-sm text-gray-500 max-w-xl leading-relaxed">
            Whether you have a question about our collections, need help with an order, or just want to say hello, we are here for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: Contact Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#F7E7CE] h-full">
              <h2 className="text-[15px] font-semibold text-[#1A1A1A] uppercase tracking-wider mb-8">
                Contact Information
              </h2>
              
              <div className="space-y-8">
                {/* Phone */}
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FFF8F2] text-[#B76E79] mr-4 shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[13px] text-gray-500 uppercase tracking-wider font-semibold mb-1">Phone</p>
                    <p className="text-sm text-[#1A1A1A]">+8801700625482</p>
                    <p className="text-xs text-gray-400 mt-1">Available Sat-Thu, 10am - 8pm</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FFF8F2] text-[#B76E79] mr-4 shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[13px] text-gray-500 uppercase tracking-wider font-semibold mb-1">Email</p>
                    <p className="text-sm text-[#1A1A1A]">adorous.fashion@gmail.com</p>
                    <p className="text-xs text-gray-400 mt-1">We aim to reply within 24 hours</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FFF8F2] text-[#B76E79] mr-4 shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-[13px] text-gray-500 uppercase tracking-wider font-semibold mb-1">Location</p>
                    <p className="text-sm text-[#1A1A1A] leading-relaxed">
                      Adorous Fashion<br />
                      Rajshahi, Bangladesh
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-[#F7E7CE]">
              
              {status === "success" ? (
                <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in duration-500">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-green-500 mb-6">
                    <Send size={28} />
                  </div>
                  <h3 className="text-2xl font-light text-[#1A1A1A] mb-2" style={{ fontFamily: "var(--font-serif)" }}>
                    Message Sent!
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Thank you for reaching out to Adorous. Our customer care team will get back to you shortly.
                  </p>
                  <button 
                    onClick={() => setStatus("idle")}
                    className="mt-8 text-[13px] text-[#B76E79] uppercase tracking-widest font-semibold hover:text-[#1A1A1A] transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Error Message */}
                  {status === "error" && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-2">
                        Full Name <span className="text-[#B76E79]">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Sidratul Muntaha"
                        className="w-full rounded-lg border border-[#D8C2B6] bg-[#FCFBFA] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#B76E79] focus:bg-white"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-2">
                        Email Address <span className="text-[#B76E79]">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@gmail.com"
                        className="w-full rounded-lg border border-[#D8C2B6] bg-[#FCFBFA] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#B76E79] focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Order ID */}
                  <div>
                    <label htmlFor="orderId" className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-2">
                      Order ID <span className="text-gray-400 font-normal normal-case tracking-normal">(Optional)</span>
                    </label>
                    <input
                      id="orderId"
                      type="text"
                      value={formData.orderId}
                      onChange={handleChange}
                      placeholder="e.g. ADR-20260417"
                      className="w-full rounded-lg border border-[#D8C2B6] bg-[#FCFBFA] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#B76E79] focus:bg-white"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-2">
                      Message <span className="text-[#B76E79]">*</span>
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help you today?"
                      className="w-full rounded-lg border border-[#D8C2B6] bg-[#FCFBFA] px-4 py-3 text-sm text-[#1A1A1A] outline-none transition focus:border-[#B76E79] focus:bg-white resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-[#B76E79] px-5 py-4 text-[13px] tracking-wider uppercase font-bold text-white transition hover:bg-[#8f4f5b] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {status === "loading" ? "Sending..." : "Send Message"} 
                    {status !== "loading" && <Send size={16} />}
                  </button>

                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}