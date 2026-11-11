# Developer Portfolio OS

Portafolio personal interactivo construido con Next.js, React, TypeScript, Three.js, React Three Fiber, Zustand, Motion y Lucide.

## Inicio

```bash
npm install
npm run dev
```

Rutas principales:

- `/`: experiencia 3D procedural + escritorio DEV OS.
- `/portfolio`: versión clásica accesible sin WebGL.

## Comandos

`npm run build`, `npm run lint`, `npm test`, `npm run test:e2e` y `npm run format`.

## Personalización

Actualiza `src/data/profile.ts` para nombre, correo, enlaces, proyectos y habilidades. No se incluyen datos personales inventados ni URLs de proyectos no confirmadas.

En producción, define `NEXT_PUBLIC_SITE_URL` con la URL real del despliegue para generar correctamente metadata, sitemap y robots.

## Estado técnico

La primera versión usa una computadora procedural como fallback y no requiere modelos externos. El PDF/CV, imágenes, experiencia académica y servicios de contacto quedan preparados para añadirse cuando existan datos reales. La estructura académica referenciada no pudo verificarse desde el inspector disponible.
