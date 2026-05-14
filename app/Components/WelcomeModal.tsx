'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  const handleClose = () => {
    setIsOpen(false)
  }

  // Open modal every reload
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 700)

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleEsc)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', handleEsc)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      closeBtnRef.current?.focus()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="welcome-backdrop"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/80 backdrop-blur-md px-3 py-4 sm:px-6 sm:py-8"
          onClick={handleClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          {/* Background Glow */}
          <div className="absolute top-[-120px] left-[-120px] h-60 w-60 sm:h-80 sm:w-80 rounded-full bg-blue-500/20 blur-3xl animate-pulse"></div>

          <div className="absolute bottom-[-120px] right-[-120px] h-60 w-60 sm:h-80 sm:w-80 rounded-full bg-cyan-400/20 blur-3xl animate-pulse"></div>

          {/* Modal */}
          <motion.div
            key="welcome-panel"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl overflow-hidden rounded-[24px] sm:rounded-[32px] bg-white shadow-[0_25px_80px_rgba(0,0,0,0.35)] ring-1 ring-white/20"
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-title"
            initial={{ opacity: 0, scale: 0.88, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{
              type: 'spring',
              stiffness: 120,
              damping: 18,
            }}
          >
            {/* Top Gradient */}
            <div className="absolute inset-x-0 top-0 h-24 sm:h-32 bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-indigo-600/20 blur-2xl"></div>

            <div className="relative p-4 sm:p-8">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-5 sm:gap-4 sm:pb-6">
                <div className="flex flex-1 items-start gap-3 sm:items-center sm:gap-5">
                  
                  {/* Logo */}
                  <motion.div
                    initial={{ scale: 0.8, rotate: -8 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 180,
                      damping: 30,
                    }}
                    className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-indigo-600 p-1 shadow-[0_10px_40px_rgba(37,99,235,0.45)] sm:h-24 sm:w-24 sm:rounded-3xl"
                  >
                    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[16px] bg-white sm:rounded-[22px]">
                      <Image
                        src="/logo1.png"
                        alt="GovtJobs Logo"
                        width={100}
                        height={100}
                        priority
                        className="object-contain"
                      />
                    </div>

                    <div className="absolute inset-0 rounded-2xl border border-white/20 sm:rounded-3xl"></div>
                  </motion.div>

                  {/* Text */}
                  <div className="min-w-0">
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 sm:text-xs sm:tracking-[0.3em]"
                    >
                      Welcome to GovtJobs
                    </motion.p>

                    <motion.h2
                      id="welcome-title"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mt-1 text-xl font-black leading-tight tracking-tight text-slate-900 sm:mt-2 sm:text-4xl"
                    >
                      Ready for What’s Next?
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-1 text-xs text-slate-500 sm:mt-2 sm:text-sm"
                    >
                      Your future opportunities start here.
                    </motion.p>
                  </div>
                </div>

                {/* Close */}
                <motion.button
                  ref={closeBtnRef}
                  onClick={handleClose}
                  whileHover={{ scale: 1.08, rotate: 90 }}
                  whileTap={{ scale: 0.92 }}
                  className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-sm text-slate-500 shadow-sm transition hover:bg-slate-100 hover:text-slate-900 sm:h-11 sm:w-11 sm:rounded-2xl"
                  aria-label="Close popup"
                >
                  ✕
                </motion.button>
              </div>

              {/* Body */}
              <motion.div
                className="mt-6 space-y-5 sm:mt-8 sm:space-y-6"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.08,
                    },
                  },
                }}
              >
                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="text-sm leading-7 text-slate-700 sm:text-lg sm:leading-8"
                >
                  Take the next step in your career or find the right talent —
                  faster, smarter, and more confidently.
                </motion.p>

                {/* Features */}
                <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                  {[
                    'Discover jobs tailored to your skills',
                    'Apply quickly with a streamlined process',
                    'Explore verified opportunities',
                    'Connect with active employers',
                    'Build your perfect team confidently',
                    'Stay updated with latest openings',
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      whileHover={{
                        y: -3,
                        scale: 1.02,
                      }}
                      className="group flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 transition hover:border-blue-300 hover:bg-blue-50 sm:p-4"
                    >
                      <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 shadow-md"></div>

                      <span className="text-xs font-medium leading-6 text-slate-700 group-hover:text-slate-900 sm:text-sm">
                        {item}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:items-center sm:justify-between"
              >
                <p className="text-center text-xs text-slate-500 sm:text-left sm:text-sm">
                  Trusted platform for career growth 🚀
                </p>

                <motion.button
                  onClick={handleClose}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: '0px 12px 30px rgba(15,23,42,0.25)',
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex w-full cursor-pointer items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
                >
                  Let’s Get Started
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}