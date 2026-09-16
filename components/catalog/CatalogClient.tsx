"use client";

import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ui/ProductCard";
import { products, type ProductCategory } from "@/data/products";

const categories: Array<"Todos" | ProductCategory> = ["Todos", "Polos", "Buzos", "Shorts", "Accesorios"];
const colors = ["Todos", ...Array.from(new Set(products.flatMap((product) => product.colors.map((color) => color.name))))];
const productPrices = products.flatMap((product) => [product.basePrice, ...product.colors.flatMap((color) => color.price ?? [])]);
const minProductPrice = Math.floor(Math.min(...productPrices) / 10) * 10;
const maxProductPrice = Math.ceil(Math.max(...productPrices) / 10) * 10;

export function CatalogClient({ initialCategory = "Todos" }: { initialCategory?: string }) {
  const [category, setCategory] = useState<(typeof categories)[number]>(categories.some((item) => item === initialCategory) ? initialCategory as (typeof categories)[number] : "Todos");
  const [size, setSize] = useState("Todas");
  const [color, setColor] = useState("Todos");
  const [status, setStatus] = useState("Todos");
  const [sort, setSort] = useState("new");
  const [maxPrice, setMaxPrice] = useState(maxProductPrice);

  const filtered = useMemo(() => {
    const list = products.filter((product) => (category === "Todos" || product.category === category) && product.basePrice <= maxPrice && (status === "Todos" || product.status === status) && (color === "Todos" || product.colors.some((item) => item.name === color)) && (size === "Todas" || product.colors.some((item) => item.sizes.some((variantSize) => variantSize.name === size && variantSize.status !== "sold-out"))));
    return [...list].sort((a,b) => sort === "low" ? a.basePrice-b.basePrice : sort === "high" ? b.basePrice-a.basePrice : sort === "featured" ? Number(b.featured)-Number(a.featured) : Number(b.isNew)-Number(a.isNew));
  }, [category,size,color,status,sort,maxPrice]);

  return <div className="catalog-layout">
    <aside className="catalog-filters"><header><SlidersHorizontal /> Filtros</header><fieldset><legend>Categoría</legend>{categories.map((item) => <button className={category===item?"active":""} onClick={() => setCategory(item)} type="button" key={item}>{item}</button>)}</fieldset><fieldset><legend>Talla</legend><div>{["Todas","S","M","L","XL"].map((item) => <button className={size===item?"active":""} onClick={() => setSize(item)} type="button" key={item}>{item}</button>)}</div></fieldset><fieldset className="color-filter"><legend>Color</legend>{colors.map((item) => <button className={color===item?"active":""} onClick={() => setColor(item)} type="button" key={item}>{item}</button>)}</fieldset><fieldset><legend>Precio máximo · S/ {maxPrice}</legend><input type="range" min={minProductPrice} max={maxProductPrice} step="10" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} /></fieldset><fieldset><legend>Disponibilidad</legend>{[["Todos","Todos"],["available","En stock"],["low-stock","Últimas unidades"],["preorder","Preventa"]].map(([value,label]) => <button className={status===value?"active":""} onClick={() => setStatus(value)} type="button" key={value}>{label}</button>)}</fieldset></aside>
    <section className="catalog-results"><div className="catalog-toolbar"><span>{filtered.length} piezas</span><label>Ordenar <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="new">Más nuevos</option><option value="low">Precio menor</option><option value="high">Precio mayor</option><option value="featured">Destacados</option></select></label></div>{filtered.length ? <div className="catalog-grid">{filtered.map((product) => <ProductCard product={product} key={product.id} />)}</div> : <div className="catalog-empty">No hay piezas que coincidan con estos filtros.</div>}</section>
  </div>;
}
