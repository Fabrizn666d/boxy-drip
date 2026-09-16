"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Search, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { getProductPrice, products } from "@/data/products";

type SearchOverlayProps = { open: boolean; onClose: () => void };

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const results = useMemo(() => normalized ? products.filter((product) => [product.name, product.category, product.description, product.drop, ...product.tags, ...product.colors.map((color) => color.name)].join(" ").toLowerCase().includes(normalized)) : products, [normalized]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="search-overlay" role="dialog" aria-modal="true" aria-label="Buscar productos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" className="search-close" onClick={onClose} aria-label="Cerrar búsqueda"><X /></button>
          <motion.div className="search-panel" initial={{ y: -24 }} animate={{ y: 0 }} exit={{ y: -18 }} transition={{ duration: .45, ease: [0.16,1,.3,1] }}>
            <span className="search-eyebrow">Buscar en Boxy Drip</span>
            <label className="search-input-wrap"><Search /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="¿Qué estás buscando?" /></label>
            <div className="search-results">
              <span>{normalized ? `${results.length} resultados` : "Piezas destacadas"}</span>
              {results.map((product) => <Link href={`/producto/${product.slug}`} onClick={onClose} key={product.slug}><div><strong>{product.name}</strong><small>{product.category} · {product.colors[0].name}</small></div><b>S/ {getProductPrice(product).toFixed(2)}</b><ArrowUpRight /></Link>)}
              {!results.length ? <p>No encontramos esa pieza. Prueba con “polo”, “negro” o “stride”.</p> : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
