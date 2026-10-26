'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'welcome_banner_dismissed'

/** Non-blocking first-visit hint — avoids full-screen popups (better for UX & ad policies). */
export default function WelcomeBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return
      const id = window.setTimeout(() => setVisible(true), 400)
      return () => window.clearTimeout(id)
    } catch {
      setVisible(true)
    }
  }, [])

  const dismiss = () => {
    setVisible(false)
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // ignore
    }
  }

  if (!visible) return null

  return (
    <div
      role="region"
      aria-label="Welcome"
      className="border-b border-cyan-200/80 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-sm leading-relaxed text-slate-100">
          <span className="font-semibold text-cyan-300">GovtJobs Pakistan</span> — FPSC, PPSC, FIA, FBR, Punjab & NJP listings in one place.
          Listings link to an official source; some sources may require you to find the relevant notice on that portal.
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="#jobs"
            onClick={dismiss}
            className="rounded-xl bg-cyan-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-400"
          >
            Browse jobs
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-xl border border-slate-600 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800"
            aria-label="Dismiss welcome message"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}
