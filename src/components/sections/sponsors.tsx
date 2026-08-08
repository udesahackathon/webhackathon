import { Section, SectionHeading } from "@/components/shared/section";
import { sectionIds } from "@/content/navigation";
import { contact } from "@/content/site";
import { sponsorTiers, sponsorsHeading } from "@/content/sponsors";

const mailtoHref = `mailto:${contact.sponsorEmail}?subject=${encodeURIComponent(
  "Quiero ser sponsor del AI Hackathon @ UdeSA"
)}`;

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
