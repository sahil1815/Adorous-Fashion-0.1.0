import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/session";

export async function PUT(request: Request) {
  try {
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

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name.trim();
    const cleanPhone = phone.trim();

    // Make sure the new email isn't already taken
    const existingEmail = await User.findOne({ 
      email: cleanEmail, 
      _id: { $ne: sessionUser.id } 
    });
    
    if (existingEmail) {
      return NextResponse.json({ error: "This email is already in use by another account." }, { status: 409 });
    }

    // Update the database with the new data
    const updatedUser = await User.findByIdAndUpdate(
      sessionUser.id,
      { name: cleanName, email: cleanEmail, phone: cleanPhone },
      { new: true }
    );

    return NextResponse.json({ 
      message: "Profile updated successfully", 
      user: { name: updatedUser.name, email: updatedUser.email, phone: updatedUser.phone } 
    }, { status: 200 });

  } catch (error: any) {
    console.error("[PUT /api/user/profile]", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}