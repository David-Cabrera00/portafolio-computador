"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { OSDesktop } from "@/components/os-desktop";
import { SceneBoundary } from "@/components/scene-boundary";

const ThreeScene = dynamic(
  () => import("@/components/three-scene").then((m) => m.ThreeScene),
  {
    ssr: false,
    loading: () => (
      <div className="scene-load-state" role="status" aria-live="polite">
        <span className="scene-load-mark" aria-hidden="true" />
        <span>Preparando la escena 3D</span>
        <small>Los modelos y la iluminación están cargando.</small>
      </div>
    ),
  },
);

const subscribeToIntroPreference = () => () => {};
const getServerIntroPreference = () => false;
const getClientIntroPreference = () =>
  typeof window !== "undefined" &&
  localStorage.getItem("dev-os-intro-seen") === "true";

export default function DevOSPage() {
  const router = useRouter();
  const introSeen = useSyncExternalStore(
    subscribeToIntroPreference,
    getClientIntroPreference,
    getServerIntroPreference,
  );
  const [mode, setMode] = useState<
    "intro" | "scene" | "boot" | "os" | "shutdown"
  >("intro");
  const [monitorFocus, setMonitorFocus] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);
  const enterOS = () => {
    localStorage.setItem("dev-os-intro-seen", "true");
    setMonitorFocus(false);
    setMode("boot");
    window.setTimeout(() => setMode("os"), 1500);
  };
  const exitOS = () => {
    setMode("shutdown");
    window.setTimeout(() => router.push("/"), 1200);
  };
  const beginEnter = (reduce = reducedMotion) => {
    if (monitorFocus) return;
    setMonitorFocus(true);
    window.setTimeout(enterOS, reduce ? 0 : 850);
  };
  const visibleMode = mode === "intro" && introSeen ? "scene" : mode;
  const sceneActive = visibleMode === "intro" || visibleMode === "scene";
  return (
    <main suppressHydrationWarning className="relative min-h-screen overflow-hidden bg-[var(--bg)]" aria-label="Portafolio 3D interactivo">
      {sceneActive && (
        <section className={`scene-layer absolute inset-0 transition-opacity duration-300 ${monitorFocus ? "pointer-events-none" : ""}`}>
          <div className="absolute inset-0">
            <SceneBoundary>
              <ThreeScene
                onMonitorClick={beginEnter}
              />
            </SceneBoundary>
          </div>
          {monitorFocus && (
            <div className="pointer-events-none absolute inset-0 z-20 bg-[#07101d]/35 backdrop-blur-[1px]" />
          )}
          <p className="sr-only">Haz click en el monitor para entrar al portafolio interactivo.</p>
          {!monitorFocus && <div className="scene-controls"><Link href="/" className="scene-classic-link">Portafolio convencional</Link><button type="button" className="scene-enter-button" onClick={() => beginEnter()}><i aria-hidden="true" />Entrar al escritorio</button></div>}
        </section>
      )}
      {visibleMode === "os" && <OSDesktop onExit={exitOS} />}
      {visibleMode === "boot" && <BootScreen />}
      {visibleMode === "shutdown" && <ShutdownScreen />}
    </main>
  );
}

function BootScreen() {
  const [progress, setProgress] = useState(8);
  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress((current) => Math.min(100, current + 7));
    }, 90);
    return () => window.clearInterval(timer);
  }, []);
  const status =
    progress < 32
      ? "Iniciando DEV OS…"
      : progress < 62
        ? "Cargando perfil y aplicaciones…"
        : progress < 92
          ? "Preparando escritorio Aero…"
          : "Escritorio listo.";
  return (
    <main className="os-boot-screen grid min-h-screen place-items-center px-6">
      <section className="os-boot-card w-full max-w-lg text-center">
        <div className="boot-mark" aria-hidden="true">
          <span className="boot-mark-orb">
            <i className="boot-tile boot-tile-a" />
            <i className="boot-tile boot-tile-b" />
            <i className="boot-tile boot-tile-c" />
            <i className="boot-tile boot-tile-d" />
          </span>
        </div>
        <p className="boot-brand mt-6">DEV OS</p>
        <p className="boot-edition">Aero Edition</p>
        <p aria-live="polite" className="mono mt-10 text-xs text-[var(--muted)]">{status}</p>
        <div className="boot-progress mt-4"><div className="boot-progress-value" style={{ width: `${progress}%` }} /></div>
        <div className="mt-3 flex justify-between text-[10px] text-[var(--muted)]"><span className="mono">SESSION / LOCAL</span><span className="mono">{progress}%</span></div>
      </section>
    </main>
  );
}

function ShutdownScreen() {
  return (
    <main className="os-shutdown-screen relative grid min-h-screen place-items-center overflow-hidden px-6">
      <div className="shutdown-veil absolute inset-0" aria-hidden="true" />
      <section className="relative z-10 text-center">
        <div className="shutdown-orb" aria-hidden="true"><span className="shutdown-orb-core" /></div>
        <p className="boot-brand mt-8">DEV OS</p>
        <p className="boot-edition">Cerrando sesión y volviendo al portafolio…</p>
        <div className="shutdown-progress mx-auto mt-8" />
      </section>
    </main>
  );
}
