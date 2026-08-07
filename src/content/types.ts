// Tipos del contenido del sitio.
//
// Cada archivo de `src/content` tipa lo que exporta con estos tipos. La gracia
// es que si agregás una entrada nueva y le falta un campo, revienta en
// `npm run typecheck` en vez de renderizar un hueco en la página.

export type Link = {
  label: string;
  href: string;
};

export type AboutItem = {
  title: string;
  description: string;
};

export type SponsorTier = {
  name: string;
  /** Cuántos recuadros "Your logo here" se dibujan en este tier. */
  slots: number;
};

export type ScheduleItem = {
  day: string;
  time: string;
  title: string;
};

export type Prize = {
  place: string;
  /** "TBA" mientras no esté confirmado. No inventar montos. */
  value: string;
};

export type TimelineStep = {
  step: string;
  label: string;
};

export type Organizer = {
  name: string;
  role: string;
  /** Ruta dentro de `public/organizers`. */
  photo: string;
  linkedin: string;
  instagram?: string;
  twitter?: string;
};
