'use client'

import React, { useState, useEffect } from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import AdminLogin from './login'

interface CacheInfo {
  keys: string[]
  size: number
}


export default function Dashboard() {
  const [cacheInfo, setCacheInfo] = useState<CacheInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const checkCacheStatus = async () => {
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cache-status' })
      })
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        if (response.status === 401) {
          setIsLoggedIn(false)
          setMessage({ type: 'error', text: 'Session expired. Please login again.' })
        }
        return
      }

      if (data?.success) {
        setCacheInfo(data.cache)
      }
    } catch (error) {
      console.error('Error checking cache:', error)
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      const initialTimer = window.setTimeout(() => {
        void checkCacheStatus()
      }, 0)
      const interval = window.setInterval(() => {
        void checkCacheStatus()
      }, 30000)
      return () => {
        window.clearTimeout(initialTimer)
        window.clearInterval(interval)
      }
    }
  }, [isLoggedIn])

  const handleRefresh = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'refresh' })
      })
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        if (response.status === 401) {
          setIsLoggedIn(false)
          setMessage({ type: 'error', text: 'Session expired. Please login again.' })
          return
        }
        setMessage({ type: 'error', text: data?.error || 'Failed to refresh jobs' })
        return
      }

      if (data?.success) {
        setMessage({ type: 'success', text: `Jobs refreshed! Found ${data.count} jobs.` })
        await checkCacheStatus()
      } else {
        setMessage({ type: 'error', text: 'Failed to refresh jobs' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Error refreshing' })
    } finally {
      setLoading(false)
    }
  }

  const handleClearCache = async () => {
    if (!confirm('Are you sure you want to clear the cache? Jobs will be re-scraped on next request.')) {
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear-cache' })
      })
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        if (response.status === 401) {
          setIsLoggedIn(false)
          setMessage({ type: 'error', text: 'Session expired. Please login again.' })
          return
        }
        setMessage({ type: 'error', text: data?.error || 'Error clearing cache' })
        return
      }

      setMessage({ type: 'success', text: data?.message || 'Cache cleared successfully!' })
      await checkCacheStatus()
    } catch {
      setMessage({ type: 'error', text: 'Error clearing cache' })
    } finally {
      setLoading(false)
    }
  }

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage job scraping, caching, and refreshes</p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 border border-green-200 text-green-800'
              : 'bg-red-100 border border-red-200 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Control Panel</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Refresh Jobs */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Refresh Jobs</h3>
              <p className="text-gray-600 text-sm mb-4">
                Manually trigger job scraping from all sources and update the cache.
              </p>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium transition-colors"
              >
                {loading ? 'Refreshing...' : 'Refresh Now'}
              </button>
            </div>

            {/* Clear Cache */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Clear Cache</h3>
              <p className="text-gray-600 text-sm mb-4">
                Clear all cached jobs. They will be re-scraped on next request.
              </p>
              <button
                onClick={handleClearCache}
                disabled={loading}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 font-medium transition-colors"
              >
                {loading ? 'Clearing...' : 'Clear Cache'}
              </button>
            </div>
          </div>
        </div>

        {/* Scraper & Cache Status */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Scraper & Cache Status</h2>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-gray-200 p-6">
              <p className="text-sm font-semibold text-gray-500 mb-3">Scraper Health</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                  <span className="text-sm text-slate-600">Official site scraping</span>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Active</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                  <span className="text-sm text-slate-600">Refresh interval</span>
                  <span className="text-sm font-semibold text-slate-900">30 minutes</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                  <span className="text-sm text-slate-600">Supported sources</span>
                  <span className="text-sm font-semibold text-slate-900">6</span>
                </div>
              </div>
            </div>

            {cacheInfo ? (
              <div className="rounded-3xl border border-gray-200 p-6">
                <p className="text-sm font-semibold text-gray-500 mb-3">Cache Details</p>
                <div className="border-l-4 border-blue-600 pl-4 mb-5">
                  <p className="text-gray-600">Cached items</p>
                  <p className="text-3xl font-bold text-gray-900">{cacheInfo.size}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Keys stored</h3>
                  {cacheInfo.keys.length > 0 ? (
                    <div className="space-y-2">
                      {cacheInfo.keys.map((key, index) => (
                        <div key={index} className="rounded-2xl bg-gray-50 px-3 py-2 text-sm text-slate-700">
                          <code className="break-all">{key}</code>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No cache keys found</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-gray-200 p-6">
                <p className="text-gray-500">Loading cache status...</p>
              </div>
            )}
          </div>

          <div className="mt-6 rounded-2xl bg-blue-50 border border-blue-200 p-4 text-sm text-blue-800">
            <p>🔒 This route is hidden from client navigation and should be protected with authentication or middleware in production.</p>
          </div>
        </div>

        {/* System Info */}
        <div className="mt-8 bg-gray-50 rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-600 text-sm mb-1">API Endpoint</p>
              <code className="text-sm text-gray-900 break-all">/api/jobs</code>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Cache TTL</p>
              <p className="text-sm text-gray-900">6 hours</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Auto-Refresh Interval</p>
              <p className="text-sm text-gray-900">30 minutes</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Supported Sources</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="text-center">
                <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium">
                  FPSC
                </div>
              </div>
              <div className="text-center">
                <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-medium">
                  PUNJAB
                </div>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 text-orange-800 px-3 py-2 rounded-lg text-sm font-medium">
                  PPSC
                </div>
              </div>
              <div className="text-center">
                <div className="bg-red-100 text-red-800 px-3 py-2 rounded-lg text-sm font-medium">
                  FBR
                </div>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 text-purple-800 px-3 py-2 rounded-lg text-sm font-medium">
                  FIA
                </div>
              </div>
              <div className="text-center">
                <div className="bg-indigo-100 text-indigo-800 px-3 py-2 rounded-lg text-sm font-medium">
                  NJP
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
