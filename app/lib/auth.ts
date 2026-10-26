import { NextRequest } from 'next/server'
import crypto from 'node:crypto'

interface AdminSession {
  userId: string
  email: string
  iat: number
  exp: number
}

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'dev-secret-change-in-production'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

// Simple JWT-like token (without external dependency)
export function generateAdminToken(email: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const now = Date.now()
  const payload = {
    userId: crypto.randomUUID(),
    email,
    iat: Math.floor(now / 1000),
    exp: Math.floor((now + SESSION_DURATION) / 1000)
  }
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update(`${header}.${encodedPayload}`)
    .digest('base64url')
  return `${header}.${encodedPayload}.${signature}`
}

export function verifyAdminToken(token: string): AdminSession | null {
  try {
    const [headerB64, payloadB64, signatureB64] = token.split('.')
    if (!headerB64 || !payloadB64 || !signatureB64) return null

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', ADMIN_SECRET)
      .update(`${headerB64}.${payloadB64}`)
      .digest('base64url')

    if (signatureB64 !== expectedSignature) return null

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString()) as AdminSession

    // Check expiration
    if (payload.exp < Math.floor(Date.now() / 1000)) return null

    return payload
  } catch {
    return null
  }
}

export function isAdminAuthorized(request: NextRequest): boolean {
  try {
    // Check Authorization header or cookie
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (token) {
      return verifyAdminToken(token) !== null
    }

    // Fallback to cookie
    const cookieToken = request.cookies.get('admin_token')?.value
    if (cookieToken) {
      return verifyAdminToken(cookieToken) !== null
    }

    return false
  } catch {
    return false
  }
}

export function getAdminFromRequest(request: NextRequest): AdminSession | null {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('admin_token')?.value

    if (token) {
      return verifyAdminToken(token)
    }

    return null
  } catch {
    return null
  }
}
