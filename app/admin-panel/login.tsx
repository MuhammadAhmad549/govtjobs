'use client'
import React, { useState } from 'react'

export default function AdminLogin({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError('')

      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || 'Login failed')
        return
      }

      // Store JWT token
      const token = data.token
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_token', token)
        document.cookie = `admin_token=${token}; path=/; max-age=86400; SameSite=Lax`
      }

      onLogin(token)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to login right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm flex flex-col gap-6"
      >
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-2">Admin Login</h2>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
          autoFocus
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        {error && <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-700 text-white rounded-lg py-2 font-semibold hover:bg-blue-800 transition disabled:bg-slate-400"
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>
        <div className="text-xs text-slate-500 text-center mt-4 p-3 bg-slate-50 rounded">
          Demo: admin@govtjobs.local / Demo@123
        </div>
      </form>
    </div>
  )
}
