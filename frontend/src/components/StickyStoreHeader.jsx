import { useEffect, useRef, useState } from 'react'
import Header from './Header'

export default function StickyStoreHeader() {
  const sentinelRef = useRef(null)
  const [pinned, setPinned] = useState(false)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => setPinned(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div ref={sentinelRef} className="h-px w-full shrink-0" aria-hidden />
      <div
        className={`sticky top-0 z-40 px-3 sm:px-4 md:px-6 transition-[box-shadow,background-color,border-radius,padding] duration-200 ease-out ${
          pinned
            ? 'pt-2 pb-2 sm:pt-2.5 sm:pb-2.5 md:pt-3 md:pb-3 bg-shell/98 backdrop-blur-lg border-b border-zinc-200 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.15)] rounded-none'
            : 'pt-3 sm:pt-4 pb-3 sm:pb-4 bg-shell/90 backdrop-blur-sm border-b border-zinc-200/60 rounded-t-[20px] sm:rounded-t-[30px]'
        }`}
      >
        <Header compact={pinned} />
      </div>
    </>
  )
}
