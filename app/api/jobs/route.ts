import { NextRequest, NextResponse } from 'next/server'
import { scrapeFIAJobs } from '@/app/lib/scrapers/fia-scraper'
import { scrapeFPSCJobs } from '@/app/lib/scrapers/fpsc-scraper'
import { scrapeNJPJobs } from '@/app/lib/scrapers/njp-scraper'
import { scrapePPSCJobs } from '@/app/lib/scrapers/ppsc-scraper'
import { scrapePunjabJobs } from '@/app/lib/scrapers/punjab-scraper'
import { scrapeFBRJobs } from '@/app/lib/scrapers/fbr-scraper'
import { jobCache } from '@/app/lib/cache'
import { isNonEmptyJobList, parseJobsSourceParam, type ScraperKey } from '@/app/lib/jobs-source'
import { Job } from '@/app/lib/types'
import { isAdminAuthorized } from '@/app/lib/auth'
import { createRateLimitMiddleware } from '@/app/lib/rate-limiter'
import { errorLogger } from '@/app/lib/error-logger'
import { isJobExpired } from '@/app/lib/deadline'

export const maxDuration = 45

const sourceMap = {
  fia: scrapeFIAJobs,
  fpsc: scrapeFPSCJobs,
  njp: scrapeNJPJobs,
  ppsc: scrapePPSCJobs,
  punjab: scrapePunjabJobs,
  fbr: scrapeFBRJobs
} as const

const cacheKeyMap = {
  all: 'jobs_all',
  fia: 'jobs_fia',
  fpsc: 'jobs_fpsc',
  njp: 'jobs_njp',
  ppsc: 'jobs_ppsc',
  punjab: 'jobs_punjab',
  fbr: 'jobs_fbr'
} as const

const allSourceKeys = Object.keys(sourceMap) as ScraperKey[]

function isAuthorized(request: NextRequest): boolean {
  return isAdminAuthorized(request)
}

function getPaginationParams(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = Math.max(1, Number(searchParams.get('page') || 1))
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') || 12)))
  let query = (searchParams.get('q') || '').trim().toLowerCase()
  
  // Sanitize query: remove special regex chars, limit length
  query = query.replace(/[.*+?^${}()|[\]\\]/g, '').substring(0, 100)
  
  return { page, limit, query }
}

function applySearch(jobs: Job[], query: string): Job[] {
  if (!query) return jobs
  return jobs.filter((job) => {
    const lowerQuery = query.toLowerCase()
    return (
      job.title.toLowerCase().includes(lowerQuery) ||
      job.department.toLowerCase().includes(lowerQuery) ||
      job.location.toLowerCase().includes(lowerQuery) ||
      job.description.toLowerCase().includes(lowerQuery) ||
      job.source.toLowerCase().includes(lowerQuery) ||
      job.sourceWebsite.toLowerCase().includes(lowerQuery)
    )
  })
}

