"use client";

import { MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/data/site";
import { useStore } from "@/components/providers/StoreProvider";

export function WhatsAppFloat() {
  const { cartOpen, selectedProduct } = useStore();
  if (cartOpen || selectedProduct) return null;
  return <a className="whatsapp-float" href={`https://wa.me/${SITE_CONFIG.whatsapp}`} target="_blank" rel="noreferrer" aria-label="Escríbenos por WhatsApp"><MessageCircle /><span>Escríbenos</span></a>;
}
