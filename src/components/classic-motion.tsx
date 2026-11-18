"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Moon, Sun } from "lucide-react";
import { usePortfolioLanguage } from "@/components/portfolio-language";

export function ClassicThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    return window.localStorage.getItem("classic-portfolio-theme") === "dark" ? "dark" : "light";
  });
  const { language } = usePortfolioLanguage();
  useEffect(() => {
    document.documentElement.dataset.classicTheme = theme;
  }, [theme]);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.classicTheme = next;
    window.localStorage.setItem("classic-portfolio-theme", next);
    setTheme(next);
  };
  const nextTheme = theme === "dark" ? (language === "es" ? "claro" : "light") : (language === "es" ? "oscuro" : "dark");
  const currentLabel = theme === "dark" ? (language === "es" ? "Claro" : "Light") : (language === "es" ? "Oscuro" : "Dark");
  const ThemeIcon = theme === "dark" ? Sun : Moon;
  return <button type="button" className="classic-theme-toggle" onClick={toggle} aria-label={`${language === "es" ? "Cambiar a modo" : "Switch to"} ${nextTheme}`}><span key={theme} className={`classic-theme-icon ${theme === "dark" ? "is-light" : "is-dark"}`} aria-hidden="true"><ThemeIcon size={15} strokeWidth={1.8} /></span><span>{currentLabel}</span></button>;
}

export function ScrollProgress() {
  const ref = useRef<HTMLSpanElement>(null);
  const frame = useRef(0);
  useEffect(() => {
    const update = () => {
      frame.current = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      ref.current?.style.setProperty("transform", `scaleX(${Math.max(0, Math.min(progress, 1))})`);
    };
    const scheduleUpdate = () => {
      if (!frame.current) frame.current = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame.current) window.cancelAnimationFrame(frame.current);
    };
  }, []);
  return <div className="classic-scroll-progress" aria-hidden="true"><span ref={ref} /> </div>;
}

export function HeroMotion({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const move = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      node.style.setProperty("--hero-mx", x.toFixed(3));
      node.style.setProperty("--hero-my", y.toFixed(3));
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return <div ref={ref} className={`hero-motion ${className}`}>{children}</div>;
}

export function ScrollReveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.08, rootMargin: "0px 0px -8%" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`classic-reveal ${visible ? "is-visible" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` } as CSSProperties}>{children}</div>;
}
