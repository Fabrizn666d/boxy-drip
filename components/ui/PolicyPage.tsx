type PolicySection = { title: string; body: string };

export function PolicyPage({ eyebrow, title, intro, sections }: { eyebrow: string; title: string; intro: string; sections: PolicySection[] }) {
  return <main className="policy-page">
    <header className="page-hero"><span>{eyebrow}</span><h1>{title}</h1><p>{intro}</p></header>
    <article className="policy-shell">
      <aside><span>Boxy Drip / Ica</span><strong>Información de la tienda</strong><p>Versión beta · Actualizada en agosto de 2026</p></aside>
      <div>{sections.map((section, index) => <section key={section.title}><span>{String(index + 1).padStart(2,"0")}</span><div><h2>{section.title}</h2><p>{section.body}</p></div></section>)}</div>
    </article>
  </main>;
}
