import legalPages from "@/database/legal-pages.json";

export type LegalPageSlug = keyof typeof legalPages;

export type LegalPageRecord = {
  title: string;
  description: string;
  html: string;
  lastUpdated?: string;
};

const pages = legalPages as Record<LegalPageSlug, LegalPageRecord>;

export function getLegalPage(slug: string) {
  return pages[slug as LegalPageSlug] ?? null;
}

export function getLegalPageSlugs() {
  return Object.keys(pages) as LegalPageSlug[];
}