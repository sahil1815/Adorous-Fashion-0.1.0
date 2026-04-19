"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Plus, Minus } from "lucide-react";

export default function FaqsPage() {
  // State to track which FAQ is open. Null means all are closed.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // The polished, professionalized FAQs
  const faqs = [
    {
      question: "আপনাদের কি কোনো ডিসকাউন্ট আছে?",
      answer: "হ্যাঁ! পুরো বৈশাখ মাসজুড়ে আমাদের সকল প্রোডাক্টে থাকছে নিশ্চিত ৬% ফ্ল্যাট ডিসকাউন্ট। আপনার পছন্দের প্রোডাক্টটি বেছে নিতে আজই অর্ডার করুন।"
    },
    {
      question: "প্রোডাক্টের কোয়ালিটি কেমন হবে?",
      answer: "আমাদের প্রতিটি গয়না প্রিমিয়াম আমেরিকান এডি (AD) স্টোনের তৈরি এবং নিখুঁত ডায়মন্ড কাট ডিজাইনের। এগুলো ইমপোর্টেড, ওজনে একদম হালকা এবং দীর্ঘসময় খুব স্বাচ্ছন্দ্যে ব্যবহার করার উপযোগী।"
    },
    {
      question: "লোকাল মার্কেটে দাম কম, আপনাদের প্রাইস বেশি কেন?",
      answer: "লোকাল মার্কেটের সাধারণ গয়নার সাথে আমাদের প্রিমিয়াম কোয়ালিটির বেশ পার্থক্য রয়েছে। আমরা ম্যাটেরিয়াল এবং ফিনিশিংয়ের ক্ষেত্রে কোনো আপস করি না, তাই আমাদের প্রোডাক্ট দীর্ঘস্থায়ী এবং দেখতে অত্যন্ত আকর্ষণীয় হয়। সেরা কোয়ালিটি নিশ্চিত করতেই আমাদের এই প্রাইসিং।"
    },
    {
      question: "কম্বো সেটে কী কী থাকছে?",
      answer: "আমাদের এক্সক্লুসিভ কম্বোতে আপনি পাচ্ছেন: ১টি নেকলেস, ১ জোড়া কানের দুল, ১টি রিং এবং ১টি ব্রেসলেট। এর সাথে উপহার হিসেবে থাকছে একটি প্রিমিয়াম Adorous জুয়েলারি বক্স সম্পূর্ণ ফ্রি!"
    },
    {
      question: "রিংয়ের সাইজ কি অ্যাডজাস্টেবল?",
      answer: "জ্বি, আমাদের রিংগুলো ফ্রি-সাইজ ডিজাইনের। এগুলো খুব সহজেই আপনার আঙুলের মাপে ছোট বা বড় করে অ্যাডজাস্ট করে নেওয়া যাবে।"
    },
    {
      question: "গয়নার কালার কি নষ্ট হবে?",
      answer: "আমাদের গয়নায় এমন কোনো ম্যাটেরিয়াল ব্যবহার করা হয়নি যার কালার সহজে উঠে যায়। তবে এর দীর্ঘস্থায়ী চাকচিক্য ধরে রাখতে এগুলোকে সরাসরি পানি, পারফিউম এবং আগুন থেকে দূরে রাখার পরামর্শ দেওয়া হলো।"
    },
    {
      question: "আপনাদের কালেকশনে কম দামি প্রোডাক্ট নেই কেন?",
      answer: "Adorous সবসময় প্রিমিয়াম কোয়ালিটিতে বিশ্বাসী। খুব কম দামে উন্নত ম্যাটেরিয়াল এবং পারফেক্ট ফিনিশিং নিশ্চিত করা সম্ভব হয় না। আমরা চাই আমাদের কাস্টমাররা এমন কিছু কিনুন যা দেখতে বিলাসবহুল এবং দীর্ঘস্থায়ী হয়।"
    }
  ];

  return (
    <main className="min-h-screen bg-[#FCFBFA] pt-32 md:pt-48 pb-24 px-4 sm:px-6">
      <div className="mx-auto w-full max-w-3xl">
        
        {/* Back Button & Page Title */}
        <div className="mb-10 flex flex-col items-center text-center">
          <Link 
            href="/" 
            className="inline-flex items-center text-[12px] uppercase tracking-widest text-gray-500 hover:text-[#B76E79] transition-colors mb-6"
          >
            <ChevronLeft size={16} className="mr-1" /> Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-light text-[#1A1A1A] mb-4" style={{ fontFamily: "var(--font-serif)" }}>
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
            Find answers to common questions about our jewelry, quality, and services. If you need further assistance, feel free to contact us.
          </p>
        </div>

        {/* FAQ Accordion Section */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-2xl border transition-colors duration-300 ${
                openIndex === index ? "border-[#B76E79] shadow-sm" : "border-[#F7E7CE]/60 hover:border-[#D8C2B6]"
              }`}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="flex w-full items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className={`text-[15px] font-medium transition-colors duration-300 ${openIndex === index ? "text-[#B76E79]" : "text-[#1A1A1A]"}`}>
                  {faq.question}
                </span>
                <span className="ml-4 flex-shrink-0 text-[#B76E79]">
                  {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                </span>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-6 pt-0 text-sm text-gray-600 leading-relaxed border-t border-transparent">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Prompt */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 mb-4">Still have questions?</p>
          <Link 
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-[#1A1A1A] px-8 py-3 text-[13px] tracking-wider uppercase font-bold text-white transition hover:bg-[#B76E79]"
          >
            Contact Customer Care
          </Link>
        </div>

      </div>
    </main>
  );
}