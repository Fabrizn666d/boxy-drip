import type { Metadata } from "next";
import { ProductCard } from "@/components/ui/ProductCard";
import { newProducts } from "@/data/products";
export const metadata: Metadata = { title:"Nuevos | Boxy Drip", description:"Los ingresos más recientes de Boxy Drip." };
export default function NuevosPage(){return <main className="listing-page"><header className="page-hero page-hero-new"><span>Recién llegados / Drop 006</span><h1>Nuevos Drops</h1><p>Las piezas que acaban <em>de tocar la calle.</em></p><small>El stock final se confirma al coordinar tu pedido.</small></header><section className="listing-section"><header><span>Últimos ingresos</span><h2>Fresh from the street.</h2></header><div className="catalog-grid listing-grid">{newProducts.map((product)=><ProductCard product={product} key={product.id}/>)}</div></section></main>}
