import React from 'react'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import JobExplorer from './Components/JobExplorer'
import WelcomeModal from './Components/WelcomeModal'
import AdUnit from './Components/AdUnit'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <WelcomeModal />
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.2),transparent_30%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <p className="inline-flex rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Official Pakistan Government Jobs
              </p>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Discover verified government vacancies from FPSC, PPSC, FIA, FBR and Punjab Jobs.
              </h1>
              
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#jobs"
                  className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400"
                >
                  Browse Jobs
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <p className="mb-2 text-center text-xs font-medium uppercase tracking-wide text-slate-400">Advertisement</p>
          <AdUnit slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME} />
        </div>
      ) : null}

      <div id="jobs">
        <JobExplorer />
      </div>

      <Footer />
    </div>
  )
}
