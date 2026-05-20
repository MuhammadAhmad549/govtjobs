import type { Job, JobSource } from '@/app/lib/types'

const SCRAPER_KEYS = ['fia', 'fpsc', 'njp', 'ppsc', 'punjab', 'fbr'] as const
export type ScraperKey = (typeof SCRAPER_KEYS)[number]

const DEPT_FILTER: Record<string, JobSource> = {
  punjab: 'PUNJAB',
  ppsc: 'PPSC',
  fbr: 'FBR'
}

export interface JobsSourceRequest {
  scrapeKeys: ScraperKey[]
  filterBy: JobSource | null
}

export function parseJobsSourceParam(raw: string | null): JobsSourceRequest {
  if (!raw || raw.toLowerCase() === 'all') {
    return { scrapeKeys: [...SCRAPER_KEYS], filterBy: null }
  }
  const lower = raw.toLowerCase()
  if (DEPT_FILTER[lower]) {
    return { scrapeKeys: [...SCRAPER_KEYS], filterBy: DEPT_FILTER[lower] }
  }
  if (SCRAPER_KEYS.includes(lower as ScraperKey)) {
    return { scrapeKeys: [lower as ScraperKey], filterBy: null }
  }
  return { scrapeKeys: [...SCRAPER_KEYS], filterBy: null }
}

export function isNonEmptyJobList(value: Job[] | null | undefined): value is Job[] {
  return Array.isArray(value) && value.length > 0
}
