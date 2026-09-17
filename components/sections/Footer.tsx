import { ExternalLink, FileText, Instagram, MapPin } from "lucide-react";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { BrandMark } from "@/components/ui/BrandMark";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { SITE_CONFIG } from "@/data/site";

export function Footer() {
  const whatsapp = `https://wa.me/${SITE_CONFIG.whatsapp}`;
  return <footer id="footer" className="site-footer footer-reference">
    <div className="footer-atmosphere" aria-hidden="true"><span>DRIP TODAY.<br />MOVE DIFFERENT.</span><span>GOOD CLOTHES.<br />BETTER PEOPLE.</span></div>
    <TrustStrip />
    <div className="footer-inner">
      <div className="footer-brand-block"><a href="#inicio" className="footer-brand" aria-label="Boxy Drip, inicio"><BrandMark /></a><p>Más que ropa,<br />es actitud.</p><span className="footer-city"><MapPin aria-hidden="true" />{SITE_CONFIG.city}, {SITE_CONFIG.country}</span></div>
      <div className="footer-column"><strong>Tienda</strong><a href="#inicio">Inicio</a><a href="#productos">Catálogo</a><a href="#productos">Nuevos</a><a href="#productos">Drops</a><a href="#inicio">Nosotros</a></div>
      <div className="footer-column"><strong>Ayuda</strong><a href={`${whatsapp}?text=${encodeURIComponent("Hola Boxy Drip, tengo una pregunta sobre sus productos.")}`} target="_blank" rel="noreferrer">Preguntas frecuentes</a><a href={`${whatsapp}?text=${encodeURIComponent("Hola Boxy Drip, quisiera consultar por un cambio o devolución.")}`} target="_blank" rel="noreferrer">Cambios y devoluciones</a><a href={`${whatsapp}?text=${encodeURIComponent("Hola Boxy Drip, quisiera consultar por los envíos.")}`} target="_blank" rel="noreferrer">Envíos</a><a href={`${whatsapp}?text=${encodeURIComponent("Hola Boxy Drip, necesito ayuda para elegir mi talla.")}`} target="_blank" rel="noreferrer">Guía de tallas</a><a href={whatsapp} target="_blank" rel="noreferrer">Contáctanos</a></div>
      <div className="footer-column footer-legal"><strong>Legal</strong><a href={`${whatsapp}?text=${encodeURIComponent("Hola Boxy Drip, quisiera consultar sus términos y condiciones.")}`} target="_blank" rel="noreferrer">Términos y condiciones</a><a href={`${whatsapp}?text=${encodeURIComponent("Hola Boxy Drip, quisiera consultar la política de privacidad.")}`} target="_blank" rel="noreferrer">Política de privacidad</a><a href={`${whatsapp}?text=${encodeURIComponent("Hola Boxy Drip, quisiera consultar la política de envíos.")}`} target="_blank" rel="noreferrer">Política de envíos</a><a className="footer-claims" href={`${whatsapp}?text=${encodeURIComponent("Hola Boxy Drip, quisiera solicitar acceso al libro de reclamaciones.")}`} target="_blank" rel="noreferrer"><FileText aria-hidden="true" />Libro de reclamaciones</a></div>
      <div className="footer-connect"><strong>Síguenos</strong>
        <div className="footer-social-list"><a href={SITE_CONFIG.instagram} target="_blank" rel="noreferrer" aria-label="Instagram de Boxy Drip"><Instagram aria-hidden="true" /><span>@boxy_drip</span></a><a href={SITE_CONFIG.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok de Boxy Drip"><TikTokIcon /><span>@boxy_drip</span></a><a href={whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp de Boxy Drip: 986 176 298"><WhatsAppIcon /><span>986 176 298</span></a></div>
      </div>
      <div className="footer-newsletter"><strong>Newsletter</strong><p>Entérate primero de nuevos drops,<br />ofertas y más.</p><NewsletterForm /><small>Buenas vibras. Mejores drops.</small></div>
    </div>
    <div className="footer-bottom-wrap"><div className="footer-bottom"><span>© 2026 Boxy Drip. Todos los derechos reservados.</span><div className="footer-signoff"><span>Ica · Perú</span><strong>DRIP TODAY. MOVE DIFFERENT.</strong></div><a className="footer-credit" href="https://wilostudio.site" target="_blank" rel="noopener noreferrer" aria-label="Desarrollado por WILO STUDIO, visitar sitio en una nueva pestaña">Desarrollado por <span><b>WILO</b> STUDIO</span><ExternalLink aria-hidden="true" /></a></div></div>
  </footer>;
}

function WhatsAppIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.5L3 21l1.6-4.8a8.5 8.5 0 1 1 15.9-4.4Z" /><path d="M8.3 7.5c-.7.3-1 1.3-.6 2.4 1 2.7 3.2 4.8 5.9 5.7 1 .3 2.1-.1 2.3-.8l.3-1-2.6-1.3-.9 1c-1.5-.7-2.6-1.8-3.2-3.2l.9-1-1.2-2.3Z" /></svg>;
}

function TikTokIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 3h3.1c.3 2.2 1.5 3.6 3.9 3.9v3.2a8.4 8.4 0 0 1-4-1.4v7.2a6 6 0 1 1-6.9-5.9v3.3a2.8 2.8 0 1 0 3.9 2.6V3Z" /></svg>;
}
