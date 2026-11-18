"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink, GitBranch, MapPin, PawPrint, Play, Watch } from "lucide-react";
import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { Project } from "@/types/portfolio";
import { usePortfolioLanguage } from "@/components/portfolio-language";
import { getYouTubeEmbedUrl } from "@/lib/youtube";

const projectCopy = {
  es: {
    LULLABY: "Videojuego 3D roguelike de terror psicológico donde Noah, un bebé atrapado en una pesadilla, enfrenta criaturas nacidas de juguetes y recuerdos familiares usando sus lágrimas como defensa.",
    "AnatomyLab AI": "Aplicación de escritorio para estudiar anatomía humana mediante modelos 3D interactivos, fichas educativas, estudio guiado, quizzes y seguimiento del progreso.",
    PetLink: "Ecosistema móvil colaborativo para reportar animales de compañía extraviados o encontrados, explorar reportes geoespaciales, recibir alertas y cruzar coincidencias por proximidad y similitud física.",
    ParkWatch: "Aplicación standalone para Wear OS que registra, ubica y gestiona el estacionamiento de automóviles, motocicletas, bicicletas o scooters, completamente offline.",
  },
  en: {
    LULLABY: "A 3D psychological horror roguelike where Noah, a baby trapped in a nightmare, faces creatures born from toys and family memories using his tears as defense.",
    "AnatomyLab AI": "A desktop application for studying human anatomy through interactive 3D models, educational cards, guided study, quizzes and progress tracking.",
    PetLink: "A collaborative mobile ecosystem for reporting lost or found companion animals, exploring geospatial reports, receiving alerts and matching sightings through proximity and physical similarity.",
    ParkWatch: "A standalone Wear OS application for recording, locating and managing parking for cars, motorcycles, bicycles or scooters, fully offline.",
  },
} as const;

function ProjectArtwork({ project, language }: { project: Project; language: "es" | "en" }) {
  const [playing, setPlaying] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const embedUrl = project.demo ? getYouTubeEmbedUrl(project.demo) : null;
  if (embedUrl) {
    if (playing) {
      return <>
        {!videoLoaded && <div className="project-video-loading" role="status" aria-live="polite"><span aria-hidden="true" />{language === "es" ? "Cargando reproductor…" : "Loading player…"}</div>}
        <iframe className={`project-feature-youtube ${videoLoaded ? "is-loaded" : ""}`} src={embedUrl} title={`${language === "es" ? "Demo de" : "Demo of"} ${project.name}`} onLoad={() => setVideoLoaded(true)} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
      </>;
    }
    return (
      <button type="button" className={`project-video-launch ${project.name === "PetLink" ? "project-video-launch-petlink" : project.name === "ParkWatch" ? "project-video-launch-parkwatch" : ""}`} onClick={() => setPlaying(true)} aria-label={`${language === "es" ? "Reproducir demo de" : "Play demo of"} ${project.name}`}>
        {project.cover && <Image src={project.cover} alt="" fill sizes="(max-width: 760px) 92vw, 64vw" />}
        <span className="project-video-play" aria-hidden="true"><Play size={21} fill="currentColor" /></span>
        <span className="project-video-prompt">{language === "es" ? "REPRODUCIR DEMO" : "PLAY PROJECT DEMO"}</span>
      </button>
    );
  }
  if (project.cover) {
    return <Image src={project.cover} alt={`Vista de ${project.name}`} fill sizes="(max-width: 760px) 92vw, 64vw" />;
  }
  if (project.name === "PetLink") {
    return (
      <div className="project-abstract-media project-abstract-petlink" aria-hidden="true">
        <div className="petlink-map-grid" />
        <div className="petlink-route"><i /><i /><i /></div>
        <div className="petlink-map-label petlink-map-label-a"><PawPrint size={17} /> ENCUENTRO</div>
        <div className="petlink-map-label petlink-map-label-b"><PawPrint size={17} /> REPORTE</div>
        <div className="petlink-map-pin"><MapPin size={43} strokeWidth={1.2} /><PawPrint size={15} /></div>
        <span className="petlink-wordmark">PetLink<span>+</span></span>
      </div>
    );
  }
  if (project.name === "ParkWatch") {
    return (
      <div className="project-abstract-media project-abstract-parkwatch" aria-hidden="true">
        <div className="parkwatch-halo parkwatch-halo-a" />
        <div className="parkwatch-halo parkwatch-halo-b" />
        <div className="parkwatch-strap" />
        <div className="parkwatch-device">
          <div className="parkwatch-screen-top"><Watch size={13} /> PARKWATCH</div>
          <div className="parkwatch-parking-mark">P</div>
          <div className="parkwatch-screen-line"><i /><i /><i /></div>
        </div>
      </div>
    );
  }
  return <div className="project-abstract-media" aria-hidden="true"><span>{project.name.slice(0, 2)}</span><i /><i /><i /></div>;
}

