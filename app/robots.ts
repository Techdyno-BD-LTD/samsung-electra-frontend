// Next serves this file at /robots.txt.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? 'https://electrabd.com';

export default function robots() {
  const siteUrl = SITE_URL.replace(/\/$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}