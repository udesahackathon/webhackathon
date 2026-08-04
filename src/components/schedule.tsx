import { siteConfig } from "@/lib/config";

export function Schedule() {
  return (
    <section id="cronograma" className="mx-auto max-w-3xl px-6 py-20 sm:px-8 sm:py-28">
      <div className="mb-12 max-w-2xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-cardo">
          Cronograma
        </p>
        <h2 className="font-display text-3xl italic font-normal text-cream sm:text-4xl">
          Cómo va a ser el fin de semana
        </h2>
      </div>

      <ol className="relative flex flex-col gap-8 border-l border-cream/15 pl-8">
        {siteConfig.schedule.map((item, i) => (
          <li key={i} className="relative">
            <span className="absolute top-1 -left-[calc(2rem+5px)] h-2.5 w-2.5 rounded-full bg-cardo" />
            <p className="text-xs uppercase tracking-[0.1em] text-cream/45">
              {item.day} · {item.time}
            </p>
            <p className="mt-1 text-base font-medium text-cream sm:text-lg">{item.title}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
