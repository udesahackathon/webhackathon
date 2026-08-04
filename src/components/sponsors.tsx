import { siteConfig } from "@/lib/config";

export function Sponsors() {
  return (
    <section id="sponsors" className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
      <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-cardo">
            Sponsors
          </p>
          <h2 className="font-display text-3xl italic font-normal text-cream sm:text-4xl">
            Buscamos marcas que quieran estar cerca de engineers
          </h2>
        </div>
        <a
          href={`mailto:${siteConfig.contact.sponsorEmail}?subject=Quiero%20ser%20sponsor%20del%20AI%20Hackathon%20%40%20UdeSA`}
          className="inline-flex h-11 shrink-0 items-center rounded-full bg-cardo px-6 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
        >
          Become a sponsor →
        </a>
      </div>

      <div className="flex flex-col gap-10">
        {siteConfig.sponsorTiers.map((tier) => (
          <div key={tier.name}>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-cream/50">
              {tier.name}
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {Array.from({ length: tier.slots }).map((_, i) => (
                <div
                  key={i}
                  className="flex h-20 items-center justify-center rounded-xl border border-dashed border-cream/15 text-xs text-cream/40"
                >
                  Your logo here
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
