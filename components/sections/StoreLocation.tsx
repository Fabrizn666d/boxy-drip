import { ArrowUpRight, Clock3, MapPin, MessageCircle } from "lucide-react";
import { SITE_CONFIG, STORE_LOCATION } from "@/data/site";

export function StoreLocation() {
  const hasMap = Boolean(STORE_LOCATION.address && STORE_LOCATION.mapsUrl && STORE_LOCATION.mapEmbedUrl);

  return <section className="location-section pointer-reactive" aria-labelledby="location-title">
    <div className="location-shell">
      <div className="location-rule" data-line />
      <div className="location-info" data-reveal="left">
        <span>05 / Location</span>
        <h2 id="location-title">Encuéntranos<br /><em>en la calle.</em></h2>
        <h3>{STORE_LOCATION.name}</h3>
        <p><MapPin /> <span>{STORE_LOCATION.address || "Ubicación de tienda"}<br />{STORE_LOCATION.district ? `${STORE_LOCATION.district} · ` : ""}{STORE_LOCATION.city} · {SITE_CONFIG.country}</span></p>
        <p><Clock3 /> <span>{STORE_LOCATION.schedule}</span></p>
        <div className="location-actions">
          {hasMap ? <a href={STORE_LOCATION.mapsUrl} target="_blank" rel="noreferrer">Cómo llegar <ArrowUpRight /></a> : <span className="location-action-disabled">Cómo llegar · pendiente</span>}
          <a href={`https://wa.me/${SITE_CONFIG.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp <MessageCircle /></a>
        </div>
      </div>
      <div className="location-map" data-reveal="right" data-native-cursor>
        {hasMap ? <iframe title="Ubicación de Boxy Drip" src={STORE_LOCATION.mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /> : <div className="location-map-pending"><span className="map-grid" /><MapPin /><strong>Boxy Drip</strong><p>Ica · Perú</p><small>El mapa se activará al configurar la dirección oficial.</small></div>}
      </div>
    </div>
  </section>;
}
