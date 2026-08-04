import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/lib/config";

export function Prizes() {
  return (
    <section id="prizes" className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
      <div className="mb-12 max-w-2xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-cardo">
          Prizes
        </p>
        <h2 className="font-display text-3xl italic font-normal text-cream sm:text-4xl">
          Premios
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {siteConfig.prizes.map((prize) => (
          <Card key={prize.place} className="backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base text-cream">{prize.place}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-2xl italic font-normal text-cardo">{prize.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6 border-cardo/25 backdrop-blur-sm">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 py-2">
          <CardTitle className="text-base text-cream">{siteConfig.sponsorPrize.place}</CardTitle>
          <p className="font-display text-2xl italic font-normal text-cardo">
            {siteConfig.sponsorPrize.value}
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
