import axios from 'axios'
import * as cheerio from 'cheerio'

interface ParsedJob {
  id: number
  title: string
  department: string
  location: string
  salary: string
  deadline: string
  type: string
  experience: string
  description: string
  source: 'NJP'
  sourceWebsite: string
  applyUrl: string
  sourceColor: string
  isAuthentic: boolean
}

export async function scrapeNJPJobs(): Promise<ParsedJob[]> {
  try {
    const url = 'https://www.njp.gov.pk/jobs/live'
    const { data } = await axios.get(url, {
      timeout: 20000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    const $ = cheerio.load(data)
    const jobs: ParsedJob[] = []
    const seenLinks = new Set<string>()
    let jobId = 9501

    $('a[href*="/jobs/"]').each((_, element) => {
      const $el = $(element)
      const href = $el.attr('href') || ''
      const normalizedHref = normalizeUrl('https://www.njp.gov.pk', href)

      if (!/\/jobs\/\d+/.test(normalizedHref) || seenLinks.has(normalizedHref)) {
        return
      }

      const card = $el.closest('article, .card, .job-card, li, div')
      const title = card.find('h1, h2, h3, h4').first().text().replace(/\s+/g, ' ').trim() || `NJP Job ${normalizedHref.split('/').pop()}`
      const description = card.text().replace(/\s+/g, ' ').trim().substring(0, 220)

      seenLinks.add(normalizedHref)

      jobs.push({
        id: jobId++,
        title: title.substring(0, 100),
        department: 'National Jobs Portal',
        location: extractLocation(description) || 'Pakistan',
        salary: 'As per post',
        deadline: extractDeadline(description) || 'Check portal',
        type: description.toLowerCase().includes('contract') ? 'Contract' : 'Permanent',
        experience: 'As per advertisement',
        description: description || 'Official listing from National Jobs Portal.',
        source: 'NJP',
        sourceWebsite: 'National Jobs Portal',
        applyUrl: normalizedHref,
        sourceColor: 'indigo',
        isAuthentic: true
      })
    })

    console.log(`NJP Scraper: Found ${jobs.length} jobs`)
    return jobs.slice(0, 20)
  } catch (error) {
    console.error('NJP Scraper Error:', error instanceof Error ? error.message : error)
    return []
  }
}

function normalizeUrl(base: string, href: string): string {
  if (!href) return `${base}/jobs/live`
  if (href.startsWith('http')) return href
  if (href.startsWith('/')) return `${base}${href}`
  return `${base}/${href}`
}

function extractLocation(text: string): string | null {
  const locations = ['Islamabad', 'Lahore', 'Karachi', 'Peshawar', 'Rawalpindi', 'Quetta', 'Multan', 'Faisalabad']
  return locations.find((loc) => text.includes(loc)) || null
}

function extractDeadline(text: string): string | null {
  const match = text.match(/(deadline|last date|closing date)\s*[:\-]?\s*([A-Za-z0-9,\-\/ ]{4,30})/i)
  return match?.[2]?.trim() || null
}
