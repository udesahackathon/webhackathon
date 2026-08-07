import { anchor, sectionIds } from "./navigation";
import type { Link, TimelineStep } from "./types";

// La landing apunta a sponsors por ahora: todavía no hay inscripción de
// estudiantes, así que el CTA primario es "quiero ser sponsor" y no "inscribite".
// Cuando se abra la inscripción, este es el primer lugar que hay que cambiar.
export const heroCtaPrimary: Link = {
  label: "Quiero ser sponsor",
  href: anchor(sectionIds.sponsors),
};

export const heroCtaSecondary: Link = {
  label: "Ver el programa",
  href: anchor(sectionIds.schedule),
};

/** Resumen de tres pasos que va debajo del countdown. */
export const heroTimeline: TimelineStep[] = [
  { step: "01", label: "Kickoff + challenges" },
  { step: "02", label: "24hs de build + mentorías" },
  { step: "03", label: "Pitches + premiación" },
];
