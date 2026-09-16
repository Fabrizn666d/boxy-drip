import Image from "next/image";

type BrandMarkProps = {
  className?: string;
  priority?: boolean;
};

export function BrandMark({ className = "", priority = false }: BrandMarkProps) {
  return (
    <div className={`brand-mark ${className}`} aria-label="Boxy Drip">
      <Image
        src="/logos/boxy-drip-chrome.png"
        alt="Boxy Drip"
        fill
        priority={priority}
        sizes="(max-width: 768px) 140px, 260px"
      />
    </div>
  );
}
