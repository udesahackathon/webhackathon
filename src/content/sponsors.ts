import type { SponsorTier } from "./types";

export const sponsorsHeading = {
  eyebrow: "Sponsors",
  title: "Buscamos marcas que quieran estar cerca de engineers",
};

// Los recuadros vacíos con "Your logo here" son para sponsors sin
// identificar, a propósito: no inventar nombres ni logos ahí.
//
// `confirmed` es un sponsor cerrado, solo falta el logo (llega después).
// `inConversation` son conversaciones reales en curso, sin firmar, y se
// marcan "a confirmar". dimensionalOS ya está confirmado, el resto no.
export const sponsorTiers: SponsorTier[] = [
  {
    name: "Powered by",
    slots: 5,
    confirmed: [{ name: "dimensionalOS", href: "https://github.com/dimensionalOS/dimos" }],
    inConversation: [{ name: "AWS", href: "https://aws.amazon.com/es/" }],
  },
  {
    name: "Supported by",
    slots: 4,
    inConversation: [
      { name: "Red Bull", href: "https://www.redbull.com/ar-es" },
      { name: "Área Beta", href: "https://www.areabeta.com.ar/" },
    ],
  },
];
