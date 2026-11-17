"use client";

import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { useState } from "react";
import { usePortfolioLanguage } from "@/components/portfolio-language";

const testimonials = [
  {
    id: "sara",
    es: { name: "Sara Noguera", role: "Compañera de 7.º semestre", type: "COMPAÑERA / COLABORACIÓN", text: "Hemos trabajado juntos en diferentes actividades y proyectos académicos, compartiendo ideas, responsabilidades y aprendizajes durante el proceso." },
    en: { name: "Sara Noguera", role: "Seventh-semester classmate", type: "CLASSMATE / COLLABORATION", text: "We have worked together on different academic activities and projects, sharing ideas, responsibilities and lessons throughout the process." },
  },
  {
    id: "edwin",
    es: { name: "Edwin Urbina", role: "Compañero de 6.º semestre", type: "COMPAÑERO / PROYECTOS", text: "Hemos trabajado juntos en diferentes proyectos y emprendimientos, convirtiendo ideas en avances concretos y aprendiendo de cada reto del camino." },
    en: { name: "Edwin Urbina", role: "Sixth-semester classmate", type: "CLASSMATE / PROJECTS", text: "We have worked together on different projects and ventures, turning ideas into concrete progress and learning from each challenge along the way." },
  },
  {
    id: "felipe",
    es: { name: "Felipe Rosas", role: "Ingeniero de Sistemas · Universidad Mariana", type: "COLEGA / MENTORÍA", text: "Colega y amigo que me ha apoyado en diferentes proyectos. Hemos trabajado juntos para explorar ideas, resolver retos técnicos y seguir creciendo en el desarrollo de soluciones tecnológicas." },
    en: { name: "Felipe Rosas", role: "Systems Engineer · Universidad Mariana", type: "COLLEAGUE / MENTORSHIP", text: "A colleague and friend who has supported me across different projects. We have worked together to explore ideas, solve technical challenges and keep growing while building technology solutions." },
  },
] as const;

export function TestimonialsShowcase() {
  const { language, t } = usePortfolioLanguage();
  const [active, setActive] = useState(0);
  const item = testimonials[active][language];
  const next = () => setActive((current) => (current + 1) % testimonials.length);
  const previous = () => setActive((current) => (current - 1 + testimonials.length) % testimonials.length);

  return (
    <section id="testimonials" className="classic-section testimonials-exhibit-section">
      <div className="classic-container">
        <div className="classic-section-heading"><div><p className="classic-kicker">{t.testimonials.kicker}</p><h2>{t.testimonials.title} <em>{t.testimonials.emphasis}</em></h2></div><span className="classic-count">{t.testimonials.count}</span></div>
        <div className="testimonials-exhibit">
          <div className="testimonials-stack" aria-hidden="true"><div className="testimonial-stack-card testimonial-stack-back" /><div className="testimonial-stack-card testimonial-stack-middle" /><div className="testimonial-stack-card testimonial-stack-front"><span>REFERENCE / 0{active + 1}</span><i>{item.type}</i></div></div>
          <article className="testimonial-feature" key={item.name}><div className="testimonial-feature-top"><span>{item.type}</span><span>{String(active + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}</span></div><Quote className="testimonial-quote-icon" size={34} strokeWidth={1.1} /><h3>{item.name}</h3><p>{item.text}</p><small>{item.role}</small><div className="testimonial-feature-footer"><div className="testimonial-progress">{testimonials.map((entry, index) => <button type="button" aria-label={`${language === "es" ? "Ver testimonio" : "View testimonial"} ${index + 1}`} className={index === active ? "is-active" : ""} onClick={() => setActive(index)} key={entry.id} />)}</div><div className="testimonial-controls"><button type="button" aria-label={language === "es" ? "Testimonio anterior" : "Previous testimonial"} onClick={previous}><ArrowLeft size={15} /></button><button type="button" aria-label={language === "es" ? "Testimonio siguiente" : "Next testimonial"} onClick={next}><ArrowRight size={15} /></button></div></div></article>
        </div>
      </div>
    </section>
  );
}
