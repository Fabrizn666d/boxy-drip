import { Headphones, LockKeyhole, Sprout, Truck } from "lucide-react";

const trustPoints = [
  { icon: Truck, label: "Envíos a todo Ica", detail: "Rápidos y seguros" },
  { icon: Sprout, label: "Calidad premium", detail: "Algodón seleccionado" },
  { icon: LockKeyhole, label: "Pagos seguros", detail: "Compra protegida" },
  { icon: Headphones, label: "Atención directa", detail: "Estamos para ayudarte" },
];

export function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Beneficios de Boxy Drip">
      <div className="trust-inner" data-stagger>
        {trustPoints.map(({ icon: Icon, label, detail }) => (
          <div className="trust-point" data-reveal-item key={label}>
            <Icon />
            <div><strong>{label}</strong><span>{detail}</span></div>
          </div>
        ))}
      </div>
    </section>
  );
}
