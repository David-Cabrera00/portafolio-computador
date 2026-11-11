import { expect, test } from "@playwright/test";

test("classic portfolio is reachable", async ({ page }) => {
  await page.goto("/portfolio");
  await expect(page.getByText("SELECTED WORK")).toBeVisible();
  await expect(page.getByRole("link", { name: /Abrir DEV OS/ })).toBeVisible();
});

test("desktop can open projects and terminal", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Iniciar experiencia/ }).click();
  await page.getByRole("button", { name: /Entrar al sistema/ }).click();
  await page.getByRole("button", { name: "Proyectos" }).first().click();
  await expect(page.getByText("MediCitas")).toBeVisible();
  await page.getByRole("button", { name: "Terminal" }).first().click();
  await page.getByLabel("Comando de terminal").fill("help");
  await page.getByLabel("Comando de terminal").press("Enter");
  await expect(page.getByText(/help  about/)).toBeVisible();
});
