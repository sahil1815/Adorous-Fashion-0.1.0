// app/products/[slug]/page.tsx
//
// Server Component — fetches product data from MongoDB and composes
// the PDP layout from two client sub-components:
//   <ProductGallery>  — image viewer (left column)
//   <ProductInfo>     — interactive panel (right column)
//
// Also exports generateMetadata for per-product SEO.

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductGallery from "@/components/shop/ProductGallery";
import ProductInfo from "@/components/shop/ProductInfo";
import ProductGrid from "@/components/shop/ProductGrid";
import type { ProductCardProps } from "@/components/shop/ProductCard";

// ---------------------------------------------------------------------------
// Types — plain objects that cross the server→client boundary safely
// ---------------------------------------------------------------------------

interface PageProps {
  params: { slug: string };
}

// ---------------------------------------------------------------------------
// generateMetadata — per-product <title> and <meta description>
// ---------------------------------------------------------------------------

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await connectDB();
  const product = await Product.findOne({ slug: params.slug, isActive: true }).lean();

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.metaTitle ?? product.name,
    description: product.metaDescription ?? product.shortDescription ?? product.description?.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.shortDescription ?? product.description?.slice(0, 160),
      images: product.images?.[0]?.url ? [{ url: product.images[0].url }] : [],
    },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ProductDetailPage({ params }: PageProps) {
  await connectDB();

  // ── Fetch main product ──────────────────────────────────────────────────
  const raw = await Product.findOne({ slug: params.slug, isActive: true })
    .populate("category", "name slug")
    .lean();

  if (!raw) notFound();

  // ── Fetch related products (same category, excluding this one) ───────────
  const relatedRaw = await Product.find({
    category: raw.category,
    _id: { $ne: raw._id },
    isActive: true,
  })
    .limit(4)
    .lean();

  // ── Serialise Mongoose lean objects → plain props ───────────────────────
  // `lean()` returns ObjectIds and Buffers — we must stringify them before
  // passing to Client Components. We do that explicitly here rather than
  // using JSON.stringify/parse on the whole object (safer and typed).

  const galleryImages = (raw.images as Array<{ url: string; alt: string }>).map(
    (img) => ({ url: img.url, alt: img.alt })
  );

  const category = { name: raw.category.name, slug: raw.category.slug };

  const variants = (raw.variants as Array<{
    _id: { toString(): string };
    sku: string;
    price: number;
    compareAtPrice?: number;
    stock: number;
    attributes: Record<string, string>;
  }>).map((v) => ({
    id: v._id.toString(),
    sku: v.sku,
    price: v.price,
    compareAtPrice: v.compareAtPrice,
    stock: v.stock,
    attributes: Object.fromEntries(
      Object.entries(v.attributes ?? {})
    ) as Record<string, string>,
  }));

  const primaryImage = galleryImages.find((_, i) =>
    (raw.images as Array<{ isPrimary?: boolean }>)[i]?.isPrimary
  ) ?? galleryImages[0];

  // Related products → ProductCardProps
  const relatedProducts: ProductCardProps[] = relatedRaw.map((p) => ({
    id: (p._id as { toString(): string }).toString(),
    slug: p.slug as string,
    name: p.name as string,
    category: category.name,
    price: p.basePrice as number,
    compareAtPrice: p.compareAtPrice as number | undefined,
    images: {
      primary: {
        url: (p.images as Array<{ url: string; alt: string }>)[0]?.url ?? "",
        alt: (p.images as Array<{ url: string; alt: string }>)[0]?.alt ?? p.name as string,
      },
    },
  }));

  // ---------------------------------------------------------------------------
  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-10">

      {/* ── Hero: gallery + info ─────────────────────────────────────────── */}
      <section className="py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Gallery — sticky on desktop so it stays visible while you scroll the info */}
          <div className="md:sticky md:top-24">
            <ProductGallery
              images={galleryImages}
              productName={raw.name as string}
            />
          </div>

          {/* Info panel */}
          <ProductInfo
            id={(raw._id as { toString(): string }).toString()}
            slug={raw.slug as string}
            name={raw.name as string}
            shortDescription={raw.shortDescription as string | undefined}
            description={raw.description as string}
            category={category}
            basePrice={raw.basePrice as number}
            compareAtPrice={raw.compareAtPrice as number | undefined}
            currency="USD"
            averageRating={raw.averageRating as number}
            reviewCount={raw.reviewCount as number}
            totalStock={raw.totalStock as number}
            variants={variants}
            primaryImage={primaryImage ?? { url: "", alt: raw.name as string }}
          />
        </div>
      </section>

      {/* ── Related products ─────────────────────────────────────────────── */}
      {relatedProducts.length > 0 && (
        <section className="py-14 border-t border-[#1A1A1A]/08">
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