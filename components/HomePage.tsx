import { FeaturedDrop } from "@/components/sections/FeaturedDrop";
import { Hero } from "@/components/sections/Hero";
import { StoreLocation } from "@/components/sections/StoreLocation";

export function HomePage() {
  return (
    <main className="home-page">
      <Hero />
      <FeaturedDrop />
      <StoreLocation />
    </main>
  );
}
