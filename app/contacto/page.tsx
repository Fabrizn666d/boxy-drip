import { PolicyPage } from "@/components/ui/PolicyPage";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Contacto | Boxy Drip", description: "Contacta a Boxy Drip por WhatsApp al 986 176 298. Consultas, tallas y pedidos desde Ica." };
export default function Page(){return <PolicyPage eyebrow="Contacto / Ica" title="Hablemos" intro="Atención directa, sin bots." sections={[{title:"WhatsApp",body:"Es el canal oficial para consultas de stock, tallas, pedidos, entregas y cambios."},{title:"Redes",body:"Encuéntranos en Instagram y TikTok desde los enlaces oficiales del footer. No se muestran correos o direcciones que todavía no estén confirmados."}]}/>}
