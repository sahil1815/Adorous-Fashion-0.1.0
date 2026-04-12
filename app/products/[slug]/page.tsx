// app/products/[slug]/page.tsx
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
  
  // Case-insensitive search
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

  // 1. Fetch main product with Case-Insensitive Regex
  const raw = await Product.findOne({ 
    slug: { $regex: new RegExp(`^${params.slug}$`, "i") } 
  })
    .populate("category", "name slug")
    .lean();

  // 🚨 DIAGNOSTIC MODE: Instead of a 404, tell us EXACTLY what is in the DB
  if (!raw) {
    const allProducts = await Product.find({}).select('name slug').limit(10).lean();
    return (
      <div className="pt-40 pb-20 px-10 text-center max-w-2xl mx-auto min-h-screen">
        <h1 className="text-2xl text-red-600 mb-4 font-bold">Data Mismatch Detected</h1>
        <p className="mb-2 text-lg">The URL searched for this exact slug:</p>
        <code className="bg-gray-100 p-2 text-blue-600 font-bold rounded mb-8 block">
          "{params.slug}"
        </code>
        
        <p className="mb-2 text-lg">But your database currently contains these products:</p>
        <div className="bg-gray-100 p-4 rounded text-left overflow-auto text-sm">
          <pre>{JSON.stringify(allProducts, null, 2)}</pre>
        </div>
      </div>
    );
  }

  // 2. Bulletproof Category Fallback
  const categoryName = raw.category?.name || "Uncategorized";
  const categorySlug = raw.category?.slug || "uncategorized";
  const category = { name: categoryName, slug: categorySlug };

  // 3. Bulletproof Image Array
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

  // 4. Bulletproof Variants Fallback
  const variants = Array.isArray(raw.variants) ? raw.variants.map((v: any) => ({
    id: v._id?.toString() || Math.random().toString(),
    sku: v.sku || "",
    price: v.price || raw.basePrice,
    compareAtPrice: v.compareAtPrice,
    stock: v.stock || 0,
    attributes: v.attributes || {},
  })) : [];

  // 5. Fetch related products safely
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
    <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-40 pb-20">
      
      {/* ── Hero: gallery + info ─────────────────────────────────────────── */}
      <section className="py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="md:sticky md:top-24">
            <ProductGallery images={galleryImages} productName={raw.name} />
          </div>
          <ProductInfo
            id={raw._id.toString()}
            slug={raw.slug}
            name={raw.name}
            shortDescription={raw.shortDescription}
            description={raw.description}
            category={category}
            basePrice={raw.basePrice || 0}
            compareAtPrice={raw.compareAtPrice}
            currency="USD"
            averageRating={raw.averageRating || 0}
            reviewCount={raw.reviewCount || 0}
            totalStock={raw.totalStock || 10}
            variants={variants}
            primaryImage={primaryImage}
          />
        </div>
      </section>

      {/* ── Related products ─────────────────────────────────────────────── */}
      {relatedProducts.length > 0 && (
        <section className="py-14 border-t border-[#1A1A1A]/10 mt-10">
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
  );
}