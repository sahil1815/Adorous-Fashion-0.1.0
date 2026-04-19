// app/page.tsx
import Hero from "@/components/home/Hero";
import ProductGridClient from "@/components/shop/ProductGridClient";
import type { ProductCardProps } from "@/components/shop/ProductCard";
import Link from "next/link";
import { cache } from "react";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

// ✅ OPTIMIZATION 1: Remove "force-dynamic" and replace it with "revalidate".
// Vercel will now serve your homepage instantly from its ultra-fast edge network,
// and silently fetch fresh data from MongoDB in the background every 60 seconds!
export const revalidate = 60;

// ---------------------------------------------------------------------------
// Fetch Best Selling products from database
// ---------------------------------------------------------------------------

// ✅ OPTIMIZATION 2: Wrap the fetcher in React's `cache` function
const getBestSellers = cache(async (): Promise<ProductCardProps[]> => {
  try {
    await connectDB();

    const rawProducts = await Product.find({ isActive: true })
      .populate("category", "name")
      .sort({ reviewCount: -1, isFeatured: -1, createdAt: -1 })
      .limit(8)
      .lean();

    return rawProducts.map((p: any) => ({
      id: p._id.toString(),
      slug: p.slug,
      name: p.name,
      category: p.category?.name || "Uncategorized",
      price: p.basePrice,
      compareAtPrice: p.compareAtPrice,
      averageRating: p.averageRating || 0, 
      soldCount: p.soldCount || 0,         
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
    console.warn("Database not available, returning empty products:", error);
    return [];
  }
});

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
// Page (Server Component)
// ---------------------------------------------------------------------------
export default async function HomePage() {
  const bestSellers = await getBestSellers();

  return (
    <main className="bg-white">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <Hero />

      {/* ── Best Sellers Section ──────────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.25em] text-[#B76E79]">
              Our Most Popular
            </p>
            <h2
              className="text-3xl font-light text-[#1A1A1A] md:text-4xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Best Sellers
            </h2>
          </div>
          <Link
            href="/shop"
            className="
              hidden border-b border-[#1A1A1A] pb-0.5 text-[11px] uppercase tracking-[0.18em]
              text-[#1A1A1A] transition-colors duration-200
              hover:border-[#B76E79] hover:text-[#B76E79] sm:block
            "
          >
            View all
          </Link>
        </div>

        <ProductGridClient products={bestSellers} columns={4} />
      </section>
    </main>
  );
}