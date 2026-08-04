import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/lib/config";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28">
      <div className="mb-12 max-w-2xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-cardo">
          Sobre el evento
        </p>
        <h2 className="font-display text-3xl italic font-normal text-cream sm:text-4xl">
          El evento en números
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {siteConfig.about.map((item) => (
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
    </section>
  );
}
