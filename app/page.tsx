// app/page.tsx
//
// This is a SERVER component — it fetches/defines data and passes it down.
// Interactive callbacks (onQuickView, onWishlistToggle) live in the
// client wrapper below so they never cross the server→client boundary.

import Hero from "@/components/home/Hero";
import ProductGridClient from "@/components/shop/ProductGridClient";
import type { ProductCardProps } from "@/components/shop/ProductCard";
import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

// ---------------------------------------------------------------------------
// Fetch featured products from database
// ---------------------------------------------------------------------------
async function getFeaturedProducts(): Promise<ProductCardProps[]> {
  try {
    await connectDB();

    const rawProducts = await Product.find({ isActive: true })
      .populate("category", "name")
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(8)
      .lean();

    return rawProducts.map((p: any) => ({
      id: p._id.toString(),
      slug: p.slug,
      name: p.name,
      category: p.category?.name || "Uncategorized",
      price: p.basePrice,
      compareAtPrice: p.compareAtPrice,
      badge: p.isOnSale ? "sale" : undefined,
      images: {
        primary: p.primaryImage || p.images?.[0] || { url: "", alt: "" },
        hover: p.images?.[1] || undefined,
      },
      swatches: p.variants?.slice(0, 3).map((v: any) => ({
        label: v.attributes?.color || v.attributes?.Color || "Default",
        color: getColorFromVariant(v),
      })) || [],
    }));
  } catch (error) {
    // Return empty array if database is not available (e.g., during build)
    console.warn("Database not available, returning empty products:", error);
    return [];
  }
}

// Helper to extract color from variant attributes
function getColorFromVariant(variant: any): string {
  const colorName = variant.attributes?.color || variant.attributes?.Color;
  if (!colorName) return "#B0B0B0";

  const colorMap: Record<string, string> = {
    "Rose Gold": "#C5977D",
    "Gold": "#C9A84C",
    "Silver": "#B0B0B0",
    "Champagne": "#F7E7CE",
    "Black": "#1A1A1A",
    "White": "#FFFFFF",
  };

  return colorMap[colorName] || "#B0B0B0";
}

// ---------------------------------------------------------------------------
// Page (Server Component — safe to async, safe to import DB utils here)
// ---------------------------------------------------------------------------
export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  // Explicitly setting bg-white so dark mode doesn't turn the background black!
  return (
    <main className="bg-white">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <Hero />

      {/* ── Featured Products ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.25em] text-[#B76E79]">
              Curated for you
            </p>
            <h2
              className="text-3xl font-light text-[#1A1A1A] md:text-4xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              New Arrivals
            </h2>
          </div>
          <Link
            href="/products"
            className="
              hidden border-b border-[#1A1A1A] pb-0.5 text-[11px] uppercase tracking-[0.18em]
              text-[#1A1A1A] transition-colors duration-200
              hover:border-[#B76E79] hover:text-[#B76E79] sm:block
            "
          >
            View all
          </Link>
        </div>

        {/*
          ProductGridClient is a "use client" wrapper around ProductGrid.
          All event handler callbacks live there — never in this server file.
        */}
        <ProductGridClient products={featuredProducts} columns={4} />
      </section>
    </main>
  );
}