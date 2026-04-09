"use client";

/**
 * ProductGrid.tsx
 *
 * Renders a responsive grid of ProductCards with:
 *  - Staggered entrance animation (each card fades + rises in sequence)
 *  - Skeleton loading state
 *  - Optional column-count override via the `columns` prop
 */

import ProductCard, {
  ProductCardProps,
  ProductCardSkeleton,
} from "@/components/shop/ProductCard";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProductGridProps {
  products: ProductCardProps[];
  loading?: boolean;
  skeletonCount?: number;
  /** Force a specific column count at all breakpoints — useful for category pages */
  columns?: 2 | 3 | 4;
  onWishlistToggle?: (id: string, wishlisted: boolean) => void;
  onQuickView?: (id: string) => void;
}

// ---------------------------------------------------------------------------
// Column class map
// ---------------------------------------------------------------------------

const COLUMN_CLASSES: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-3 xl:grid-cols-4",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ProductGrid({
  products,
  loading = false,
  skeletonCount = 8,
  columns = 4,
  onWishlistToggle,
  onQuickView,
}: ProductGridProps) {
  const colClass = COLUMN_CLASSES[columns] ?? COLUMN_CLASSES[4];

  if (loading) {
    return (
      <div className={`grid ${colClass} gap-x-5 gap-y-10`}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p
          className="text-3xl font-light text-[#1A1A1A]/30 mb-3"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          No products found
        </p>
        <p className="text-[12px] tracking-[0.15em] uppercase text-[#1A1A1A]/30">
          Try adjusting your filters
        </p>
      </div>
    );
  }

  return (
    <div className={`grid ${colClass} gap-x-5 gap-y-10`}>
      {products.map((product, index) => (
        <div
          key={product.id}
          className="animate-in fade-in slide-in-from-bottom-4"
          style={{
            animationDelay: `${index * 60}ms`,
            animationDuration: "400ms",
            animationFillMode: "both",
          }}
        >
          <ProductCard
            {...product}
            onWishlistToggle={onWishlistToggle}
            onQuickView={onQuickView}
          />
        </div>
      ))}
    </div>
  );
}