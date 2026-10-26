import React from 'react'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import JobExplorer from './Components/JobExplorer'
import WelcomeBanner from './Components/WelcomeBanner'
import HomeHero from './Components/HomeHero'
import HowItWorks from './Components/HowItWorks'
import AdPlacement from './Components/AdPlacement'
import { getAllJobsForSeo } from './lib/job-seo'

export const revalidate = 300

export default async function Home() {
  const jobs = await getAllJobsForSeo()
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <WelcomeBanner />
      <HomeHero />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdPlacement slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME} className="pt-6" />
      </div>

      <div id="jobs">
        <JobExplorer initialJobs={jobs} initialLastUpdated={new Date().toISOString()} />
      </div>

      <HowItWorks />

      <Footer />
    </div>
  )
}
