"use client";

import Image from "next/image";
import { ArrowUpRight, Download } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Profile } from "@/types/portfolio";
import { usePortfolioLanguage } from "@/components/portfolio-language";

function GithubIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 .7a11.3 11.3 0 0 0-3.58 22.02c.57.1.78-.25.78-.55v-2.02c-3.17.69-3.84-1.34-3.84-1.34-.52-1.31-1.27-1.66-1.27-1.66-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.67 1.25 3.32.95.1-.74.4-1.25.73-1.54-2.53-.29-5.19-1.27-5.19-5.65 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.45.11-3.03 0 0 .96-.31 3.11 1.17a10.8 10.8 0 0 1 5.66 0c2.15-1.48 3.11-1.17 3.11-1.17.62 1.58.23 2.74.11 3.03.74.8 1.18 1.82 1.18 3.07 0 4.39-2.67 5.36-5.21 5.64.41.35.78 1.04.78 2.1v3.11c0 .3.2.66.79.55A11.3 11.3 0 0 0 12 .7Z" /></svg>;
}

function LinkedinIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M5.2 3.5a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2ZM3.4 9h3.6v11.6H3.4V9Zm5.8 0h3.45v1.58h.05c.48-.91 1.65-1.87 3.4-1.87 3.64 0 4.31 2.4 4.31 5.52v6.37h-3.6v-5.64c0-1.35-.03-3.08-1.88-3.08s-2.17 1.47-2.17 2.98v5.74H9.2V9Z" /></svg>;
}

export function PortfolioHero({ profile }: { profile: Profile }) {
  const ref = useRef<HTMLElement>(null);
  const frame = useRef(0);
  const { language, t } = usePortfolioLanguage();

  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let pointer: PointerEvent | null = null;
    const applyPointer = () => {
      frame.current = 0;
      if (!pointer) return;
      const x = (pointer.clientX / window.innerWidth - 0.5) * 2;
      const y = (pointer.clientY / window.innerHeight - 0.5) * 2;
      node.style.setProperty("--hero-x", x.toFixed(3));
      node.style.setProperty("--hero-y", y.toFixed(3));
    };
    const updatePointer = (event: PointerEvent) => {
      pointer = event;
      if (!frame.current) frame.current = window.requestAnimationFrame(applyPointer);
    };
    const updateScroll = () => node.style.setProperty("--hero-scroll", Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1).toFixed(3));
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (canHover.matches) window.addEventListener("pointermove", updatePointer, { passive: true });
    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();
    return () => { window.removeEventListener("pointermove", updatePointer); window.removeEventListener("scroll", updateScroll); if (frame.current) window.cancelAnimationFrame(frame.current); };
  }, []);

  return (
    <section id="hero" className="portfolio-hero" ref={ref}>
      <div className="portfolio-hero-noise" aria-hidden="true" />
      <div className="portfolio-hero-container classic-container">
        <div className="portfolio-hero-copy">
          <h1><span>{t.hero.title}</span><em>{t.hero.emphasis}</em></h1>
          <p className="portfolio-hero-lead">{t.hero.lead}</p>
          <div className="classic-actions">
            <a href="#projects" className="classic-button classic-button-primary">{t.hero.explore} <ArrowUpRight size={16} /></a>
            <a href="/portfolio/assets/cv/cv.pdf" download className="classic-button classic-button-secondary"><Download size={16} /> {t.hero.cv}</a>
            <a href={profile.github} target="_blank" rel="noreferrer" className="portfolio-social-link" aria-label={t.hero.github} title="GitHub"><GithubIcon /></a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="portfolio-social-link" aria-label={t.hero.linkedin} title="LinkedIn"><LinkedinIcon /></a>
          </div>
        </div>
          <div className="portfolio-hero-stage" role="img" aria-label={language === "es" ? `Retrato de ${profile.name}` : `Portrait of ${profile.name}`}>
          <div className="portfolio-hero-grid" aria-hidden="true" />
          <div className="portfolio-hero-crosshair" aria-hidden="true"><i /><i /></div>
          <div className="portfolio-hero-ring portfolio-hero-ring-back" aria-hidden="true" />
          <div className="portfolio-hero-ring portfolio-hero-ring-front" aria-hidden="true" />
          <div className="portfolio-hero-glow" aria-hidden="true" />
          <div className="portfolio-hero-portrait"><Image src="/portfolio/assets/profile.jpeg" alt="" fill priority sizes="(max-width: 760px) 80vw, 440px" /></div>
        </div>
      </div>
    </section>
  );
}
