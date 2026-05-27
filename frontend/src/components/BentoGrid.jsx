import { useCart, getProductId } from '../context/CartContext'
import blueHeadphones from '../assets/blue_headphones.png'

const EARBUD_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1636093973985-4fe333d36de9?auto=format&fit=crop&q=80&w=900'

export default function BentoGrid() {
  const {
    loading,
    products,
    spotlightProduct,
    spotlightColor,
    setSpotlightColor,
    colorsMap,
    getProductImage,
    getProductColors,
    setActiveProductDetail,
    scrollToCatalog
  } = useCart()

  const spotlightSoundName = spotlightProduct?.name?.split(' ')[0] || 'Sequoia'
  const spotlightRating = Number(spotlightProduct?.rating || 4.8).toFixed(1)
  const spotlightColors = spotlightProduct ? getProductColors(spotlightProduct) : []

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

  const previewProducts = products
    .filter(
      (p) =>
        !((p.name || '').toLowerCase().includes('vr')) &&
        !String(p.category || '')
          .toLowerCase()
          .includes('vr')
    )
    .slice(0, 3)

  const smallCardProducts = previewProducts.length ? previewProducts : products.slice(0, 3)

  const productImg = (product) => getProductImage(product) || EARBUD_FALLBACK_IMAGE

  const ArrowIcon = () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  )

  const HeroSkeleton = () => (
    <div
      className="rounded-[28px] overflow-hidden relative border border-stone-200/70 bg-[#f7f7f4] animate-pulse"
      style={{ minHeight: 460 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 h-full">
        <div className="p-7 md:p-9 flex flex-col justify-between gap-6">
          <div>
            <div className="h-7 w-40 bg-stone-200/70 rounded-full mb-6" />
            <div className="h-12 md:h-14 w-5/6 bg-stone-200/70 rounded-2xl mb-5" />
            <div className="flex items-start gap-4">
              <div className="h-12 w-14 bg-stone-200/60 rounded-xl" />
              <div className="flex-1">
                <div className="h-4 w-32 bg-stone-200/70 rounded mb-2" />
                <div className="h-3 w-full bg-stone-200/60 rounded mb-2" />
                <div className="h-3 w-2/3 bg-stone-200/60 rounded" />
              </div>
            </div>
          </div>
          <div>
            <div className="h-11 w-44 bg-stone-200/70 rounded-full mb-4" />
            <div className="h-4 w-56 bg-stone-200/60 rounded" />
          </div>
        </div>
        <div className="relative flex items-center justify-center min-h-[280px]">
          <div className="w-[320px] h-[320px] md:w-[380px] md:h-[380px] bg-stone-200/60 rounded-[44px]" />
        </div>
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
          <div
            className="rounded-[28px] overflow-hidden relative flex flex-col md:flex-row border border-stone-200/70"
            style={{
              background: '#f5f7f3',
              minHeight: 460
            }}
          >
            {/* Ambient glow blobs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full" style={{background:'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 72%)'}} />
              <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full" style={{background:'radial-gradient(circle, rgba(20,24,36,0.03) 0%, transparent 70%)'}} />
            </div>

            {/* LEFT: focused value proposition */}
            <div className="relative z-10 flex flex-col justify-between p-7 md:p-9 flex-1 min-w-0">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-stone-500 mb-5 border border-stone-200 px-3 py-1.5 rounded-full bg-white/70">
                  <svg className="w-3 h-3 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  Premium audio experience
                </span>

                <h1 className="text-4xl md:text-[54px] font-black text-slate-900 tracking-tight leading-[1.03] mb-4">
                  {spotlightProduct.name}
                </h1>
                <p className="text-sm md:text-[15px] text-stone-600 font-medium leading-relaxed max-w-[460px]">
                  Discover richer sound, better comfort, and modern design built for everyday listening with {spotlightSoundName}.
                </p>

                <div className="flex flex-wrap items-center gap-2.5 mt-6">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-white border border-stone-200 px-2.5 py-1 rounded-full">
                    ★ {spotlightRating}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-white border border-stone-200 px-2.5 py-1 rounded-full">
                    ${spotlightProduct.price}
                  </span>
                  {spotlightProduct.countInStock !== undefined && (
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                      spotlightProduct.countInStock === 0
                        ? 'text-red-600 bg-red-50 border-red-100'
                        : spotlightProduct.countInStock <= 5
                        ? 'text-amber-600 bg-amber-50 border-amber-100'
                        : 'text-emerald-600 bg-emerald-50 border-emerald-100'
                    }`}>
                      {spotlightProduct.countInStock === 0
                        ? 'Out of stock'
                        : spotlightProduct.countInStock <= 5
                        ? `${spotlightProduct.countInStock} left`
                        : 'In stock'}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={scrollToCatalog}
                    className="bg-[#d9f662] hover:bg-[#ceef53] text-slate-950 font-bold px-5 py-3 rounded-full inline-flex items-center gap-3 transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer shadow-lg shadow-lime-300/20"
                  >
                    Shop Collection
                    <span className="w-7 h-7 rounded-full bg-slate-950 text-white flex items-center justify-center">
                      <ArrowIcon />
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveProductDetail(spotlightProduct)}
                    className="bg-white hover:bg-stone-50 text-slate-800 border border-stone-200 font-bold px-5 py-3 rounded-full inline-flex items-center gap-2 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                  >
                    View Product
                  </button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-semibold text-stone-600 bg-white/80 border border-stone-200 px-2.5 py-1 rounded-full">
                    Free shipping over $350
                  </span>
                  <span className="text-[11px] font-semibold text-stone-600 bg-white/80 border border-stone-200 px-2.5 py-1 rounded-full">
                    2-year warranty
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT: Product image stage */}
            <div className="relative w-full md:w-[54%] flex items-center justify-center overflow-hidden min-h-[280px]">
              {/* Multi-layer glows */}
              <div className="absolute w-72 h-72 rounded-full blur-3xl" style={{background:'radial-gradient(circle, rgba(96,165,250,0.17) 0%, transparent 70%)'}} />
              <div className="absolute w-48 h-48 rounded-full blur-2xl" style={{background:'radial-gradient(circle, rgba(2,132,199,0.1) 0%, transparent 70%)'}} />
              {/* Floating orbs */}
              <div className="absolute top-10 right-16 w-4 h-4 bg-stone-200 rounded-full border border-stone-300/70" />
              <div className="absolute top-1/3 right-5 w-2.5 h-2.5 bg-sky-300 rounded-full" />
              <div className="absolute bottom-20 left-6 w-5 h-5 bg-stone-100 rounded-full border border-stone-300/70" />
              <div className="absolute bottom-10 right-24 w-3 h-3 bg-slate-300 rounded-full" />
              <div className="absolute top-1/2 right-1/2 w-2 h-2 bg-slate-300 rounded-full" />
              <div className="relative z-10 w-[86%] max-w-[500px] rounded-[26px] border border-stone-200/80 bg-white/60 backdrop-blur-sm p-4 md:p-5 shadow-[0_18px_44px_-24px_rgba(15,23,42,0.35)]">
                <img
                  src={getProductImage(spotlightProduct)}
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = blueHeadphones }}
                  className="w-full aspect-square object-contain cursor-pointer hover:scale-[1.03] transition-transform duration-700"
                  style={{
                    filter: 'drop-shadow(0 0 24px rgba(59,130,246,0.2)) drop-shadow(0 16px 30px rgba(15,23,42,0.16))'
                  }}
                  onClick={() => setActiveProductDetail(spotlightProduct)}
                  alt={spotlightProduct.name}
                />
              </div>

              {/* Top-right open product control (matches reference). */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveProductDetail(spotlightProduct)
                }}
                className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-white/70 border border-stone-200/70 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white transition-colors"
                aria-label="Open product"
              >
                <ArrowIcon />
              </button>
              {/* Color selector pills at bottom of image area */}
              <div className="absolute bottom-5 right-0 left-0 flex justify-center">
                <div className="inline-flex items-center gap-2 bg-white/85 border border-stone-200 rounded-full px-3 py-1.5 shadow-sm">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">Colors</span>
                  {spotlightColors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSpotlightColor(c)}
                      className={`w-3 h-3 rounded-full ${colorsMap[c]} border transition-all duration-200 cursor-pointer ${
                        spotlightColor === c ? 'border-slate-600 scale-125 shadow-sm' : 'border-stone-300 opacity-70 hover:opacity-100'
                      }`}
                      aria-label={c}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          )
        )}

        {/* ─── BOTTOM ROW (3 cards) ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">

          {/* More Products */}
          <div
            onClick={scrollToCatalog}
            className="bg-[#f6f7f2] rounded-[22px] p-5 border border-stone-200/70 shadow-sm flex flex-col justify-between min-h-[210px] cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-sm font-extrabold text-slate-800">More Products</h2>
                <p className="text-xs text-stone-400 font-medium mt-0.5">{products.length} plus items.</p>
              </div>
              <svg className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </div>
            <div className="flex gap-2 mt-auto pt-6">
              {smallCardProducts.map((prod) => (
                <div key={getProductId(prod)} className="w-11 h-11 bg-stone-50 rounded-xl overflow-hidden flex items-center justify-center p-1.5 border border-stone-100 flex-shrink-0">
                  <img src={getProductImage(prod)} className="object-contain w-full h-full" alt={prod.name}/>
                </div>
              ))}
            </div>
          </div>

          {/* Downloads / social stats card */}
          <div className="bg-[#f6f7f2] rounded-[22px] p-5 border border-stone-200/70 shadow-sm flex flex-col justify-between min-h-[210px] cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex -space-x-2">
                {smallCardProducts.map((prod, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-white bg-stone-100 overflow-hidden p-0.5 flex-shrink-0"
                  >
                    <img src={getProductImage(prod)} className="object-contain w-full h-full" alt="" />
                  </div>
                ))}
              </div>
              <div className="w-9 h-9 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center flex-1 py-2 gap-2">
              <div
                className="w-[84px] h-[84px] rounded-full flex flex-col items-center justify-center shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #4f46e5 0%, #6d28d9 100%)',
                  boxShadow: '0 12px 30px rgba(79,70,229,0.35)'
                }}
              >
                <span className="text-white font-black text-xl leading-none">5m+</span>
                <span className="text-indigo-100 text-[9px] font-bold uppercase tracking-wide mt-1">Downloads</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-1.5 mt-auto">
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-white border border-stone-100 px-3 py-1 rounded-full">
                <span className="text-yellow-400">★</span> 4.6 reviews
              </div>
            </div>
          </div>

          {/* New Gen X-Bud — popular card */}
          {earbudCardProduct ? (
            <div
              onClick={() => setActiveProductDetail(earbudCardProduct)}
              className="bg-[#f6f7f2] rounded-[22px] border border-stone-200/70 shadow-sm min-h-[210px] cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 relative overflow-hidden group"
            >
              <div className="flex justify-between items-start gap-3 p-5 pb-0 relative z-10">
                <span className="text-[10px] font-extrabold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full inline-flex items-center gap-1 border border-rose-100">
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                  Popular
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveProductDetail(earbudCardProduct) }}
                  className="w-6 h-6 bg-stone-100 hover:bg-slate-900 hover:text-white rounded-full flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
                  aria-label="Open product"
                >
                  <ArrowIcon />
                </button>
              </div>

              {/* crisp product stage — no fade overlay on image */}
              <div className="absolute right-3 top-9 bottom-3 w-[52%] bg-white rounded-[18px] border border-stone-200/80 shadow-sm flex items-center justify-center overflow-hidden">
                <img
                  src={productImg(earbudCardProduct)}
                  onError={(e) => { e.currentTarget.src = EARBUD_FALLBACK_IMAGE }}
                  className="w-full h-full object-contain object-center p-2 transition-transform duration-500 group-hover:scale-105"
                  alt={earbudCardProduct.name}
                />
              </div>

              <div className="absolute bottom-0 left-0 p-5 z-10 max-w-[46%]">
                <h2 className="text-sm font-extrabold text-slate-900 leading-tight">{earbudCardProduct.name}</h2>
                <p className="text-[11px] text-stone-500 font-semibold mt-1">Wireless earbuds · premium sound</p>
                <div className="flex items-center justify-between mt-3 gap-2">
                  <span className="text-[11px] font-bold text-stone-400 flex items-center gap-0.5">
                    <span className="text-yellow-400">★</span> 4.7
                  </span>
                  <span className="text-sm font-black text-indigo-600">${earbudCardProduct.price}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[22px] border border-stone-100 shadow-sm min-h-[210px]" />
          )}

        </div>
      </div>

      {/* ══════════ RIGHT COLUMN ══════════ */}
      <div className="flex flex-col gap-4">

        {/* Popular Colors */}
        {spotlightProduct && (
          <div className="bg-[#f6f7f2] rounded-[22px] p-5 border border-stone-200/70 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-800 mb-3">Popular Colors</h3>
            <div className="flex gap-2.5 flex-wrap">
              {getProductColors(spotlightProduct).map((c) => (
                <button
                  key={c}
                  onClick={() => setSpotlightColor(c)}
                  className={`w-8 h-8 rounded-full ${colorsMap[c]} border border-white/80 transition-all duration-200 cursor-pointer ${
                    spotlightColor === c ? 'ring-2 ring-offset-2 ring-slate-500 scale-110 shadow-md' : 'opacity-80 hover:opacity-100 hover:scale-105'
                  }`}
                  aria-label={c}
                />
              ))}
            </div>
          </div>
        )}

        {/* Earbuds card (New Gen X-Bud) */}
        {earbudCardProduct && (
          <div
            onClick={() => setActiveProductDetail(earbudCardProduct)}
            className="bg-white rounded-[22px] overflow-hidden border border-stone-200/70 shadow-sm relative group hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-0.5 flex flex-col min-h-[200px]"
          >
            <div className="p-4 flex justify-between items-start relative z-10">
              <h2 className="text-sm font-extrabold text-slate-900 leading-tight">{earbudCardProduct.name}</h2>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveProductDetail(earbudCardProduct) }}
                className="w-7 h-7 bg-stone-100 group-hover:bg-slate-900 group-hover:text-white rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer flex-shrink-0"
                aria-label="Open product"
              >
                <ArrowIcon />
              </button>
            </div>

            {/* full-width image stage */}
            <div className="mx-3 mb-3 flex-1 min-h-[130px] rounded-[18px] bg-gradient-to-br from-stone-50 to-stone-100 border border-stone-100 overflow-hidden flex items-center justify-center">
              <img
                src={productImg(earbudCardProduct)}
                onError={(e) => { e.currentTarget.src = EARBUD_FALLBACK_IMAGE }}
                className="w-full max-h-[150px] object-contain transition-transform duration-500 group-hover:scale-105"
                style={{filter:'drop-shadow(0 8px 18px rgba(0,0,0,0.1))'}}
                alt={earbudCardProduct.name}
              />
            </div>
          </div>
        )}

        {/* Featured VR / surface card — full-bleed image like reference */}
        {darkFeaturedImageProduct && darkFeaturedTitleProduct && (
          <div
            onClick={() => setActiveProductDetail(darkFeaturedTitleProduct)}
            className="rounded-[22px] overflow-hidden border border-stone-300/30 shadow-sm relative group hover:shadow-lg transition-all duration-300 cursor-pointer flex-1 hover:-translate-y-0.5 min-h-[280px]"
          >
            <img
              src={getProductImage(darkFeaturedImageProduct)}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              alt={darkFeaturedImageProduct.name}
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
