import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function CartToast() {
  const { cartToast, setCartToast, setIsCartOpen, setActiveProductDetail } = useCart()
  const navigate = useNavigate()

  if (!cartToast) return null

  const isAuth = cartToast.type === 'auth'

  return (
    <div
      className="fixed top-6 left-1/2 z-[70] w-[min(100%-2rem,22rem)] animate-toast-in"
      role="status"
      aria-live="polite"
    >
      <div
        className={`flex items-center gap-3 text-white rounded-2xl px-4 py-3 shadow-xl border ${
          isAuth
            ? 'bg-slate-900 border-amber-500/30'
            : 'bg-slate-900 border-slate-800/80'
        }`}
      >
        <span
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
            isAuth ? 'bg-amber-500/20 text-amber-300' : 'bg-accent'
          }`}
        >
          {isAuth ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </span>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-bold leading-tight">{cartToast.message}</p>
          {cartToast.name && (
            <p className="text-[11px] text-slate-300 font-medium truncate mt-0.5">{cartToast.name}</p>
          )}
        </div>
        {isAuth ? (
          <button
            type="button"
            onClick={() => {
              setCartToast(null)
              setActiveProductDetail(null)
              navigate('/login')
            }}
            className="text-[11px] font-bold text-amber-300 hover:text-amber-200 shrink-0 cursor-pointer"
          >
            Sign in
          </button>
        ) : (
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
        )}
      </div>
    </div>
  )
}
