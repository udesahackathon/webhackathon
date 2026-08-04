import { About } from "@/components/about";
import { Hero } from "@/components/hero";
import { Organizers } from "@/components/organizers";
import { Prizes } from "@/components/prizes";
import { Schedule } from "@/components/schedule";
import { SiteFooter } from "@/components/site-footer";
import { Sponsors } from "@/components/sponsors";

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
