import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import type { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  totalCount: number;
  subtotal: number;
  gst: number;
  shipping: number;
  total: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  incrementQuantity: (productId: string) => void;
  decrementQuantity: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "fastware_cart_v2";
const GST_RATE = 0.18;
const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_FEE = 49;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          setItems(JSON.parse(raw));
        } catch {
          // ignore
        }
      }
    });
  }, []);

  const save = (updated: CartItem[]) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  };

  const addToCart = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      return save(
        existing
          ? prev.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          : [...prev, { product, quantity: 1 }]
      );
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => save(prev.filter((i) => i.product.id !== productId)));
  }, []);

  const incrementQuantity = useCallback((productId: string) => {
    setItems((prev) =>
      save(
        prev.map((i) =>
          i.product.id === productId ? { ...i, quantity: i.quantity + 1 } : i
        )
      )
    );
  }, []);

  const decrementQuantity = useCallback((productId: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.product.id === productId);
      if (!item) return prev;
      if (item.quantity === 1) return save(prev.filter((i) => i.product.id !== productId));
      return save(
        prev.map((i) =>
          i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i
        )
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems(save([]));
  }, []);

  const totalCount = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const gst = Math.round(subtotal * GST_RATE);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + gst + shipping;

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        subtotal,
        gst,
        shipping,
        total,
        addToCart,
        removeFromCart,
        incrementQuantity,
        decrementQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
