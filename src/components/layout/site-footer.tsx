import { footer } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-cream/10">
      <div className="mx-auto max-w-6xl px-6 py-12 text-cream sm:px-8">
        <p className="font-medium">Universidad de San Andrés</p>
        <p className="mt-1 text-sm text-cream/50">{footer.credit}</p>
      </div>
    </footer>
  );
}
