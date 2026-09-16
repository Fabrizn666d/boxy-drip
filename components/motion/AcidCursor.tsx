"use client";

import { useEffect, useRef } from "react";

const TRAIL_COUNT = 5;

export function AcidCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced) return;

    const body = document.body;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { ...target };
    const trail = Array.from({ length: TRAIL_COUNT }, () => ({ ...target }));
    let frame = 0;

    body.classList.add("cursor-ready");
    const move = (event: PointerEvent) => { target.x = event.clientX; target.y = event.clientY; body.classList.add("cursor-active"); };
    const over = (event: PointerEvent) => {
      const element = event.target instanceof Element ? event.target : null;
      const interactive = element?.closest("a,button,[data-cursor]");
      const product = element?.closest(".drop-card");
      const drag = element?.closest('[data-cursor="drag"]');
      const native = element?.closest("[data-native-cursor]");
      body.classList.toggle("cursor-product", Boolean(product));
      body.classList.toggle("cursor-interactive", Boolean(interactive) && !product && !drag);
      body.classList.toggle("cursor-drag", Boolean(drag));
      body.classList.toggle("native-cursor-zone", Boolean(native));
      if (ringRef.current) ringRef.current.dataset.label = product ? "VIEW" : drag ? "ARRASTRA" : "";
    };
    const leave = () => body.classList.add("cursor-out");
    const enter = () => body.classList.remove("cursor-out");

    const animate = () => {
      ring.x += (target.x - ring.x) * .14;
      ring.y += (target.y - ring.y) * .14;
      ringRef.current?.style.setProperty("transform", `translate3d(${ring.x}px,${ring.y}px,0) translate(-50%,-50%)`);
      coreRef.current?.style.setProperty("transform", `translate3d(${target.x}px,${target.y}px,0) translate(-50%,-50%)`);
      trail.forEach((point, index) => {
        const leader = index === 0 ? ring : trail[index - 1];
        const speed = .24 - index * .025;
        point.x += (leader.x - point.x) * speed;
        point.y += (leader.y - point.y) * speed;
        trailRefs.current[index]?.style.setProperty("transform", `translate3d(${point.x}px,${point.y}px,0) translate(-50%,-50%)`);
      });
      frame = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    document.documentElement.addEventListener("mouseenter", enter);
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.removeEventListener("mouseenter", enter);
      body.classList.remove("cursor-ready", "cursor-active", "cursor-product", "cursor-interactive", "cursor-drag", "native-cursor-zone", "cursor-out");
    };
  }, []);

  return <div className="acid-cursor-layer" aria-hidden="true"><div className="acid-cursor-ring" ref={ringRef} /><div className="acid-cursor-core" ref={coreRef} />{Array.from({ length: TRAIL_COUNT }, (_, index) => <span className={`acid-trail acid-trail-${index + 1}`} ref={(element) => { trailRefs.current[index] = element; }} key={index} />)}</div>;
}
