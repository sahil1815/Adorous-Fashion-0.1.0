import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/session";

// GET: Fetch the user's saved wishlist from the database
export async function GET() {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) return NextResponse.json({ wishlist: [] }, { status: 401 });

    await connectDB();
    const user = await User.findById(sessionUser.id).lean();
    return NextResponse.json({ wishlist: user?.wishlist || [] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 });
  }
}

// PUT: Save the updated wishlist to the database
export async function PUT(request: Request) {
  try {
    const sessionUser = await getCurrentUser();
    // If not logged in, just fail silently (they are using local storage as a guest)
    if (!sessionUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { wishlist } = await request.json();

    await User.findByIdAndUpdate(sessionUser.id, { wishlist });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to sync wishlist" }, { status: 500 });
  }
}