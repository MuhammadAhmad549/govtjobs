'use client'

import { useEffect, useRef } from 'react'

type AdsWindow = Window & { adsbygoogle?: unknown[] }

export default function AdUnit({ slot, className = '' }: { slot: string; className?: string }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT
  const pushed = useRef(false)

  useEffect(() => {
    if (!client || !slot || pushed.current) {
      return
    }
    pushed.current = true
    try {
      const w = window as AdsWindow
      w.adsbygoogle = w.adsbygoogle || []
      w.adsbygoogle.push({})
    } catch {
      pushed.current = false
    }
  }, [client, slot])

  if (!client || !slot) {
    return null
  }

  return (
    <div className={`flex justify-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight: '120px', width: '100%', maxWidth: '728px' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
