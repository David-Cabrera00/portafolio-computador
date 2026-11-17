"use client";

import Image from "next/image";
import { ArrowUpRight, CircleUserRound, Compass, ScanLine } from "lucide-react";
import { useState } from "react";
import type { Profile } from "@/types/portfolio";
import { usePortfolioLanguage } from "@/components/portfolio-language";

const modes = [
  { id: "identity", icon: CircleUserRound }, { id: "process", icon: ScanLine }, { id: "outside", icon: Compass },
] as const;

export function AboutShowcase({ profile }: { profile: Profile }) {
  const [activeId, setActiveId] = useState<(typeof modes)[number]["id"]>("identity");
  const active = modes.find((mode) => mode.id === activeId) ?? modes[0];
  const Icon = active.icon;
  const { t } = usePortfolioLanguage();
  const modeContent = { identity: { label: t.about.tabs[0], title: t.about.identityTitle, text: t.about.identityText }, process: { label: t.about.tabs[1], title: t.about.processTitle, text: t.about.processText }, outside: { label: t.about.tabs[2], title: t.about.outsideTitle, text: t.about.outsideText } }[active.id];

  return (
    <section id="about" className="classic-section about-exhibit-section">
      <div className="classic-container about-exhibit">
        <div className="about-exhibit-stage">
          <div className="about-stage-grid" aria-hidden="true" />
          <div className="about-stage-orbit" aria-hidden="true" />
          <div className="about-stage-main"><Image src="/portfolio/assets/foto2.jpeg" alt={profile.name} fill sizes="(max-width: 760px) 88vw, 43vw" /></div>
          <div className="about-stage-small about-stage-football"><Image src="/portfolio/assets/futbol.jpeg" alt="David jugando fútbol" fill sizes="(max-width: 760px) 35vw, 16vw" /></div>
          <div className="about-stage-small about-stage-life"><Image src="/portfolio/assets/novia.jpeg" alt="David con su novia" fill sizes="(max-width: 760px) 30vw, 13vw" /></div>
        </div>
        <div className="about-exhibit-copy">
          <p className="classic-kicker">{t.about.kicker}</p>
          <div className="about-exhibit-title"><h2>{t.about.title} <em>{t.about.emphasis}</em></h2></div>
          <div className="about-mode-switch" role="tablist" aria-label="Conocer a David">
            {modes.map((mode, index) => <button type="button" role="tab" aria-selected={activeId === mode.id} className={activeId === mode.id ? "is-active" : ""} onClick={() => setActiveId(mode.id)} key={mode.id}>{t.about.tabs[index]}</button>)}
          </div>
          <div className="about-signal-card" key={active.id}><Icon size={22} strokeWidth={1.4} /><span>{modeContent.label} / {t.about.signal}</span><h3>{modeContent.title}</h3><p>{modeContent.text}</p></div>
          <div className="about-exhibit-facts"><div><span>{t.about.formation}</span><strong>{profile.education}</strong></div><div><span>{t.about.availability}</span><strong>{profile.availability}</strong></div><div><span>{t.about.contact}</span><a href={`mailto:${profile.email}`}>{profile.email} <ArrowUpRight size={13} /></a></div></div>
        </div>
      </div>
    </section>
  );
}
