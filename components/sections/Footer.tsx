import { Crown, Instagram, MessageCircle } from "lucide-react";
import Link from "next/link";
import { BrandMark } from "@/components/ui/BrandMark";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { SITE_CONFIG } from "@/data/site";

export function Footer() {
  return <footer className="site-footer">
    <div className="footer-inner">
      <div className="footer-brand-block"><Link href="/" className="footer-brand" aria-label="Boxy Drip, inicio"><BrandMark /></Link><strong>{SITE_CONFIG.claim}</strong><span>{SITE_CONFIG.city} · {SITE_CONFIG.country}</span><p>Streetwear, drops limitados y piezas con presencia.</p></div>
      <div className="footer-column"><strong>Tienda</strong><Link href="/catalogo">Catálogo</Link><Link href="/nuevos">Nuevos</Link><Link href="/drops">Drops</Link><Link href="/catalogo?categoria=Polos">Polos</Link><Link href="/catalogo?categoria=Buzos">Buzos</Link><Link href="/catalogo?categoria=Shorts">Shorts</Link><Link href="/lookbook">Lookbook</Link></div>
      <div className="footer-column"><strong>Ayuda</strong><Link href="/envios">Envíos</Link><Link href="/cambios-y-devoluciones">Cambios y devoluciones</Link><Link href="/preguntas-frecuentes">Preguntas frecuentes</Link><Link href="/metodos-de-pago">Métodos de pago</Link><Link href="/seguimiento">Estado del pedido</Link><Link href="/contacto">Contacto</Link></div>
      <div className="footer-column"><strong>Legal</strong><Link href="/terminos-y-condiciones">Términos y condiciones</Link><Link href="/politica-de-privacidad">Política de privacidad</Link><Link href="/cambios-y-devoluciones">Política de cambios</Link><Link href="/envios">Política de envíos</Link><Link href="/politica-de-cookies">Cookies</Link></div>
      <div className="footer-social"><strong>Contacto</strong><div><a href={SITE_CONFIG.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram /></a><a href={SITE_CONFIG.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok"><span>♪</span></a><a href={`https://wa.me/${SITE_CONFIG.whatsapp}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle /></a></div><a className="footer-contact-link" href={`https://wa.me/${SITE_CONFIG.whatsapp}`} target="_blank" rel="noreferrer">Hablar con Boxy Drip</a></div>
      <div className="footer-newsletter"><strong>Únete al drop</strong><p>Recibe lanzamientos exclusivos y beneficios.</p><NewsletterForm /><small>© 2026 Boxy Drip. Todos los derechos reservados.</small><Crown aria-hidden="true" /></div>
    </div>
    <div className="footer-bottom"><span>© 2026 BOXY DRIP. TODOS LOS DERECHOS RESERVADOS.</span><strong>LO MEJOR DE LA CALLE.</strong></div>
  </footer>;
}
