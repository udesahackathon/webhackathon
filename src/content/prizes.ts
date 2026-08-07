import type { Prize } from "./types";

export const prizesHeading = {
  eyebrow: "Prizes",
  title: "Premios",
};

// Los montos van "TBA" hasta que haya prize pool confirmado. No poner números
// tentativos acá: la página es pública y se comparte con sponsors.
export const prizes: Prize[] = [
  { place: "1er puesto", value: "TBA" },
  { place: "2do puesto", value: "TBA" },
  { place: "3er puesto", value: "TBA" },
];

/** Premio destacado aparte, para el sponsor que ponga su propio challenge. */
export const sponsorPrize: Prize = { place: "Best Use of Sponsor", value: "TBA" };
