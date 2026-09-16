import type { Metadata } from "next";
import { CatalogClient } from "@/components/catalog/CatalogClient";

export const metadata: Metadata = { title: "Catálogo | Boxy Drip", description: "Explora las piezas, variantes y drops disponibles de Boxy Drip." };

export default async function CatalogoPage({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  const { categoria } = await searchParams;
  return <main className="catalog-page"><header className="page-hero"><span>02 / Shop</span><h1>Catálogo</h1><p>Encuentra tu<br /><em>próxima pieza.</em></p></header><CatalogClient initialCategory={categoria} /></main>;
}
