import { describe, expect, it } from "vitest";

describe("DEV OS contract", () => {
  it("exposes the supported application ids", async () => {
    const { useOSStore } = await import("./os-store");
    expect(Object.keys(useOSStore.getState().windows)).toEqual([
      "about",
      "projects",
      "skills",
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
    expect(useOSStore.getState().theme).toBe("aero");
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

  it("keeps focus and maximization state synchronized", async () => {
    const { useOSStore } = await import("./os-store");
    useOSStore.getState().openWindow("contact");
    expect(useOSStore.getState().activeId).toBe("contact");
    useOSStore.getState().maximizeWindow("contact");
    expect(useOSStore.getState().windows.contact.maximized).toBe(true);
    useOSStore.getState().maximizeWindow("contact");
    expect(useOSStore.getState().windows.contact.maximized).toBe(false);
  });

  it("keeps window resizing in the centralized store", async () => {
    const { useOSStore } = await import("./os-store");
    useOSStore.getState().resizeWindow("projects", { width: 840, height: 520 });
    expect(useOSStore.getState().windows.projects.size).toEqual({
      width: 840,
      height: 520,
    });
  });
});
