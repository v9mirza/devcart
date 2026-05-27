import { useCart, getProductId } from '../context/CartContext'

const EARBUD_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1636093973985-4fe333d36de9?auto=format&fit=crop&q=80&w=900'

export default function BentoGrid() {
  const {
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">

      {/* ══════════ LEFT BLOCK ══════════ */}
      <div className="flex flex-col gap-4">

        {/* ─── DARK SPOTLIGHT HERO ─── */}
        {spotlightProduct && (
          <div
            className="rounded-[28px] overflow-hidden relative flex flex-col md:flex-row border border-stone-200/70"
            style={{
              background: '#f7f7f4',
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
                  <svg className="w-3 h-3 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
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
                        Clear Sounds. Making your dream music come true stay with {spotlightSoundName} Sounds!
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
                      <ArrowIcon />
                    </span>
                  </button>
                </div>

                {/* Social + pagination */}
                <div className="flex items-center justify-between gap-3 text-stone-500">
                  <div className="flex items-center gap-3">
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
                  <div className="flex items-center gap-2 text-stone-400">
                    <button type="button" className="w-7 h-7 rounded-full border border-stone-200 flex items-center justify-center hover:bg-white transition-colors cursor-pointer" aria-label="Previous">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
                    </button>
                    <span className="text-[11px] font-bold text-stone-500">01</span>
                    <button type="button" className="w-7 h-7 rounded-full border border-stone-200 flex items-center justify-center hover:bg-white transition-colors cursor-pointer" aria-label="Next">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
                    </button>
                  </div>
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
              {/* Floating product image */}
              <img
                src={getProductImage(spotlightProduct)}
                className="relative z-10 w-[300px] h-[300px] md:w-[360px] md:h-[360px] object-cover cursor-pointer hover:scale-105 transition-transform duration-700"
                style={{
                  filter:
                    'drop-shadow(0 0 26px rgba(59,130,246,0.22)) drop-shadow(0 18px 36px rgba(15,23,42,0.15))',
                  transform: 'translateY(8px)'
                }}
                onClick={() => setActiveProductDetail(spotlightProduct)}
                alt={spotlightProduct.name}
              />

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">

          {/* More Products */}
          <div
            onClick={scrollToCatalog}
            className="bg-[#f7f7f2] rounded-[22px] p-5 border border-stone-200/70 shadow-sm flex flex-col justify-between min-h-[210px] cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5"
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
          <div className="bg-[#f7f7f2] rounded-[22px] p-5 border border-stone-200/70 shadow-sm flex flex-col justify-between min-h-[210px] cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5">
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
              className="bg-[#f7f7f2] rounded-[22px] border border-stone-200/70 shadow-sm min-h-[210px] cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 relative overflow-hidden group"
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
