import { ArrowRight, ArrowUpRight, CreditCard, Headphones, MapPin, PackageCheck, RefreshCcw, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { ProductCard } from "@/components/ui/ProductCard";
import { categories, SITE_CONFIG, STORE_LOCATION } from "@/data/site";
import { newProducts } from "@/data/products";

export function HomeSections() {
  return <>
    <section className="preorder-campaign">
      <div className="preorder-art"><Image src="/campaign-artwork/short-drip-fire-campaign.png" alt="Campaña de preventa Drop 006" fill sizes="(max-width: 767px) 100vw, 55vw" /></div>
      <div className="preorder-copy"><span>Campaign / Preventa</span><small>Drop 006</small><h2>Stock limitado.<br />Cuando se acaba,<br /><em>se acaba.</em></h2><p>Piezas exclusivas · edición limitada</p><Link href="/drops">Ver el drop <ArrowRight /></Link></div>
    </section>

    <section className="new-arrivals beta-shell"><header className="editorial-heading"><span>02 / Recién llegados</span><h2>Nuevos<br /><em>ingresos</em></h2><Link href="/nuevos">Ver todos <ArrowRight /></Link></header><div className="arrivals-grid">{newProducts.slice(0,4).map((product) => <ProductCard product={product} key={`new-${product.id}`} />)}</div></section>

    <section className="category-section beta-shell"><header className="wide-heading"><span>Explora Boxy</span><h2>Compra por categoría.</h2></header><div className="category-grid">{categories.map((category) => <Link href={category.href} className="category-panel" key={category.name}><Image src={category.image} alt="" fill sizes="(max-width: 767px) 100vw, 25vw" /><span /><div><small>{String(category.count).padStart(2,"0")} piezas</small><strong>{category.name}</strong><ArrowUpRight /></div></Link>)}</div></section>

    <section className="brand-story beta-shell"><div className="brand-story-copy"><span>03 / The brand</span><h2>No vendemos<br />solo ropa.<br /><em>Vestimos la calle.</em></h2><p>Boxy Drip nace desde Ica con una idea simple: traer piezas streetwear que tengan presencia de verdad. Drops limitados y diseños para quienes no quieren vestirse como todos.</p><div className="brand-tags"><b>Drop culture</b><b>Streetwear</b><b>Limited pieces</b><b>Ica / Perú</b></div><Link href="/nosotros">Conoce la marca <ArrowRight /></Link></div><div className="brand-story-art"><Image src="/models/hero-emotion-campaign-v1.png" alt="Modelo Boxy Drip en una calle nocturna" fill sizes="(max-width: 767px) 100vw, 48vw" /></div></section>

    <section className="lookbook-section beta-shell"><header className="wide-heading"><span>Street gallery</span><h2>Lookbook / 006</h2><Link href="/lookbook">Ver lookbook completo <ArrowUpRight /></Link></header><div className="lookbook-grid"><div className="lookbook-main"><Image src="/models/hero-emotion-campaign-v1.png" alt="Look urbano Emotion Angel" fill sizes="70vw" /></div><div><Image src="/campaign-artwork/streetwear-night.png" alt="Campaña streetwear nocturna" fill sizes="30vw" /></div><div><Image src="/campaign-artwork/stride-campaign.png" alt="Campaña Polo Stride" fill sizes="30vw" /></div></div></section>

    <section className="store-section beta-shell"><div className="store-copy"><span>04 / Find us</span><h2>Visítanos<br /><em>en tienda.</em></h2><h3>{STORE_LOCATION.name}</h3><p><MapPin /> {STORE_LOCATION.city}, {SITE_CONFIG.country}</p><div><a href={STORE_LOCATION.mapsUrl} target="_blank" rel="noreferrer">Cómo llegar <ArrowUpRight /></a><a href={`https://wa.me/${SITE_CONFIG.whatsapp}`} target="_blank" rel="noreferrer">Escríbenos <ArrowUpRight /></a></div></div><div className="store-map-placeholder"><MapPin /><strong>Boxy Drip · Ica</strong><p>Ubicación exacta disponible en Google Maps.</p></div></section>

    <section className="secure-section beta-shell"><header><span>Compra sin vueltas.</span><h2>Todo claro desde el inicio.</h2></header><div>{[{icon:PackageCheck,title:"Envíos",copy:"Envíos coordinados a todo Ica"},{icon:CreditCard,title:"Pagos",copy:"Confirmación directa y compra segura"},{icon:RefreshCcw,title:"Cambios",copy:"Cambios según nuestras políticas"},{icon:Headphones,title:"Atención",copy:"Te respondemos directamente"}].map(({icon:Icon,title,copy}) => <article key={title}><Icon /><strong>{title}</strong><p>{copy}</p></article>)}</div></section>

    <section className="newsletter-section"><ShieldCheck /><div><span>Únete al drop</span><h2>No te pierdas<br /><em>el próximo drop.</em></h2><p>Lanzamientos, preventas y piezas limitadas antes que el resto.</p></div><NewsletterForm /></section>
  </>;
}
