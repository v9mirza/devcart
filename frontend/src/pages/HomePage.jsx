
import Header from '../components/Header'
import BentoGrid from '../components/BentoGrid'
import CatalogSection from '../components/CatalogSection'
import ProductModal from '../components/ProductModal'
import CartDrawer from '../components/CartDrawer'
import WishlistDrawer from '../components/WishlistDrawer'
import { useCart } from '../context/CartContext'

export default function HomePage() {
  const { showCheckoutSuccess, setShowCheckoutSuccess } = useCart()

  return (
    <div className="w-full min-h-screen py-5 px-3 md:px-6 flex justify-center items-start">
      <div className="w-full max-w-[1280px] bg-shell rounded-[30px] border border-zinc-200 shadow-[0_18px_44px_-24px_rgba(20,24,36,0.12)] p-4 md:p-6 flex flex-col gap-7 relative overflow-hidden">
        <div className="relative z-10 flex flex-col gap-7">
          {/* Navigation / Header */}
          <Header />

          {/* Bento Grid */}
          <BentoGrid />

          <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { title: 'Fast shipping', text: 'Dispatch in 24h for most products.' },
              { title: 'Secure payments', text: 'Encrypted checkout and trusted gateways.' },
              { title: 'Easy returns', text: 'Simple return flow with quick support.' }
            ].map((item) => (
              <div
                key={item.title}
                className="bg-inset border border-zinc-200/80 rounded-[18px] p-4 shadow-sm"
              >
                <h3 className="text-sm font-extrabold text-slate-800">{item.title}</h3>
                <p className="text-xs text-stone-500 mt-1 font-medium">{item.text}</p>
              </div>
            ))}
          </section>

          {/* Catalog Grid */}
          <CatalogSection />

          {/* Footer */}
          <footer className="pt-5 border-t border-stone-200/60 text-center text-xs text-stone-400 font-medium">
            <p>&copy; {new Date().getFullYear()} DevCart Inc. All rights reserved.</p>
          </footer>

          {/* Modals, Cart & Wishlist Drawers */}
          <ProductModal />
          <CartDrawer />
          <WishlistDrawer />

      {/* CHECKOUT SUCCESS MODAL */}
      {showCheckoutSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setShowCheckoutSuccess(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
          />

          <div className="bg-surface rounded-[32px] w-full max-w-sm border border-stone-200/50 shadow-2xl relative overflow-hidden z-10 p-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Order Confirmed!</h2>
            <p className="text-xs text-stone-500 font-medium leading-relaxed mb-6">
              Thank you for shopping with DevCart. Your simulation order has been processed successfully.
            </p>
            <button
              onClick={() => setShowCheckoutSuccess(false)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-full cursor-pointer transition-transform hover:scale-[1.02]"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

        </div>
      </div>
    </div>
  )
}
