import { PolicyPage } from "@/components/ui/PolicyPage";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Cambios y devoluciones | Boxy Drip", description: "Información para consultar cambios de piezas Boxy Drip." };
import { policies } from "@/data/site";
export default function Page(){return <PolicyPage eyebrow="Ayuda / Postventa" title="Cambios" intro="La pieza correcta, sin vueltas." sections={[{title:"Condiciones",body:policies.exchanges},{title:"Cómo solicitarlo",body:"Escríbenos por WhatsApp indicando tu pedido, la pieza y el motivo. Revisaremos el caso y te informaremos las opciones disponibles."},{title:"Estado de la pieza",body:"La prenda debe conservar sus etiquetas, no presentar uso, lavado, olores ni alteraciones. La disponibilidad de otra talla o color puede variar."}]}/>}
