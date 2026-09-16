import type { Metadata } from "next";
import Image from "next/image";
export const metadata: Metadata = { title:"Lookbook | Boxy Drip", description:"Street gallery y campañas de Boxy Drip." };
const images=["/models/hero-emotion-campaign-v1.png","/campaign-artwork/streetwear-night.png","/campaign-artwork/stride-campaign.png","/campaign-artwork/sunglasses-campaign.png","/campaign-artwork/brand-triptych.png"];
export default function LookbookPage(){return <main className="lookbook-page"><header className="page-hero"><span>Street gallery / 006</span><h1>Lookbook</h1><p>Ropa en contexto.<br /><em>La calle en movimiento.</em></p></header><section className="lookbook-route-grid">{images.map((src,index)=><figure key={src}><Image src={src} alt={`Editorial Boxy Drip ${index+1}`} fill sizes="(max-width:767px) 100vw, 45vw"/></figure>)}</section></main>}
