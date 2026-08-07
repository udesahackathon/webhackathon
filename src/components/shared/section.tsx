import type { ReactNode } from "react";
import type { SectionId } from "@/content/navigation";
import { cn } from "@/lib/utils";

// Shell común de todas las secciones de la landing: mismo ancho, mismo padding
// y el mismo par "eyebrow + título". Si hay que cambiar el ritmo vertical del
// sitio se toca acá y no en seis archivos.

const widths = {
  wide: "max-w-6xl",
  narrow: "max-w-3xl",
} as const;

export function Section({
  id,
  width = "wide",
  className,
  children,
}: {
  /** Siempre de `sectionIds`, así el anchor del nav no puede quedar colgado. */
  id: SectionId;
  width?: keyof typeof widths;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("mx-auto px-6 py-20 sm:px-8 sm:py-28", widths[width], className)}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  className,
}: {
  eyebrow: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-12 max-w-2xl", className)}>
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-cardo">
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl italic font-normal text-cream sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}
