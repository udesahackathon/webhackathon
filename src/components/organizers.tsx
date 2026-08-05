import Image from "next/image";
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
              <div className="mt-1 flex items-center gap-3 text-xs text-cream/45">
                <a
                  href={person.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cardo"
                >
                  LinkedIn
                </a>
                {person.instagram && (
                  <a
                    href={person.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-cardo"
                  >
                    Instagram
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
