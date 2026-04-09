"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function CartPage() {
  // 1. Destructure exactly what we need from the store
  const { items: cartItems, updateQuantity, removeItem } = useCartStore();

  // 2. Calculate totals based on the items in the store
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 150 ? 0 : 15;
  const total = subtotal + shipping;

  return (
    <main className="min-h-screen bg-white pt-28 pb-24">
      <div className="container mx-auto px-6 md:px-10 max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-light tracking-widest uppercase text-[#1A1A1A]">
            Shopping Cart
          </h1>
          <p className="text-sm text-[#1A1A1A]/60 mt-2 tracking-wide">
            {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#1A1A1A]/70 text-lg mb-6">Your cart is empty</p>
            <Link
              href="/shop"
              className="inline-block bg-[#1A1A1A] text-white uppercase tracking-[0.2em] text-[12px] px-10 py-4 hover:bg-[#B76E79] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left: Cart Items */}
            <div className="lg:col-span-7">
              <div className="space-y-6 border-b border-[#1A1A1A]/10 pb-8">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.variantId || 'default'}`}
                    className="flex items-start space-x-6 pb-6 border-b border-[#1A1A1A]/10"
                  >
                    {/* Product Image */}
                    <div className="relative w-24 h-32 bg-white border border-[#1A1A1A]/10 flex-shrink-0">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <Link
                        href={`/products/${item.slug || item.id}`}
                        className="text-lg font-medium text-[#1A1A1A] hover:text-[#B76E79] transition-colors"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-[#1A1A1A]/60 mt-1">
                        {/* Display the variant attributes if they exist (e.g., color, size) */}
                        {item.attributes ? Object.values(item.attributes).join(' / ') : "Standard"}
                      </p>
                      <p className="text-lg font-light text-[#1A1A1A] mt-3">
                        ${item.price.toFixed(2)}
                      </p>

                      {/* Quantity & Actions */}
                      <div className="flex items-center space-x-4 mt-4">
                        <div className="flex items-center border border-[#1A1A1A]/20">
                          {/* 3. Wire up the minus button */}
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.variantId)}
                            className="w-8 h-8 flex items-center justify-center text-[#1A1A1A]/60 hover:bg-[#F7E7CE]/30 transition-colors"
                          >
                            −
                          </button>
                          <span className="w-8 h-8 flex items-center justify-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          {/* 4. Wire up the plus button */}
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.variantId)}
                            className="w-8 h-8 flex items-center justify-center text-[#1A1A1A]/60 hover:bg-[#F7E7CE]/30 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        {/* 5. Wire up the remove button */}
                        <button
                          onClick={() => removeItem(item.id, item.variantId)}
                          className="text-[#1A1A1A]/60 hover:text-[#B76E79] transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Line Total */}
                    <div className="text-right">
                      <p className="text-lg font-light text-[#1A1A1A]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping Link */}
              <div className="mt-8">
                <Link
                  href="/shop"
                  className="text-sm tracking-widest uppercase text-[#1A1A1A]/70 hover:text-[#1A1A1A] transition-colors flex items-center"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-[#F7E7CE]/20 border border-[#1A1A1A]/10 p-8">
                <h2 className="text-lg tracking-widest uppercase text-[#1A1A1A] mb-6 font-medium">
                  Order Summary
                </h2>

                {/* Totals */}
                <div className="space-y-4 text-sm tracking-wide mb-8">
                  <div className="flex justify-between text-[#1A1A1A]">
                    <span className="text-[#1A1A1A]/70">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#1A1A1A]">
                    <span className="text-[#1A1A1A]/70">Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  {subtotal > 0 && subtotal <= 150 && (
                    <p className="text-xs text-[#1A1A1A]/60 italic">
                      Free shipping on orders over $150
                    </p>
                  )}
                </div>

                {/* Total */}
                <div className="border-t border-[#1A1A1A]/10 pt-4 flex justify-between items-end mb-8">
                  <span className="text-base uppercase tracking-widest font-medium text-[#1A1A1A]">
                    Total
                  </span>
                  <span
                    className="text-2xl font-light text-[#1A1A1A]"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    ${total.toFixed(2)}
                  </span>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="w-full bg-[#1A1A1A] text-white uppercase tracking-[0.2em] text-[12px] py-5 hover:bg-[#B76E79] transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}