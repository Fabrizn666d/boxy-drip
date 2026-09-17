import { Crown, Gem, UsersRound, Truck } from "lucide-react";

const trustPoints = [
  { icon: Gem, label: "Diseños exclusivos", text: "Piezas que hablan." },
  { icon: Truck, label: "Envíos a todo el Perú", text: "Tu estilo, sin fronteras." },
  { icon: Crown, label: "Streetwear de calidad", text: "Detalles que marcan." },
  { icon: UsersRound, label: "Comunidad que inspira", text: "Más que una marca." },
];

export function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Beneficios de Boxy Drip">
      <div className="trust-inner" data-stagger>
        {trustPoints.map(({ icon: Icon, label, text }) => (
          <div className="trust-point" data-reveal-item key={label}>
            <Icon />
            <div><strong>{label}</strong><span>{text}</span></div>
          </div>
        ))}
      </div>
    </section>
  );
}
