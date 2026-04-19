"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Facebook, Instagram, Youtube, MessageCircle } from "lucide-react";

export default function Footer() {
  // This state tracks which accordion is open on mobile. Null means all are closed.
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const footerLinks = {
    policies: [
      { name: "Return & Refund Policy", href: "/return-policy" },
      { name: "Exchange Policy", href: "/exchange-policy" },
      { name: "Shipping & Delivery Policy", href: "/shipping-policy" },
      { name: "Cancellation Policy", href: "/cancellation-policy" },
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms & Conditions", href: "/terms" },
    ],
    customerCare: [
      { name: "Contact Us", href: "/contact" },
      { name: "Track Order", href: "/account#order-history" },
      { name: "FAQs", href: "/faqs" },
    ],
  };

  return (
      <footer className="bg-[#FAF9F7] border-t border-[#F7E7CE] pt-10 pb-6">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        
        {/* DESKTOP & TABLET LAYOUT (Hidden on mobile) */}
        <div className="hidden md:flex justify-between gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="w-1/4">
            <h2 
              className="text-2xl font-medium text-[#1A1A1A] tracking-wide mb-3"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              A D O R O U S
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-1">
              Bangladesh's Premium Online Fashion Mall
            </p>
            {/* Optional: Add your Trade License or DBID here if needed */}
            {/* <p className="text-[11px] text-gray-400">DBID - 123456789</p> */}
          </div>

          {/* Policies Column */}
          <div className="w-1/4">
            <h3 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-5">
              Adorous Policies
            </h3>
            <ul className="space-y-3">
              {footerLinks.policies.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[13px] text-gray-500 hover:text-[#B76E79] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care Column */}
          <div className="w-1/4">
            <h3 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-5">
              Customer Care
            </h3>
            <ul className="space-y-3">
              {footerLinks.customerCare.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[13px] text-gray-500 hover:text-[#B76E79] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links Column */}
          <div className="w-1/4">
            <h3 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-5">
              Social Links
            </h3>
            <ul className="space-y-4">
              <li>
                <a href="https://www.facebook.com/profile.php?id=61586765072169" className="flex items-center gap-3 text-[13px] text-gray-500 hover:text-[#B76E79] transition-colors group">
                  <Facebook size={18} className="group-hover:scale-110 transition-transform" /> Facebook
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/adorous_fashion/?hl=en" className="flex items-center gap-3 text-[13px] text-gray-500 hover:text-[#B76E79] transition-colors group">
                  <Instagram size={18} className="group-hover:scale-110 transition-transform" /> Instagram
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-3 text-[13px] text-gray-500 hover:text-[#B76E79] transition-colors group">
                  <Youtube size={18} className="group-hover:scale-110 transition-transform" /> YouTube
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-3 text-[13px] text-gray-500 hover:text-[#B76E79] transition-colors group">
                  <MessageCircle size={18} className="group-hover:scale-110 transition-transform" /> WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* MOBILE LAYOUT WITH ACCORDIONS (Hidden on desktop) */}
        <div className="flex flex-col md:hidden mb-12 space-y-2">
          
          {/* Mobile Brand Info */}
          <div className="mb-6 text-center">
            <h2 
              className="text-2xl font-medium text-[#1A1A1A] tracking-wide mb-2"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              A D O R O U S
            </h2>
            <p className="text-xs text-gray-500">Premium Online Fashion</p>
          </div>

          {/* Policies Accordion */}
          <div className="border-b border-gray-100">
            <button 
              onClick={() => toggleSection('policies')}
              className="flex justify-between items-center w-full py-4 text-left"
            >
              <span className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider">Adorous Policies</span>
              <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${openSection === 'policies' ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSection === 'policies' ? 'max-h-64 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
              <ul className="space-y-3 pt-1 pl-2">
                {footerLinks.policies.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-[13px] text-gray-500 hover:text-[#B76E79] block py-1">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Customer Care Accordion */}
          <div className="border-b border-gray-100">
            <button 
              onClick={() => toggleSection('care')}
              className="flex justify-between items-center w-full py-4 text-left"
            >
              <span className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider">Customer Care</span>
              <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${openSection === 'care' ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSection === 'care' ? 'max-h-48 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
              <ul className="space-y-3 pt-1 pl-2">
                {footerLinks.customerCare.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-[13px] text-gray-500 hover:text-[#B76E79] block py-1">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social Links Accordion */}
          <div className="border-b border-gray-100">
            <button 
              onClick={() => toggleSection('socials')}
              className="flex justify-between items-center w-full py-4 text-left"
            >
              <span className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider">Social Links</span>
              <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${openSection === 'socials' ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSection === 'socials' ? 'max-h-48 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
              <ul className="space-y-3 pt-1 pl-2 flex flex-col gap-1">
                <li>
                  <a href="#" className="flex items-center gap-3 text-[13px] text-gray-500 hover:text-[#B76E79] py-1">
                    <Facebook size={16} /> Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 text-[13px] text-gray-500 hover:text-[#B76E79] py-1">
                    <Instagram size={16} /> Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 text-[13px] text-gray-500 hover:text-[#B76E79] py-1">
                    <Youtube size={16} /> YouTube
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 text-[13px] text-gray-500 hover:text-[#B76E79] py-1">
                    <MessageCircle size={16} /> WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* COPYRIGHT BOTTOM BAR */}
        <div className="w-full text-center border-t border-gray-100 pt-6">
          <p className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold">
            © {new Date().getFullYear()} Adorous. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}