"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, MessageCircle, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "@/components/providers/StoreProvider";
import { BrandMark } from "@/components/ui/BrandMark";
import { SearchOverlay } from "@/components/ui/SearchOverlay";
import { useDialog } from "@/components/ui/useDialog";

const navigation = [
  { label: "Inicio", href: "#inicio", id: "inicio" },
  { label: "Productos", href: "#productos", id: "productos" },
  { label: "Tienda", href: "#tienda", id: "tienda" },
  { label: "Contacto", href: "#footer", id: "footer" },
];

export function Header() {
  const { cartCount, openCart } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const menuRef = useDialog(menuOpen, () => setMenuOpen(false));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = navigation.map((item) => document.getElementById(item.id)).filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActiveSection(visible.target.id);
    }, { rootMargin: "-20% 0px -58%", threshold: [0, 0.2, 0.6] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.header
        className={`main-header ${scrolled ? "is-scrolled" : ""}`}
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .72, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="header-inner">
          <a href="#inicio" className="header-logo" aria-label="Boxy Drip, inicio">
            <BrandMark priority variant="alien" />
          </a>

          <nav className="header-nav" aria-label="Navegación principal">
            {navigation.map((item) => (
              <a className={activeSection === item.id ? "is-current" : ""} href={item.href} key={item.label}>
                {item.label}
                {activeSection === item.id ? <motion.span className="nav-active-line" layoutId="nav-active" transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} /> : null}
              </a>
            ))}
          </nav>

          <div className="header-tools">
            <button type="button" aria-label="Buscar" onClick={() => { setMenuOpen(false); setSearchOpen(true); }}><Search /></button>
            <button type="button" aria-label={`Abrir carrito, ${cartCount} productos`} className="bag-button" onClick={() => { setMenuOpen(false); openCart(); }}>
              <ShoppingBag />
              <span>{cartCount}</span>
            </button>
            <a className="header-whatsapp" href="https://wa.me/51986176298" target="_blank" rel="noreferrer" aria-label="WhatsApp 986 176 298">
              <MessageCircle />
              <span>986 176 298</span>
            </a>
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              className="menu-button"
              onClick={() => setMenuOpen((value) => !value)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen ? (
            <div ref={menuRef} tabIndex={-1} className="mobile-menu-layer" role="dialog" aria-modal="true" aria-label="Menú de navegación">
              <motion.button
                type="button"
                className="mobile-menu-backdrop"
                aria-label="Cerrar menú"
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.nav
                id="mobile-menu"
                className="mobile-navigation"
                initial={{ opacity: 0, y: -18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                aria-label="Navegación móvil"
              >
                <span className="mobile-menu-label">Menú / Boxy Drip</span>
                {navigation.map((item, index) => (
                  <a href={item.href} key={item.label} onClick={() => setMenuOpen(false)}>
                    <small>0{index + 1}</small><strong>{item.label}</strong><ArrowUpRight />
                  </a>
                ))}
              </motion.nav>
            </div>
          ) : null}
        </AnimatePresence>
      </motion.header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
