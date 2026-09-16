import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductExperience } from "@/components/product/ProductExperience";
import { ProductCard } from "@/components/ui/ProductCard";
import { getProduct, products } from "@/data/products";

export function generateStaticParams() { return products.map((product) => ({ slug: product.slug })); }
export async function generateMetadata({ params }: { params: Promise<{slug:string}> }): Promise<Metadata> { const {slug}=await params; const product=getProduct(slug); return product ? { title:`${product.name} | Boxy Drip`, description:product.shortDescription } : {}; }

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const related = products.filter((item) => item.id !== product.id && (item.category === product.category || item.drop === product.drop || item.tags.some((tag) => product.tags.includes(tag)))).slice(0,3);
  return <main className="product-page"><ProductExperience product={product} /><section className="related-products"><header><span>También te puede gustar</span><h2>Más piezas del drop.</h2></header><div className="catalog-grid">{related.map((item) => <ProductCard product={item} key={item.id} />)}</div></section></main>;
}
