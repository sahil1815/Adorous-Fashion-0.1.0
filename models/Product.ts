import mongoose, { Schema, InferSchemaType } from "mongoose";

// ---------------------------------------------------------------------------
// Sub-document schemas
// ---------------------------------------------------------------------------
const ProductImageSchema = new Schema(
  {
    url: { type: String, required: true },
    alt: { type: String, required: true },
    isPrimary: { type: Boolean, default: false },
    width: { type: Number },
    height: { type: Number },
  },
  { _id: false }
);

const ProductVariantSchema = new Schema({
  sku: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  attributes: {
    type: Object,
    default: {},
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price cannot be negative"],
  },
  compareAtPrice: {
    type: Number,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  images: [{ type: String }],
});

const ProductReviewSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String },
    body: { type: String, required: true, maxlength: 2000 },
    createdAt: { type: Date, default: () => new Date() },
    isVerified: { type: Boolean, default: false },
  },
  { _id: false }
);

// ---------------------------------------------------------------------------
// Main product schema
// ---------------------------------------------------------------------------
const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: 200,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
    },

    shortDescription: {
      type: String,
      maxlength: 300,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },

    tags: [{ type: String, lowercase: true, trim: true }],

    // NEW: Marketing collections array
    collections: [{ type: String, lowercase: true, trim: true }],

    images: {
      type: [ProductImageSchema],
      validate: {
        validator: (arr: unknown[]) => arr.length > 0,
        message: "A product must have at least one image",
      },
    },

    variants: [ProductVariantSchema],

    basePrice: {
      type: Number,
      required: true,
      min: [0, "Base price cannot be negative"],
    },

    compareAtPrice: {
      type: Number,
      min: 0,
    },

    currency: {
      type: String,
      default: "USD",
      uppercase: true,
      maxlength: 3,
    },

    totalStock: {
      type: Number,
      default: 0,
      min: 0,
    },

    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    metaTitle: { type: String, maxlength: 70 },
    metaDescription: { type: String, maxlength: 160 },

    reviews: [ProductReviewSchema],

    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = (ret._id as { toString(): string }).toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// ---------------------------------------------------------------------------
// Indexes
// ---------------------------------------------------------------------------
ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ isFeatured: 1, isActive: 1 });
ProductSchema.index({ collections: 1, isActive: 1 }); // Added index for fast collection fetching
ProductSchema.index({ tags: 1 });
ProductSchema.index({ name: "text", description: "text", tags: "text" });

// ---------------------------------------------------------------------------
// Virtuals
// ---------------------------------------------------------------------------
ProductSchema.virtual("isOnSale").get(function () {
  return !!(this.compareAtPrice && this.compareAtPrice > this.basePrice);
});

ProductSchema.virtual("primaryImage").get(function () {
  const images = this.images as Array<{ isPrimary: boolean }>;
  return images.find((img) => img.isPrimary) ?? images[0] ?? null;
});

// ---------------------------------------------------------------------------
// Pre-validate hook — auto-generate slug BEFORE Mongoose panics
// ---------------------------------------------------------------------------
ProductSchema.pre("validate", async function () {
  if (this.name && !this.slug) {
    this.slug = (this.name as string)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
});

// ---------------------------------------------------------------------------
// Pre-save hook — sync derived / generated fields
// ---------------------------------------------------------------------------
ProductSchema.pre("save", async function () {
  // Recalculate totalStock by summing all variant stocks
  const variants = this.variants as Array<{ stock: number }>;
  if (this.isModified("variants") && variants.length > 0) {
    this.totalStock = variants.reduce((sum, v) => sum + v.stock, 0);
  }

  // Recalculate review aggregates
  const reviews = this.reviews as Array<{ rating: number }>;
  if (this.isModified("reviews") && reviews.length > 0) {
    this.reviewCount = reviews.length;
    this.averageRating =
      Math.round(
        (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10
      ) / 10;
  }
});

export type IProduct = InferSchemaType<typeof ProductSchema>;

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;