import React from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import JobExplorer from '../Components/JobExplorer'

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-cyan-400">Browse Government Jobs</h1>
        <JobExplorer />
      </main>
      <Footer />
    </div>
  )
}
