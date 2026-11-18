"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import { ArrowUpRight, Code2, Database, Gamepad2, LayoutPanelTop, Wrench } from "lucide-react";
import { usePortfolioLanguage } from "@/components/portfolio-language";

type SkillEntry = [string, string[]];

const skillMeta: Record<string, { label: string; description: string; glyph: string; tone: string }> = {
  "Frameworks backend": { label: "Sistemas", description: "Frameworks para convertir la lógica de una idea en una solución capaz de sostenerse.", glyph: "{ }", tone: "violet" },
  "Frameworks frontend": { label: "Interfaces", description: "Herramientas para construir capas visuales claras, rápidas y con intención.", glyph: "◒", tone: "cyan" },
  "Datos y persistencia": { label: "Estructura", description: "Modelos y motores para que el producto pueda crecer sin perder claridad.", glyph: "◈", tone: "amber" },
  "IA aplicada": { label: "Flujo aumentado", description: "Uso la IA como herramienta de exploración, aprendizaje y aceleración dentro del desarrollo.", glyph: "✳", tone: "mint" },
  "Desarrollo interactivo": { label: "Mundos interactivos", description: "Tecnologías para crear experiencias 3D, videojuegos y piezas visuales interactivas.", glyph: "◉", tone: "cyan" },
};

const icons = { "Frameworks backend": Code2, "Frameworks frontend": LayoutPanelTop, "Datos y persistencia": Database, "IA aplicada": Wrench, "Desarrollo interactivo": Gamepad2 };
const skillGroupEnglish: Record<string, string> = { "Frameworks backend": "Backend frameworks", "Frameworks frontend": "Frontend frameworks", "Datos y persistencia": "Data & persistence", "IA aplicada": "Applied AI", "Desarrollo interactivo": "Interactive development" };
const skillDescriptionEnglish: Record<string, string> = { "Frameworks backend": "Frameworks for turning an idea's logic into a solution built to last.", "Frameworks frontend": "Tools for building clear, fast interfaces with intention.", "Datos y persistencia": "Models and engines that let a product grow without losing clarity.", "IA aplicada": "I use AI to explore, learn and accelerate the development process.", "Desarrollo interactivo": "Tools for creating 3D experiences, games and interactive visual work." };

export function SkillsShowcase({ skillEntries }: { skillEntries: SkillEntry[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { language, t } = usePortfolioLanguage();
  const [group, skills] = skillEntries[activeIndex] ?? skillEntries[0];
  const meta = skillMeta[group] ?? skillMeta["Frameworks backend"];
  const Icon = icons[group as keyof typeof icons] ?? Code2;
  const groupLabel = language === "en" ? skillGroupEnglish[group] : group;
  const description = language === "en" ? skillDescriptionEnglish[group] : meta.description;

  return (
    <div className="skill-experience">
      <div className="skill-selector" role="tablist" aria-label={t.skills.explore}>
        {skillEntries.map(([name], index) => {
          const ItemIcon = icons[name as keyof typeof icons] ?? Code2;
          return (
            <button type="button" role="tab" aria-selected={activeIndex === index} className={`skill-selector-item ${activeIndex === index ? "is-active" : ""}`} onClick={() => setActiveIndex(index)} key={name}>
              <span className="skill-selector-number">0{index + 1}</span>
              <ItemIcon size={17} strokeWidth={1.5} />
              <strong>{language === "en" ? skillGroupEnglish[name] : name}</strong>
              <span className="skill-selector-arrow" aria-hidden="true">↗</span>
            </button>
          );
        })}
      </div>
      <div className={`skill-stage skill-stage-${meta.tone}`} key={group}>
        <div className="skill-stage-orbit" aria-hidden="true"><span>{meta.glyph}</span><i /><i /><i /></div>
        <div className="skill-stage-copy"><span className="skill-stage-index">{language === "en" ? "SELECTED" : "SELECCIONADA"} / 0{activeIndex + 1}</span><Icon className="skill-stage-icon" size={26} strokeWidth={1.3} /><small>{language === "en" ? (group === "IA aplicada" ? "Applied flow" : meta.label) : meta.label}</small><h3>{groupLabel}</h3><p>{description}</p></div>
        <div className="skill-constellation" aria-label={`${language === "en" ? "Technologies in" : "Tecnologías de"} ${groupLabel}`}>
          {skills.map((skill, index) => <span style={{ "--skill-index": index } as CSSProperties} key={skill}><b>{String(index + 1).padStart(2, "0")}</b>{skill}</span>)}
        </div>
      </div>
    </div>
  );
}

const certificates = [
  { title: "Desarrollo de Aplicaciones móviles desde Cero", titleEn: "Mobile Application Development from Scratch", issuer: "Universidad Mariana", date: "2021", preview: "/portfolio/certificates/mobile-development.png", pdf: "/portfolio/certificates/mobile-development.pdf" },
  { title: "Introduction to SQL", titleEn: "Introduction to SQL", issuer: "DataCamp", date: "26 ago 2026", dateEn: "Aug 26, 2026", preview: "/portfolio/certificates/datacamp-sql.png", pdf: "/portfolio/certificates/datacamp-sql.pdf" },
  { title: "Introduction to Git", titleEn: "Introduction to Git", issuer: "DataCamp", date: "28 ago 2026", dateEn: "Aug 28, 2026", preview: "/portfolio/certificates/datacamp-git.png", pdf: "/portfolio/certificates/datacamp-git.pdf" },
  { title: "Inmersión Agentes de IA en la Práctica", titleEn: "AI Agents in Practice Immersion", issuer: "DAXUS LATAM", date: "17 oct 2026", dateEn: "Oct 17, 2026", preview: "/portfolio/certificates/ia-agents-daxus.png" },
  { title: "Python for Data Science, AI & Development", titleEn: "Python for Data Science, AI & Development", issuer: "IBM / Coursera", date: "30 oct 2026", dateEn: "Oct 30, 2026", preview: "/portfolio/certificates/ibm-python-data-science.png", pdf: "/portfolio/certificates/ibm-python-data-science.pdf" },
];

export function CertificateShowcase() {
  const { language } = usePortfolioLanguage();
  return (
    <div className="certificate-gallery">
      {certificates.map((certificate, index) => {
        const title = language === "es" ? certificate.title : certificate.titleEn;
        const date = language === "es" ? certificate.date : (certificate.dateEn ?? certificate.date);
        return <article className="certificate-card" key={certificate.title}>
          <a className="certificate-preview" href={certificate.pdf ?? certificate.preview} target="_blank" rel="noreferrer" aria-label={`${language === "es" ? "Ampliar certificado" : "Enlarge certificate"}: ${title}`}>
            <Image src={certificate.preview} alt={`${language === "es" ? "Certificado de" : "Certificate for"} ${title}`} fill sizes="(max-width: 640px) 92vw, (max-width: 1000px) 45vw, 31vw" />
            <span>{String(index + 1).padStart(2, "0")}</span>
          </a>
          <div className="certificate-card-copy"><p>{certificate.issuer} <i>·</i> {date}</p><h4>{title}</h4>
            <a className="certificate-card-action" href={certificate.pdf ?? certificate.preview} target="_blank" rel="noreferrer">{certificate.pdf ? (language === "es" ? "Abrir certificado PDF" : "Open certificate PDF") : (language === "es" ? "Ver imagen completa" : "View full image")}<ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
        </article>;
      })}
    </div>
  );
}
