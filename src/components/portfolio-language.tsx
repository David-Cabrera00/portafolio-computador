"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

export type PortfolioLanguage = "es" | "en";

const copy = {
  es: {
    nav: { hero: "Inicio", about: "Sobre mí", skills: "Habilidades", education: "Formación", projects: "Proyectos", testimonials: "Testimonios", contact: "Contacto", os: "Abrir DEV OS ↗" },
    language: "Cambiar idioma",
    hero: { title: "Construyendo software con", emphasis: "rigor, lógica y propósito.", lead: "Soy estudiante de Ingeniería de Software, amante del deporte y la tecnología. Me dedico al desarrollo web integral y trabajo con frameworks y herramientas modernas como React, Next.js, Tailwind CSS, Django, Spring Boot, Node.js, PostgreSQL y soluciones con Inteligencia Artificial.", explore: "Explorar trabajo", cv: "Descargar CV", github: "Abrir GitHub", linkedin: "Abrir LinkedIn" },
    about: { kicker: "01 / SOBRE MÍ", title: "Transformando ideas complejas en", emphasis: "experiencias digitales de alto impacto.", identityTitle: "Transformando ideas complejas en experiencias digitales de alto impacto.", identityText: "¡Hola! Soy David Andrés Cabrera, desarrollador web apasionado por crear soluciones tecnológicas que marquen la diferencia. Me especializo en transformar ideas en experiencias digitales: desde sitios web limpios hasta aplicaciones interactivas complejas.\n\nMi prioridad es construir productos rápidos, accesibles y visualmente atractivos, aplicando siempre las mejores prácticas del sector, arquitecturas robustas y código sostenible y escalable.", tabs: ["IDENTIDAD", "PROCESO", "FUERA DEL CÓDIGO"], signal: "SEÑAL DE PERFIL", formation: "FORMACIÓN", availability: "DISPONIBILIDAD", contact: "CONTACTO", processTitle: "Pienso antes de construir.", processText: "Exploro una idea, ordeno el problema y luego convierto esa intención en una interfaz o producto que pueda funcionar de verdad.", outsideTitle: "El código no es todo lo que soy.", outsideText: "El fútbol, las personas y la curiosidad cotidiana también alimentan la forma en que observo, diseño y resuelvo problemas." },
    skills: { kicker: "02 / HABILIDADES & CERTIFICACIONES", title: "No son porcentajes.", emphasis: "Es el lenguaje con el que construyo.", count: "tecnologías", explore: "Explorar habilidades", archive: "CERTIFICACIONES", archiveTitle: "Lo que todavía está por documentar", archiveEmphasis: "también forma parte del proceso." },
    education: { kicker: "03 / FORMACIÓN", title: "Lo que estoy aprendiendo", emphasis: "también construye mi historia.", record: "FORMACIÓN", current: "En curso", text: "Actualmente estudio", location: "Colombia" },
    projects: { kicker: "04 / PROYECTOS", title: "No son ejercicios.", emphasis: "Son mundos que estoy construyendo.", index: "ÍNDICE / TRABAJO", select: "SELECCIONAR", type: "TIPO", state: "ESTADO", code: "Código", pendingCode: "Código pendiente", demo: "Ver demo", pendingDemo: "Ver demo" },
    testimonials: { kicker: "05 / TESTIMONIOS", title: "La colaboración", emphasis: "también cuenta.", count: "REAL / POR CONFIRMAR", status: "REFERENCIAS PENDIENTES", titleCard: "Aún no hay testimonios publicados.", text: "Prefiero mostrar referencias reales y autorizadas antes que llenar este espacio con citas inventadas.", source: "Se añadirá cuando exista una referencia verificable." },
    contact: { mark: "06", kicker: "CONTACTO / CANAL ABIERTO", title: "¿Hablamos sobre", emphasis: "una idea que merezca construirse?", text: "Estoy disponible para conversar sobre proyectos de software, prácticas, colaboraciones o una oportunidad donde pueda seguir creciendo.", available: "DISPONIBLE", email: "CORREO ELECTRÓNICO", location: "UBICACIÓN", remote: "Disponible para entornos remotos y colaboraciones.", copy: "Copiar", copied: "Copiado", form: "MENSAJE / 001", ready: "MAILTO LISTO", name: "Nombre completo", emailLabel: "Correo de contacto", subject: "Asunto", message: "Mensaje", send: "Enviar mensaje", status: "Te responderé lo antes posible.", fallback: "Copia el correo manualmente o usa el formulario.", opening: "Abriendo tu cliente de correo..." },
    footer: { navigation: "NAVEGACIÓN", channels: "CANALES & REDES", formation: "Formación", certifications: "Habilidades & certificaciones", made: "Hecho con intención por David Cabrera.", back: "Volver al inicio ↑" },
  },
  en: {
    nav: { hero: "Home", about: "About", skills: "Skills", education: "Education", projects: "Projects", testimonials: "Testimonials", contact: "Contact", os: "Open DEV OS ↗" },
    language: "Change language",
    hero: { title: "Building software with", emphasis: "rigor, logic and purpose.", lead: "I am a Software Engineering student, passionate about sports and technology. I build end-to-end web experiences with modern frameworks and tools such as React, Next.js, Tailwind CSS, Django, Spring Boot, Node.js, PostgreSQL and Artificial Intelligence solutions.", explore: "Explore work", cv: "Download CV", github: "Open GitHub", linkedin: "Open LinkedIn" },
    about: { kicker: "01 / ABOUT", title: "Turning complex ideas into", emphasis: "high-impact digital experiences.", identityTitle: "Turning complex ideas into high-impact digital experiences.", identityText: "Hi! I am David Andrés Cabrera, a web developer passionate about creating technology solutions that make a difference. I specialize in turning ideas into digital experiences: from clean websites to complex interactive applications.\n\nMy priority is building fast, accessible and visually engaging products through solid practices, robust architectures and sustainable, scalable code.", tabs: ["IDENTITY", "PROCESS", "BEYOND CODE"], signal: "PROFILE SIGNAL", formation: "EDUCATION", availability: "AVAILABILITY", contact: "CONTACT", processTitle: "I think before I build.", processText: "I explore an idea, bring structure to the problem and turn that intent into an interface or product that can truly work.", outsideTitle: "Code is not all that I am.", outsideText: "Football, people and everyday curiosity also shape how I observe, design and solve problems." },
    skills: { kicker: "02 / SKILLS & CERTIFICATIONS", title: "Not percentages.", emphasis: "The language I use to build.", count: "technologies", explore: "Explore skills", archive: "CERTIFICATIONS", archiveTitle: "What is still being documented", archiveEmphasis: "is also part of the process." },
    education: { kicker: "03 / EDUCATION", title: "What I am learning", emphasis: "also builds my story.", record: "EDUCATION", current: "In progress", text: "Currently studying", location: "Colombia" },
    projects: { kicker: "04 / PROJECTS", title: "Not exercises.", emphasis: "Worlds I am building.", index: "INDEX / WORK", select: "SELECT", type: "TYPE", state: "STATE", code: "Code", pendingCode: "Code pending", demo: "Watch demo", pendingDemo: "Watch demo" },
    testimonials: { kicker: "05 / TESTIMONIALS", title: "Collaboration", emphasis: "also matters.", count: "REAL / TO CONFIRM", status: "REFERENCES PENDING", titleCard: "No testimonials published yet.", text: "I would rather show real, authorized references than fill this space with invented quotes.", source: "It will be added when a verifiable reference is available." },
    contact: { mark: "06", kicker: "CONTACT / OPEN CHANNEL", title: "Shall we talk about", emphasis: "an idea worth building?", text: "I am available to discuss software projects, internships, collaborations or an opportunity where I can keep growing.", available: "AVAILABLE", email: "EMAIL", location: "LOCATION", remote: "Available for remote environments and collaborations.", copy: "Copy", copied: "Copied", form: "MESSAGE / 001", ready: "MAILTO READY", name: "Full name", emailLabel: "Contact email", subject: "Subject", message: "Message", send: "Send message", status: "I will get back to you as soon as possible.", fallback: "Copy the email manually or use the form.", opening: "Opening your email client..." },
    footer: { navigation: "NAVIGATION", channels: "CHANNELS & SOCIAL", formation: "Education", certifications: "Skills & certifications", made: "Made with intention by David Cabrera.", back: "Back to top ↑" },
  },
} as const;

type PortfolioCopy = (typeof copy)[PortfolioLanguage];
const LanguageContext = createContext<{ language: PortfolioLanguage; setLanguage: (language: PortfolioLanguage) => void; toggleLanguage: () => void; t: PortfolioCopy } | null>(null);

export function PortfolioLanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<PortfolioLanguage>("es");
  const hydrated = useRef(false);
  useEffect(() => {
    const stored = window.localStorage.getItem("portfolio-language");
    const frame = window.requestAnimationFrame(() => {
      hydrated.current = true;
      const nextLanguage = stored === "en" || stored === "es" ? stored : "es";
      document.documentElement.lang = nextLanguage;
      setLanguage(nextLanguage);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (!hydrated.current) return;
    window.localStorage.setItem("portfolio-language", language);
    document.documentElement.lang = language;
  }, [language]);
  const value = useMemo(() => ({ language, setLanguage, toggleLanguage: () => setLanguage((current) => current === "es" ? "en" : "es"), t: copy[language] }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function usePortfolioLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("usePortfolioLanguage must be used inside PortfolioLanguageProvider");
  return value;
}
