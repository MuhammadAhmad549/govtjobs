'use client'

import { JobSource } from '@/app/lib/types'
import { departments } from '@/app/lib/departments'

interface JobFiltersProps {
  selectedDept: JobSource | 'ALL'
  setSelectedDept: (value: JobSource | 'ALL') => void
  searchTerm: string
  setSearchTerm: (value: string) => void
  onSearchSubmit: () => void
  loading: boolean
  onRefresh: () => Promise<void>
  lastUpdated: string | null
  counts: Record<JobSource | 'ALL', number>
}

export default function JobFilters({
  selectedDept,
  setSelectedDept,
  searchTerm,
  setSearchTerm,
  onSearchSubmit,
  loading,
  onRefresh,
  lastUpdated,
  counts
}: JobFiltersProps) {
  return (
    <div className="mb-10">
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Browse Jobs by Department</h2>
          <p className="text-sm text-slate-500 mt-2">Search official government listings and refresh data from the scraper gateway.</p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400 transition"
        >
          <span className={loading ? 'animate-spin block h-4 w-4 rounded-full border-2 border-white border-t-transparent' : 'inline-block h-4 w-4 rounded-full bg-white'} />
          {loading ? 'Refreshing...' : 'Refresh Jobs'}
        </button>
      </div>

      {lastUpdated ? (
        <p className="text-sm text-slate-500 mb-6">Last updated: {lastUpdated} • Auto-refresh every 30 minutes</p>
      ) : null}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSearchSubmit()
        }}
        className="grid gap-4 lg:grid-cols-[1.8fr_0.8fr] mb-6"
      >
        <div className="relative">
          <input
            type="search"
            aria-label="Search jobs"
            autoComplete="off"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search live government jobs by title, location, or department"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-28 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          />
          <button
            type="submit"
            aria-label="Search jobs"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition"
          >
            Search
          </button>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setSelectedDept('ALL')}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              selectedDept === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Jobs ({counts.ALL})
          </button>
          <button
            type="button"
            onClick={() => setSelectedDept('FIA')}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              selectedDept === 'FIA'
                ? 'bg-purple-700 text-white'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
          >
            FIA ({counts.FIA})
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-3">
        {Object.entries(departments).map(([key, dept]) => (
          <button
            key={key}
            type="button"
            onClick={() => setSelectedDept(key as JobSource)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              selectedDept === key
                ? `${dept.bgColor} ${dept.color}`
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {dept.name} ({counts[key as JobSource]})
          </button>
        ))}
      </div>
    </div>
  )
}
