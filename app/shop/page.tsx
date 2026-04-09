import Link from "next/link";
import ProductGrid from "@/components/shop/ProductGrid";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export const metadata = {
  title: "Shop | Adorous Fashion",
  description: "Browse our complete collection of premium fashion pieces.",
};

export default async function ShopPage() {
  let products: any[] = [];
  let error: string | null = null;

  try {
    await dbConnect();
    const data = await Product.find({}).lean();
    products = data || [];
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
