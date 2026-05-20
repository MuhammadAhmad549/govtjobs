import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Footer from '@/app/Components/Footer'
import Navbar from '@/app/Components/Navbar'
import { departments } from '@/app/lib/departments'
import { buildJobPostingJsonLd, getJobBySlug, getJobUrl } from '@/app/lib/job-seo'

interface JobDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const job = await getJobBySlug(slug)

  if (!job) {
    return {
      title: 'Job Not Found'
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://govtjobs-omega.vercel.app'
  const canonical = `${siteUrl}${getJobUrl(job)}`

  return {
    title: `${job.title} - ${job.department}`,
    description: `${job.title} at ${job.department} in ${job.location}. Deadline: ${job.deadline}. Apply through the official ${job.sourceWebsite} website.`,
    alternates: {
      canonical
    },
    openGraph: {
      title: `${job.title} - ${job.department}`,
      description: job.description,
      url: canonical,
      type: 'article'
    }
  }
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { slug } = await params
  const job = await getJobBySlug(slug)

  if (!job) {
    notFound()
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://govtjobs-omega.vercel.app'
  const canonical = `${siteUrl}${getJobUrl(job)}`
  const dept = departments[job.source]
  const jsonLd = buildJobPostingJsonLd(job, canonical)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-900">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/jobs" className="hover:text-slate-900">
            Jobs
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-700">{job.title}</span>
        </nav>

        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6 sm:p-8">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${dept.bgColor} ${dept.color}`}>
                {dept.name}
              </span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                Official source linked
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{job.title}</h1>
            <p className="mt-3 text-lg text-slate-600">{job.department}</p>
            <p className="mt-2 text-sm text-slate-500">{job.location}</p>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
            <InfoBlock label="Salary" value={job.salary} />
            <InfoBlock label="Deadline" value={job.deadline} />
            <InfoBlock label="Experience" value={job.experience} />
            <InfoBlock label="Job Type" value={job.type} />
            <InfoBlock label="Source" value={job.sourceWebsite} />
            <InfoBlock label="Department" value={dept.name} />
          </div>

          <div className="border-t border-slate-200 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-slate-950">Job Details</h2>
            <p className="mt-3 leading-7 text-slate-700">{job.description}</p>

            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              Always verify eligibility, deadline, fee, and application instructions on the official source before applying.
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={job.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Apply on Official Site
              </a>
              <Link
                href="/jobs"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Browse All Jobs
              </Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-medium text-slate-900">{value}</p>
    </div>
  )
}
