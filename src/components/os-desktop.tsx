"use client";

import { useEffect, useState } from "react";
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
  Power,
  Activity,
  Command,
  Search,
  RefreshCw,
  FolderOpen,
  ExternalLink,
  ArrowLeft,
  ArrowUpRight,
  ChevronRight,
  House,
  Download,
  FileBadge2,
  FileCode2,
  GraduationCap,
  Play,
} from "lucide-react";
import { profile, projects, skillGroups } from "@/data/profile";
import { executeTerminalCommand, terminalCommands } from "@/lib/terminal";
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
            <div className={`project-cover mb-3 overflow-hidden rounded-lg border border-[var(--line)] bg-[linear-gradient(135deg,rgba(120,169,255,.18),rgba(124,227,195,.08))] ${p.name === "PetLink" ? "project-cover-petlink" : p.name === "ParkWatch" ? "project-cover-parkwatch" : ""}`}>
              {p.cover ? (
                <Image
                  src={p.cover}
                  alt={`Vista previa de ${p.name}`}
                  width={960}
                  height={540}
                  className={`h-full w-full ${p.name === "PetLink" || p.name === "ParkWatch" ? "object-contain" : "object-cover transition duration-500 group-hover:scale-[1.035]"}`}
                />
              ) : (
                <div className="project-cover-placeholder">
                  <span className="mono">PROJECT / {String(index + 1).padStart(2, "0")}</span>
                  <span>Preview pendiente</span>
                </div>
              )}
              {p.demo && <span className="project-video-badge"><Play size={11} fill="currentColor" /> DEMO DISPONIBLE</span>}
              {p.demo && <span className="project-cover-play" aria-hidden="true"><Play size={18} fill="currentColor" /></span>}
            </div>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
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
              <p className="mono text-[10px] text-[var(--mint)]">PROJECT / CASE STUDY</p>
              <h3 className="mt-2 text-2xl tracking-tight">{selected.name}</h3>
            </div>
            <span className="rounded-full border border-[var(--mint)]/40 px-2 py-1 text-[10px] text-[var(--mint)]">
              {selected.status}
            </span>
          </div>
          <div className="project-detail-intro">
            <span className="mono">OVERVIEW</span>
            <p>{selected.description}</p>
          </div>
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
  const win = useOSStore((state) => state.windows[id]);
  const closeWindow = useOSStore((state) => state.closeWindow);
  const Icon = windowIcons[id];

  if (!win.open) return null;

  return (
    <section className="workspace-section-view" aria-labelledby={`workspace-title-${id}`}>
      <header className="workspace-section-heading">
        <span className="workspace-section-icon"><Icon size={18} /></span>
        <div className="min-w-0">
          <span className="workspace-section-kicker">DEV OS / PORTAFOLIO</span>
          <h1 id={`workspace-title-${id}`}>{win.title}</h1>
        </div>
        <button type="button" onClick={() => closeWindow(id)} className="workspace-home-return">
          <span>Volver al inicio</span><X size={15} />
        </button>
      </header>
      <div className="workspace-section-content" key={id}>
        <AppContent id={id} />
      </div>
    </section>
  );
}

