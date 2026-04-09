import mongoose, { Schema, InferSchemaType } from "mongoose";

// ---------------------------------------------------------------------------
// Schema definition comes FIRST.
// We use InferSchemaType to derive the TypeScript type from the schema itself
// — this avoids the classic "extends Document" id/readonly conflict in v7+.
// ---------------------------------------------------------------------------
const CategorySchema = new Schema(
  {
    // Display name — e.g. "Necklaces", "Handbags"
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      maxlength: [80, "Name cannot exceed 80 characters"],
    },

    // URL-safe identifier used in routes: /products?category=necklaces
    // Auto-generated from `name` in the pre-save hook if not supplied.
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    // Hero / thumbnail image URL for the category landing page.
    image: {
      type: String,
      trim: true,
    },

    // Self-referential: null = top-level (e.g. "Jewelry"),
    // ObjectId = sub-category (e.g. "Rings" inside "Jewelry").
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    // Hidden categories won't appear in the storefront.
    isActive: {
      type: Boolean,
      default: true,
    },

    // Lower number = appears first in nav / grid.
    sortOrder: {
      type: Number,
      default: 0,
    },
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
CategorySchema.index({ isActive: 1, sortOrder: 1 });

// ---------------------------------------------------------------------------
// Pre-save hook — auto-generate slug from name if not already set
// ---------------------------------------------------------------------------
CategorySchema.pre("validate", async function () {
  // If slug is missing but name exists, generate it before Mongoose checks!
  if (!this.slug && this.name) {
    this.slug = (this.name as string)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
});

// ---------------------------------------------------------------------------
// Type export — inferred directly from the schema
// ---------------------------------------------------------------------------
export type ICategory = InferSchemaType<typeof CategorySchema>;

// ---------------------------------------------------------------------------
// Model — the mongoose.models guard prevents hot-reload errors in Next.js
// ---------------------------------------------------------------------------
const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);

export default Category;