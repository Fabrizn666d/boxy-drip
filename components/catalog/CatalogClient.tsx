"use client";

import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ui/ProductCard";
import { products, type ProductCategory } from "@/data/products";
import { useDialog } from "@/components/ui/useDialog";

const categories: Array<"Todos" | ProductCategory> = ["Todos", "Polos", "Buzos", "Shorts", "Accesorios"];
const colors = ["Todos", ...Array.from(new Set(products.flatMap((product) => product.colors.map((color) => color.name))))];
const sizes = ["Todas", ...Array.from(new Set(products.flatMap((product) => product.colors.flatMap((color) => color.sizes.map((size) => size.name)))))];
const availability = [["Todos", "Todos"], ["available", "En stock"], ["low-stock", "Últimas unidades"], ["preorder", "Preventa"]] as const;

type FilterPanelProps = {
  category: (typeof categories)[number]; setCategory: (value: (typeof categories)[number]) => void;
  size: string; setSize: (value: string) => void;
  color: string; setColor: (value: string) => void;
  status: string; setStatus: (value: string) => void;
};

function FilterPanel({ category, setCategory, size, setSize, color, setColor, status, setStatus }: FilterPanelProps) {
  return <div className="catalog-filter-groups">
    <fieldset><legend>Categoría</legend><div>{categories.map((item) => <button className={category === item ? "active" : ""} onClick={() => setCategory(item)} type="button" key={item}>{item}</button>)}</div></fieldset>
    <fieldset><legend>Talla</legend><div>{sizes.map((item) => <button className={size === item ? "active" : ""} onClick={() => setSize(item)} type="button" key={item}>{item}</button>)}</div></fieldset>
    <fieldset><legend>Color</legend><div>{colors.map((item) => <button className={color === item ? "active" : ""} onClick={() => setColor(item)} type="button" key={item}>{item}</button>)}</div></fieldset>
    <fieldset><legend>Disponibilidad</legend><div>{availability.map(([value, label]) => <button className={status === value ? "active" : ""} onClick={() => setStatus(value)} type="button" key={value}>{label}</button>)}</div></fieldset>
  </div>;
}

export function CatalogClient({ initialCategory = "Todos", initialQuery = "" }: { initialCategory?: string; initialQuery?: string }) {
  const [category, setCategory] = useState<(typeof categories)[number]>(categories.includes(initialCategory as (typeof categories)[number]) ? initialCategory as (typeof categories)[number] : "Todos");
  const [query, setQuery] = useState(initialQuery);
  const [size, setSize] = useState("Todas");
  const [color, setColor] = useState("Todos");
  const [status, setStatus] = useState("Todos");
  const [sort, setSort] = useState("new");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const dialogRef = useDialog(filtersOpen, () => setFiltersOpen(false));

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const list = products.filter((product) => {
      const searchable = [product.name, product.category, product.description, product.drop, ...product.tags, ...product.colors.map((item) => item.name)].join(" ").toLowerCase();
      return (!term || searchable.includes(term)) && (category === "Todos" || product.category === category) && (status === "Todos" || product.status === status) && product.colors.some((item) => (color === "Todos" || item.name === color) && (size === "Todas" || item.sizes.some((variantSize) => variantSize.name === size && variantSize.status !== "sold-out")));
    });
    return [...list].sort((a, b) => sort === "featured" ? Number(b.featured) - Number(a.featured) : Number(b.isNew) - Number(a.isNew));
  }, [category, size, color, status, sort, query]);

  const reset = () => { setCategory("Todos"); setQuery(""); setSize("Todas"); setColor("Todos"); setStatus("Todos"); };
  const panelProps = { category, setCategory, size, setSize, color, setColor, status, setStatus };

  return <section className="catalog-layout">
    <div className="catalog-controls">
      <div className="catalog-control-row">
        <label className="catalog-search"><Search /><span className="sr-only">Buscar en el catálogo</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre, color o colección" /></label>
        <button className="catalog-mobile-filter" type="button" onClick={() => setFiltersOpen(true)}><SlidersHorizontal /> Filtros</button>
        <label className="catalog-sort"><span>Ordenar</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="new">Más nuevos</option><option value="featured">Destacados</option></select></label>
      </div>
      <div className="catalog-desktop-filters"><FilterPanel {...panelProps} /></div>
      <div className="catalog-summary"><span>{filtered.length} {filtered.length === 1 ? "pieza" : "piezas"}</span><button type="button" onClick={reset}><RotateCcw /> Limpiar filtros</button></div>
    </div>

    {filtered.length ? <div className="catalog-grid catalog-product-grid">{filtered.map((product) => <ProductCard product={product} key={product.id} />)}</div> : <div className="catalog-empty"><div><strong>Sin coincidencias</strong><p>Prueba otra búsqueda o limpia los filtros.</p><button type="button" onClick={reset}>Ver todas las piezas</button></div></div>}

    <AnimatePresence>
      {filtersOpen ? <div ref={dialogRef} tabIndex={-1} className="catalog-filter-layer" role="dialog" aria-modal="true" aria-label="Filtros del catálogo">
        <motion.button className="catalog-filter-backdrop" aria-label="Cerrar filtros" onClick={() => setFiltersOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
        <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: .34, ease: [0.16, 1, 0.3, 1] }}>
          <header><div><span>Refina tu búsqueda</span><h2>Filtros</h2></div><button type="button" onClick={() => setFiltersOpen(false)} aria-label="Cerrar filtros"><X /></button></header>
          <FilterPanel {...panelProps} />
          <footer><button type="button" onClick={reset}><RotateCcw /> Limpiar</button><button type="button" onClick={() => setFiltersOpen(false)}>Ver {filtered.length} piezas</button></footer>
        </motion.aside>
      </div> : null}
    </AnimatePresence>
  </section>;
}
