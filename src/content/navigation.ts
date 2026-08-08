import type { Link } from "./types";

// Fuente única de los anchors del sitio.
//
// El `id` de cada <section> y el `href` de cada link del nav salen de acá, así
// no se pueden desincronizar. Si agregás una sección: sumás la clave acá, la
// usás en el <Section id={...}> y recién ahí decidís si va también al nav.
export const sectionIds = {
  top: "top",
  about: "sobre-el-evento",
  sponsors: "sponsors",
  schedule: "cronograma",
  prizes: "premios",
  organizers: "organizadoras",
} as const;

export type SectionId = (typeof sectionIds)[keyof typeof sectionIds];

export function anchor(id: SectionId): string {
  return `#${id}`;
}

/** Links que se muestran en el nav del hero. No hace falta que estén todas las secciones. */
export const nav: Link[] = [
  { label: "Sobre el evento", href: anchor(sectionIds.about) },
  { label: "Cronograma", href: anchor(sectionIds.schedule) },
  { label: "Sponsors", href: anchor(sectionIds.sponsors) },
];
