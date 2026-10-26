import AdUnit from './AdUnit'

type Props = {
  slot?: string
  className?: string
}

/** Labeled ad block — required for AdSense policy clarity. */
export default function AdPlacement({ slot, className = '' }: Props) {
  const resolved = slot || undefined
  if (!resolved) {
    return null
  }

  return (
    <aside aria-label="Advertisement" className={`my-8 ${className}`}>
      <p className="mb-2 text-center text-xs font-medium uppercase tracking-wide text-slate-400">Advertisement</p>
      <AdUnit slot={resolved} />
    </aside>
  )
}
