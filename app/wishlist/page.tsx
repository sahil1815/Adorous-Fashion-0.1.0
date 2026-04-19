// app/wishlist/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";
import ProductGridClient from "@/components/shop/ProductGridClient";
import type { ProductCardProps } from "@/components/shop/ProductCard";

export default function WishlistPage() {
  const { items } = useWishlistStore();
  const [isMounted, setIsMounted] = useState(false);
  
  // We will store the fresh, database-fetched items here
  const [freshItems, setFreshItems] = useState<ProductCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Prevents Next.js hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch fresh data from MongoDB whenever the page loads or wishlist changes
  useEffect(() => {
    if (!isMounted) return;

    if (items.length === 0) {
      setFreshItems([]);
      setIsLoading(false);
      return;
    }

    const fetchFreshData = async () => {
      try {
        // 1. Get just the IDs from the browser's local storage memory
        const ids = items.map((item) => item.id);
        
        // 2. Ask the database for the absolute newest stats for these IDs
        const response = await fetch("/api/wishlist/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids }),
        });

        if (response.ok) {
          const data = await response.json();
          setFreshItems(data.products);
        } else {
          // Fallback to local storage if the database fetch fails
          setFreshItems(items);
        }
      } catch (error) {
        setFreshItems(items);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFreshData();
  }, [isMounted, items]); 

  if (!isMounted) return null;

  return (
    <main className="min-h-screen bg-white pt-32 md:pt-48 pb-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">

        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 
            className="text-4xl md:text-5xl font-light text-[#1A1A1A] mb-4 flex items-center justify-center gap-3"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            My Wishlist <Heart size={28} className="text-[#B76E79]" fill="#B76E79" />
          </h1>
          <p className="text-[#1A1A1A]/60 tracking-wide text-sm leading-relaxed">
            {freshItems.length} {freshItems.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {isLoading ? (
          // Elegant loading spinner while fetching fresh data
          <div className="py-24 text-center flex justify-center items-center">
             <div className="w-8 h-8 border-2 border-[#B76E79] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : freshItems.length > 0 ? (
          <ProductGridClient products={freshItems} columns={4} />
        ) : (
          <div className="py-24 text-center border border-dashed border-[#1A1A1A]/20 bg-gray-50 flex flex-col items-center justify-center">
            <Heart size={40} className="text-[#1A1A1A]/20 mb-4" />
            <p className="text-sm tracking-widest uppercase text-[#1A1A1A]/50 mb-6">
              Your wishlist is currently empty.
            </p>
            <Link 
              href="/shop" 
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