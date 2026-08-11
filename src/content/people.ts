import { contact } from "./site";
import type { InstitutionalCredit, Organizer } from "./types";

export const organizersHeading = {
  eyebrow: "Organizadores",
  title: "Quién está detrás",
};

// `instagram` y `twitter` son opcionales: si no están, no se dibuja el ícono.
export const organizers: Organizer[] = [
  {
    name: "Naomi Couriel",
    role: "Lead Organizer",
    photo: "/organizers/naomi.jpeg",
    linkedin: "https://www.linkedin.com/in/naomi-couriel/",
    instagram: "https://www.instagram.com/naointech/",
    twitter: "https://x.com/ncouriel",
  },
  {
    name: "Ana Paula Tissera",
    role: "Co-Organizer",
    photo: "/organizers/ana-paula.jpeg",
    linkedin: "https://www.linkedin.com/in/ana-paula-tissera/",
  },
  {
    name: "Athina Salim",
    role: "Organizer",
    photo: "/organizers/athina.jpeg",
    linkedin: "https://www.linkedin.com/in/athina-salim-a60b61353/",
  },
];

// Créditos institucionales, aparte de las personas. Los logos ya vienen con
// fondo transparente, así que se muestran tal cual, sin CSS que los enmascare.
// El "Organizado junto a" va una sola vez arriba de la lista, no repetido por
// crédito.
//
// AIR Club UdeSA (el club de robótica) ayuda a organizar más activamente que
// el Departamento de Ingeniería, por eso va primero.
export const institutionalCreditsHeading = "Organizado junto a";

export const institutionalCredits: InstitutionalCredit[] = [
  {
    name: "AIR Club UdeSA (AI & Robotics)",
    logo: "/organizers/air-club.png",
    alt: "AIR Club UdeSA",
    href: "https://linktr.ee/AirclubUdeSA",
  },
  {
    name: "Departamento de Ingeniería de UdeSA",
    logo: "/organizers/udesa.png",
    alt: "Universidad de San Andrés",
    // No tienen web propia todavía, así que linkea al Instagram del depto.
    href: contact.instagram,
  },
];
