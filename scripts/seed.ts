// scripts/seed.ts
// Run with:  npx tsx scripts/seed.ts
//
// Inserts one sample product + category so the PDP has real data to render.

import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("MONGODB_URI not set in .env.local");

// ── Inline schemas (avoids import path issues in script context) ───────────

const CategorySchema = new mongoose.Schema(
  { name: String, slug: String, isActive: { type: Boolean, default: true } },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
  {
    name: String, slug: String, description: String, shortDescription: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    tags: [String],
    images: [{ url: String, alt: String, isPrimary: Boolean }],
    variants: [{
      sku: String,
      attributes: Object,
      price: Number,
      compareAtPrice: Number,
      stock: Number,
    }],
    basePrice: Number, compareAtPrice: Number, currency: { type: String, default: "USD" },
    totalStock: Number, isFeatured: Boolean, isActive: { type: Boolean, default: true },
    metaTitle: String, metaDescription: String,
    averageRating: { type: Number, default: 0 },
    reviewCount:   { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Product  = mongoose.models.Product  || mongoose.model("Product",  ProductSchema);

// ── Seed data ─────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("✓ Connected to MongoDB");

  // Upsert category
  const category = await Category.findOneAndUpdate(
    { slug: "necklaces" },
    { name: "Necklaces", slug: "necklaces", isActive: true },
    { upsert: true, new: true }
  );
  console.log("✓ Category:", category.name);

  // Upsert product
  const product = await Product.findOneAndUpdate(
    { slug: "rosette-chain-necklace" },
    {
      name: "Rosette Chain Necklace",
      slug: "rosette-chain-necklace",
      shortDescription:
        "A delicate layered chain finished with a hand-pressed rosette pendant in 18k rose gold vermeil.",
      description:
        "Crafted with precision from sterling silver and finished in 18k rose gold vermeil, the Rosette Chain Necklace is the perfect everyday luxury piece. The hand-pressed rosette pendant catches light beautifully and pairs effortlessly with both casual and formal looks.",
      category: category._id,
      tags: ["necklace", "rose gold", "layering", "bestseller"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
          alt: "Rosette chain necklace flat lay",
          isPrimary: true,
        },
        {
          url: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80",
          alt: "Rosette chain necklace worn",
          isPrimary: false,
        },
        {
          url: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80",
          alt: "Rosette chain necklace close-up",
          isPrimary: false,
        },
        {
          url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
          alt: "Rosette chain necklace detail",
          isPrimary: false,
        },
      ],
      variants: [
        { sku: "RCN-RG-001", attributes: { color: "Rose Gold" }, price: 148, compareAtPrice: 195, stock: 3 },
        { sku: "RCN-GD-001", attributes: { color: "Gold" },      price: 158, compareAtPrice: null, stock: 12 },
        { sku: "RCN-SV-001", attributes: { color: "Silver" },    price: 138, compareAtPrice: null, stock: 0 },
      ],
      basePrice: 148,
      compareAtPrice: 195,
      totalStock: 15,
      isFeatured: true,
      isActive: true,
      metaTitle: "Rosette Chain Necklace | Adorous Fashion",
      metaDescription:
        "Shop the Rosette Chain Necklace — 18k rose gold vermeil over sterling silver. Delicate, layerable, and crafted to last.",
      averageRating: 4.2,
      reviewCount: 38,
    },
    { upsert: true, new: true }
  );
  console.log("✓ Product:", product.name);
  console.log("✓ Slug:   ", product.slug);
  console.log("\nVisit: http://localhost:3000/products/rosette-chain-necklace\n");

  await mongoose.disconnect();
  console.log("✓ Done — disconnected from MongoDB");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});