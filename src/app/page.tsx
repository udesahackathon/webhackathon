import { SiteFooter } from "@/components/layout/site-footer";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { Organizers } from "@/components/sections/organizers";
import { Prizes } from "@/components/sections/prizes";
import { Schedule } from "@/components/sections/schedule";
import { Sponsors } from "@/components/sections/sponsors";

// El orden de las secciones de la landing se define acá y nada más. Para sumar
// una nueva: archivo en `src/content`, componente en `src/components/sections`,
// y la línea correspondiente en esta lista.
export default function Home() {
  return (
    <>
      <main className="flex flex-1 flex-col">
        <Hero />
        <About />
        <Sponsors />
        <Schedule />
        <Prizes />
        <Organizers />
      </main>
      <SiteFooter />
    </>
  );
}
