"use client";

import { motion } from "framer-motion";
import { SiteHeader } from "@/components/layout/site-header";
import { Countdown } from "@/components/shared/countdown";
import { heroCtaPrimary, heroCtaSecondary, heroTimeline } from "@/content/hero";
import { sectionIds } from "@/content/navigation";
import { event } from "@/content/site";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function Hero() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-8">
      <section
        id={sectionIds.top}
        className="relative overflow-hidden rounded-[32px] border border-cream/10 bg-gradient-to-br from-[#16294a] to-[#0a1730] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.7)]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(247,245,239,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(247,245,239,0.05)_1px,transparent_1px)] [background-size:36px_36px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black_40%,transparent_100%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-cardo/20 blur-[100px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#7dc4ff]/10 blur-[100px]"
        />

        <div className="relative z-10 px-6 pt-6 pb-10 sm:px-10 sm:pt-8 sm:pb-16">
          <SiteHeader />

          <div className="mt-16 grid gap-12 sm:mt-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div className="flex flex-col items-start">
              <motion.p
                initial="hidden"
                animate="visible"
                custom={0}
                variants={fadeUp}
                className="mb-6 inline-flex items-center rounded-full border border-cream/15 bg-cream/5 px-3 py-1 text-xs uppercase tracking-[0.14em] text-cream/70"
              >
                {event.dateLabel}
              </motion.p>

              <motion.h1
                initial="hidden"
                animate="visible"
                custom={0.08}
                variants={fadeUp}
                className="max-w-xl text-5xl leading-[0.98] tracking-tight text-cream sm:text-6xl"
              >
                AI Hackathon{" "}
                <span className="font-display italic font-normal">@ UdeSA</span>
              </motion.h1>

              <motion.p
                initial="hidden"
                animate="visible"
                custom={0.16}
                variants={fadeUp}
                className="mt-6 max-w-md text-lg text-cream/70"
              >
                {event.tagline}
              </motion.p>

              <motion.ul
                initial="hidden"
                animate="visible"
                custom={0.24}
                variants={fadeUp}
                className="mt-8 flex flex-col gap-2 text-sm text-cream/60"
              >
                <li className="font-medium text-cream">{event.dateLabel}</li>
                <li>{event.location}</li>
                <li>{event.audience}</li>
              </motion.ul>

              <motion.div
                initial="hidden"
                animate="visible"
                custom={0.32}
                variants={fadeUp}
                className="mt-10 flex flex-wrap items-center gap-4"
              >
                <a
                  href={heroCtaPrimary.href}
                  className="inline-flex h-12 items-center rounded-full bg-cardo px-7 text-base font-semibold text-ink shadow-[0_16px_40px_-12px_rgba(111,166,60,0.55)] transition-transform hover:-translate-y-0.5"
                >
                  {heroCtaPrimary.label}
                </a>
                <a
                  href={heroCtaSecondary.href}
                  className="inline-flex h-12 items-center rounded-full border border-cream/25 px-7 text-base font-medium text-cream transition-colors hover:bg-cream/10"
                >
                  {heroCtaSecondary.label}
                </a>
              </motion.div>
            </div>

            <motion.aside
              initial="hidden"
              animate="visible"
              custom={0.4}
              variants={fadeUp}
              className="rounded-3xl border border-cream/10 bg-cream/[0.04] p-6 backdrop-blur-sm sm:p-7"
            >
              <p className="mb-1 text-xs uppercase tracking-[0.14em] text-cream/50">
                Cuenta regresiva
              </p>
              <h2 className="mb-5 font-display text-2xl italic font-normal text-cream">
                {event.name}
              </h2>

              <Countdown targetISO={event.startDateISO} />

              <div className="mt-7 flex flex-col gap-4 border-t border-cream/10 pt-6">
                {heroTimeline.map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cardo/15 text-xs font-semibold text-cardo">
                      {item.step}
                    </span>
                    <p className="text-sm text-cream/75">{item.label}</p>
                  </div>
                ))}
              </div>
            </motion.aside>
          </div>
        </div>
      </section>
    </div>
  );
}
