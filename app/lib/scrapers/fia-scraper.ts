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
  source: 'FIA'
  sourceWebsite: string
  applyUrl: string
  sourceColor: string
  isAuthentic: boolean
}

export async function scrapeFIAJobs(): Promise<ParsedJob[]> {
  try {
    const url = 'https://fia.gov.pk/careers'
    const { data } = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    const $ = cheerio.load(data)
    const jobs: ParsedJob[] = []
    const seenTitles = new Set<string>()
    let jobId = 9001

    const jobElements = $('.careers-list a, .career-item a, a[href*="career"], a[href*="vacancy"], a[href*="jobs"]')

    if (jobElements.length === 0) {
      console.log('FIA: No job elements found with current selectors')
      return jobs
    }

    jobElements.each((index, element) => {
      try {
        const $el = $(element)
        const href = $el.attr('href') || ''
        const normalizedHref = toAbsoluteUrl('https://fia.gov.pk', href)

        const rawTitle = ($el.text() || $el.attr('title') || $el.attr('aria-label') || '')
          .replace(/\s+/g, ' ')
          .trim()
        const title = rawTitle || generateTitleFromHref(href)
        const lookupTitle = title.toLowerCase()

        if (!title || title.length < 6 || containsDenyWord(lookupTitle) || seenTitles.has(lookupTitle)) {
          return
        }

        const description = $el
          .closest('article, li, div')
          .text()
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, 260)

        const deadline = [$el.find('.deadline, .closing-date, .last-date').text().trim(),
          $el.find('*:contains("deadline"), *:contains("last date"), *:contains("closing date")').first().text().trim()
        ].find(Boolean) || 'Check website'

        if (!isLikelyFIAJobTitle(lookupTitle)) {
          return
        }

        seenTitles.add(lookupTitle)

        jobs.push({
          id: jobId++,
          title: title.substring(0, 100),
          department: 'Federal Investigation Agency',
          location: extractLocation(description) || 'Pakistan',
          salary: extractSalary(description) || 'Competitive',
          deadline,
          type: description.toLowerCase().includes('contract') ? 'Contract' : 'Permanent',
          experience: extractExperience(description) || 'As per requirements',
          description: description || 'Official FIA listing.',
          source: 'FIA',
          sourceWebsite: 'Federal Investigation Agency',
          applyUrl: normalizedHref,
          sourceColor: 'purple',
          isAuthentic: true
        })
      } catch (error) {
        console.log(`Error parsing FIA job element ${index}:`, error)
      }
    })

    if (!jobs.length) {
      jobs.push({
        id: jobId++,
        title: 'FIA Careers Portal',
        department: 'Federal Investigation Agency',
        location: 'Pakistan',
        salary: 'As per post',
        deadline: 'Check website',
        type: 'Permanent',
        experience: 'As per requirements',
        description: 'Official FIA careers portal for current vacancies and recruitment notices.',
        source: 'FIA',
        sourceWebsite: 'Federal Investigation Agency',
        applyUrl: 'https://fia.gov.pk/careers',
        sourceColor: 'purple',
        isAuthentic: true
      })
    }

    console.log(`FIA Scraper: Found ${jobs.length} jobs`)
    return jobs.slice(0, 15)
  } catch (error) {
    console.error('FIA Scraper Error:', error instanceof Error ? error.message : error)
    return []
  }
}

function isLikelyFIAJobTitle(title: string): boolean {
  if (title.length < 8 || title.length > 140) {
    return false
  }

  const keywords = ['job', 'vacancy', 'position', 'post', 'career', 'apply', 'recruitment', 'advertisement']
  return keywords.some((keyword) => title.includes(keyword))
}

function containsDenyWord(title: string): boolean {
  const denyList = ['home', 'about', 'contact', 'news', 'gallery', 'tender', 'read more', 'view details']
  return denyList.some((word) => title.includes(word))
}

function generateTitleFromHref(href: string): string {
  if (!href) return 'FIA Careers Listing'
  return href
    .replace(/\?.*$/, '')
    .split('/')
    .filter(Boolean)
    .pop()
    ?.replace(/[-_]/g, ' ')
    .replace(/\b(job|vacancy|career|describe|details)\b/gi, '')
    .trim() || 'FIA Careers Listing'
}

function toAbsoluteUrl(base: string, href: string): string {
  if (!href) {
    return `${base}/careers`
  }

  if (href.startsWith('http')) {
    return href
  }

  if (href.startsWith('/')) {
    return `${base}${href}`
  }

  return `${base}/${href}`
}

function extractLocation(text: string): string | null {
  const locations = ['Islamabad', 'Lahore', 'Karachi', 'Peshawar', 'Multan', 'Quetta', 'Faisalabad', 'Rawalpindi']
  const match = locations.find((loc) => text.includes(loc))
  return match || null
}

function extractSalary(text: string): string | null {
  const salaryMatch = text.match(/Rs\.?\s*([\d,]+)\s*[-–]\s*([\d,]+)|salary|Rs|PKR/i)
  return salaryMatch ? 'As per BPS' : null
}

function extractExperience(text: string): string | null {
  const expMatch = text.match(/(\d+)\s*years?|experience/i)
  return expMatch ? expMatch[0] : null
}
