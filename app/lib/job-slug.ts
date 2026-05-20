import type { Job } from '@/app/lib/types'

export function slugifyJob(job: Job): string {
  const slug = job.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

  return `${slug || 'job'}-${job.id}`
}

export function getJobUrl(job: Job): string {
  return `/jobs/${slugifyJob(job)}`
}
