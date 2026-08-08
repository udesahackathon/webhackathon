import { contact, footer } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-cream/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 text-cream sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="font-medium">Universidad de San Andrés</p>
          <p className="mt-1 text-sm text-cream/50">{footer.credit}</p>
        </div>

        <div className="flex gap-4 text-sm text-cream/60">
          <a
            href={contact.instagram}
            className="hover:text-cream"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          <a
            href={`https://twitter.com/${contact.twitter.replace("@", "")}`}
            className="hover:text-cream"
            target="_blank"
            rel="noopener noreferrer"
          >
            {contact.twitter}
          </a>
        </div>
      </div>
    </footer>
  );
}
