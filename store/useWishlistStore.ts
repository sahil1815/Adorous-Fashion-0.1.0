import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductCardProps } from "@/components/shop/ProductCard";

interface WishlistStore {
  items: ProductCardProps[];
  toggleWishlist: (item: ProductCardProps) => void;
  isInWishlist: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      toggleWishlist: (item) => {
        const exists = get().items.find((i) => i.id === item.id);
        if (exists) {
          // If it's already in the wishlist, remove it
          set({ items: get().items.filter((i) => i.id !== item.id) });
        } else {
          // If it's not in the wishlist, add it
          set({ items: [...get().items, item] });
        }
      },

      isInWishlist: (id) => !!get().items.find((i) => i.id === id),
    }),
    {
      name: "adorous-wishlist", // Saves to browser's local storage
    }
  )
);