'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

const STORAGE_KEY = 'govtjobs_welcome_closed'

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setIsOpen(false)
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const seen = localStorage.getItem(STORAGE_KEY)
    if (!seen) setIsOpen(true)

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }

    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [mounted])

  useEffect(() => {
    if (isOpen && mounted) {
      closeBtnRef.current?.focus()
    }
  }, [isOpen, mounted])

  if (!mounted) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm px-4 py-6"
          onClick={handleClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-4xl bg-white p-6 shadow-2xl ring-1 ring-slate-200 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-title"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-slate-900">
                  <Image
                    src="/logo1.png"
                    alt="Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    Welcome to GovtJobs
                  </p>
                  <p
                    id="welcome-title"
                    className="text-lg font-bold text-slate-900"
                  >
                    Ready for What’s Next?
                  </p>
                </div>
              </div>

              <button
                ref={closeBtnRef}
                onClick={handleClose}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
                aria-label="Close popup"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="mt-6 space-y-5 text-slate-700">
              <p className="text-lg leading-8">
                Take the next step in your career or find the right talent—faster and smarter.
              </p>

              <ul className="space-y-3 text-sm leading-7 text-slate-600">
                <li className="flex gap-3">
                  <span>🎯</span>
                  <span>Discover jobs tailored to your skills and experience</span>
                </li>
                <li className="flex gap-3">
                  <span>🚀</span>
                  <span>Apply quickly with a simple, streamlined process</span>
                </li>
                <li className="flex gap-3">
                  <span>🔍</span>
                  <span>Explore verified and up-to-date opportunities</span>
                </li>
                <li className="flex gap-3">
                  <span>🤝</span>
                  <span>Connect with employers actively hiring</span>
                </li>
                <li className="flex gap-3">
                  <span>📈</span>
                  <span>Grow your career or build your perfect team with confidence</span>
                </li>
              </ul>
            </div>

            {/* Footer */}
            <div className="mt-8 text-right">
              <button
                onClick={handleClose}
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
              >
                Let’s get started
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}