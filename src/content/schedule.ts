import type { ScheduleItem } from "./types";

export const scheduleHeading = {
  eyebrow: "Cronograma",
  title: "Cómo van a ser los tres días",
};

// [FALTA COPY] horarios y el formato del cierre (¿pitches? ¿demo en vivo con
// los robots? no está decidido) en danza. Solo se ponen los bloques por día,
// nada de horas puntuales inventadas.
export const schedule: ScheduleItem[] = [
  {
    day: "Semana previa",
    time: "TBA",
    title: "Jornada de instalación y explicación del sistema, con dimensionalOS",
  },
  { day: "Viernes 23/10", time: "TBA", title: "Llegada + kickoff" },
  { day: "Sábado 24/10", time: "TBA", title: "Día de build, con mentorías y turnos de robot" },
  { day: "Domingo 25/10", time: "TBA", title: "Cierre + premiación" },
];
