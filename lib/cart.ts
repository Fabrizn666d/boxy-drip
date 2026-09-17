import type { CartItem } from "@/components/providers/StoreProvider";
import { SITE_CONFIG } from "@/data/site";

export function getCartWhatsAppUrl(cart: readonly CartItem[]) {
  const message = ["Hola Boxy Drip 👋", "Quiero coordinar este pedido:", "", ...cart.flatMap((item) => [`${item.quantity}x ${item.product.name}`, `Talla ${item.size} · ${item.colorName}`, ""]), "¿Me confirman los precios al privado?", "Envío, disponibilidad y método de pago por confirmar."].join("\n");
  return `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
}
