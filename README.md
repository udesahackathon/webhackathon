# AI Hackathon @ UdeSA

Landing del primer AI Hackathon de la Universidad de San Andrés.

- **Cuándo:** 23 y 24 de octubre de 2026
- **Dónde:** Universidad de San Andrés, Buenos Aires
- **Qué:** 24 horas, ~15 equipos de hasta 4 personas, estudiantes de
  universidades de toda Argentina. De kickoff a pitches finales en un sprint.

La landing apunta a **sponsors** por ahora. Todavía no hay inscripción de
estudiantes ni tracks definidos.

## Comandos

```bash
npm install
npm run dev         # http://localhost:3000

npm run typecheck   # tipos
npm run lint        # eslint
npm run build       # el build real, es lo que corre Vercel

npm run clean       # borra .next y .next-dev si algo quedó a medias
```

Deploy automático: push a `main` va a producción, cualquier otra branch levanta
un preview.

## Stack

Next.js 15 (App Router) + TypeScript, Tailwind v4 + shadcn/ui, Framer Motion,
Vercel.

## Estructura

```
src/
  app/                layout, página, favicon, OG image
  content/            todo el texto y los datos del sitio
  components/
    sections/         una sección de la landing por archivo
    layout/           header y footer
    shared/           Section, Countdown, íconos
    ui/               generado por shadcn, no editar a mano
  lib/                helpers (cn)
docs/                 notas internas de organización, no se publican
public/organizers/    fotos y logo de UdeSA
```

Contenido en `src/content`, presentación en `src/components`. Para cambiar un
texto, una fecha o un link no hace falta abrir un `.tsx`.

## Qué editar

| Archivo | Qué tiene |
|---|---|
| [`content/site.ts`](src/content/site.ts) | Nombre, fechas, ubicación, SEO, contacto, footer |
| [`content/navigation.ts`](src/content/navigation.ts) | Los `id` de las secciones y los links del nav |
| [`content/hero.ts`](src/content/hero.ts) | CTAs del hero y el timeline de tres pasos |
| [`content/about.ts`](src/content/about.ts) | Tarjetas de "el evento en números" |
| [`content/sponsors.ts`](src/content/sponsors.ts) | Tiers de sponsors |
| [`content/schedule.ts`](src/content/schedule.ts) | Cronograma |
| [`content/prizes.ts`](src/content/prizes.ts) | Premios y premio del sponsor |
| [`content/people.ts`](src/content/people.ts) | Organizadoras y crédito institucional |

Buscá `[FALTA COPY]` para lo que falta completar (hoy: el mail de sponsors).

No hay sponsors ni premios confirmados, así que esas secciones muestran "TBA" y
"Your logo here" a propósito. No inventar nombres ni logos.

## Agregar una sección

1. Sumá su id a `sectionIds` en `content/navigation.ts` (y a `nav` si va arriba).
2. Creá su archivo en `src/content/` con el heading y los datos.
3. Creá el componente en `components/sections/`, dentro de
   `<Section id={sectionIds.loQueSea}>` y con `<SectionHeading />` arriba.
4. Sumalo a la lista de [`src/app/page.tsx`](src/app/page.tsx).

## Notas

- **Errores raros al arrancar** (`ENOENT: .next/routes-manifest.json`,
  `Cannot find module for page: /_document`): `npm run clean` y de nuevo. El dev
  server escribe en `.next-dev` y el build en `.next` para que no se pisen, ver
  [`next.config.ts`](next.config.ts).
- **`Port 3000 is in use`:** Next arranca solo en el 3001. Para ver quién lo
  tiene: `ss -tlnp | grep :3000`.
- **Sitio viejo:** la versión estática original está en el historial, en el
  commit `e688668`.
