import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-blue-400">Government Jobs Pakistan</h3>
            <p className="text-gray-300 text-sm">
              Your trusted platform for finding government job opportunities across Pakistan.
              Connecting talented individuals with meaningful careers in public service.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-300 hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link href="/jobs" className="text-gray-300 hover:text-blue-400 transition-colors">All Jobs</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="/privacy" className="text-gray-300 hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-300 hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-blue-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Government Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.pakistan.gov.pk" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 transition-colors">Pakistan Government</a></li>
              <li><a href="https://www.fpsc.gov.pk" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 transition-colors">FPSC</a></li>
              <li><a href="https://www.njp.gov.pk/jobs/live" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 transition-colors">NJP</a></li>
              <li><a href="https://www.pmdc.org.pk" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 transition-colors">PMDC</a></li>
              <li><a href="https://www.hec.gov.pk" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 transition-colors">HEC</a></li>
              <li><a href="https://www.fbr.gov.pk" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 transition-colors">FBR</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <p className="text-sm text-gray-300">Islamabad, Pakistan</p>
            <p className="text-sm text-gray-300">+92 51 123 4567</p>
            <p className="text-sm text-gray-300">info@govjobs.pk</p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} Government Jobs Pakistan. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/about" className="text-gray-400 hover:text-blue-400 transition-colors">About</Link>
              <Link href="/jobs" className="text-gray-400 hover:text-blue-400 transition-colors">Jobs</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
