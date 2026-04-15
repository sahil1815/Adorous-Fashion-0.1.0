"use client";

/**
 * ProductInfo.tsx
 *
 * The right-hand panel on the Product Detail Page.
 * All interactive — swatches, quantity, add-to-cart, wishlist, accordion.
 */

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  Share2,
  ShoppingBag,
  Check,
  Star,
  Minus,
  Plus,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore"; // <-- ADDED THIS FOR WISHLIST!
import ProductAccordion from "@/components/shop/ProductAccordion";
import type { AccordionItem } from "@/components/shop/ProductAccordion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ProductVariantData {
  id: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  attributes: Record<string, string>;
  images?: string[];
}

export interface ProductInfoProps {
  id: string;
  slug: string;
  name: string;
  shortDescription?: string;
  description: string;
  category: { name: string; slug: string };
  basePrice: number;
  compareAtPrice?: number;
  currency?: string;
  averageRating: number;
  reviewCount: number;
  totalStock: number;
  variants: ProductVariantData[];
  primaryImage: { url: string; alt: string };
  materials?: string;
  dimensions?: string;
  careInstructions?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatPrice(amount: number) {
  return "৳" + amount.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });
}


function getSavings(price: number, compare: number) {
  return Math.round(((compare - price) / compare) * 100);
}

