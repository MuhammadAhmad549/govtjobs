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
            <p className="text-slate-600">
              Visiting the site may generate standard technical information such as browser and device details, IP address,
              and pages requested in server logs. We use information necessary to operate, protect, and improve the site.
              You do not need to create an account to browse public job listings.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">How We Use Data</h2>
            <p className="text-slate-600">
              Technical information may be used to deliver pages, diagnose errors, prevent abuse, and understand site
              performance. We do not ask visitors to submit application documents or job application details; applications
              are handled by the relevant official recruitment portal.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Third-Party Services</h2>
            <p className="text-slate-600">
              Links to government recruitment portals and services provided by third parties are governed by those providers&apos;
              own privacy notices and terms. We do not control their websites or data practices.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Advertising (Google AdSense)</h2>
            <p className="text-slate-600">
              This site may display advertisements provided by Google AdSense. Google and its partners may use cookies or similar
              technologies to store or access information on your device and to serve, measure, and personalize ads, subject to
              your location, consent choices, and applicable settings. Learn how Google uses data when you use partner sites in{' '}
              <a href="https://policies.google.com/technologies/ads" className="text-blue-600 hover:underline" rel="noopener noreferrer" target="_blank">
                Google&apos;s advertising information
              </a>
              . You can review or change ad-personalization settings in{' '}
              <a href="https://adssettings.google.com" className="text-blue-600 hover:underline" rel="noopener noreferrer" target="_blank">
                Google Ads Settings
              </a>
              . You can also learn about Google&apos;s data practices in its{' '}
              <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline" rel="noopener noreferrer" target="_blank">
                Privacy Policy
              </a>
              .
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Cookies</h2>
            <p className="text-slate-600">
              Cookies and similar technologies may be used for essential site functions and by advertising providers as described
              above. You can manage cookies through your browser settings. Blocking cookies may affect some site or advertising
              features. Consent requirements for advertising vary by location; publishers must configure an appropriate consent
              mechanism where applicable before serving personalized ads.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Your choices and policy updates</h2>
            <p className="text-slate-600">
              You can manage browser cookies and Google ad-personalization settings using the links above. This policy may be
              updated when site features or legal requirements change. For questions about privacy, contact us through the{' '}
              <a href="/contact" className="text-blue-600 hover:underline">Contact page</a>.
            </p>
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
