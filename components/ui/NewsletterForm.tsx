"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { SITE_CONFIG } from "@/data/site";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  return (
    <form className="newsletter-form" action={`https://wa.me/${SITE_CONFIG.whatsapp}`} method="get" target="_blank">
      <label className="sr-only" htmlFor="newsletter-email">Tu correo electrónico</label>
      <input id="newsletter-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Tu correo electrónico" />
      <input type="hidden" name="text" value={`Hola Boxy Drip, quiero recibir novedades de los drops en ${email.trim()}. ¿Cómo puedo suscribirme?`} />
      <button type="submit" aria-label="Solicitar suscripción por WhatsApp"><ArrowRight /></button>
    </form>
  );
}
