const siteContent = {
  copy: {
    eventName: "HackUDESA 2026",
    eventDate: "Fecha a confirmar",
    eventLocation: "Campus / sede a confirmar",
    eventFormat: "Presencial · 24 a 48 horas",
    participantCount: "100+",
    teamCount: "25",
    mentorCount: "10+",
    heroText:
      "Una hackathon universitaria para estudiantes que quieren construir en serio, conectar con comunidad tech y convertir ideas en prototipos reales.",
    aboutText:
      "HackUDESA junta a personas de distintas carreras para experimentar, colaborar y construir prototipos con mentoría, desafíos y apoyo de partners de la industria. No hace falta llegar con equipo armado ni con una idea cerrada.",
    footerText:
      "Una iniciativa estudiantil para construir, aprender y conectar.",
  },
  links: {
    register:
      "https://docs.google.com/forms/d/e/1FAIpQLSfSDCeTjiHXNEBx_c_W7hO_ZUqF_Phsp4_WgNf_-kkCr0WVJw/viewform?usp=publish-editor",
    sponsorDeck:
      "mailto:naomicouriel@gmail.com?subject=Quiero%20ser%20sponsor%20del%20HackUDESA",
    contactEmail: "mailto:naomicouriel@gmail.com",
  },
};

document.querySelectorAll("[data-copy]").forEach((node) => {
  const key = node.dataset.copy;
  if (siteContent.copy[key]) {
    node.textContent = siteContent.copy[key];
  }
});

document.querySelectorAll("[data-link]").forEach((node) => {
  const key = node.dataset.link;
  if (siteContent.links[key]) {
    node.href = siteContent.links[key];
  }
});
