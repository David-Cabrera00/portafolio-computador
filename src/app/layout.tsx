import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const instrumentSerif = Instrument_Serif({ subsets: ["latin"], variable: "--font-instrument", display: "swap", weight: "400", style: ["normal", "italic"] });
const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const metadata: Metadata = {
  title: "David Andrés Cabrera | Portafolio de Ingeniería de Software",
  description: "Estudiante de Ingeniería de Software interesado en desarrollo web integral, experiencias 3D y soluciones con inteligencia artificial.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "David Andrés Cabrera | Portafolio de Ingeniería de Software",
    description: "Estudiante de Ingeniería de Software interesado en desarrollo web integral, experiencias 3D y soluciones con inteligencia artificial.",
    type: "website",
    locale: "es_CO",
  },
  robots: { index: true, follow: true },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${manrope.variable} ${instrumentSerif.variable} ${jetBrainsMono.variable}`}>{children}</body>
    </html>
  );
}
