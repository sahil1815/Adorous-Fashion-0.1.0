import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductCardProps } from "@/components/shop/ProductCard";

interface WishlistStore {
  items: ProductCardProps[];
  toggleWishlist: (item: ProductCardProps) => void;
  syncWishlist: () => Promise<void>; // ✅ New function to pull DB data on load
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      toggleWishlist: async (item) => {
        const currentItems = get().items;
        const exists = currentItems.find((i) => i.id === item.id);
        
        let newItems;
        if (exists) {
          newItems = currentItems.filter((i) => i.id !== item.id);
        } else {
          newItems = [...currentItems, item];
        }
        
        // 1. Update the UI instantly so it feels blazing fast
        set({ items: newItems });

        // 2. Silently attempt to save to the database in the background
        try {
          await fetch("/api/user/wishlist", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ wishlist: newItems }),
          });
        } catch (error) {
          // Fails silently if they are a guest
        }
      },

      // ✅ Call this to fetch the global wishlist from MongoDB when the user opens the site
      syncWishlist: async () => {
        try {
          const res = await fetch("/api/user/wishlist");
          if (res.ok) {
            const data = await res.json();
            // If the DB has items, overwrite the local browser memory with the global DB memory
            if (data.wishlist && data.wishlist.length > 0) {
              set({ items: data.wishlist });
            }
          }
        } catch (error) {
          // Fails silently
        }
      }
    }),
    {
      name: "adorous-wishlist", 
    }
  )
);