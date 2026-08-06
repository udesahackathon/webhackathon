import { Section, SectionHeading } from "@/components/shared/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { about, aboutHeading } from "@/content/about";
import { sectionIds } from "@/content/navigation";

export function About() {
  return (
    <Section id={sectionIds.about}>
      <SectionHeading {...aboutHeading} />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {about.map((item) => (
          <Card key={item.title} className="backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-cream">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-cream/65">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
