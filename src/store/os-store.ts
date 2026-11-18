"use client";

import { create } from "zustand";

export type AppId =
  | "about"
  | "projects"
  | "skills"
  | "education"
  | "terminal"
  | "files"
  | "contact"
  | "settings";
export type WindowState = {
  id: AppId;
  title: string;
  open: boolean;
  minimized: boolean;
  closing: boolean;
  maximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
};

type OSState = {
  windows: Record<AppId, WindowState>;
  activeId: AppId | null;
  theme: "aero" | "dark" | "dusk";
  wallpaper: "aurora" | "grid" | "plain";
  sounds: boolean;
  reducedMotion: boolean;
  hydrated: boolean;
  openWindow: (id: AppId) => void;
  closeWindow: (id: AppId) => void;
  beginCloseWindow: (id: AppId) => void;
  minimizeWindow: (id: AppId) => void;
  maximizeWindow: (id: AppId) => void;
  focusWindow: (id: AppId) => void;
  moveWindow: (id: AppId, position: { x: number; y: number }) => void;
  resizeWindow: (id: AppId, size: { width: number; height: number }) => void;
  setTheme: (theme: "aero" | "dark" | "dusk") => void;
  setWallpaper: (wallpaper: "aurora" | "grid" | "plain") => void;
  setSounds: (sounds: boolean) => void;
  setReducedMotion: (value: boolean) => void;
  hydratePreferences: () => void;
  resetPreferences: () => void;
};

const titles: Record<AppId, string> = {
  about: "Sobre mí",
  projects: "Proyectos",
  skills: "Habilidades",
  education: "Educación",
  terminal: "Terminal",
  files: "Archivos",
  contact: "Contacto",
  settings: "Configuración",
};
const AERO_MIGRATION_KEY = "dev-os-aero-migrated";
const initialWindows = Object.fromEntries(
  Object.keys(titles).map((id, index) => [
    id,
    {
      id: id as AppId,
      title: titles[id as AppId],
      open: false,
      minimized: false,
      closing: false,
      maximized: false,
      zIndex: 1,
      position: { x: 8 + (index % 3) * 4, y: 10 + (index % 2) * 4 },
      size: { width: 720, height: 460 },
    },
  ]),
) as Record<AppId, WindowState>;

export const useOSStore = create<OSState>((set) => ({
  windows: initialWindows,
  activeId: null,
  theme: "aero",
  wallpaper: "aurora",
  sounds: false,
  reducedMotion: false,
  hydrated: false,
  openWindow: (id) =>
    set((s) => ({
      windows: Object.fromEntries(
        Object.entries(s.windows).map(([windowId, current]) => [
          windowId,
          {
            ...current,
            open: windowId === id,
            minimized: false,
            closing: false,
            zIndex: windowId === id ? current.zIndex + 1 : current.zIndex,
          },
        ]),
      ) as Record<AppId, WindowState>,
      activeId: id,
    })),
  closeWindow: (id) =>
    set((s) => {
      const windows = {
        ...s.windows,
        [id]: { ...s.windows[id], open: false, closing: false },
      };
      return { windows, activeId: s.activeId === id ? null : s.activeId };
    }),
  beginCloseWindow: (id) => {
    set((s) => ({
      windows: {
        ...s.windows,
        [id]: { ...s.windows[id], closing: true },
      },
    }));
    if (typeof window !== "undefined") {
      window.setTimeout(() => useOSStore.getState().closeWindow(id), 180);
    }
  },
  minimizeWindow: (id) =>
    set((s) => {
      const windows = {
        ...s.windows,
        [id]: { ...s.windows[id], minimized: true },
      };
      return { windows, activeId: s.activeId === id ? null : s.activeId };
    }),
  maximizeWindow: (id) =>
    set((s) => ({
      windows: {
        ...s.windows,
        [id]: { ...s.windows[id], maximized: !s.windows[id].maximized },
      },
      activeId: id,
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
  resizeWindow: (id, size) =>
    set((s) => ({
      windows: { ...s.windows, [id]: { ...s.windows[id], size } },
    })),
  setTheme: (theme) => {
    set({ theme });
    persist({ theme });
  },
  setWallpaper: (wallpaper) => {
    set({ wallpaper });
    persist({ wallpaper });
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
      ) as Partial<
        Pick<OSState, "theme" | "wallpaper" | "sounds" | "reducedMotion">
      > | null;
      const migrated = localStorage.getItem(AERO_MIGRATION_KEY) === "true";
      const preferences = migrated
        ? stored ?? {}
        : { ...(stored ?? {}), theme: "aero" as const };
      localStorage.setItem(AERO_MIGRATION_KEY, "true");
      localStorage.setItem(
        "dev-os-preferences",
        JSON.stringify({ ...(stored ?? {}), ...preferences }),
      );
      set({ ...preferences, hydrated: true });
    } catch {
      set({ hydrated: true });
    }
  },
  resetPreferences: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("dev-os-preferences");
      localStorage.removeItem("dev-os-intro-seen");
      localStorage.removeItem(AERO_MIGRATION_KEY);
    }
    set({
      theme: "aero",
      wallpaper: "aurora",
      sounds: false,
      reducedMotion: false,
    });
  },
}));

function persist(
  values: Partial<
    Pick<OSState, "theme" | "wallpaper" | "sounds" | "reducedMotion">
  >,
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
