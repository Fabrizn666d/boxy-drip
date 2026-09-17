"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { PRODUCT_PRICE_LABEL, products } from "@/data/products";
import { useStore } from "@/components/providers/StoreProvider";
import { useDialog } from "@/components/ui/useDialog";

type SearchOverlayProps = { open: boolean; onClose: () => void };

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const { openProduct } = useStore();
  const dialogRef = useDialog(open, onClose);
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const results = useMemo(() => normalized ? products.filter((product) => [product.name, product.category, product.description, product.drop, ...product.tags, ...product.colors.map((color) => color.name)].join(" ").toLowerCase().includes(normalized)) : products, [normalized]);
  const showProduct = (product: (typeof products)[number]) => {
    onClose();
    window.setTimeout(() => openProduct(product), 0);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div ref={dialogRef} tabIndex={-1} className="search-overlay" role="dialog" aria-modal="true" aria-label="Buscar productos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" className="search-close" onClick={onClose} aria-label="Cerrar búsqueda"><X /></button>
          <motion.div className="search-panel" initial={{ y: -24 }} animate={{ y: 0 }} exit={{ y: -18 }} transition={{ duration: .45, ease: [0.16,1,.3,1] }}>
            <span className="search-eyebrow">Buscar en Boxy Drip</span>
            <form className="search-input-wrap" onSubmit={(event) => { event.preventDefault(); if (results[0]) showProduct(results[0]); }}>
              <Search /><label className="sr-only" htmlFor="site-search">Buscar productos</label><input id="site-search" autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="¿Qué estás buscando?" />
              <button type="submit" aria-label="Ver búsqueda en el catálogo"><ArrowUpRight /></button>
            </form>
            <div className="search-results">
              <span>{normalized ? `${results.length} resultados` : "Piezas destacadas"}</span>
              {results.map((product) => <button type="button" onClick={() => showProduct(product)} key={product.slug}><div><strong>{product.name}</strong><small>{product.category} · {product.colors[0].name}</small></div><b>{PRODUCT_PRICE_LABEL}</b><ArrowUpRight /></button>)}
              {!results.length ? <p>No encontramos esa pieza. Prueba con “polo”, “negro” o “stride”.</p> : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
