import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { profile, projects, skillGroups } from "@/data/profile";

export default function PortfolioPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
      <nav className="flex items-center justify-between border-b border-[var(--line)] pb-5">
        <Link
          href="/"
          className="mono text-xs tracking-[.25em] text-[var(--mint)]"
        >
          DEV / OS_01
        </Link>
        <div className="flex gap-5 text-sm text-[var(--muted)]">
          <a href="#projects">Proyectos</a>
          <a href="#skills">Habilidades</a>
          <a href="#background">Trayectoria</a>
          <a href="#contact">Contacto</a>
        </div>
      </nav>
      <section className="grid min-h-[70vh] items-center gap-10 py-20 md:grid-cols-[1.3fr_.7fr]">
        <div>
          <p className="mono mb-5 text-sm text-[var(--blue)]">{profile.role}</p>
          <h1 className="display max-w-3xl text-6xl font-semibold leading-[.95] sm:text-8xl">
            {profile.tagline}
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-[var(--muted)]">
            {profile.bio}
          </p>
        </div>
        <aside className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6">
          <p className="mono text-xs text-[var(--mint)]">PROFILE / 001</p>
          <p className="mt-8 text-2xl">{profile.name}</p>
          <p className="mt-2 text-[var(--muted)]">{profile.location}</p>
          <div className="mt-8 h-px bg-[var(--line)]" />
          <p className="mt-5 text-sm leading-6 text-[var(--muted)]">
            Contenido académico y datos personales centralizados en{" "}
            <code>src/data/profile.ts</code>.
          </p>
        </aside>
      </section>
      <section id="projects" className="border-t border-[var(--line)] py-20">
        <p className="mono text-xs text-[var(--blue)]">02 / SELECTED WORK</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {projects.map((p, i) => (
            <article
              key={p.name}
              className="rounded-2xl border border-[var(--line)] p-6 transition hover:-translate-y-1 hover:bg-[var(--surface)]"
            >
              <span className="mono text-xs text-[#71809a]">0{i + 1}</span>
              <h2 className="mt-14 text-2xl">{p.name}</h2>
              <p className="mt-3 leading-7 text-[var(--muted)]">
                {p.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-[var(--line)] px-3 py-1 text-xs text-[var(--blue)]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
      <section
        id="skills"
        className="grid gap-10 border-t border-[var(--line)] py-20 md:grid-cols-[.7fr_1.3fr]"
      >
        <div>
          <p className="mono text-xs text-[var(--blue)]">03 / TOOLKIT</p>
          <h2 className="mt-5 text-4xl tracking-[-.04em]">
            Herramientas para convertir ideas en sistemas.
          </h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          {Object.entries(skillGroups).map(([group, skills]) => (
            <div key={group}>
              <h3 className="text-[var(--mint)]">{group}</h3>
              <p className="mt-3 leading-8 text-[var(--muted)]">
                {skills.join(" · ")}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section
        id="background"
        className="grid gap-4 border-t border-[var(--line)] py-20 md:grid-cols-2"
      >
        <article className="rounded-2xl border border-[var(--line)] p-6">
          <p className="mono text-xs text-[var(--blue)]">04 / EDUCATION</p>
          <h2 className="mt-5 text-2xl">Formación académica</h2>
          <p className="mt-3 leading-7 text-[var(--muted)]">
            {profile.education}. Completa esta sección con institución,
            programa, semestre y fechas confirmadas.
          </p>
        </article>
        <article className="rounded-2xl border border-[var(--line)] p-6">
          <p className="mono text-xs text-[var(--blue)]">05 / EXPERIENCE</p>
          <h2 className="mt-5 text-2xl">Experiencia y aprendizaje</h2>
          <p className="mt-3 leading-7 text-[var(--muted)]">
            {profile.experience}. Solo se publicará información verificable.
          </p>
        </article>
      </section>
      <section id="contact" className="border-t border-[var(--line)] py-20">
        <p className="mono text-xs text-[var(--blue)]">04 / CONTACT</p>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-8">
          <h2 className="display max-w-xl text-5xl">
            ¿Construimos algo con criterio?
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="rounded-full bg-[var(--mint)] px-5 py-3 text-sm text-[#08101c]"
            >
              Escribir un correo{" "}
              <ArrowUpRight size={16} className="ml-2 inline" />
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[var(--line)] px-5 py-3 text-sm text-[var(--blue)]"
            >
              GitHub ↗
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[var(--line)] px-5 py-3 text-sm text-[var(--blue)]"
            >
              LinkedIn ↗
            </a>
          </div>
        </div>
      </section>
      <footer className="flex justify-between border-t border-[var(--line)] py-6 text-xs text-[#71809a]">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <Link href="/" className="text-[var(--blue)]">
          Abrir DEV OS ↗
        </Link>
      </footer>
    </main>
  );
}
