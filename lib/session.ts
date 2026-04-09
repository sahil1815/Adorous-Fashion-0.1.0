import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { verifySession } from "@/lib/auth";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;

  const session = verifySession(sessionCookie);
  if (!session) return null;

  await connectDB();
  const user = await User.findById(session.userId).lean();

  if (!user) return null;

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
