import { useCart } from '../context/CartContext'

export default function ProductModal() {
  const {
    activeProductDetail,
    setActiveProductDetail,
    getProductImage,
    addToCart,
    toggleWishlist,
    isProductInWishlist
  } = useCart()

  if (!activeProductDetail) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-5">
      {/* Overlay */}
      <div
        onClick={() => setActiveProductDetail(null)}
        className="absolute inset-0 bg-slate-950/28 transition-opacity duration-300"
      />

      {/* Modal Container */}
      <div className="bg-surface rounded-[24px] w-[min(720px,calc(100vw-1.25rem))] md:w-[min(740px,calc(100vw-2rem))] border border-stone-200/60 shadow-[0_18px_44px_-24px_rgba(15,23,42,0.34)] relative overflow-y-auto md:overflow-hidden z-10 flex flex-col md:flex-row max-h-[calc(100vh-1rem)] md:max-h-[min(460px,calc(100vh-2rem))]">
        {/* Left Column: Image Area */}
        <div className="md:w-[44%] bg-inset p-4 md:p-4.5 flex items-center justify-center border-b md:border-b-0 md:border-r border-zinc-200/60">
          <img 
            src={getProductImage(activeProductDetail)} 
            className="w-full max-w-[280px] max-h-44 md:max-h-[250px] object-contain filter drop-shadow-xl" 
            alt={activeProductDetail.name} 
          />
        </div>

        {/* Right Column: Info Area */}
        <div className="md:w-[56%] p-4 md:p-4.5 flex flex-col gap-2.5 min-h-0 overflow-hidden">
          <div className="flex-1 min-h-0 pr-1 overflow-hidden">
            <div className="flex justify-between items-start gap-4 mb-2">
              <div>
                <span className="text-[10px] font-extrabold text-slate-700 bg-white border border-stone-200 px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {activeProductDetail.categoryName || activeProductDetail.category}
                </span>
                <h2 className="text-[30px] md:text-[34px] font-black text-slate-900 mt-2 leading-[1.02] break-words line-clamp-2">
                  {activeProductDetail.name}
                </h2>
              </div>
              <span className="text-lg font-black text-slate-900">${activeProductDetail.price}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-stone-500 font-bold mb-3">
              <span className="text-yellow-500">★</span> 
              <span className="text-slate-800">{activeProductDetail.rating || 4.7}</span> 
              <span>({activeProductDetail.reviewsCount || 100} reviews)</span>
            </div>

            {/* Stock status */}
            {activeProductDetail.countInStock !== undefined && (
              <div className="mb-3">
                <span className={`inline-block text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                  activeProductDetail.countInStock === 0
                    ? 'bg-red-50 text-red-500 border border-red-100'
                    : activeProductDetail.countInStock <= 5
                    ? 'bg-amber-50 text-amber-600 border border-amber-100'
                    : 'bg-green-50 text-green-600 border border-green-100'
                }`}>
                  {activeProductDetail.countInStock === 0
                    ? '✕ Out of Stock'
                    : activeProductDetail.countInStock <= 5
                    ? `⚠ Only ${activeProductDetail.countInStock} left in stock`
                    : `✓ In Stock`}
                </span>
              </div>
            )}

            <p className="text-xs text-stone-500 leading-relaxed font-medium mb-3 line-clamp-2">
              {activeProductDetail.description}
            </p>

          </div>

          {/* Add to Cart Actions */}
          <div className="flex gap-2.5 items-center pt-1.5 bg-surface shrink-0">
            <button
              onClick={() => addToCart(
                activeProductDetail,
                1
              )}
              disabled={activeProductDetail.countInStock === 0}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-full text-center shadow-md cursor-pointer transition-transform duration-200 hover:scale-[1.02] active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 whitespace-nowrap"
            >
              {activeProductDetail.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            
            <button
              onClick={() => toggleWishlist(activeProductDetail)}
              className={`w-11 h-11 rounded-full border transition-all active:scale-95 hover:scale-105 cursor-pointer flex items-center justify-center ${
                isProductInWishlist(activeProductDetail._id || activeProductDetail.id)
                  ? 'bg-rose-50 border-rose-200 text-rose-500'
                  : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
              aria-label="Toggle wishlist"
            >
              <svg className="w-5 h-5" fill={isProductInWishlist(activeProductDetail._id || activeProductDetail.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            <button
              onClick={() => setActiveProductDetail(null)}
              className="px-4 py-3 border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 font-bold rounded-full cursor-pointer transition-colors whitespace-nowrap"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setActiveProductDetail(null)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          ×
        </button>
      </div>
    </div>
  )
}
