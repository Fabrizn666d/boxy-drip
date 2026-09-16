type GarmentPlaceholderProps = {
  kind: "hoodie" | "shorts";
};

export function GarmentPlaceholder({ kind }: GarmentPlaceholderProps) {
  return (
    <div className={`garment-placeholder garment-${kind}`} aria-label={kind === "hoodie" ? "Vista referencial del buzo" : "Vista referencial del short"}>
      <span className="garment-body" />
      <span className="garment-detail garment-detail-one" />
      <span className="garment-detail garment-detail-two" />
      <small>Vista referencial</small>
    </div>
  );
}
