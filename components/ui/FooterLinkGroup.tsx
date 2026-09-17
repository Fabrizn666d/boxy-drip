"use client";

import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useMediaQuery } from "@/components/ui/useMediaQuery";

export function FooterLinkGroup({ title, className = "", children }: { title: string; className?: string; children: ReactNode }) {
  const mobile = useMediaQuery("(max-width: 760px)");
  const [expanded, setExpanded] = useState(false);
  return <div className={`footer-column footer-link-group ${className}`}>
    <details open={!mobile || expanded} onToggle={(event) => { if (mobile) setExpanded(event.currentTarget.open); }}>
      <summary tabIndex={mobile ? 0 : -1}><strong>{title}</strong><ChevronDown aria-hidden="true" /></summary>
      <nav aria-label={title}>{children}</nav>
    </details>
  </div>;
}
