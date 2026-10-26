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

export interface SourceCounts {
  ALL: number
  FPSC: number
  PUNJAB: number
  PPSC: number
  FBR: number
  FIA: number
  NJP: number
}

export function buildSourceCounts(jobs: Job[]): SourceCounts {
  return {
    ALL: jobs.length,
    FPSC: jobs.filter((job) => job.source === 'FPSC').length,
    PUNJAB: jobs.filter((job) => job.source === 'PUNJAB').length,
    PPSC: jobs.filter((job) => job.source === 'PPSC').length,
    FBR: jobs.filter((job) => job.source === 'FBR').length,
    FIA: jobs.filter((job) => job.source === 'FIA').length,
    NJP: jobs.filter((job) => job.source === 'NJP').length
  }
}
