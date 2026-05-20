import axios from 'axios'
import * as cheerio from 'cheerio'
import { Job } from '@/app/lib/types'
import { demoJobs } from '../demo-jobs'

const PPSC_URL = 'https://www.ppsc.gop.pk/'

export async function scrapePPSCJobs(): Promise<Job[]> {
  try {
    const { data } = await axios.get(PPSC_URL, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    const $ = cheerio.load(data)
    const jobs: Job[] = []
    const seen = new Set<string>()
    const linkSelectors = ['a[href*="advertisement"]', 'a[href*="vacancy"]', 'a[href*="advt"]', 'a[href*="online"]', '.post-title a', '.news-listing a']

    $(linkSelectors.join(',')).each((index, element) => {
      if (jobs.length >= 15) return
      const $el = $(element)
      const title = normalizeText($el.text())
      const href = $el.attr('href') || ''
      const url = toAbsoluteUrl(PPSC_URL, href)
      if (!title || title.length < 6 || seen.has(title.toLowerCase())) return
      seen.add(title.toLowerCase())

      jobs.push({
        id: 2100 + jobs.length,
        title: title.substring(0, 120),
        department: 'Punjab Public Service Commission',
        location: 'Punjab',
        salary: 'As per rules',
        deadline: 'Check website',
        type: 'Permanent',
        experience: 'As per requirements',
        description: 'Official PPSC advertisement listing. Visit the source to apply.',
        source: 'PPSC',
        sourceWebsite: 'Punjab Public Service Commission',
        applyUrl: url,
        sourceColor: 'orange',
        isAuthentic: true
      })
    })

    if (jobs.length === 0) {
      return fallbackJobs('PPSC')
    }

    return jobs
  } catch (error) {
    console.error('PPSC Scraper Error:', error instanceof Error ? error.message : error)
    return fallbackJobs('PPSC')
  }
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

function toAbsoluteUrl(base: string, href: string): string {
  if (!href) return PPSC_URL
  if (href.startsWith('http')) return href
  if (href.startsWith('/')) return `${base.replace(/\/$/, '')}${href}`
  return `${base.replace(/\/$/, '')}/${href}`
}

function fallbackJobs(source: 'PPSC'): Job[] {
  return demoJobs.filter((job) => job.source === source)
}
