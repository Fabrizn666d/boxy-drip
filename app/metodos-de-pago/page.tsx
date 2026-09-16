import { PolicyPage } from "@/components/ui/PolicyPage";
import { policies } from "@/data/site";
export default function Page(){return <PolicyPage eyebrow="Ayuda / Checkout" title="Pagos" intro="Compra clara y coordinada." sections={[{title:"Beta actual",body:policies.payments},{title:"Confirmación",body:"No realices pagos a cuentas que no hayan sido confirmadas dentro del canal oficial de Boxy Drip."},{title:"Comprobante",body:"Una vez coordinado el pago, conserva el comprobante y compártelo en la conversación del pedido para validar la compra."}]}/>}
