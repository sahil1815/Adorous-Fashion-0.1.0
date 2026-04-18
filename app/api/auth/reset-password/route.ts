// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";
import { hashPassword } from "@/lib/auth"; // ✅ Using your custom authentication logic!

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    // ✅ Extracting "password" to match exactly what your frontend sends
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Missing token or password" }, { status: 400 });
    }

    // 1. Hash the token from the URL to match what's in the DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // 2. Find user with valid token that hasn't expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    // 3. Hash the new password using YOUR custom function! (This fixes the login)
    user.passwordHash = hashPassword(password);

    // 4. Update user and clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return NextResponse.json({ message: "Password updated successfully" });

  } catch (error) {
    console.error("RESET_PASSWORD_ERROR", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}