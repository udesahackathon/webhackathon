"use client";

import { useEffect, useState } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(targetISO: string): TimeLeft {
  const diff = Math.max(0, new Date(targetISO).getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const UNITS: { key: keyof TimeLeft; label: string }[] = [
  { key: "days", label: "días" },
  { key: "hours", label: "hs" },
  { key: "minutes", label: "min" },
  { key: "seconds", label: "seg" },
];

export function Countdown({ targetISO }: { targetISO: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft(targetISO));
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetISO));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetISO]);

  return (
    <div
      className="grid grid-cols-4 gap-2"
      role="timer"
      aria-live="off"
      aria-label="Cuenta regresiva para el hackathon"
    >
      {UNITS.map(({ key, label }) => (
        <div
          key={key}
          className="rounded-xl border border-cream/10 bg-cream/[0.04] px-1 py-3 text-center"
        >
          <span className="block font-display text-xl font-medium tabular-nums text-cream sm:text-2xl">
            {timeLeft ? String(timeLeft[key]).padStart(2, "0") : "--"}
          </span>
          <span className="mt-1 block text-[0.6rem] uppercase tracking-[0.12em] text-cream/50">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
