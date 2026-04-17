// app/collections/[slug]/page.tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product"; 
import ProductGridClient from "@/components/shop/ProductGridClient";
import type { ProductCardProps } from "@/components/shop/ProductCard";


// 1. Force Next.js to bypass the cache and fetch fresh data every time
export const dynamic = "force-dynamic";

export default async function CollectionPage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;

  const formattedTitle = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  let description = "Discover our curated selection of beautiful pieces.";
  if (slug === "new-arrivals") description = "Be the first to wear our latest handcrafted designs.";
  if (slug === "best-sellers") description = "Our most loved pieces, chosen by you.";
  if (slug === "spring") description = "Light, elegant, and perfect for the new season.";

  // 2. CONNECT TO MONGODB AND FETCH THE PRODUCTS!
  await connectDB();
  const products = await Product.find({ 
    collections: slug, 
    isActive: true 
  }).lean();

  // 3. MAP DATABASE PRODUCTS TO MATCH OUR NEW PRODUCTCARD FORMAT
  const formattedProducts: ProductCardProps[] = products.map((p: any) => ({
    id: p._id.toString(),
    slug: p.slug,
    name: p.name,
    price: p.basePrice || 0,
    compareAtPrice: p.compareAtPrice,
    images: {
      primary: { 
        url: p.images?.[0]?.url || "/placeholder.jpg", 
        alt: p.images?.[0]?.alt || p.name 
      },
      hover: p.images?.[1]?.url ? { 
        url: p.images[1].url, 
        alt: p.images?.[1]?.alt || `${p.name} hover` 
      } : undefined
    }
  }));

  return (
    <main className="min-h-screen bg-white pt-32 md:pt-48 pb-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">

        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 
            className="text-4xl md:text-5xl font-light text-[#1A1A1A] mb-4"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {formattedTitle}
          </h1>
          <p className="text-[#1A1A1A]/60 tracking-wide text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* 4. RENDER OUR BEAUTIFUL GRID COMPONENT INSTEAD OF HARDCODED HTML */}
        {formattedProducts.length > 0 ? (
          <ProductGridClient products={formattedProducts} columns={4} />
        ) : (
          <div className="py-20 text-center border border-dashed border-[#1A1A1A]/20 bg-gray-50">
            <p className="text-sm tracking-widest uppercase text-[#1A1A1A]/50">
              No products found in this collection yet.
            </p>
          </div>
        )}

      </div>
    </main>
  );
}