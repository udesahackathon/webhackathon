import type { Organizer } from "./types";

export const organizersHeading = {
  eyebrow: "Organizadoras",
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

// Crédito institucional, aparte de las personas. El logo ya viene recortado en
// círculo con transparencia, así que se muestra tal cual, sin CSS que lo enmascare.
export const institutionalCredit = {
  text: "Organizado junto al Departamento de Ingeniería de UdeSA",
  logo: "/organizers/udesa.png",
  alt: "Universidad de San Andrés",
};
