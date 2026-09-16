import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type RoutePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function RoutePlaceholder({ eyebrow, title, description }: RoutePlaceholderProps) {
  return (
    <main className="route-shell">
      <div className="route-shell-inner">
        <span className="route-shell-label">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        <Link href="/"><ArrowLeft /> Volver al inicio</Link>
      </div>
    </main>
  );
}
