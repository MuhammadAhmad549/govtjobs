import React from 'react'
import Link from 'next/link'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'

export default function AboutPage() {
  const features = [
    {
      icon: '🔍',
      title: 'Real-Time Aggregation',
      desc: 'We continuously monitor official government portals and bring you the latest job listings instantly.',
    },
    {
      icon: '📊',
      title: 'Smart Filtering',
      desc: 'Filter by department, location, salary range, and qualifications to find your perfect match.',
    },
    {
      icon: '🔗',
      title: 'Direct & Secure',
      desc: 'All apply links go to official government websites — no intermediaries, 100% safe.',
    },
  ]

  const sources = [
    { name: 'FPSC', desc: 'Federal Public Service Commission' },
    { name: 'NJP', desc: 'National Jobs Portal' },
    { name: 'PPSC', desc: 'Punjab Public Service Commission' },
    { name: 'Punjab Jobs', desc: 'Official Punjab Jobs Portal' },
    { name: 'FBR', desc: 'Federal Board of Revenue' },
    { name: 'FIA', desc: 'Federal Investigation Agency' },
    { name: 'Provincial Bodies', desc: 'Other Government Organizations' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-800">

      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-200 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Govt Jobs Pakistan
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-4">
            Your gateway to government opportunities
          </p>

          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Discover the latest government job openings from Pakistan&apos;s top organizations — all in one trusted platform.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl p-10 border border-gray-200 shadow-sm">
          <h2 className="text-3xl font-bold mb-6 text-blue-600">🎯 Our Mission</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            We make job hunting <span className="text-blue-600 font-semibold">easier, faster, and transparent</span>.
            Find all government opportunities in one place instead of browsing multiple sites.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">✨ Why Choose Us?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((item, i) => (
              <div
                key={i}
                className="p-8 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-blue-600">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sources */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">🏛️ Our Trusted Sources</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sources.map((src, i) => (
              <div
                key={i}
                className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition"
              >
                <h3 className="font-bold text-blue-600 mb-2">{src.name}</h3>
                <p className="text-sm text-gray-500">{src.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { value: '5+', label: 'Government Sources' },
            { value: '100+', label: 'Job Opportunities' },
            { value: 'Real-Time', label: 'Updates Daily' },
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100"
            >
              <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-4xl font-bold mb-4 text-gray-900">
          Ready to Find Your Next Opportunity?
        </h2>

        <p className="text-xl text-gray-500 mb-8">
          Browse verified government job openings and apply directly.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition transform hover:scale-105"
        >
          🚀 Browse Jobs Now
        </Link>
      </section>

      <Footer />
    </div>
  )
}