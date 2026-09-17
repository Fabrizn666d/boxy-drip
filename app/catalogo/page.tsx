import type { Metadata } from "next";
import { CatalogClient } from "@/components/catalog/CatalogClient";

export const metadata: Metadata = { title: "Catálogo | Boxy Drip", description: "Explora las piezas, variantes y drops disponibles de Boxy Drip." };

export default async function CatalogoPage({ searchParams }: { searchParams: Promise<{ categoria?: string; busqueda?: string }> }) {
  const { categoria, busqueda } = await searchParams;
  return <main className="catalog-page"><header className="page-hero"><span>02 / Shop</span><h1>Catálogo</h1><p>Encuentra tu próximo <em>outfit.</em></p></header><CatalogClient key={`${categoria ?? "Todos"}:${busqueda ?? ""}`} initialCategory={categoria} initialQuery={busqueda} /></main>;
}
