// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email } = await req.json();

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json({ message: "If an account exists, a reset link has been sent." });
    }

    // 1. Create a random secure token
    const resetToken = crypto.randomBytes(32).toString("hex");
    
    // 2. Hash it and save to DB with 1 hour expiry
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // 3. Send the email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    // ✅ FIXED: We must extract "error" to see if Resend rejected it
    const { data, error } = await resend.emails.send({
      from: "Adorous Fashion <onboarding@resend.dev>", 
      to: user.email,
      subject: "Password Reset Request - Adorous",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color: #1A1A1A;">Reset Your Password</h2>
          <p>You requested a password reset for your Adorous Fashion account. Click the button below to set a new password. This link is valid for 1 hour.</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #B76E79; color: white; text-decoration: none; border-radius: 30px; font-weight: bold; margin-top: 20px;">Reset Password</a>
          <p style="margin-top: 30px; font-size: 12px; color: #666;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    // ✅ FIXED: If Resend fails, throw the error back to the frontend
    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json({ error: "Failed to send email via Resend. Check your API keys and verified emails." }, { status: 400 });
    }

    return NextResponse.json({ message: "Reset link sent successfully." });

  } catch (error: any) {
    console.error("FORGOT_PASSWORD_ERROR", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}