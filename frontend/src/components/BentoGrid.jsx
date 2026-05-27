import { useMemo } from 'react'
import { useCart, getProductId } from '../context/CartContext'

export default function BentoGrid() {
  const {
    products,
    categories,
    spotlightProduct,
    spotlightColor,
    setSpotlightColor,
    colorsMap,
    getProductImage,
    getProductColors,
    addToCart,
    setActiveProductDetail,
    categoryIdToNameMap,
    scrollToCatalog
  } = useCart()

  const newestProduct = useMemo(() =>
    products.length > 0
      ? [...products].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))[0]
      : null
  , [products])

  const catCount = Math.max(0, (categories?.length || 1) - 1)
  const avgRating = products.length
    ? (products.reduce((acc, p) => acc + (p.rating ? Number(p.rating) : 0), 0) / products.length)
    : 4.7
  const ratingText = Number.isFinite(avgRating) && avgRating > 0 ? avgRating.toFixed(1) : '4.7'
  const spotlightSoundName = spotlightProduct?.name?.split(' ')[0] || 'Sequoia'

  // Pick specific DB products so the UI matches the reference screenshot.
  const earbudCardProduct =
    products.find((p) => (p.name || '').toLowerCase().includes('x-bud')) ||
    products.find((p) => (p.name || '').toLowerCase().includes('earbud')) ||
    products[1]

  const surfaceHeadphoneProduct =
    products.find((p) => (p.name || '').toLowerCase().includes('surface')) ||
    products.find((p) => (p.name || '').toLowerCase().includes('headphone')) ||
    products[2]

  const releasedProduct = earbudCardProduct || newestProduct

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_252px] gap-4">

      {/* ══════════ LEFT BLOCK ══════════ */}
      <div className="flex flex-col gap-4">

        {/* ─── DARK SPOTLIGHT HERO ─── */}
        {spotlightProduct && (
          <div
            className="rounded-[28px] overflow-hidden relative flex flex-col md:flex-row border border-stone-200/70"
            style={{
              background: 'linear-gradient(170deg, #f3f4ef 0%, #f8f8f4 100%)',
              minHeight: 395
            }}
          >
            {/* Ambient glow blobs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full" style={{background:'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 72%)'}} />
              <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full" style={{background:'radial-gradient(circle, rgba(20,24,36,0.03) 0%, transparent 70%)'}} />
            </div>

            {/* LEFT: Text content */}
            <div className="relative z-10 flex flex-col justify-between p-7 md:p-9 flex-1 min-w-0">
              <div>
                {/* Label tag */}
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-stone-500 mb-5 border border-stone-200 px-3 py-1.5 rounded-full bg-white/70">
                  <span className="w-1.5 h-1.5 bg-lime-500 rounded-full animate-pulse" />
                  Music is Classic
                </span>

                {/* Headline */}
                <h1 className="text-4xl md:text-[52px] font-black text-slate-900 tracking-tight leading-[1.05] mb-6">
                  {spotlightProduct.name}
                </h1>

                {/* 01 section */}
                <div className="flex items-start gap-4 mb-8">
                  <span className="text-[42px] font-black text-slate-300/70 leading-none flex-shrink-0 mt-0">01</span>
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-px bg-stone-300 mt-[13px] flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-slate-700 mb-1">Clear Sounds</p>
                      <p className="text-xs text-stone-500 font-medium leading-relaxed line-clamp-2 max-w-[270px]">
                        Making your dream music come true
                        <br />
                        stay with {spotlightSoundName} Sounds!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {/* CTA button */}
                <div>
                  <button
                    onClick={scrollToCatalog}
                    className="bg-[#d9f662] hover:bg-[#ceef53] text-slate-950 font-bold px-5 py-3 rounded-full inline-flex items-center gap-3 transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer shadow-lg shadow-lime-300/20"
                  >
                    View All Products
                    <span className="w-7 h-7 rounded-full bg-slate-950 text-white flex items-center justify-center">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                      </svg>
                    </span>
                  </button>
                </div>

                {/* Social row */}
                <div className="flex items-center gap-3 text-stone-500">
                  <span className="text-[10px] font-semibold uppercase tracking-wider">Follow us on:</span>
                  {[
                    'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
                    'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z',
                    'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
                    'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z'
                  ].map((path, i) => (
                    <svg key={i} className="w-3.5 h-3.5 hover:text-slate-700 transition-colors cursor-pointer" fill="currentColor" viewBox="0 0 24 24">
                      <path d={path}/>
                    </svg>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Product image stage */}
            <div className="relative w-full md:w-[52%] flex items-center justify-center overflow-hidden min-h-[280px]">
              {/* Multi-layer glows */}
              <div className="absolute w-72 h-72 rounded-full blur-3xl" style={{background:'radial-gradient(circle, rgba(96,165,250,0.17) 0%, transparent 70%)'}} />
              <div className="absolute w-48 h-48 rounded-full blur-2xl" style={{background:'radial-gradient(circle, rgba(2,132,199,0.1) 0%, transparent 70%)'}} />
              {/* Floating orbs */}
              <div className="absolute top-10 right-16 w-4 h-4 bg-stone-200 rounded-full border border-stone-300/70" />
              <div className="absolute top-1/3 right-5 w-2.5 h-2.5 bg-sky-300 rounded-full" />
              <div className="absolute bottom-20 left-6 w-5 h-5 bg-stone-100 rounded-full border border-stone-300/70" />
              <div className="absolute bottom-10 right-24 w-3 h-3 bg-slate-300 rounded-full" />
              <div className="absolute top-1/2 right-1/2 w-2 h-2 bg-slate-300 rounded-full" />
              {/* Product image panel */}
              <div
                className="relative z-10 w-[320px] md:w-[390px] h-[240px] md:h-[285px] bg-white/60 backdrop-blur-sm rounded-2xl border border-stone-200/70 shadow-sm flex items-center justify-center cursor-pointer"
                onClick={() => setActiveProductDetail(spotlightProduct)}
              >
                <img
                  src={getProductImage(spotlightProduct)}
                  className="w-[210px] h-[210px] md:w-[290px] md:h-[290px] object-contain hover:scale-105 transition-transform duration-700"
                  style={{filter:'drop-shadow(0 0 32px rgba(59,130,246,0.24)) drop-shadow(0 14px 30px rgba(15,23,42,0.22))'}}
                  alt={spotlightProduct.name}
                />
              </div>

              {/* Center control icon */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white/65 backdrop-blur-sm border border-stone-200/70 flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 18l-6-6 6-6" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 6l6 6-6 6" />
                </svg>
              </div>
              {/* Color selector pills at bottom of image area */}
              <div className="absolute bottom-5 right-0 left-0 flex justify-center gap-2">
                {getProductColors(spotlightProduct).map((c) => (
                  <button
                    key={c}
                    onClick={() => setSpotlightColor(c)}
                    className={`w-3 h-3 rounded-full ${colorsMap[c]} border transition-all duration-200 cursor-pointer ${
                      spotlightColor === c ? 'border-slate-600 scale-125 shadow-sm' : 'border-stone-300 opacity-60 hover:opacity-100'
                    }`}
                    aria-label={c}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── BOTTOM ROW (3 cards) ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* More Products */}
          <div
            onClick={scrollToCatalog}
            className="bg-[#f7f7f2] rounded-[22px] p-5 border border-stone-200/70 shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5"
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
            <div className="flex gap-2 mt-4">
              {products.slice(0, 3).map((prod) => (
                <div key={getProductId(prod)} className="w-11 h-11 bg-stone-50 rounded-xl overflow-hidden flex items-center justify-center p-1.5 border border-stone-100 flex-shrink-0">
                  <img src={getProductImage(prod)} className="object-contain w-full h-full" alt={prod.name}/>
                </div>
              ))}
            </div>
          </div>

          {/* Downloads / social stats card */}
          <div className="bg-[#f7f7f2] rounded-[22px] p-5 border border-stone-200/70 shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex -space-x-2">
                {products.slice(0, 3).map((prod, i) => (
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

            <div className="flex flex-col items-center gap-2 text-center">
              <div
                className="w-[78px] h-[78px] rounded-full flex flex-col items-center justify-center shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #4f46e5 0%, #6d28d9 100%)',
                  boxShadow: '0 12px 30px rgba(79,70,229,0.35)'
                }}
              >
                <span className="text-white font-black text-xl leading-none">5m+</span>
                <span className="text-indigo-100 text-[9px] font-bold uppercase tracking-wide mt-1">Downloads</span>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-stone-50 border border-stone-100 px-3 py-1 rounded-full">
                <span className="text-yellow-400">★</span> 4.6 reviews
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-stone-50 border border-stone-100 px-3 py-1 rounded-full">
                <span className="text-yellow-400">★</span> {catCount} categories
              </div>
            </div>
          </div>

          {/* Newest / Popular card */}
          {newestProduct ? (
            <div
              onClick={() => setActiveProductDetail(releasedProduct)}
            className="bg-[#f7f7f2] rounded-[22px] p-5 border border-stone-200/70 shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 relative overflow-hidden group"
            >
              <div className="flex justify-between items-start gap-3">
                <span className="text-[10px] font-extrabold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full inline-flex items-center gap-1 border border-rose-100">
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                  Popular
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveProductDetail(releasedProduct) }}
                  className="w-6 h-6 bg-stone-100 hover:bg-slate-900 hover:text-white rounded-full flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
                  aria-label="Open product"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                </button>
              </div>

              <div className="flex-1 mt-3 flex items-end justify-between gap-3">
                <div className="text-left">
                  <div className="text-xs font-extrabold text-slate-900 leading-tight">
                    Listening
                    <span className="block text-stone-500 font-bold">Has Been Released</span>
                  </div>
                </div>

                <div className="w-[96px] h-[96px] rounded-[18px] bg-white/60 border border-stone-200/70 flex items-center justify-center overflow-hidden">
                  <img
                    src={getProductImage(releasedProduct)}
                    className="w-[74px] h-[74px] object-contain filter drop-shadow-sm transition-transform duration-500 group-hover:scale-110"
                    alt={releasedProduct?.name}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] font-bold text-stone-400 flex items-center gap-0.5">
                  <span className="text-yellow-400">★</span> 4.7
                </span>
                <span className="text-[10px] font-black text-indigo-600">${releasedProduct?.price}</span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[22px] border border-stone-100 shadow-sm" />
          )}

        </div>
      </div>

      {/* ══════════ RIGHT COLUMN ══════════ */}
      <div className="flex flex-col gap-4">

        {/* Popular Colors */}
        {spotlightProduct && (
          <div className="bg-[#f8f8f4] rounded-[22px] p-5 border border-stone-200/70 shadow-sm">
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
            className="bg-white rounded-[22px] overflow-hidden border border-stone-200/70 shadow-sm relative group hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-0.5 flex flex-col"
            style={{minHeight:205}}
          >
            {/* top: meta */}
            <div className="p-5 pb-0 flex justify-between items-start">
              <div className="min-w-0 pr-2">
                <h2 className="text-sm font-extrabold text-slate-900 leading-tight">{earbudCardProduct.name}</h2>
                <p className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider mt-0.5">
                  {categoryIdToNameMap[earbudCardProduct.category] || earbudCardProduct.category}
                </p>
                <p className="text-sm font-black text-indigo-600 mt-1">${earbudCardProduct.price}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveProductDetail(earbudCardProduct) }}
                className="w-7 h-7 bg-stone-100 group-hover:bg-slate-900 group-hover:text-white rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer flex-shrink-0"
                aria-label="Open product"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 17L17 7M17 7H7M17 7v10"/></svg>
              </button>
            </div>
            {/* image: centered with soft stage */}
            <div className="flex-1 relative overflow-hidden flex items-end justify-center" style={{minHeight:120}}>
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(250,250,248,1) 100%)' }}
              />
              <img
                src={getProductImage(earbudCardProduct)}
                className="relative z-10 w-[140px] h-[140px] object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                style={{filter:'drop-shadow(0 10px 22px rgba(0,0,0,0.14))'}}
                alt={earbudCardProduct.name}
              />
            </div>
          </div>
        )}

        {/* Surface headphone card (dark featured card) */}
        {surfaceHeadphoneProduct && (
          <div
            onClick={() => setActiveProductDetail(surfaceHeadphoneProduct)}
            className="rounded-[22px] overflow-hidden border border-stone-300/30 shadow-sm relative group hover:shadow-lg transition-all duration-300 cursor-pointer flex-1 hover:-translate-y-0.5 flex flex-col"
            style={{
              background: 'linear-gradient(160deg, #1a1c28 0%, #0f1018 100%)',
              minHeight: 240
            }}
          >
            {/* expand button */}
            <div className="absolute top-4 right-4 z-20">
              <button
                onClick={(e) => { e.stopPropagation(); setActiveProductDetail(surfaceHeadphoneProduct) }}
                className="w-7 h-7 bg-white/10 backdrop-blur-sm group-hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 17L17 7M17 7H7M17 7v10"/></svg>
              </button>
            </div>
            {/* Product image centred with atmospheric glow */}
            <div className="flex-1 flex items-center justify-center relative overflow-hidden" style={{minHeight:175}}>
              <div className="absolute inset-0" style={{background:'radial-gradient(circle at 55% 50%, rgba(99,102,241,0.18) 0%, transparent 65%)'}} />
              <img
                src={getProductImage(surfaceHeadphoneProduct)}
                className="relative z-10 w-[190px] h-[190px] object-contain transition-transform duration-500 group-hover:scale-105"
                style={{filter:'drop-shadow(0 8px 24px rgba(99,102,241,0.4)) drop-shadow(0 2px 8px rgba(0,0,0,0.5))'}}
                alt={surfaceHeadphoneProduct.name}
              />
            </div>
            {/* Caption band */}
            <div className="p-4 pt-2 flex flex-col gap-1">
              <h2 className="text-sm font-extrabold text-white leading-snug">{surfaceHeadphoneProduct.name}</h2>
              <p className="text-[10px] text-indigo-200 font-semibold">Boosted with bass</p>
              <div className="flex justify-end items-center mt-1">
                <span className="text-[10px] font-bold text-stone-400 flex items-center gap-0.5">
                  <span className="text-yellow-400">★</span> 4.7
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
