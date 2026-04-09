// app/category/[slug]/page.tsx
import { notFound } from "next/navigation";
import ProductGridClient from "@/components/shop/ProductGridClient";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category"; // We need this to look up the ID!

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) return notFound();

  // 1. Connect to DB
  await connectDB();

  // 2. Find the actual Category document by its slug
  const categoryDoc = await Category.findOne({ slug: slug.toLowerCase() }).lean();

  // If the category doesn't exist in the database, show a 404 page
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
    category: categoryDoc.name, // We already have the name from step 2
    price: p.basePrice || 0,    // FIXED: schema uses basePrice
    compareAtPrice: p.compareAtPrice,
    badge: p.badge,
    images: {
      primary: p.images?.[0] || { url: "", alt: p.name },
      hover: p.images?.[1] || undefined,
    },
    swatches: [], // You can add swatch logic here later if needed
  }));

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
            {categoryDoc.description || `Explore our exclusive collection of ${categoryDoc.name.toLowerCase()}, crafted with precision and designed for the modern woman.`}
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