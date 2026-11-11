"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useSyncExternalStore } from "react";
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

const subscribeToIntroPreference = () => () => {};
const getServerIntroPreference = () => false;
const getClientIntroPreference = () =>
  typeof window !== "undefined" &&
  localStorage.getItem("dev-os-intro-seen") === "true";

export default function Home() {
  const introSeen = useSyncExternalStore(
    subscribeToIntroPreference,
    getClientIntroPreference,
    getServerIntroPreference,
  );
  const [mode, setMode] = useState<"intro" | "scene" | "boot" | "os">("intro");
  const [monitorFocus, setMonitorFocus] = useState(false);
  const enterOS = () => {
    localStorage.setItem("dev-os-intro-seen", "true");
    setMonitorFocus(false);
    setMode("boot");
    window.setTimeout(() => setMode("os"), 1200);
  };
  const visibleMode = mode === "intro" && introSeen ? "scene" : mode;
  if (visibleMode === "os")
    return <OSDesktop onExit={() => setMode("scene")} />;
  if (visibleMode === "boot") return <BootScreen />;
  return (
    <main suppressHydrationWarning className="min-h-screen bg-[var(--bg)]" aria-label="Portafolio 3D interactivo">
      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <SceneBoundary>
            <ThreeScene
              onMonitorClick={() => {
                setMonitorFocus(true);
                window.setTimeout(enterOS, 850);
              }}
            />
          </SceneBoundary>
        </div>
        {monitorFocus && (
          <div className="pointer-events-none absolute inset-0 z-20 bg-[#07101d]/35 backdrop-blur-[1px]" />
        )}
        <p className="sr-only">Haz click en el monitor para entrar al portafolio interactivo.</p>
      </section>
    </main>
  );
}

function BootScreen() {
  const [progress, setProgress] = useState(16);
  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress((current) => Math.min(100, current + 8));
    }, 90);
    return () => window.clearInterval(timer);
  }, []);
  const status =
    progress < 40
      ? "Montando entorno visual…"
      : progress < 72
        ? "Sincronizando proyectos y herramientas…"
        : "Escritorio listo."
  return (
    <main className="grid-bg grid min-h-screen place-items-center bg-[#080b12] px-6">
      <section className="w-full max-w-md rounded-2xl border border-[var(--line)] bg-[#111827]/80 p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <span className="mono text-xs tracking-[.25em] text-[var(--mint)]">
            DEV / OS_01
          </span>
          <span className="mono text-xs text-[var(--muted)]">BOOT</span>
        </div>
        <p className="mt-12 text-2xl tracking-[-.03em]">
          Inicializando entorno
        </p>
        <p aria-live="polite" className="mono mt-3 text-xs text-[var(--muted)]">
          {status}
        </p>
        <div className="mt-8 h-1 overflow-hidden rounded-full bg-[#26344d]">
          <div
            className="h-full rounded-full bg-[var(--mint)] transition-[width] duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mono mt-3 text-right text-[10px] text-[var(--muted)]">
          READY / {progress}%
        </p>
      </section>
    </main>
  );
}
