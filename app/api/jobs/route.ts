import { NextRequest, NextResponse } from 'next/server'
import { scrapeFIAJobs } from '@/app/lib/scrapers/fia-scraper'
import { scrapeFPSCJobs } from '@/app/lib/scrapers/fpsc-scraper'
import { scrapeNJPJobs } from '@/app/lib/scrapers/njp-scraper'
import { jobCache } from '@/app/lib/cache'
import { Job } from '@/app/lib/types'

function isAuthorized(request: NextRequest): boolean {
  const adminSession = request.cookies.get('admin_session')?.value
  const expectedToken = process.env.ADMIN_SESSION_TOKEN

  if (!expectedToken || !adminSession) {
    return false
  }

  return adminSession === expectedToken
}

function getPaginationParams(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = Math.max(1, Number(searchParams.get('page') || 1))
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') || 12)))
  const query = (searchParams.get('q') || '').trim().toLowerCase()
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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const source = searchParams.get('source')
    const refresh = searchParams.get('refresh') === 'true'
    const { page, limit, query } = getPaginationParams(request)

    const cacheKey = `jobs_${source || 'all'}`
    if (!refresh) {
      const cachedData = jobCache.get<Job[]>(cacheKey)
      if (cachedData) {
        const searchedJobs = applySearch(cachedData, query)
        const total = searchedJobs.length
        const totalPages = Math.max(1, Math.ceil(total / limit))
        const safePage = Math.min(page, totalPages)
        const startIndex = (safePage - 1) * limit
        const paginated = searchedJobs.slice(startIndex, startIndex + limit)

        return NextResponse.json({
          success: true,
          data: paginated,
          source: 'cache',
          timestamp: new Date().toISOString(),
          pagination: {
            page: safePage,
            limit,
            total,
            totalPages,
            hasNextPage: safePage < totalPages,
            hasPreviousPage: safePage > 1
          },
          summary: {
            sourceCounts: buildSourceCounts(searchedJobs)
          }
        })
      }
    }

    let allJobs: Job[] = []

    try {
      if (!source || source === 'all' || source === 'fia') {
        const fiaJobs = await scrapeFIAJobs()
        allJobs = [...allJobs, ...fiaJobs]
      }

      if (!source || source === 'all' || source === 'fpsc') {
        const fpscJobs = await scrapeFPSCJobs()
        allJobs = [...allJobs, ...fpscJobs]
      }

      if (!source || source === 'all' || source === 'njp') {
        const njpJobs = await scrapeNJPJobs()
        allJobs = [...allJobs, ...njpJobs]
      }
    } catch (error) {
      console.error('Scraping error:', error)
    }

    let filteredJobs = allJobs
    if (source && source !== 'all') {
      filteredJobs = allJobs.filter((job) => job.source.toLowerCase() === source.toLowerCase())
    }

    jobCache.set<Job[]>(cacheKey, filteredJobs)
    const searchedJobs = applySearch(filteredJobs, query)
    const total = searchedJobs.length
    const totalPages = Math.max(1, Math.ceil(total / limit))
    const safePage = Math.min(page, totalPages)
    const startIndex = (safePage - 1) * limit
    const paginated = searchedJobs.slice(startIndex, startIndex + limit)

    return NextResponse.json({
      success: true,
      data: paginated,
      source: 'live',
      count: total,
      timestamp: new Date().toISOString(),
      cacheInfo: jobCache.getStats(),
      pagination: {
        page: safePage,
        limit,
        total,
        totalPages,
        hasNextPage: safePage < totalPages,
        hasPreviousPage: safePage > 1
      },
      summary: {
        sourceCounts: buildSourceCounts(searchedJobs)
      }
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: []
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { action } = await request.json()

    if (action === 'refresh') {
      jobCache.clear()
      let allJobs: Job[] = []

      try {
        const [fiaJobs, fpscJobs, njpJobs] = await Promise.all([scrapeFIAJobs(), scrapeFPSCJobs(), scrapeNJPJobs()])
        allJobs = [...allJobs, ...fiaJobs, ...fpscJobs, ...njpJobs]
      } catch (error) {
        console.error('Error during refresh:', error)
      }

      jobCache.set('jobs_all', allJobs)

      return NextResponse.json({
        success: true,
        message: 'Jobs refreshed successfully',
        count: allJobs.length,
        timestamp: new Date().toISOString()
      })
    }

    if (action === 'cache-status') {
      return NextResponse.json({
        success: true,
        cache: jobCache.getStats()
      })
    }

    if (action === 'clear-cache') {
      jobCache.clear()
      return NextResponse.json({
        success: true,
        message: 'Cache cleared successfully',
        cache: jobCache.getStats()
      })
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    console.error('POST Error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
