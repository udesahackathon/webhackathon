import type { Metadata } from "next";
import { Inter, Fraunces, Geist_Mono } from "next/font/google";
import { seo } from "@/content/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// `metadataBase` es la base con la que Next arma las URLs absolutas de la OG
// image. Ojo con `VERCEL_URL`: en Vercel apunta a la URL única del deploy (un
// hash distinto en cada build), no al dominio de producción, así que un link
// compartido terminaba pidiendo la imagen a un deploy viejo.
// `VERCEL_PROJECT_PRODUCTION_URL` sí es el dominio estable del proyecto.
// Cuando haya dominio propio, se setea `NEXT_PUBLIC_SITE_URL` en Vercel y gana.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: seo.title,
  description: seo.description,
  openGraph: {
    title: seo.title,
    description: seo.description,
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${fraunces.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
