import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://govtjobs-omega.vercel.app'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/admin-panel', '/api/']
    },
    sitemap: `${base}/sitemap.xml`
  }
}
