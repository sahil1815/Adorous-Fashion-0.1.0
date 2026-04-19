// app/api/wishlist/refresh/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { ids } = await req.json();

    if (!ids || ids.length === 0) {
      return NextResponse.json({ products: [] });
    }

    // 1. Fetch the absolute latest details for these specific product IDs
    const rawProducts = await Product.find({ 
      _id: { $in: ids },
      isActive: true 
    }).lean();

    // 2. Format them identically to your Category page so the cards look perfect
    const freshProducts = rawProducts.map((p: any) => ({
      id: p._id.toString(),
      slug: p.slug,
      name: p.name,
      price: p.basePrice || 0,    
      compareAtPrice: p.compareAtPrice,
      badge: p.badge,
      averageRating: p.averageRating || 0,
      soldCount: p.soldCount || 0,
      images: {
        primary: p.images?.[0] || { url: "", alt: p.name },
        hover: p.images?.[1] || undefined,
      },
      swatches: [], 
    }));

    return NextResponse.json({ products: freshProducts });
  } catch (error) {
    console.error("WISHLIST_REFRESH_ERROR", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}