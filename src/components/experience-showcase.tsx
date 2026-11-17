"use client";

import { Award, BookOpen, ExternalLink, GraduationCap, MapPin } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Profile } from "@/types/portfolio";
import { usePortfolioLanguage } from "@/components/portfolio-language";

const records = [
  { id: "mobile", label: "CERTIFICACIÓN", period: "2021", title: "Desarrollo de Aplicaciones móviles desde Cero", issuer: "Universidad Mariana", icon: Award, description: "Certificación académica en desarrollo de aplicaciones móviles.", pdf: "/portfolio/certificates/mobile-development.pdf" },
  { id: "academic", label: "ACADEMIC", period: "2024 — ACTUALIDAD", title: "Ingeniería de Software", issuer: "Universidad Cooperativa de Colombia", icon: GraduationCap, description: "Esta etapa es el laboratorio donde conecto programación, arquitectura, bases de datos, diseño de interfaces y experiencias 3D." },
  { id: "sql", label: "CERTIFICATION", period: "26 AGO 2026", title: "Introduction to SQL", issuer: "DataCamp", icon: Award, description: "Certificación de fundamentos de SQL y trabajo con datos.", pdf: "/portfolio/certificates/datacamp-sql.pdf" },
  { id: "git", label: "CERTIFICATION", period: "28 AGO 2026", title: "Introduction to Git", issuer: "DataCamp", icon: Award, description: "Certificación de control de versiones y colaboración con Git.", pdf: "/portfolio/certificates/datacamp-git.pdf" },
  { id: "ai", label: "CERTIFICATION", period: "17 OCT 2026", title: "Inmersión Agentes de IA en la Práctica", issuer: "DAXUS LATAM", icon: Award, description: "Participación en una inmersión práctica sobre agentes de Inteligencia Artificial.", pdf: undefined },
  { id: "python", label: "CERTIFICATION", period: "30 OCT 2026", title: "Python for Data Science, AI & Development", issuer: "IBM / Coursera", icon: Award, description: "Certificación de Python aplicado a ciencia de datos, IA y desarrollo.", pdf: "/portfolio/certificates/ibm-python-data-science.pdf" },
] as const;
const recordEnglish: Record<string, { period: string; title: string; description: string }> = {
  mobile: { period: "2021", title: "Mobile Application Development from Scratch", description: "Academic certification in mobile application development." },
  academic: { period: "2024 — PRESENT", title: "Software Engineering", description: "This stage is the lab where I connect programming, architecture, databases, interface design and 3D experiences." },
  sql: { period: "AUG 26, 2026", title: "Introduction to SQL", description: "Certification in SQL fundamentals and working with data." },
  git: { period: "AUG 28, 2026", title: "Introduction to Git", description: "Certification in version control and collaboration with Git." },
  ai: { period: "OCT 17, 2026", title: "AI Agents in Practice Immersion", description: "Participation in a practical immersion on Artificial Intelligence agents." },
  python: { period: "OCT 30, 2026", title: "Python for Data Science, AI & Development", description: "Certification in Python applied to data science, AI and development." },
};

export function ExperienceShowcase({ profile }: { profile: Profile }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<(typeof records)[number]["id"]>("mobile");
  const active = records.find((record) => record.id === activeId) ?? records[0];
  const Icon = active.icon;
  const { language, t } = usePortfolioLanguage();
  const localizeRecord = (record: (typeof records)[number]) => language === "en" ? { ...record, ...recordEnglish[record.id] } : record;
  const activeContent = localizeRecord(active);
  const academicTitle = language === "en" ? "Software Engineering" : profile.education;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let frame = 0;
    const updateProgress = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const start = window.innerHeight * 0.86;
      const end = -rect.height + window.innerHeight * 0.2;
      const progress = Math.max(0, Math.min(1, (start - rect.top) / Math.max(start - end, 1)));
      section.style.setProperty("--timeline-progress", progress.toFixed(3));
      const recordIndex = Math.min(records.length - 1, Math.floor(progress * records.length));
      setActiveId((current) => current === records[recordIndex].id ? current : records[recordIndex].id);
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(updateProgress); };
    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (frame) window.cancelAnimationFrame(frame); };
  }, []);

  return (
    <section id="experience" className="classic-section experience-exhibit-section" ref={sectionRef} style={{ "--timeline-progress": 0 } as CSSProperties}>
      <div className="classic-container">
        <div className="classic-section-heading"><div><p className="classic-kicker">{t.education.kicker}</p><h2>{t.education.title} <em>{t.education.emphasis}</em></h2></div><span className="classic-count">{t.education.record}</span></div>
        <div className="experience-exhibit">
          <div className="experience-timeline" aria-label={language === "en" ? "Education timeline" : "Línea de tiempo de formación"}>
            <div className="experience-timeline-line" aria-hidden="true"><i /></div>
            {records.map((record, index) => { const ItemIcon = record.icon; const content = localizeRecord(record); return <button type="button" role="tab" aria-selected={activeId === record.id} className={`experience-timeline-item ${activeId === record.id ? "is-active" : ""}`} onClick={() => setActiveId(record.id)} key={record.id}><span className="experience-timeline-index">{String(index + 1).padStart(2, "0")}</span><span className="experience-timeline-node"><ItemIcon size={17} /></span><span><small>{content.period}</small><strong>{content.title}</strong></span></button>; })}
          </div>
          <article className="experience-record" key={active.id}>
            <div className="experience-record-icon"><Icon size={27} strokeWidth={1.25} /></div>
            <p className="classic-project-index">{activeContent.period}</p>
            <h3>{activeContent.title}</h3>
            <p>{active.id === "academic" ? `${t.education.text} ${academicTitle} · ${active.issuer}. ${activeContent.description}` : activeContent.description}</p><div className="experience-record-meta"><span>{active.id === "academic" ? <><MapPin size={14} /> {t.education.location}</> : <><Award size={14} /> {active.issuer}</>}</span>{active.id === "academic" ? <span><BookOpen size={14} /> {t.education.current}</span> : active.pdf ? <a href={active.pdf} target="_blank" rel="noreferrer"><ExternalLink size={14} /> PDF</a> : <span>{active.issuer}</span>}</div>
          </article>
        </div>
      </div>
    </section>
  );
}
