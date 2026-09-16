"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BrandMark } from "@/components/ui/BrandMark";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reducedMotion = useReducedMotion();
  const enter = (values: Record<string, string | number>) => reducedMotion ? false : values;

  return <section className="home-hero editorial-hero" aria-labelledby="hero-title">
    <div className="editorial-hero-grid page-shell">
      <motion.div className="editorial-hero-model" aria-hidden="true" initial={enter({ opacity: 0, x: -36 })} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.05, ease }}><Image src="/models/hero-emotion-campaign-v1.png" alt="" fill priority sizes="(max-width: 860px) 100vw, 42vw" /></motion.div>
      <div className="editorial-hero-copy">
        <motion.div className="editorial-kicker" initial={enter({ opacity: 0, y: 12 })} animate={{ opacity: 1, y: 0 }} transition={{ delay: .22, duration: .55, ease }}><span>Drop 006</span><i /> Agosto 2026</motion.div>
        <h1 id="hero-title"><span className="hero-title-mask"><motion.span initial={enter({ y: "110%" })} animate={{ y: 0 }} transition={{ delay: .2, duration: .75, ease }}>Lo mejor</motion.span></span><span className="hero-title-mask"><motion.span initial={enter({ y: "110%" })} animate={{ y: 0 }} transition={{ delay: .3, duration: .75, ease }}>de la</motion.span></span><motion.em initial={enter({ opacity: 0, x: -18, rotate: -8 })} animate={{ opacity: 1, x: 0, rotate: -5 }} transition={{ delay: .5, duration: .75, ease }}>Calle.</motion.em></h1>
        <motion.p initial={enter({ opacity: 0, y: 14 })} animate={{ opacity: 1, y: 0 }} transition={{ delay: .62, duration: .55, ease }}>Streetwear premium hecho para destacar. Siluetas oversize, gráficos exclusivos y drops que no vuelven.</motion.p>
        <motion.div className="hero-actions" initial={enter({ opacity: 0, y: 14 })} animate={{ opacity: 1, y: 0 }} transition={{ delay: .72, duration: .55, ease }}><Link href="#coleccion" className="button-primary">Explorar el drop <ArrowRight /></Link><Link href="/catalogo" className="button-secondary">Ver catálogo <ArrowRight /></Link></motion.div>
      </div>
      <motion.div className="editorial-hero-brand" aria-hidden="true" initial={enter({ opacity: 0, scale: .96 })} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .18, duration: 1.1, ease }}><BrandMark className="editorial-brandmark" priority /><span>ICA · PERÚ</span></motion.div>
    </div>
  </section>;
}
