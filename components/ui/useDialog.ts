"use client";

import { useEffect, useRef } from "react";

let activeDialogLocks = 0;
let unlockedBodyOverflow = "";

// One owner per dialog: scroll lock, keyboard containment and focus restoration.
export function useDialog(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);
  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (activeDialogLocks === 0) unlockedBodyOverflow = document.body.style.overflow;
    activeDialogLocks += 1;
    document.body.style.overflow = "hidden";
    const focusable = () => Array.from(ref.current?.querySelectorAll<HTMLElement>('a[href], button:not(:disabled), input, select, textarea, [tabindex="0"]') ?? []).filter((element) => element.getClientRects().length > 0);
    const frame = requestAnimationFrame(() => {
      const input = ref.current?.querySelector<HTMLElement>('input:not([type="hidden"]):not([type="range"])');
      const close = ref.current?.querySelector<HTMLElement>('button[aria-label^="Cerrar"]:not([class*="backdrop"]), .size-guide-modal>div>button');
      (input ?? close ?? focusable()[0] ?? ref.current)?.focus();
    });
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); closeRef.current(); }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) { event.preventDefault(); ref.current?.focus(); return; }
      const first = items[0]; const last = items[items.length - 1];
      if (!ref.current?.contains(document.activeElement) || (event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last)) {
        event.preventDefault(); (event.shiftKey ? last : first).focus();
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", keydown);
      activeDialogLocks = Math.max(0, activeDialogLocks - 1);
      document.body.style.overflow = activeDialogLocks === 0 ? unlockedBodyOverflow : "hidden";
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [open]);
  return ref;
}
