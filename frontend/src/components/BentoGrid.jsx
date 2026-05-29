import { useMemo } from 'react'
import { useCart, getProductId } from '../context/CartContext'
import ProductImage from './ProductImage'

function pickDistinctPreviewProducts(productList, getProductImage, limit = 3) {
  const picked = []
  const seen = new Set()

  for (const product of productList) {
    const imageKey = String(getProductImage(product))
    if (seen.has(imageKey)) continue
    seen.add(imageKey)
    picked.push(product)
    if (picked.length >= limit) return picked
  }

  for (const product of productList) {
    if (picked.includes(product)) continue
    picked.push(product)
    if (picked.length >= limit) return picked
  }

  return picked
}

export default function BentoGrid() {
  const {
    loading,
    products,
    spotlightProduct,
    colorsMap,
    getProductImage,
    getProductColors,
    setActiveProductDetail,
    scrollToCatalog
  } = useCart()

  const spotlightSoundName = spotlightProduct?.name?.split(' ')[0] || 'Sequoia'
  const spotlightRating = Number(spotlightProduct?.rating || 4.8).toFixed(1)
  // Pick specific DB products so the UI matches the reference screenshot.
  const earbudCardProduct =
    products.find((p) => (p.name || '').toLowerCase().includes('x-bud')) ||
    products.find((p) => (p.name || '').toLowerCase().includes('earbud')) ||
    products[1]

  const surfaceHeadphoneProduct =
    products.find((p) => (p.name || '').toLowerCase().includes('surface')) ||
    products.find((p) => (p.name || '').toLowerCase().includes('light grey'))

  const vrFeaturedProduct =
    products.find((p) => (p.name || '').toLowerCase().includes('aura')) ||
    products.find((p) => (p.name || '').toLowerCase().includes('vr glass')) ||
    products.find((p) => (p.name || '').toLowerCase().includes('vr'))

  // Match the reference: the dark card uses the VR image, but the visible title/copy is the Surface headphone.
  const darkFeaturedImageProduct = vrFeaturedProduct || surfaceHeadphoneProduct
  const darkFeaturedTitleProduct = surfaceHeadphoneProduct || vrFeaturedProduct
  const darkFeaturedTagline = 'Boosted with bass'

  const editorsPick = useMemo(() => {
    const skip = new Set(
      [spotlightProduct, earbudCardProduct]
        .filter(Boolean)
        .map((p) => getProductId(p))
    )
    const candidate =
      surfaceHeadphoneProduct ||
      vrFeaturedProduct ||
      products.find((p) => {
        const id = getProductId(p)
        return id && !skip.has(id)
      })
    if (!candidate) return null
    return skip.has(getProductId(candidate)) ? null : candidate
  }, [products, spotlightProduct, earbudCardProduct, surfaceHeadphoneProduct, vrFeaturedProduct])

  const smallCardProducts = useMemo(() => {
    const pool = products.filter(
      (p) =>
        !((p.name || '').toLowerCase().includes('vr')) &&
        !String(p.category || '').toLowerCase().includes('vr')
    )
    const list = pool.length ? pool : products
    return pickDistinctPreviewProducts(list, getProductImage, 3)
  }, [products, getProductImage])

  const ProductThumb = ({ product, className, ...props }) => (
    <ProductImage
      product={product}
      getProductImage={getProductImage}
      className={className}
      alt={product?.name}
      {...props}
    />
  )

  const bentoProductCardShell =
    'flex flex-col bg-inset rounded-[22px] overflow-hidden border border-zinc-200/70 shadow-sm relative group hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-0.5 min-h-[200px]'

  const BentoProductCard = ({ title, onClick, onArrowClick, children, badge }) => (
    <div onClick={onClick} className={bentoProductCardShell}>
      <div className="p-4 flex justify-between items-start gap-2 relative z-10">
        <div className="min-w-0 flex-1">
          {badge}
          <h2 className="text-sm font-extrabold text-slate-900 leading-tight truncate">{title}</h2>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onArrowClick?.()
          }}
          className="w-7 h-7 bg-stone-100 group-hover:bg-slate-900 group-hover:text-white rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shrink-0"
          aria-label="Open"
        >
          <ArrowIcon />
        </button>
      </div>
      <div className="mx-3 mb-3 flex-1 min-h-[130px] rounded-[18px] bg-gradient-to-br from-stone-50 to-stone-100 border border-stone-100 overflow-hidden flex items-center justify-center">
        {children}
      </div>
    </div>
  )

  const ArrowIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  )

  const HeroSkeleton = () => (
    <div className="rounded-[20px] sm:rounded-[24px] overflow-hidden border border-zinc-200 bg-surface animate-pulse flex flex-col lg:flex-row lg:min-h-[400px]">
      <div className="px-4 pt-4 lg:order-2 lg:w-[48%] lg:p-6 flex items-center justify-center">
        <div className="w-full h-[180px] lg:aspect-square lg:max-h-[280px] bg-zinc-200/80 rounded-2xl" />
      </div>
      <div className="px-4 pb-4 pt-3 lg:p-8 flex-1 space-y-3">
        <div className="h-3 w-24 bg-zinc-200 rounded" />
        <div className="h-8 sm:h-12 w-4/5 bg-zinc-200 rounded-xl" />
        <div className="h-4 w-full bg-zinc-100 rounded" />
        <div className="h-10 w-full bg-zinc-100 rounded-xl" />
        <div className="h-10 w-full bg-zinc-200 rounded-full" />
      </div>
    </div>
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">

      {/* ══════════ LEFT BLOCK ══════════ */}
      <div className="flex flex-col gap-4">

        {/* ─── HERO ─── */}
        {loading ? (
          <HeroSkeleton />
        ) : (
          spotlightProduct && (
          <div className="rounded-[20px] sm:rounded-[24px] overflow-hidden relative flex flex-col lg:flex-row border border-zinc-200 bg-surface lg:min-h-[400px]">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div
                className="absolute -top-20 -left-10 w-80 h-80 rounded-full opacity-60"
                style={{ background: 'radial-gradient(circle, rgba(148,163,184,0.12) 0%, transparent 70%)' }}
              />
            </div>

            {/* Mobile: product image first, inside the same card (no split panel) */}
            <div className="relative z-10 order-1 lg:order-2 w-full lg:w-[48%] shrink-0 px-4 pt-4 pb-0 lg:p-0 lg:flex lg:items-center lg:justify-center lg:bg-inset/50 lg:border-l lg:border-zinc-200/80 lg:py-10 lg:px-6">
              <div className="relative w-full mx-auto max-w-[340px] lg:max-w-[380px]">
                <button
                  type="button"
                  onClick={() => setActiveProductDetail(spotlightProduct)}
                  className="w-full rounded-2xl border border-zinc-200/90 bg-inset lg:bg-surface p-3 sm:p-5 shadow-sm lg:shadow-[0_16px_40px_-20px_rgba(15,23,42,0.2)] cursor-pointer group"
                >
                  <ProductThumb
                    product={spotlightProduct}
                    className="w-full h-[min(42vw,180px)] sm:h-[220px] lg:aspect-square lg:h-auto lg:max-h-[280px] object-contain mx-auto transition-transform duration-500 group-hover:scale-[1.03]"
                    style={{ filter: 'drop-shadow(0 8px 20px rgba(15,23,42,0.1))' }}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveProductDetail(spotlightProduct)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-surface border border-zinc-200 shadow-sm flex items-center justify-center cursor-pointer hover:bg-surface-hover transition-colors"
                  aria-label="Open product"
                >
                  <ArrowIcon />
                </button>
              </div>
            </div>

            {/* Copy */}
            <div className="relative z-10 order-2 lg:order-1 flex flex-col gap-3 sm:gap-5 lg:gap-6 px-4 pb-4 pt-3 sm:p-7 lg:p-8 flex-1 min-w-0 lg:max-w-[52%] lg:justify-center">
              <div className="space-y-2 sm:space-y-3">
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                  Featured audio
                </span>

                <h1 className="text-xl sm:text-4xl lg:text-[2.75rem] font-black text-slate-900 tracking-tight leading-[1.15]">
                  {spotlightProduct.name}
                </h1>

                <p className="text-[13px] sm:text-[15px] text-stone-600 leading-relaxed max-w-lg">
                  {spotlightProduct.description ||
                    `Discover richer sound, better comfort, and modern design built for everyday listening with ${spotlightSoundName}.`}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5 px-3 rounded-xl sm:rounded-2xl bg-inset border border-zinc-200/80 w-full sm:w-fit">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-800">
                  <span className="text-amber-500">★</span> {spotlightRating}
                </span>
                <span className="w-px h-3.5 bg-zinc-300" aria-hidden />
                <span className="text-xs font-black text-slate-900">${spotlightProduct.price}</span>
                {spotlightProduct.countInStock !== undefined && (
                  <>
                    <span className="w-px h-3.5 bg-zinc-300" aria-hidden />
                    <span
                      className={`text-xs font-bold ${
                        spotlightProduct.countInStock === 0
                          ? 'text-red-600'
                          : spotlightProduct.countInStock <= 5
                          ? 'text-amber-700'
                          : 'text-emerald-700'
                      }`}
                    >
                      {spotlightProduct.countInStock === 0
                        ? 'Out of stock'
                        : spotlightProduct.countInStock <= 5
                        ? `${spotlightProduct.countInStock} left`
                        : 'In stock'}
                    </span>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:gap-3">
                <button
                  type="button"
                  onClick={() => setActiveProductDetail(spotlightProduct)}
                  className="col-span-2 sm:col-span-1 sm:flex-none justify-center btn-secondary text-sm px-4 py-2.5 sm:px-6 sm:py-3 inline-flex items-center justify-center gap-2"
                >
                  View Product
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                    <ArrowIcon />
                  </span>
                </button>
                <button
                  type="button"
                  onClick={scrollToCatalog}
                  className="col-span-2 sm:col-span-1 sm:flex-none justify-center bg-surface hover:bg-surface-hover text-slate-800 border border-zinc-200 text-sm font-bold px-4 py-2.5 sm:px-6 sm:py-3 rounded-full inline-flex items-center justify-center transition-all cursor-pointer"
                >
                  Shop Collection
                </button>
              </div>

              <p className="text-[10px] sm:text-[11px] text-stone-500 font-medium">
                Free shipping over $350 · 2-year warranty
              </p>
            </div>
          </div>
          )
        )}

        {/* ─── BOTTOM ROW (3 cards) ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-stretch">
          <BentoProductCard
            title="More products"
            onClick={scrollToCatalog}
            onArrowClick={scrollToCatalog}
          >
            <div className="flex items-center justify-center gap-2 w-full h-full p-3">
              {smallCardProducts.map((prod) => (
                <div
                  key={getProductId(prod)}
                  className="flex-1 max-w-[4.5rem] aspect-square rounded-xl bg-surface/80 border border-stone-200/60 flex items-center justify-center p-1.5"
                >
                  <ProductThumb product={prod} className="object-contain w-full h-full" />
                </div>
              ))}
            </div>
          </BentoProductCard>

          {editorsPick ? (
            <BentoProductCard
              title={editorsPick.name}
              badge={
                <span className="text-[10px] font-extrabold uppercase tracking-wide text-accent block mb-0.5">
                  Editor&apos;s choice
                </span>
              }
              onClick={() => setActiveProductDetail(editorsPick)}
              onArrowClick={() => setActiveProductDetail(editorsPick)}
            >
              <ProductThumb
                product={editorsPick}
                className="w-full max-h-[150px] object-contain transition-transform duration-500 group-hover:scale-105"
                style={{ filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.1))' }}
              />
            </BentoProductCard>
          ) : (
            <div className={`${bentoProductCardShell} animate-pulse`} />
          )}

          {earbudCardProduct ? (
            <BentoProductCard
              title={earbudCardProduct.name}
              badge={
                <span className="text-[10px] font-extrabold text-rose-500 inline-flex items-center gap-0.5 mb-0.5">
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Popular
                </span>
              }
              onClick={() => setActiveProductDetail(earbudCardProduct)}
              onArrowClick={() => setActiveProductDetail(earbudCardProduct)}
            >
              <ProductThumb
                product={earbudCardProduct}
                className="w-full max-h-[150px] object-contain transition-transform duration-500 group-hover:scale-105"
                style={{ filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.1))' }}
              />
            </BentoProductCard>
          ) : (
            <div className={`${bentoProductCardShell} animate-pulse`} />
          )}
        </div>
      </div>

      {/* ══════════ RIGHT COLUMN ══════════ */}
      <div className="grid grid-cols-2 lg:flex lg:flex-col gap-3 sm:gap-4 lg:pt-1">

        {/* Popular Colors */}
        {spotlightProduct && (
          <div className="bg-inset rounded-[18px] sm:rounded-[22px] p-4 sm:p-5 border border-zinc-200/80 shadow-sm col-span-2 lg:col-span-1">
            <h3 className="text-sm font-extrabold text-slate-800 mb-3">Popular Colors</h3>
            <div className="flex gap-2.5 flex-wrap">
              {getProductColors(spotlightProduct).map((c) => (
                <span
                  key={c}
                  className={`w-8 h-8 rounded-full ${colorsMap[c]} border border-white/80 opacity-90`}
                  aria-label={c}
                />
              ))}
            </div>
          </div>
        )}

        {/* Earbuds card (New Gen X-Bud) */}
        {earbudCardProduct && (
          <div className="hidden lg:block">
            <BentoProductCard
              title={earbudCardProduct.name}
              onClick={() => setActiveProductDetail(earbudCardProduct)}
              onArrowClick={() => setActiveProductDetail(earbudCardProduct)}
            >
              <ProductThumb
                product={earbudCardProduct}
                className="w-full max-h-[150px] object-contain transition-transform duration-500 group-hover:scale-105"
                style={{ filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.1))' }}
              />
            </BentoProductCard>
          </div>
        )}

        {/* Featured VR / surface card — full-bleed image like reference */}
        {darkFeaturedImageProduct && darkFeaturedTitleProduct && (
          <div
            onClick={() => setActiveProductDetail(darkFeaturedTitleProduct)}
            className="col-span-2 lg:col-span-1 rounded-[18px] sm:rounded-[22px] overflow-hidden border border-zinc-200/60 shadow-sm relative group hover:shadow-lg transition-all duration-300 cursor-pointer min-h-[200px] sm:min-h-[240px] lg:min-h-[280px] lg:flex-1"
          >
            <ProductThumb
              product={darkFeaturedImageProduct}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />

            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={(e) => { e.stopPropagation(); setActiveProductDetail(darkFeaturedTitleProduct) }}
                className="w-7 h-7 bg-white/15 backdrop-blur-sm group-hover:bg-white/25 text-white rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer"
                aria-label="Open product"
              >
                <ArrowIcon />
              </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
              <h2 className="text-sm font-extrabold text-white leading-snug">
                {darkFeaturedTitleProduct.name}
              </h2>
              <p className="text-[10px] text-stone-300 font-semibold mt-0.5">{darkFeaturedTagline}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
