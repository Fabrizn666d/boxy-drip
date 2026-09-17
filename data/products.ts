export type ProductCategory = "Polos" | "Buzos" | "Shorts" | "Accesorios";
export type ProductStatus = "available" | "low-stock" | "preorder" | "sold-out";
export type ProductSize = { name: "S" | "M" | "L" | "XL"; status: "available" | "low-stock" | "sold-out" };
export type ProductColor = {
  id: string;
  name: string;
  hex: string;
  images: string[];
  sizes: ProductSize[];
  stock?: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  shortDescription: string;
  description: string;
  badge?: string;
  drop: string;
  colors: ProductColor[];
  images: string[];
  tags: string[];
  featured: boolean;
  isNew: boolean;
  status: ProductStatus;
};

const standardSizes: ProductSize[] = [
  { name: "S", status: "available" },
  { name: "M", status: "available" },
  { name: "L", status: "low-stock" },
  { name: "XL", status: "available" },
];

export const products: Product[] = [
  {
    id: "BD-006-01",
    slug: "polo-emotion-angel",
    name: "Polo Emotion Angel",
    category: "Polos",
    shortDescription: "Polo oversize de presencia gráfica y acabado negro lavado.",
    description: "Una pieza central del Drop 006. Su silueta amplia y gráfica Angel están pensadas para construir un look urbano con presencia. Consulta composición y cuidados confirmados antes de finalizar tu pedido.",
    badge: "Nuevo",
    drop: "Drop 006",
    images: ["/product-cutouts/polo-emotion-black.png", "/models/hero-emotion-campaign-v1.png", "/campaign-artwork/streetwear-night.png"],
    colors: [{ id: "black-wash", name: "Negro lavado", hex: "#17171a", images: ["/product-cutouts/polo-emotion-black.png", "/models/hero-emotion-campaign-v1.png"], sizes: standardSizes, stock: 14 }],
    tags: ["angel", "negro", "oversize", "streetwear", "drop 006"],
    featured: true,
    isNew: true,
    status: "available",
  },
  {
    id: "BD-006-02",
    slug: "polo-stride-white",
    name: "Polo Stride",
    category: "Polos",
    shortDescription: "Gráfica Stride sobre una base blanca de alto contraste.",
    description: "El contraste más limpio del drop. Una silueta relajada que pone toda la atención sobre el arte Stride. Consulta composición y cuidados confirmados antes de finalizar tu pedido.",
    badge: "Nuevo",
    drop: "Drop 006",
    images: ["/product-cutouts/polo-stride-white.png", "/campaign-artwork/stride-campaign.png"],
    colors: [
      { id: "optical-white", name: "Blanco óptico", hex: "#eeeeee", images: ["/product-cutouts/polo-stride-white.png", "/campaign-artwork/stride-campaign.png"], sizes: standardSizes, stock: 9 },
    ],
    tags: ["stride", "blanco", "oversize", "gráfico", "drop 006"],
    featured: true,
    isNew: true,
    status: "low-stock",
  },
  {
    id: "BD-006-03",
    slug: "polo-sunglasses-black",
    name: "Polo Sunglasses Black",
    category: "Polos",
    shortDescription: "Una gráfica frontal intensa sobre negro carbón.",
    description: "Una pieza directa, gráfica y fácil de combinar. El diseño Sunglasses domina el frente y mantiene el lenguaje maximalista de Boxy Drip. Consulta composición y cuidados confirmados antes de finalizar tu pedido.",
    badge: "Nuevo",
    drop: "Drop 006",
    images: ["/product-cutouts/polo-sunglasses-black.png", "/campaign-artwork/sunglasses-campaign.png", "/campaign-artwork/brand-triptych.png"],
    colors: [{ id: "carbon-black", name: "Negro carbón", hex: "#09090b", images: ["/product-cutouts/polo-sunglasses-black.png", "/campaign-artwork/sunglasses-campaign.png"], sizes: standardSizes.map((size) => size.name === "XL" ? { ...size, status: "sold-out" } : size), stock: 5 }],
    tags: ["sunglasses", "negro", "gráfico", "streetwear"],
    featured: true,
    isNew: true,
    status: "low-stock",
  },
  {
    id: "BD-006-05",
    slug: "short-baggy-drip",
    name: "Short Baggy Drip Fire",
    category: "Shorts",
    shortDescription: "Short baggy negro con gráfica de cruz y llamas.",
    description: "Una pieza de silueta baggy con contraste gráfico y actitud Boxy Drip. Consulta composición y medidas confirmadas antes de finalizar tu pedido.",
    badge: "Nuevo",
    drop: "Drop 006",
    images: ["/campaign-artwork/short-drip-fire-campaign.png"],
    colors: [{ id: "black", name: "Negro", hex: "#09090b", images: ["/campaign-artwork/short-drip-fire-campaign.png"], sizes: [] }],
    tags: ["short", "baggy", "negro", "edición limitada"],
    featured: true,
    isNew: true,
    status: "preorder",
  },
];

export const featuredProducts = products.filter((product) => product.featured);
export const newProducts = products.filter((product) => product.isNew);
export const getProduct = (slug: string) => products.find((product) => product.slug === slug);
export const PRODUCT_PRICE_LABEL = "Precio al privado";
