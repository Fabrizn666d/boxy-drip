"use client";

import { ArrowLeft, MessageCircle, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/components/providers/StoreProvider";
import { getCartWhatsAppUrl } from "@/lib/cart";
import { PRODUCT_PRICE_LABEL } from "@/data/products";

export function CartPageClient() {
  const { cart, removeFromCart, updateQuantity } = useStore();
  const whatsappUrl = getCartWhatsAppUrl(cart);

  if (!cart.length) return <section className="cart-page-empty"><ShoppingBag /><span>Tu selección está vacía</span><h1>Tu próxima pieza<br />sigue en la calle.</h1><p>Explora el catálogo y arma tu pedido. La selección queda guardada en este dispositivo.</p><Link href="/catalogo">Ir al catálogo</Link></section>;

  return <section className="cart-page-shell">
    <div className="cart-page-main">
      <Link href="/catalogo" className="cart-back-link"><ArrowLeft /> Seguir comprando</Link>
      <header><span>Tu selección</span><h1>Carrito</h1><p>{cart.reduce((sum, item) => sum + item.quantity, 0)} piezas en tu pedido</p></header>
      <div className="cart-page-items">{cart.map((item) => <article key={item.key}>
        <Link className="cart-page-image" href={`/producto/${item.product.slug}`}><Image src={item.image} alt={item.product.name} fill sizes="150px" /></Link>
        <div className="cart-page-copy"><Link href={`/producto/${item.product.slug}`}>{item.product.name}</Link><p>{item.colorName} · Talla {item.size}</p><strong>{PRODUCT_PRICE_LABEL}</strong></div>
        <div className="cart-page-quantity"><button type="button" aria-label="Restar unidad" onClick={() => updateQuantity(item.key, item.quantity - 1)}><Minus /></button><span>{item.quantity}</span><button type="button" aria-label="Sumar unidad" onClick={() => updateQuantity(item.key, item.quantity + 1)}><Plus /></button></div>
        <strong className="cart-page-line-total">{PRODUCT_PRICE_LABEL}</strong>
        <button className="cart-page-remove" type="button" aria-label={`Eliminar ${item.product.name}`} onClick={() => removeFromCart(item.key)}><Trash2 /></button>
      </article>)}</div>
    </div>
    <aside className="cart-page-summary"><span>Resumen del pedido</span><h2>Tu pedido</h2><div><small>Precio</small><strong>{PRODUCT_PRICE_LABEL}</strong></div><div><small>Envío</small><b>Por confirmar</b></div><p>El precio, el costo de envío y el método de pago se coordinan directamente por WhatsApp.</p><a href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle /> Finalizar por WhatsApp</a><small>Al continuar, abrirás una conversación con el detalle completo de tu pedido.</small></aside>
  </section>;
}
