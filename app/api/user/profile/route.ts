import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/session";

export async function PUT(request: Request) {
  try {
    // 1. Verify the user is actually logged in
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { name, email, phone } = body;

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // 2. Make sure the new email isn't already taken by another account
    const existingEmail = await User.findOne({ 
      email: email.toLowerCase().trim(), 
      _id: { $ne: sessionUser.id } // Exclude the current user from this check
    });
    
    if (existingEmail) {
      return NextResponse.json({ error: "This email is already in use by another account." }, { status: 409 });
    }

    // 3. Update the database
    const updatedUser = await User.findByIdAndUpdate(
      sessionUser.id,
      {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
      },
      { new: true } // Return the updated document
    );

    // [STEP 3 PLACEHOLDER: We will add the Admin Notification code right here in the next step!]

    return NextResponse.json({ 
      message: "Profile updated successfully", 
      user: { name: updatedUser.name, email: updatedUser.email, phone: updatedUser.phone } 
    }, { status: 200 });

  } catch (error: any) {
    console.error("[PUT /api/user/profile]", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}