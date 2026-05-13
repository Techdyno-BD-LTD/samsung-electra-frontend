export type LegalPageRecord = {
  title: string;
  description: string;
  html: string;
  lastUpdated?: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
};

const backendUrl = process.env.API_BASE_URL || 'http://localhost:5000';
const systemKey = process.env.API_SYSTEM_KEY || '';

export async function fetchLegalPage(slug: string): Promise<LegalPageRecord | null> {
  try {
    const response = await fetch(`${backendUrl}/api/v2/pages/${slug}`, {
      cache: 'no-store',
      headers: {
        'x-system-key': systemKey,
      },
    });

    if (!response.ok) return null;
    const { data } = await response.json();
    if (!data || !data.length) return null;

    const page = data[0];
    return {
      title: page.title,
      description: page.description || '',
      html: page.content || '',
      lastUpdated: page.updated_at,
      meta_title: page.meta_title,
      meta_description: page.meta_description,
      keywords: page.keywords,
    };
  } catch (error) {
    console.error(`Error fetching legal page ${slug}:`, error);
    return null;
  }
}

export async function fetchLegalPageSlugs(): Promise<string[]> {
  try {
    const response = await fetch(`${backendUrl}/api/v2/pages`, {
      cache: 'no-store',
      headers: {
        'x-system-key': systemKey,
      },
    });

    if (!response.ok) return [];
    const json = await response.json();
    const data = json.data;
    if (!Array.isArray(data)) return [];
    return data.map((p: { slug: string }) => p.slug);
  } catch (error) {
    console.error('Error fetching legal page slugs:', error);
    return [];
  }
}