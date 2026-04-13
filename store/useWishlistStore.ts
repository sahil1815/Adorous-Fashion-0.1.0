import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductCardProps } from "@/components/shop/ProductCard";

interface WishlistStore {
  items: ProductCardProps[];
  toggleWishlist: (item: ProductCardProps) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      toggleWishlist: (item) => {
        const exists = get().items.find((i) => i.id === item.id);
        if (exists) {
          // Remove if it exists
          set({ items: get().items.filter((i) => i.id !== item.id) });
        } else {
          // Add if it doesn't
          set({ items: [...get().items, item] });
        }
      },
    }),
    {
      name: "adorous-wishlist", // Saves to browser
    }
  )
);