function WorkspaceHome({ now, onOpen }: { now: Date; onOpen: (id: AppId) => void }) {
  return (
    <div className="workspace-home">
      <section className="workspace-welcome">
        <div className="workspace-welcome-copy">
          <span className="workspace-section-kicker">DAVID CABRERA / ESPACIO DE TRABAJO</span>
          <h1>Ideas que ya<br /><em>están en marcha.</em></h1>
          <p>Explora los proyectos, herramientas y experiencias que estoy construyendo.</p>
          <div className="workspace-welcome-actions">
            <button type="button" onClick={() => onOpen("projects")} className="workspace-primary-action">Explorar proyectos <ArrowUpRight size={15} /></button>
            <button type="button" onClick={() => onOpen("about")} className="workspace-secondary-action">Conocer a David</button>
          </div>
        </div>
        <div className="workspace-welcome-aside" aria-hidden="true">
          <span className="workspace-orbit workspace-orbit-one" />
          <span className="workspace-orbit workspace-orbit-two" />
          <span className="workspace-aside-index">DC<span> / 01</span></span>
          <span className="workspace-aside-caption">SOFTWARE · IDEAS · INTERACCIÓN</span>
        </div>
      </section>

      <div className="workspace-home-grid">
        <section className="workspace-home-projects">
          <div className="workspace-home-section-heading">
            <div><span className="workspace-section-kicker">TRABAJO SELECCIONADO</span><h2>Proyectos en curso</h2></div>
            <button type="button" onClick={() => onOpen("projects")}>Ver todos <ChevronRight size={15} /></button>
          </div>
          <div className="workspace-project-grid">
            {projects.map((project, index) => (
              <button type="button" className={`workspace-project-tile workspace-project-tile-${index + 1}`} key={project.name} onClick={() => onOpen("projects")}>
                <span className="workspace-project-image">
                  {project.cover ? <Image src={project.cover} alt="" fill sizes="(max-width: 900px) 45vw, 28vw" className={project.name === "PetLink" || project.name === "ParkWatch" ? "workspace-portrait-cover" : ""} /> : <span className="workspace-cover-placeholder">{project.name.slice(0, 2)}</span>}
                </span>
                <span className="workspace-project-scrim" />
                <span className="workspace-project-meta"><small>0{index + 1} / PROYECTO</small><strong>{project.name}</strong><i><ArrowUpRight size={14} /></i></span>
              </button>
            ))}
          </div>
        </section>

        <aside className="workspace-home-aside">
          <section className="workspace-profile-card">
            <div className="workspace-profile-top"><span className="workspace-section-kicker">PERFIL / EN LÍNEA</span><i /></div>
            <div className="workspace-profile-identity"><span className="workspace-profile-avatar">DC</span><div><strong>{profile.name}</strong><small>{profile.role}</small></div></div>
            <p>Desarrollo web integral, software interactivo y soluciones con IA.</p>
            <button type="button" onClick={() => onOpen("about")}>Ver perfil <ArrowUpRight size={14} /></button>
          </section>
          <section className="workspace-home-stats" aria-label="Resumen del espacio de trabajo">
            <div><strong>{projects.length.toString().padStart(2, "0")}</strong><span>proyectos</span></div>
            <div><strong>{Object.values(skillGroups).flat().length.toString().padStart(2, "0")}</strong><span>tecnologías</span></div>
            <div><strong>{Object.keys(skillGroups).length.toString().padStart(2, "0")}</strong><span>áreas</span></div>
          </section>
          <section className="workspace-date-card">
            <span className="workspace-section-kicker">HOY / COLOMBIA</span>
            <strong>{now.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}</strong>
            <span>{now.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })}</span>
          </section>
        </aside>
      </div>
    </div>
  );
}

