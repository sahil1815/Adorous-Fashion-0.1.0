"use client";

/**
 * ProductAccordion.tsx
 *
 * Animated expand/collapse panels for:
 *  - Product details (materials, dimensions)
 *  - Care instructions
 *  - Shipping & returns policy
 *
 * Uses CSS max-height transition for a smooth,
 * layout-safe animation without any library.
 */

import { useState, useRef } from "react";
import { Plus, Minus } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AccordionItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface ProductAccordionProps {
  items: AccordionItem[];
  /** Open the first panel by default */
  defaultOpen?: string;
}

// ---------------------------------------------------------------------------
// Single panel
// ---------------------------------------------------------------------------

function AccordionPanel({
  item,
  isOpen,
  onToggle,
}: {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border-b border-[#1A1A1A]/10 last:border-b-0">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`accordion-${item.id}`}
        className="
          w-full flex items-center justify-between
          py-4 text-left group
          focus:outline-none focus-visible:text-[#B76E79]
        "
      >
        <span
          className={`
            text-[12px] tracking-[0.18em] uppercase font-medium
            transition-colors duration-200
            ${isOpen ? "text-[#B76E79]" : "text-[#1A1A1A] group-hover:text-[#B76E79]"}
          `}
        >
          {item.label}
        </span>
        <span className="flex-shrink-0 ml-4 text-[#1A1A1A]/40">
          {isOpen
            ? <Minus size={14} strokeWidth={1.8} />
            : <Plus  size={14} strokeWidth={1.8} />}
        </span>
      </button>

      {/* Animated content */}
      <div
        id={`accordion-${item.id}`}
        role="region"
        ref={bodyRef}
        style={{
          maxHeight: isOpen
            ? `${bodyRef.current?.scrollHeight ?? 500}px`
            : "0px",
          overflow: "hidden",
          transition: "max-height 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)",
        }}
      >
        <div className="pb-5 text-[13px] leading-relaxed text-[#1A1A1A]/65 tracking-wide">
          {item.content}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main accordion
// ---------------------------------------------------------------------------

export default function ProductAccordion({
  items,
  defaultOpen,
}: ProductAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(
    defaultOpen ?? items[0]?.id ?? null
  );

  const toggle = (id: string) =>
    setOpenId((prev) => (prev === id ? null : id));

  return (
    <div className="divide-y divide-[#1A1A1A]/10 border-t border-[#1A1A1A]/10">
      {items.map((item) => (
        <AccordionPanel
          key={item.id}
          item={item}
          isOpen={openId === item.id}
          onToggle={() => toggle(item.id)}
        />
      ))}
    </div>
  );
}