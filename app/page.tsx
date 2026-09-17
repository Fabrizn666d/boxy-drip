import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";

export const metadata: Metadata = { title: "Boxy Drip | Streetwear en Ica", description: "Streetwear en Ica, drops limitados y piezas con actitud. Descubre el Drop 006 de Boxy Drip." };

export default function Home() {
  return <HomePage />;
}
