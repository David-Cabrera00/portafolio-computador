"use client";

import { create } from "zustand";

export type AppId =
  | "about"
  | "projects"
  | "skills"
  | "terminal"
  | "files"
  | "contact"
  | "settings";
export type WindowState = {
  id: AppId;
  title: string;
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
};

type OSState = {
  windows: Record<AppId, WindowState>;
  activeId: AppId | null;
  theme: "dark" | "dusk";
  sounds: boolean;
  reducedMotion: boolean;
  hydrated: boolean;
  openWindow: (id: AppId) => void;
  closeWindow: (id: AppId) => void;
  minimizeWindow: (id: AppId) => void;
  maximizeWindow: (id: AppId) => void;
  focusWindow: (id: AppId) => void;
  moveWindow: (id: AppId, position: { x: number; y: number }) => void;
  setTheme: (theme: "dark" | "dusk") => void;
  setSounds: (sounds: boolean) => void;
  setReducedMotion: (value: boolean) => void;
  hydratePreferences: () => void;
  resetPreferences: () => void;
};

const titles: Record<AppId, string> = {
  about: "Sobre mí",
  projects: "Proyectos",
  skills: "Habilidades",
  terminal: "Terminal",
  files: "Archivos",
  contact: "Contacto",
  settings: "Configuración",
};
const initialWindows = Object.fromEntries(
  Object.keys(titles).map((id, index) => [
    id,
    {
      id: id as AppId,
      title: titles[id as AppId],
      open: false,
      minimized: false,
      maximized: false,
      zIndex: 1,
      position: { x: 8 + (index % 3) * 4, y: 10 + (index % 2) * 4 },
    },
  ]),
) as Record<AppId, WindowState>;

export const useOSStore = create<OSState>((set) => ({
  windows: initialWindows,
  activeId: null,
  theme: "dark",
  sounds: false,
  reducedMotion: false,
  hydrated: false,
  openWindow: (id) =>
    set((s) => ({
      windows: {
        ...s.windows,
        [id]: {
          ...s.windows[id],
          open: true,
          minimized: false,
          zIndex:
            Math.max(...Object.values(s.windows).map((w) => w.zIndex)) + 1,
        },
      },
      activeId: id,
    })),
  closeWindow: (id) =>
    set((s) => ({
      windows: { ...s.windows, [id]: { ...s.windows[id], open: false } },
      activeId: s.activeId === id ? null : s.activeId,
    })),
  minimizeWindow: (id) =>
    set((s) => ({
      windows: { ...s.windows, [id]: { ...s.windows[id], minimized: true } },
      activeId: null,
    })),
  maximizeWindow: (id) =>
    set((s) => ({
      windows: {
        ...s.windows,
        [id]: { ...s.windows[id], maximized: !s.windows[id].maximized },
      },
    })),
  focusWindow: (id) =>
    set((s) => ({
      windows: {
        ...s.windows,
        [id]: {
          ...s.windows[id],
          zIndex:
            Math.max(...Object.values(s.windows).map((w) => w.zIndex)) + 1,
        },
      },
      activeId: id,
    })),
  moveWindow: (id, position) =>
    set((s) => ({
      windows: { ...s.windows, [id]: { ...s.windows[id], position } },
    })),
  setTheme: (theme) => {
    set({ theme });
    persist({ theme });
  },
  setSounds: (sounds) => {
    set({ sounds });
    persist({ sounds });
  },
  setReducedMotion: (reducedMotion) => {
    set({ reducedMotion });
    persist({ reducedMotion });
  },
  hydratePreferences: () => {
    if (typeof window === "undefined") return;
    try {
      const stored = JSON.parse(
        localStorage.getItem("dev-os-preferences") ?? "null",
      ) as Partial<Pick<OSState, "theme" | "sounds" | "reducedMotion">> | null;
      set({ ...(stored ?? {}), hydrated: true });
    } catch {
      set({ hydrated: true });
    }
  },
  resetPreferences: () => {
    if (typeof window !== "undefined")
      localStorage.removeItem("dev-os-preferences");
    set({ theme: "dark", sounds: false, reducedMotion: false });
  },
}));

function persist(
  values: Partial<Pick<OSState, "theme" | "sounds" | "reducedMotion">>,
) {
  if (typeof window === "undefined") return;
  try {
    const previous = JSON.parse(
      localStorage.getItem("dev-os-preferences") ?? "{}",
    ) as Record<string, unknown>;
    localStorage.setItem(
      "dev-os-preferences",
      JSON.stringify({ ...previous, ...values }),
    );
  } catch {
    /* Storage may be unavailable in private browsing. */
  }
}
