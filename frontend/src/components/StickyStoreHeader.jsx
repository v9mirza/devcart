import { useEffect, useRef, useState } from 'react'
import Header from './Header'

export default function StickyStoreHeader() {
  const sentinelRef = useRef(null)
  const headerRef = useRef(null)
  const [pinned, setPinned] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(0)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => setPinned(!entry.isIntersecting),
      { threshold: 0, rootMargin: '1px 0px 0px 0px' }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const node = headerRef.current
    if (!node) return

    const measure = () => setHeaderHeight(node.offsetHeight)
    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [pinned])

  return (
    <>
      <div ref={sentinelRef} className="h-px w-full shrink-0" aria-hidden />
      {pinned && <div className="w-full shrink-0" style={{ height: headerHeight }} aria-hidden />}

      <div
        ref={headerRef}
        className={
          pinned
            ? 'fixed top-0 inset-x-0 z-50 border-b border-zinc-200/90 bg-white/95 backdrop-blur-xl shadow-[0_4px_24px_-8px_rgba(15,23,42,0.12)]'
            : 'relative z-40 rounded-t-[20px] sm:rounded-t-[30px] border-b border-zinc-200/60 bg-shell'
        }
      >
        <div
          className={`mx-auto w-full max-w-[1280px] px-3 sm:px-4 md:px-6 transition-[padding] duration-200 ${
            pinned ? 'py-2 sm:py-2.5' : 'py-3 sm:py-4'
          }`}
        >
          <Header compact={pinned} />
        </div>
      </div>
    </>
  )
}
