import type { Metadata } from "next";
import { ProductCard } from "@/components/ui/ProductCard";
import { newProducts } from "@/data/products";
export const metadata: Metadata = { title:"Nuevos | Boxy Drip", description:"Los ingresos más recientes de Boxy Drip." };
export default function NuevosPage(){return <main className="listing-page"><header className="page-hero"><span>Recién llegados</span><h1>Nuevos</h1><p>Las piezas que acaban<br /><em>de tocar la calle.</em></p></header><div className="catalog-grid listing-grid">{newProducts.map((product)=><ProductCard product={product} key={product.id}/>)}</div></main>}
