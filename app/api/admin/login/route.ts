import { NextRequest, NextResponse } from 'next/server'
import { generateAdminToken } from '@/app/lib/auth'
import { errorLogger } from '@/app/lib/error-logger'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password required' }, { status: 400 })
    }

    // Get credentials from environment
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@govtjobs.local'
    const adminPassword = process.env.ADMIN_PASSWORD || 'Demo@123'

    if (email !== adminEmail || password !== adminPassword) {
      errorLogger.warn('Failed admin login attempt', { email, ip: request.headers.get('x-forwarded-for') })
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
    }

    // Generate JWT token
    const token = generateAdminToken(email)

    errorLogger.info('Admin logged in successfully', { email })

    const response = NextResponse.json({
      success: true,
      token,
      message: 'Login successful'
    })

    // Set HTTP-only cookie
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 // 24 hours
    })

    return response
  } catch (error) {
    errorLogger.error('Admin login error', error)
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 })
  }
}
