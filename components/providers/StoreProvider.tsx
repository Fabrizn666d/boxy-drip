"use client";

import { MotionConfig } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/data/products";
import { CartDrawer } from "@/components/ui/CartDrawer";

export type CartItem = {
  key: string;
  product: Product;
  colorId: string;
  colorName: string;
  size: string;
  quantity: number;
  unitPrice: number;
  image: string;
};

type CartOptions = { colorId?: string; size?: string; quantity?: number; unitPrice?: number };

type StoreContextValue = {
  cart: CartItem[];
  cartCount: number;
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, options?: CartOptions) => void;
  removeFromCart: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);
const CART_KEY = "boxy-drip-cart-v2";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CART_KEY);
      // Cart hydration intentionally happens after mount to keep server markup stable.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setCart(JSON.parse(stored) as CartItem[]);
    } catch { window.localStorage.removeItem(CART_KEY); }
    setReady(true);
  }, []);

  useEffect(() => { if (ready) window.localStorage.setItem(CART_KEY, JSON.stringify(cart)); }, [cart, ready]);
  useEffect(() => {
    if (!cartOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [cartOpen]);

  const addToCart = useCallback((product: Product, options: CartOptions = {}) => {
    const color = product.colors.find((item) => item.id === options.colorId) ?? product.colors[0];
    const size = options.size ?? color.sizes.find((item) => item.status !== "sold-out")?.name ?? "M";
    const quantity = options.quantity ?? 1;
    const unitPrice = options.unitPrice ?? color.price ?? product.basePrice;
    const key = `${product.id}:${color.id}:${size}`;
    setCart((current) => {
      const existing = current.find((item) => item.key === key);
      if (existing) return current.map((item) => item.key === key ? { ...item, quantity: item.quantity + quantity } : item);
      return [...current, { key, product, colorId: color.id, colorName: color.name, size, quantity, unitPrice, image: color.images[0] }];
    });
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((key: string) => setCart((current) => current.filter((item) => item.key !== key)), []);
  const updateQuantity = useCallback((key: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(key);
    setCart((current) => current.map((item) => item.key === key ? { ...item, quantity } : item));
  }, [removeFromCart]);

  const value = useMemo(() => ({ cart, cartCount: cart.reduce((sum, item) => sum + item.quantity, 0), cartOpen, openCart: () => setCartOpen(true), closeCart: () => setCartOpen(false), addToCart, removeFromCart, updateQuantity }), [cart, cartOpen, addToCart, removeFromCart, updateQuantity]);

  return <MotionConfig reducedMotion="user"><StoreContext.Provider value={value}>{children}<CartDrawer /></StoreContext.Provider></MotionConfig>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore debe usarse dentro de StoreProvider");
  return context;
}
