import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const metadata: Metadata = {
  title: "Developer Portfolio OS",
  description: "Portafolio interactivo de ingeniería de software.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Developer Portfolio OS",
    description: "Portafolio interactivo de ingeniería de software.",
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
      <body>{children}</body>
    </html>
  );
}
