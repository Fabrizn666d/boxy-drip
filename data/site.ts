import { products } from "@/data/products";

export const SITE_CONFIG = {
  brand: "Boxy Drip",
  claim: "Lo mejor de la calle",
  city: "Ica",
  country: "Perú",
  whatsapp: "51986176298",
  instagram: "https://www.instagram.com/boxy_drip",
  tiktok: "https://www.tiktok.com/@boxy_drip",
  store: {
    name: "Boxy Drip",
    address: "",
    district: "",
    city: "Ica",
    mapsUrl: "https://www.google.com/maps?q=-14.0171901,-75.7569767&z=17&hl=es",
    mapEmbedUrl: "https://www.google.com/maps?q=-14.0171901,-75.7569767&z=17&hl=es&output=embed",
    latitude: -14.0171901,
    longitude: -75.7569767,
  },
} as const;

export const STORE_LOCATION = SITE_CONFIG.store;

export const policies = {
  shipping: "Realizamos envíos coordinados en Ica. El plazo y costo final se confirman antes de cerrar el pedido.",
  exchanges: "Los cambios se coordinan según disponibilidad y condiciones de la pieza. Conserva el producto sin uso y contáctanos.",
  payments: "Para la versión beta, el pedido y el método de pago se confirman directamente por WhatsApp.",
};

export const SIZE_GUIDE = {
  measurements: [] as Array<{ size: string; widthCm: number; lengthCm: number }>,
  pendingMessage: "Las medidas oficiales todavía están pendientes de configuración. Escríbenos por WhatsApp y te ayudaremos a elegir la talla correcta.",
};

export const drops = [
  { id: "drop-006", name: "Drop 006", date: "Agosto 2026", status: "Activo", campaign: "/campaign-artwork/short-drip-fire-campaign.png", productIds: ["BD-006-01", "BD-006-02", "BD-006-03", "BD-006-05"] },
] as const;

export const categories = [
  { name: "Polos", count: products.filter((product) => product.category === "Polos").length, href: "/#productos", image: "/product-cutouts/polo-emotion-black.png" },
  { name: "Buzos", count: 0, href: "/#productos", image: "/campaign-artwork/brand-triptych.png" },
  { name: "Shorts", count: products.filter((product) => product.category === "Shorts").length, href: "/#productos", image: "/campaign-artwork/short-drip-fire-campaign.png" },
  { name: "Accesorios", count: 0, href: "/#productos", image: "/mascot/alien-mascot.png" },
] as const;
