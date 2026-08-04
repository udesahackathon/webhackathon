import { siteConfig } from "@/lib/config";

export function Organizers() {
  return (
    <section id="organizadores" className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
      <div className="mb-12 max-w-2xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-cardo">
          Organizadoras
        </p>
        <h2 className="font-display text-3xl italic font-normal text-cream sm:text-4xl">
          Quién está detrás
        </h2>
      </div>

      <div className="flex flex-wrap gap-8">
        {siteConfig.organizers.map((person) => (
          <div key={person.name} className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full border border-cream/15 bg-cream/[0.04] text-lg font-medium text-cream"
              aria-hidden
            >
              {person.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-cream">{person.name}</p>
              <p className="text-sm text-cream/55">{person.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
