"use client";

import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function MotionSystem() {
  const progressRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(pointer: coarse), (hover: none)").matches;
    root.classList.add("motion-ready");

    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max > 0 ? window.scrollY / max : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${value})`;
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    const updatePointerLight = (event: PointerEvent) => {
      if (touch || event.pointerType === "touch") return;
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>(".pointer-reactive") : null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
      target.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
    };
    window.addEventListener("pointermove", updatePointerLight, { passive: true });
    updateProgress();

    if (reduced) {
      root.classList.add("reduced-motion");
      return () => {
        window.removeEventListener("scroll", updateProgress);
        window.removeEventListener("pointermove", updatePointerLight);
        root.classList.remove("motion-ready", "reduced-motion");
      };
    }

    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: touch ? .65 : 1.1, smoothWheel: !touch, prevent: (node) => Boolean(node.closest("[role='dialog']")) });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        const direction = element.dataset.reveal;
        const x = touch ? 0 : direction === "left" ? -40 : direction === "right" ? 40 : 0;
        gsap.fromTo(element, { autoAlpha: 0, x, y: x ? 0 : 42 }, { autoAlpha: 1, x: 0, y: 0, duration: .8, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 82%", end: "top 58%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((group) => {
        const items = group.querySelectorAll<HTMLElement>("[data-reveal-item]");
        gsap.fromTo(items, { autoAlpha: 0, y: 50, scale: .98 }, { autoAlpha: 1, y: 0, scale: 1, duration: .72, stagger: .09, ease: "power3.out", scrollTrigger: { trigger: group, start: "top 82%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>("[data-line]").forEach((line) => gsap.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: .9, ease: "power3.out", transformOrigin: "left", scrollTrigger: { trigger: line, start: "top 86%", once: true } }));
      if (!touch) gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
        const amount = Number(element.dataset.parallax || 50);
        gsap.to(element, { y: amount, ease: "none", scrollTrigger: { trigger: ".home-hero", start: "top top", end: "bottom top", scrub: 1 } });
      });
    });

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("pointermove", updatePointerLight);
      context.revert();
      lenis.destroy();
      gsap.ticker.remove(tick);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      root.classList.remove("motion-ready");
    };
  }, [pathname]);

  return <div className="scroll-progress" ref={progressRef} aria-hidden="true" />;
}
