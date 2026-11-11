# Progreso

- Fase actual: 4, ventanas interactivas y pruebas E2E preparadas.
- Completado: scaffold Next.js, dependencias, documentación inicial, escena 3D procedural, escritorio OS, gestor de ventanas, terminal segura, ruta clásica, datos centralizados, preferencias persistentes y ventanas movibles.
- Pendiente: ejecutar E2E cuando el entorno permita descargar Chromium, accesibilidad de foco entre ventanas, responsive móvil refinado, modelo GLB y verificación de estructura académica.
- Problemas encontrados: `manuelcanello.dev`, `nareshkhatri.dev` y `structure-portfolio.vercel.app` no fueron legibles desde el inspector web; `dvmiz-portfolio.vercel.app` abrió sin contenido textual. Se evita inventar requisitos no comprobados.
- Pruebas ejecutadas: `npm run lint` (sin errores), `npm run build` (correcto), `npm test` (4 tests correctos), `npx playwright test --list` (4 casos listados). `npm run test:e2e` bloqueado por navegador no instalado y certificado SSL del entorno.
- Próximo paso: tests E2E, transición de cámara y completar datos personales reales.
