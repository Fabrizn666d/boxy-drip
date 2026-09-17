"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useDialog } from "@/components/ui/useDialog";
import { useStore } from "@/components/providers/StoreProvider";
import { getCartWhatsAppUrl } from "@/lib/cart";
import { PRODUCT_PRICE_LABEL } from "@/data/products";

export function CartDrawer() {
  const { cart, cartOpen, closeCart, removeFromCart, updateQuantity } = useStore();
  const whatsappUrl = getCartWhatsAppUrl(cart);
  const dialogRef = useDialog(cartOpen, closeCart);

  return (
    <AnimatePresence>
      {cartOpen ? <div ref={dialogRef} tabIndex={-1} className="cart-layer" role="dialog" aria-modal="true" aria-label="Carrito de compras">
        <motion.button className="cart-backdrop" type="button" aria-label="Cerrar carrito" onClick={closeCart} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
        <motion.aside className="cart-drawer" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: .35 }}>
          <header className="drawer-header"><div><span>Tu selección</span><h2>Carrito</h2></div><button type="button" aria-label="Cerrar carrito" onClick={closeCart}><X /></button></header>
          <div className="drawer-items">
            {cart.length ? cart.map((item) => <article className="drawer-item" key={item.key}>
              <div className="drawer-item-image"><Image src={item.image} alt={item.product.name} fill sizes="96px" /></div>
              <div className="drawer-item-copy"><h3>{item.product.name}</h3><p>{item.colorName} · Talla {item.size}</p><strong>{PRODUCT_PRICE_LABEL}</strong><div className="drawer-quantity"><button type="button" aria-label="Restar unidad" onClick={() => updateQuantity(item.key, item.quantity - 1)}><Minus /></button><span>{item.quantity}</span><button type="button" aria-label="Sumar unidad" onClick={() => updateQuantity(item.key, item.quantity + 1)}><Plus /></button></div></div>
              <button type="button" className="drawer-remove" aria-label={`Eliminar ${item.product.name}`} onClick={() => removeFromCart(item.key)}><Trash2 /></button>
            </article>) : <div className="drawer-empty"><ShoppingBag /><h3>Tu carrito está vacío</h3><p>Explora el Drop 006 y agrega tu próxima pieza.</p><button type="button" onClick={closeCart}>Seguir explorando</button></div>}
          </div>
          <footer className="drawer-footer"><div><span>Precio</span><strong>{PRODUCT_PRICE_LABEL}</strong></div><button type="button" className="drawer-view-cart" onClick={closeCart}>Seguir comprando</button><a href={cart.length ? whatsappUrl : undefined} aria-disabled={!cart.length} tabIndex={cart.length ? 0 : -1} target="_blank" rel="noreferrer" className={cart.length ? "" : "is-disabled"}><MessageCircle /> Finalizar por WhatsApp</a></footer>
        </motion.aside>
      </div> : null}
    </AnimatePresence>
  );
}
