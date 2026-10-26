import { NextRequest, NextResponse } from 'next/server'

interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map()
  private windowMs: number = 15 * 60 * 1000 // 15 minutes
  private maxRequests: number = 100 // per window

  setLimits(windowMs: number, maxRequests: number): void {
    this.windowMs = windowMs
    this.maxRequests = maxRequests
  }

  private getClientId(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown'
    return ip
  }

  isLimited(request: NextRequest): boolean {
    const clientId = this.getClientId(request)
    const now = Date.now()
    const entry = this.store.get(clientId)

    if (!entry || now > entry.resetTime) {
      // New window or expired
      this.store.set(clientId, { count: 1, resetTime: now + this.windowMs })
      return false
    }

    entry.count++
    return entry.count > this.maxRequests
  }

  getRemainingRequests(request: NextRequest): number {
    const clientId = this.getClientId(request)
    const entry = this.store.get(clientId)
    if (!entry || Date.now() > entry.resetTime) {
      return this.maxRequests
    }
    return Math.max(0, this.maxRequests - entry.count)
  }

  getResetTime(request: NextRequest): number {
    const clientId = this.getClientId(request)
    const entry = this.store.get(clientId)
    return entry ? entry.resetTime : Date.now() + this.windowMs
  }

  // Clean up old entries periodically
  cleanup(): void {
    const now = Date.now()
    for (const [clientId, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(clientId)
      }
    }
  }
}

export const rateLimiter = new RateLimiter()

export function createRateLimitMiddleware(
  options: { windowMs?: number; maxRequests?: number } = {}
) {
  const { windowMs = 15 * 60 * 1000, maxRequests = 100 } = options
  rateLimiter.setLimits(windowMs, maxRequests)

  return (request: NextRequest): NextResponse | null => {
    if (rateLimiter.isLimited(request)) {
      const resetTime = rateLimiter.getResetTime(request)
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((resetTime - Date.now()) / 1000))
          }
        }
      )
    }
    return null
  }
}
