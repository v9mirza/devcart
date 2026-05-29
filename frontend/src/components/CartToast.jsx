import { useCart } from '../context/CartContext'

export default function CartToast() {
  const { cartToast, setCartToast, setIsCartOpen } = useCart()

  if (!cartToast) return null

  return (
    <div
      className="fixed bottom-6 left-1/2 z-[70] w-[min(100%-2rem,22rem)] animate-toast-in"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 bg-slate-900 text-white rounded-2xl px-4 py-3 shadow-xl border border-slate-800/80">
        <span className="w-9 h-9 rounded-full bg-accent flex items-center justify-center shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-bold leading-tight">{cartToast.message}</p>
          {cartToast.name && (
            <p className="text-[11px] text-slate-300 font-medium truncate mt-0.5">{cartToast.name}</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            setCartToast(null)
            setIsCartOpen(true)
          }}
          className="text-[11px] font-bold text-teal-300 hover:text-teal-200 shrink-0 cursor-pointer"
        >
          View cart
        </button>
      </div>
    </div>
  )
}
