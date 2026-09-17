import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { SITE_CONFIG } from "@/data/site";

export const metadata: Metadata = { title: "Mi cuenta | Boxy Drip", description: "Consulta tu selección y coordina tus pedidos con Boxy Drip." };

export default function CuentaPage() {
  return <main><header className="page-hero"><span>Tu espacio / Boxy Drip</span><h1>Mi cuenta</h1><p>Tu selección, tus pedidos, tu próxima pieza.</p></header><section className="account-actions"><article><ShoppingBag /><h2>Tu selección</h2><p>El carrito se conserva en este dispositivo. Revísalo y coordina tu pedido con el equipo.</p><Link href="/carrito">Ver mi carrito →</Link></article><article><MessageCircle /><h2>Tus pedidos</h2><p>Por ahora no necesitas una cuenta para comprar. Consulta el estado de tu pedido directamente con Boxy Drip.</p><a href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent("Hola Boxy Drip, quiero consultar el estado de mi pedido.")}`} target="_blank" rel="noreferrer">Consultar por WhatsApp →</a></article></section></main>;
}
