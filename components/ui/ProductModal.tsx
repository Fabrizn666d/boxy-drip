"use client";

import { motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, MessageCircle, Minus, Plus, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useStore } from "@/components/providers/StoreProvider";
import { useDialog } from "@/components/ui/useDialog";
import { PRODUCT_PRICE_LABEL, type Product } from "@/data/products";
import { SITE_CONFIG } from "@/data/site";

type ProductModalProps = {
  product: Product;
  onClose: () => void;
};

export function ProductModal({ product, onClose }: ProductModalProps) {
  const { addToCart } = useStore();
  const [colorId, setColorId] = useState(product.colors[0].id);
  const [imageIndex, setImageIndex] = useState(0);
  const [size, setSize] = useState(() => product.colors[0].sizes.find((item) => item.status !== "sold-out")?.name ?? "");
  const [quantity, setQuantity] = useState(1);
  const dialogRef = useDialog(true, onClose);
  const color = product.colors.find((item) => item.id === colorId) ?? product.colors[0];

  const whatsappUrl = useMemo(() => {
    const selection = [
      `Hola Boxy Drip, quiero consultar por ${product.name}.`,
      `Color: ${color.name}.`,
      size ? `Talla: ${size}.` : "Necesito ayuda con la talla.",
      `Cantidad: ${quantity}.`,
      "¿Me confirmas el precio al privado?",
    ].join(" ");
    return `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(selection)}`;
  }, [color.name, product, quantity, size]);

  const changeColor = (nextColorId: string) => {
    const nextColor = product.colors.find((item) => item.id === nextColorId) ?? product.colors[0];
    setColorId(nextColorId);
    setSize(nextColor.sizes.find((item) => item.status !== "sold-out")?.name ?? "");
    setImageIndex(0);
    setQuantity(1);
  };

  const changeImage = (direction: number) => {
    setImageIndex((current) => (current + direction + color.images.length) % color.images.length);
  };

  const handleAdd = () => {
    if (!size) return;
    onClose();
    addToCart(product, { colorId: color.id, size, quantity });
  };

  return (
    <motion.div
      ref={dialogRef}
      tabIndex={-1}
      className="product-modal-layer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button type="button" className="product-modal-backdrop" aria-label="Cerrar detalle del producto" onClick={onClose} />
      <motion.section
        className="product-modal"
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      >
        <button type="button" className="product-modal-close" aria-label="Cerrar detalle del producto" onClick={onClose}><X /></button>

        <div className="product-modal-gallery">
          <div className="product-modal-image">
            <Image src={color.images[imageIndex]} alt={`${product.name}, ${color.name}`} fill sizes="(max-width: 760px) 92vw, 52vw" />
            {color.images.length > 1 ? (
              <div className="product-modal-arrows">
                <button type="button" onClick={() => changeImage(-1)} aria-label="Imagen anterior"><ChevronLeft /></button>
                <button type="button" onClick={() => changeImage(1)} aria-label="Imagen siguiente"><ChevronRight /></button>
              </div>
            ) : null}
          </div>
          {color.images.length > 1 ? (
            <div className="product-modal-thumbs" aria-label="Imágenes del producto">
              {color.images.map((image, index) => (
                <button type="button" key={image} className={imageIndex === index ? "is-active" : ""} onClick={() => setImageIndex(index)} aria-label={`Ver imagen ${index + 1}`}>
                  <Image src={image} alt="" fill sizes="70px" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="product-modal-info">
          <div className="product-modal-meta"><span>{product.badge ?? "Boxy Drip"}</span><small>{product.drop} · {product.category}</small></div>
          <h2 id="product-modal-title">{product.name}</h2>
          <p className="product-modal-description">{product.description}</p>
          <div className="product-modal-price"><strong>{PRODUCT_PRICE_LABEL}</strong></div>

          <fieldset className="product-modal-options">
            <legend>Color <span>{color.name}</span></legend>
            <div className="product-color-list">
              {product.colors.map((item) => (
                <button type="button" key={item.id} className={item.id === color.id ? "is-active" : ""} onClick={() => changeColor(item.id)} aria-label={`Color ${item.name}`} aria-pressed={item.id === color.id}>
                  <i style={{ backgroundColor: item.hex }} />{item.id === color.id ? <Check /> : null}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="product-modal-options">
            <legend>Talla <span>{size || "Por confirmar"}</span></legend>
            {color.sizes.length ? (
              <div className="product-size-list">
                {color.sizes.map((item) => (
                  <button type="button" key={item.name} disabled={item.status === "sold-out"} className={size === item.name ? "is-active" : ""} onClick={() => setSize(item.name)}>
                    {item.name}{item.status === "low-stock" ? <small>Últimas</small> : null}
                  </button>
                ))}
              </div>
            ) : <p className="product-size-help">Escríbenos por WhatsApp para confirmar medidas y disponibilidad.</p>}
          </fieldset>

          <div className="product-modal-buy-row">
            <div className="product-modal-quantity" aria-label="Cantidad">
              <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Restar unidad"><Minus /></button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity((value) => Math.min(9, value + 1))} aria-label="Sumar unidad"><Plus /></button>
            </div>
            <button type="button" className="product-modal-add" disabled={!size || product.status === "sold-out"} onClick={handleAdd}><ShoppingBag /> Añadir al carrito</button>
          </div>

          <a className="product-modal-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle /> Consultar por WhatsApp</a>
          <p className="product-modal-help">Te confirmamos stock, talla, envío y forma de pago directamente.</p>
        </div>
      </motion.section>
    </motion.div>
  );
}
