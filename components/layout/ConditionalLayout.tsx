"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer";
import CartDrawer from "../cart/CartDrawer";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if we are currently anywhere inside the /admin section
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    // If we are in the admin panel, strip away the storefront UI
    return <>{children}</>;
  }

  // If we are on the storefront, render the Navbar, Cart, and Footer
  return (
    <>
      <Navbar />
      <CartDrawer />
      <div className="flex min-h-screen flex-col">
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
      </div>
    </>
  );
}