"use client";

/**
 * ProductCard.tsx
 *
 * Features:
 *  - Primary → secondary image crossfade on hover
 *  - "Quick Add" tray slides up on hover (with optional color swatches)
 *  - Wishlist heart toggle with scale animation
 *  - "New" / "Sale" / custom badge support
 *  - Strikethrough compareAtPrice + % saved pill
 *  - Skeleton loading state
 *  - Fully accessible: keyboard-navigable, aria labels
 */

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ProductCardSwatch {
  label: string;       // e.g. "Rose Gold"
  color: string;       // hex or CSS color value
  variantId?: string;
}

export interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  category?: string;
  price: number;
  compareAtPrice?: number;
  currency?: string;
  images: {
    primary: { url: string; alt: string; width?: number; height?: number };
    hover?:  { url: string; alt: string; width?: number; height?: number };
  };
  badge?: "new" | "sale" | "sold-out" | string; // "new" | "sale" | custom text
  swatches?: ProductCardSwatch[];
  isWishlisted?: boolean;
  onWishlistToggle?: (id: string, wishlisted: boolean) => void;
  onQuickView?: (id: string) => void;
  /** Stagger delay for grid entrance animation (ms) */
  animationDelay?: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatPrice(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function getSavingsPercent(price: number, compareAtPrice: number) {
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

// Badge config: maps badge key → { label, classes }
const BADGE_MAP: Record<string, { label: string; classes: string }> = {
  new: {
    label: "New",
    classes: "bg-[#1A1A1A] text-[#F7E7CE]",
  },
  sale: {
    label: "Sale",
    classes: "bg-[#B76E79] text-white",
  },
  "sold-out": {
    label: "Sold Out",
    classes: "bg-[#1A1A1A]/40 text-white",
  },
};

// ---------------------------------------------------------------------------
// Skeleton — shown while images load / during SSR placeholder use
// ---------------------------------------------------------------------------

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="aspect-[3/4] bg-[#F7E7CE]/60 rounded-sm" />
      <div className="space-y-2 px-1">
        <div className="h-3 w-1/3 bg-[#F7E7CE] rounded" />
        <div className="h-4 w-2/3 bg-[#F7E7CE]/80 rounded" />
        <div className="h-3 w-1/4 bg-[#F7E7CE]/60 rounded" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main ProductCard
// ---------------------------------------------------------------------------

export default function ProductCard({
  id,
  slug,
  name,
  category,
  price,
  compareAtPrice,
  currency = "USD",
  images,
  badge,
  swatches,
  isWishlisted: initialWishlisted = false,
  onWishlistToggle,
  onQuickView,
  animationDelay = 0,
}: ProductCardProps) {
  const [hovered, setHovered]         = useState(false);
  const [wishlisted, setWishlisted]   = useState(initialWishlisted);
  const [activeSwatch, setActiveSwatch] = useState(swatches?.[0] ?? null);
  const [addedToCart, setAddedToCart] = useState(false);

  const { addItem, openCart } = useCartStore();

  const onSale = !!(compareAtPrice && compareAtPrice > price);
  const isSoldOut = badge === "sold-out";
  const savings = onSale && compareAtPrice ? getSavingsPercent(price, compareAtPrice) : 0;

  // Resolve badge config
  const badgeConfig = badge
    ? (BADGE_MAP[badge] ?? { label: badge, classes: "bg-[#1A1A1A] text-[#F7E7CE]" })
    : null;

  const handleWishlist = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const next = !wishlisted;
      setWishlisted(next);
      onWishlistToggle?.(id, next);
    },
    [id, wishlisted, onWishlistToggle]
  );

  const handleQuickView = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onQuickView?.(id);
    },
    [id, onQuickView]
  );

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isSoldOut) return;

      addItem({
        id,
        variantId: activeSwatch?.variantId,
        name,
        slug,
        image: images.primary.url,
        price,
        quantity: 1,
        attributes: activeSwatch ? { color: activeSwatch.label } : undefined,
      });

      // Brief "Added!" feedback, then open cart drawer
      setAddedToCart(true);
      setTimeout(() => {
        setAddedToCart(false);
        openCart();
      }, 800);
    },
    [id, name, slug, images, price, activeSwatch, isSoldOut, addItem, openCart]
  );

  return (
    <article
      className="group flex flex-col gap-0 relative"
      style={{
        animationDelay: `${animationDelay}ms`,
        animationFillMode: "both",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Image container ─────────────────────────────────────────────── */}
      <Link
        href={`/products/${slug}`}
        className="relative block overflow-hidden bg-[#F7E7CE]/30 rounded-sm aspect-[3/4]"
        tabIndex={0}
        aria-label={`View ${name}`}
      >
        {/* Primary image */}
        <Image
          src={images.primary.url}
          alt={images.primary.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={`
            object-cover object-center
            transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]
            ${hovered && images.hover ? "opacity-0 scale-[1.03]" : "opacity-100 scale-100"}
          `}
          priority={false}
        />

        {/* Hover / secondary image */}
        {images.hover && (
          <Image
            src={images.hover.url}
            alt={images.hover.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`
              object-cover object-center absolute inset-0
              transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]
              ${hovered ? "opacity-100 scale-100" : "opacity-0 scale-[1.03]"}
            `}
          />
        )}

        {/* Sold-out overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
            <span
              className="text-[11px] tracking-[0.22em] uppercase text-[#1A1A1A]/60 font-medium
                border border-[#1A1A1A]/20 px-4 py-2 bg-white/80"
            >
              Sold Out
            </span>
          </div>
        )}

        {/* ── Badge ─────────────────────────────────────────────────────── */}
        {badgeConfig && !isSoldOut && (
          <span
            className={`
              absolute top-3 left-3 z-10
              text-[9px] tracking-[0.2em] uppercase font-semibold
              px-2.5 py-1.5 ${badgeConfig.classes}
            `}
          >
            {badgeConfig.label}
          </span>
        )}

        {/* ── Wishlist button (always visible on mobile, hover on desktop) */}
        <button
          onClick={handleWishlist}
          className={`
            absolute top-3 right-3 z-10
            w-8 h-8 flex items-center justify-center
            bg-white/80 backdrop-blur-sm rounded-full
            transition-all duration-300
            sm:opacity-0 sm:translate-y-1
            ${hovered ? "sm:opacity-100 sm:translate-y-0" : ""}
            hover:bg-white hover:scale-110
          `}
          aria-label={wishlisted ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
          aria-pressed={wishlisted}
        >
          <Heart
            size={14}
            className="transition-all duration-200"
            fill={wishlisted ? "#B76E79" : "none"}
            stroke={wishlisted ? "#B76E79" : "#1A1A1A"}
            strokeWidth={1.8}
          />
        </button>

        {/* ── Quick View button ──────────────────────────────────────────── */}
        {onQuickView && (
          <button
            onClick={handleQuickView}
            className={`
              absolute top-3 right-12 z-10
              w-8 h-8 flex items-center justify-center
              bg-white/80 backdrop-blur-sm rounded-full
              transition-all duration-300 delay-75
              sm:opacity-0 sm:translate-y-1
              ${hovered ? "sm:opacity-100 sm:translate-y-0" : ""}
              hover:bg-white hover:scale-110
            `}
            aria-label={`Quick view ${name}`}
          >
            <Eye size={14} stroke="#1A1A1A" strokeWidth={1.8} />
          </button>
        )}

        {/* ── Quick-Add tray ─────────────────────────────────────────────── */}
        <div
          className={`
            absolute bottom-0 inset-x-0 z-10
            transition-all duration-400 ease-[cubic-bezier(0.32,0,0.15,1)]
            ${hovered && !isSoldOut
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0"}
          `}
        >
          <button
            onClick={handleAddToCart}
            disabled={isSoldOut}
            className={`
              w-full py-3.5
              text-[11px] tracking-[0.22em] uppercase font-semibold
              transition-colors duration-200 flex items-center justify-center gap-2
              ${addedToCart
                ? "bg-[#B76E79] text-white"
                : "bg-[#1A1A1A] text-[#F7E7CE] hover:bg-[#B76E79]"}
            `}
          >
            <ShoppingBag size={13} />
            {addedToCart ? "Added!" : "Quick Add"}
          </button>
        </div>
      </Link>

      {/* ── Card body ───────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 pt-3.5 px-0.5">

        {/* Category */}
        {category && (
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#B76E79] font-medium">
            {category}
          </p>
        )}

        {/* Product name */}
        <Link
          href={`/products/${slug}`}
          className="block group/name"
          tabIndex={-1}   // already focusable via the image link above
        >
          <h3
            className="
              text-[15px] leading-snug text-[#1A1A1A] font-light
              tracking-wide group-hover/name:text-[#B76E79]
              transition-colors duration-200
            "
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {name}
          </h3>
        </Link>

        {/* Color swatches */}
        {swatches && swatches.length > 0 && (
          <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Color options">
            {swatches.map((swatch) => (
              <button
                key={swatch.label}
                role="radio"
                aria-checked={activeSwatch?.label === swatch.label}
                aria-label={swatch.label}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSwatch(swatch);
                }}
                className={`
                  w-4 h-4 rounded-full border-2 transition-all duration-150
                  hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#B76E79] focus:ring-offset-1
                  ${activeSwatch?.label === swatch.label
                    ? "border-[#1A1A1A] scale-110"
                    : "border-transparent"}
                `}
                style={{ backgroundColor: swatch.color }}
                title={swatch.label}
              />
            ))}
            {activeSwatch && (
              <span className="text-[10px] tracking-[0.1em] text-[#1A1A1A]/50 ml-1">
                {activeSwatch.label}
              </span>
            )}
          </div>
        )}

        {/* Price row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`
              text-[14px] font-medium tracking-wide
              ${onSale ? "text-[#B76E79]" : "text-[#1A1A1A]"}
            `}
          >
            {formatPrice(price, currency)}
          </span>

          {onSale && compareAtPrice && (
            <>
              <span className="text-[13px] text-[#1A1A1A]/35 line-through">
                {formatPrice(compareAtPrice, currency)}
              </span>
              <span
                className="
                  text-[9px] tracking-[0.12em] uppercase font-semibold
                  bg-[#B76E79]/12 text-[#B76E79] px-1.5 py-0.5 rounded-sm
                "
              >
                −{savings}%
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}