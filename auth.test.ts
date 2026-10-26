import { describe, it, expect } from '@jest/globals'
import { verifyAdminToken, generateAdminToken } from '../app/lib/auth'

describe('Admin Authentication', () => {
  it('should generate a valid token', () => {
    const token = generateAdminToken('admin@example.com')
    expect(token).toBeTruthy()
    expect(token.split('.').length).toBe(3) // JWT format: header.payload.signature
  })

  it('should verify a valid token', () => {
    const email = 'admin@example.com'
    const token = generateAdminToken(email)
    const session = verifyAdminToken(token)
    expect(session).not.toBeNull()
    expect(session?.email).toBe(email)
  })

  it('should reject an invalid token', () => {
    const session = verifyAdminToken('invalid.token.here')
    expect(session).toBeNull()
  })

  it('should return null for tampered token', () => {
    const token = generateAdminToken('admin@example.com')
    const [header, payload] = token.split('.')
    const tamperedToken = `${header}.${payload}.invalidsignature`
    const session = verifyAdminToken(tamperedToken)
    expect(session).toBeNull()
  })
})
