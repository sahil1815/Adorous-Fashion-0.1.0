import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function PATCH(
  request: NextRequest,
  // ✅ FIXED: In newer Next.js versions, params is a Promise
  context: { params: Promise<{ slug: string }> } 
) {
  try {
    // ✅ FIXED: We must await the params before we can read the ID
    const { slug } = await context.params; 

    await connectDB();
    const { stock } = await request.json();

    const product = await Product.findById(slug);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Update totalStock directly AND update the first variant's stock
    product.totalStock = stock;
    if (product.variants && product.variants.length > 0) {
      product.variants[0].stock = stock;
    }

    await product.save();

    return NextResponse.json({ success: true, stock });
  } catch (error) {
    console.error("[PATCH /api/products/[id]/stock]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}