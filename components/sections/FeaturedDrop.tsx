import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";
import { featuredProducts } from "@/data/products";

export function FeaturedDrop() {
  return <section id="coleccion" className="beta-products-section" aria-labelledby="featured-title">
    <div className="page-shell home-drop-layout">
      <header className="beta-section-heading" data-reveal="left"><span>01 / Selección actual</span><h2 id="featured-title">Piezas del <em>nuevo drop.</em></h2><p>Cuatro esenciales de silueta amplia. Diseñados para entrar fuerte y quedarse en la memoria.</p><Link href="/catalogo">Ver colección <ArrowRight /></Link></header>
      <div className="beta-product-grid" data-stagger>{featuredProducts.map((product, index) => <ProductCard product={product} priority={index < 2} key={product.id} />)}</div>
    </div>
  </section>;
}
