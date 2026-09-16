import { MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/data/site";

export function WhatsAppFloat() { return <a className="whatsapp-float" href={`https://wa.me/${SITE_CONFIG.whatsapp}`} target="_blank" rel="noreferrer" aria-label="Escríbenos por WhatsApp"><MessageCircle /><span>Escríbenos</span></a>; }
