import React from 'react'
import Navbar from '@/app/Components/Navbar'
import Footer from '@/app/Components/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
        <p className="mb-4 text-slate-600">
          These terms of service govern your use of our website. By accessing or using our service, you agree to be bound by these terms.
        </p>
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Use of the Website</h2>
            <p className="text-slate-600">You may use this site to browse job listings for personal purposes only. Unauthorized resale or redistribution of content is prohibited.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Content</h2>
            <p className="text-slate-600">We strive to provide accurate information, but we do not guarantee that all job listings are complete or up to date. Always verify details on the official source.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Disclaimer</h2>
            <p className="text-slate-600">We are not responsible for any actions you take based on job listings. Use the official employer site to complete any applications or verify job details.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Contact</h2>
            <p className="text-slate-600">For questions about these terms, please visit our <a href="/contact" className="text-blue-600 hover:underline">Contact page</a>.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
