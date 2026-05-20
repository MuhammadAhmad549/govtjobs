'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Job, JobSource } from '@/app/lib/types'
import { departments } from '@/app/lib/departments'
import JobFilters from './JobFilters'
import JobCard from './JobCard'

interface SourceCounts {
  ALL: number
  FPSC: number
  PUNJAB: number
  PPSC: number
  FBR: number
  FIA: number
  NJP: number
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

interface Props {
  initialJobs?: Job[]
  initialLastUpdated?: string | null
}

export default function JobExplorer({ initialJobs = [], initialLastUpdated = null }: Props) {
  const [selectedDept, setSelectedDept] = useState<JobSource | 'ALL'>('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [jobs, setJobs] = useState<Job[]>(initialJobs)
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(initialLastUpdated)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false
  })
  const [counts, setCounts] = useState<SourceCounts>({
    ALL: 0,
    FPSC: 0,
    PUNJAB: 0,
    PPSC: 0,
    FBR: 0,
    FIA: 0,
    NJP: 0
  })

  const fetchJobs = async (opts?: { pageOverride?: number; forceRefresh?: boolean; queryOverride?: string }) => {
    const targetPage = opts?.pageOverride ?? page
    const searchQuery = opts?.queryOverride ?? debouncedSearch
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        page: String(targetPage),
        limit: '12'
      })

      if (selectedDept !== 'ALL') {
        params.set('source', selectedDept.toLowerCase())
      }

      if (searchQuery) {
        params.set('q', searchQuery)
      }

      if (opts?.forceRefresh) {
        params.set('refresh', 'true')
      }

      const response = await fetch(`/api/jobs?${params.toString()}`)
      const data = await response.json().catch(() => null)

      if (!response.ok || !data?.success) {
        setError(data?.error || 'Unable to load jobs at the moment.')
        return
      }

      setJobs(Array.isArray(data.data) ? data.data : [])
      const timestamp = data?.timestamp ? new Date(data.timestamp) : new Date()
      setLastUpdated(timestamp.toLocaleTimeString())

      if (data.pagination) {
        setPagination(data.pagination)
        setPage(data.pagination.page)
      }

      if (data.summary?.sourceCounts) {
        setCounts(data.summary.sourceCounts)
      }
    } catch (error) {
      console.error('JobExplorer fetch error:', error)
      setError('Network error while loading jobs.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const debounceTimer = window.setTimeout(() => {
      setDebouncedSearch(searchTerm.trim())
    }, 300)

    return () => window.clearTimeout(debounceTimer)
  }, [searchTerm])

  useEffect(() => {
    // Only fetch on mount if we don't have initial server-provided jobs.
    if (initialJobs.length === 0) {
      const initialId = window.setTimeout(() => {
        void fetchJobs({ pageOverride: 1 })
      }, 0)
      return () => window.clearTimeout(initialId)
    }
    // If we have initial data, refresh less often (every 30 minutes) when visible.
    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        void fetchJobs({ pageOverride: 1 })
      }
    }, 30 * 60 * 1000)

    return () => window.clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const id = window.setTimeout(() => {
      setPage(1)
      void fetchJobs({ pageOverride: 1, queryOverride: debouncedSearch })
    }, 0)
    return () => window.clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDept, debouncedSearch])

  const handleSearchSubmit = () => {
    const trimmed = searchTerm.trim()
    setDebouncedSearch(trimmed)
    setPage(1)
  }

  const handleRefresh = async () => {
    await fetchJobs({ forceRefresh: true, pageOverride: 1 })
  }

  const handlePreviousPage = async () => {
    const nextPage = Math.max(1, page - 1)
    setPage(nextPage)
    await fetchJobs({ pageOverride: nextPage })
  }

  const handleNextPage = async () => {
    const nextPage = page + 1
    setPage(nextPage)
    await fetchJobs({ pageOverride: nextPage })
  }

  const filteredJobs = useMemo(() => jobs, [jobs])

  return (
    <section className="bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <JobFilters
          selectedDept={selectedDept}
          setSelectedDept={setSelectedDept}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearchSubmit={handleSearchSubmit}
          loading={loading}
          onRefresh={handleRefresh}
          lastUpdated={lastUpdated}
          counts={counts}
        />

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
          <div>
            <p className="text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-900">{filteredJobs.length}</span> job{filteredJobs.length !== 1 ? 's' : ''}
              {selectedDept !== 'ALL' && ` in ${departments[selectedDept].name}`}
              {debouncedSearch && ` matching "${debouncedSearch}"`}
            </p>
          </div>
          <div className="inline-flex flex-wrap gap-2 text-sm text-slate-500">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-2">Total sources: {Object.keys(departments).length}</span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-2">Live data from official sites</span>
          </div>
        </div>

        {error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
            <p className="font-semibold mb-1">Could not load jobs</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : loading && filteredJobs.length === 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-72 rounded-3xl border border-slate-200 bg-white animate-pulse" />
            ))}
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600 shadow-sm">
            <p className="text-xl font-semibold text-slate-900 mb-2">No jobs found</p>
            <p className="text-sm">Try a broader search term or select another department.</p>
          </div>
        )}

        {filteredJobs.length > 0 && (
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-500">
              Page <span className="font-semibold text-slate-900">{pagination.page}</span> of{' '}
              <span className="font-semibold text-slate-900">{pagination.totalPages}</span> • {pagination.total} results
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handlePreviousPage}
                disabled={loading || !pagination.hasPreviousPage}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleNextPage}
                disabled={loading || !pagination.hasNextPage}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Next
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400 transition"
              >
                {loading ? 'Updating...' : 'Refresh jobs now'}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
