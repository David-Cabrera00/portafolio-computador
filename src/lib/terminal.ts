import { profile, projects, skillGroups } from "@/data/profile";
import type { AppId } from "@/store/os-store";

export const terminalCommands = [
  "help",
  "about",
  "projects",
  "skills",
  "experience",
  "education",
  "contact",
  "whoami",
  "clear",
  "date",
  "echo",
  "theme",
  "open",
] as const;
export type TerminalResult = {
  output: string;
  clear?: boolean;
  openApp?: AppId;
};

export function executeTerminalCommand(
  input: string,
  now = new Date(),
): TerminalResult {
  const command = input.trim();
  if (!command) return { output: "" };
  const [name, arg] = command.split(/\s+/);
  if (name === "help") return { output: terminalCommands.join("  ") };
  if (name === "about") return { output: `${profile.name} · ${profile.role}` };
  if (name === "projects")
    return { output: projects.map((p) => `• ${p.name}`).join("\n") };
  if (name === "skills")
    return { output: Object.values(skillGroups).flat().join(" · ") };
  if (name === "experience") return { output: profile.experience };
  if (name === "education") return { output: profile.education };
  if (name === "whoami") return { output: profile.name };
  if (name === "date") return { output: now.toLocaleString("es-CO") };
  if (name === "echo") return { output: command.slice(5) };
  if (name === "clear") return { output: "", clear: true };
  if (name === "theme")
    return { output: arg ? `Tema solicitado: ${arg}` : "Uso: theme dark" };
  if (
    name === "open" &&
    arg &&
    [
      "about",
      "projects",
      "skills",
      "experience",
      "education",
      "terminal",
      "files",
      "contact",
      "settings",
    ].includes(arg)
  )
    return { output: `Abriendo ${arg}...`, openApp: arg as AppId };
  return { output: `Comando no reconocido: ${name}. Escribe help.` };
}
