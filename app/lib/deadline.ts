import type { Job } from './types'

export function parseDeadlineDate(value: string): Date | null {
  if (!value) return null
  const text = value.trim()
  if (/check/i.test(text)) return null

  if (/^\d{4}-\d{2}-\d{2}/.test(text)) {
    const parsed = new Date(text)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  const dmy = text.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})$/)
  if (dmy) {
    const day = Number(dmy[1])
    const month = Number(dmy[2]) - 1
    const year = dmy[3].length === 2 ? Number(`20${dmy[3]}`) : Number(dmy[3])
    const parsed = new Date(year, month, day)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  const named = Date.parse(text)
  if (!Number.isNaN(named)) return new Date(named)

  const phrase = text.match(/(?:till|until|by|deadline:?|last date:?|available till)\s+([a-z]+\s+\d{1,2},?\s+\d{4})/i)
  if (phrase?.[1]) {
    const parsed = new Date(phrase[1])
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  return null
}

export function isJobExpired(job: Pick<Job, 'deadline' | 'description'>): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const expiredPhrase = job.description.match(
    /(?:expired|closed)\s+(?:on\s+)?([a-z]+\s+\d{1,2},?\s+\d{4})/i
  )
  if (expiredPhrase?.[1]) {
    const expiredDate = new Date(expiredPhrase[1])
    if (!Number.isNaN(expiredDate.getTime())) {
      expiredDate.setHours(0, 0, 0, 0)
      return expiredDate.getTime() <= today.getTime()
    }
  }

  const deadline = parseDeadlineDate(job.deadline) ?? parseDeadlineDate(job.description)
  if (!deadline) return false

  deadline.setHours(0, 0, 0, 0)
  return deadline.getTime() < today.getTime()
}

export type DeadlineTone = 'urgent' | 'soon' | 'ok' | 'unknown'

export function getDeadlineUrgency(deadline: string): { label: string; tone: DeadlineTone } {
  const date = parseDeadlineDate(deadline)
  if (!date) return { label: deadline, tone: 'unknown' }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)
  const days = Math.round((target.getTime() - today.getTime()) / 86_400_000)

  if (days < 0) return { label: 'Deadline passed — verify on official site', tone: 'urgent' }
  if (days === 0) return { label: 'Closes today', tone: 'urgent' }
  if (days === 1) return { label: '1 day left', tone: 'urgent' }
  if (days <= 3) return { label: `${days} days left`, tone: 'urgent' }
  if (days <= 7) return { label: `${days} days left`, tone: 'soon' }
  return { label: deadline, tone: 'ok' }
}

export function compareByDeadline(a: Job, b: Job): number {
  const first = parseDeadlineDate(a.deadline)
  const second = parseDeadlineDate(b.deadline)
  if (!first && !second) return 0
  if (!first) return 1
  if (!second) return -1
  return first.getTime() - second.getTime()
}

export function formatUpdatedAt(value: string | null): string | null {
  if (!value) return null
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleString()
}
