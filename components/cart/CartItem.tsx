"use client";

/**
 * CartItem.tsx
 *
 * Renders a single line item inside the CartDrawer.
 * Features:
 *  - Product thumbnail with Next/Image
 *  - Name, variant attributes, unit price
 *  - +/− quantity stepper
 *  - Remove button with a fade-out animation
 *  - Line-total right-aligned
 */

import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import type { CartItem as CartItemType } from "@/store/useCartStore";

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
// Props
// ---------------------------------------------------------------------------

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number, variantId?: string) => void;
  onRemove: (id: string, variantId?: string) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  const lineTotal = item.price * item.quantity;

  return (
    <div className="flex gap-4 py-5 border-b border-[#1A1A1A]/08 last:border-0 group/item animate-in fade-in slide-in-from-right-4 duration-300">

      {/* ── Thumbnail ─────────────────────────────────────────────────── */}
      <div className="relative w-20 h-24 flex-shrink-0 bg-[#F7E7CE]/40 rounded-sm overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="80px"
          className="object-cover object-center"
        />
      </div>

      {/* ── Details ───────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 gap-1.5">

        {/* Name + remove */}
        <div className="flex items-start justify-between gap-2">
          <p
            className="text-[14px] font-light leading-snug text-[#1A1A1A] line-clamp-2"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {item.name}
          </p>
          <button
            onClick={() => onRemove(item.id, item.variantId)}
            className="
              flex-shrink-0 w-5 h-5 flex items-center justify-center
              text-[#1A1A1A]/30 hover:text-[#B76E79]
              transition-colors duration-150 mt-0.5
              opacity-0 group-hover/item:opacity-100
            "
            aria-label={`Remove ${item.name} from cart`}
          >
            <X size={13} strokeWidth={2} />
          </button>
        </div>

        {/* Variant attributes (e.g. color: Rose Gold) */}
        {item.attributes && Object.keys(item.attributes).length > 0 && (
          <p className="text-[10px] tracking-[0.1em] uppercase text-[#1A1A1A]/40">
            {Object.entries(item.attributes)
              .map(([k, v]) => `${k}: ${v}`)
              .join(" · ")}
          </p>
        )}

        {/* Price + quantity stepper */}
        <div className="flex items-center justify-between mt-auto pt-1">

          {/* Quantity stepper */}
          <div className="flex items-center border border-[#1A1A1A]/15 rounded-sm">
            <button
              onClick={() =>
                onUpdateQuantity(item.id, item.quantity - 1, item.variantId)
              }
              className="
                w-7 h-7 flex items-center justify-center
                text-[#1A1A1A]/50 hover:text-[#1A1A1A]
                transition-colors duration-150
                disabled:opacity-30 disabled:cursor-not-allowed
              "
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus size={11} strokeWidth={2} />
            </button>

            <span className="w-7 text-center text-[12px] font-medium text-[#1A1A1A] select-none">
              {item.quantity}
            </span>

            <button
              onClick={() =>
                onUpdateQuantity(item.id, item.quantity + 1, item.variantId)
              }
              className="
                w-7 h-7 flex items-center justify-center
                text-[#1A1A1A]/50 hover:text-[#1A1A1A]
                transition-colors duration-150
              "
              aria-label="Increase quantity"
            >
              <Plus size={11} strokeWidth={2} />
            </button>
          </div>

          {/* Line total */}
          <p className="text-[13px] font-medium text-[#1A1A1A]">
            {formatPrice(lineTotal)}
          </p>
        </div>
      </div>
    </div>
  );
}