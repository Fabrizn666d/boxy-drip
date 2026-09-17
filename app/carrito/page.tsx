import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart/CartPageClient";

export const metadata: Metadata = { title: "Carrito | Boxy Drip", description: "Revisa tu selección y finaliza tu pedido de Boxy Drip por WhatsApp." };

export default function CarritoPage() { return <main className="cart-page"><CartPageClient /></main>; }
