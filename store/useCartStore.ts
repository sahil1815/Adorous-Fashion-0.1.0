import { create } from "zustand";
import { persist } from "zustand/middleware";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CartItem {
  id: string;               
  variantId?: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  attributes?: Record<string, string>; 
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;          

  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string, variantId?: string) => void;
  updateQuantity: (id: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  
  syncCart: () => Promise<void>; // ✅ Added global sync function

  totalItems: () => number;
  totalPrice: () => number;
}

// ---------------------------------------------------------------------------
// Database Sync Helper
// ---------------------------------------------------------------------------
// This silently pushes changes to MongoDB without interrupting the user
const syncWithDatabase = async (cartItems: CartItem[]) => {
  try {
    await fetch("/api/user/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart: cartItems }),
    });
  } catch (error) {
    // Fails silently if they are a guest
  }
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      addItem: (incoming) => {
        const state = get();
        const existing = state.items.find(
          (i) => i.id === incoming.id && i.variantId === incoming.variantId
        );

        let newItems;
        if (existing) {
          newItems = state.items.map((i) =>
            i.id === incoming.id && i.variantId === incoming.variantId
              ? { ...i, quantity: i.quantity + (incoming.quantity ?? 1) }
              : i
          );
        } else {
          newItems = [...state.items, { ...incoming, quantity: incoming.quantity ?? 1 }];
        }

        set({ items: newItems });
        syncWithDatabase(newItems); // ✅ Save to database
      },

      removeItem: (id, variantId) => {
        const newItems = get().items.filter(
          (i) => !(i.id === id && i.variantId === variantId)
        );
        set({ items: newItems });
        syncWithDatabase(newItems); // ✅ Save to database
      },

      updateQuantity: (id, quantity, variantId) => {
        const newItems =
          quantity <= 0
            ? get().items.filter((i) => !(i.id === id && i.variantId === variantId))
            : get().items.map((i) =>
                i.id === id && i.variantId === variantId ? { ...i, quantity } : i
              );
        set({ items: newItems });
        syncWithDatabase(newItems); // ✅ Save to database
      },

      clearCart: () => {
        set({ items: [] });
        syncWithDatabase([]); // ✅ Clear database cart too
      },

      // ✅ Call this to fetch the global cart from MongoDB when the user opens the site
      syncCart: async () => {
        try {
          const res = await fetch("/api/user/cart");
          if (res.ok) {
            const data = await res.json();
            if (data.cart && data.cart.length > 0) {
              set({ items: data.cart });
            }
          }
        } catch (error) {
          // Fails silently
        }
      },

      totalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "adorous-cart",                   
      partialize: (state) => ({ items: state.items }), 
    }
  )
);