import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Header from './Header'

const SIZE_TRANSITION = 'transition-[width,height,padding,gap,box-shadow,background-color,border-color] duration-200 ease-out'

export default function StickyStoreHeader() {
  const sentinelRef = useRef(null)
  const headerRef = useRef(null)
  const pinnedRef = useRef(false)
  const [pinned, setPinned] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(0)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const update = () => {
      const top = sentinel.getBoundingClientRect().top
      const next = pinnedRef.current
        ? top > -2
          ? false
          : true
        : top < -6
          ? true
          : false

      if (next !== pinnedRef.current) {
        pinnedRef.current = next
        setPinned(next)
      }
    }

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  useLayoutEffect(() => {
    const node = headerRef.current
    if (!node) return

    const measure = () => {
      const next = node.offsetHeight
      setHeaderHeight((prev) => (prev === next ? prev : next))
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [pinned])

  return (
    <>
      <div ref={sentinelRef} className="h-px w-full shrink-0" aria-hidden />

      <div
        className="w-full shrink-0"
        style={{ height: pinned ? headerHeight : 0 }}
        aria-hidden
      />

      <div
        ref={headerRef}
        className={`w-full ${SIZE_TRANSITION} motion-reduce:transition-none ${
          pinned
            ? 'fixed top-0 left-0 right-0 z-50 border-b border-zinc-200/90 bg-white/95 backdrop-blur-xl shadow-[0_4px_24px_-8px_rgba(15,23,42,0.12)]'
            : 'relative z-40 rounded-t-[20px] sm:rounded-t-[30px] border-b border-zinc-200/60 bg-shell'
        }`}
      >
        <div
          className={`mx-auto w-full max-w-[1280px] px-3 sm:px-4 md:px-6 ${SIZE_TRANSITION} motion-reduce:transition-none ${
            pinned ? 'py-2.5 sm:py-2.5 md:py-2' : 'py-3.5 sm:py-4 md:py-4'
          }`}
        >
          <Header compact={pinned} />
        </div>
      </div>
    </>
  )
}
