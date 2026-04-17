import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Notification from "@/models/Notification"; // ✅ Brought your notification system back!
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

    // 1. Fetch the OLD user data before we change it
    const oldUser = await User.findById(sessionUser.id);
    if (!oldUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Figure out exactly what changed
    let changes: string[] = [];
    if (oldUser.name !== cleanName) {
      changes.push(`Name from '${oldUser.name}' to '${cleanName}'`);
    }
    if (oldUser.email !== cleanEmail) {
      changes.push(`Email from '${oldUser.email}' to '${cleanEmail}'`);
    }
    if ((oldUser.phone || "") !== cleanPhone) {
      changes.push(`Phone from '${oldUser.phone || "None"}' to '${cleanPhone}'`);
    }

    // 3. Update the database with the new data
    const updatedUser = await User.findByIdAndUpdate(
      sessionUser.id,
      { name: cleanName, email: cleanEmail, phone: cleanPhone },
      { new: true }
    );

    // 4. RESTORED: Create the Admin Notification!
    if (changes.length > 0) {
      const changeMessage = `User ${oldUser.name} (${oldUser.email}) updated their profile. Changes made: ${changes.join(" | ")}.`;
      
      await Notification.create({
        title: "User Profile Updated",
        message: changeMessage,
        type: "profile_update"
      });
    }

    return NextResponse.json({ 
      message: "Profile updated successfully", 
      user: { name: updatedUser.name, email: updatedUser.email, phone: updatedUser.phone } 
    }, { status: 200 });

  } catch (error: any) {
    console.error("[PUT /api/user/profile]", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}