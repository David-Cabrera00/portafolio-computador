# Arquitectura

## Capas

- `src/app`: rutas App Router, metadata y estilos globales.
- `src/components`: experiencia 3D procedural y escritorio OS.
- `src/store`: estado centralizado de ventanas y preferencias con Zustand.
- `src/data`: fuente única de verdad para el contenido personal.
- `src/types`: contratos explícitos para perfil, proyectos y habilidades.

La ruta `/` es el portafolio clásico accesible y responsive; `/dev-os` contiene la experiencia 3D/DEV OS opcional. La ruta previa `/portfolio` redirige a `/` para conservar compatibilidad con enlaces existentes. Ambas experiencias consumen la misma fuente central de datos; los recursos personales del portafolio clásico viven en `public/portfolio/`.

La escena 3D se carga únicamente en cliente con `dynamic(..., { ssr: false })`. El workstation mantiene un fallback procedural, mientras que los assets GLB opcionales se cargan dentro de `Suspense` para no bloquear la experiencia si fallan. El portafolio en `/` no depende de WebGL.

El portafolio clásico usa `PortfolioLanguageProvider` como contexto cliente para persistir el idioma `es`/`en` en `localStorage`, actualizar el atributo `lang` del documento y compartir copys traducidos entre navegación, secciones y acciones sin duplicar rutas.

## Decisiones

- Las aplicaciones son vistas controladas por un único gestor de ventanas.
- `Archivos` conserva su navegación interna en estado local de la aplicación: la raíz y sus carpetas no abren ventanas nuevas, mientras que los accesos de contenido lanzan la aplicación correspondiente o abren el recurso externo real.
- `Sobre mí` y `Proyectos` reutilizan los assets personales y demos definidos en la fuente central; las imágenes viven en `public/portfolio/assets/` y los videos de proyecto se muestran con poster en el índice y se cargan únicamente en el detalle seleccionado.
- El chrome de las ventanas se mantiene centralizado en `WindowView`: la identidad de aplicación, ruta local, controles y estados de foco son comunes, mientras cada panel conserva su contenido especializado.
- Los paneles del DEV OS usan un encabezado editorial compartido (`AppPanelHeader`) solo para jerarquía y metadata; cada aplicación puede definir su propio lenguaje visual y estructura sin duplicar el chrome de la ventana.
- Educación consume la carrera y certificaciones registradas en el portafolio; Experiencia mantiene como pendiente el historial laboral no confirmado; Ajustes refleja en una vista previa las preferencias reales del store.
- La terminal usa una lista explícita de comandos y nunca ejecuta comandos del sistema.
- Los datos personales incompletos se muestran como placeholders honestos.
- La referencia académica `structure-portfolio.vercel.app` no pudo ser inspeccionada desde el navegador disponible; sus apartados deberán confirmarse antes de declarar equivalencia académica.

- La iluminación de la escena 3D se genera localmente con Environment y Lightformer; no depende de HDRIs remotas para iniciar.
