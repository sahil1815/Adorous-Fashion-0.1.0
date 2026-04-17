// app/products/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductGallery from "@/components/shop/ProductGallery";
import ProductInfo from "@/components/shop/ProductInfo";
import ProductGrid from "@/components/shop/ProductGrid";
import type { ProductCardProps } from "@/components/shop/ProductCard";

// Safely await params for Next.js 15 compatibility
type Props = { params: Promise<{ slug: string }> | { slug: string } };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  await connectDB();
  
  const product = await Product.findOne({ 
    slug: { $regex: new RegExp(`^${params.slug}$`, "i") } 
  }).lean();

  if (!product) return { title: "Product Not Found" };

  return {
    title: product.metaTitle ?? product.name,
    description: product.shortDescription ?? "Discover our timeless collection.",
  };
}

export default async function ProductDetailPage(props: Props) {
  const params = await props.params;
  await connectDB();

  const raw = await Product.findOne({ 
    slug: { $regex: new RegExp(`^${params.slug}$`, "i") } 
  })
    .populate("category", "name slug")
    .lean();

  if (!raw) notFound();

  const categoryName = raw.category?.name || "Uncategorized";
  const categorySlug = raw.category?.slug || "uncategorized";
  const category = { name: categoryName, slug: categorySlug };

  let galleryImages = [];
  if (Array.isArray(raw.images) && raw.images.length > 0) {
    galleryImages = raw.images.map((img: any) => ({
      url: img.url || (typeof img === 'string' ? img : "/placeholder.jpg"),
      alt: img.alt || raw.name,
    }));
  } else if (raw.primaryImage) {
    galleryImages = [{
      url: raw.primaryImage.url || (typeof raw.primaryImage === 'string' ? raw.primaryImage : "/placeholder.jpg"),
      alt: raw.name
    }];
  } else {
    galleryImages = [{ url: "/placeholder.jpg", alt: raw.name }];
  }
  const primaryImage = galleryImages[0];

  const variants = Array.isArray(raw.variants) ? raw.variants.map((v: any) => ({
    id: v._id?.toString() || Math.random().toString(),
    sku: v.sku || "",
    price: v.price || raw.basePrice,
    compareAtPrice: v.compareAtPrice,
    stock: v.stock || 0,
    attributes: v.attributes || {},
  })) : [];

  const relatedRaw = await Product.find({
    category: raw.category?._id || raw.category, 
    _id: { $ne: raw._id },
  }).limit(4).lean();

  const relatedProducts: ProductCardProps[] = relatedRaw.map((p: any) => {
    const pImage = Array.isArray(p.images) && p.images[0]?.url ? p.images[0].url : "/placeholder.jpg";
    return {
      id: p._id.toString(),
      slug: p.slug,
      name: p.name,
      category: categoryName,
      price: p.basePrice || 0,
      compareAtPrice: p.compareAtPrice,
      images: { primary: { url: pImage, alt: p.name } },
    };
  });

  return (
    <main className="bg-white min-h-screen text-[#1A1A1A]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-40 pb-20">
        
        <nav className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/50 mb-8">
          <a href="/" className="hover:text-[#B76E79] transition-colors">Home</a>
          <span>/</span>
          <a href="/shop" className="hover:text-[#B76E79] transition-colors">Shop</a>
          <span>/</span>
          <a href={`/shop?category=${categorySlug}`} className="hover:text-[#B76E79] transition-colors">{categoryName}</a>
          <span>/</span>
          <span className="text-[#1A1A1A] font-medium">{raw.name}</span>
        </nav>

        <section className="pb-10 md:pb-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div className="md:sticky md:top-32">
              <ProductGallery images={galleryImages} productName={raw.name} />
            </div>
            
            <div className="pt-2"> 
              <ProductInfo
                id={raw._id.toString()}
                slug={raw.slug}
                name={raw.name}
                shortDescription={raw.shortDescription}
                description={raw.description}
                category={category}
                basePrice={raw.basePrice || 0}
                compareAtPrice={raw.compareAtPrice}
                currency="BDT" // ✅ FIXED: Changed to BDT
                averageRating={raw.averageRating || 0}
                reviewCount={raw.reviewCount || 0}
                totalStock={raw.totalStock ?? 0} // ✅ FIXED: Will now properly pass 0 to the component!
                variants={variants}
                primaryImage={primaryImage}
              />
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="py-14 border-t border-[#1A1A1A]/10 mt-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase text-[#B76E79] mb-2 font-medium">
                  You may also like
                </p>
                <h2
                  className="text-3xl font-light text-[#1A1A1A]"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Complete the Look
                </h2>
              </div>
            </div>
            <ProductGrid products={relatedProducts} columns={4} />
          </section>
        )}
      </div>
    </main>
  );
}