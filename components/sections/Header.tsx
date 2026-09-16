"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/components/providers/StoreProvider";
import { BrandMark } from "@/components/ui/BrandMark";
import { SearchOverlay } from "@/components/ui/SearchOverlay";

const navigation = [
  { label: "Inicio", href: "/" },
  { label: "Catálogo", href: "/catalogo" },
  { label: "Nuevos", href: "/nuevos" },
  { label: "Drops", href: "/drops" },
  { label: "Nosotros", href: "/nosotros" },
];

export function Header() {
  const pathname = usePathname();
  const { cartCount, openCart } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen && !searchOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen, searchOpen]);

  return (
    <>
      <motion.header
        className={`main-header ${scrolled ? "is-scrolled" : ""}`}
      >
        <div className="header-inner">
          <Link href="/" className="header-logo" aria-label="Boxy Drip, inicio">
            <BrandMark priority />
          </Link>

          <nav className="header-nav" aria-label="Navegación principal">
            {navigation.map((item) => (
              <Link className={pathname === item.href ? "is-current" : ""} href={item.href} key={item.label}>
                {item.label}
                {pathname === item.href ? <motion.span className="nav-active-line" layoutId="nav-active" transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} /> : null}
              </Link>
            ))}
          </nav>

          <div className="header-tools">
            <button type="button" aria-label="Buscar" onClick={() => setSearchOpen(true)}><Search /></button>
            <Link href="/cuenta" aria-label="Mi cuenta" className="header-account"><UserRound /></Link>
            <button type="button" aria-label={`Abrir carrito, ${cartCount} productos`} className="bag-button" onClick={openCart}>
              <ShoppingBag />
              <span>{cartCount}</span>
            </button>
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
            <div className="mobile-menu-layer">
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
                  <Link href={item.href} key={item.label} onClick={() => setMenuOpen(false)}>
                    <small>0{index + 1}</small><strong>{item.label}</strong><ArrowUpRight />
                  </Link>
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
