import type { MetadataRoute } from 'next'
import { getAllJobsForSeo, getJobUrl } from '@/app/lib/job-seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://govtjobs-omega.vercel.app'
  const paths = ['/', '/about', '/jobs', '/privacy', '/terms', '/contact']
  const jobs = await getAllJobsForSeo().catch(() => [])

  const staticUrls: MetadataRoute.Sitemap = paths.map((path) => ({
    url: `${base}${path === '/' ? '' : path}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: path === '/' ? 1 : 0.7
  }))

  const jobUrls: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${base}${getJobUrl(job)}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8
  }))

  return [...staticUrls, ...jobUrls]
}
