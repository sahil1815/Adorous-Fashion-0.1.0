"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";

export interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  category?: string;
  price: number;
  compareAtPrice?: number;
  images: {
    primary: { url: string; alt: string };
    hover?:  { url: string; alt: string };
  };
  
  badge?: string;
  swatches?: any[];
  currency?: string;
  onQuickView?: (id: string) => void;
  animationDelay?: number;
}

function formatPrice(amount: number) {
  return "৳" + amount.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

function getSavingsPercent(price: number, compareAtPrice: number) {
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col border border-gray-100 bg-white animate-pulse">
      <div className="aspect-square bg-gray-100" />
      <div className="flex flex-col items-center justify-center p-4 md:p-5 gap-2">
        <div className="h-3 w-3/4 bg-gray-200 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 rounded mt-1" />
      </div>
    </div>
  );
}

export default function ProductCard(props: ProductCardProps) {
  const { id, slug, name, price, compareAtPrice, images } = props;
  const [hovered, setHovered] = useState(false);
  
  // Connect to our new Wishlist Store
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true); // Wait for local storage to load
  }, []);

  const wishlisted = isHydrated ? isInWishlist(id) : false;
  const onSale = !!(compareAtPrice && compareAtPrice > price);
  const savings = onSale && compareAtPrice ? getSavingsPercent(price, compareAtPrice) : 0;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(props); // Saves the entire product to the wishlist!
  };

  return (
    <article
      className="group flex flex-col border border-gray-100 bg-white transition-shadow duration-300 hover:shadow-md"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/products/${slug}`} className="relative block overflow-hidden bg-[#fafafa] aspect-square">
        <Image src={images?.primary?.url || "/placeholder.jpg"} alt={images?.primary?.alt || name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className={`object-cover object-center transition-opacity duration-700 ease-in-out ${hovered && images?.hover?.url ? "opacity-0" : "opacity-100"}`} />
        {images?.hover?.url && (
          <Image src={images.hover.url} alt={images.hover.alt || `${name} hover`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className={`object-cover object-center absolute inset-0 transition-opacity duration-700 ease-in-out ${hovered ? "opacity-100" : "opacity-0"}`} />
        )}

        <button onClick={handleWishlist} className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/60 backdrop-blur-[2px] transition-transform hover:scale-110 shadow-sm" aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}>
          <Heart size={16} className="transition-colors duration-200" fill={wishlisted ? "#B76E79" : "transparent"} stroke={wishlisted ? "#B76E79" : "#9ca3af"} strokeWidth={1.5} />
        </button>

        <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-10 hidden md:block transition-all duration-300 ${hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
          <span className="bg-[#4a4a4a]/90 text-white text-[11px] px-5 py-2 uppercase tracking-widest backdrop-blur-sm shadow-sm whitespace-nowrap">View Details</span>
        </div>
      </Link>

      <div className="flex flex-col items-center justify-center p-4 md:p-5 text-center">
        <Link href={`/products/${slug}`} className="block w-full">
          <h3 className="text-[13px] md:text-[14px] text-[#4a4a4a] mb-2 line-clamp-2">{name}</h3>
        </Link>
        <div className="flex items-center justify-center gap-1.5 md:gap-2">
          <span className="text-[16px] md:text-[18px] font-bold text-[#1A1A1A]">{formatPrice(price)}</span>
          {onSale && compareAtPrice && <span className="text-[13px] md:text-[14px] text-[#9ca3af] line-through font-medium">{formatPrice(compareAtPrice)}</span>}
        </div>
        {onSale && compareAtPrice && <span className="text-[12px] md:text-[13px] text-[#d97736] font-medium mt-1">[{savings}% off]</span>}
      </div>
    </article>
  );
}