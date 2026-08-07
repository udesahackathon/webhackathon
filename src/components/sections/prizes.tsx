import { Section, SectionHeading } from "@/components/shared/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sectionIds } from "@/content/navigation";
import { prizes, prizesHeading, sponsorPrize } from "@/content/prizes";

export function Prizes() {
  return (
    <Section id={sectionIds.prizes}>
      <SectionHeading {...prizesHeading} />

      <div className="grid gap-6 sm:grid-cols-3">
        {prizes.map((prize) => (
          <Card key={prize.place} className="backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base text-cream">{prize.place}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-2xl italic font-normal text-cardo">
                {prize.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6 border-cardo/25 backdrop-blur-sm">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 py-2">
          <CardTitle className="text-base text-cream">{sponsorPrize.place}</CardTitle>
          <p className="font-display text-2xl italic font-normal text-cardo">
            {sponsorPrize.value}
          </p>
        </CardContent>
      </Card>
    </Section>
  );
}
