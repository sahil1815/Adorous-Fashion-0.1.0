import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Contact from "@/models/Contact";

export async function POST(req: NextRequest) {
  try {
    // 1. Connect to your MongoDB
    await connectDB();

    // 2. Grab the data the user typed in the form
    const { name, email, orderId, message } = await req.json();

    // 3. Make sure the required fields aren't empty
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }

    // 4. Save it to the database!
    const newContact = new Contact({
      name,
      email,
      orderId,
      message,
    });

    await newContact.save();

    // 5. Tell the frontend it was a success
    return NextResponse.json({ success: true, message: "Message saved to database!" });

  } catch (error) {
    console.error("CONTACT_SAVE_ERROR:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}