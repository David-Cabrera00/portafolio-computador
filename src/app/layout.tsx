import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Developer Portfolio OS", description: "Portafolio interactivo de ingeniería de software." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es"><body>{children}</body></html>; }
