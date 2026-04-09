import { redirect } from "next/navigation";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { getCurrentUser } from "@/lib/session";

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) {
    const loginUrl = new URL("/login", "http://localhost");
    loginUrl.searchParams.set("redirectTo", "/checkout");
    redirect(loginUrl.pathname + loginUrl.search);
  }

  return <CheckoutForm userName={user.name} />;
}
