"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";
import ProductGridClient from "@/components/shop/ProductGridClient";

export default function WishlistPage() {
  const { items } = useWishlistStore();
  const [isMounted, setIsMounted] = useState(false);

  // Prevents Next.js hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <main className="min-h-screen bg-white pt-32 pb-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">

        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 
            className="text-4xl md:text-5xl font-light text-[#1A1A1A] mb-4 flex items-center justify-center gap-3"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            My Wishlist <Heart size={28} className="text-[#B76E79]" fill="#B76E79" />
          </h1>
          <p className="text-[#1A1A1A]/60 tracking-wide text-sm leading-relaxed">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {items.length > 0 ? (
          <ProductGridClient products={items} columns={4} />
        ) : (
          <div className="py-24 text-center border border-dashed border-[#1A1A1A]/20 bg-gray-50 flex flex-col items-center justify-center">
            <Heart size={40} className="text-[#1A1A1A]/20 mb-4" />
            <p className="text-sm tracking-widest uppercase text-[#1A1A1A]/50 mb-6">
              Your wishlist is currently empty.
            </p>
            <Link 
              href="/collections/all" 
              className="bg-[#1A1A1A] text-white text-[11px] tracking-[0.2em] uppercase px-8 py-4 hover:bg-[#B76E79] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}