# AI Hackathon @ UdeSA

Landing page del primer AI Hackathon de la Universidad de San Andrés.

Por ahora es una landing simple orientada a **sponsors** (todavía no hay
inscripción de estudiantes ni tracks definidos, se suman más adelante).

## Docs internas

Las notas de organización (hardware de robótica que nos ofrecieron, créditos de
AWS a pedir) están en [`/docs`](docs). No se publican en el sitio.

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
muestran placeholders ("TBA", "Your logo here") a propósito, no inventé
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

## Si algo se rompe

```bash
npm run clean   # borra .next y .next-dev
npm run dev
```

Casi todos los errores raros de arranque son un directorio de salida a medias.
Los dos síntomas conocidos son:

- `ENOENT: no such file or directory, open '.next/routes-manifest.json'`
- `Cannot find module for page: /_document` (en `next build`)

Los dos venían de correr `next dev` y `next build` sobre el mismo directorio
`.next`. Desde [`next.config.ts`](next.config.ts) el dev server escribe en
`.next-dev` y el build en `.next`, así que ya no pueden pisarse. `npm run clean`
queda igual para cualquier otro estado sucio.

Aparte, si ves `Port 3000 is in use`, Next arranca solo en el 3001 y funciona
igual. Para saber quién está ocupando el puerto: `ss -tlnp | grep :3000`.

## Sitio anterior

La versión estática original (HTML/CSS/JS plano) quedó archivada en
[`/legacy`](legacy) para referencia, no se usa en el deploy actual.
