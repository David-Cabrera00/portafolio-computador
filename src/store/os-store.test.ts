import { describe, expect, it } from "vitest";

describe("DEV OS contract", () => {
  it("exposes the supported application ids", async () => {
    const { useOSStore } = await import("./os-store");
    expect(Object.keys(useOSStore.getState().windows)).toEqual([
      "about",
      "projects",
      "skills",
      "experience",
      "education",
      "terminal",
      "files",
      "contact",
      "settings",
    ]);
  });

  it("opens and minimizes a window predictably", async () => {
    const { useOSStore } = await import("./os-store");
    useOSStore.getState().openWindow("projects");
    expect(useOSStore.getState().windows.projects.open).toBe(true);
    useOSStore.getState().minimizeWindow("projects");
    expect(useOSStore.getState().windows.projects.minimized).toBe(true);
  });

  it("resets preferences to safe defaults", async () => {
    const { useOSStore } = await import("./os-store");
    useOSStore.getState().setTheme("dusk");
    useOSStore.getState().setSounds(true);
    useOSStore.getState().resetPreferences();
    expect(useOSStore.getState().theme).toBe("dark");
    expect(useOSStore.getState().sounds).toBe(false);
  });

  it("keeps window movement in the centralized store", async () => {
    const { useOSStore } = await import("./os-store");
    useOSStore.getState().moveWindow("projects", { x: 22, y: 18 });
    expect(useOSStore.getState().windows.projects.position).toEqual({
      x: 22,
      y: 18,
    });
  });
});
