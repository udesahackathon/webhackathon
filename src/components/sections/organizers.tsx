import Image from "next/image";
import { Section, SectionHeading } from "@/components/shared/section";
import { SocialLinks } from "@/components/shared/social-links";
import { sectionIds } from "@/content/navigation";
import {
  institutionalCredits,
  institutionalCreditsHeading,
  organizers,
  organizersHeading,
} from "@/content/people";

export function Organizers() {
  return (
    <Section id={sectionIds.organizers}>
      <SectionHeading {...organizersHeading} />

      <div className="flex flex-wrap gap-8">
        {organizers.map((person) => (
          <div key={person.name} className="flex items-center gap-4">
            <Image
              src={person.photo}
              alt={person.name}
              width={64}
              height={64}
              className="h-16 w-16 shrink-0 rounded-full border border-cream/15 object-cover"
            />
            <div>
              <p className="font-medium text-cream">{person.name}</p>
              <p className="text-sm text-cream/55">{person.role}</p>
              <SocialLinks
                name={person.name}
                linkedin={person.linkedin}
                instagram={person.instagram}
                twitter={person.twitter}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 border-t border-cream/10 pt-8">
        <p className="mb-4 text-xs uppercase tracking-[0.14em] text-cream/50">
          {institutionalCreditsHeading}
        </p>
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          {institutionalCredits.map((credit) => {
            const inner = (
              <>
                <Image
                  src={credit.logo}
                  alt={credit.alt}
                  width={40}
                  height={40}
                  className="h-10 w-10 shrink-0"
                />
                <p className="text-sm text-cream/70">{credit.name}</p>
              </>
            );

            return credit.href ? (
              <a
                key={credit.name}
                href={credit.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 transition-opacity hover:opacity-75"
              >
                {inner}
              </a>
            ) : (
              <div key={credit.name} className="flex items-center gap-3">
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
