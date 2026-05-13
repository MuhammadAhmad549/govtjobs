import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://govtjobs-omega.vercel.app'
  const paths = ['/', '/about', '/jobs', '/privacy', '/terms', '/contact']

  return paths.map((path) => ({
    url: `${base}${path === '/' ? '' : path}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: path === '/' ? 1 : 0.7
  }))
}
