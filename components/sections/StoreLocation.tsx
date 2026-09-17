import Image from "next/image";
import { ArrowRight, Crown, Headphones, MapPin, MessageCircle, Navigation } from "lucide-react";
import { SITE_CONFIG, STORE_LOCATION } from "@/data/site";

export function StoreLocation() {
  const { mapEmbedUrl, mapsUrl } = STORE_LOCATION;

  return <section id="tienda" className="bd-location" aria-labelledby="location-title">
    <Image className="bd-location-background" src="/boxy/location-background-v2.png" alt="" fill sizes="100vw" />
    <div className="bd-location-overlay" />
    <div className="bd-location-grain" aria-hidden="true" />
    <div className="bd-location-shell">
      <div className="bd-location-brandline" aria-hidden="true"><Crown /><span>Boxy Drip</span><i /><small>Streetwear&nbsp;&nbsp;//&nbsp;&nbsp;Ica, Perú</small></div>
      <div className="bd-location-info" data-reveal="left">
        <span className="bd-section-kicker"><i />Tienda física</span>
        <h2 id="location-title">Visita<br /><em>Boxy Drip</em></h2>
        <p className="bd-location-lead">Ven a conocer Boxy Drip en persona. Descubre nuevos drops, pruébate tus piezas favoritas y vive la esencia streetwear de la marca en Ica.</p>
        <div className="bd-location-details">
          <div><MapPin /><span><small>Ubicación</small><strong>{STORE_LOCATION.city}, {SITE_CONFIG.country}</strong></span></div>
          <div><Headphones /><span><small>Atención y coordinación</small><strong>Por WhatsApp</strong></span></div>
          <div className="bd-location-phone"><MessageCircle /><span><small>Consultas y pedidos</small><strong>986 176 298</strong></span></div>
        </div>
        <div className="bd-location-actions">
          <a className="bd-button bd-button-primary" href={`https://wa.me/${SITE_CONFIG.whatsapp}`} target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp <ArrowRight /></a>
          <a className="bd-button bd-button-secondary" href={mapsUrl} target="_blank" rel="noreferrer"><Navigation /> Cómo llegar <ArrowRight /></a>
        </div>
        <p className="bd-location-signoff">Más que ropa <i /> una comunidad real</p>
      </div>
      <div className="bd-location-map" data-reveal="right" data-native-cursor>
        <iframe title="Ubicación exacta de Boxy Drip en Ica, Perú" src={mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </div>
      <div className="bd-location-coordinates" aria-hidden="true"><span>-14.0171901° S · -75.7569767° W</span><i /><span>Ica, Perú</span></div>
    </div>
  </section>;
}
