"use client";

import { AnimatePresence, MotionConfig } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { products, type Product } from "@/data/products";
import { CartDrawer } from "@/components/ui/CartDrawer";
import { ProductModal } from "@/components/ui/ProductModal";

export type CartItem = {
  key: string;
  product: Product;
  colorId: string;
  colorName: string;
  size: string;
  quantity: number;
  image: string;
};

type CartOptions = { colorId?: string; size?: string; quantity?: number };

type StoreContextValue = {
  cart: CartItem[];
  cartCount: number;
  cartOpen: boolean;
  selectedProduct: Product | null;
  openCart: () => void;
  closeCart: () => void;
  openProduct: (product: Product) => void;
  closeProduct: () => void;
  addToCart: (product: Product, options?: CartOptions) => void;
  removeFromCart: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);
const CART_KEY = "boxy-drip-cart-v2";

function restoreCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((saved) => {
    if (!saved || typeof saved !== "object") return [];
    const product = products.find((item) => item.id === saved.product?.id);
    const color = product?.colors.find((item) => item.id === saved.colorId);
    if (!product || !color || !color.sizes.some((item) => item.name === saved.size && item.status !== "sold-out") || !Number.isFinite(saved.quantity) || saved.quantity < 1) return [];
    return [{ key: `${product.id}:${color.id}:${saved.size}`, product, colorId: color.id, colorName: color.name, size: saved.size, quantity: Math.min(99, Math.floor(saved.quantity)), image: color.images[0] }];
  });
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CART_KEY);
      // Cart hydration intentionally happens after mount to keep server markup stable.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setCart(restoreCart(JSON.parse(stored)));
    } catch { /* Storage can be unavailable in private browsing. */ }
    setReady(true);
  }, []);

  useEffect(() => { if (ready) { try { window.localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { /* Keep the current session usable. */ } } }, [cart, ready]);

  const addToCart = useCallback((product: Product, options: CartOptions = {}) => {
    const color = product.colors.find((item) => item.id === options.colorId) ?? product.colors[0];
    const size = options.size ?? color.sizes.find((item) => item.status !== "sold-out")?.name;
    if (!size || product.status === "sold-out" || !color.sizes.some((item) => item.name === size && item.status !== "sold-out")) return;
    const quantity = Math.max(1, Math.min(99, Math.floor(options.quantity ?? 1)));
    const key = `${product.id}:${color.id}:${size}`;
    setCart((current) => {
      const existing = current.find((item) => item.key === key);
      if (existing) return current.map((item) => item.key === key ? { ...item, quantity: Math.min(99, item.quantity + quantity) } : item);
      return [...current, { key, product, colorId: color.id, colorName: color.name, size, quantity, image: color.images[0] }];
    });
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((key: string) => setCart((current) => current.filter((item) => item.key !== key)), []);
  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const openProduct = useCallback((product: Product) => { setCartOpen(false); setSelectedProduct(product); }, []);
  const closeProduct = useCallback(() => setSelectedProduct(null), []);
  const updateQuantity = useCallback((key: string, quantity: number) => {
    if (!Number.isFinite(quantity)) return;
    if (quantity < 1) return removeFromCart(key);
    setCart((current) => current.map((item) => item.key === key ? { ...item, quantity: Math.min(99, Math.floor(quantity)) } : item));
  }, [removeFromCart]);

  const value = useMemo(() => ({ cart, cartCount: cart.reduce((sum, item) => sum + item.quantity, 0), cartOpen, selectedProduct, openCart, closeCart, openProduct, closeProduct, addToCart, removeFromCart, updateQuantity }), [cart, cartOpen, selectedProduct, openCart, closeCart, openProduct, closeProduct, addToCart, removeFromCart, updateQuantity]);

  return <MotionConfig reducedMotion="user"><StoreContext.Provider value={value}>{children}<CartDrawer /><AnimatePresence>{selectedProduct ? <ProductModal key={selectedProduct.id} product={selectedProduct} onClose={closeProduct} /> : null}</AnimatePresence></StoreContext.Provider></MotionConfig>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore debe usarse dentro de StoreProvider");
  return context;
}
