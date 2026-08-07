import { Section, SectionHeading } from "@/components/shared/section";
import { sectionIds } from "@/content/navigation";
import { schedule, scheduleHeading } from "@/content/schedule";

export function Schedule() {
  return (
    <Section id={sectionIds.schedule} width="narrow">
      <SectionHeading {...scheduleHeading} />

      <ol className="relative flex flex-col gap-8 border-l border-cream/15 pl-8">
        {schedule.map((item) => (
          <li key={`${item.day}-${item.time}`} className="relative">
            <span className="absolute top-1 -left-[calc(2rem+5px)] h-2.5 w-2.5 rounded-full bg-cardo" />
            <p className="text-xs uppercase tracking-[0.1em] text-cream/45">
              {item.day} · {item.time}
            </p>
            <p className="mt-1 text-base font-medium text-cream sm:text-lg">{item.title}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
