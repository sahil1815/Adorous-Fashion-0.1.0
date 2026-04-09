import { create } from "zustand";
import { persist } from "zustand/middleware";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CartItem {
  id: string;               // product id
  variantId?: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  attributes?: Record<string, string>; // e.g. { color: "Rose Gold" }
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;          // controls the CartDrawer visibility

  // Actions
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string, variantId?: string) => void;
  updateQuantity: (id: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;

  // Derived (computed inline — no selector needed)
  totalItems: () => number;
  totalPrice: () => number;
}

// ---------------------------------------------------------------------------
// Store
// `persist` serialises the cart to localStorage so it survives page refreshes.
// The `isOpen` drawer state is intentionally excluded from persistence.
// ---------------------------------------------------------------------------
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      addItem: (incoming) =>
        set((state) => {
          const existing = state.items.find(
            (i) =>
              i.id === incoming.id &&
              // treat undefined variantId and supplied variantId as different SKUs
              i.variantId === incoming.variantId
          );

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === incoming.id && i.variantId === incoming.variantId
                  ? { ...i, quantity: i.quantity + (incoming.quantity ?? 1) }
                  : i
              ),
            };
          }

          return { items: [...state.items, { ...incoming, quantity: incoming.quantity ?? 1 }] };
        }),

      removeItem: (id, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.id === id && i.variantId === variantId)
          ),
        })),

      updateQuantity: (id, quantity, variantId) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter(
                  (i) => !(i.id === id && i.variantId === variantId)
                )
              : state.items.map((i) =>
                  i.id === id && i.variantId === variantId
                    ? { ...i, quantity }
                    : i
                ),
        })),

      clearCart: () => set({ items: [] }),

      totalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "adorous-cart",                   // localStorage key
      partialize: (state) => ({ items: state.items }), // only persist items
    }
  )
);