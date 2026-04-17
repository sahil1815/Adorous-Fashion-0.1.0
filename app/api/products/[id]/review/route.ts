import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { getCurrentUser } from "@/lib/session"; 

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ Using Promise for Next.js 15+ compatibility
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await request.json();
    const { rating, body: reviewBody } = body;

    // 1. Ensure the user is logged in (required by your Product schema)
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json(
        { error: "You must be logged in to leave a review." },
        { status: 401 }
      );
    }

    // 2. Validate the input
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating. Must be between 1 and 5." }, { status: 400 });
    }
    if (!reviewBody || reviewBody.trim().length === 0) {
      return NextResponse.json({ error: "Review message cannot be empty." }, { status: 400 });
    }

    // 3. Find the product
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // 4. Create the new review object
    const newReview = {
      user: sessionUser.id,
      rating: Number(rating),
      body: reviewBody.trim(),
      isVerified: true, // We'll mark them as verified buyers for now
      createdAt: new Date()
    };

    // 5. Push the review into the product's review array
    product.reviews.push(newReview);

    // 6. Save the product! 
    // (Your awesome pre-save hook in Product.ts will automatically recalculate the averageRating and reviewCount here!)
    await product.save();

    return NextResponse.json({ success: true, message: "Review submitted successfully!" }, { status: 201 });

  } catch (error: any) {
    console.error("[POST /api/products/[id]/review]", error);
    return NextResponse.json(
      { error: "Failed to submit review. Please try again." }, 
      { status: 500 }
    );
  }
}