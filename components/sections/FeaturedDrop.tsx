import { ProductCard } from "@/components/ui/ProductCard";
import { featuredProducts } from "@/data/products";

export function FeaturedDrop() {
  return (
    <section id="productos" className="bd-drop-section" aria-labelledby="featured-title">
      <div className="bd-section-shell">
        <header className="bd-drop-heading" data-reveal="up">
          <span>Edición limitada</span>
          <h2 id="featured-title">Piezas del <em>nuevo drop</em></h2>
          <p>Diseños que hablan por ti. Explora nuestra nueva colección y encuentra tu próxima prenda favorita.</p>
        </header>
        <div className="bd-products-grid" data-stagger>
          {featuredProducts.map((product) => <ProductCard product={product} key={product.id} />)}
        </div>
      </div>
    </section>
  );
}
