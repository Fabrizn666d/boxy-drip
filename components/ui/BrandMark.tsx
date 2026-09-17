import Image from "next/image";

type BrandMarkProps = {
  className?: string;
  priority?: boolean;
  variant?: "full" | "alien";
};

export function BrandMark({ className = "", priority = false, variant = "full" }: BrandMarkProps) {
  if (variant === "alien") {
    return (
      <div className={`brand-mark brand-mark--alien ${className}`} aria-label="Boxy Drip">
        <Image src="/mascot/alien-mascot.png" alt="Boxy Drip" width={1280} height={1280} preload={priority} sizes="102px" />
      </div>
    );
  }

  return (
    <div className={`brand-mark ${className}`} aria-label="Boxy Drip">
      <Image
        src="/mascot/alien-mascot.png"
        alt="Boxy Drip"
        fill
        preload={priority}
        sizes="(max-width: 768px) 84px, (max-width: 1200px) 110px, 180px"
      />
    </div>
  );
}
