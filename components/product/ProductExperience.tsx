"use client";

import { ChevronDown, MessageCircle, Minus, Plus, Ruler } from "lucide-react";
import Image from "next/image";
import { useMemo, useState, type CSSProperties } from "react";
import { useStore } from "@/components/providers/StoreProvider";
import { getProductPrice, type Product } from "@/data/products";
import { policies, SITE_CONFIG, SIZE_GUIDE } from "@/data/site";

export function ProductExperience({ product }: { product: Product }) {
  const [colorId, setColorId] = useState(product.colors[0].id);
  const color = product.colors.find((item) => item.id === colorId) ?? product.colors[0];
  const [size, setSize] = useState(color.sizes.find((item) => item.status !== "sold-out")?.name ?? "M");
  const [quantity, setQuantity] = useState(1);
  const [image, setImage] = useState(color.images[0]);
  const [guideOpen, setGuideOpen] = useState(false);
  const { addToCart } = useStore();
  const price = getProductPrice(product, color.id);
  const whatsappUrl = useMemo(() => `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(`Hola Boxy Drip 👽\n\nQuiero pedir:\n\nProducto: ${product.name}\nColor: ${color.name}\nTalla: ${size}\nCantidad: ${quantity}\nPrecio: S/ ${(price * quantity).toFixed(2)}\n\n¿Está disponible?`)}`, [product.name, color.name, size, quantity, price]);

  const selectColor = (id: string) => {
    const next = product.colors.find((item) => item.id === id);
    if (!next) return;
    setColorId(id);
    setImage(next.images[0]);
    setSize(next.sizes.find((item) => item.status !== "sold-out")?.name ?? "M");
  };

  return <>
    <section className="product-experience">
      <div className="product-gallery">
        <div className="product-thumbs">{color.images.map((src, index) => <button type="button" className={image === src ? "active" : ""} onClick={() => setImage(src)} key={src}><Image src={src} alt={`${product.name}, vista ${index + 1}`} fill sizes="76px" /></button>)}</div>
        <div className="product-main-image"><Image src={image} alt={product.name} fill priority sizes="(max-width: 767px) 100vw, 55vw" /></div>
      </div>
      <div className="product-info">
        <span>{product.drop} / {product.status}</span><h1>{product.name}</h1><strong>S/ {price.toFixed(2)}</strong><p>{product.shortDescription}</p>
        <small className="variant-stock">{color.stock > 0 ? `${color.stock} unidades configuradas en ${color.name}` : `Agotado en ${color.name}`}</small>
        <div className="variant-block"><label>Color: <b>{color.name}</b></label><div>{product.colors.map((item) => <button type="button" className={item.id === color.id ? "active" : ""} style={{ "--swatch": item.hex } as CSSProperties} onClick={() => selectColor(item.id)} aria-label={item.name} key={item.id} />)}</div></div>
        <div className="size-block"><label>Talla</label><button type="button" className="size-guide-link" onClick={() => setGuideOpen(true)}><Ruler /> Guía de tallas</button><div>{color.sizes.map((item) => <button type="button" className={size === item.name ? "active" : ""} disabled={item.status === "sold-out"} onClick={() => setSize(item.name)} key={item.name}>{item.name}</button>)}</div></div>
        <div className="quantity-block"><label>Cantidad</label><div><button type="button" aria-label="Restar cantidad" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus /></button><span>{quantity}</span><button type="button" aria-label="Sumar cantidad" onClick={() => setQuantity(quantity + 1)}><Plus /></button></div></div>
        <a className="whatsapp-buy" href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle /> Comprar por WhatsApp</a>
        <button type="button" className="cart-buy" onClick={() => addToCart(product, { colorId: color.id, size, quantity, unitPrice: price })}>Agregar al carrito</button>
        <div className="product-accordions"><details open><summary>Detalles de la pieza <ChevronDown /></summary><p>{product.description}</p></details><details><summary>Envíos <ChevronDown /></summary><p>{policies.shipping}</p></details><details><summary>Cambios y devoluciones <ChevronDown /></summary><p>{policies.exchanges}</p></details><details><summary>Métodos de pago <ChevronDown /></summary><p>{policies.payments}</p></details></div>
      </div>
    </section>
    {guideOpen ? <div className="size-guide-modal" role="dialog" aria-modal="true"><button type="button" onClick={() => setGuideOpen(false)} aria-label="Cerrar guía" /><div><button type="button" onClick={() => setGuideOpen(false)}>Cerrar</button><Ruler /><h2>Guía de tallas</h2><p>{SIZE_GUIDE.pendingMessage}</p></div></div> : null}
  </>;
}
