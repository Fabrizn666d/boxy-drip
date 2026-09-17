import type { Metadata } from "next";
import { PolicyPage } from "@/components/ui/PolicyPage";
import { SIZE_GUIDE } from "@/data/site";

export const metadata: Metadata = { title: "Guía de tallas | Boxy Drip", description: "Consulta las tallas de las piezas Boxy Drip y coordina las medidas antes de comprar." };

export default function SizeGuidePage() {
  return <PolicyPage eyebrow="El fit importa" title="Guía de tallas" intro="Elige tu silueta. Confirma tus medidas antes de cerrar el pedido." sections={[{ title: "Medidas oficiales", body: SIZE_GUIDE.pendingMessage }, { title: "Cómo consultar tu talla", body: "Indícanos la pieza, tu talla habitual y el ajuste que prefieres. Las tallas ofrecidas para cada color aparecen en la página del producto." }]} />;
}
