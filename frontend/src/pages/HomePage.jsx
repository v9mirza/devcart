
import Header from '../components/Header'
import BentoGrid from '../components/BentoGrid'
import CatalogSection from '../components/CatalogSection'
import ProductModal from '../components/ProductModal'
import CartDrawer from '../components/CartDrawer'
import { useCart } from '../context/CartContext'

export default function HomePage() {
  const { showCheckoutSuccess, setShowCheckoutSuccess } = useCart()

  return (
    <div className="w-full max-w-7xl bg-[#f5f6f2] rounded-[40px] border border-stone-200/50 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.12)] p-6 md:p-8 flex flex-col gap-8 relative">
      
      {/* Navigation / Header */}
      <Header />

      {/* Bento Grid */}
      <BentoGrid />

      {/* Catalog Grid */}
      <CatalogSection />

      {/* Footer */}
      <footer className="py-6 border-t border-stone-200/50 text-center text-xs text-stone-400 font-medium">
        <p>&copy; {new Date().getFullYear()} DevCart Inc. All rights reserved.</p>
      </footer>

      {/* Modals & Cart Drawer */}
      <ProductModal />
      <CartDrawer />

      {/* CHECKOUT SUCCESS MODAL */}
      {showCheckoutSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setShowCheckoutSuccess(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
          />

          <div className="bg-[#fcfcf9] rounded-[32px] w-full max-w-sm border border-stone-200/50 shadow-2xl relative overflow-hidden z-10 p-8 flex flex-col items-center text-center">
            <span className="text-5xl mb-4 animate-bounce">🎉</span>
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
  )
}
