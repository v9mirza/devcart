import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function CheckoutSuccessModal() {
  const {
    showCheckoutSuccess,
    setShowCheckoutSuccess,
    checkoutSuccessMode,
    lastOrderId
  } = useCart()

  if (!showCheckoutSuccess) return null

  const isDemo = checkoutSuccessMode === 'demo'

  const close = () => setShowCheckoutSuccess(false)

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        onClick={close}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs animate-drawer-backdrop"
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-success-title"
        className="bg-surface rounded-[28px] w-full max-w-sm border border-zinc-200 shadow-2xl relative z-10 animate-modal-in overflow-hidden"
      >
        <div className="px-6 pt-8 pb-6 sm:px-8 flex flex-col items-center text-center">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center border shrink-0 ${
              isDemo
                ? 'bg-amber-50 border-amber-100'
                : 'bg-emerald-50 border-emerald-100'
            }`}
          >
            {isDemo ? (
              <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            ) : (
              <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>

          <h2 id="checkout-success-title" className="text-2xl font-black text-slate-900 mt-5 mb-2">
            {isDemo ? 'Demo complete' : 'Order confirmed!'}
          </h2>

          <p className="text-sm text-stone-500 font-medium leading-relaxed max-w-[260px]">
            {isDemo
              ? 'This was a demo checkout only — nothing was saved to the server.'
              : 'Thank you for shopping with DevCart. Your order has been placed successfully.'}
          </p>

          {!isDemo && lastOrderId && (
            <p className="text-xs font-bold text-accent mt-3">
              Order ID: {String(lastOrderId).slice(-8).toUpperCase()}
            </p>
          )}
        </div>

        <div className="px-6 pb-8 pt-5 sm:px-8 border-t border-zinc-100 bg-inset/40 flex flex-col gap-2.5">
          <button type="button" onClick={close} className="w-full btn-primary py-3">
            Continue shopping
          </button>
          {!isDemo && (
            <Link
              to="/profile"
              onClick={close}
              className="w-full text-sm font-bold text-accent hover:text-accent-hover py-2 text-center"
            >
              View order history
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
