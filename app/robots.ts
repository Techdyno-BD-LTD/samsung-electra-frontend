// Next serves this file at /robots.txt.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? 'https://electrabd.com';

export default function robots() {
  const siteUrl = SITE_URL.replace(/\/$/, '');

  const isDevServer = siteUrl.includes('dev.') || !siteUrl.includes('electrabd.com');

  return {
    rules: [
      {
        userAgent: '*',
        ...(isDevServer ? { disallow: '/' } : { allow: '/' }),
      },
    ],
    sitemap: isDevServer ? undefined : `${siteUrl}/sitemap.xml`,
  };
}