"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ClassicThemeToggle } from "@/components/classic-motion";
import { usePortfolioLanguage } from "@/components/portfolio-language";

const links = [
  "hero", "about", "skills-certifications", "experience", "projects", "testimonials", "contact",
] as const;

export function PortfolioNav() {
  const [activeId, setActiveId] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const { language, toggleLanguage, t } = usePortfolioLanguage();
  const labels = { hero: t.nav.hero, about: t.nav.about, "skills-certifications": t.nav.skills, experience: t.nav.education, projects: t.nav.projects, testimonials: t.nav.testimonials, contact: t.nav.contact };

  useEffect(() => {
    const sections = links.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveId(visible.target.id);
    }, { rootMargin: "-18% 0px -62% 0px", threshold: [0.1, 0.35, 0.65] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButton.current?.focus();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const navigateToSection = (event: MouseEvent<HTMLAnchorElement>, id: (typeof links)[number]) => {
    event.preventDefault();
    closeMenu();
    const section = document.getElementById(id);
    if (!section) return;

    window.history.pushState(null, "", `#${id}`);
    window.requestAnimationFrame(() => {
      section.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
      const heading = section.querySelector<HTMLElement>("h1, h2");
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
    });
  };

  return <header className="classic-nav"><div className="classic-container classic-nav-inner"><a href="#hero" className="classic-logo" onClick={(event) => navigateToSection(event, "hero")}>David<span>.</span></a><nav aria-label="Navegación principal" className="classic-links">{links.map((id) => <a href={`#${id}`} className={activeId === id ? "is-active" : ""} aria-current={activeId === id ? "location" : undefined} onClick={(event) => navigateToSection(event, id)} key={id}>{labels[id]}</a>)}</nav><div className="classic-nav-actions"><ClassicThemeToggle /><button type="button" className="classic-language-toggle" onClick={toggleLanguage} aria-label={t.language}><span className={language === "es" ? "is-active" : ""}>ES</span><span>/</span><span className={language === "en" ? "is-active" : ""}>EN</span></button><Link href="/dev-os" className="classic-os-link">{t.nav.os}</Link><button ref={menuButton} type="button" className="classic-mobile-toggle" aria-label={menuOpen ? "Cerrar navegación" : "Abrir navegación"} aria-expanded={menuOpen} aria-controls="classic-mobile-menu" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={18} /> : <Menu size={18} />}</button></div></div><div id="classic-mobile-menu" className={`classic-mobile-menu ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>{links.map((id) => <a href={`#${id}`} className={activeId === id ? "is-active" : ""} onClick={(event) => navigateToSection(event, id)} tabIndex={menuOpen ? 0 : -1} key={id}>{labels[id]}<span>↗</span></a>)}<button type="button" className="classic-mobile-language" onClick={toggleLanguage} tabIndex={menuOpen ? 0 : -1}>{language === "es" ? "English" : "Español"}</button><Link href="/dev-os" className="classic-mobile-os-link" onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>{t.nav.os} <span>↗</span></Link></div></header>;
}
