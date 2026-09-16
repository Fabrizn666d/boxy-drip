"use client";

import { ShoppingBag } from "lucide-react";
import { useStore } from "@/components/providers/StoreProvider";
import type { Product } from "@/data/products";

export function AddToCartButton({ product, colorId, size, quantity = 1 }: { product: Product; colorId?: string; size?: string; quantity?: number }) {
  const { addToCart } = useStore();

  return (
    <button type="button" className="add-to-cart-button" onClick={() => addToCart(product, { colorId, size, quantity })}>
      Agregar al carrito <ShoppingBag />
    </button>
  );
}
