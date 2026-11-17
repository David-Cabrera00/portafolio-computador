# Design system

- Fondo: `#080B12`; panel: `#111827`; superficie: `#171D2C`.
- Bordes: `#2A3448`; texto: `#F3F6FC`; secundario: `#A7B4C9`.
- Acentos: azul `#78A9FF`, menta `#7CE3C3`.
- Tema Dusk: tokens púrpura/menta aplicados en el contenedor del escritorio mediante `data-theme`.
- Tema Aero Blue: escritorio azul luminoso inspirado en interfaces de escritorio clásicas, con vidrio translúcido, brillos controlados, botón Inicio circular y ventanas con profundidad. Es una referencia estética propia; no reutiliza marcas, wallpapers ni assets propietarios.
- Interfaz sin glassmorphism dominante: capas opacas, bordes finos y sombras suaves.
- Tipografía de interfaz sans-serif; terminal y etiquetas técnicas usan monospace.
- Tipografía de interfaz: pila Inter/system sans; display con tracking negativo y monospace técnico con JetBrains Mono/SFMono/Consolas como fallback.
- Motion: transform/opacity, breve y con respeto a `prefers-reduced-motion`.
- Selector de tema: el control del portafolio usa iconos explícitos de luna/sol; el cambio anima entrada, giro y escala sin alterar el layout, y desactiva el movimiento con `prefers-reduced-motion`.
- Escena: la luz azul define el monitor, la menta funciona como rebote ambiental y las sombras de contacto anclan los objetos a la superficie.
- Foco visible con anillo menta; los controles interactivos son botones o enlaces reales.
- Explorador DEV OS: breadcrumb, búsqueda, tarjetas de archivo escalonadas, estados de sistema y acciones claras; la densidad se mantiene en dos columnas y colapsa a una en ventanas estrechas.
- Media DEV OS: Sobre mí usa una galería personal de tres imágenes con etiquetas discretas y hover de profundidad; Proyectos usa posters con indicador de demo en tarjetas y un único reproductor controlado en el detalle, siempre contenido dentro del marco de la ventana.
- Media maximizada: las galerías usan alturas y proporciones acotadas; la ventana maximizada puede ganar ancho sin convertir las imágenes o videos en bloques desbordados, y mantiene el scroll interno como mecanismo de lectura.
- Chrome de ventanas: barra superior sólida con icono de aplicación, ruta técnica, controles agrupados, foco visual y separación clara entre marco y contenido; el maximizado conserva el mismo lenguaje sin inflar los elementos.
- Identidad por aplicación: Sobre mí usa perfil vivo y galería, Proyectos usa casos con estado y demo, Terminal usa consola de sesión; comparten tokens Aero pero no una tarjeta genérica repetida.
- Educación presenta la carrera activa y certificados en un registro cronológico; Experiencia usa una línea de estado honesta; Ajustes muestra el efecto visual de tema y wallpaper antes de sus controles.
- Portafolio clásico: habilidades como módulos editoriales interactivos sin porcentajes arbitrarios; certificaciones como archivo de expedientes navegable con consola visual, fichas apiladas y estados pendientes honestos.
- Proyectos: un caso protagonista con índice lateral, imagen inmersiva, overlays de estado, scan line y enlaces de código/demo; no se usa una cuadrícula uniforme como patrón principal.
- Portada: composición editorial con tipografía display, retrato enmarcado con órbitas/ coordenadas, ticker técnico y microestado de disponibilidad; la personalidad visual no depende de gradientes genéricos ni de porcentajes.
- Motion editorial: parallax sutil por puntero, capas con velocidades distintas, reveals y microinteracciones; `prefers-reduced-motion` desactiva el movimiento sin bloquear el contenido. No se replica la intro ni la composición de la referencia externa.
- Motion de portada: flotación continua del retrato, órbita independiente, señales de estado pulsantes y barrido de interacción por capas; el movimiento debe percibirse en reposo, no solo al pasar el cursor.
- Hero convencional: escenario de retrato sin tarjeta rígida, con retícula, anillos concéntricos, crosshair, etiquetas flotantes y capas de profundidad; la referencia externa aporta principios de motion, no una composición para copiar.
- Secciones convencionales: cada bloque tiene un gesto propio —collage reactivo, tarjetas documentales con scan, testimonios editoriales y contacto con barrido ambiental— dentro de una misma gramática de profundidad.
- Sobre mí: perfil editorial interactivo con tres modos de lectura, collage fotográfico en capas y datos personales tratados como señales de un archivo vivo.
- Experiencia: línea de tiempo con nodos circulares, registro activo, órbita documental, barrido de luz y cambio de ficha sin recarga; la experiencia no confirmada permanece explícitamente como registro abierto.
- Proyectos: cada caso de estudio tiene un tono cromático propio, profundidad por puntero, coordenadas visuales, metadatos de tipo/estado y una imagen con marco de scan; la navegación sigue siendo por índice y teclado.
- Repositorios: cuando existe un enlace real, la acción de código se muestra como acceso GitHub verificable; los proyectos sin demo continúan comunicando honestamente que esa parte está pendiente.
- Video de proyectos: AnatomyLab AI y LULLABY pueden mostrar demostraciones reales con `poster`, carga de metadatos, controles, reproducción silenciada en loop y adaptación responsive; los assets deben optimizarse antes de producción si superan un peso razonable.
- Testimonios: carrusel de una cita protagonista con pila de archivos, controles circulares, progreso lineal y estados honestos; la interacción funciona como archivo editorial, no como grid de tarjetas.
- Habilidades & Certificaciones: categorías centradas en frameworks frontend/backend, datos e IA aplicada; el archivo usa previews de certificados reales, fichas de emisor/fecha y cinco expedientes navegables.
- Corrección de tono: Habilidades & Certificaciones usa papel cálido y tinta oscura en claro, evitando el azul grisáceo genérico; en oscuro conserva el archivo como panel profundo con acentos violeta/menta.
- Navegación: el navbar sigue la secuencia semántica de la página y comunica la sección visible con un indicador activo; no incluye Laboratorio, que pertenece exclusivamente al DEV OS 3D.
- Navegación persistente: el navbar convencional usa posición fija, con compensación superior responsive y `scroll-margin` en las secciones; permanece visible sin superponer el contenido ni romper el desplazamiento anclado.
- Documentos: las certificaciones conservan su tratamiento de archivo editorial, pero cada registro con PDF real expone una acción `OPEN PDF`; el CV se ofrece como descarga desde el hero y todos los documentos se sirven desde `public/portfolio/`.
- Contacto y footer: el contacto usa una composición editorial de dos columnas, con formulario claro que prepara un correo real mediante `mailto`, tarjetas de datos y señales de disponibilidad; el footer funciona como mapa secundario del sitio y conserva los accesos a redes, CV y DEV OS.
- Refinamiento de contacto: el bloque se presenta como un canal abierto con numeración, señal viva, tarjetas de identidad y panel de mensaje; el footer usa tres columnas editoriales, navegación agrupada y una línea de cierre con retorno al inicio.
- Tipografía editorial: `Instrument Serif` para títulos y frases de display, `Manrope` para lectura e interfaz, y `JetBrains Mono` para metadatos técnicos. La dupla editorial se limita a `/portfolio` para no alterar el lenguaje del DEV OS.
- Scroll motion: las secciones revelan su contenido según la intersección real con el viewport mediante opacidad progresiva, translate, escala y blur; el modo reducido elimina el movimiento y muestra el contenido completo.
- Jerarquía tipográfica: Manrope se usa en títulos principales y UI con escala amplia; Instrument Serif aparece solo en fragmentos editoriales destacados y en cursiva, evitando que toda la interfaz adopte un tono caligráfico.
- Balance del hero: `Construyo mundos.` funciona como contrapunto tipográfico reducido y normal, no como un segundo titular dominante; la cursiva queda disponible solo para énfasis editoriales concretos.
- Hero tipográfico: las tres líneas principales usan Manrope; Instrument Serif no se aplica al texto del hero para evitar deformación o exceso de cursiva en la primera impresión.
- Hero tipográfico refinado: las dos primeras líneas usan Manrope y la frase de cierre usa Instrument Serif normal, sin cursiva, con ancho controlado y wrap responsive únicamente en móvil.
- Composición del hero: el display se organiza en dos líneas semánticas completas, evitando cortes artificiales dentro de `Diseño sistemas.`; desktop conserva una línea por frase y móvil adapta el wrapping.
- Intro del hero: el mensaje principal usa dos líneas controladas —`Construyendo software con` y `rigor, lógica y propósito.`— con una entradilla de ancho limitado; no se fuerza overflow horizontal y el wrap solo se relaja en móvil.
- Inicio y Sobre mí: el hero comunica propuesta, stack y perfil breve; Sobre mí concentra la narrativa profesional extensa en un bloque interactivo, con título de alto impacto y párrafos legibles mediante `white-space: pre-line`.
- Títulos editoriales: cada sección combina Manrope e Instrument Serif normal en fragmentos semánticos, con color de acento limitado al remate y `text-wrap: balance`; no se usa cursiva global ni `white-space: nowrap` fuera del hero controlado.
- Hero responsive y navegación: la propuesta inicial usa escala contenida y wrapping natural por palabras, sin truncar caracteres; los enlaces del navbar apuntan a IDs semánticos y respetan el offset del encabezado fijo.
- Responsive de lectura: en anchos estrechos el display conserva palabras completas, las acciones mantienen objetivos táctiles cómodos, los datos de contacto reorganizan sus acciones y el footer cambia a una columna sin overflow.
- Reveal responsive: las secciones altas no dependen de una proporción imposible del viewport para volverse legibles; en móvil se muestran completas al entrar y el motion progresivo queda reservado para superficies donde el viewport puede medirlo correctamente.
- Hero depurado: los rótulos técnicos decorativos y coordenadas ficticias se eliminan del contenido visible; la composición conserva únicamente propuesta, presentación, acciones y fotografía.
- Responsive navigation: desde tablet el navbar cambia a un menú desplegable accesible, con foco por teclado, cierre al seleccionar una sección y el mismo indicador activo; el layout usa una transición intermedia antes de apilarse en móvil.
- Limpieza editorial: los textos ornamentales sin valor de contenido no deben competir con la propuesta real; el hero prioriza disponibilidad, mensaje, biografía y acciones, mientras los metadatos visuales quedan como formas y motion sin copy ficticio.
- Contenido verificable: no se muestran testimonios, empleos o coordenadas inventadas; cuando no existe información real, la sección se retira hasta contar con datos confirmados.
- Testimonios honestos: la sección usa referencias reales proporcionadas por David, con relación y contexto explícitos; no se presentan como citas textuales aquello que no fue entregado como cita.
- Acciones del hero: el botón de CV comparte el lenguaje de acento del CTA principal y los perfiles externos se muestran como botones circulares de icono; la escala tipográfica puede crecer solo dentro de un ancho seguro y nunca mediante overflow.
- Idiomas: el portafolio convencional ofrece selector persistente `ES / EN` en el navbar, con estado activo visible, alternativa dentro del menú móvil y traducción de la interfaz sin cambiar la identidad visual.
- Idiomas — contenido: la traducción cubre también descripciones de proyectos, habilidades, certificados y formación; nombres propios, marcas y tecnologías se conservan para mantener precisión técnica.
- Contraste de tema: las tarjetas de selección de Habilidades respetan la superficie del tema oscuro; la numeración y el acento activo mantienen contraste sin arrastrar el fondo cálido del modo claro.
- Formación como archivo: la línea de tiempo agrupa carrera y certificaciones como hitos seleccionables; las fichas reservan el footer dentro del flujo para evitar solapamientos y muestran acciones documentales reales.
- Progreso de recorrido: la línea de Formación usa una variable CSS actualizada con `requestAnimationFrame` durante el scroll para comunicar avance espacial sin añadir texto ni controles artificiales.
- Orden temporal: los hitos de Formación se presentan de fecha más antigua a más reciente; el estado activo sigue el avance de la barra para que la lectura visual y la navegación tengan la misma lógica.
- Metadatos visibles: evitar numeración técnica repetida y nomenclatura de archivo si no ayuda a comprender el contenido; proyectos y formación priorizan nombre, fecha, descripción, emisor y acciones reales.
- Clasificación de habilidades: frameworks backend/frontend, datos, IA aplicada y desarrollo interactivo se presentan en grupos distintos; Godot, C#, Blender y Krita dejan de mezclarse con backend y se reconocen como herramientas de experiencias interactivas.
- Foto de portada: retrato en marco cuadrado de esquinas suaves, con recorte centrado y sombras de profundidad para dar mayor presencia a la fotografía.
- Proyectos — navegación directa: el showcase permite recorrer proyectos con flechas del teclado, Inicio/Fin y controles anterior/siguiente sobre la demo; en móvil los controles siempre están visibles y en escritorio aparecen al interactuar.
- Casos sin material de portada: PetLink y ParkWatch reciben ilustraciones CSS propias (mapa/ruta y reloj de muñeca) coherentes con cada producto, sin métricas ni capturas ficticias.

Navegación móvil del showcase: admite gestos laterales para avanzar o retroceder entre proyectos, conserva el desplazamiento vertical y respeta prefers-reduced-motion. La tarjeta entra desde el sentido del cambio.

DEV OS escritorio: superficie grafito con acentos violeta/menta y área central despejada; las aplicaciones se abren en ventanas y los proyectos se exploran dentro de su aplicación, sin repetirlos en el escritorio.

Ventana enfocada: el fondo recibe un velo oscuro y blur leve; la ventana activa usa superficie opaca, borde de acento y elevación superior para evitar que el contenido del escritorio se mezcle con la aplicación.

Medios de proyecto: usar posters WebP optimizados para escenas 3D. Las demos pesadas deben mostrar portada y cargar el reproductor solo por interacción explícita; declarar `preload="none"` para no solicitar videos antes de reproducir.
