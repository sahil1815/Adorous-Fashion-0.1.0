"use client";

/**
 * ProductGallery.tsx
 *
 * Features:
 *  - Large primary viewer with smooth crossfade between images
 *  - Thumbnail rail (vertical on desktop, horizontal on mobile)
 *  - Keyboard arrow-key navigation
 *  - Zoom on hover (CSS transform scale — no library needed)
 *  - Image count indicator
 *  - Prev/Next chevron buttons for touch/mobile
 */

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GalleryImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

interface ProductGalleryProps {
  images: GalleryImage[];
  productName: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 }); // % from top-left

  const total = images.length;

  const prev = useCallback(() => setActive((i) => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setActive((i) => (i + 1) % total), [total]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  // Track mouse for zoom pan effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 md:gap-5 w-full">

      {/* ── Thumbnail rail (vertical desktop / horizontal mobile) ───────── */}
      <div className="flex flex-row md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto md:max-h-[680px] pb-1 md:pb-0 md:w-[80px] flex-shrink-0">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1} of ${total}`}
            aria-current={active === i}
            className={`
              relative flex-shrink-0
              w-16 h-20 md:w-full md:h-24
              overflow-hidden rounded-sm
              border-2 transition-all duration-200
              ${active === i
                ? "border-[#1A1A1A]"
                : "border-transparent hover:border-[#1A1A1A]/30"}
            `}
          >
            <Image
              src={img.url}
              alt={img.alt}
              fill
              sizes="80px"
              className={`
                object-cover object-center
                transition-all duration-300
                ${active === i ? "opacity-100" : "opacity-70 hover:opacity-100"}
              `}
            />
          </button>
        ))}
      </div>

      {/* ── Main viewer ──────────────────────────────────────────────────── */}
      <div className="relative flex-1 aspect-[3/4] md:aspect-auto md:h-[680px] group/gallery overflow-hidden rounded-sm bg-[#F7E7CE]/20">

        {/* Images — stacked, crossfade via opacity */}
        {images.map((img, i) => (
          <div
            key={i}
            className={`
              absolute inset-0 overflow-hidden
              transition-opacity duration-500 ease-in-out
              ${active === i ? "opacity-100 z-10" : "opacity-0 z-0"}
            `}
            onMouseEnter={() => setZoomed(true)}
            onMouseLeave={() => setZoomed(false)}
            onMouseMove={handleMouseMove}
            style={{ cursor: zoomed ? "zoom-out" : "zoom-in" }}
          >
            <Image
              src={img.url}
              alt={img.alt}
              fill
              priority={i === 0}
              sizes="(max-width: 768px) 100vw, 55vw"
              className="object-cover object-center select-none"
              style={{
                transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                transform:
                  active === i && zoomed ? "scale(1.8)" : "scale(1)",
                transition: zoomed
                  ? "transform 0.1s ease-out"
                  : "transform 0.4s cubic-bezier(0.25,0.1,0.25,1)",
              }}
              draggable={false}
            />
          </div>
        ))}

        {/* Prev / Next buttons */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              className="
                absolute left-3 top-1/2 -translate-y-1/2 z-20
                w-9 h-9 flex items-center justify-center
                bg-white/80 backdrop-blur-sm rounded-full
                text-[#1A1A1A] hover:bg-white
                shadow-sm transition-all duration-150
                opacity-0 group-hover/gallery:opacity-100 translate-x-1 group-hover/gallery:translate-x-0
              "
              aria-label="Previous image"
            >
              <ChevronLeft size={16} strokeWidth={2} />
            </button>
            <button
              onClick={next}
              className="
                absolute right-3 top-1/2 -translate-y-1/2 z-20
                w-9 h-9 flex items-center justify-center
                bg-white/80 backdrop-blur-sm rounded-full
                text-[#1A1A1A] hover:bg-white
                shadow-sm transition-all duration-150
                opacity-0 group-hover/gallery:opacity-100 -translate-x-1 group-hover/gallery:translate-x-0
              "
              aria-label="Next image"
            >
              <ChevronRight size={16} strokeWidth={2} />
            </button>
          </>
        )}

        {/* Image counter pill */}
        {total > 1 && (
          <div className="absolute bottom-3 right-3 z-20 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <span className="text-[10px] tracking-[0.1em] text-[#1A1A1A] font-medium">
              {active + 1} / {total}
            </span>
          </div>
        )}

        {/* Dot indicators (mobile) */}
        {total > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 md:hidden">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`
                  w-1.5 h-1.5 rounded-full transition-all duration-200
                  ${active === i ? "bg-[#1A1A1A] w-4" : "bg-[#1A1A1A]/30"}
                `}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}