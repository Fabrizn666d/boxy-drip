"use client";

import { ChevronDown, ChevronLeft, ChevronRight, MessageCircle, Minus, Plus, Ruler } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState, type CSSProperties } from "react";
import { useStore } from "@/components/providers/StoreProvider";
import { PRODUCT_PRICE_LABEL, type Product } from "@/data/products";
import { policies, SITE_CONFIG, SIZE_GUIDE } from "@/data/site";
import { useDialog } from "@/components/ui/useDialog";

export function ProductExperience({ product }: { product: Product }) {
  const [colorId, setColorId] = useState(product.colors[0].id);
  const color = product.colors.find((item) => item.id === colorId) ?? product.colors[0];
  const [size, setSize] = useState(color.sizes.find((item) => item.status !== "sold-out")?.name ?? "");
  const [quantity, setQuantity] = useState(1);
  const [image, setImage] = useState(color.images[0]);
  const [guideOpen, setGuideOpen] = useState(false);
  const guideRef = useDialog(guideOpen, () => setGuideOpen(false));
  const swipeStart = useRef<number | null>(null);
  const { addToCart } = useStore();
  const whatsappUrl = useMemo(() => `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(`Hola Boxy Drip 👋 Estoy interesado en ${product.name}, talla ${size || "por confirmar"}.\nColor: ${color.name}\nCantidad: ${quantity}\n¿Me confirmas el precio al privado?\nEnvío y disponibilidad por confirmar.`)}`, [product.name, color.name, size, quantity]);

  const selectColor = (id: string) => {
    const next = product.colors.find((item) => item.id === id);
    if (!next) return;
    setColorId(id);
    setImage(next.images[0]);
    setSize(next.sizes.find((item) => item.status !== "sold-out")?.name ?? "");
  };

  const showImage = (direction: number) => {
    const current = color.images.indexOf(image);
    const next = (current + direction + color.images.length) % color.images.length;
    setImage(color.images[next]);
  };

  return <>
    <nav className="product-breadcrumb" aria-label="Migas de pan"><Link href="/">Inicio</Link><span>/</span><Link href="/catalogo">Catálogo</Link><span>/</span><Link href={`/catalogo?categoria=${product.category}`}>{product.category}</Link><span>/</span><b>{product.name}</b></nav>
    <section className="product-experience">
      <div className={`product-gallery ${color.images.length === 1 ? "single-image" : ""}`}>
        <div className="product-thumbs">{color.images.map((src, index) => <button type="button" className={image === src ? "active" : ""} onClick={() => setImage(src)} key={src}><Image src={src} alt={`${product.name}, vista ${index + 1}`} fill sizes="76px" /></button>)}</div>
        <div
          className="product-main-image"
          onPointerDown={(event) => { swipeStart.current = event.clientX; }}
          onPointerCancel={() => { swipeStart.current = null; }}
          onPointerUp={(event) => { if (swipeStart.current === null) return; const distance = event.clientX - swipeStart.current; if (Math.abs(distance) > 42) showImage(distance > 0 ? -1 : 1); swipeStart.current = null; }}
        >
          <Image src={image} alt={product.name} fill preload sizes="(max-width: 767px) 100vw, 55vw" />
          {color.images.length > 1 ? <><button className="gallery-arrow gallery-arrow-left" type="button" aria-label="Imagen anterior" onClick={() => showImage(-1)}><ChevronLeft /></button><button className="gallery-arrow gallery-arrow-right" type="button" aria-label="Imagen siguiente" onClick={() => showImage(1)}><ChevronRight /></button><span className="gallery-counter">{color.images.indexOf(image) + 1} / {color.images.length}</span></> : null}
        </div>
      </div>
      <div className="product-info">
        <div className="product-badges"><span>{product.drop}</span>{product.badge ? <span>{product.badge}</span> : null}</div><h1>{product.name}</h1><strong>{PRODUCT_PRICE_LABEL}</strong><p>{product.shortDescription}</p>
        <small className="variant-stock">{product.status === "sold-out" ? "Agotado" : product.status === "preorder" ? "Consulta disponibilidad de preventa por WhatsApp" : "Disponibilidad final a confirmar al coordinar tu pedido"}</small>
        <div className="variant-block"><label>Color: <b>{color.name}</b></label><div>{product.colors.map((item) => <button type="button" aria-pressed={item.id === color.id} className={item.id === color.id ? "active" : ""} style={{ "--swatch": item.hex } as CSSProperties} onClick={() => selectColor(item.id)} aria-label={item.name} key={item.id} />)}</div></div>
        <div className="size-block"><label>Talla</label><button type="button" className="size-guide-link" onClick={() => setGuideOpen(true)}><Ruler /> Guía de tallas</button><div>{color.sizes.map((item) => <button type="button" aria-pressed={size === item.name} className={size === item.name ? "active" : ""} disabled={item.status === "sold-out"} onClick={() => setSize(item.name)} key={item.name}>{item.name}</button>)}</div>{!color.sizes.length ? <p className="variant-stock">Las tallas oficiales de esta pieza están pendientes. Consúltalas por WhatsApp antes de pedir.</p> : null}</div>
        <div className="quantity-block"><label>Cantidad</label><div><button type="button" aria-label="Restar cantidad" disabled={quantity === 1} onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus /></button><span>{quantity}</span><button type="button" aria-label="Sumar cantidad" disabled={quantity === 99} onClick={() => setQuantity(Math.min(99, quantity + 1))}><Plus /></button></div></div>
        <button type="button" className="cart-buy" disabled={!size || product.status === "sold-out"} onClick={() => addToCart(product, { colorId: color.id, size, quantity })}>{color.sizes.length ? "Agregar al carrito" : "Tallas por confirmar"}</button>
        <a className="whatsapp-buy" href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle /> Comprar por WhatsApp</a>
        <div className="product-accordions"><details open><summary>Detalles de la pieza <ChevronDown /></summary><p>{product.description}</p></details><details><summary>Envíos <ChevronDown /></summary><p>{policies.shipping}</p></details><details><summary>Cambios y devoluciones <ChevronDown /></summary><p>{policies.exchanges}</p></details><details><summary>Métodos de pago <ChevronDown /></summary><p>{policies.payments}</p></details></div>
      </div>
    </section>
    {guideOpen ? <div ref={guideRef} tabIndex={-1} className="size-guide-modal" role="dialog" aria-modal="true" aria-label="Guía de tallas"><button type="button" onClick={() => setGuideOpen(false)} aria-label="Cerrar guía" /><div><button type="button" onClick={() => setGuideOpen(false)}>Cerrar</button><Ruler /><h2>Guía de tallas</h2><p>{SIZE_GUIDE.pendingMessage}</p><a className="bd-button bd-button-primary" href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(`Hola Boxy Drip, necesito ayuda con las medidas de ${product.name}.`)}`} target="_blank" rel="noreferrer">Consultar medidas</a></div></div> : null}
  </>;
}
