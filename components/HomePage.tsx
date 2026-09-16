import { FeaturedDrop } from "@/components/sections/FeaturedDrop";
import { Hero } from "@/components/sections/Hero";
import { StoreLocation } from "@/components/sections/StoreLocation";
import { TrustStrip } from "@/components/sections/TrustStrip";

export function HomePage() {
  return (
    <main className="home-page">
      <Hero />
      <TrustStrip />
      <FeaturedDrop />
      <StoreLocation />
    </main>
  );
}
