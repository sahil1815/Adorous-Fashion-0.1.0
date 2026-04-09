// app/api/products/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import mongoose from "mongoose";

// GET: Smartly handles both Slugs (storefront) and IDs (admin edit)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    await connectDB();

    // Check if the param is a MongoDB ID. If yes, search by _id. If no, search by slug.
    const isMongoId = mongoose.Types.ObjectId.isValid(slug);
    const query = isMongoId ? { _id: slug } : { slug, isActive: true };

    const product = await Product.findOne(query)
      .populate("category", "name slug")
      .lean();

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (err) {
    console.error("[GET /api/products/[slug]]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT: Update product data
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    await connectDB();
    const body = await request.json();

    const isMongoId = mongoose.Types.ObjectId.isValid(slug);
    const query = isMongoId ? { _id: slug } : { slug };

    const product = await Product.findOneAndUpdate(
      query,
      {
        name: body.name,
        description: body.description,
        shortDescription: body.shortDescription,
        category: body.category,
        collections: body.collections || [], // Ensured collections are saved!
        tags: body.tags,
        images: body.images,
        variants: body.variants,
        basePrice: body.basePrice,
        compareAtPrice: body.compareAtPrice,
        currency: body.currency,
        isFeatured: body.isFeatured,
        isActive: body.isActive,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
      },
      { new: true, runValidators: true }
    ).populate("category", "name slug");

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (err: any) {
    console.error("[PUT /api/products/[slug]]", err);
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e: any) => e.message);
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE: Remove product
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    await connectDB();

    const isMongoId = mongoose.Types.ObjectId.isValid(slug);
    const query = isMongoId ? { _id: slug } : { slug };

    const product = await Product.findOneAndDelete(query);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("[DELETE /api/products/[slug]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}