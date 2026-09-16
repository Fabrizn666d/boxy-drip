"use client";

import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; radius: number; speed: number; drift: number; color: string; alpha: number };

export function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    let particles: Particle[] = [];
    let frame = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = mobile ? 10 : 28;
      particles = Array.from({ length: count }, (_, index) => ({ x: Math.random() * width, y: Math.random() * height, radius: .5 + Math.random(), speed: .025 + Math.random() * .07, drift: (Math.random() - .5) * .035, color: index % 5 === 0 ? "157,44,255" : index % 3 === 0 ? "145,255,0" : "255,255,255", alpha: .18 + Math.random() * .5 }));
    };
    const draw = () => {
      context.clearRect(0, 0, width, height);
      particles.forEach((particle) => {
        context.beginPath();
        context.fillStyle = `rgba(${particle.color},${particle.alpha})`;
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
        if (!reduced && !mobile) {
          particle.y -= particle.speed;
          particle.x += particle.drift;
          if (particle.y < -2) particle.y = height + 2;
          if (particle.x < -2) particle.x = width + 2;
          if (particle.x > width + 2) particle.x = -2;
        }
      });
      if (!reduced && !mobile) frame = requestAnimationFrame(draw);
    };
    resize();
    draw();
    window.addEventListener("resize", resize, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas className="hero-particles" ref={ref} aria-hidden="true" />;
}
