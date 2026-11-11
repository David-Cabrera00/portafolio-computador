import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Developer Portfolio OS",
  description: "Portafolio interactivo de ingeniería de software.",
  metadataBase: new URL("https://portafolio-computador.vercel.app"),
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
