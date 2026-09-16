"use client";

import { ArrowUpRight, Heart } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/data/products";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const [favorite, setFavorite] = useState(false);
  const color = product.colors[0];

  return (
    <article className="drop-card" data-reveal-item onPointerMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); event.currentTarget.style.setProperty("--card-x", `${event.clientX - rect.left}px`); event.currentTarget.style.setProperty("--card-y", `${event.clientY - rect.top}px`); }}>
      <Link href={`/producto/${product.slug}`} className="drop-card-link" aria-label={`Ver ${product.name}`}>
        <div className="drop-card-media">
          {product.badge ? <span className="drop-badge">{product.badge}</span> : null}
          <div className="drop-image-wrap">
            <Image src={color.images[0]} alt={product.name} fill priority={priority} sizes="(max-width: 520px) 92vw, (max-width: 900px) 46vw, 320px" />
          </div>
        </div>
        <div className="drop-card-copy">
          <div className="drop-card-info"><h3>{product.name}</h3><p>{color.name}</p></div>
          <div className="drop-card-bottom"><strong>S/ {product.basePrice.toFixed(2)}</strong><span>Ver pieza <ArrowUpRight /></span></div>
        </div>
      </Link>
      <motion.button type="button" className={`favorite-button ${favorite ? "is-active" : ""}`} onClick={() => setFavorite((value) => !value)} whileTap={{ scale: .82 }} animate={favorite ? { scale: [1, .82, 1.15, 1] } : { scale: 1 }} transition={{ duration: .42 }} aria-label={favorite ? "Quitar de favoritos" : "Añadir a favoritos"}><Heart fill={favorite ? "currentColor" : "none"} /></motion.button>
    </article>
  );
}
