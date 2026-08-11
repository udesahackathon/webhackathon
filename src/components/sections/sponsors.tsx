import { Section, SectionHeading } from "@/components/shared/section";
import { sectionIds } from "@/content/navigation";
import { contact, event } from "@/content/site";
import { sponsorTiers, sponsorsHeading } from "@/content/sponsors";
import type { NamedSponsor } from "@/content/types";

const mailtoHref = `mailto:${contact.sponsorEmail}?subject=${encodeURIComponent(
  `Quiero ser sponsor de ${event.name}`
)}`;

// Tratamiento tipográfico por marca mientras están "en conversación", sin
// logo real todavía. No son las tipografías propietarias reales de cada marca
// (Amazon Ember de AWS, la de Red Bull, etc. no son embebibles), son una
// aproximación con lo que ya carga el sitio (Fraunces + Inter) para que cada
// nombre tenga carácter propio en vez de verse todos iguales. Cuando alguna
// se firme, esto se reemplaza por el logo real, que es lo correcto de verdad.
const sponsorTreatment: Record<string, string> = {
  dimensionalOS: "font-display italic font-normal text-4xl sm:text-5xl text-cardo",
  AWS: "font-sans font-extrabold uppercase tracking-tight text-2xl text-cream",
  "Red Bull": "font-sans font-black uppercase tracking-wide text-2xl text-cream",
  "Área Beta": "font-sans font-medium text-xl text-cream/85",
};
const defaultTreatment = "font-sans font-semibold text-xl text-cream";

function SponsorMark({ sponsor, confirmed }: { sponsor: NamedSponsor; confirmed: boolean }) {
  const mark = (
    <span className={sponsorTreatment[sponsor.name] ?? defaultTreatment}>{sponsor.name}</span>
  );

  return (
    <div className="flex items-baseline gap-2.5">
      {sponsor.href ? (
        <a
          href={sponsor.href}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-opacity hover:opacity-75"
        >
          {mark}
        </a>
      ) : (
        mark
      )}
      {!confirmed && (
        <span className="text-xs uppercase tracking-[0.08em] text-cream/40">a confirmar</span>
      )}
    </div>
  );
}

export function Sponsors() {
  return (
    <Section id={sectionIds.sponsors}>
      <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading {...sponsorsHeading} className="mb-0" />
        <a
          href={mailtoHref}
          className="inline-flex h-11 shrink-0 items-center rounded-full bg-cardo px-6 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
        >
          Become a sponsor →
        </a>
      </div>

      <div className="flex flex-col gap-10">
        {sponsorTiers.map((tier) => (
          <div key={tier.name}>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-cream/50">
              {tier.name}
            </p>

            {((tier.confirmed?.length ?? 0) > 0 || (tier.inConversation?.length ?? 0) > 0) && (
              <div className="mb-8 flex flex-wrap items-baseline gap-x-10 gap-y-5">
                {tier.confirmed?.map((sponsor) => (
                  <SponsorMark key={sponsor.name} sponsor={sponsor} confirmed />
                ))}
                {tier.inConversation?.map((sponsor) => (
                  <SponsorMark key={sponsor.name} sponsor={sponsor} confirmed={false} />
                ))}
              </div>
            )}

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
    </Section>
  );
}
