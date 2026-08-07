<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes. APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Convenciones del repo

Landing page del AI Hackathon @ UdeSA. El sitio está en español, los commits y
los comentarios del código también.

## Dónde va cada cosa

- **Contenido en `src/content`, presentación en `src/components`.** Ningún texto,
  fecha, link ni dato del evento se escribe adentro de un `.tsx`. Si estás por
  hardcodear un string visible en un componente, va a `src/content`.
- `src/components/sections/` es una sección de la landing por archivo.
- `src/components/layout/` es lo que se repite fuera de las secciones (header, footer).
- `src/components/shared/` son piezas propias reusables (`Section`, `Countdown`, íconos).
- `src/components/ui/` lo genera shadcn. No editar a mano.
- Los `id` de las secciones y los `href` del nav salen los dos de `sectionIds` en
  `src/content/navigation.ts`. Nunca escribir un `#anchor` a mano.
- Las secciones se envuelven en `<Section>` y arrancan con `<SectionHeading>`, en
  vez de repetir las clases de ancho y padding.

## Reglas de contenido

- **No inventar datos.** No hay sponsors, premios ni jurado confirmados. Donde
  falta info va "TBA" o un placeholder visible, nunca un nombre o un monto
  plausible. La página es pública y se comparte con sponsors.
- Lo que falta definir se marca con `[FALTA COPY]` en un comentario.
- Nada de em dashes, ni en el sitio ni en los commits.

## Flujo de git

- **Nunca commitear ni pushear directo a `main`.** Todo cambio va en una branch
  y se mergea con un pull request en GitHub, aunque sea trivial. `main` solo se
  mueve por merges de PR, nunca por push directo ni fast-forward local.

## Antes de pushear

```bash
npm run typecheck && npm run lint && npm run build
```

El deploy es automático: push a `main` va a producción, cualquier otra branch
levanta un preview en Vercel.
