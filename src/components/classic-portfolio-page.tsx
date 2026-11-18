"use client";

import Link from "next/link";
import { profile, projects, skillGroups } from "@/data/profile";
import { ScrollProgress, ScrollReveal } from "@/components/classic-motion";
import { CertificateShowcase, SkillsShowcase } from "@/components/classic-showcase";
import { ProjectShowcase } from "@/components/project-showcase";
import { PortfolioHero } from "@/components/portfolio-hero";
import { AboutShowcase } from "@/components/about-showcase";
import { ExperienceShowcase } from "@/components/experience-showcase";
import { PortfolioNav } from "@/components/portfolio-nav";
import { ContactShowcase } from "@/components/contact-showcase";
import { TestimonialsShowcase } from "@/components/testimonials-showcase";
import { PortfolioLanguageProvider, usePortfolioLanguage } from "@/components/portfolio-language";

export function ClassicPortfolioPage() {
  return <PortfolioLanguageProvider><PortfolioPageContent /></PortfolioLanguageProvider>;
}

function PortfolioPageContent() {
  const { language, t } = usePortfolioLanguage();
  const skills = Object.values(skillGroups).flat();
  const skillEntries = Object.entries(skillGroups);
  return (
    <main id="top" className="classic-page">
      <ScrollProgress />
      <PortfolioNav />
      <PortfolioHero profile={profile} />
      <ScrollReveal><AboutShowcase profile={profile} /></ScrollReveal>
      <ScrollReveal><section id="skills-certifications" className="classic-section classic-section-muted"><div className="classic-container"><div className="classic-section-heading"><div><p className="classic-kicker">{t.skills.kicker}</p><h2>{t.skills.title} <em>{t.skills.emphasis}</em></h2></div><span className="classic-count">{String(skills.length).padStart(2, "0")} {t.skills.count}</span></div><SkillsShowcase skillEntries={skillEntries} /><div className="classic-certification-heading"><div><p className="classic-kicker">{t.skills.certificationsLabel}</p><h3>{t.skills.certificationsTitle} <em>{t.skills.certificationsEmphasis}</em></h3></div><span className="classic-count">05 {t.skills.credentialsCount}</span></div><CertificateShowcase /></div></section></ScrollReveal>
      <ScrollReveal><ExperienceShowcase profile={profile} /></ScrollReveal>
      <ScrollReveal><section id="projects" className="classic-section classic-section-projects"><div className="classic-container"><div className="classic-section-heading"><div><p className="classic-kicker">{t.projects.kicker}</p><h2>{t.projects.title} <em>{t.projects.emphasis}</em></h2></div></div><ProjectShowcase projects={projects} /></div></section></ScrollReveal>
      <ScrollReveal><TestimonialsShowcase /></ScrollReveal>
      <ScrollReveal><ContactShowcase profile={profile} /></ScrollReveal>
      <footer className="classic-footer"><div className="classic-container classic-footer-grid"><div className="classic-footer-brand"><a href="#top" className="classic-footer-logo">DC</a><strong>{profile.name}</strong><p>{t.hero.lead}</p></div><div><p className="classic-footer-heading">{t.footer.navigation}</p><nav className="classic-footer-links"><a href="#top">{t.nav.hero}</a><a href="#about">{t.nav.about}</a><a href="#projects">{t.nav.projects}</a><a href="#experience">{t.footer.formation}</a><a href="#skills-certifications">{t.footer.certifications}</a><a href="#contact">{t.nav.contact}</a></nav></div><div><p className="classic-footer-heading">{t.footer.channels}</p><nav className="classic-footer-links"><a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a><a href={`mailto:${profile.email}`}>Email ↗</a><a href={language === "en" ? "/portfolio/assets/cv/cv-en.pdf" : "/portfolio/assets/cv/cv.pdf"} target="_blank" rel="noreferrer">CV (PDF) ↗</a><Link href="/dev-os">DEV OS ↗</Link></nav></div></div><div className="classic-container classic-footer-bottom"><span>{t.footer.made}</span><a href="#top">{t.footer.back}</a></div></footer>
    </main>
  );
}
