"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FileText,
  Folder,
  BookOpen,
  BriefcaseBusiness,
  Mail,
  Monitor,
  Settings,
  Terminal,
  UserRound,
  Wrench,
  X,
  Minus,
  Maximize2,
  Minimize2,
  Power,
  Activity,
  Command,
  Search,
  Trash2,
  RefreshCw,
  AlignJustify,
  FolderOpen,
  ExternalLink,
  ArrowLeft,
  ChevronRight,
  Download,
  FileBadge2,
  FileCode2,
  GraduationCap,
  Play,
} from "lucide-react";
import { profile, projects, skillGroups } from "@/data/profile";
import { executeTerminalCommand, terminalCommands } from "@/lib/terminal";
import { playSystemSound } from "@/lib/system-sounds";
import { getYouTubeEmbedUrl } from "@/lib/youtube";
import type { Project } from "@/types/portfolio";
import { AppId, useOSStore } from "@/store/os-store";

const apps: { id: AppId; label: string; icon: typeof UserRound }[] = [
  { id: "about", label: "Sobre mí", icon: UserRound },
  { id: "projects", label: "Proyectos", icon: Folder },
  { id: "skills", label: "Habilidades", icon: Wrench },
  { id: "experience", label: "Experiencia", icon: BriefcaseBusiness },
  { id: "education", label: "Educación", icon: BookOpen },
  { id: "terminal", label: "Terminal", icon: Terminal },
  { id: "files", label: "Archivos", icon: FileText },
  { id: "contact", label: "Contacto", icon: Mail },
  { id: "settings", label: "Ajustes", icon: Settings },
];
const windowIcons: Record<AppId, typeof UserRound> = Object.fromEntries(
  apps.map((app) => [app.id, app.icon]),
) as Record<AppId, typeof UserRound>;
type IconPosition = { x: number; y: number };
type IconPositions = Record<AppId, IconPosition>;
type DesktopSelection = AppId | "recycle" | null;

const defaultIconPositions = apps.reduce((positions, app, index) => {
  positions[app.id] = {
    x: index % 2 === 0 ? 2 : 10,
    y: 2 + Math.floor(index / 2) * 17,
  };
  return positions;
}, {} as IconPositions);

const iconPositionsKey = "dev-os-icon-positions";
const iconLayoutVersionKey = "dev-os-icon-layout-version";
const iconLayoutVersion = "2";
const iconSlots = Object.values(defaultIconPositions);

