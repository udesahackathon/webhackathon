import { heroCtaPrimary } from "@/content/hero";
import { anchor, nav, sectionIds } from "@/content/navigation";
import { event } from "@/content/site";

// Nav del sitio. Vive visualmente adentro de la tarjeta del hero, pero se
// mantiene aparte para poder tocar los links sin meterse con las animaciones.
export function SiteHeader() {
  return (
    <nav className="flex items-center justify-between gap-4">
      <a
        href={anchor(sectionIds.top)}
        className="flex items-center gap-2 text-sm font-medium tracking-tight text-cream"
      >
        <span className="h-2.5 w-2.5 rounded-full bg-cardo" aria-hidden />
        {event.name}
      </a>
      <div className="flex items-center gap-6">
        <div className="hidden items-center gap-6 text-sm text-cream/70 sm:flex">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-cream">
              {item.label}
            </a>
          ))}
        </div>
        <a
          href={heroCtaPrimary.href}
          className="inline-flex h-9 items-center rounded-full bg-cardo px-4 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
        >
          {heroCtaPrimary.label}
        </a>
      </div>
    </nav>
  );
}
