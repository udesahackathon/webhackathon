import type { SponsorTier } from "./types";

export const sponsorsHeading = {
  eyebrow: "Sponsors",
  title: "Buscamos marcas que quieran estar cerca de engineers",
};

// No hay sponsors confirmados todavía. Se dibujan `slots` recuadros vacíos con
// "Your logo here", a propósito: no inventar nombres ni logos.
//
// Cuando haya sponsors reales, este es el lugar donde cambia el modelo de
// datos: cada tier pasa a tener una lista de sponsors (nombre + logo + url) en
// vez de un número de slots.
export const sponsorTiers: SponsorTier[] = [
  { name: "Powered by", slots: 5 },
  { name: "Supported by", slots: 4 },
];
