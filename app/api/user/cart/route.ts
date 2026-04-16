import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/session";

// GET: Fetch the user's saved cart from the database
export async function GET() {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) return NextResponse.json({ cart: [] }, { status: 401 });

    await connectDB();
    const user = await User.findById(sessionUser.id).lean();
    return NextResponse.json({ cart: user?.cart || [] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

// PUT: Save the updated cart to the database
export async function PUT(request: Request) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { cart } = await request.json();

    await User.findByIdAndUpdate(sessionUser.id, { cart });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to sync cart" }, { status: 500 });
  }
}