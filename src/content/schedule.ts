import type { ScheduleItem } from "./types";

export const scheduleHeading = {
  eyebrow: "Cronograma",
  title: "Cómo va a ser el fin de semana",
};

export const schedule: ScheduleItem[] = [
  { day: "Viernes 23/10", time: "18:00", title: "Kickoff + presentación de challenges" },
  { day: "Viernes 23/10", time: "20:00", title: "Cena + arranca la hackathon" },
  { day: "Sábado 24/10", time: "10:00", title: "Check-in con mentores" },
  { day: "Sábado 24/10", time: "14:00", title: "Almuerzo" },
  { day: "Sábado 24/10", time: "18:00", title: "Cierre de código" },
  { day: "Sábado 24/10", time: "19:00", title: "Pitches finales" },
  { day: "Sábado 24/10", time: "21:00", title: "Premiación" },
];
