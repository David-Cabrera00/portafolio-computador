"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import { Code2, Database, FileText, Gamepad2, LayoutPanelTop, Wrench } from "lucide-react";
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

const certificateFiles = [
  { code: "A", title: "Python for Data Science, AI & Development", titleEn: "Python for Data Science, AI & Development", meta: "IBM / Coursera · 30 oct 2026", metaEn: "IBM / Coursera · Oct 30, 2026", color: "blue", preview: "/portfolio/certificates/ibm-python-data-science.png", pdf: "/portfolio/certificates/ibm-python-data-science.pdf" },
  { code: "B", title: "Inmersión Agentes de IA en la Práctica", titleEn: "AI Agents in Practice Immersion", meta: "DAXUS LATAM · 17 oct 2026", metaEn: "DAXUS LATAM · Oct 17, 2026", color: "orange", preview: "/portfolio/certificates/ia-agents-daxus.png" },
  { code: "C", title: "Introduction to Git", titleEn: "Introduction to Git", meta: "DataCamp · 28 ago 2026", metaEn: "DataCamp · Aug 28, 2026", color: "green", preview: "/portfolio/certificates/datacamp-git.png", pdf: "/portfolio/certificates/datacamp-git.pdf" },
  { code: "D", title: "Introduction to SQL", titleEn: "Introduction to SQL", meta: "DataCamp · 26 ago 2026", metaEn: "DataCamp · Aug 26, 2026", color: "violet", preview: "/portfolio/certificates/datacamp-sql.png", pdf: "/portfolio/certificates/datacamp-sql.pdf" },
  { code: "E", title: "Desarrollo de Aplicaciones móviles desde Cero", titleEn: "Mobile Application Development from Scratch", meta: "Universidad Mariana · 2021", metaEn: "Universidad Mariana · 2021", color: "blue", preview: "/portfolio/certificates/mobile-development.png", pdf: "/portfolio/certificates/mobile-development.pdf" },
];

export function CertificateArchive() {
  const [active, setActive] = useState(0);
  const { language, t } = usePortfolioLanguage();
  const file = certificateFiles[active];
  const currentTitle = language === "es" ? file.title : file.titleEn;
  const currentMeta = language === "es" ? file.meta : file.metaEn;
  return (
    <div className="certificate-archive">
      <div className="archive-console"><div className="archive-console-top"><span><i /> {t.skills.archive}</span></div><div className="archive-console-screen"><div className="archive-certificate-preview"><Image src={file.preview} alt={`${language === "es" ? "Vista previa de" : "Preview of"} ${currentTitle}`} fill sizes="180px" /></div><FileText size={22} strokeWidth={1.3} /><strong>{currentTitle}</strong><p>{currentMeta}</p><span className="archive-console-cursor" /></div><div className="archive-console-footer">{file.pdf ? <a href={file.pdf} target="_blank" rel="noreferrer">{language === "es" ? "ABRIR PDF" : "OPEN PDF"} ↗</a> : <span>{language === "es" ? "VISTA PREVIA" : "PREVIEW"}</span>}</div></div>
      <div className="archive-files" role="tablist" aria-label={language === "es" ? "Archivo de certificaciones" : "Certificate archive"}>
        {certificateFiles.map((item, index) => <div className={`archive-file archive-file-${item.color} ${active === index ? "is-active" : ""}`} key={item.code}><button type="button" role="tab" aria-selected={active === index} className="archive-file-select" onClick={() => setActive(index)}><span className="archive-file-tab">{item.code}</span><span className="archive-file-body"><strong>{language === "es" ? item.title : item.titleEn}</strong><small>{language === "es" ? item.meta : item.metaEn}</small></span></button>{item.pdf ? <a className="archive-file-action" href={item.pdf} target="_blank" rel="noreferrer">PDF ↗</a> : <span className="archive-file-action">{language === "es" ? "VISTA" : "VIEW"}</span>}</div>)}
      </div>
    </div>
  );
}
