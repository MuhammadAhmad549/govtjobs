import React from 'react'
import Navbar from '@/app/Components/Navbar'
import Footer from '@/app/Components/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        <p className="mb-4 text-slate-600">
          Your privacy is important to us. This privacy policy explains how we collect, use, and protect your personal information when you visit our website.
        </p>
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Information We Collect</h2>
            <p className="text-slate-600">We may collect basic information such as your browser type, device information, and website usage data for analytics and performance improvements.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">How We Use Data</h2>
            <p className="text-slate-600">We use collected information to improve the website, personalize your experience, and monitor the performance of our services.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Third-Party Services</h2>
            <p className="text-slate-600">We may use third-party services such as analytics or ad providers. These services have their own privacy policies and data handling procedures.</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Contact</h2>
            <p className="text-slate-600">If you have questions about this Privacy Policy, please visit our <a href="/contact" className="text-blue-600 hover:underline">Contact page</a>.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
