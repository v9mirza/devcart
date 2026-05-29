import { useCart } from '../context/CartContext'
import ProductImage from './ProductImage'

function getDescription(product) {
  const text = product?.description?.trim()
  if (text) return text
  return 'Premium build quality, tuned for everyday use. Explore features, specs, and customer reviews in the full catalog listing.'
}

export default function ProductModal() {
  const {
    activeProductDetail,
    setActiveProductDetail,
    getProductImage,
    categoryIdToNameMap,
    addToCart,
    toggleWishlist,
    isProductInWishlist
  } = useCart()

  if (!activeProductDetail) return null

  const productId = activeProductDetail._id || activeProductDetail.id
  const categoryLabel =
    activeProductDetail.categoryName ||
    categoryIdToNameMap[activeProductDetail.category] ||
    (typeof activeProductDetail.category === 'string' &&
    !/^[a-f0-9]{24}$/i.test(activeProductDetail.category)
      ? activeProductDetail.category
      : 'Product')

  const description = getDescription(activeProductDetail)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
    >
      <div
        onClick={() => setActiveProductDetail(null)}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
      />

      <div className="relative z-10 bg-surface w-full sm:max-w-[720px] max-h-[min(92dvh,100%)] sm:max-h-[min(560px,calc(100dvh-2rem))] rounded-t-2xl sm:rounded-2xl border border-zinc-200 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.35)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-zinc-100 shrink-0">
          <span className="text-[10px] font-extrabold text-slate-600 bg-inset border border-zinc-200 px-2.5 py-1 rounded-md uppercase tracking-wider">
            {categoryLabel}
          </span>
          <button
            type="button"
            onClick={() => setActiveProductDetail(null)}
            className="w-9 h-9 rounded-full bg-inset hover:bg-surface-hover text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content — description lives here so it is never clipped by sticky footer */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
          <div className="flex flex-col md:flex-row md:items-start">
            <div className="md:w-[40%] bg-inset px-4 py-5 sm:py-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-zinc-200/80 shrink-0">
              <ProductImage
                product={activeProductDetail}
                getProductImage={getProductImage}
                className="w-full max-w-[220px] h-36 sm:h-44 md:h-48 object-contain drop-shadow-lg"
              />
            </div>

            <div className="md:w-[60%] px-4 py-4 sm:px-5 sm:py-5 space-y-3">
              <h2
                id="product-modal-title"
                className="text-xl sm:text-2xl font-black text-slate-900 leading-tight"
              >
                {activeProductDetail.name}
              </h2>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="text-xl font-black text-slate-900">${activeProductDetail.price}</span>
                <span className="flex items-center gap-1 text-xs text-stone-500 font-bold">
                  <span className="text-yellow-500">★</span>
                  <span className="text-slate-800">{activeProductDetail.rating || 4.7}</span>
                  <span>({activeProductDetail.reviewsCount || 100} reviews)</span>
                </span>
              </div>

              {activeProductDetail.countInStock !== undefined && (
                <span
                  className={`inline-flex w-fit text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                    activeProductDetail.countInStock === 0
                      ? 'bg-red-50 text-red-600 border border-red-100'
                      : activeProductDetail.countInStock <= 5
                      ? 'bg-amber-50 text-amber-700 border border-amber-100'
                      : 'bg-green-50 text-green-700 border border-green-100'
                  }`}
                >
                  {activeProductDetail.countInStock === 0
                    ? 'Out of Stock'
                    : activeProductDetail.countInStock <= 5
                    ? `Only ${activeProductDetail.countInStock} left`
                    : 'In Stock'}
                </span>
              )}

              <section className="pt-1 pb-2">
                <h3 className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider mb-1.5">
                  Description
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed font-medium">
                  {description}
                </p>
              </section>
            </div>
          </div>
        </div>

        {/* Sticky footer actions */}
        <div className="shrink-0 border-t border-zinc-100 bg-surface px-4 py-3 sm:px-5 sm:py-4 safe-area-pb">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => addToCart(activeProductDetail, 1)}
              disabled={activeProductDetail.countInStock === 0}
              className="flex-1 bg-slate-950 hover:bg-slate-800 text-white font-bold py-3 rounded-full text-center text-sm shadow-md transition-all active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {activeProductDetail.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>

            <button
              type="button"
              onClick={() => toggleWishlist(activeProductDetail)}
              className={`h-11 w-11 rounded-full border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                isProductInWishlist(productId)
                  ? 'bg-rose-50 border-rose-200 text-rose-500'
                  : 'bg-inset border-zinc-200 text-stone-600 hover:bg-surface-hover'
              }`}
              aria-label="Toggle wishlist"
            >
              <svg
                className="w-5 h-5"
                fill={isProductInWishlist(productId) ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
