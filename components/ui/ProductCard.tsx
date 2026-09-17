"use client";

import { ArrowUpRight, Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { PRODUCT_PRICE_LABEL, type Product } from "@/data/products";
import { useStore } from "@/components/providers/StoreProvider";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const [favorite, setFavorite] = useState(false);
  const { openProduct } = useStore();
  const color = product.colors[0];
  const quickSize = color.sizes.find((size) => size.status !== "sold-out")?.name;

  return (
    <article className="drop-card" data-reveal-item onPointerMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); event.currentTarget.style.setProperty("--card-x", `${event.clientX - rect.left}px`); event.currentTarget.style.setProperty("--card-y", `${event.clientY - rect.top}px`); }}>
      <button type="button" className="drop-card-link product-card-open" aria-label={`Ver detalles de ${product.name}`} onClick={() => openProduct(product)}>
        <div className="drop-card-media">
          {product.badge ? <span className="drop-badge">{product.badge}</span> : null}
          <div className={`drop-image-wrap ${product.category === "Shorts" && color.images[0].includes("campaign") ? "is-campaign-crop" : ""}`}>
            <Image src={color.images[0]} alt={product.name} fill preload={priority} sizes="(max-width: 520px) 82vw, (max-width: 900px) 46vw, 25vw" />
          </div>
        </div>
        <div className="drop-card-copy">
          <div className="drop-card-info"><h3>{product.name}</h3><p>{color.name}</p></div>
          <div className="drop-card-bottom"><strong className="private-price">{PRODUCT_PRICE_LABEL}</strong><span>Ver pieza <ArrowUpRight /></span></div>
        </div>
      </button>
      <motion.button type="button" aria-pressed={favorite} className={`favorite-button ${favorite ? "is-active" : ""}`} onClick={() => setFavorite((value) => !value)} whileTap={{ scale: .82 }} animate={favorite ? { scale: [1, .82, 1.15, 1] } : { scale: 1 }} transition={{ duration: .42 }} aria-label={favorite ? "Quitar de favoritos" : "Añadir a favoritos"}><Heart fill={favorite ? "currentColor" : "none"} /></motion.button>
      {quickSize ? <button type="button" className="quick-add-button" disabled={product.status === "sold-out"} onClick={() => openProduct(product)} aria-label={`Elegir talla y comprar ${product.name}`}><ShoppingBag /><span>Elegir talla</span></button> : null}
    </article>
  );
}
