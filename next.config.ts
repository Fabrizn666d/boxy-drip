import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    const productRoutes = ["/catalogo", "/nuevos", "/drops", "/lookbook", "/producto/:slug"];
    const contactRoutes = ["/carrito", "/cuenta", "/contacto", "/preguntas-frecuentes", "/cambios-y-devoluciones", "/envios", "/guia-de-tallas", "/metodos-de-pago", "/seguimiento", "/terminos-y-condiciones", "/politica-de-privacidad", "/politica-de-cookies"];
    return [
      ...productRoutes.map((source) => ({ source, destination: "/#productos", permanent: false })),
      { source: "/nosotros", destination: "/#inicio", permanent: false },
      ...contactRoutes.map((source) => ({ source, destination: "/#footer", permanent: false })),
    ];
  },
};

export default nextConfig;
