import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { drops } from "@/data/site";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ui/ProductCard";
export const metadata: Metadata = { title:"Drops | Boxy Drip", description:"Archivo de drops limitados Boxy Drip." };
export default function DropsPage() {
  const active = drops[0];
  const dropProducts = products.filter((product) => active.productIds.some((id) => id === product.id));
  return <main className="editorial-page">
    <header className="page-hero"><span>Archivo / 2026</span><h1>Drops</h1><p>Ediciones limitadas.<br /><em>Sin repetición.</em></p></header>
    <section className="drop-archive"><div><Image src={active.campaign} alt={`Campaña ${active.name}`} fill sizes="(max-width: 760px) 100vw, 52vw" /></div><article><span>Disponible ahora · {active.date}</span><h2>{active.name}</h2><p>{dropProducts.length} piezas de alto impacto, siluetas amplias y gráficas que llevan el lenguaje Boxy Drip al frente.</p><ul><li>Drop culture</li><li>Gráfica protagonista</li><li>Disponibilidad limitada</li></ul><Link href="/catalogo">Explorar el drop <ArrowRight /></Link></article></section>
    <section className="drop-products"><header><span>El drop completo</span><h2>Una selección.<br />Una misma actitud.</h2></header><div className="catalog-grid">{dropProducts.map((product) => <ProductCard product={product} key={product.id} />)}</div></section>
  </main>;
}
