"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Crown, Diamond, ShieldCheck, Truck } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const foregroundY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : -28]);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const artX = useSpring(pointerX, { stiffness: 70, damping: 18 });
  const artY = useSpring(pointerY, { stiffness: 70, damping: 18 });
  const combinedY = useTransform([foregroundY, artY], ([scroll, pointer]) => Number(scroll) + Number(pointer));
  const enter = (values: Record<string, string | number>) => values;

  return (
    <section
      ref={heroRef}
      id="inicio"
      className="bd-hero"
      aria-labelledby="hero-title"
      onPointerMove={(event) => {
        if (reducedMotion || event.pointerType === "touch") return;
        const rect = event.currentTarget.getBoundingClientRect();
        pointerX.set(((event.clientX - rect.left) / rect.width - .5) * 16);
        pointerY.set(((event.clientY - rect.top) / rect.height - .5) * 10);
      }}
      onPointerLeave={() => { pointerX.set(0); pointerY.set(0); }}
    >
      <motion.div className="bd-hero-background" aria-hidden="true" initial={enter({ scale: 1.035 })} animate={{ scale: 1 }} transition={{ duration: 1.2, ease }}>
        <Image src="/boxy/hero-skyline.png" alt="" fill preload sizes="100vw" />
      </motion.div>
      <div className="bd-hero-overlay" />
      <div className="bd-hero-glow" aria-hidden="true" />

      <motion.div className="bd-hero-art" aria-hidden="true" initial={enter({ opacity: 0, x: 80, scale: .96 })} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ delay: .12, duration: 1.05, ease }}>
        <motion.div className="bd-hero-art-parallax" style={{ x: artX, y: combinedY }}><Image src="/boxy/hero-products-alien.png" alt="" fill loading="eager" fetchPriority="high" sizes="(max-width: 700px) 105vw, (max-width: 1100px) 72vw, 56vw" /></motion.div>
      </motion.div>

      <div className="bd-hero-inner">
        <div className="bd-hero-copy">
          <motion.div className="bd-hero-kicker" initial={enter({ opacity: 0, y: 16 })} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2, duration: .72, ease }}>
            <Crown aria-hidden="true" />
            <span>Streetwear sin límites</span>
          </motion.div>

          <motion.h1 id="hero-title" initial={enter({ opacity: 0, y: 30 })} animate={{ opacity: 1, y: 0 }} transition={{ delay: .26, duration: .88, ease }}>
            <Image src="/boxy/hero-title.png" alt="Lo mejor de la calle" width={1448} height={1086} loading="eager" fetchPriority="high" sizes="(max-width: 700px) 90vw, 37vw" />
          </motion.h1>

          <motion.p className="bd-hero-description" initial={enter({ opacity: 0, y: 18 })} animate={{ opacity: 1, y: 0 }} transition={{ delay: .42, duration: .76, ease }}>
            Más que ropa, es actitud. Boxy Drip representa una mentalidad, un estilo de vida y una generación que no sigue reglas.
          </motion.p>

          <motion.div className="bd-hero-actions" initial={enter({ opacity: 0, y: 18 })} animate={{ opacity: 1, y: 0 }} transition={{ delay: .54, duration: .76, ease }}>
            <a href="#productos" className="bd-button bd-button-primary">Ver productos <ArrowRight /></a>
            <a href="#productos" className="bd-button bd-button-secondary">Nuevo drop <ArrowRight /></a>
          </motion.div>

          <motion.div className="bd-hero-benefits" initial={enter({ opacity: 0, y: 18 })} animate={{ opacity: 1, y: 0 }} transition={{ delay: .68, duration: .78, ease }}>
            <span><Diamond />Diseños exclusivos</span>
            <span><Truck />Envíos a todo el Perú</span>
            <span><ShieldCheck />Calidad premium</span>
          </motion.div>
        </div>
      </div>
      <a className="bd-hero-scroll" href="#productos" aria-label="Ir a los productos"><span>Scroll</span><i /></a>
    </section>
  );
}
