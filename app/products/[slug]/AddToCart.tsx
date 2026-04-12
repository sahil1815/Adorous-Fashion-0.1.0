// app/products/[slug]/AddToCartButton.tsx
"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";

interface AddToCartProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string;
  }
}

export default function AddToCartButton({ product }: AddToCartProps) {
  const { addItem, openCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({ ...product, quantity });
    
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      openCart();
    }, 800);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Quantity Selector */}
      <div className="flex items-center border border-[#1A1A1A]/20">
        <button 
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="px-4 py-3 text-[#1A1A1A] hover:bg-[#F7E7CE]/30 transition-colors"
        >−</button>
        <span className="w-10 text-center text-sm text-[#1A1A1A]">{quantity}</span>
        <button 
          onClick={() => setQuantity(quantity + 1)}
          className="px-4 py-3 text-[#1A1A1A] hover:bg-[#F7E7CE]/30 transition-colors"
        >+</button>
      </div>

      {/* Add Button */}
      <button 
        onClick={handleAdd}
        className={`flex-1 py-3 text-[11px] uppercase tracking-[0.2em] transition-all
          ${added ? "bg-[#B76E79] text-white" : "bg-[#1A1A1A] text-white hover:bg-[#B76E79]"}`}
      >
        {added ? "Added to Cart" : "Add to Cart"}
      </button>
    </div>
  );
}