function buildSourceCounts(jobs: Job[]) {
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

function stitchPerSourceCaches(): Job[] {
  const sourceKeys = Object.keys(sourceMap) as ScraperKey[]
  return sourceKeys.flatMap((sourceKey) => jobCache.get<Job[]>(cacheKeyMap[sourceKey]) ?? [])
}

function resolveCountBase(jobsForList: Job[]): Job[] {
  const allCached = jobCache.get<Job[]>(cacheKeyMap.all)
  if (isNonEmptyJobList(allCached)) {
    return allCached
  }
  const stitched = stitchPerSourceCaches()
  if (isNonEmptyJobList(stitched)) {
    return stitched
  }
  return jobsForList
}

function paginateJobs(jobs: Job[], page: number, limit: number) {
  const total = jobs.length
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const safePage = Math.min(page, totalPages)
  const startIndex = (safePage - 1) * limit
  const paginated = jobs.slice(startIndex, startIndex + limit)

  return {
    paginated,
    pagination: {
      page: safePage,
      limit,
      total,
      totalPages,
      hasNextPage: safePage < totalPages,
      hasPreviousPage: safePage > 1
    }
  }
}

function buildResponse(
  jobs: Job[],
  source: string,
  query: string,
  page: number,
  limit: number,
  cacheStatus?: unknown,
  countSourceJobs?: Job[]
) {
  const currentJobs = jobs.filter((job) => !isJobExpired(job))
  const currentCountJobs = (countSourceJobs ?? jobs).filter((job) => !isJobExpired(job))
  const searchedJobs = applySearch(currentJobs, query)
  const { paginated, pagination } = paginateJobs(searchedJobs, page, limit)
  const summaryBase = applySearch(currentCountJobs, query)

  const response = NextResponse.json({
    success: true,
    data: paginated,
    source,
    timestamp: new Date().toISOString(),
    cacheInfo: cacheStatus,
    pagination,
    summary: {
      sourceCounts: buildSourceCounts(summaryBase)
    }
  })

  response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=1800')
  return response
}

export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitCheck = createRateLimitMiddleware({ windowMs: 15 * 60 * 1000, maxRequests: 100 })
  const rateLimitResponse = rateLimitCheck(request)
  if (rateLimitResponse) return rateLimitResponse

  try {
    const searchParams = request.nextUrl.searchParams
    const { scrapeKeys, filterBy } = parseJobsSourceParam(searchParams.get('source'))
    const refresh = searchParams.get('refresh') === 'true'
    const { page, limit, query } = getPaginationParams(request)

    if (!refresh) {
      const tryServeFromCache = async (): Promise<{ jobs: Job[]; countBase: Job[] } | null> => {
        const allCached = await jobCache.getAsync?.<Job[]>(cacheKeyMap.all) ?? jobCache.get<Job[]>(cacheKeyMap.all)
        const fiaCached = await jobCache.getAsync?.<Job[]>(cacheKeyMap.fia) ?? jobCache.get<Job[]>(cacheKeyMap.fia)
        const fpscCached = await jobCache.getAsync?.<Job[]>(cacheKeyMap.fpsc) ?? jobCache.get<Job[]>(cacheKeyMap.fpsc)
        const njpCached = await jobCache.getAsync?.<Job[]>(cacheKeyMap.njp) ?? jobCache.get<Job[]>(cacheKeyMap.njp)

        const stitched = [] as Job[]
        if (fiaCached) stitched.push(...fiaCached)
        if (fpscCached) stitched.push(...fpscCached)
        if (njpCached) stitched.push(...njpCached)

        if (filterBy) {
          const pool = isNonEmptyJobList(allCached) ? allCached : stitched
          if (!isNonEmptyJobList(pool)) return null
          const filtered = pool.filter((job) => job.source === filterBy)
          if (!isNonEmptyJobList(filtered)) return null
          return { jobs: filtered, countBase: resolveCountBase(filtered) }
        }

        if (scrapeKeys.length === allSourceKeys.length) {
          if (isNonEmptyJobList(allCached)) return { jobs: allCached, countBase: allCached }
          if (isNonEmptyJobList(stitched)) return { jobs: stitched, countBase: stitched }
          return null
        }

        const singleKey = scrapeKeys[0]
        const direct = await jobCache.getAsync?.<Job[]>(cacheKeyMap[singleKey]) ?? jobCache.get<Job[]>(cacheKeyMap[singleKey])
        if (isNonEmptyJobList(direct)) return { jobs: direct, countBase: resolveCountBase(direct) }

        if (isNonEmptyJobList(allCached)) {
          const filtered = allCached.filter((job) => job.source.toLowerCase() === singleKey)
          if (isNonEmptyJobList(filtered)) return { jobs: filtered, countBase: allCached }
        }

        const stitchedFiltered = stitched.filter((job) => job.source.toLowerCase() === singleKey)
        if (isNonEmptyJobList(stitchedFiltered)) return { jobs: stitchedFiltered, countBase: isNonEmptyJobList(allCached) ? allCached : stitched }

        return null
      }

      const cached = await tryServeFromCache()
      if (cached) {
        const stats = await jobCache.getStatsAsync?.() ?? jobCache.getStats()
        return buildResponse(cached.jobs, 'cache', query, page, limit, stats, cached.countBase)
      }
    }

    const results = await Promise.allSettled(scrapeKeys.map((sourceKey) => sourceMap[sourceKey]()))

    const merged: Job[] = []
    results.forEach((result, index) => {
      const sourceKey = scrapeKeys[index]
      if (result.status === 'fulfilled' && Array.isArray(result.value)) {
        merged.push(...result.value)
      } else {
        errorLogger.error(`Scraping error for ${sourceKey.toUpperCase()}`, result.status === 'rejected' ? result.reason : 'Unexpected scraper result', { sourceKey })
      }
    })

    if (!merged.length) {
      errorLogger.warn('No jobs found from any scraper', { scrapeKeys, filterBy })
      return NextResponse.json(
        {
          success: false,
          error: 'Unable to load job listings right now. Please try again in a few moments.',
          data: []
        },
        { status: 503 }
      )
    }

    let filteredJobs = merged
    if (filterBy) {
      filteredJobs = merged.filter((job) => job.source === filterBy)
    } else if (scrapeKeys.length === 1) {
      const only = scrapeKeys[0]
      filteredJobs = merged.filter((job) => job.source.toLowerCase() === only)
    }

    if (scrapeKeys.length === allSourceKeys.length) {
      await jobCache.setAsync?.(cacheKeyMap.all, merged)
      await Promise.all(
        allSourceKeys.map((sourceKey) =>
          jobCache.setAsync?.(cacheKeyMap[sourceKey], merged.filter((job) => job.source.toLowerCase() === sourceKey))
        )
      )
    } else {
      const singleKey = scrapeKeys[0]
      await jobCache.setAsync?.(cacheKeyMap[singleKey], merged)
    }

    const countBase = scrapeKeys.length === allSourceKeys.length ? merged : resolveCountBase(filteredJobs)
    const stats = await jobCache.getStatsAsync?.() ?? jobCache.getStats()

    return buildResponse(filteredJobs, 'live', query, page, limit, stats, countBase)
  } catch (error) {
    errorLogger.error('API GET Error', error, { path: request.nextUrl.pathname })
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        data: []
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Apply rate limiting to admin endpoints
  const rateLimitCheck = createRateLimitMiddleware({ windowMs: 15 * 60 * 1000, maxRequests: 50 })
  const rateLimitResponse = rateLimitCheck(request)
  if (rateLimitResponse) return rateLimitResponse

  try {
    if (!isAuthorized(request)) {
      errorLogger.warn('Unauthorized admin access attempt', { ip: request.headers.get('x-forwarded-for') })
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { action } = await request.json()

    if (action === 'refresh') {
      await jobCache.clearAsync?.()
      const sources = allSourceKeys
      const results = await Promise.allSettled(sources.map((sourceKey) => sourceMap[sourceKey]()))

      const sourceJobs: Record<ScraperKey, Job[]> = {
        fia: [],
        fpsc: [],
        njp: [],
        ppsc: [],
        punjab: [],
        fbr: []
      }
      const allJobs: Job[] = []

      results.forEach((result, index) => {
        const sourceKey = sources[index]
        if (result.status === 'fulfilled' && Array.isArray(result.value)) {
          sourceJobs[sourceKey] = result.value
          allJobs.push(...result.value)
        } else {
          errorLogger.error(`Error refreshing ${sourceKey.toUpperCase()}`, result.status === 'rejected' ? result.reason : 'Unexpected scraper result', { sourceKey })
        }
      })

      await jobCache.setAsync?.(cacheKeyMap.all, allJobs)
      await Promise.all(sources.map((s) => jobCache.setAsync?.(cacheKeyMap[s], sourceJobs[s])))

      errorLogger.info('Cache refreshed successfully', { totalJobs: allJobs.length, sources: Object.keys(sourceJobs).filter((k) => sourceJobs[k as ScraperKey].length > 0) })

      return NextResponse.json({
        success: true,
        message: 'Jobs refreshed successfully',
        count: allJobs.length,
        timestamp: new Date().toISOString()
      })
    }

    if (action === 'cache-status') {
      const stats = await jobCache.getStatsAsync?.() ?? jobCache.getStats()
      return NextResponse.json({ success: true, cache: stats })
    }

    if (action === 'clear-cache') {
      await jobCache.clearAsync?.()
      const stats = await jobCache.getStatsAsync?.() ?? jobCache.getStats()
      errorLogger.info('Cache cleared by admin')
      return NextResponse.json({ success: true, message: 'Cache cleared successfully', cache: stats })
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    errorLogger.error('API POST Error', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
