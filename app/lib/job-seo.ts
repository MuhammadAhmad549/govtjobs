import { scrapeFIAJobs } from '@/app/lib/scrapers/fia-scraper'
import { scrapeFPSCJobs } from '@/app/lib/scrapers/fpsc-scraper'
import { scrapeNJPJobs } from '@/app/lib/scrapers/njp-scraper'
import { scrapePPSCJobs } from '@/app/lib/scrapers/ppsc-scraper'
import { scrapePunjabJobs } from '@/app/lib/scrapers/punjab-scraper'
import { scrapeFBRJobs } from '@/app/lib/scrapers/fbr-scraper'
import { jobCache } from '@/app/lib/cache'
import { slugifyJob } from '@/app/lib/job-slug'
import type { Job } from '@/app/lib/types'

const JOB_CACHE_KEY = 'jobs_all'

export { getJobUrl, slugifyJob } from '@/app/lib/job-slug'

export async function getAllJobsForSeo(): Promise<Job[]> {
  const cached = await jobCache.getAsync?.<Job[]>(JOB_CACHE_KEY) ?? jobCache.get<Job[]>(JOB_CACHE_KEY)
  if (cached?.length) return cached

  const results = await Promise.allSettled([
    scrapeFIAJobs(),
    scrapeFPSCJobs(),
    scrapeNJPJobs(),
    scrapePPSCJobs(),
    scrapePunjabJobs(),
    scrapeFBRJobs()
  ])

  const jobs: Job[] = []
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      jobs.push(...(result.value as Job[]))
    }
  })

  if (jobs.length) {
    await jobCache.setAsync?.(JOB_CACHE_KEY, jobs)
  }

  return jobs
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
  const jobs = await getAllJobsForSeo()
  return jobs.find((job) => slugifyJob(job) === slug) ?? null
}

export function parseJobDate(value: string): string | null {
  const match = value.match(/(?:till|until|by|deadline:?|last date:?|available till)\s+([a-z]+\s+\d{1,2},?\s+\d{4})/i)
  const raw = match?.[1] ?? (/^[a-z]+\s+\d{1,2},?\s+\d{4}$/i.test(value.trim()) ? value.trim() : null)
  if (!raw) return null

  const date = new Date(raw)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

export function buildJobPostingJsonLd(job: Job, url: string) {
  const validThrough = parseJobDate(job.deadline) ?? parseJobDate(job.description)

  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    identifier: {
      '@type': 'PropertyValue',
      name: job.sourceWebsite,
      value: String(job.id)
    },
    datePosted: new Date().toISOString(),
    ...(validThrough ? { validThrough } : {}),
    employmentType: job.type?.toUpperCase().includes('PERMANENT') ? 'FULL_TIME' : job.type,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.department,
      sameAs: job.applyUrl
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
        addressCountry: 'PK'
      }
    },
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: 'PKR',
      value: {
        '@type': 'QuantitativeValue',
        value: job.salary,
        unitText: 'MONTH'
      }
    },
    directApply: false,
    url
  }
}
