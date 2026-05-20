import axios from 'axios'
import * as cheerio from 'cheerio'
import { Job } from '@/app/lib/types'
import { demoJobs } from '../demo-jobs'

const FBR_URL = 'https://www.fbr.gov.pk/'

export async function scrapeFBRJobs(): Promise<Job[]> {
  try {
    const { data } = await axios.get(FBR_URL, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    const $ = cheerio.load(data)
    const jobs: Job[] = []
    const seen = new Set<string>()
    const linkSelectors = ['a[href*="jobs"]', 'a[href*="job"]', 'a[href*="vacancy"]', 'a[href*="career"]', 'a[href*="recruitment"]']

    $(linkSelectors.join(',')).each((index, element) => {
      if (jobs.length >= 15) return
      const $el = $(element)
      const title = normalizeText($el.text())
      const href = $el.attr('href') || ''
      const url = toAbsoluteUrl(FBR_URL, href)
      if (!title || title.length < 6 || seen.has(title.toLowerCase())) return
      seen.add(title.toLowerCase())

      jobs.push({
        id: 2300 + jobs.length,
        title: title.substring(0, 120),
        department: 'Federal Board of Revenue',
        location: 'Pakistan',
        salary: 'As per rules',
        deadline: 'Check website',
        type: 'Permanent',
        experience: 'As per requirements',
        description: 'Official FBR recruitment listing. Visit the source to apply.',
        source: 'FBR',
        sourceWebsite: 'Federal Board of Revenue',
        applyUrl: url,
        sourceColor: 'red',
        isAuthentic: true
      })
    })

    if (jobs.length === 0) {
      return fallbackJobs('FBR')
    }

    return jobs
  } catch (error) {
    console.error('FBR Scraper Error:', error instanceof Error ? error.message : error)
    return fallbackJobs('FBR')
  }
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

function toAbsoluteUrl(base: string, href: string): string {
  if (!href) return FBR_URL
  if (href.startsWith('http')) return href
  if (href.startsWith('/')) return `${base.replace(/\/$/, '')}${href}`
  return `${base.replace(/\/$/, '')}/${href}`
}

function fallbackJobs(source: 'FBR'): Job[] {
  return demoJobs.filter((job) => job.source === source)
}
