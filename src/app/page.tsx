"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import { OSDesktop } from "@/components/os-desktop";
import { SceneBoundary } from "@/components/scene-boundary";
const ThreeScene = dynamic(
  () => import("@/components/three-scene").then((m) => m.ThreeScene),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full place-items-center text-sm text-[var(--muted)]">
        Cargando escena…
      </div>
    ),
  },
);

export default function Home() {
  const [mode, setMode] = useState<"intro" | "scene" | "os">(() =>
    typeof window !== "undefined" &&
    localStorage.getItem("dev-os-intro-seen") === "true"
      ? "scene"
      : "intro",
  );
  const enterOS = () => {
    localStorage.setItem("dev-os-intro-seen", "true");
    setMode("os");
  };
  if (mode === "os") return <OSDesktop onExit={() => setMode("scene")} />;
  return (
    <main suppressHydrationWarning className="min-h-screen bg-[var(--bg)]">
      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <SceneBoundary>
            <ThreeScene
              onMonitorClick={() => window.setTimeout(enterOS, 850)}
            />
          </SceneBoundary>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(8,11,18,.92)_0%,rgba(8,11,18,.68)_34%,rgba(8,11,18,.08)_75%),linear-gradient(0deg,rgba(8,11,18,.65)_0%,transparent_38%)]" />
        <div className="relative z-10 flex min-h-screen flex-col justify-between p-6 sm:p-10">
          <header className="flex items-center justify-between">
            <span className="mono text-xs tracking-[.28em] text-[var(--mint)]">
              DEV / OS_01
            </span>
            <a
              href="/portfolio"
              className="focus-ring rounded-full border border-[var(--line)] px-4 py-2 text-xs text-[var(--muted)] hover:text-white"
            >
              Ver portafolio clásico{" "}
              <ExternalLink size={13} className="ml-2 inline" />
            </a>
          </header>
          <div className="max-w-xl pb-16 sm:pb-20">
            <div className="mb-5 flex items-center gap-2 text-xs uppercase tracking-[.22em] text-[var(--blue)]">
              <Sparkles size={14} /> interactive portfolio system
            </div>
            <h1 className="max-w-2xl text-5xl font-semibold leading-[.98] tracking-[-.05em] sm:text-7xl">
              Una interfaz para contar cómo pienso.
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-[var(--muted)]">
              Explora una computadora procedural, entra a un escritorio web y
              conoce proyectos, habilidades y el camino de un ingeniero de
              software.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {mode === "intro" && (
                <button
                  onClick={() => setMode("scene")}
                  className="focus-ring rounded-full bg-[var(--blue)] px-5 py-3 text-sm font-medium text-[#08101c]"
                >
                  Iniciar experiencia{" "}
                  <ArrowRight size={16} className="ml-2 inline" />
                </button>
              )}
              {mode === "scene" && (
                <button
                  onClick={enterOS}
                  className="focus-ring rounded-full bg-[var(--mint)] px-5 py-3 text-sm font-medium text-[#08101c]"
                >
                  Entrar al sistema{" "}
                  <ArrowRight size={16} className="ml-2 inline" />
                </button>
              )}
              <button
                onClick={enterOS}
                className="focus-ring rounded-full border border-[var(--line)] px-5 py-3 text-sm text-white"
              >
                Omitir introducción
              </button>
            </div>
          </div>
          <footer className="flex justify-between text-xs text-[#6f7d94]">
            <span>Procedural 3D fallback · WebGL optional</span>
            <span>Click monitor to enter · keyboard alternative available</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
