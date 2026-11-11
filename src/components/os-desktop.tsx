"use client";

import { useEffect, useRef, useState } from "react";
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
  Power,
} from "lucide-react";
import { profile, projects, skillGroups } from "@/data/profile";
import { executeTerminalCommand, terminalCommands } from "@/lib/terminal";
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

function AppContent({ id }: { id: AppId }) {
  const openWindow = useOSStore((s) => s.openWindow);
  if (id === "about")
    return (
      <div className="space-y-4">
        <p className="text-lg text-white">{profile.role}</p>
        <p className="text-[var(--muted)] leading-7">{profile.bio}</p>
        <div className="rounded-xl border border-[var(--line)] bg-black/20 p-4">
          <span className="mono text-xs text-[var(--mint)]">STATUS</span>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Disponible para construir y aprender. Completa tus datos reales en{" "}
            <code>src/data/profile.ts</code>.
          </p>
        </div>
      </div>
    );
  if (id === "projects") return <ProjectsPanel />;
  if (id === "skills")
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Object.entries(skillGroups).map(([group, skills]) => (
          <div key={group}>
            <h3 className="mb-2 text-sm text-[var(--mint)]">{group}</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-[var(--line)] px-3 py-1 text-xs text-[var(--muted)]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  if (id === "experience")
    return (
      <div className="space-y-4">
        <p className="text-lg">Experiencia</p>
        <div className="rounded-xl border border-[var(--line)] bg-black/20 p-4 text-sm leading-6 text-[var(--muted)]">
          {profile.experience}. Añade aquí únicamente experiencias, proyectos
          académicos o participaciones verificables.
        </div>
      </div>
    );
  if (id === "education")
    return (
      <div className="space-y-4">
        <p className="text-lg">Formación académica</p>
        <div className="rounded-xl border border-[var(--line)] bg-black/20 p-4 text-sm leading-6 text-[var(--muted)]">
          {profile.education}. Completa institución, programa, semestre y fechas
          cuando estén confirmados.
        </div>
      </div>
    );
  if (id === "contact") return <ContactPanel />;
  if (id === "files")
    return (
      <div className="mono text-sm leading-8 text-[var(--muted)]">
        <p className="text-[var(--mint)]">/portfolio</p>
        <p>├── about/</p>
        <p>├── projects/</p>
        <p>├── skills/</p>
        <p>├── documents/</p>
        <p>└── contact/</p>
        <p className="mt-3 text-xs text-[#71809a]">
          CV no disponible: añade un PDF real en public/documents/.
        </p>
      </div>
    );
  if (id === "settings") return <SettingsPanel />;
  return <TerminalPanel onOpen={openWindow} />;
}

function ProjectsPanel() {
  const [query, setQuery] = useState("");
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const visible = projects.filter((project) =>
    `${project.name} ${project.description} ${project.stack.join(" ")}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const selected = projects.find((project) => project.name === selectedName);
  return (
    <div className="space-y-3">
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
      {visible.map((p) => (
        <button
          type="button"
          key={p.name}
          onClick={() =>
            setSelectedName(selectedName === p.name ? null : p.name)
          }
          aria-expanded={selectedName === p.name}
          className={`block w-full rounded-xl border bg-[#101725] p-4 text-left transition ${selectedName === p.name ? "border-[var(--blue)]" : "border-[var(--line)] hover:border-[var(--blue)]/60"}`}
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold">{p.name}</h3>
            <span className="mono text-[10px] text-[var(--mint)]">
              {p.status}
            </span>
          </div>
          <p className="mt-2 text-sm text-[var(--muted)]">{p.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {p.stack.map((s) => (
              <span
                key={s}
                className="rounded-md bg-[#202b40] px-2 py-1 text-xs text-[var(--blue)]"
              >
                {s}
              </span>
            ))}
          </div>
        </button>
      ))}
      {selected && (
        <aside className="rounded-xl border border-[var(--blue)]/50 bg-[#162238] p-4">
          <p className="mono text-[10px] text-[var(--mint)]">PROJECT DETAIL</p>
          <h3 className="mt-2 text-lg">{selected.name}</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {selected.description}
          </p>
          <p className="mt-3 text-xs text-[#71809a]">
            Repositorio, demo, capturas y responsabilidades: pendientes de
            confirmar.
          </p>
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
    <div className="space-y-4 text-sm text-[var(--muted)]">
      <p>
        El formulario usa tu cliente de correo; no almacena ni simula envíos.
      </p>
      <form onSubmit={submit} className="grid gap-3">
        <input
          name="name"
          required
          placeholder="Tu nombre"
          className="focus-ring rounded-lg border border-[var(--line)] bg-[#0d1421] px-3 py-2 text-white placeholder:text-[#71809a]"
        />
        <input
          name="email"
          type="email"
          placeholder="Tu correo (opcional)"
          className="focus-ring rounded-lg border border-[var(--line)] bg-[#0d1421] px-3 py-2 text-white placeholder:text-[#71809a]"
        />
        <textarea
          name="message"
          required
          minLength={10}
          rows={4}
          placeholder="¿En qué podemos trabajar?"
          className="focus-ring rounded-lg border border-[var(--line)] bg-[#0d1421] px-3 py-2 text-white placeholder:text-[#71809a]"
        />
        <button
          type="submit"
          className="rounded-lg bg-[var(--mint)] px-4 py-2 text-[#08101c]"
        >
          Preparar correo
        </button>
      </form>
      {status && (
        <p role="status" className="text-[var(--mint)]">
          {status}
        </p>
      )}
      <div className="grid gap-2">
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
    <div className="space-y-4 text-sm">
      <label className="flex items-center justify-between gap-4">
        Tema{" "}
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as "dark" | "dusk")}
          className="rounded-lg border border-[var(--line)] bg-[#101725] p-2"
        >
          <option value="dark">Dark</option>
          <option value="dusk">Dusk</option>
        </select>
      </label>
      <label className="flex items-center justify-between gap-4">
        Fondo{" "}
        <select
          value={wallpaper}
          onChange={(event) =>
            setWallpaper(event.target.value as "aurora" | "grid" | "plain")
          }
          className="rounded-lg border border-[var(--line)] bg-[#101725] p-2"
        >
          <option value="aurora">Aurora</option>
          <option value="grid">Grid</option>
          <option value="plain">Plano</option>
        </select>
      </label>
      <label className="flex items-center justify-between">
        Sonidos{" "}
        <input
          type="checkbox"
          checked={sounds}
          onChange={(e) => setSounds(e.target.checked)}
        />
      </label>
      <label className="flex items-center justify-between">
        Reducir animaciones{" "}
        <input
          type="checkbox"
          checked={reducedMotion}
          onChange={(e) => setReducedMotion(e.target.checked)}
        />
      </label>
      <button
        onClick={resetPreferences}
        className="rounded-lg border border-red-400/40 px-3 py-2 text-red-300"
      >
        Restablecer preferencias e introducción
      </button>
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
    <div className="mono flex h-full min-h-[280px] flex-col rounded-lg bg-[#090d15] p-3 text-xs">
      <div
        role="log"
        aria-live="polite"
        aria-label="Salida de terminal"
        className="flex-1 whitespace-pre-wrap text-[#a9bad4]"
      >
        {lines.map((line, i) => (
          <p key={`${line}-${i}`} className="mb-1">
            {line}
          </p>
        ))}
      </div>
      <div className="flex items-center gap-2 border-t border-[#202b40] pt-3 text-[var(--mint)]">
        <span>›</span>
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
  const close = useOSStore((s) => s.closeWindow);
  const minimize = useOSStore((s) => s.minimizeWindow);
  const maximize = useOSStore((s) => s.maximizeWindow);
  const focus = useOSStore((s) => s.focusWindow);
  const move = useOSStore((s) => s.moveWindow);
  const activeId = useOSStore((s) => s.activeId);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
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
    },
    // These listeners are cleaned up on unmount; handlers close over this window instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  if (!win.open || win.minimized) return null;
  return (
    <section
      onPointerDown={() => focus(id)}
      style={{
        zIndex: win.zIndex,
        ...(win.maximized
          ? {}
          : { left: `${win.position.x}%`, top: `${win.position.y}%` }),
      }}
      className={`absolute ${win.maximized ? "inset-3" : "w-[min(720px,84vw)] max-sm:inset-3 max-sm:w-auto"} overflow-hidden rounded-2xl border bg-[#111827]/95 shadow-2xl backdrop-blur-xl ${activeId === id ? "border-[var(--blue)]/70 shadow-[0_0_35px_rgba(120,169,255,.12)]" : "border-[var(--line)]"}`}
    >
      <header
        onPointerDown={startDragging}
        className="flex touch-none cursor-move items-center justify-between border-b border-[var(--line)] bg-[#171d2c] px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#ff6b7a]" />
          <span className="h-2 w-2 rounded-full bg-[#ffd166]" />
          <span className="h-2 w-2 rounded-full bg-[var(--mint)]" />
          <span className="text-sm font-medium">{win.title}</span>
        </div>
        <div className="flex gap-1">
          <button
            aria-label="Minimizar"
            onClick={() => minimize(id)}
            className="focus-ring rounded p-1 text-[var(--muted)]"
          >
            <Minus size={15} />
          </button>
          <button
            aria-label="Maximizar"
            onClick={() => maximize(id)}
            className="focus-ring rounded p-1 text-[var(--muted)]"
          >
            <Maximize2 size={14} />
          </button>
          <button
            aria-label="Cerrar"
            onClick={() => close(id)}
            className="focus-ring rounded p-1 text-[var(--muted)] hover:text-red-300"
          >
            <X size={15} />
          </button>
        </div>
      </header>
      <div className="max-h-[68vh] overflow-auto p-5">
        <AppContent id={id} />
      </div>
    </section>
  );
}

export function OSDesktop({ onExit }: { onExit: () => void }) {
  const [menu, setMenu] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const hydratePreferences = useOSStore((s) => s.hydratePreferences);
  const openWindow = useOSStore((s) => s.openWindow);
  const closeWindow = useOSStore((s) => s.closeWindow);
  const windows = useOSStore((s) => s.windows);
  const activeId = useOSStore((s) => s.activeId);
  const theme = useOSStore((s) => s.theme);
  const wallpaper = useOSStore((s) => s.wallpaper);
  const open = apps.filter((a) => windows[a.id].open);
  useEffect(() => {
    hydratePreferences();
  }, [hydratePreferences]);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menu) {
        setMenu(false);
        return;
      }
      if (event.key === "Escape" && activeId) closeWindow(activeId);
      if (event.key.toLowerCase() === "k" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        openWindow("terminal");
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [activeId, closeWindow, menu, openWindow]);
  return (
    <main
      data-theme={theme}
      className={`relative min-h-screen overflow-hidden pb-14 ${wallpaper === "grid" ? "grid-bg bg-[#0b101b]" : wallpaper === "plain" ? "bg-[#0b101b]" : "bg-[radial-gradient(circle_at_70%_10%,rgba(120,169,255,.16),transparent_35%),radial-gradient(circle_at_10%_80%,rgba(124,227,195,.1),transparent_28%)]"} ${theme === "dusk" ? "saturate-75" : ""}`}
    >
      {wallpaper === "aurora" && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(120,169,255,.13),transparent_35%),radial-gradient(circle_at_10%_80%,rgba(124,227,195,.08),transparent_28%)]" />
      )}
      <div className="pointer-events-none absolute right-6 top-6 hidden rounded-2xl border border-[var(--line)] bg-[#111827]/55 p-4 backdrop-blur-md sm:block">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--mint)]" />
          <span className="mono text-[10px] tracking-[.2em] text-[var(--mint)]">
            SYSTEM ONLINE
          </span>
        </div>
        <p className="mt-3 text-sm text-white">DEV OS / workspace</p>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Portfolio environment · secure client mode
        </p>
      </div>
      <div className="relative flex min-h-[calc(100vh-3.5rem)] flex-wrap content-start gap-5 p-6 sm:p-10">
        {apps.slice(0, 5).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onDoubleClick={() => openWindow(id)}
            onClick={() => openWindow(id)}
            className="focus-ring flex w-20 flex-col items-center gap-2 rounded-xl p-2 text-center text-xs text-[var(--muted)] transition duration-200 hover:-translate-y-1 hover:bg-white/5 hover:text-white"
          >
            <span className="rounded-xl border border-[var(--line)] bg-[#131c2b] p-3 text-[var(--blue)]">
              <Icon size={21} />
            </span>
            {label}
          </button>
        ))}
        {apps.slice(5).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => openWindow(id)}
            className="focus-ring flex w-20 flex-col items-center gap-2 rounded-xl p-2 text-center text-xs text-[var(--muted)] transition duration-200 hover:-translate-y-1 hover:bg-white/5 hover:text-white"
          >
            <span className="rounded-xl border border-[var(--line)] bg-[#131c2b] p-3 text-[var(--mint)]">
              <Icon size={21} />
            </span>
            {label}
          </button>
        ))}
        {apps.map(({ id }) => (
          <WindowView key={id} id={id} />
        ))}
      </div>
      <footer className="fixed bottom-0 left-0 right-0 z-30 flex h-14 min-w-0 items-center gap-3 overflow-x-auto border-t border-[var(--line)] bg-[#111827]/90 px-4 backdrop-blur-xl">
        <button
          aria-label="Menú de aplicaciones"
          onClick={() => setMenu(!menu)}
          className="focus-ring rounded-lg bg-[var(--blue)] p-2 text-[#08101c]"
        >
          <Monitor size={18} />
        </button>
        {open.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => openWindow(id)}
            className={`focus-ring rounded-lg border px-3 py-2 text-xs transition ${activeId === id ? "border-[var(--blue)]/50 bg-[#253553] text-white" : "border-transparent text-[var(--muted)] hover:border-[var(--line)] hover:text-white"}`}
          >
            {label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-3 text-xs text-[var(--muted)]">
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
          <div className="absolute bottom-16 left-4 w-56 rounded-2xl border border-[var(--line)] bg-[#111827] p-2 shadow-2xl">
            <div className="mb-1 border-b border-[var(--line)] px-3 pb-3 pt-2">
              <p className="text-sm text-white">{profile.name}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{profile.role}</p>
            </div>
            <p className="px-3 py-2 text-xs text-[var(--muted)]">
              DEV OS / aplicaciones
            </p>
            {apps.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => {
                  openWindow(id);
                  setMenu(false);
                }}
                className="focus-ring block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-white/5"
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </footer>
    </main>
  );
}
