// app/api/user/change-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/session";
import { hashPassword, verifyPassword } from "@/lib/auth"; // ✅ Using your custom crypto functions!

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    // 1. Get the currently logged-in user
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Please fill in all fields." }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters long." }, { status: 400 });
    }

    // 2. Fetch the user from the database
    // We use .select("+passwordHash") just in case your User schema hides it by default
    const user = await User.findById(sessionUser.id).select("+passwordHash");
    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: "User not found or missing password data." }, { status: 404 });
    }

    // 3. Verify the current password matches what is in the database
    const isMatch = verifyPassword(currentPassword, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Incorrect current password." }, { status: 400 });
    }

    // 4. Hash the new password and save it
    user.passwordHash = hashPassword(newPassword);
    await user.save();

    return NextResponse.json({ success: true, message: "Password updated successfully." });

  } catch (error: any) {
    console.error("[CHANGE_PASSWORD_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to update password. Please try again." },
      { status: 500 }
    );
  }
}