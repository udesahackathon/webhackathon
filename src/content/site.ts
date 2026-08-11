// Datos globales del evento: los que aparecen en varias secciones a la vez o
// en los metadatos (title, OG image, favicon).
//
// Buscá "[FALTA COPY]" en todo `src/content` para encontrar lo que todavía
// falta completar.

export const event = {
  name: "Robotics Hackathon x UdeSA",
  tagline: "Tres días, robots reales, varios desafíos",
  dateLabel: "23-25 Octubre 2026",
  // ISO 8601 con timezone de Buenos Aires, usado por el countdown.
  // Viernes a domingo: 23 es viernes en 2026.
  startDateISO: "2026-10-23T18:00:00-03:00",
  endDateISO: "2026-10-25T20:00:00-03:00",
  // [FALTA COPY] Área Beta Nordelta es la sede en danza pero todavía no está
  // firmada (depende de D6). Buenos Aires es cierto pase lo que pase, así que
  // eso sí se puede decir ya. No poner el nombre del lugar hasta confirmar.
  location: "Buenos Aires · sede a definir",
  audience: "Estudiantes de universidades de toda Argentina",
  presentedBy: "Con robots de dimensionalOS",
};

export const seo = {
  title: "Robotics Hackathon x UdeSA · 23-25 Oct 2026",
  description:
    "23-25 de octubre 2026. Hackathon de robótica con dimensionalOS. Sumate como sponsor.",
};

export const contact = {
  // [FALTA COPY] confirmar dominio de mail definitivo
  sponsorEmail: "naomicouriel@gmail.com",
  instagram: "https://www.instagram.com/ingenieria.udesa/",
};

export const footer = {
  credit:
    "Organizado por estudiantes de Ingeniería en Inteligencia Artificial en UdeSA · 2026",
};