export function ProjectShowcase({ projects }: { projects: Project[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"next" | "previous">("next");
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const { language, t } = usePortfolioLanguage();
  const project = projects[activeIndex] ?? projects[0];
  if (!project) return null;
  const tone = ["violet", "cyan", "amber", "mint"][activeIndex % 4];
  const moveToProject = (index: number, focus = false) => {
    const nextIndex = (index + projects.length) % projects.length;
    if (nextIndex === activeIndex) {
      if (focus) document.getElementById(`project-tab-${nextIndex}`)?.focus();
      return;
    }
    const movingForward = (activeIndex === projects.length - 1 && nextIndex === 0) || nextIndex === activeIndex + 1;
    setSlideDirection(movingForward ? "next" : "previous");
    setActiveIndex(nextIndex);
    if (focus) {
      window.requestAnimationFrame(() => {
        document.getElementById(`project-tab-${nextIndex}`)?.focus();
      });
    }
  };
  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveToProject(index + 1, true);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveToProject(index - 1, true);
    } else if (event.key === "Home") {
      event.preventDefault();
      moveToProject(0, true);
    } else if (event.key === "End") {
      event.preventDefault();
      moveToProject(projects.length - 1, true);
    }
  };
  const startProjectSwipe = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") touchStartRef.current = { x: event.clientX, y: event.clientY };
  };
  const finishProjectSwipe = (event: PointerEvent<HTMLElement>) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start || event.pointerType !== "touch") return;
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return;
    moveToProject(activeIndex + (deltaX < 0 ? 1 : -1));
  };

  return (
    <div className="project-experience">
      <aside className="project-index-rail" aria-label={t.projects.index}>
        <span className="project-index-label">{t.projects.index}</span>
        <div className="project-index-list" role="tablist">
          {projects.map((item, index) => (
            <button type="button" role="tab" id={`project-tab-${index}`} aria-controls="project-panel" aria-selected={activeIndex === index} tabIndex={activeIndex === index ? 0 : -1} className={`project-index-button ${activeIndex === index ? "is-active" : ""}`} onClick={() => moveToProject(index)} onKeyDown={(event) => handleTabKeyDown(event, index)} key={item.name}>
              <span>0{index + 1}</span>
              <strong>{item.name}</strong>
              <i aria-hidden="true">↗</i>
            </button>
          ))}
        </div>
        <div className="project-index-foot"><span>{t.projects.select}</span><span>↑ ↓</span></div>
      </aside>

      <article id="project-panel" role="tabpanel" aria-labelledby={`project-tab-${activeIndex}`} tabIndex={0} className={`project-feature project-feature-${tone} project-feature-${slideDirection}`} key={project.name} onPointerDown={startProjectSwipe} onPointerUp={finishProjectSwipe} onPointerCancel={() => { touchStartRef.current = null; }}>
        <div className="project-feature-media">
          <ProjectArtwork project={project} language={language} />
          <div className="project-feature-scan" aria-hidden="true" />
          <div className="project-feature-navigation" aria-label={language === "es" ? "Navegación de proyectos" : "Project navigation"}>
            <span>{String(activeIndex + 1).padStart(2, "0")} <i>/</i> {String(projects.length).padStart(2, "0")}</span>
            <div>
              <button type="button" aria-label={language === "es" ? "Proyecto anterior" : "Previous project"} onClick={() => moveToProject(activeIndex - 1)}><ArrowLeft size={16} /></button>
              <button type="button" aria-label={language === "es" ? "Proyecto siguiente" : "Next project"} onClick={() => moveToProject(activeIndex + 1)}><ArrowRight size={16} /></button>
            </div>
          </div>
        </div>
        <div className="project-feature-content">
          <div className="project-feature-heading">
            <div><h3>{project.name}</h3></div>
            <span className="project-feature-status"><i />{language === "es" ? "DEMO DISPONIBLE" : "DEMO AVAILABLE"}</span>
          </div>
          <p>{projectCopy[language][project.name as keyof typeof projectCopy.es] ?? project.description}</p>
          <div className="project-feature-bottom"><div className="classic-tags">{project.stack.map((item) => <span key={item}>{item}</span>)}</div><div className="project-feature-links">{project.repository ? <a href={project.repository} target="_blank" rel="noreferrer"><GitBranch size={14} /> {t.projects.code} <ArrowUpRight size={13} /></a> : <span className="project-link-muted"><GitBranch size={14} /> {t.projects.pendingCode}</span>}{project.demo ? <a href={project.demo} target="_blank" rel="noreferrer"><ExternalLink size={14} /> {t.projects.demo} <ArrowUpRight size={13} /></a> : <span className="project-link-muted"><ExternalLink size={14} /> {t.projects.pendingDemo}</span>}</div></div>
        </div>
      </article>
    </div>
  );
}
