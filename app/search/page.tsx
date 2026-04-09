// app/search/page.tsx
import { redirect } from "next/navigation";
import ProductGridClient from "@/components/shop/ProductGridClient";
import type { ProductCardProps } from "@/components/shop/ProductCard";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import "@/models/Category"; // Required so .populate("category") doesn't crash

// ---------------------------------------------------------------------------
// Fetch search results from database
// ---------------------------------------------------------------------------
async function searchProducts(query: string): Promise<ProductCardProps[]> {
  try {
    await connectDB();

    // 1. Check if the user is searching for a Category (e.g., "Necklaces")
    const Category = (await import("@/models/Category")).default;
    const matchingCategories = await Category.find({
      name: { $regex: query, $options: "i" }
    }).select('_id');
    const categoryIds = matchingCategories.map(cat => cat._id);

    // 2. Search products by Name, Description, OR matching Category ID
    const products = await Product.find({
      isActive: true,
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $in: categoryIds } } // Pulls all products in the "Necklaces" category
      ]
    })
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return products.map((p: any) => ({
      id: p._id.toString(),
      slug: p.slug,
      name: p.name,
      category: p.category?.name || "Uncategorized",
      price: p.basePrice || 0,
      compareAtPrice: p.compareAtPrice,
      badge: p.badge || (p.isOnSale ? "sale" : undefined),
      images: {
        primary: p.images?.[0] || { url: "", alt: p.name },
        hover: p.images?.[1] || undefined,
      },
      swatches: p.variants?.slice(0, 3).map((v: any) => ({
        label: v.attributes?.color || v.attributes?.Color || "Default",
        color: getColorFromVariant(v),
      })) || [],
    }));
  } catch (error) {
    console.warn("Database not available for search, returning empty results:", error);
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
// Server Component
// ---------------------------------------------------------------------------
export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams.q;

  if (!searchQuery || typeof searchQuery !== "string") {
    redirect("/");
  }

  const products = await searchProducts(searchQuery);

  return (
    <main className="min-h-screen bg-white pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-10">

        {/* Search Header */}
        <div className="mb-12 flex flex-col items-center text-center md:items-start md:text-left">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.3em] text-[#B76E79]">
            Search Results
          </p>
          <h1
            className="text-3xl font-light text-[#1A1A1A] md:text-4xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            &quot;{searchQuery}&quot;
          </h1>
          <p className="mt-4 text-sm tracking-wide text-[#1A1A1A]/70">
            {products.length} {products.length === 1 ? "result" : "results"} found
          </p>
        </div>

        <hr className="mb-12 border-[#1A1A1A]/10" />

        {/* Product Grid or Empty State */}
        {products.length > 0 ? (
          <ProductGridClient products={products} columns={4} />
        ) : (
          <div className="py-20 text-center">
            <p className="mb-6 text-lg text-[#1A1A1A]">We couldn't find anything matching your search.</p>
            <p className="text-sm text-[#1A1A1A]/50">Try checking your spelling or using more general terms.</p>
          </div>
        )}

      </div>
    </main>
  );
}