import { describe, expect, it } from "vitest";
import { executeTerminalCommand } from "./terminal";

describe("terminal parser", () => {
  it("returns help and rejects arbitrary input", () => {
    expect(executeTerminalCommand("help").output).toContain("projects");
    expect(executeTerminalCommand("rm -rf /").output).toContain(
      "no reconocido",
    );
  });
  it("opens only supported portfolio apps", () => {
    expect(executeTerminalCommand("open projects").openApp).toBe("projects");
    expect(executeTerminalCommand("open server").openApp).toBeUndefined();
  });
});
