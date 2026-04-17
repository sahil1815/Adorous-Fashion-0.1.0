"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Lock } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

// ✅ Updated props to accept the autofill data from the database
interface CheckoutFormProps {
  initialName: string;
  initialEmail: string;
  initialPhone: string;
}

export default function CheckoutForm({ initialName, initialEmail, initialPhone }: CheckoutFormProps) {
  const store = useCartStore();
  const cartItems = (store as any).items || (store as any).cart || [];

  const subtotal = cartItems.reduce(
    (total: number, item: any) => total + item.price * item.quantity,
    0,
  );
  
  const shipping = 0; // Calculated manually by admin later
  const total = subtotal;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    const orderData = {
      customer: {
        email: formData.get("email"),
        phone: formData.get("phone"),
      },
      shippingAddress: {
        // ✅ Merged into a single fullName field
        fullName: formData.get("fullName"),
        address: formData.get("address"),
        city: formData.get("city"), // Used for District/জেলা
        state: formData.get("state"), // Used for Sub-district/উপজেলা
      },
      items: cartItems,
      subtotal,
      shipping,
      total,
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(
          `Order placed successfully! Your Order ID is ${data.orderNumber}`,
        );
        // If you want to clear the cart after successful order, you can call it here:
        // store.clearCart(); 
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setMessage("A network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyles =
    "w-full border border-[#1A1A1A]/20 bg-white text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 p-4 text-sm focus:outline-none focus:border-[#B76E79] focus:ring-1 focus:ring-[#B76E79] transition-all";

  return (
    <main className="min-h-screen bg-white pt-28 pb-24">
      <div className="container mx-auto px-6 md:px-10 max-w-6xl">
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-[#1A1A1A]/10">
          <div className="flex items-center text-[11px] tracking-[0.1em] text-[#1A1A1A]/50 uppercase">
            <Lock size={12} className="mr-2" /> Secure Checkout
          </div>
          <div className="text-sm text-[#1A1A1A]/70">
            Signed in as {initialName}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="flex items-center space-x-2 text-[11px] uppercase tracking-[0.15em] text-[#1A1A1A]/50 mb-10">
              <Link
                href="/cart"
                className="hover:text-[#B76E79] transition-colors"
              >
                Cart
              </Link>
              <ChevronRight size={12} />
              <span className="text-[#1A1A1A] font-medium">
                Information & Shipping
              </span>
              <ChevronRight size={12} />
              <span>Payment</span>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-10">
              <section>
                <h2 className="text-lg tracking-widest uppercase text-[#1A1A1A] mb-6 font-medium">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {/* ✅ Autofilled Contact Info */}
                  <input
                    type="email"
                    name="email"
                    defaultValue={initialEmail}
                    required
                    placeholder="Email address"
                    className={inputStyles}
                  />
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={initialPhone}
                    required
                    placeholder="Phone number"
                    className={inputStyles}
                  />
                </div>
              </section>

              <section>
                <h2 className="text-lg tracking-widest uppercase text-[#1A1A1A] mb-6 font-medium">
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* ✅ Single Full Name input (Autofilled) */}
                  <input
                    type="text"
                    name="fullName"
                    defaultValue={initialName}
                    required
                    placeholder="Full name"
                    className={`${inputStyles} sm:col-span-2`}
                  />
                  {/* ✅ BD-Friendly Placeholders */}
                  <input
                    type="text"
                    name="address"
                    required
                    placeholder="Full Address"
                    className={`${inputStyles} sm:col-span-2`}
                  />
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="District / জেলা"
                    className={inputStyles}
                  />
                  <input
                    type="text"
                    name="state"
                    required
                    placeholder="Sub-district / উপজেলা"
                    className={inputStyles}
                  />
                </div>
              </section>

              <section>
                <h2 className="text-lg tracking-widest uppercase text-[#1A1A1A] mb-6 font-medium">
                  Payment
                </h2>
                <div className="border border-[#1A1A1A]/20 p-5 bg-[#F7E7CE]/20 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full border-4 border-[#B76E79] bg-white"></div>
                    <span className="text-sm tracking-wide text-[#1A1A1A] font-medium">
                      Cash on Delivery (COD)
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-xs text-[#1A1A1A]/60 tracking-wide">
                  You will pay in cash when your order is delivered.
                </p>
              </section>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1A1A1A] text-white uppercase tracking-[0.2em] text-[12px] py-5 hover:bg-[#B76E79] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Placing order…" : "Place order"}
              </button>

              {message && (
                <div className="rounded-2xl bg-[#F7E7CE]/70 p-4 text-sm text-[#1A1A1A]">
                  {message}
                </div>
              )}
            </form>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-3xl border border-[#1A1A1A]/10 bg-[#FFF8F2] p-6 shadow-sm">
              <h2 className="text-lg font-medium text-[#1A1A1A] mb-4">
                Order summary
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-[#1A1A1A]/70">
                  <span>Unique Products</span>
                  <span>{cartItems.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-[#1A1A1A]/70">
                  <span>Total Quantity</span>
                  <span>{store.totalItems()}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-[#1A1A1A]/70">
                  <span>Subtotal</span>
                  <span>৳{subtotal.toLocaleString("en-IN")}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-[#1A1A1A]/70">
                  <span>Shipping</span>
                  <span className="italic text-[#B76E79]">Calculated at confirmation</span>
                </div>
                
                <div className="border-t border-[#1A1A1A]/10 pt-4">
                  <div className="flex items-center justify-between text-base font-semibold text-[#1A1A1A]">
                    <span>Total</span>
                    <span>৳{total.toLocaleString("en-IN")}</span>
                  </div>
                  
                  <div className="mt-3 flex flex-col items-end text-right">
                    <p className="text-[10px] uppercase tracking-[0.1em] text-[#1A1A1A]/50 mb-1.5">
                      + Shipping fees will be added by our team
                    </p>
                    <div className="inline-block rounded-sm bg-[#F7E7CE]/20 px-2.5 py-1.5 border border-[#F7E7CE]/50">
                      <p className="text-[9px] uppercase tracking-[0.1em] text-[#1A1A1A]/70 font-medium">
                        Inside Dhaka: <span className="text-[#B76E79] font-bold">৳80</span> 
                        <span className="mx-1.5 text-[#1A1A1A]/20">|</span> 
                        Outside Dhaka: <span className="text-[#B76E79] font-bold">৳130</span>
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}