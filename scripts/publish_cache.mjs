import { scrapeFIAJobs } from '../app/lib/scrapers/fia-scraper.js'
import { scrapeFPSCJobs } from '../app/lib/scrapers/fpsc-scraper.js'
import { scrapeNJPJobs } from '../app/lib/scrapers/njp-scraper.js'
import { scrapePPSCJobs } from '../app/lib/scrapers/ppsc-scraper.js'
import { scrapePunjabJobs } from '../app/lib/scrapers/punjab-scraper.js'
import { scrapeFBRJobs } from '../app/lib/scrapers/fbr-scraper.js'
import { Redis } from '@upstash/redis'
import dotenv from 'dotenv'

dotenv.config()

const url = process.env.UPSTASH_REDIS_REST_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN
if (!url || !token) {
  console.error('UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not set. Aborting.')
  process.exit(1)
}

const redis = new Redis({ url, token })

async function run() {
  try {
    const [fia, fpsc, njp, ppsc, punjab, fbr] = await Promise.all([
      scrapeFIAJobs(),
      scrapeFPSCJobs(),
      scrapeNJPJobs(),
      scrapePPSCJobs(),
      scrapePunjabJobs(),
      scrapeFBRJobs()
    ])
    const all = [...fia, ...fpsc, ...njp, ...ppsc, ...punjab, ...fbr]

    await redis.set('jobs_all', JSON.stringify(all), { ex: 60 * 60 * 6 })
    await redis.set('jobs_fia', JSON.stringify(fia), { ex: 60 * 60 * 6 })
    await redis.set('jobs_fpsc', JSON.stringify(fpsc), { ex: 60 * 60 * 6 })
    await redis.set('jobs_njp', JSON.stringify(njp), { ex: 60 * 60 * 6 })
    await redis.set('jobs_ppsc', JSON.stringify(ppsc), { ex: 60 * 60 * 6 })
    await redis.set('jobs_punjab', JSON.stringify(punjab), { ex: 60 * 60 * 6 })
    await redis.set('jobs_fbr', JSON.stringify(fbr), { ex: 60 * 60 * 6 })

    console.log(new Date().toISOString(), 'Published cache to Upstash: total', all.length)
    process.exit(0)
  } catch (err) {
    console.error('Publish cache error', err?.stack || err)
    process.exit(2)
  }
}

run()
