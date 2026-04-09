"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-[#F7E7CE] pt-16 pb-8">
      <div className="container mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-light tracking-widest mb-6" style={{ fontFamily: "var(--font-serif)" }}>
              ADOROUS
            </h3>
            <p className="text-sm text-[#F7E7CE]/70 leading-relaxed pr-4">
              Handcrafted jewelry and artisanal bags for the modern woman. Timeless elegance, designed to be worn every day.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#B76E79] mb-6">
              Shop
            </h4>
            <ul className="space-y-4 text-sm text-[#F7E7CE]/70">
              <li><Link href="/category/necklaces" className="hover:text-white transition-colors">Necklaces</Link></li>
              <li><Link href="/category/earrings" className="hover:text-white transition-colors">Earrings</Link></li>
              <li><Link href="/category/bracelets" className="hover:text-white transition-colors">Bracelets</Link></li>
              <li><Link href="/category/bags" className="hover:text-white transition-colors">Bags</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#B76E79] mb-6">
              Support
            </h4>
            <ul className="space-y-4 text-sm text-[#F7E7CE]/70">
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/care" className="hover:text-white transition-colors">Jewelry Care</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#B76E79] mb-6">
              Stay Connected
            </h4>
            <p className="text-sm text-[#F7E7CE]/70 mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form className="flex flex-col space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="bg-transparent border-b border-[#F7E7CE]/30 pb-2 text-sm text-white placeholder:text-[#F7E7CE]/40 focus:outline-none focus:border-[#B76E79] transition-colors rounded-none"
              />
              <button 
                type="submit" 
                className="text-left text-[11px] uppercase tracking-[0.2em] text-[#B76E79] hover:text-white transition-colors mt-2"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#F7E7CE]/10 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-[#F7E7CE]/50 mb-4 md:mb-0 tracking-wider">
            &copy; {new Date().getFullYear()} Adorous Fashion. All rights reserved.
          </p>
          <div className="flex space-x-6 text-[#F7E7CE]/50">
            <a href="#" className="hover:text-[#B76E79] transition-colors"><Instagram size={18} strokeWidth={1.5} /></a>
            <a href="#" className="hover:text-[#B76E79] transition-colors"><Facebook size={18} strokeWidth={1.5} /></a>
            <a href="#" className="hover:text-[#B76E79] transition-colors"><Twitter size={18} strokeWidth={1.5} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}