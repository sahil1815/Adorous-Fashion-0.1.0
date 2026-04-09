"use client";

/**
 * ProductGridClient.tsx
 *
 * A thin "use client" wrapper around ProductGrid.
 * All interactive callbacks (onQuickView, onWishlistToggle) live here
 * so the parent page.tsx can stay a pure Server Component.
 *
 * Rule of thumb:
 *   Server Component  → fetches data, passes plain serialisable props
 *   Client Component  → owns event handlers, useState, useEffect
 */

import { useCallback } from "react";
import ProductGrid from "@/components/shop/ProductGrid";
import type { ProductCardProps } from "@/components/shop/ProductCard";

interface ProductGridClientProps {
  products: ProductCardProps[];
  columns?: 2 | 3 | 4;
}

export default function ProductGridClient({
  products,
  columns = 4,
}: ProductGridClientProps) {
  const handleWishlistToggle = useCallback(
    (id: string, wishlisted: boolean) => {
      // TODO: persist to user's wishlist via API
      console.log(`Wishlist toggled — id: ${id}, wishlisted: ${wishlisted}`);
    },
    []
  );

  const handleQuickView = useCallback((id: string) => {
    // TODO: open QuickViewModal with this product id
    console.log(`Quick view — id: ${id}`);
  }, []);

  return (
    <ProductGrid
      products={products}
      columns={columns}
      onWishlistToggle={handleWishlistToggle}
      onQuickView={handleQuickView}
    />
  );
}