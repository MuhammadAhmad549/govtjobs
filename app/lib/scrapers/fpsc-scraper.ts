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
  source: 'FPSC'
  sourceWebsite: string
  applyUrl: string
  sourceColor: string
  isAuthentic: boolean
}

export async function scrapeFPSCJobs(): Promise<ParsedJob[]> {
  try {
    const url = 'https://cp.fpsc.gov.pk/gr_one/index_gr.php'
    
    const { data } = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    const $ = cheerio.load(data)
    const jobs: ParsedJob[] = []
    let jobId = 8001 // Start FPSC jobs from ID 8001

    const pageText = $.root().text().replace(/\s+/g, ' ')
    const adMatch = pageText.match(/Consolidated Advertisement No\.\s*([0-9/]+)/i)
    const closingMatch = pageText.match(/extended to\s*([0-9a-zA-Z,\s]+)/i)

    if (adMatch) {
      jobs.push({
        id: jobId++,
        title: `FPSC Consolidated Advertisement No. ${adMatch[1]}`,
        department: 'Federal Public Service Commission',
        location: 'Islamabad',
        salary: 'As per BPS',
        deadline: closingMatch?.[1]?.trim() || 'Check website',
        type: 'Permanent',
        experience: 'As per requirements',
        description: 'Official consolidated FPSC advertisement available for online applications.',
        source: 'FPSC',
        sourceWebsite: 'Federal Public Service Commission',
        applyUrl: 'https://cp.fpsc.gov.pk/gr_one/index_gr.php',
        sourceColor: 'blue',
        isAuthentic: true
      })
    }

    $('a[href*="index_gr.php"], a[href*="application_track"], a[href*="edit_update_track"]').each((_, element) => {
      const $el = $(element)
      const title = $el.text().replace(/\s+/g, ' ').trim()
      if (!title || title.length < 4) return
      jobs.push({
        id: jobId++,
        title: `FPSC ${title}`.substring(0, 100),
        department: 'Federal Public Service Commission',
        location: 'Islamabad',
        salary: 'As per BPS',
        deadline: 'Check website',
        type: 'Permanent',
        experience: 'As per requirements',
        description: 'FPSC online portal action for current advertisement.',
        source: 'FPSC',
        sourceWebsite: 'Federal Public Service Commission',
        applyUrl: toAbsoluteUrl('https://cp.fpsc.gov.pk/gr_one', $el.attr('href') || ''),
        sourceColor: 'blue',
        isAuthentic: true
      })
    })

    if (jobs.length === 0) {
      jobs.push({
        id: jobId++,
        title: 'FPSC Current Advertisement Portal',
        department: 'Federal Public Service Commission',
        location: 'Islamabad',
        salary: 'As per BPS',
        deadline: 'Check website',
        type: 'Permanent',
        experience: 'As per requirements',
        description: 'Official FPSC online application portal for the latest consolidated advertisement.',
        source: 'FPSC',
        sourceWebsite: 'Federal Public Service Commission',
        applyUrl: 'https://cp.fpsc.gov.pk/gr_one/index_gr.php',
        sourceColor: 'blue',
        isAuthentic: true
      })
    }

    const deduped = dedupeByApplyUrl(jobs)
    console.log(`FPSC Scraper: Found ${deduped.length} items`)
    return deduped.slice(0, 15)
  } catch (error) {
    console.error('FPSC Scraper Error:', error instanceof Error ? error.message : error)
    return [
      {
        id: 8001,
        title: 'FPSC Current Advertisement Portal',
        department: 'Federal Public Service Commission',
        location: 'Islamabad',
        salary: 'As per BPS',
        deadline: 'Check website',
        type: 'Permanent',
        experience: 'As per requirements',
        description: 'Official FPSC online application portal for the latest consolidated advertisement.',
        source: 'FPSC',
        sourceWebsite: 'Federal Public Service Commission',
        applyUrl: 'https://cp.fpsc.gov.pk/gr_one/index_gr.php',
        sourceColor: 'blue',
        isAuthentic: true
      }
    ]
  }
}

function toAbsoluteUrl(base: string, href: string): string {
  if (!href) {
    return `${base}/index_gr.php`
  }
  if (href.startsWith('http')) {
    return href
  }
  if (href.startsWith('/')) {
    return `${base}${href}`
  }
  return `${base}/${href}`
}

function dedupeByApplyUrl(jobs: ParsedJob[]): ParsedJob[] {
  const seen = new Set<string>()
  return jobs.filter((job) => {
    if (seen.has(job.applyUrl)) return false
    seen.add(job.applyUrl)
    return true
  })
}
