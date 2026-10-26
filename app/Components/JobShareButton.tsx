'use client'

import { useState } from 'react'

export default function JobShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title, url })
        return
      }
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      try {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2000)
      } catch {
        // ignore
      }
    }
  }

  return (
    <button
      type="button"
      onClick={() => void share()}
      className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
    >
      {copied ? 'Link copied' : 'Share job'}
    </button>
  )
}
