// app/category/[slug]/page.tsx
import { notFound } from "next/navigation";
import ProductGridClient from "@/components/shop/ProductGridClient";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category"; 

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) return notFound();

  // 1. Connect to DB
  await connectDB();

  // 2. Find the actual Category document by its slug
  const categoryDoc = await Category.findOne({ slug: slug.toLowerCase() }).lean();

  if (!categoryDoc) {
    return notFound();
  }

  // 3. Fetch products using the Category's ObjectId
  const rawProducts = await Product.find({ 
    category: categoryDoc._id,
    isActive: true 
  }).lean();

  // 4. Format the data perfectly for your ProductGridClient
  const liveProducts = rawProducts.map((p: any) => ({
    id: p._id.toString(),
    slug: p.slug,
    name: p.name,
    category: categoryDoc.name, 
    price: p.basePrice || 0,    
    compareAtPrice: p.compareAtPrice,
    badge: p.badge,
    
    // ✅ FIXED 1 & 2: We must pass averageRating and soldCount to the card!
    // This fixes the empty stars, the 0 sold, AND the Wishlist syncing bug.
    averageRating: p.averageRating || 0,
    soldCount: p.soldCount || 0,

    images: {
      primary: p.images?.[0] || { url: "", alt: p.name },
      hover: p.images?.[1] || undefined,
    },
    swatches: [], 
  }));

  // ✅ FIXED 3: Detect the "N?A" or "N/A" typo from the database and show the elegant fallback
  const validDescription = categoryDoc.description && categoryDoc.description !== "N?A" && categoryDoc.description !== "N/A"
    ? categoryDoc.description
    : `Explore our exclusive collection of ${categoryDoc.name.toLowerCase()}, crafted with precision and designed for the modern woman.`;

  return (
    <main className="min-h-screen bg-white pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-10">
        
        <div className="mb-12 flex flex-col items-center text-center md:items-start md:text-left">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.3em] text-[#B76E79]">
            Collection
          </p>
          <h1
            className="text-4xl font-light text-[#1A1A1A] md:text-5xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {categoryDoc.name}
          </h1>
          <p className="mt-4 max-w-xl text-sm tracking-wide text-[#1A1A1A]/70">
            {validDescription}
          </p>
        </div>

        <hr className="mb-12 border-[#1A1A1A]/10" />

        {liveProducts.length > 0 ? (
          <ProductGridClient products={liveProducts} columns={4} />
        ) : (
          <div className="py-20 text-center">
            <p className="mb-6 text-lg text-[#1A1A1A]">We are currently restocking our {categoryDoc.name.toLowerCase()}.</p>
            <p className="text-sm text-[#1A1A1A]/50">Check back soon for new arrivals.</p>
          </div>
        )}
        
      </div>
    </main>
  );
}