export function OSDesktop({ onExit }: { onExit: () => void }) {
  const [now, setNow] = useState(() => new Date());
  const hydratePreferences = useOSStore((state) => state.hydratePreferences);
  const openWindow = useOSStore((state) => state.openWindow);
  const closeWindow = useOSStore((state) => state.closeWindow);
  const activeId = useOSStore((state) => state.activeId);
  const theme = useOSStore((state) => state.theme);
  const wallpaper = useOSStore((state) => state.wallpaper);
  const reducedMotion = useOSStore((state) => state.reducedMotion);

  useEffect(() => { hydratePreferences(); }, [hydratePreferences]);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openWindow("terminal");
      } else if (event.key === "Escape" && activeId) {
        closeWindow(activeId);
      } else if (event.key === "Home" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        if (activeId) closeWindow(activeId);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [activeId, closeWindow, openWindow]);

  const activeApp = activeId ? apps.find((app) => app.id === activeId) : null;

  return (
    <main aria-label="Escritorio DEV OS" data-theme={theme} data-reduced-motion={reducedMotion} className={`devos-shell ${theme === "aero" ? "aero-desktop" : wallpaper === "grid" ? "grid-bg" : ""}`}>
      <header className="devos-topbar">
        <button type="button" className="devos-brand" onClick={() => activeId && closeWindow(activeId)} aria-label="Ir al inicio de DEV OS">
          <span className="devos-brand-mark">N</span><span>DEV OS</span><i>/</i><small>{activeApp ? activeApp.label.toLowerCase() : "workspace / portfolio"}</small>
        </button>
        <div className="devos-topbar-actions">
          <span className="devos-online"><i /> SISTEMA EN LÍNEA</span>
          <span className="devos-active-count"><Activity size={14} /> {activeId ? "1 sección activa" : "espacio listo"}</span>
          <Link href="/" className="devos-portfolio-link"><ExternalLink size={13} /><span>Mi portafolio</span></Link>
          <button type="button" className="devos-command-link" onClick={() => openWindow("terminal")} aria-keyshortcuts="Control+K"><Command size={14} /><span>Terminal</span><kbd>Ctrl K</kbd></button>
        </div>
      </header>

      <div className="devos-layout">
        <aside className="devos-sidebar">
          <div className="devos-sidebar-heading"><span className="devos-sidebar-heading-mark"><Monitor size={16} /></span><div><strong>Workspace</strong><small>PORTAFOLIO PERSONAL</small></div></div>
          <nav className="devos-nav" aria-label="Navegación del espacio de trabajo">
            <button type="button" className={`devos-nav-item devos-nav-home ${!activeId ? "is-active" : ""}`} aria-current={!activeId ? "page" : undefined} onClick={() => activeId && closeWindow(activeId)}>
              <House size={17} /><span>Inicio</span><small>00</small>
            </button>
            <div className="devos-nav-group">
              <span className="devos-nav-label">PORTAFOLIO</span>
              {apps.filter((app) => ["about", "projects", "experience", "education", "skills", "contact"].includes(app.id)).map(({ id, label, icon: Icon }, index) => (
                <button type="button" key={id} className={`devos-nav-item ${activeId === id ? "is-active" : ""}`} aria-current={activeId === id ? "page" : undefined} onClick={() => openWindow(id)}>
                  <Icon size={17} /><span>{label}</span><small>{String(index + 1).padStart(2, "0")}</small>
                </button>
              ))}
            </div>
            <div className="devos-nav-group devos-nav-system">
              <span className="devos-nav-label">SISTEMA</span>
              {apps.filter((app) => ["files", "terminal", "settings"].includes(app.id)).map(({ id, label, icon: Icon }, index) => (
                <button type="button" key={id} className={`devos-nav-item ${activeId === id ? "is-active" : ""}`} aria-current={activeId === id ? "page" : undefined} onClick={() => openWindow(id)}>
                  <Icon size={17} /><span>{label}</span><small>{String(index + 1).padStart(2, "0")}</small>
                </button>
              ))}
            </div>
          </nav>
          <div className="devos-sidebar-footer"><span className="devos-sidebar-avatar">DC</span><div><strong>David Cabrera</strong><small>Software + 3D</small></div><span className="devos-sidebar-status" /></div>
        </aside>

        <section className="devos-main-area" aria-live="polite">
          <div className="devos-content-scroll">
            {activeId ? <WindowView key={activeId} id={activeId} /> : <WorkspaceHome now={now} onOpen={openWindow} />}
          </div>
          <footer className="devos-statusbar">
            <span><i />{activeApp ? `PORTAFOLIO / ${activeApp.label.toUpperCase()}` : "WORKSPACE / RESUMEN"}</span>
            <span className="devos-status-shortcut"><Command size={12} /> Ctrl K abre terminal · Esc vuelve al inicio</span>
            <div><time>{now.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}</time><button type="button" onClick={onExit} aria-label="Salir de DEV OS"><Power size={15} /></button></div>
          </footer>
        </section>
      </div>
    </main>
  );
}
