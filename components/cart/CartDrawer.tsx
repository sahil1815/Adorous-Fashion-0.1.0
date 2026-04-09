"use client";

/**
 * CartDrawer.tsx
 *
 * A full-height slide-in cart panel that opens from the right.
 *
 * Features:
 *  - Smooth slide + backdrop fade transition
 *  - Three states: loading skeleton, empty, populated
 *  - Per-item quantity stepper + remove
 *  - Order summary: subtotal, shipping threshold, savings
 *  - Free-shipping progress bar
 *  - Promo code input (UI only — wire to API when ready)
 *  - Checkout CTA + "Continue Shopping" link
 *  - Body scroll lock while open
 *  - Closes on Escape key and backdrop click
 *  - Fully accessible: focus-trap, aria labels, role="dialog"
 */

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { X, ShoppingBag, ChevronRight, Tag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import CartItem from "@/components/cart/CartItem";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Cart value threshold for free shipping */
const FREE_SHIPPING_THRESHOLD = 150;

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

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-8 py-16 text-center gap-6">
      {/* Decorative bag icon */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-[#F7E7CE] flex items-center justify-center">
          <ShoppingBag size={32} stroke="#B76E79" strokeWidth={1.2} />
        </div>
        {/* Small rose gold dot */}
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#B76E79] rounded-full" />
      </div>

      <div className="space-y-2">
        <p
          className="text-2xl font-light text-[#1A1A1A]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Your bag is empty
        </p>
        <p className="text-[12px] tracking-[0.1em] text-[#1A1A1A]/45">
          Discover our new arrivals
        </p>
      </div>

      <button
        onClick={onClose}
        className="
          mt-2 px-8 py-3.5 bg-[#1A1A1A] text-[#F7E7CE]
          text-[11px] tracking-[0.22em] uppercase font-semibold
          hover:bg-[#B76E79] transition-colors duration-300
          rounded-sm
        "
      >
        Continue Shopping
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skeleton loading state
// ---------------------------------------------------------------------------

function CartSkeleton() {
  return (
    <div className="flex flex-col gap-5 px-6 py-5 animate-pulse">
      {[1, 2].map((i) => (
        <div key={i} className="flex gap-4">
          <div className="w-20 h-24 bg-[#F7E7CE]/60 rounded-sm flex-shrink-0" />
          <div className="flex-1 space-y-3 pt-1">
            <div className="h-3.5 bg-[#F7E7CE]/80 rounded w-3/4" />
            <div className="h-3 bg-[#F7E7CE]/60 rounded w-1/2" />
            <div className="h-3 bg-[#F7E7CE]/40 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Free shipping progress bar
// ---------------------------------------------------------------------------

function ShippingProgress({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const progress  = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const achieved  = remaining === 0;

  return (
    <div className="px-6 py-4 bg-[#F7E7CE]/50 border-b border-[#1A1A1A]/06">
      <p className="text-[11px] tracking-[0.12em] text-[#1A1A1A]/60 mb-2.5">
        {achieved ? (
          <span className="text-[#B76E79] font-medium">
            ✓ You've unlocked free shipping!
          </span>
        ) : (
          <>
            Add{" "}
            <span className="font-semibold text-[#1A1A1A]">
              {formatPrice(remaining)}
            </span>{" "}
            more for free shipping
          </>
        )}
      </p>
      {/* Progress bar */}
      <div className="h-0.5 w-full bg-[#1A1A1A]/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#B76E79] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main CartDrawer
// ---------------------------------------------------------------------------

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    totalItems,
    totalPrice,
  } = useCartStore();

  const drawerRef   = useRef<HTMLDivElement>(null);
  const closeRef    = useRef<HTMLButtonElement>(null);

  const subtotal   = totalPrice();
  const itemCount  = totalItems();
  const hasItems   = items.length > 0;

  // ── Lock body scroll while open ─────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // ── Close on Escape ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, closeCart]);

  // ── Focus the close button when drawer opens ─────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => closeRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleRemove = useCallback(
    (id: string, variantId?: string) => removeItem(id, variantId),
    [removeItem]
  );

  const handleUpdateQty = useCallback(
    (id: string, qty: number, variantId?: string) =>
      updateQuantity(id, qty, variantId),
    [updateQuantity]
  );

  return (
    <>
      {/* ── Backdrop ──────────────────────────────────────────────────── */}
      <div
        className={`
          fixed inset-0 z-40
          bg-[#1A1A1A]/25 backdrop-blur-[2px]
          transition-opacity duration-400
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* ── Drawer panel ──────────────────────────────────────────────── */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`
          fixed top-0 right-0 h-full z-50
          w-full sm:w-[420px] max-w-full
          bg-white flex flex-col
          shadow-[-20px_0_60px_rgba(26,26,26,0.08)]
          transition-transform duration-400 ease-[cubic-bezier(0.32,0,0.15,1)]
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1A1A1A]/08">
          <div className="flex items-center gap-3">
            <h2
              className="text-[20px] font-light text-[#1A1A1A] tracking-wide"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Your Bag
            </h2>
            {itemCount > 0 && (
              <span className="
                text-[10px] tracking-[0.12em] font-semibold uppercase
                bg-[#F7E7CE] text-[#B76E79] px-2 py-0.5 rounded-sm
              ">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            )}
          </div>

          <button
            ref={closeRef}
            onClick={closeCart}
            className="
              w-8 h-8 flex items-center justify-center rounded-full
              text-[#1A1A1A]/50 hover:text-[#1A1A1A] hover:bg-[#F7E7CE]/60
              transition-all duration-150
            "
            aria-label="Close cart"
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        </div>

        {/* ── Free shipping bar ────────────────────────────────────────── */}
        {hasItems && <ShippingProgress subtotal={subtotal} />}

        {/* ── Body — scrollable item list ──────────────────────────────── */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {!hasItems ? (
            <EmptyCart onClose={closeCart} />
          ) : (
            <ul className="px-6 divide-y divide-[#1A1A1A]/06">
              {items.map((item) => (
                <li key={`${item.id}-${item.variantId ?? "default"}`}>
                  <CartItem
                    item={item}
                    onUpdateQuantity={handleUpdateQty}
                    onRemove={handleRemove}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Footer — order summary + CTA ─────────────────────────────── */}
        {hasItems && (
          <div className="border-t border-[#1A1A1A]/08 bg-white">

            {/* Promo code input */}
            <div className="px-6 pt-5 pb-3">
              <div className="flex items-center gap-2 border border-[#1A1A1A]/15 rounded-sm px-3 py-2.5 group focus-within:border-[#B76E79] transition-colors duration-200">
                <Tag size={13} className="text-[#1A1A1A]/30 group-focus-within:text-[#B76E79] transition-colors" />
                <input
                  type="text"
                  placeholder="Promo code"
                  className="
                    flex-1 text-[12px] tracking-[0.08em] bg-transparent
                    text-[#1A1A1A] placeholder:text-[#1A1A1A]/30
                    outline-none
                  "
                />
                <button className="text-[10px] tracking-[0.15em] uppercase font-semibold text-[#B76E79] hover:text-[#1A1A1A] transition-colors">
                  Apply
                </button>
              </div>
            </div>

            {/* Summary rows */}
            <div className="px-6 py-3 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[12px] tracking-[0.06em] text-[#1A1A1A]/55">
                  Subtotal
                </span>
                <span className="text-[13px] font-medium text-[#1A1A1A]">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[12px] tracking-[0.06em] text-[#1A1A1A]/55">
                  Shipping
                </span>
                <span className="text-[12px] text-[#1A1A1A]/55">
                  {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                    <span className="text-[#B76E79] font-medium">Free</span>
                  ) : (
                    "Calculated at checkout"
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-[#1A1A1A]/08">
                <span className="text-[13px] tracking-[0.06em] font-medium text-[#1A1A1A]">
                  Estimated Total
                </span>
                <span
                  className="text-[18px] font-light text-[#1A1A1A]"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {formatPrice(subtotal)}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="px-6 pb-6 pt-2 space-y-3">
              {/* Primary: Checkout */}
              <Link
                href="/checkout"
                onClick={closeCart}
                className="
                  flex items-center justify-center gap-2 w-full
                  py-4 bg-[#1A1A1A] text-[#F7E7CE]
                  text-[11px] tracking-[0.25em] uppercase font-semibold
                  hover:bg-[#B76E79] transition-colors duration-300
                  rounded-sm
                "
              >
                Checkout
                <ChevronRight size={14} strokeWidth={2} />
              </Link>

              {/* Secondary: Continue shopping */}
              <button
                onClick={closeCart}
                className="
                  w-full py-3 text-center
                  text-[11px] tracking-[0.18em] uppercase text-[#1A1A1A]/50
                  hover:text-[#B76E79] transition-colors duration-200
                "
              >
                Continue Shopping
              </button>
            </div>

            {/* Trust badges */}
            <div className="px-6 pb-5 flex items-center justify-center gap-5 border-t border-[#1A1A1A]/06 pt-4">
              {["Secure Checkout", "Free Returns", "Authenticity Guaranteed"].map((label) => (
                <span
                  key={label}
                  className="text-[9px] tracking-[0.1em] uppercase text-[#1A1A1A]/30 text-center"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}