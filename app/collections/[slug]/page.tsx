// app/collections/[slug]/page.tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product"; 

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

  return (
    <main className="min-h-screen bg-white pt-32 pb-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        
        <Link 
          href="/" 
          className="inline-flex relative z-20 items-center text-[11px] uppercase tracking-widest text-[#1A1A1A]/50 hover:text-[#B76E79] transition-colors mb-8"
        >
          <ArrowLeft size={14} className="mr-2" /> Home
        </Link>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
          
          {/* 3. DISPLAY THE PRODUCTS WE JUST FETCHED */}
          {products.length > 0 ? (
            products.map((product: any) => {
              const primaryImage = product.images?.[0]?.url || "";
              
              return (
                <Link href={`/product/${product.slug}`} key={product._id.toString()} className="group cursor-pointer block">
                  <div className="aspect-[4/5] bg-gray-100 mb-4 overflow-hidden relative">
                    
                    {product.badge && (
                      <span className="absolute top-3 left-3 bg-[#1A1A1A] text-white text-[9px] uppercase tracking-widest px-2 py-1 z-10">
                        {product.badge}
                      </span>
                    )}
                    
                    {primaryImage ? (
                      <img 
                        src={primaryImage} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-[#1A1A1A] tracking-wide">{product.name}</h3>
                  <p className="text-sm text-[#1A1A1A]/70 mt-1">{(product.basePrice || 0).toFixed(2)}BDT</p>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center border border-dashed border-[#1A1A1A]/20 bg-gray-50">
              <p className="text-sm tracking-widest uppercase text-[#1A1A1A]/50">
                No products found in this collection yet.
              </p>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}