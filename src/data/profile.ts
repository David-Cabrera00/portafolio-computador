import type { Profile, Project, SkillGroups } from "@/types/portfolio";

export const profile = {
  name: "David Andrés Cabrera",
  role: "Estudiante de Ingeniería de Software",
  tagline: "Construyendo software con rigor, lógica y propósito.",
  bio: "Soy estudiante de Ingeniería de Software, amante del deporte y la tecnología. Me dedico al desarrollo web integral y trabajo con frameworks y herramientas modernas como React, Next.js, Tailwind CSS, Django, Spring Boot, Node.js, PostgreSQL y soluciones con Inteligencia Artificial.",
  location: "Colombia",
  email: "david.cabrerabelal@gmail.com",
  github: "https://github.com/David-Cabrera00",
  linkedin: "https://www.linkedin.com/in/david-cabrera-209a4a407/",
  education: "Ingeniería de Software · Universidad Cooperativa de Colombia",
  experience: "Experiencia profesional por confirmar",
  availability: "24/7",
} satisfies Profile;

export const projects: Project[] = [
  {
    name: "LULLABY",
    description:
      "Videojuego 3D roguelike de terror psicológico donde Noah, un bebé atrapado en una pesadilla, enfrenta criaturas nacidas de juguetes y recuerdos familiares usando sus lágrimas como defensa.",
    stack: ["Godot 4.7.2 (.NET)", "C#", "Blender", "Krita"],
    status: "Proyecto registrado",
    repository: "https://github.com/AlePython-byte/LULLABY.git",
    cover: "/projects/lullaby.png",
    video: "/projects/lullaby.mp4",
  },
  {
    name: "AnatomyLab AI",
    description:
      "Aplicación de escritorio para estudiar anatomía humana mediante modelos 3D interactivos, fichas educativas, estudio guiado, quizzes y seguimiento del progreso.",
    stack: ["3D interactivo", "Educación", "IA"],
    status: "Proyecto registrado",
    repository: "https://github.com/David-Cabrera00/Anatomylab-Proyect.git",
    cover: "/projects/anatomylab-ai.png",
    video: "/projects/anatomylab-ai.mp4",
  },
  {
    name: "PetLink",
    description:
      "Ecosistema móvil colaborativo para reportar animales de compañía extraviados o encontrados, explorar reportes geoespaciales, recibir alertas y cruzar coincidencias por proximidad y similitud física.",
    stack: ["Mobile", "Geolocalización", "Algoritmos"],
    status: "Proyecto registrado",
    repository: "https://github.com/David-Cabrera00/PetLink-Proyect.git",
    cover: "/projects/petlink-preview.webp",
    video: "/projects/petlink.mp4",
  },
  {
    name: "ParkWatch",
    description:
      "Aplicación standalone para Wear OS que registra, ubica y gestiona el estacionamiento de automóviles, motocicletas, bicicletas o scooters, completamente offline.",
    stack: ["Wear OS", "Standalone", "Offline-first"],
    status: "Proyecto registrado",
    repository: "https://github.com/David-Cabrera00/ParkWatch-Proyect.git",
  },
];

export const skillGroups = {
  "Frameworks backend": ["Spring Boot", "Node.js", "NestJS"],
  "Frameworks frontend": ["React", "Next.js", "Tailwind CSS", "Vite"],
  "Datos y persistencia": ["PostgreSQL", "MongoDB", "SQLite", "SQL"],
  "IA aplicada": ["IA generativa", "Agentes de IA", "Diseño de prompts", "IA en desarrollo"],
  "Desarrollo interactivo": ["Godot 4", "C#", "Blender", "Krita"],
} satisfies SkillGroups;