function YouTubeProjectDemo({ project }: { project: Project }) {
  const [playing, setPlaying] = useState(false);
  const embedUrl = project.demo ? getYouTubeEmbedUrl(project.demo) : null;
  if (!embedUrl) return null;

  if (playing) {
    return <iframe className="os-project-youtube" src={embedUrl} title={`Demo de ${project.name}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />;
  }

  return (
    <button type="button" className="os-project-youtube-launch" onClick={() => setPlaying(true)} aria-label={`Reproducir demo de ${project.name}`}>
      {project.cover && <Image src={project.cover} alt="" fill sizes="(max-width: 760px) 90vw, 60vw" />}
      <span className="project-video-play" aria-hidden="true"><Play size={21} fill="currentColor" /></span>
      <span className="project-video-prompt">REPRODUCIR DEMO</span>
    </button>
  );
}

function nearestIconSlot(position: IconPosition) {
  return iconSlots.reduce((closest, slot) => {
    const distance = Math.hypot(slot.x - position.x, slot.y - position.y);
    const closestDistance = Math.hypot(
      closest.x - position.x,
      closest.y - position.y,
    );
    return distance < closestDistance ? slot : closest;
  }, iconSlots[0]);
}

function AppContent({ id }: { id: AppId }) {
  const openWindow = useOSStore((s) => s.openWindow);
  const content =
    id === "about" ? (
      <AboutPanel onOpen={openWindow} />
    ) : id === "projects" ? (
      <ProjectsPanel />
    ) : id === "skills" ? (
      <SkillsPanel />
    ) : id === "experience" ? (
      <ExperiencePanel />
    ) : id === "education" ? (
      <EducationPanel />
    ) : id === "contact" ? (
      <ContactPanel />
    ) : id === "files" ? (
      <FilesPanel onOpen={openWindow} />
    ) : id === "settings" ? (
      <SettingsPanel />
    ) : (
      <TerminalPanel onOpen={openWindow} />
    );
  return <div className="app-content">{content}</div>;
}

function AppPanelHeader({ eyebrow, title, description, meta }: { eyebrow: string; title: string; description: string; meta?: string }) {
  return (
    <div className="app-panel-header">
      <div>
        <p className="mono app-panel-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p className="app-panel-description">{description}</p>
      </div>
      {meta && <span className="app-panel-meta">{meta}</span>}
    </div>
  );
}

function SkillsPanel() {
  const groups = Object.entries(skillGroups);
  type SkillGroup = keyof typeof skillGroups;
  const groupNames = Object.keys(skillGroups) as SkillGroup[];
  const [activeGroup, setActiveGroup] = useState<SkillGroup>(groupNames[0] ?? "Backend");
  const [skillQuery, setSkillQuery] = useState("");
  const activeSkills = skillGroups[activeGroup].filter((skill) =>
    skill.toLowerCase().includes(skillQuery.toLowerCase()),
  );
  return (
    <div className="space-y-5">
      <AppPanelHeader eyebrow="CAPABILITY MAP / 04" title="Herramientas para construir." description="Una vista rápida de las tecnologías registradas en el perfil." meta={`${String(Object.values(skillGroups).flat().length).padStart(2, "0")} SKILLS`} />
      <div className="flex flex-wrap gap-2 border-b border-[var(--line)] pb-3">
        {groups.map(([group, skills]) => (
          <button
            type="button"
            key={group}
            onClick={() => setActiveGroup(group as SkillGroup)}
            className={`focus-ring rounded-lg px-3 py-2 text-xs transition ${activeGroup === group ? "bg-[var(--blue)] text-[#08101c]" : "border border-[var(--line)] text-[var(--muted)] hover:text-white"}`}
          >
            {group} <span className="ml-1 opacity-60">{skills.length}</span>
          </button>
        ))}
      </div>
      <label className="sr-only" htmlFor="skill-search">Filtrar habilidades</label>
      <input
        id="skill-search"
        value={skillQuery}
        onChange={(event) => setSkillQuery(event.target.value)}
        placeholder="Filtrar tecnologías…"
        className="focus-ring w-full rounded-lg border border-[var(--line)] bg-[#0d1421] px-3 py-2 text-sm text-white placeholder:text-[#71809a]"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {activeSkills.map((skill, index) => (
          <div key={skill} className="app-interactive-card rounded-xl border border-[var(--line)] bg-black/20 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium text-white">{skill}</span>
              <span className="mono text-[10px] text-[#71809a]">{String(index + 1).padStart(2, "0")}</span>
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#202b40]">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[var(--blue)] to-[var(--mint)]" />
            </div>
            <p className="mt-2 text-[10px] text-[#71809a]">Registrado en el perfil · nivel por confirmar</p>
          </div>
        ))}
      </div>
      {activeSkills.length === 0 && (
        <p className="app-detail rounded-xl border border-dashed border-[var(--line)] p-4 text-sm text-[var(--muted)]">
          No hay tecnologías que coincidan con “{skillQuery}”.
        </p>
      )}
    </div>
  );
}

function ExperiencePanel() {
  return (
    <div className="experience-app space-y-5">
      <AppPanelHeader eyebrow="CAREER / 03" title="Una trayectoria en construcción." description="Registro profesional actual. La experiencia laboral se completa cuando haya información confirmada." meta="01 RECORD" />
      <div className="experience-ledger">
        <div className="experience-ledger-rail"><span /><i /></div>
        <article className="experience-ledger-entry">
          <div className="experience-entry-top"><span>ESTADO ACTUAL</span><span className="experience-status"><i /> EN FORMACIÓN</span></div>
          <h3>{profile.experience}</h3>
          <p>Este espacio queda preparado para añadir cargos, organizaciones y periodos verificables.</p>
          <div className="experience-entry-meta"><span>COLOMBIA</span><span>DISPONIBLE PARA COLABORAR</span></div>
        </article>
      </div>
    </div>
  );
}

function EducationPanel() {
  const certificates = [
    { title: "Desarrollo de Aplicaciones móviles desde Cero", issuer: "Universidad Mariana", date: "2021", href: "/portfolio/certificates/mobile-development.pdf" },
    { title: "Introduction to SQL", issuer: "DataCamp", date: "26 AGO 2026", href: "/portfolio/certificates/datacamp-sql.pdf" },
    { title: "Introduction to Git", issuer: "DataCamp", date: "28 AGO 2026", href: "/portfolio/certificates/datacamp-git.pdf" },
    { title: "Inmersión Agentes de IA en la Práctica", issuer: "DAXUS LATAM", date: "17 OCT 2026" },
    { title: "Python for Data Science, AI & Development", issuer: "IBM / Coursera", date: "30 OCT 2026", href: "/portfolio/certificates/ibm-python-data-science.pdf" },
  ];
  return (
    <div className="education-app space-y-5">
      <AppPanelHeader eyebrow="EDUCATION / 06" title="Formación y certificaciones." description="Estudios y cursos registrados en orden cronológico." meta="2021 — ACTUALIDAD" />
      <article className="education-degree"><div className="education-degree-mark"><BookOpen size={20} /></div><div><span>2024 — ACTUALIDAD · EN CURSO</span><h3>{profile.education}</h3><p>Ingeniería de Software · Universidad Cooperativa de Colombia</p></div><div className="education-degree-stamp">ACADEMIA<br />ACTIVA</div></article>
      <div className="education-cert-list">{certificates.map((certificate, index) => <div className="education-cert-row" key={certificate.title}><span className="education-cert-index">{String(index + 1).padStart(2, "0")}</span><div className="education-cert-copy"><strong>{certificate.title}</strong><small>{certificate.issuer}</small></div><time>{certificate.date}</time>{certificate.href ? <a href={certificate.href} target="_blank" rel="noreferrer" aria-label={`Abrir certificado ${certificate.title}`}><ExternalLink size={15} /></a> : <span className="education-cert-no-pdf">VISTA</span>}</div>)}</div>
    </div>
  );
}

function AboutPanel({ onOpen }: { onOpen: (id: AppId) => void }) {
  const facts = [
    ["BASE", profile.location],
    ["FOCUS", profile.role],
    ["AVAILABILITY", profile.availability],
    ["PROJECTS", String(projects.length).padStart(2, "0")],
    ["STACK GROUPS", String(Object.keys(skillGroups).length).padStart(2, "0")],
  ];
  return (
    <div className="space-y-5">
      <div className="app-profile-intro">
        <div><p className="mono app-panel-eyebrow">PROFILE / 01</p><h2>{profile.name}</h2><p className="app-profile-role">{profile.role}</p></div>
        <span className="app-profile-live"><i /> AVAILABLE</span>
        <p className="app-profile-tagline">{profile.tagline}</p>
      </div>
      <div className="os-about-gallery" aria-label="Galería personal">
        <div className="os-about-gallery-main">
          <Image src="/portfolio/assets/foto2.jpeg" alt={`Retrato de ${profile.name}`} width={920} height={920} priority={false} />
          <span className="os-gallery-label">PROFILE / FIELD NOTE</span>
        </div>
        <div className="os-about-gallery-side">
          <div><Image src="/portfolio/assets/futbol.jpeg" alt="David jugando fútbol" width={600} height={600} /><span>DEPORTE</span></div>
          <div><Image src="/portfolio/assets/novia.jpeg" alt="David en un momento personal" width={600} height={600} /><span>FUERA DEL CÓDIGO</span></div>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-5">
        {facts.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-[var(--line)] bg-black/20 p-3">
            <p className="mono text-[9px] tracking-[.16em] text-[#71809a]">{label}</p>
            <p className="mt-2 truncate text-xs text-white" title={value}>{value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-[var(--line)] bg-black/20 p-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--mint)]" />
          <span className="mono text-xs text-[var(--mint)]">STATUS / AVAILABLE</span>
        </div>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{profile.bio}</p>
        <p className="mt-3 text-xs text-[#71809a]">
          Los datos editables están centralizados en <code>src/data/profile.ts</code>.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onOpen("projects")}
          className="focus-ring rounded-lg bg-[var(--mint)] px-4 py-2 text-sm text-[#08101c]"
        >
          Ver proyectos
        </button>
        <button
          type="button"
          onClick={() => onOpen("contact")}
          className="focus-ring rounded-lg border border-[var(--line)] px-4 py-2 text-sm text-white"
        >
          Abrir contacto
        </button>
      </div>
    </div>
  );
}

function ProjectsPanel() {
  const [query, setQuery] = useState("");
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const openWindow = useOSStore((s) => s.openWindow);
  const visible = projects.filter((project) =>
    `${project.name} ${project.description} ${project.stack.join(" ")}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const selected = projects.find((project) => project.name === selectedName);
  return (
    <div className="space-y-3">
      <AppPanelHeader eyebrow="PROJECT INDEX / 02" title="Casos que ya están construidos." description="Explora el trabajo registrado en este workspace." meta={`${String(visible.length).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`} />
      <label className="sr-only" htmlFor="project-search">
        Buscar proyectos
      </label>
      <input
        id="project-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar por nombre o tecnología…"
        className="focus-ring w-full rounded-lg border border-[var(--line)] bg-[#0d1421] px-3 py-2 text-sm text-white placeholder:text-[#71809a]"
      />
      {visible.length === 0 && (
        <p className="rounded-xl border border-[var(--line)] p-4 text-sm text-[var(--muted)]">
          No hay proyectos que coincidan con “{query}”.
        </p>
      )}
      <div className="project-grid">
        {visible.map((p, index) => (
          <button
            type="button"
            key={p.name}
            onClick={() =>
              setSelectedName(selectedName === p.name ? null : p.name)
            }
            aria-expanded={selectedName === p.name}
            className={`project-card group app-interactive-card rounded-xl border bg-[#101725] p-3 text-left transition ${selectedName === p.name ? "border-[var(--blue)]" : "border-[var(--line)] hover:border-[var(--blue)]/60"}`}
          >
            <div className={`project-cover mb-3 overflow-hidden rounded-lg border border-[var(--line)] bg-[linear-gradient(135deg,rgba(120,169,255,.18),rgba(124,227,195,.08))] ${p.name === "PetLink" ? "project-cover-petlink" : ""}`}>
              {p.cover ? (
                <Image
                  src={p.cover}
                  alt={`Captura de ${p.name}`}
                  width={960}
                  height={540}
                  className={`h-full w-full ${p.name === "PetLink" ? "object-contain" : "object-cover transition duration-300 group-hover:scale-[1.04]"}`}
                />
              ) : (
                <div className="project-cover-placeholder">
                  <span className="mono">PROJECT / {String(index + 1).padStart(2, "0")}</span>
                  <span>Preview pendiente</span>
                </div>
              )}
              {p.demo && <span className="project-video-badge"><Play size={11} fill="currentColor" /> DEMO DISPONIBLE</span>}
            </div>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="mono text-[10px] text-[#71809a]">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="font-semibold text-white">{p.name}</h3>
              </div>
              <span className="mono max-w-28 text-right text-[9px] text-[var(--mint)]">{p.status}</span>
            </div>
            <p className="mt-2 line-clamp-3 text-sm leading-5 text-[var(--muted)]">{p.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.stack.slice(0, 4).map((s) => (
                <span key={s} className="rounded-md bg-[#202b40] px-2 py-1 text-[10px] text-[var(--blue)]">
                  {s}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
      {selected && (
        <aside className="app-detail project-detail rounded-xl border border-[var(--blue)]/50 bg-[#162238] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="mono text-[10px] text-[var(--mint)]">PROJECT DETAIL</p>
              <h3 className="mt-2 text-lg">{selected.name}</h3>
            </div>
            <span className="rounded-full border border-[var(--mint)]/40 px-2 py-1 text-[10px] text-[var(--mint)]">
              {selected.status}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {selected.description}
          </p>
          {selected.demo && <div className="os-project-detail-video"><YouTubeProjectDemo project={selected} /></div>}
          <div className="mt-4 flex flex-wrap gap-2">
            {selected.repository ? (
              <a
                href={selected.repository}
                target="_blank"
                rel="noreferrer"
                className="focus-ring inline-flex items-center gap-2 rounded-lg bg-[var(--mint)] px-3 py-2 text-xs text-[#08101c]"
              >
                Repositorio <ExternalLink size={13} />
              </a>
            ) : (
              <span className="rounded-lg border border-dashed border-[var(--line)] px-3 py-2 text-xs text-[#71809a]">
                Repositorio por confirmar
              </span>
            )}
            {selected.demo ? (
              <a
                href={selected.demo}
                target="_blank"
                rel="noreferrer"
                className="focus-ring inline-flex items-center gap-2 rounded-lg border border-[var(--line)] px-3 py-2 text-xs text-[var(--blue)]"
              >
                Ver demo <ExternalLink size={13} />
              </a>
            ) : (
              <span className="rounded-lg border border-dashed border-[var(--line)] px-3 py-2 text-xs text-[#71809a]">
                Ver demo
              </span>
            )}
            <button
              type="button"
              onClick={() => openWindow("contact")}
              className="focus-ring rounded-lg border border-[var(--line)] px-3 py-2 text-xs text-white"
            >
              Preguntar por el proyecto
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}

function ContactPanel() {
  const [status, setStatus] = useState("");
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    if (!name || !message) {
      setStatus("Completa tu nombre y mensaje.");
      return;
    }
    const subject = encodeURIComponent(
      `Contacto desde el portafolio — ${name}`,
    );
    const body = encodeURIComponent(
      `${message}\n\nNombre: ${name}\nCorreo: ${String(form.get("email") ?? "")}`,
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setStatus("Se preparó un correo en tu cliente predeterminado.");
  };
  return (
    <div className="space-y-5 text-sm text-[var(--muted)]">
      <AppPanelHeader eyebrow="COMMUNICATION / CHANNEL" title="Abramos una conversación." description="El formulario prepara un correo en tu cliente predeterminado; no almacena ni simula envíos." meta="MAILTO READY" />
      <form onSubmit={submit} className="contact-form contact-form-grid grid gap-3">
        <input
          name="name"
          required
          placeholder="Tu nombre"
          className="contact-name focus-ring rounded-lg border border-[var(--line)] bg-[#0d1421] px-3 py-2 text-white placeholder:text-[#71809a]"
        />
        <input
          name="email"
          type="email"
          placeholder="Tu correo (opcional)"
          className="contact-email focus-ring rounded-lg border border-[var(--line)] bg-[#0d1421] px-3 py-2 text-white placeholder:text-[#71809a]"
        />
        <textarea
          name="message"
          required
          minLength={10}
          rows={4}
          placeholder="¿En qué podemos trabajar?"
          className="contact-message focus-ring rounded-lg border border-[var(--line)] bg-[#0d1421] px-3 py-2 text-white placeholder:text-[#71809a]"
        />
        <button
          type="submit"
          className="contact-submit rounded-lg bg-[var(--mint)] px-4 py-2 text-[#08101c]"
        >
          Preparar correo
        </button>
      </form>
      {status && (
        <p role="status" className="text-[var(--mint)]">
          {status}
        </p>
      )}
      <div className="contact-links grid gap-2 sm:grid-cols-3">
        <a
          className="focus-ring rounded-lg border border-[var(--line)] p-3 text-[var(--blue)]"
          href={`mailto:${profile.email}`}
        >
          {profile.email}
        </a>
        <a
          className="focus-ring rounded-lg border border-[var(--line)] p-3 text-[var(--blue)]"
          href={profile.github}
          target="_blank"
          rel="noreferrer"
        >
          GitHub ↗
        </a>
        <a
          className="focus-ring rounded-lg border border-[var(--line)] p-3 text-[var(--blue)]"
          href={profile.linkedin}
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn ↗
        </a>
      </div>
    </div>
  );
}

function FilesPanel({ onOpen }: { onOpen: (id: AppId) => void }) {
  type FolderId = "root" | "about" | "projects" | "skills" | "education" | "documents" | "contact";
  type FileRecord = {
    name: string;
    detail: string;
    kind: "folder" | "file" | "link";
    icon: typeof FolderOpen;
    action?: () => void;
    href?: string;
    download?: boolean;
  };
  const [activeFolder, setActiveFolder] = useState<FolderId>("root");
  const [query, setQuery] = useState("");
  const folderNames: Record<Exclude<FolderId, "root">, string> = {
    about: "Perfil",
    projects: "Proyectos",
    skills: "Habilidades",
    education: "Formación",
    documents: "Documentos",
    contact: "Contacto",
  };
  const openFolder = (folder: Exclude<FolderId, "root">) => {
    setQuery("");
    setActiveFolder(folder);
  };
  const filesByFolder: Record<FolderId, FileRecord[]> = {
    root: [
      { name: "about/", detail: "Perfil y presentación", kind: "folder", icon: UserRound, action: () => openFolder("about") },
      { name: "projects/", detail: `${projects.length} proyectos registrados`, kind: "folder", icon: Folder, action: () => openFolder("projects") },
      { name: "skills/", detail: `${Object.values(skillGroups).flat().length} tecnologías catalogadas`, kind: "folder", icon: Wrench, action: () => openFolder("skills") },
      { name: "education/", detail: "Ingeniería y certificaciones", kind: "folder", icon: GraduationCap, action: () => openFolder("education") },
      { name: "documents/", detail: "CV y archivos profesionales", kind: "folder", icon: FileText, action: () => openFolder("documents") },
      { name: "contact/", detail: "Canales de comunicación", kind: "folder", icon: Mail, action: () => openFolder("contact") },
    ],
    about: [
      { name: "profile.txt", detail: profile.role, kind: "file", icon: FileCode2, action: () => onOpen("about") },
      { name: "presentation.app", detail: "Abrir aplicación Sobre mí", kind: "link", icon: UserRound, action: () => onOpen("about") },
    ],
    projects: projects.map((project) => ({ name: `${project.name.toLowerCase()}.project`, detail: project.stack.join(" · "), kind: "file" as const, icon: FolderOpen, action: () => onOpen("projects"), href: project.repository })),
    skills: Object.entries(skillGroups).map(([group, skills]) => ({ name: `${group.toLowerCase().replaceAll(" ", "-")}.skill`, detail: skills.join(" · "), kind: "file" as const, icon: Wrench, action: () => onOpen("skills") })),
    education: [
      { name: "ingenieria-software.record", detail: "2024 — actualidad · Universidad Cooperativa de Colombia", kind: "file", icon: GraduationCap, action: () => onOpen("education") },
      { name: "certificaciones/", detail: "5 certificados disponibles en PDF", kind: "folder", icon: FileBadge2, action: () => openFolder("documents") },
    ],
    documents: [
      { name: "David_Cabrera_CV.pdf", detail: "CV actualizado · 360 KB", kind: "file", icon: FileText, href: "/portfolio/assets/cv/cv.pdf", download: true },
      { name: "certificaciones/", detail: "Certificados académicos y técnicos", kind: "folder", icon: FileBadge2, action: () => openFolder("education") },
    ],
    contact: [
      { name: "email.link", detail: profile.email, kind: "link", icon: Mail, href: `mailto:${profile.email}` },
      { name: "github.link", detail: "David-Cabrera00", kind: "link", icon: ExternalLink, href: profile.github },
      { name: "linkedin.link", detail: "david-cabrera-209a4a407", kind: "link", icon: ExternalLink, href: profile.linkedin },
    ],
  };
  const visibleFiles = filesByFolder[activeFolder].filter((file) => `${file.name} ${file.detail}`.toLowerCase().includes(query.toLowerCase()));
  const folderPath = activeFolder === "root" ? "workspace / portfolio" : `workspace / portfolio / ${folderNames[activeFolder]}`;
  return (
    <div className="files-explorer space-y-4">
      <div className="files-explorer-head"><AppPanelHeader eyebrow="FILE SYSTEM / 05" title="Explorador de archivos." description="Navega por el trabajo, la formación y los enlaces de David." meta="ONLINE" /></div>
      <div className="files-toolbar">
        <button type="button" className="focus-ring files-back-button" onClick={() => setActiveFolder("root")} disabled={activeFolder === "root"} aria-label="Volver a la raíz"><ArrowLeft size={15} /></button>
        <div className="files-breadcrumb"><FolderOpen size={14} /><span>{folderPath}</span></div>
        <label className="files-search"><Search size={14} /><span className="sr-only">Buscar archivos</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar" /></label>
      </div>
      <div className="files-summary"><span>{visibleFiles.length} elementos</span><span>·</span><span>clic para abrir</span></div>
      <div className="files-grid">
        {visibleFiles.map((file, index) => {
          const Icon = file.icon;
          const content = <><span className="files-entry-icon"><Icon size={19} /></span><span className="min-w-0 flex-1"><strong>{file.name}</strong><small>{file.detail}</small></span>{file.kind === "folder" ? <ChevronRight size={15} className="files-entry-arrow" /> : file.href ? <ExternalLink size={14} className="files-entry-arrow" /> : null}</>;
          return file.href ? <a key={file.name} href={file.href} download={file.download} target={file.download ? undefined : "_blank"} rel={file.download ? undefined : "noreferrer"} className="files-entry" style={{ animationDelay: `${index * 45}ms` }}>{content}</a> : <button type="button" key={file.name} onClick={file.action} className="files-entry" style={{ animationDelay: `${index * 45}ms` }}>{content}</button>;
        })}
      </div>
      {visibleFiles.length === 0 && <div className="files-empty"><Search size={24} /><p>No se encontraron archivos.</p><small>Prueba con otro término de búsqueda.</small></div>}
      <div className="files-status-bar"><span><span className="files-status-dot" /> Sistema listo</span><span>{activeFolder === "root" ? "Raíz del workspace" : `Carpeta ${folderNames[activeFolder]}`}</span><span><Download size={13} /> PDFs disponibles</span></div>
    </div>
  );
}

function SettingsPanel() {
  const {
    theme,
    wallpaper,
    sounds,
    reducedMotion,
    setTheme,
    setWallpaper,
    setSounds,
    setReducedMotion,
    resetPreferences,
  } = useOSStore();
  return (
    <div className="settings-app space-y-5 text-sm">
      <AppPanelHeader eyebrow="SYSTEM / CONTROL PANEL" title="Personaliza tu entorno." description="Ajustes visuales y de interacción para esta sesión." meta="PREFERENCIAS" />
      <div className="settings-preview"><div className={`settings-preview-screen theme-${theme}`}><span className="settings-preview-orbit" /><span className="settings-preview-mark">DEV<br />OS</span><span className="settings-preview-caption">{theme === "aero" ? "AERO BLUE" : theme.toUpperCase()} · {wallpaper.toUpperCase()}</span></div><div className="settings-preview-copy"><strong>Vista del escritorio</strong><span>Los cambios se aplican inmediatamente y se guardan en este navegador.</span></div></div>
      <div className="settings-section-label"><span>APARIENCIA</span><i /></div>
      <div className="settings-grid">
      <label className="settings-control flex items-center justify-between gap-4 rounded-xl border border-[var(--line)] p-3 text-[var(--muted)]">
        <span>Tema</span>
        <select value={theme} onChange={(e) => setTheme(e.target.value as "aero" | "dark" | "dusk")} className="rounded-lg border border-[var(--line)] bg-[#101725] p-2">
          <option value="aero">Aero Blue</option><option value="dark">Dark</option><option value="dusk">Dusk</option>
        </select>
      </label>
      <label className="settings-control flex items-center justify-between gap-4 rounded-xl border border-[var(--line)] p-3 text-[var(--muted)]">
        <span>Fondo</span>
        <select value={wallpaper} onChange={(event) => setWallpaper(event.target.value as "aurora" | "grid" | "plain")} className="rounded-lg border border-[var(--line)] bg-[#101725] p-2">
          <option value="aurora">Aurora</option><option value="grid">Grid</option><option value="plain">Plano</option>
        </select>
      </label>
      <label className="settings-control flex items-center justify-between rounded-xl border border-[var(--line)] p-3 text-[var(--muted)]">
        <span>Sonidos</span><input type="checkbox" checked={sounds} onChange={(e) => setSounds(e.target.checked)} />
      </label>
      <label className="settings-control flex items-center justify-between rounded-xl border border-[var(--line)] p-3 text-[var(--muted)]">
        <span>Reducir animaciones</span><input type="checkbox" checked={reducedMotion} onChange={(e) => setReducedMotion(e.target.checked)} />
      </label>
      </div>
      <div className="settings-section-label"><span>ACCESIBILIDAD Y SISTEMA</span><i /></div>
      <button onClick={resetPreferences} className="focus-ring settings-reset"><RefreshCw size={15} />Restablecer preferencias</button>
    </div>
  );
}

function TerminalPanel({ onOpen }: { onOpen: (id: AppId) => void }) {
  const commandNames = terminalCommands;
  const [lines, setLines] = useState([
    "DEV OS terminal — escribe help para comenzar.",
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const run = () => {
    const command = value.trim();
    if (!command) return;
    setHistory((old) => [...old, command]);
    setHistoryIndex(-1);
    const result = executeTerminalCommand(command);
    if (result.clear) {
      setLines([]);
      setValue("");
      return;
    }
    if (result.openApp) onOpen(result.openApp);
    setLines((old) => [...old, `> ${command}`, ...result.output.split("\n")]);
    setValue("");
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") run();
    if (event.key === "ArrowUp") {
      event.preventDefault();
      const next =
        historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setValue(history[next] ?? "");
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      const next = historyIndex < 0 ? -1 : historyIndex + 1;
      setHistoryIndex(next);
      setValue(next >= 0 ? (history[next] ?? "") : "");
    }
    if (event.key === "Tab") {
      event.preventDefault();
      const match = commandNames.find((command) =>
        command.startsWith(value.toLowerCase()),
      );
      if (match) setValue(match);
    }
  };
  return (
    <div className="terminal-app mono flex h-full min-h-[280px] flex-col rounded-lg p-3 text-xs">
      <div className="terminal-topbar mb-3 flex items-center justify-between border-b border-[#202b40] pb-3 text-[10px]">
        <span className="terminal-brand"><i /> DEV OS / TERMINAL</span>
        <span className="terminal-mode">LOCAL SHELL · SAFE MODE</span>
      </div>
      <div className="terminal-session mb-3"><span>SESSION <strong>LOCAL</strong></span><span>STATUS <strong>READY</strong></span><span>COMMANDS <strong>{String(commandNames.length).padStart(2, "0")}</strong></span></div>
      <div className="mb-3 flex flex-wrap gap-2">
        {commandNames.slice(0, 5).map((command) => (
          <button
            type="button"
            key={command}
            onClick={() => setValue(command)}
            className="rounded-md border border-[#202b40] px-2 py-1 text-[10px] text-[#8fa8cf] hover:border-[var(--blue)]/60 hover:text-white"
          >
            {command}
          </button>
        ))}
      </div>
      <div
        role="log"
        aria-live="polite"
        aria-label="Salida de terminal"
        className="terminal-output flex-1 whitespace-pre-wrap text-[#a9bad4]"
      >
        {lines.map((line, i) => (
          <p key={`${line}-${i}`} className="terminal-line mb-1" style={{ animationDelay: `${Math.min(i, 8) * 35}ms` }}>
            {line}
          </p>
        ))}
      </div>
      <div className="terminal-prompt flex items-center gap-2 border-t border-[#202b40] pt-3 text-[var(--mint)]">
        <span className="terminal-prompt-symbol">~/dev-os ›</span>
        <input
          aria-label="Comando de terminal"
          autoComplete="off"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-w-0 flex-1 bg-transparent text-white outline-none"
          placeholder="escribe un comando..."
        />
      </div>
    </div>
  );
}

function WindowView({ id }: { id: AppId }) {
  const win = useOSStore((s) => s.windows[id]);
  const beginClose = useOSStore((s) => s.beginCloseWindow);
  const minimize = useOSStore((s) => s.minimizeWindow);
  const maximize = useOSStore((s) => s.maximizeWindow);
  const focus = useOSStore((s) => s.focusWindow);
  const move = useOSStore((s) => s.moveWindow);
  const resize = useOSStore((s) => s.resizeWindow);
  const activeId = useOSStore((s) => s.activeId);
  const sounds = useOSStore((s) => s.sounds);
  const [minimizing, setMinimizing] = useState(false);
  const previousWindowState = useRef({
    open: win.open,
    minimized: win.minimized,
    maximized: win.maximized,
  });
  const windowRef = useRef<HTMLElement>(null);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const resizeRef = useRef<{
    startX: number;
    startY: number;
    originWidth: number;
    originHeight: number;
  } | null>(null);
  const onPointerMove = (event: PointerEvent) => {
    if (!dragRef.current || win.maximized) return;
    const nextX = Math.max(
      0,
      Math.min(
        70,
        dragRef.current.originX +
          ((event.clientX - dragRef.current.startX) / window.innerWidth) * 100,
      ),
    );
    const nextY = Math.max(
      0,
      Math.min(
        55,
        dragRef.current.originY +
          ((event.clientY - dragRef.current.startY) / window.innerHeight) * 100,
      ),
    );
    move(id, { x: nextX, y: nextY });
  };
  const stopDragging = () => {
    dragRef.current = null;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", stopDragging);
  };
  const onResizeMove = (event: PointerEvent) => {
    if (!resizeRef.current || win.maximized) return;
    resize(id, {
      width: Math.max(
        360,
        Math.min(1000, resizeRef.current.originWidth + event.clientX - resizeRef.current.startX),
      ),
      height: Math.max(
        260,
        Math.min(720, resizeRef.current.originHeight + event.clientY - resizeRef.current.startY),
      ),
    });
  };
  const stopResizing = () => {
    resizeRef.current = null;
    window.removeEventListener("pointermove", onResizeMove);
    window.removeEventListener("pointerup", stopResizing);
  };
  const startResizing = (event: React.PointerEvent) => {
    if (win.maximized) return;
    event.preventDefault();
    event.stopPropagation();
    focus(id);
    resizeRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originWidth: win.size.width,
      originHeight: win.size.height,
    };
    window.addEventListener("pointermove", onResizeMove);
    window.addEventListener("pointerup", stopResizing);
  };
  const requestMinimize = () => {
    setMinimizing(true);
    window.setTimeout(() => minimize(id), 180);
  };
  useEffect(() => {
    const previous = previousWindowState.current;
    if (sounds) {
      if (!previous.open && win.open) playSystemSound("open");
      if (previous.open && !win.open) playSystemSound("close");
      if (!previous.minimized && win.minimized) playSystemSound("minimize");
      if (previous.maximized !== win.maximized) {
        playSystemSound("maximize");
      }
    }
    previousWindowState.current = {
      open: win.open,
      minimized: win.minimized,
      maximized: win.maximized,
    };
  }, [sounds, win.maximized, win.minimized, win.open]);
  useEffect(() => {
    if (
      win.open &&
      activeId === id &&
      document.activeElement === document.body
    ) {
      windowRef.current?.focus({ preventScroll: true });
    }
  }, [activeId, id, win.open]);
  const startDragging = (event: React.PointerEvent) => {
    if (win.maximized || (event.target as HTMLElement).closest("button"))
      return;
    focus(id);
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: win.position.x,
      originY: win.position.y,
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", stopDragging);
  };
  useEffect(
    () => () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", stopDragging);
      window.removeEventListener("pointermove", onResizeMove);
      window.removeEventListener("pointerup", stopResizing);
    },
    // These listeners are cleaned up on unmount; handlers close over this window instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  if (!win.open || win.minimized) return null;
  return (
    <section
      ref={windowRef}
      onPointerDown={() => focus(id)}
      role="dialog"
      aria-modal="false"
      aria-labelledby={`window-title-${id}`}
      tabIndex={-1}
      aria-label={`Ventana ${win.title}`}
      className={`os-window os-window-floating aero-window absolute ${win.maximized ? "window-maximized inset-3" : "max-sm:inset-3 max-sm:w-auto"} ${win.closing ? "os-window-closing" : minimizing ? "os-window-minimizing" : ""} overflow-hidden rounded-2xl border bg-[#151821] shadow-2xl ${activeId === id ? "window-active border-white/15" : "window-inactive border-white/[.08]"}`}
      style={{
        zIndex: win.zIndex + 40,
        ...(win.maximized
          ? {}
          : {
              left: `${win.position.x}%`,
              top: `${win.position.y}%`,
              "--window-width": `${win.size.width}px`,
              "--window-height": `${win.size.height}px`,
            }),
      } as React.CSSProperties}
    >
      <header
        onPointerDown={startDragging}
        onDoubleClick={() => maximize(id)}
        className="aero-window-header flex touch-none cursor-move items-center justify-between border-b border-white/[.08] px-4 py-3"
      >
        <div className="window-app-identity flex min-w-0 items-center gap-2">
          <span className="window-app-icon" aria-hidden="true">{(() => { const Icon = windowIcons[id]; return <Icon size={15} />; })()}</span>
          <span className="min-w-0">
            <span id={`window-title-${id}`} className="block truncate text-[.82rem] font-semibold tracking-[.01em]">
              {win.title}
            </span>
          </span>
        </div>
        <div className="window-controls flex gap-1">
          <button
            aria-label="Minimizar"
            title="Minimizar ventana"
            aria-pressed={win.minimized}
            onClick={requestMinimize}
            className="focus-ring window-control rounded p-1 text-[var(--muted)]"
          >
            <Minus size={15} />
          </button>
          <button
            aria-label="Maximizar"
            title={win.maximized ? "Restaurar ventana" : "Maximizar ventana"}
            aria-pressed={win.maximized}
            onClick={() => maximize(id)}
            className="focus-ring window-control rounded p-1 text-[var(--muted)]"
          >
            {win.maximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button
            aria-label="Cerrar"
            aria-keyshortcuts="Escape"
            title="Cerrar ventana"
            onClick={() => beginClose(id)}
            className="focus-ring window-control window-control-close rounded p-1 text-[var(--muted)] hover:text-red-300"
          >
            <X size={15} />
          </button>
        </div>
      </header>
      <div className={`window-body overflow-auto p-5 max-sm:p-4 ${win.maximized ? "h-[calc(100dvh-8rem)] max-h-none" : "max-h-[68vh] max-sm:max-h-[calc(100vh-8.5rem)]"}`}>
        <AppContent id={id} />
      </div>
      {!win.maximized && (
        <button
          type="button"
          aria-label={`Redimensionar ventana ${win.title}`}
          onPointerDown={startResizing}
          className="window-resize-handle focus-ring"
        />
      )}
    </section>
  );
}

export function OSDesktop({ onExit }: { onExit: () => void }) {
  const [menu, setMenu] = useState(false);
  const [startQuery, setStartQuery] = useState("");
  const [powerMenu, setPowerMenu] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [iconPositions, setIconPositions] = useState<IconPositions>(
    defaultIconPositions,
  );
  const [selectedDesktopItem, setSelectedDesktopItem] =
    useState<DesktopSelection>(null);
  const [selectedDesktopItems, setSelectedDesktopItems] = useState<AppId[]>([]);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [iconsHydrated, setIconsHydrated] = useState(false);
  const iconDragRef = useRef<{
    id: AppId;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const suppressIconClickRef = useRef(false);
  const hydratePreferences = useOSStore((s) => s.hydratePreferences);
  const openWindow = useOSStore((s) => s.openWindow);
  const closeWindow = useOSStore((s) => s.closeWindow);
  const beginCloseWindow = useOSStore((s) => s.beginCloseWindow);
  const windows = useOSStore((s) => s.windows);
  const activeId = useOSStore((s) => s.activeId);
  const theme = useOSStore((s) => s.theme);
  const wallpaper = useOSStore((s) => s.wallpaper);
  const reducedMotion = useOSStore((s) => s.reducedMotion);
  const open = apps.filter((a) => windows[a.id].open);
  const startApps = apps.filter((app) =>
    app.label.toLowerCase().includes(startQuery.toLowerCase()),
  );
  const recentApps = open.length > 0 ? open.slice(0, 4) : apps.slice(0, 4);
  const stopIconDrag = () => {
    iconDragRef.current = null;
    window.removeEventListener("pointermove", moveIcon);
    window.removeEventListener("pointerup", stopIconDrag);
  };
  const moveIcon = (event: PointerEvent) => {
    const drag = iconDragRef.current;
    if (!drag) return;
    const distance = Math.hypot(
      event.clientX - drag.startX,
      event.clientY - drag.startY,
    );
    if (distance > 4) suppressIconClickRef.current = true;
    const target = nearestIconSlot({
      x: Math.max(
        0.5,
        Math.min(82, drag.originX + (event.clientX - drag.startX) / 12),
      ),
      y: Math.max(
        0.5,
        Math.min(78, drag.originY + (event.clientY - drag.startY) / 8),
      ),
    });
    setIconPositions((positions) => {
      const occupied = apps.find(
        (app) =>
          app.id !== drag.id &&
          positions[app.id].x === target.x &&
          positions[app.id].y === target.y,
      );
      const next = { ...positions, [drag.id]: target };
      if (occupied) next[occupied.id] = positions[drag.id];
      return next;
    });
  };
  const startIconDrag = (id: AppId, event: React.PointerEvent) => {
    if (event.button !== 0) return;
    event.preventDefault();
    iconDragRef.current = {
      id,
      startX: event.clientX,
      startY: event.clientY,
      originX: iconPositions[id].x,
      originY: iconPositions[id].y,
    };
    window.addEventListener("pointermove", moveIcon);
    window.addEventListener("pointerup", stopIconDrag);
  };
  const organizeIcons = () => {
    setIconPositions(defaultIconPositions);
    localStorage.setItem(iconLayoutVersionKey, iconLayoutVersion);
    setContextMenu(null);
  };
  const sortIconsByName = () => {
    const sorted = [...apps].sort((a, b) => a.label.localeCompare(b.label, "es"));
    const sortedPositions = sorted.reduce((positions, app, index) => {
      positions[app.id] = {
        x: index % 2 === 0 ? 2 : 10,
        y: 2 + Math.floor(index / 2) * 17,
      };
      return positions;
    }, {} as IconPositions);
    setIconPositions(sortedPositions);
    localStorage.setItem(iconLayoutVersionKey, iconLayoutVersion);
    setContextMenu(null);
  };
  const openContextMenu = (event: React.MouseEvent, id: DesktopSelection) => {
    event.preventDefault();
    setSelectedDesktopItem(id);
    setContextMenu({
      x: Math.min(event.clientX, window.innerWidth - 224),
      y: Math.min(event.clientY, window.innerHeight - 190),
    });
  };
  useEffect(() => {
    hydratePreferences();
  }, [hydratePreferences]);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = JSON.parse(
          localStorage.getItem(iconPositionsKey) ?? "null",
        ) as Partial<IconPositions> | null;
        const version = localStorage.getItem(iconLayoutVersionKey);
        if (version === iconLayoutVersion && stored) {
          setIconPositions({ ...defaultIconPositions, ...stored });
        } else {
          localStorage.setItem(iconLayoutVersionKey, iconLayoutVersion);
          localStorage.removeItem(iconPositionsKey);
        }
      } catch {
        /* Keep the default desktop layout when storage is unavailable. */
      } finally {
        setIconsHydrated(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (!iconsHydrated) return;
    try {
      localStorage.setItem(iconPositionsKey, JSON.stringify(iconPositions));
    } catch {
      /* Storage may be unavailable in private browsing. */
    }
  }, [iconPositions, iconsHydrated]);
  useEffect(
    () => () => {
      window.removeEventListener("pointermove", moveIcon);
      window.removeEventListener("pointerup", stopIconDrag);
    },
    // The listeners are removed when the desktop unmounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menu) {
        setMenu(false);
        setPowerMenu(false);
        return;
      }
      if (event.key === "Escape" && activeId) beginCloseWindow(activeId);
      if (event.key.toLowerCase() === "k" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        openWindow("terminal");
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [activeId, beginCloseWindow, menu, openWindow]);
  return (
    <main
      aria-label="Escritorio DEV OS"
      onPointerDown={(event) => {
        if (!(event.target as HTMLElement).closest("[data-context-menu]")) {
          setContextMenu(null);
          if (event.target === event.currentTarget) {
            setSelectedDesktopItem(null);
            setSelectedDesktopItems([]);
          }
        }
      }}
      data-theme={theme}
      data-reduced-motion={reducedMotion}
      className={`os-shell relative h-screen max-h-screen overflow-hidden overscroll-none pb-14 ${theme === "aero" ? "aero-desktop" : wallpaper === "grid" ? "grid-bg bg-[var(--bg)]" : wallpaper === "plain" ? "bg-[var(--bg)]" : "bg-[radial-gradient(circle_at_70%_10%,rgba(120,169,255,.16),transparent_35%),radial-gradient(circle_at_10%_80%,rgba(124,227,195,.1),transparent_28%)]"}`}
    >
      {wallpaper === "aurora" && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(120,169,255,.13),transparent_35%),radial-gradient(circle_at_10%_80%,rgba(124,227,195,.08),transparent_28%)]" />
      )}
      {theme === "aero" && (
        <div
          aria-hidden="true"
          className="aero-shimmer pointer-events-none absolute left-[-20%] top-24 z-0 h-28 w-[140%] rotate-[-8deg] bg-gradient-to-r from-transparent via-white/10 to-transparent blur-2xl"
        />
      )}
      <header className="aero-glass relative z-20 flex h-14 items-center justify-between border-b border-[var(--line)] bg-[#0b101b]/70 px-4 backdrop-blur-xl sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span className="mono text-[10px] tracking-[.24em] text-[var(--mint)]">
            DEV OS
          </span>
          <span className="hidden text-xs text-[#71809a] sm:inline">/</span>
          <span className="hidden truncate text-xs text-[var(--muted)] sm:inline">
            workspace / portfolio
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
          <span className="hidden items-center gap-2 xl:flex">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--mint)]" />
            <span className="mono text-[10px] tracking-[.16em] text-[var(--mint)]">
              SYSTEM ONLINE
            </span>
          </span>
          <span className="hidden items-center gap-2 lg:flex">
            <Activity size={13} className="text-[var(--mint)]" />
            {open.length} apps active
          </span>
          <Link
            href="/"
            className="focus-ring flex items-center gap-2 rounded-lg border border-[var(--mint)]/50 bg-[var(--mint)]/10 px-2.5 py-1.5 text-[var(--mint)] hover:bg-[var(--mint)]/20"
          >
            <ExternalLink size={13} />
            <span>Mi portafolio</span>
          </Link>
          <button
            onClick={() => openWindow("terminal")}
            aria-keyshortcuts="Control+K"
            className="focus-ring flex items-center gap-2 rounded-lg border border-[var(--line)] px-2.5 py-1.5 hover:border-[var(--blue)]/60 hover:text-white"
          >
            <Command size={13} />
            <span className="hidden sm:inline">Command center</span>
            <kbd className="mono hidden rounded bg-[#202b40] px-1.5 py-0.5 text-[10px] text-[var(--blue)] sm:inline">
              Ctrl K
            </kbd>
          </button>
        </div>
      </header>
      <div className="relative min-h-[calc(100vh-7rem)] p-4 pt-6 sm:p-7 sm:pt-8 lg:p-9">
        <div className="desktop-icons" aria-label="Aplicaciones del escritorio">
          {apps.map(({ id, label, icon: Icon }, index) => (
            <button
              key={id}
              type="button"
              aria-label={`Abrir ${label}`}
              onDoubleClick={() => openWindow(id)}
              onClick={(event) => {
                if (suppressIconClickRef.current) {
                  suppressIconClickRef.current = false;
                  return;
                }
                setSelectedDesktopItem(id);
                setSelectedDesktopItems((selected) =>
                  event.ctrlKey || event.metaKey
                    ? selected.includes(id)
                      ? selected.filter((item) => item !== id)
                      : [...selected, id]
                    : [id],
                );
              }}
              onContextMenu={(event) => openContextMenu(event, id)}
              onPointerDown={(event) => startIconDrag(id, event)}
              style={{ left: `${iconPositions[id].x}%`, top: `${iconPositions[id].y}%` }}
              title="Haz clic para abrir · arrastra para mover"
              className={`desktop-icon focus-ring group flex flex-col items-center gap-1 rounded-lg p-2 text-center text-xs text-white transition duration-200 hover:bg-white/15 ${selectedDesktopItems.includes(id) || selectedDesktopItem === id ? "desktop-icon-selected" : ""}`}
            >
              <span className={`aero-icon rounded-xl border border-[var(--line)] bg-[#131c2b] p-3 ${index < 5 ? "text-[var(--blue)]" : "text-[var(--mint)]"}`}>
                <Icon size={21} />
              </span>
              <span className="desktop-icon-label rounded px-1.5 py-0.5 leading-4 group-hover:bg-[#0b4577]/70">{label}</span>
            </button>
          ))}
          <button
            type="button"
            aria-label="Abrir Papelera de reciclaje"
            onClick={() => {
              setSelectedDesktopItem("recycle");
              setSelectedDesktopItems([]);
            }}
            onDoubleClick={() => openWindow("files")}
            onContextMenu={(event) => openContextMenu(event, "recycle")}
            className={`desktop-icon desktop-recycle focus-ring group flex flex-col items-center gap-1 rounded-lg p-2 text-center text-xs text-white transition duration-200 hover:bg-white/15 ${selectedDesktopItem === "recycle" ? "desktop-icon-selected" : ""}`}
          >
            <span className="aero-icon rounded-xl border border-[var(--line)] bg-[#131c2b] p-3 text-[var(--muted)]">
              <Trash2 size={21} />
            </span>
            <span className="desktop-icon-label rounded px-1.5 py-0.5 leading-4 group-hover:bg-[#0b4577]/70">Papelera</span>
          </button>
        </div>
        <aside className="desktop-widgets" aria-label="Gadgets del escritorio">
          <div className="desktop-widget desktop-widget-clock">
            <span className="mono text-[10px] tracking-[.18em] text-[var(--mint)]">LOCAL TIME</span>
            <strong>{now.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}</strong>
            <span>{now.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })}</span>
          </div>
          <div className="desktop-widget">
            <div className="flex items-center justify-between gap-3">
              <span className="mono text-[10px] tracking-[.18em] text-[var(--mint)]">DEV OS</span>
              <span className="h-2 w-2 rounded-full bg-[var(--mint)] shadow-[0_0_10px_var(--mint)]" />
            </div>
            <p className="mt-3 text-sm font-medium text-white">{profile.name}</p>
            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">Disponible {profile.availability} · {profile.role}</p>
          </div>
          <div className="desktop-widget">
            <div className="flex items-center justify-between">
              <span className="mono text-[10px] tracking-[.18em] text-[var(--mint)]">WORKSPACE</span>
              <Activity size={13} className="text-[var(--mint)]" />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-1">
              <button type="button" onClick={() => openWindow("projects")} className="desktop-stat focus-ring rounded-md p-1 text-left">
                <span>{projects.length}</span>
                <small>proyectos</small>
              </button>
              <button type="button" onClick={() => openWindow("skills")} className="desktop-stat focus-ring rounded-md p-1 text-left">
                <span>{Object.values(skillGroups).flat().length}</span>
                <small>skills</small>
              </button>
              <div className="desktop-stat rounded-md p-1">
                <span>{open.length}</span>
                <small>abiertas</small>
              </div>
            </div>
          </div>
        </aside>
        {activeId && <div className="desktop-focus-veil" aria-hidden="true" />}
        {apps.map(({ id }) => (
          <WindowView key={id} id={id} />
        ))}
        {contextMenu && (
          <div
            data-context-menu
            className="desktop-context-menu os-menu-in"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            role="menu"
            aria-label="Menú contextual del escritorio"
          >
            {selectedDesktopItem && selectedDesktopItem !== "recycle" && (
              <button type="button" role="menuitem" onClick={() => { openWindow(selectedDesktopItem); setContextMenu(null); }}>
                <FolderOpen size={14} /> Abrir
              </button>
            )}
            {selectedDesktopItem === "recycle" && (
              <button type="button" role="menuitem" onClick={() => { openWindow("files"); setContextMenu(null); }}>
                <FolderOpen size={14} /> Abrir Papelera
              </button>
            )}
            <button type="button" role="menuitem" onClick={organizeIcons}>
              <AlignJustify size={14} /> Organizar iconos
            </button>
            <button type="button" role="menuitem" onClick={sortIconsByName}>
              <AlignJustify size={14} /> Ordenar por nombre
            </button>
            <button type="button" role="menuitem" onClick={() => { setIconPositions(defaultIconPositions); localStorage.removeItem(iconPositionsKey); localStorage.setItem(iconLayoutVersionKey, iconLayoutVersion); setContextMenu(null); }}>
              <RefreshCw size={14} /> Restablecer posiciones
            </button>
          </div>
        )}
      </div>
      <footer className="aero-taskbar fixed bottom-0 left-0 right-0 z-30 flex h-14 min-w-0 items-center gap-3 overflow-x-auto overflow-y-hidden border-t border-[var(--line)] bg-[#111827]/90 px-3 backdrop-blur-xl sm:px-4">
        <button
          aria-label="Menú de aplicaciones"
          onClick={() => setMenu(!menu)}
          className="aero-start-button focus-ring shrink-0 rounded-full p-2 text-[#08101c]"
        >
          <Monitor size={18} />
        </button>
        {open.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            aria-label={`Cambiar a ${label}`}
            aria-current={activeId === id ? "page" : undefined}
            aria-pressed={activeId === id}
            onClick={() => openWindow(id)}
            className={`focus-ring flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border px-3 py-2 text-xs transition ${activeId === id ? "border-[var(--blue)]/50 bg-[#253553] text-white" : windows[id].minimized ? "border-transparent text-[#71809a] opacity-60 hover:border-[var(--line)] hover:opacity-100" : "border-transparent text-[var(--muted)] hover:border-[var(--line)] hover:text-white"}`}
          >
            <Icon size={14} />
            <span>{label}</span>
          </button>
        ))}
        <div className="ml-auto flex shrink-0 items-center gap-3 text-xs text-[var(--muted)]">
          <span className="hidden sm:inline">Ctrl+K terminal · Esc cerrar</span>
          <span>
            {now.toLocaleTimeString("es-CO", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <button
            aria-label="Salir de la experiencia 3D"
            onClick={onExit}
            className="focus-ring rounded-lg p-2 text-[var(--muted)] hover:text-white"
          >
            <Power size={17} />
          </button>
        </div>
        {menu && (
          <div className="aero-menu aero-start-menu os-menu-in absolute bottom-16 left-4 w-[min(34rem,calc(100vw-2rem))] rounded-xl border border-[var(--line)] p-2 shadow-2xl">
            <div className="aero-start-profile flex items-center gap-3 rounded-lg px-3 py-3">
              <span className="aero-avatar flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-lg font-semibold text-white">
                {profile.name.charAt(0)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{profile.name}</p>
                <p className="mt-1 truncate text-xs text-[var(--muted)]">{profile.role}</p>
              </div>
            </div>
            <div className="grid gap-2 border-t border-white/15 p-2 sm:grid-cols-[1.15fr_.85fr]">
              <div className="min-w-0">
                <div className="mb-2 flex items-center justify-between px-2">
                  <span className="mono text-[10px] tracking-[.16em] text-[var(--mint)]">PROGRAMS</span>
                  <span className="text-[10px] text-[var(--muted)]">{startApps.length} disponibles</span>
                </div>
                <label className="sr-only" htmlFor="start-search">Buscar aplicaciones</label>
                <div className="mb-2 flex items-center gap-2 rounded-md border border-white/20 bg-black/15 px-2">
                  <Search size={14} className="text-[var(--muted)]" />
                  <input
                    id="start-search"
                    value={startQuery}
                    onChange={(event) => setStartQuery(event.target.value)}
                    placeholder="Buscar programas…"
                    className="min-w-0 flex-1 bg-transparent py-2 text-xs text-white outline-none placeholder:text-[var(--muted)]"
                  />
                </div>
                <div className="grid gap-1">
                  {startApps.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        openWindow(id);
                        setMenu(false);
                      }}
                      className="focus-ring flex items-center gap-3 rounded-md px-2 py-2 text-left text-sm text-white hover:bg-white/15"
                    >
                      <Icon size={17} className="text-[var(--blue)]" />
                      <span>{label}</span>
                    </button>
                  ))}
                  {startApps.length === 0 && <p className="px-2 py-3 text-xs text-[var(--muted)]">No se encontraron aplicaciones.</p>}
                </div>
              </div>
              <div className="hidden border-l border-white/15 pl-2 sm:block">
                <p className="px-2 py-2 text-[10px] tracking-[.16em] text-[var(--mint)]">RECENT</p>
                {recentApps.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      openWindow(id);
                      setMenu(false);
                    }}
                    className="focus-ring flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs text-[var(--muted)] hover:bg-white/15 hover:text-white"
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                ))}
                <p className="mt-3 px-2 py-2 text-[10px] tracking-[.16em] text-[var(--mint)]">SYSTEM</p>
                {["settings", "files", "terminal"].map((id) => {
                  const app = apps.find((item) => item.id === id);
                  if (!app) return null;
                  const Icon = app.icon;
                  return (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => {
                        openWindow(app.id);
                        setMenu(false);
                      }}
                      className="focus-ring flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs text-[var(--muted)] hover:bg-white/15 hover:text-white"
                    >
                      <Icon size={14} />
                      {app.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="relative flex items-center justify-between border-t border-white/15 px-2 pt-2">
              <span className="mono text-[10px] text-[var(--muted)]">DEV OS / AERO EDITION</span>
              <button
                type="button"
                onClick={() => setPowerMenu((value) => !value)}
                className="focus-ring flex items-center gap-2 rounded-md px-2 py-1 text-xs text-white hover:bg-white/15"
              >
                <Power size={13} />
                Apagar
              </button>
              {powerMenu && (
                <div className="aero-power-menu os-menu-in absolute bottom-10 right-0 w-48 rounded-lg border p-1 shadow-xl">
                  <button type="button" onClick={onExit}>
                    Cerrar sesión
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      open.forEach(({ id }) => closeWindow(id));
                      setPowerMenu(false);
                      setMenu(false);
                    }}
                  >
                    Reiniciar DEV OS
                  </button>
                  <button type="button" onClick={() => setPowerMenu(false)}>
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </footer>
    </main>
  );
}
