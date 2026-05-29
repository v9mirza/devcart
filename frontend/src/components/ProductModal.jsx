import { useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'
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

  const open = Boolean(activeProductDetail)
  useLockBodyScroll(open)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setActiveProductDetail(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, setActiveProductDetail])

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
  const inWishlist = isProductInWishlist(productId)
  const outOfStock = activeProductDetail.countInStock === 0
  const lowStock =
    activeProductDetail.countInStock !== undefined &&
    activeProductDetail.countInStock > 0 &&
    activeProductDetail.countInStock <= 5

  const stockBadge =
    activeProductDetail.countInStock !== undefined ? (
      <span
        className={`inline-flex w-fit text-[11px] font-bold px-2.5 py-1 rounded-full ${
          outOfStock
            ? 'bg-red-50 text-red-600 ring-1 ring-red-100'
            : lowStock
            ? 'bg-amber-50 text-amber-800 ring-1 ring-amber-100'
            : 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100'
        }`}
      >
        {outOfStock
          ? 'Out of stock'
          : lowStock
          ? `Only ${activeProductDetail.countInStock} left`
          : 'In stock'}
      </span>
    ) : null

  return (
    <div
      className="fixed inset-0 z-[52] flex items-center justify-center p-3 sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
    >
      <div
        onClick={() => setActiveProductDetail(null)}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-[3px] animate-drawer-backdrop"
        aria-hidden="true"
      />

      <div className="relative z-10 bg-surface w-full max-w-[760px] max-h-[min(90dvh,720px)] rounded-[20px] sm:rounded-[24px] border border-zinc-200/90 shadow-[0_28px_70px_-24px_rgba(15,23,42,0.4)] flex flex-col overflow-hidden animate-modal-in">
        <button
          type="button"
          onClick={() => setActiveProductDetail(null)}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-surface/95 border border-zinc-200 text-slate-600 flex items-center justify-center shadow-sm hover:bg-inset transition-colors cursor-pointer"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Mobile: details first, compact image */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain md:hidden">
          <div className="px-5 pt-5 pb-4 flex flex-col gap-3 pr-12">
            <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-[0.14em]">
              {categoryLabel}
            </p>
            <h2
              id="product-modal-title"
              className="text-xl font-black text-slate-900 leading-tight tracking-tight"
            >
              {activeProductDetail.name}
            </h2>
            <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
              <span className="text-2xl font-black text-slate-900 leading-none">
                ${activeProductDetail.price}
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-stone-500">
                <span className="text-amber-500 text-sm">★</span>
                <span className="text-slate-800 font-bold">{activeProductDetail.rating || 4.7}</span>
                <span className="text-stone-400">
                  ({activeProductDetail.reviewsCount || 100} reviews)
                </span>
              </span>
            </div>
            {stockBadge}
          </div>

          <div className="px-5 pb-4 flex justify-center bg-inset/60 border-y border-zinc-200/60">
            <div className="w-full max-w-[200px] rounded-xl bg-surface border border-zinc-200/80 p-3">
              <ProductImage
                product={activeProductDetail}
                getProductImage={getProductImage}
                className="w-full h-32 object-contain mx-auto"
              />
            </div>
          </div>

          <div className="px-5 pb-4">
            <section className="rounded-xl bg-inset/80 border border-zinc-200/70 p-3.5">
              <h3 className="text-[10px] font-extrabold text-stone-400 uppercase tracking-[0.12em] mb-2">
                Description
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed font-medium break-words">
                {description}
              </p>
            </section>
          </div>
        </div>

        {/* Desktop: side-by-side, fits in viewport */}
        <div className="hidden md:flex flex-1 min-h-0 overflow-hidden">
          <div className="w-[42%] shrink-0 flex items-center justify-center bg-inset/80 px-6 py-6 border-r border-zinc-200/70">
            <div className="w-full rounded-2xl bg-surface border border-zinc-200/80 p-4 shadow-sm">
              <ProductImage
                product={activeProductDetail}
                getProductImage={getProductImage}
                className="w-full h-[200px] object-contain mx-auto"
              />
            </div>
          </div>

          <div className="flex-1 min-w-0 min-h-0 flex flex-col">
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 py-6 pr-14 flex flex-col gap-4">
              <div className="space-y-2">
                <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-[0.14em]">
                  {categoryLabel}
                </p>
                <h2 className="text-[1.65rem] font-black text-slate-900 leading-tight tracking-tight">
                  {activeProductDetail.name}
                </h2>
              </div>

              <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
                <span className="text-[1.75rem] font-black text-slate-900 leading-none">
                  ${activeProductDetail.price}
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-stone-500 pb-0.5">
                  <span className="text-amber-500 text-sm">★</span>
                  <span className="text-slate-800 font-bold">{activeProductDetail.rating || 4.7}</span>
                  <span className="text-stone-400">
                    ({activeProductDetail.reviewsCount || 100} reviews)
                  </span>
                </span>
              </div>

              {stockBadge}

              <section className="rounded-xl bg-inset/80 border border-zinc-200/70 p-4 min-w-0">
                <h3 className="text-[10px] font-extrabold text-stone-400 uppercase tracking-[0.12em] mb-2">
                  Description
                </h3>
                <p className="text-sm text-stone-600 leading-[1.65] font-medium break-words">
                  {description}
                </p>
              </section>
            </div>
          </div>
        </div>

        <div className="shrink-0 border-t border-zinc-100 bg-surface px-4 py-3.5 sm:px-6 sm:py-4 safe-area-pb">
          <div className="flex items-stretch gap-3 md:max-w-none">
            <button
              type="button"
              onClick={() => addToCart(activeProductDetail, 1)}
              disabled={outOfStock}
              className="flex-1 min-h-[46px] bg-accent hover:bg-accent-hover text-accent-foreground font-bold text-sm sm:text-[15px] rounded-full shadow-md shadow-teal-900/10 transition-all active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {outOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>

            <button
              type="button"
              onClick={() => toggleWishlist(activeProductDetail)}
              className={`min-h-[46px] min-w-[46px] rounded-full border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                inWishlist
                  ? 'bg-rose-50 border-rose-200 text-rose-500 shadow-sm'
                  : 'bg-inset border-zinc-200 text-stone-500 hover:bg-surface-hover hover:text-rose-500 hover:border-rose-200'
              }`}
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <svg
                className="w-5 h-5"
                fill={inWishlist ? 'currentColor' : 'none'}
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
