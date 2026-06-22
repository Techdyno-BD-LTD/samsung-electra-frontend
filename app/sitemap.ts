// Dynamic sitemap metadata route for Next.js app router.
// Next serves this file at /sitemap.xml.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? 'https://electrabd.com';
const API_BASE = process.env.API_BASE_URL ?? process.env.API_BASE ?? process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:5000';
const SYSTEM_KEY = process.env.API_SYSTEM_KEY ?? '';

function hasSlug(entry: unknown): entry is { slug: string } {
  return (
    typeof entry === 'object' &&
    entry !== null &&
    'slug' in entry &&
    typeof (entry as { slug: unknown }).slug === 'string' &&
    (entry as { slug: string }).slug.trim() !== ''
  );
}

export default async function sitemap() {
  const siteUrl = SITE_URL.replace(/\/$/, '');
  const lastModified = new Date();

  // Static routes in Samsung Electra project
  const staticRoutes = [
    '/',
    '/about',
    '/b2b',
    '/blogs-and-news',
    '/careers',
    '/cart',
    '/categories',
    '/checkout',
    '/compare',
    '/contact',
    '/emi-bank-list',
    '/exchange-products',
    '/faq',
    '/gift-voucher',
    '/help-ticket',
    '/higher-sale',
    '/higher-sale-products',
    '/login',
    '/mobile-categories',
    '/offers',
    '/products',
    '/search',
    '/service-charge',
    '/service-hours',
    '/service-payment',
    '/shop',
    '/stores',
    '/track-order',
    '/wishlist',
  ];

  const entries = staticRoutes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
  }));

  const fetchHeaders: Record<string, string> = {};
  if (SYSTEM_KEY) {
    fetchHeaders['x-system-key'] = SYSTEM_KEY;
  }

  const fetchFromApi = async (endpoint: string): Promise<any[] | null> => {
    const url = `${API_BASE.replace(/\/$/, '')}${endpoint}`;
    try {
      const res = await fetch(url, {
        headers: fetchHeaders,
        next: { revalidate: 3600 },
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.success && Array.isArray(json.data) ? json.data : null;
    } catch (err) {
      console.error(`Sitemap generation error fetching ${endpoint}:`, err);
      return null;
    }
  };

  // Fetch all products, categories, brands, pages, blogs, and campaigns
  const [
    products,
    categories,
    brands,
    pages,
    blogs,
    flashDeals,
    campingOffers,
  ] = await Promise.all([
    fetchFromApi('/api/v2/products?limit=1000'),
    fetchFromApi('/api/v2/categories?limit=1000'),
    fetchFromApi('/api/v2/all-brands'),
    fetchFromApi('/api/v2/pages'),
    fetchFromApi('/api/v2/blog-list'),
    fetchFromApi('/api/v2/flash-deals'),
    fetchFromApi('/api/v2/camping-offers'),
  ]);

  const dynamicEntries: Array<{ url: string; lastModified: Date }> = [];

  // 1. Products
  if (products) {
    products.filter(hasSlug).forEach((product) => {
      dynamicEntries.push({
        url: `${siteUrl}/products/${product.slug}`,
        lastModified,
      });
    });
  }

  // 2. Categories
  if (categories) {
    categories.filter(hasSlug).forEach((category) => {
      dynamicEntries.push({
        url: `${siteUrl}/category/${category.slug}`,
        lastModified,
      });
    });
  }

  // 3. Brands
  if (brands) {
    brands.filter(hasSlug).forEach((brand) => {
      dynamicEntries.push({
        url: `${siteUrl}/brand/${brand.slug}`,
        lastModified,
      });
    });
  }

  // 4. Policy/Legal Pages (excluding ones with custom layouts/routes)
  const customPageSlugs = [
    'about',
    'higher-sale',
    'exchange-products',
    'service-hours',
    'service-charge',
    'service-payment',
    'contact-us',
    'emi-bank-list',
  ];
  if (pages) {
    pages
      .filter(hasSlug)
      .filter((page) => !customPageSlugs.includes(page.slug))
      .forEach((page) => {
        dynamicEntries.push({
          url: `${siteUrl}/policy/${page.slug}`,
          lastModified,
        });
      });
  }

  // 5. Blogs
  if (blogs) {
    blogs.filter(hasSlug).forEach((blog) => {
      dynamicEntries.push({
        url: `${siteUrl}/blogs-and-news/${blog.slug}`,
        lastModified,
      });
    });
  }

  // 6. Flash Deals
  if (flashDeals) {
    flashDeals.filter(hasSlug).forEach((deal) => {
      dynamicEntries.push({
        url: `${siteUrl}/offers/details/${deal.slug}`,
        lastModified,
      });
    });
  }

  // 7. Camping Offers
  if (campingOffers) {
    campingOffers.filter(hasSlug).forEach((camp) => {
      dynamicEntries.push({
        url: `${siteUrl}/camping/details/${camp.slug}`,
        lastModified,
      });
    });
  }

  return [...entries, ...dynamicEntries];
}