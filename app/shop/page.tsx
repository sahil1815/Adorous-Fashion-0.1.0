import Link from "next/link";
import ProductGrid from "@/components/shop/ProductGrid"; 
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export const metadata = {
  title: "Shop | Adorous Fashion",
  description: "Browse our complete collection of premium fashion pieces.",
};

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

export default async function ShopPage() {
  let products: any[] = [];
  let error: string | null = null;

  try {
    await dbConnect();
    
    // 1. Fetch products and POPULATE the category name
    const data = await Product.find({ isActive: true })
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .lean();

    // 2. Map the raw database fields to the exact format ProductCard expects
    products = data.map((p: any) => ({
      id: p._id.toString(),
      slug: p.slug,
      name: p.name,
      category: p.category?.name || "Uncategorized",
      price: p.basePrice || 0,
      compareAtPrice: p.compareAtPrice,
      
      // ✅ NEW: Added rating and sold count mapping here!
      averageRating: p.averageRating || 0,
      soldCount: p.soldCount || 0,

      badge: p.isOnSale ? "sale" : undefined,
      images: {
        primary: p.primaryImage || p.images?.[0] || { url: "/placeholder.jpg", alt: p.name },
        hover: p.images?.[1] || undefined,
      },
      swatches: p.variants?.slice(0, 3).map((v: any) => ({
        label: v.attributes?.color || v.attributes?.Color || "Default",
        color: getColorFromVariant(v),
      })) || [],
    }));
    
  } catch (err) {
    console.error("Error fetching products:", err);
    error = "Unable to load products. Please try again later.";
  }

  return (
    <main className="min-h-screen bg-white pt-28 pb-24">
      <div className="container mx-auto px-6 md:px-10 max-w-7xl">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl font-light tracking-widest uppercase text-[#1A1A1A]">
            Shop
          </h1>
          <p className="text-sm text-[#1A1A1A]/60 mt-3 tracking-wide max-w-2xl">
            Discover our curated collection of timeless pieces designed for the modern aesthetic.
          </p>
        </div>

        {/* Filters Bar (optional) */}
        <div className="border-b border-[#1A1A1A]/10 pb-6 mb-10">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#1A1A1A]/70">
              {products.length} item{products.length !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center space-x-6 text-xs uppercase tracking-widest text-[#1A1A1A]/70">
              <span>Showing all</span>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-6 rounded mb-10 text-center">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!error && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#1A1A1A]/70 text-lg mb-6">
              No products available at this time.
            </p>
            <Link
              href="/"
              className="text-[#B76E79] hover:text-[#1A1A1A] transition-colors text-sm tracking-widest uppercase"
            >
              Return Home
            </Link>
          </div>
        )}

        {/* Products Grid */}
        {!error && products.length > 0 && (
          <ProductGrid products={products} />
        )}
      </div>
    </main>
  );
}