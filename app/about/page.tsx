import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'

export const metadata: Metadata = {
  title: 'About GovtJobs Pakistan',
  description:
    'Learn how GovtJobs Pakistan gathers public-sector vacancy information, links to official application portals, and helps applicants verify job details.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <header className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">About this service</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">GovtJobs Pakistan</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            GovtJobs Pakistan is an independent directory that helps people find public-sector vacancy announcements in Pakistan.
            It brings selected information from public recruitment portals into one searchable place and links applicants back to
            the source for the official advertisement and application.
          </p>
        </header>

        <div className="space-y-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-slate-950">How the listings are collected</h2>
            <p className="mt-3 leading-7 text-slate-600">
              The site reads publicly available information from the recruitment portals listed on the jobs pages. Automated
              collection and page layouts can miss details or fall behind when a source website changes. Some entries may link
              to an official recruitment page where the current advertisement must be selected, rather than to a single vacancy.
            </p>
            <p className="mt-3 leading-7 text-slate-600">
              We do not make hiring decisions and are not a government department, recruiting agency, or representative of the
              organizations shown. A listing on this site is not an offer of employment or a guarantee that recruitment is open.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-slate-950">How to use a listing</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 leading-7 text-slate-600">
              <li>Search or filter by department, title, or location to find a potentially relevant announcement.</li>
              <li>Open the linked official source and read its full advertisement before relying on the summary here.</li>
              <li>Confirm the closing date, eligibility, domicile or quota rules, required documents, fees, and application method.</li>
              <li>Submit an application only through the official portal or instructions named by the recruiting organization.</li>
            </ol>
            <p className="mt-4 leading-7 text-slate-600">
              Do not pay an intermediary or share sensitive personal information with anyone claiming to represent this directory.
              Report a broken link or inaccurate listing through our <Link href="/contact" className="font-medium text-cyan-800 underline">Contact page</Link>.
            </p>
          </section>

          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-amber-950">Please verify details at the source</h2>
            <p className="mt-3 leading-7 text-amber-900">
              Vacancy information can change or close without notice. The official recruiting organization controls the final
              eligibility requirements, deadline, fees, and application process. Always use its current notice as the authoritative
              source.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-slate-950">Sources and contact</h2>
            <p className="mt-3 leading-7 text-slate-600">
              Browse the <Link href="/jobs" className="font-medium text-cyan-800 underline">current directory</Link> to see the
              public portals represented in the listings. For corrections, accessibility feedback, or questions about this
              website, visit <Link href="/contact" className="font-medium text-cyan-800 underline">Contact</Link>.
            </p>
          </section>
        </div>

        <div className="mt-10">
          <Link
            href="/jobs"
            className="inline-flex items-center rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-700"
          >
            Browse job listings
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}