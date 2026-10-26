import type { Metadata } from 'next'
import React from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import JobExplorer from '../Components/JobExplorer'
import AdPlacement from '../Components/AdPlacement'
import { getAllJobsForSeo } from '../lib/job-seo'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'All Government Jobs',
  description:
    'Browse Pakistan government job listings from FPSC, PPSC, NJP, FIA, FBR, and Punjab Jobs. Filter by department and apply on official portals.',
  alternates: { canonical: '/jobs' },
}

export default async function JobsPage() {
  const jobs = await getAllJobsForSeo()

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            All government jobs in Pakistan
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Live-style listings from official public portals. Pick a department filter or search by title and city.
          </p>
        </div>
      </header>

      <main id="jobs">
        <JobExplorer
          initialJobs={jobs}
          initialLastUpdated={new Date().toISOString()}
          pageTitle="Filter & search"
          pageSubtitle="Tap a department chip or use search — then apply on the official website linked from each card."
        />
      </main>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdPlacement slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_JOBS} />
      </div>

      <Footer />
    </div>
  )
}
