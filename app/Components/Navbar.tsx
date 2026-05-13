


'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const NAV_ITEMS = [
  { name: 'Home', icon: '', href: '/' },
  { name: 'Jobs', icon: '', href: '/jobs' },
  { name: 'About-Us', icon: '', href: '/about' },
  { name: 'Privacy Policy', icon: '', href: '/privacy' },
  { name: 'Terms', icon: '', href: '/terms' },
  { name: 'Contact-Us', icon: '', href: '/contact' }
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  const toggleMenu = useCallback(() => setOpen(prev => !prev), [])
  const closeMenu = useCallback(() => setOpen(false), [])

  // Close on outside click
  useEffect(() => {
    if (!open) return
  
    function handleClickOutside(e: PointerEvent) {
      const target = e.target as Node
  
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(target) &&
        !buttonRef.current.contains(target)
      ) {
        setOpen(false)
      }
    }
  
    document.addEventListener('pointerdown', handleClickOutside)
  
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside)
    }
  }, [open])

  // ✅ FIX #3 — Escape key closes menu
  useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-md border-b border-gray-200'
          : 'bg-white/70 backdrop-blur-lg border-b border-gray-100'
      }`}
    >
      <nav className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center group" aria-label="Home">
            <Image
              src="/logo1.png"
              alt="GovtJobs Logo"
              width={140}
              height={40}
              priority
              className="object-contain h-10 w-auto transition-all duration-500
                group-hover:scale-105 group-hover:brightness-110 drop-shadow-sm"
            />
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-8 font-medium">
            {NAV_ITEMS.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="relative group text-gray-700 hover:text-blue-600 transition-all duration-300"
                >
                  <span className="flex items-center gap-1">
                    <span>{item.icon}</span>
                    {item.name}
                  </span>
                  <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-blue-500
                    transition-all duration-300 group-hover:w-full rounded-full" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Toggle */}
          <button
  type="button"
  ref={buttonRef}
  onClick={toggleMenu}
  aria-expanded={open}
  aria-controls="mobile-menu"
  aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
  className="md:hidden inline-flex items-center justify-center rounded-lg p-2
    text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2
    focus:ring-blue-400/40 transition-all duration-300"
>
            <svg className="h-6 w-6 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        <div
  id="mobile-menu"
  ref={menuRef}
  className={`md:hidden fixed inset-x-0 top-full z-[60] overflow-hidden bg-white shadow-xl transition-all duration-300 ease-in-out ${
    open
      ? 'max-h-[calc(100vh-4rem)] opacity-100 pointer-events-auto'
      : 'max-h-0 opacity-0 pointer-events-none'
  }`}
  aria-hidden={!open}
>
          <div className="overflow-hidden">
            <ul className="flex flex-col gap-2 py-4 px-4 text-gray-700 font-medium border-t border-gray-200">
              {NAV_ITEMS.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="flex items-center gap-2 rounded-xl px-4 py-3 text-base font-medium
                      hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </nav>
    </header>
  )
}