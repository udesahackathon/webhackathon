// Contenido editable del sitio. Actualizar acá en vez de tocar los componentes.
// Buscá "[FALTA COPY]" para encontrar los placeholders que faltan completar.
//
// Landing enfocada en sponsors por ahora (no hay inscripción de
// estudiantes todavía). Cuando se abra la inscripción y se definan los
// tracks, se vuelven a sumar esas secciones.

export const siteConfig = {
  event: {
    name: "AI Hackathon @ UdeSA",
    tagline: "Un fin de semana intenso: de kickoff a pitches finales en un solo sprint de 24 horas",
    dateLabel: "23-24 Octubre 2026",
    // ISO 8601 con timezone de Buenos Aires, usado por el countdown.
    startDateISO: "2026-10-23T18:00:00-03:00",
    endDateISO: "2026-10-24T21:00:00-03:00",
    location: "Universidad de San Andrés · Buenos Aires",
    audience: "Estudiantes de universidades de toda Argentina",
  },
  hero: {
    ctaPrimary: {
      label: "Quiero ser sponsor",
      href: "#sponsors",
    },
    ctaSecondary: {
      label: "Ver el programa",
      href: "#cronograma",
    },
  },
  seo: {
    title: "AI Hackathon @ UdeSA · 23-24 Oct 2026",
    description:
      "23-24 de octubre 2026 en la Universidad de San Andrés, Buenos Aires. Sumate como sponsor.",
  },
  contact: {
    // [FALTA COPY] confirmar dominio de mail definitivo
    sponsorEmail: "naomicouriel@gmail.com",
    instagram: "https://www.instagram.com/ingenieria.udesa/",
    twitter: "UdeSA",
  },
  heroTimeline: [
    { step: "01", label: "Kickoff + challenges" },
    { step: "02", label: "24hs de build + mentorías" },
    { step: "03", label: "Pitches + premiación" },
  ],
  nav: [
    { label: "Sobre el evento", href: "#about" },
    { label: "Cronograma", href: "#cronograma" },
    { label: "Sponsors", href: "#sponsors" },
  ],
  about: [
    {
      title: "24 horas",
      description: "Un fin de semana intenso: de kickoff a pitches finales en un solo sprint de 24 horas.",
    },
    {
      title: "~15 equipos",
      description: "Equipos de hasta 4 personas, con estudiantes de distintas universidades y carreras.",
    },
    {
      title: "Prize pool + créditos",
      description: "Premios y créditos de las mejores empresas de IA del mundo para los equipos ganadores.",
    },
  ],
  // No hay sponsors confirmados todavía, se muestran placeholders, no inventar logos.
  sponsorTiers: [
    { name: "Powered by", slots: 5 },
    { name: "Supported by", slots: 4 },
  ],
  schedule: [
    { day: "Viernes 23/10", time: "18:00", title: "Kickoff + presentación de challenges" },
    { day: "Viernes 23/10", time: "20:00", title: "Cena + arranca la hackathon" },
    { day: "Sábado 24/10", time: "10:00", title: "Check-in con mentores" },
    { day: "Sábado 24/10", time: "14:00", title: "Almuerzo" },
    { day: "Sábado 24/10", time: "18:00", title: "Cierre de código" },
    { day: "Sábado 24/10", time: "19:00", title: "Pitches finales" },
    { day: "Sábado 24/10", time: "21:00", title: "Premiación" },
  ],
  prizes: [
    { place: "1er puesto", value: "TBA" },
    { place: "2do puesto", value: "TBA" },
    { place: "3er puesto", value: "TBA" },
  ],
  sponsorPrize: { place: "Best Use of Sponsor", value: "TBA" },
  organizers: [
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
      instagram: undefined as string | undefined,
      twitter: undefined as string | undefined,
    },
    {
      name: "Athina Salim",
      role: "Organizer",
      photo: "/organizers/athina.jpeg",
      linkedin: "https://www.linkedin.com/in/athina-salim-a60b61353/",
      instagram: undefined as string | undefined,
      twitter: undefined as string | undefined,
    },
  ],
  institutionalCredit: {
    text: "Organizado junto al Departamento de Ingeniería de UdeSA",
    logo: "/organizers/udesa.png",
  },
  footer: {
    credit: "Organizado por estudiantes de Ingeniería en Inteligencia Artificial en UdeSA · 2026",
  },
} as const;
