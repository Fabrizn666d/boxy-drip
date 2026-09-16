import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { drops } from "@/data/site";
export const metadata: Metadata = { title:"Drops | Boxy Drip", description:"Archivo de drops limitados Boxy Drip." };
export default function DropsPage(){const active=drops[0];return <main className="editorial-page"><header className="page-hero"><span>Archivo / 2026</span><h1>Drops</h1><p>Ediciones limitadas.<br /><em>Sin repetición.</em></p></header><section className="drop-archive"><div><Image src={active.campaign} alt={`Campaña ${active.name}`} fill sizes="50vw"/></div><article><span>{active.status} · {active.date}</span><h2>{active.name}</h2><p>{active.productIds.length} piezas de alto impacto, siluetas amplias y disponibilidad hasta agotar stock.</p><Link href="/catalogo">Explorar el drop <ArrowRight/></Link></article></section></main>}
