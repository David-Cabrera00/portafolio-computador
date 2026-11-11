# Plan de implementación

## Fase 0 — Auditoría

- [x] Inspeccionar repositorio y confirmar que estaba vacío.
- [x] Investigar referencias; registrar limitaciones de acceso.
- [x] Definir arquitectura, tokens y fuente central de datos.

## Fase 1 — Base funcional

- [x] Next.js App Router + TypeScript estricto.
- [x] Tailwind v4, ESLint, Prettier y scripts de validación.
- [x] Metadata y ruta clásica `/portfolio`.

## Fase 2 — Experiencia 3D y OS

- [x] Escena procedural con monitor, escritorio, luces y controles limitados.
- [x] Entrada manual al escritorio web.
- [x] Ventanas con abrir, cerrar, minimizar, maximizar y foco.
- [x] Aplicaciones About, Projects, Skills, Files, Contact, Settings y Terminal.

## Próximas fases y criterios de aceptación

1. Persistir preferencias con validación SSR-safe; aceptar si recarga conserva tema y accesibilidad.
2. Añadir tests unitarios de store/parser; aceptar si cubren comandos y transiciones de ventana.
3. Añadir Playwright responsive; aceptar si desktop y móvil cargan `/` y `/portfolio`.
4. Confirmar estructura académica con el contenido del profesor; aceptar solo cuando las secciones estén verificadas.
5. Incorporar modelo GLB original/licenciado y transición de cámara al click del monitor; aceptar si existe fallback WebGL y no se bloquea la ruta clásica.
