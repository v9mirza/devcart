import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'

export default function AddToCartFly() {
  const { flyToCartSignal } = useCart()
  const [burst, setBurst] = useState(null)

  useEffect(() => {
    if (!flyToCartSignal) return

    const cartBtn = document.querySelector('[data-cart-target]')
    const cartRect = cartBtn?.getBoundingClientRect()
    const startX = window.innerWidth / 2
    const startY = window.innerHeight / 2
    const endX = cartRect ? cartRect.left + cartRect.width / 2 : window.innerWidth - 48
    const endY = cartRect ? cartRect.top + cartRect.height / 2 : 32

    setBurst({
      id: flyToCartSignal,
      left: startX,
      top: startY,
      dx: endX - startX,
      dy: endY - startY
    })

    const timer = setTimeout(() => setBurst(null), 560)
    return () => clearTimeout(timer)
  }, [flyToCartSignal])

  if (!burst) return null

  return (
    <div
      className="fixed z-[65] pointer-events-none animate-fly-to-cart"
      style={{
        left: burst.left,
        top: burst.top,
        ['--fly-dx']: `${burst.dx}px`,
        ['--fly-dy']: `${burst.dy}px`
      }}
      aria-hidden="true"
    >
      <span className="block w-3 h-3 rounded-full bg-accent shadow-md ring-2 ring-white" />
    </div>
  )
}
