import Link from 'next/link'
import { departments } from '@/app/lib/departments'

export default function HomeHero() {
  const sources = Object.values(departments)

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white py-16 sm:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.2),transparent_30%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <p className="inline-flex rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Pakistan government jobs
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-[3.25rem] lg:leading-tight">
              Find official vacancies in one place — not across ten different websites.
            </h1>
            <p className="max-w-xl text-lg text-slate-300">
              Search by department or keyword, check deadlines, then apply on FPSC, PPSC, NJP, and other official portals.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#jobs"
                className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400"
              >
                Search all jobs
              </a>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                How it works
              </Link>
            </div>
            <ul className="flex flex-wrap gap-4 pt-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
                Links to official sites
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400" aria-hidden />
                Updated from public portals
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-700/80 bg-slate-900/60 p-6 shadow-xl backdrop-blur sm:p-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-cyan-300">Browse by source</h2>
            <p className="mt-2 text-sm text-slate-400">Jump straight to listings from each department portal we track.</p>
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {sources.map((dept) => (
                <li key={dept.id}>
                  <Link
                    href={`/jobs?source=${dept.id}`}
                    className="flex h-full flex-col rounded-2xl border border-slate-700 bg-slate-800/80 px-3 py-3 text-center transition hover:border-cyan-500/50 hover:bg-slate-800"
                  >
                    <span className="text-sm font-bold text-white">{dept.name}</span>
                    <span className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">Official portal</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs leading-relaxed text-slate-500">
              We aggregate public listings for convenience. Always confirm eligibility, fees, and deadlines on the official site before you apply.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
