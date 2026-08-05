import type { NextConfig } from "next";

// `next dev` y `next build` escriben en el mismo directorio de salida y se
// pisan entre sí: si corrés un build con el dev server vivo (o al revés), los
// manifests quedan a medias y aparecen errores tipo
// "ENOENT: .next/routes-manifest.json" o "Cannot find module for page: /_document".
// Separando el directorio por entorno esa colisión se vuelve imposible.
// El build de producción sigue saliendo en `.next`, que es lo que espera Vercel.
const nextConfig: NextConfig = {
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
};

export default nextConfig;
