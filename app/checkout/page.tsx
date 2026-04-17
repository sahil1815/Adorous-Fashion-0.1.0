import { redirect } from "next/navigation";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { getCurrentUser } from "@/lib/session";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export default async function CheckoutPage() {
  const sessionUser = await getCurrentUser();
  
  if (!sessionUser) {
    const loginUrl = new URL("/login", "http://localhost"); // Note: You might want to change this to your actual domain in production
    loginUrl.searchParams.set("redirectTo", "/checkout");
    redirect(loginUrl.pathname + loginUrl.search);
  }

  // Fetch the user from the database to get their phone number and latest info
  await connectDB();
  const dbUser = await User.findById(sessionUser.id).lean();

  return (
    <CheckoutForm 
      initialName={dbUser?.name || sessionUser.name || ""} 
      initialEmail={dbUser?.email || sessionUser.email || ""}
      initialPhone={dbUser?.phone || ""}
    />
  );
}