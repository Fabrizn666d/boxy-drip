import type { Metadata } from "next";
import { Barlow_Condensed, Inter_Tight } from "next/font/google";
import { StoreProvider } from "@/components/providers/StoreProvider";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { WhatsAppFloat } from "@/components/ui/WhatsAppFloat";
import { AcidCursor } from "@/components/motion/AcidCursor";
import { MotionSystem } from "@/components/motion/MotionSystem";
import "./globals.css";
import "./responsive.css";

const displayFont = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-display",
});

const uiFont = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ui",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Boxy Drip — Lo mejor de la calle",
  description: "Streetwear premium, drops limitados y actitud urbana en Ica.",
  openGraph: { title: "Boxy Drip — Lo mejor de la calle", description: "Streetwear, piezas limitadas y Drop 006 desde Ica.", type: "website", locale: "es_PE" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${displayFont.variable} ${uiFont.variable}`}>
      <body>
        <StoreProvider>
          <MotionSystem />
          <AcidCursor />
          <Header />
          {children}
          <Footer />
          <WhatsAppFloat />
        </StoreProvider>
      </body>
    </html>
  );
}
