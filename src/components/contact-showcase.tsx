"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Copy, Mail, MapPin, Send } from "lucide-react";
import type { Profile } from "@/types/portfolio";
import { usePortfolioLanguage } from "@/components/portfolio-language";

export function ContactShowcase({ profile }: { profile: Profile }) {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState("");
  const { t } = usePortfolioLanguage();

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setStatus(t.contact.fallback);
    }
  };

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const subject = String(data.get("subject") ?? t.contact.subject).trim();
    const message = String(data.get("message") ?? "").trim();
    const body = `Nombre: ${name}\nCorreo: ${email}\n\n${message}`;
    setStatus(t.contact.opening);
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section id="contact" className="classic-contact-section">
      <div className="classic-container contact-exhibit">
        <div className="contact-intro">
          <div className="contact-section-mark"><span>06</span><i /></div>
          <p className="classic-kicker">{t.contact.kicker}</p>
          <h2>{t.contact.title} <em>{t.contact.emphasis}</em></h2>
          <p className="contact-copy">{t.contact.text}</p>
          <div className="contact-signal"><span className="contact-signal-dot" /> {t.contact.available} {profile.availability}</div>
          <div className="contact-details">
            <div className="contact-detail-card"><span className="contact-detail-label"><Mail size={13} /> {t.contact.email}</span><strong>{profile.email}</strong><button type="button" onClick={copyEmail}>{copied ? <Check size={14} /> : <Copy size={14} />} {copied ? t.contact.copied : t.contact.copy}</button></div>
            <div className="contact-detail-card"><span className="contact-detail-label"><MapPin size={13} /> {t.contact.location}</span><strong>{profile.location}</strong><small>{t.contact.remote}</small></div>
          </div>
          <div className="contact-socials"><a href={profile.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} /></a></div>
        </div>
        <form className="contact-form" onSubmit={submitContact}>
          <div className="contact-form-top"><span>{t.contact.form}</span><span>{t.contact.ready}</span></div>
          <div className="contact-form-grid">
            <label><span>{t.contact.name} <b>*</b></span><input name="name" required placeholder="David Cabrera" /></label>
            <label><span>{t.contact.emailLabel} <b>*</b></span><input name="email" type="email" required placeholder="email@example.com" /></label>
          </div>
          <label><span>{t.contact.subject}</span><input name="subject" placeholder={t.contact.subject} /></label>
          <label><span>{t.contact.message} <b>*</b></span><textarea name="message" required rows={6} placeholder={t.contact.message} /></label>
          <div className="contact-form-footer"><span>{status || t.contact.status}</span><button type="submit" className="classic-button classic-button-primary">{t.contact.send} <Send size={15} /></button></div>
        </form>
      </div>
    </section>
  );
}
