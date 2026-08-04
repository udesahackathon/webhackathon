# AI Hackathon @ UdeSA

Landing page del primer AI Hackathon de la Universidad de San Andrés.

Por ahora es una landing simple orientada a **sponsors** (todavía no hay
inscripción de estudiantes ni tracks definidos — se suman más adelante).

## Stack

- [Next.js 15](https://nextjs.org/) (App Router) + TypeScript
- Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://motion.dev/) para animaciones
- Deploy en Vercel

## Qué editar primero

Todo el contenido editable (nombre del evento, fechas, ubicación, links,
copy de SEO, cronograma, organizadoras) vive en
[`src/lib/config.ts`](src/lib/config.ts). Cambiá los valores ahí, no en los
componentes.

Buscá `[FALTA COPY]` en el código para encontrar los placeholders que
todavía faltan completar (roles de organizadoras, dominio de mail de
sponsors, Instagram).

No hay sponsors ni premios confirmados todavía, así que esas secciones
muestran placeholders ("TBA", "Your logo here") a propósito — no inventé
nombres ni logos.

## Desarrollo local

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

## Sitio anterior

La versión estática original (HTML/CSS/JS plano) quedó archivada en
[`/legacy`](legacy) para referencia, no se usa en el deploy actual.
