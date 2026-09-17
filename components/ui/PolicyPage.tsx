import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/data/site";

type PolicySection = { title: string; body: string };

export function PolicyPage({ eyebrow, title, intro, sections }: { eyebrow: string; title: string; intro: string; sections: PolicySection[] }) {
  return <main className="policy-page">
    <header className="page-hero"><span>{eyebrow}</span><h1>{title}</h1><p>{intro}</p></header>
    <article className="policy-shell">
      <aside><span>Boxy Drip / Ica</span><strong>Información de la tienda</strong><p>Confirma los detalles de tu pedido con el equipo antes de comprar.</p><a className="policy-contact" href={`https://wa.me/${SITE_CONFIG.whatsapp}`} target="_blank" rel="noreferrer"><MessageCircle />986 176 298</a><Link className="policy-catalog" href="/catalogo">Explorar el catálogo →</Link></aside>
      <div>{sections.map((section, index) => <section key={section.title}><span>{String(index + 1).padStart(2,"0")}</span><div><h2>{section.title}</h2><p>{section.body}</p></div></section>)}</div>
    </article>
  </main>;
}
