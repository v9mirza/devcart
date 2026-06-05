import { useEffect, useRef, useState } from 'react'
import Header from './Header'

export default function StickyStoreHeader() {
  const sentinelRef = useRef(null)
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div ref={sentinelRef} className="h-px w-full shrink-0" aria-hidden />
      <div
        data-stuck={stuck || undefined}
        className="group sticky top-0 z-50 rounded-t-[20px] sm:rounded-t-[30px] border-b border-zinc-200/60 bg-shell/95 backdrop-blur-xl transition-[box-shadow,background-color,border-color,border-radius] duration-200 motion-reduce:transition-none data-[stuck]:rounded-t-none data-[stuck]:border-zinc-200/90 data-[stuck]:bg-white/95 data-[stuck]:shadow-[0_4px_24px_-8px_rgba(15,23,42,0.12)]"
      >
        <div className="px-3 sm:px-4 md:px-6 py-3.5 sm:py-4 md:py-4 transition-[padding] duration-200 ease-out motion-reduce:transition-none group-data-[stuck]:py-2.5 group-data-[stuck]:sm:py-3 group-data-[stuck]:md:py-3">
          <div className="origin-top scale-100 transition-transform duration-200 ease-out motion-reduce:transition-none group-data-[stuck]:scale-[0.96] motion-reduce:group-data-[stuck]:scale-100">
            <Header />
          </div>
        </div>
      </div>
    </>
  )
}