// ---------------------------------------------------------------------------
// Star rating display
// ---------------------------------------------------------------------------

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={13}
            className={
              star <= Math.round(rating)
                ? "fill-[#B76E79] stroke-[#B76E79]"
                : "fill-[#1A1A1A]/10 stroke-[#1A1A1A]/20"
            }
          />
        ))}
      </div>
      <span className="text-[11px] tracking-[0.06em] text-[#1A1A1A]/45">
        {rating.toFixed(1)} ({count} {count === 1 ? "review" : "reviews"})
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function ProductInfo({
  id,
  slug,
  name,
  shortDescription,
  description,
  category,
  basePrice,
  compareAtPrice,
  currency = "USD",
  averageRating,
  reviewCount,
  totalStock,
  variants,
  primaryImage,
  materials,
  dimensions,
  careInstructions,
}: ProductInfoProps) {
  // ── Resolve colour swatches from variants ─────────────────────────────────
  const colorVariants = variants.filter((v) => v.attributes?.color);
  const hasSwatches   = colorVariants.length > 0;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariantData | null>(
    colorVariants[0] ?? null
  );
  const [quantity, setQuantity]     = useState(1);
  const [added, setAdded]           = useState(false);
  const [shared, setShared]         = useState(false);

  const { addItem, openCart } = useCartStore();
  
  // ── 5. FIXED WISHLIST LOGIC ───────────────────────────────────────────────
  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const wishlisted = isHydrated ? wishlistItems.some((item) => item.id === id) : false;

  // Active price (variant overrides base)
  const activePrice       = selectedVariant?.price       ?? basePrice;
  const activeCompare     = selectedVariant?.compareAtPrice ?? compareAtPrice;
  const activeStock       = selectedVariant?.stock ?? totalStock;
  const onSale            = !!(activeCompare && activeCompare > activePrice);
  const isSoldOut         = activeStock === 0;
  const savingsPct        = onSale && activeCompare ? getSavings(activePrice, activeCompare) : 0;
  const lowStock          = activeStock > 0 && activeStock <= 5;

  const handleWishlist = useCallback(() => {
    toggleWishlist({
      id,
      slug,
      name,
      category: category.name,
      price: activePrice,
      compareAtPrice: activeCompare,
      images: { primary: primaryImage },
    });
  }, [id, slug, name, category.name, activePrice, activeCompare, primaryImage, toggleWishlist]);

  // ── Add to cart ───────────────────────────────────────────────────────────
  const handleAddToCart = useCallback(() => {
    if (isSoldOut) return;
    addItem({
      id,
      variantId: selectedVariant?.id,
      name,
      slug,
      image: primaryImage.url,
      price: activePrice,
      quantity,
      attributes: selectedVariant?.attributes,
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      openCart();
    }, 1000);
  }, [id, name, slug, primaryImage, activePrice, quantity, selectedVariant, isSoldOut, addItem, openCart]);

  // ── Share ─────────────────────────────────────────────────────────────────
  const handleShare = useCallback(async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: name, url });
    } else {
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  }, [name]);

  // ── Accordion content ─────────────────────────────────────────────────────
  const accordionItems: AccordionItem[] = [
    {
      id: "details",
      label: "Product Details",
      content: (
        <div className="space-y-2">
          {description && <p>{description}</p>}
          {materials && (
            <p><span className="text-[#1A1A1A]/80 font-medium">Materials:</span> {materials}</p>
          )}
          {dimensions && (
            <p><span className="text-[#1A1A1A]/80 font-medium">Dimensions:</span> {dimensions}</p>
          )}
        </div>
      ),
    },
    {
      id: "care",
      label: "Care Instructions",
      content: (
        <p>
          {careInstructions ??
            "Store in the provided pouch away from sunlight. Avoid contact with perfume, water, and lotions. Polish gently with a soft cloth to restore shine."}
        </p>
      ),
    },
    {
      id: "shipping",
      label: "Shipping & Exchanges", // Updated title
      content: (
        <div className="space-y-2">
          {/* 3 & 4. UPDATED FANCY TEXT AND ৳2000 THRESHOLD */}
          <p>Complimentary standard shipping on all orders over ৳2000.</p>
          <p>Express delivery (2–3 business days) is available at checkout.</p>
          <p>We gladly offer exchanges within 30 days of purchase, provided the piece remains in its pristine, original condition.</p>
          <p className="mt-3">
            <Link
              href="/returns"
              className="underline underline-offset-2 hover:text-[#B76E79] transition-colors"
            >
              View full exchange policy →
            </Link>
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-7">

      {/* ── Breadcrumb ────────────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5 flex-wrap">
          {[
            { label: "Home",         href: "/" },
            { label: "Products",     href: "/products" },
            { label: category.name,  href: `/products?category=${category.slug}` },
          ].map((crumb, i, arr) => (
            <li key={crumb.href} className="flex items-center gap-1.5">
              <Link
                href={crumb.href}
                className="text-[10px] tracking-[0.15em] uppercase text-[#1A1A1A]/40 hover:text-[#B76E79] transition-colors"
              >
                {crumb.label}
              </Link>
              {i < arr.length - 1 && (
                <ChevronRight size={10} className="text-[#1A1A1A]/25" />
              )}
            </li>
          ))}
          <li className="flex items-center gap-1.5">
            <ChevronRight size={10} className="text-[#1A1A1A]/25" />
            <span className="text-[10px] tracking-[0.15em] uppercase text-[#1A1A1A]/70">
              {name}
            </span>
          </li>
        </ol>
      </nav>

      {/* ── Name + rating ─────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <h1
          className="text-3xl md:text-4xl font-light leading-tight text-[#1A1A1A] tracking-wide"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {name}
        </h1>
        {reviewCount > 0 && (
          <StarRating rating={averageRating} count={reviewCount} />
        )}
        {shortDescription && (
          <p className="text-[13px] leading-relaxed text-[#1A1A1A]/55 tracking-wide">
            {shortDescription}
          </p>
        )}
      </div>

      {/* ── Price ─────────────────────────────────────────────────────────── */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <span
          className={`text-2xl font-light tracking-wide ${onSale ? "text-[#B76E79]" : "text-[#1A1A1A]"}`}
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {formatPrice(activePrice, currency)}
        </span>
        {onSale && activeCompare && (
          <>
            <span className="text-[16px] text-[#1A1A1A]/30 line-through tracking-wide">
              {formatPrice(activeCompare, currency)}
            </span>
            <span className="text-[10px] tracking-[0.12em] uppercase font-semibold bg-[#B76E79]/10 text-[#B76E79] px-2 py-0.5 rounded-sm">
              Save {savingsPct}%
            </span>
          </>
        )}
      </div>

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <hr className="border-[#1A1A1A]/08" />

      {/* ── Color swatches ────────────────────────────────────────────────── */}
      {hasSwatches && (
        <div className="space-y-3">
          <p className="text-[11px] tracking-[0.18em] uppercase text-[#1A1A1A]/60">
            Color —{" "}
            <span className="text-[#1A1A1A] font-medium">
              {selectedVariant?.attributes?.color ?? "Select"}
            </span>
          </p>
          <div className="flex items-center gap-2.5 flex-wrap" role="radiogroup" aria-label="Select color">
            {colorVariants.map((variant) => {
              const color = variant.attributes.color;
              // Map colour names to hex for the swatch dot
              const colorHex: Record<string, string> = {
                "Rose Gold": "#C5977D",
                "Gold":      "#C9A84C",
                "Silver":    "#B0B0B0",
                "Black":     "#1A1A1A",
                "Blush":     "#E8AABB",
                "Ivory":     "#EDE8DC",
                "White":     "#F5F5F5",
              };
              const hex     = colorHex[color] ?? "#888";
              const active  = selectedVariant?.id === variant.id;
              const soldOut = variant.stock === 0;

              return (
                <button
                  key={variant.id}
                  role="radio"
                  aria-checked={active}
                  aria-label={color + (soldOut ? " — sold out" : "")}
                  disabled={soldOut}
                  onClick={() => setSelectedVariant(variant)}
                  className={`
                    relative w-8 h-8 rounded-full
                    border-2 transition-all duration-200
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B76E79] focus-visible:ring-offset-1
                    ${active ? "border-[#1A1A1A] scale-110" : "border-transparent hover:scale-110"}
                    ${soldOut ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                  `}
                  style={{ backgroundColor: hex }}
                  title={color}
                >
                  {/* Sold-out diagonal line */}
                  {soldOut && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="block w-[130%] h-px bg-[#1A1A1A]/40 rotate-45" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Quantity stepper ──────────────────────────────────────────────── */}
      <div className="space-y-3">
        <p className="text-[11px] tracking-[0.18em] uppercase text-[#1A1A1A]/60">
          Quantity
        </p>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-[#1A1A1A]/20 rounded-sm">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-10 h-10 flex items-center justify-center text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <Minus size={13} strokeWidth={2} />
            </button>
            <span className="w-10 text-center text-[14px] font-medium text-[#1A1A1A] select-none">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(activeStock, q + 1))}
              disabled={quantity >= activeStock}
              className="w-10 h-10 flex items-center justify-center text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <Plus size={13} strokeWidth={2} />
            </button>
          </div>

          {/* Stock status */}
          {isSoldOut ? (
            <span className="text-[11px] tracking-[0.1em] uppercase text-[#1A1A1A]/40">
              Out of Stock
            </span>
          ) : lowStock ? (
            <span className="text-[11px] tracking-[0.1em] uppercase text-[#B76E79]">
              Only {activeStock} left
            </span>
          ) : null}
        </div>
      </div>

      {/* ── CTA row ───────────────────────────────────────────────────────── */}
      <div className="flex gap-3">
        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={isSoldOut}
          className={`
            flex-1 flex items-center justify-center gap-2.5
            py-4 rounded-sm
            text-[11px] tracking-[0.25em] uppercase font-semibold
            transition-all duration-300
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B76E79] focus-visible:ring-offset-1
            ${isSoldOut
              ? "bg-[#1A1A1A]/20 text-[#1A1A1A]/40 cursor-not-allowed"
              : added
              ? "bg-[#B76E79] text-white"
              : "bg-[#1A1A1A] text-[#F7E7CE] hover:bg-[#B76E79]"}
          `}
        >
          {added
            ? <><Check size={14} strokeWidth={2.5} /> Added to Bag</>
            : isSoldOut
            ? "Sold Out"
            : <><ShoppingBag size={14} strokeWidth={1.8} /> Add to Bag</>}
        </button>

        {/* 5. FIXED WISHLIST BUTTON */}
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          className={`
            w-[52px] flex items-center justify-center
            border rounded-sm transition-all duration-200
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B76E79] focus-visible:ring-offset-1
            ${wishlisted
              ? "border-[#B76E79] bg-[#B76E79]/05"
              : "border-[#1A1A1A]/20 hover:border-[#B76E79]"}
          `}
        >
          <Heart
            size={18}
            strokeWidth={1.8}
            fill={wishlisted ? "#B76E79" : "none"}
            stroke={wishlisted ? "#B76E79" : "#1A1A1A"}
            className="transition-all duration-200"
          />
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          aria-label="Share this product"
          className="
            w-[52px] flex items-center justify-center
            border border-[#1A1A1A]/20 rounded-sm
            text-[#1A1A1A]/50 hover:text-[#B76E79] hover:border-[#B76E79]
            transition-all duration-200
            focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B76E79] focus-visible:ring-offset-1
          "
        >
          {shared
            ? <Check size={16} strokeWidth={2} className="text-[#B76E79]" />
            : <Share2 size={16} strokeWidth={1.8} />}
        </button>
      </div>

      {/* ── Trust badges ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 py-4 border-y border-[#1A1A1A]/08">
        {[
          // 1 & 2. UPDATED BADGE TEXT AND THRESHOLDS
          { icon: <Truck size={15} strokeWidth={1.5} />,       label: "Free shipping", sub: "on orders over ৳2000" },
          { icon: <RotateCcw size={15} strokeWidth={1.5} />,   label: "Exchanges",     sub: "Available within 30 days" },
          { icon: <ShieldCheck size={15} strokeWidth={1.5} />, label: "Authentic",     sub: "guaranteed" },
        ].map(({ icon, label, sub }) => (
          <div key={label} className="flex flex-col items-center text-center gap-1.5">
            <span className="text-[#B76E79]">{icon}</span>
            <span className="text-[10px] tracking-[0.1em] uppercase font-medium text-[#1A1A1A]">
              {label}
            </span>
            <span className="text-[9px] tracking-[0.06em] text-[#1A1A1A]/40">{sub}</span>
          </div>
        ))}
      </div>

      {/* ── Accordion ─────────────────────────────────────────────────────── */}
      <ProductAccordion items={accordionItems} defaultOpen="details" />
    </div>
  );
}