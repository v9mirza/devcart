import { useCart, getProductId } from '../context/CartContext'
import DrawerShell from './DrawerShell'
import ProductImage from './ProductImage'

export default function WishlistDrawer() {
  const {
    wishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    toggleWishlist,
    clearWishlist,
    addToCart,
    getProductImage
  } = useCart()

  return (
    <DrawerShell open={isWishlistOpen} onClose={() => setIsWishlistOpen(false)}>
      <header className="shrink-0 px-6 py-5 border-b border-stone-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-rose-500" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h2 className="text-lg font-black text-slate-900">Your Wishlist</h2>
          <span className="text-xs bg-rose-50 text-rose-500 font-bold px-2 py-0.5 rounded-full border border-rose-100">
            {wishlist.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-xs font-bold text-stone-400 hover:text-red-500 bg-stone-100 hover:bg-red-50 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            ×
          </button>
        </div>
      </header>

      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 py-4 divide-y divide-stone-100">
        {wishlist.length > 0 ? (
          wishlist.map((product, idx) => (
            <div key={`${getProductId(product)}-${idx}`} className="py-4.5 flex gap-4 items-center">
              <div className="w-16 h-16 bg-surface border border-zinc-200/60 rounded-xl overflow-hidden flex items-center justify-center p-1.5 flex-shrink-0">
                <ProductImage
                  product={product}
                  getProductImage={getProductImage}
                  className="object-contain w-full h-full"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-extrabold text-sm text-slate-900 truncate leading-snug">
                  {product.name}
                </h4>
                <span className="block text-xs font-black text-slate-900 mt-1.5">${product.price}</span>
              </div>

              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => addToCart(product, 1)}
                  className="btn-secondary text-[10px] px-3.5 py-2"
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className="text-[10px] text-stone-400 hover:text-red-500 font-bold transition-colors cursor-pointer mr-1"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-empty-in">
            <span className="text-4xl mb-4">💖</span>
            <h4 className="text-sm font-bold text-slate-800">Your wishlist is empty</h4>
            <p className="text-xs text-stone-400 mt-1.5 max-w-[200px]">Save your favorite premium tech gear here for later shopping.</p>
          </div>
        )}
      </div>

      <footer className="shrink-0 px-6 py-5 bg-inset border-t border-zinc-200 safe-area-pb">
        <button
          type="button"
          onClick={() => setIsWishlistOpen(false)}
          className="w-full btn-primary py-3"
        >
          Continue Browsing
        </button>
      </footer>
    </DrawerShell>
  )
}
