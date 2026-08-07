import type { ReactNode } from "react";
import { InstagramIcon, LinkedinIcon, XIcon } from "@/components/shared/social-icons";

// Fila de íconos de redes de una persona. Solo dibuja los que tienen link, así
// sumar Instagram o X a alguien es agregar el campo en `src/content/people.ts`
// y nada más.

type SocialLinksProps = {
  /** Nombre de la persona, se usa para armar el aria-label de cada link. */
  name: string;
  linkedin: string;
  instagram?: string;
  twitter?: string;
};

type SocialLink = {
  href: string;
  label: string;
  icon: ReactNode;
};

export function SocialLinks({ name, linkedin, instagram, twitter }: SocialLinksProps) {
  const links: SocialLink[] = [
    { href: linkedin, label: `LinkedIn de ${name}`, icon: <LinkedinIcon /> },
  ];

  if (instagram) {
    links.push({ href: instagram, label: `Instagram de ${name}`, icon: <InstagramIcon /> });
  }
  if (twitter) {
    links.push({ href: twitter, label: `X de ${name}`, icon: <XIcon /> });
  }

  return (
    <div className="mt-1 flex items-center gap-3 text-cream/45">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          className="hover:text-cardo"
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}
