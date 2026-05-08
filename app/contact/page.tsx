import React from 'react'
import Navbar from '@/app/Components/Navbar'
import Footer from '@/app/Components/Footer'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        <p className="mb-6 text-slate-600">
          We&apos;re here to help. If you have questions about job listings, site functionality, or partnership opportunities, please reach out.
        </p>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-slate-600 mb-4">Email us for support, business inquiries, or feedback.</p>
            <div className="space-y-3 text-sm text-slate-700">
              <p><span className="font-semibold">Email:</span> <a href="mailto:support@govtjobs.pk" className="text-blue-600 hover:underline">support@govtjobs.pk</a></p>
              <p><span className="font-semibold">Address:</span> Islamabad, Pakistan</p>
              <p><span className="font-semibold">Hours:</span> Mon–Fri, 9:00 AM – 6:00 PM</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Quick Support</h2>
            <ul className="space-y-4 text-slate-600">
              <li>
                <p className="font-semibold">Need help with a listing?</p>
                <p>Use the official job application link in the job card to verify details.</p>
              </li>
              <li>
                <p className="font-semibold">Found an issue?</p>
                <p>Send us a message at <a href="mailto:support@govtjobs.pk" className="text-blue-600 hover:underline">support@govtjobs.pk</a>.</p>
              </li>
              <li>
                <p className="font-semibold">Partner with us</p>
                <p>We welcome suggestions to improve our job aggregation platform.</p>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
