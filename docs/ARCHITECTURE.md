# Arquitectura

## Capas

- `src/app`: rutas App Router, metadata y estilos globales.
- `src/components`: experiencia 3D procedural y escritorio OS.
- `src/store`: estado centralizado de ventanas y preferencias con Zustand.
- `src/data`: fuente única de verdad para el contenido personal.
- `src/types`: contratos explícitos para perfil, proyectos y habilidades.

La escena 3D se carga únicamente en cliente con `dynamic(..., { ssr: false })`. El modelo actual es procedural para mantener un fallback ejecutable sin GLB. El contenido `/portfolio` no depende de WebGL.

## Decisiones

- Las aplicaciones son vistas controladas por un único gestor de ventanas.
- La terminal usa una lista explícita de comandos y nunca ejecuta comandos del sistema.
- Los datos personales incompletos se muestran como placeholders honestos.
- La referencia académica `structure-portfolio.vercel.app` no pudo ser inspeccionada desde el navegador disponible; sus apartados deberán confirmarse antes de declarar equivalencia académica.
