import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    const adminUser = process.env.ADMIN_USERNAME
    const adminPass = process.env.ADMIN_PASSWORD
    const sessionToken = process.env.ADMIN_SESSION_TOKEN

    if (!adminUser || !adminPass || !sessionToken) {
      return NextResponse.json(
        { success: false, error: 'Admin environment variables are not configured' },
        { status: 500 }
      )
    }

    if (username !== adminUser || password !== adminPass) {
      return NextResponse.json({ success: false, error: 'Invalid username or password' }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Login failed' },
      { status: 500 }
    )
  }
}
