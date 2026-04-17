import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { getCurrentUser } from "@/lib/session"; 

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> } // ✅ Changed 'id' to 'slug' to match the folder name
) {
  try {
    await connectDB();
    const { slug } = await context.params; // ✅ Changed 'id' to 'slug'
    const body = await request.json();
    const { rating, body: reviewBody } = body;

    // 1. Ensure the user is logged in
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

    // 3. Find the product (Bulletproof check: searches by ID first, then by text slug)
    let product;
    if (slug.length === 24) {
      product = await Product.findById(slug);
    } else {
      product = await Product.findOne({ slug: slug });
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // 4. Create the new review object
    const newReview = {
      user: sessionUser.id,
      rating: Number(rating),
      body: reviewBody.trim(),
      isVerified: true, 
      createdAt: new Date()
    };

    // 5. Push the review into the product's review array
    product.reviews.push(newReview);

    // 6. Save the product!
    await product.save();

    return NextResponse.json({ success: true, message: "Review submitted successfully!" }, { status: 201 });

  } catch (error: any) {
    console.error("[POST /api/products/[slug]/review]", error);
    return NextResponse.json(
      { error: "Failed to submit review. Please try again." }, 
      { status: 500 }
    );
  }
}