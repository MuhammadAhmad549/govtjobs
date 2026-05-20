import axios from 'axios'
import * as cheerio from 'cheerio'
import { Job } from '@/app/lib/types'
import { demoJobs } from '../demo-jobs'

const PUNJAB_URL = 'https://jobs.punjab.gov.pk/new_recruit/jobs'

export async function scrapePunjabJobs(): Promise<Job[]> {
  try {
    const { data } = await axios.get(PUNJAB_URL, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    const $ = cheerio.load(data)
    const jobs: Job[] = []
    const seen = new Set<string>()
    const links = $('a').filter((_, el) => {
      const href = $(el).attr('href') || ''
      const text = normalizeText($(el).text())
      return href.includes('jobs') || text.match(/job|vacancy|opening|career/i)
    })

    links.each((index, element) => {
      if (jobs.length >= 15) return
      const $el = $(element)
      const title = normalizeText($el.text())
      const href = $el.attr('href') || ''
      const url = toAbsoluteUrl(PUNJAB_URL, href)
      if (!title || title.length < 6 || seen.has(title.toLowerCase())) return
      seen.add(title.toLowerCase())

      jobs.push({
        id: 2200 + jobs.length,
        title: title.substring(0, 120),
        department: 'Punjab Jobs Portal',
        location: 'Punjab',
        salary: 'As per rules',
        deadline: 'Check website',
        type: 'Permanent',
        experience: 'As per requirements',
        description: 'Official Punjab jobs portal listing. Visit the source to apply.',
        source: 'PUNJAB',
        sourceWebsite: 'Punjab Jobs Portal',
        applyUrl: url,
        sourceColor: 'green',
        isAuthentic: true
      })
    })

    if (jobs.length === 0) {
      return fallbackJobs('PUNJAB')
    }

    return jobs
  } catch (error) {
    console.error('Punjab Scraper Error:', error instanceof Error ? error.message : error)
    return fallbackJobs('PUNJAB')
  }
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

function toAbsoluteUrl(base: string, href: string): string {
  if (!href) return PUNJAB_URL
  if (href.startsWith('http')) return href
  if (href.startsWith('/')) return `${base.replace(/\/$/, '')}${href}`
  return `${base.replace(/\/$/, '')}/${href}`
}

function fallbackJobs(source: 'PUNJAB'): Job[] {
  return demoJobs.filter((job) => job.source === source)
}
