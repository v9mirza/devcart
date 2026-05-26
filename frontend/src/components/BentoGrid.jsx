import { useCart, getProductId } from '../context/CartContext'

export default function BentoGrid() {
  const {
    products,
    spotlightProduct,
    spotlightColor,
    setSpotlightColor,
    likes,
    hasLiked,
    toggleLike,
    timeLeft,
    colorsMap,
    getProductImage,
    getProductColors,
    addToCart,
    setActiveProductDetail,
    categoryIdToNameMap,
    scrollToCatalog
  } = useCart()

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, '0')}h : ${m.toString().padStart(2, '0')}m : ${s.toString().padStart(2, '0')}s`
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Bento Main Left block */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        
        {/* Featured Spotlight Card */}
        {spotlightProduct && (
          <div className="bg-white rounded-[32px] p-6 md:p-8 border border-stone-200/40 shadow-sm relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center min-h-[380px] group transition-all duration-300 hover:shadow-md">
            <div className="flex flex-col items-start max-w-sm z-10">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4 px-3 py-1.5 bg-stone-100 rounded-full inline-flex items-center gap-1.5">
                🎧 Spotlight Product
              </span>
              
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-3">
                {spotlightProduct.name}
              </h1>
              
              <div className="flex flex-col gap-1 mb-5">
                <p className="text-stone-500 text-xs font-semibold">
                  Color Selected: <span className="text-indigo-600 capitalize font-bold">{spotlightColor}</span>
                </p>
                <div className="flex gap-2 items-center mt-1">
                  {getProductColors(spotlightProduct).map((colorName) => (
                    <button
                      key={colorName}
                      onClick={() => setSpotlightColor(colorName)}
                      className={`w-5 h-5 rounded-full ${colorsMap[colorName]} transition-all duration-200 cursor-pointer ${
                        spotlightColor === colorName 
                          ? 'ring-2 scale-110 shadow-sm' 
                          : 'opacity-85 hover:opacity-100 hover:scale-105'
                      }`}
                      aria-label={`Select spotlight color ${colorName}`}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <span className="text-xs font-extrabold text-stone-300 block mb-1">01 ───────────→</span>
                <div className="text-sm text-stone-500 font-medium">
                  <span className="font-bold text-slate-800 block">Clear Sounds • ${spotlightProduct.price}</span>
                  Explore spatial sound and absolute immersion with tailored acoustics.
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={scrollToCatalog}
                  className="bg-[#d7f954] hover:bg-[#cbf046] text-slate-900 font-bold px-5 py-3 rounded-full inline-flex items-center gap-3.5 shadow-md shadow-lime-900/10 transition-all duration-200 hover:scale-105 active:scale-95 group/btn cursor-pointer"
                >
                  View All Products
                  <span className="w-8 h-8 rounded-full bg-slate-950 text-white flex items-center justify-center transition-transform duration-300 group-hover/btn:rotate-45">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </button>

                <button 
                  onClick={() => addToCart(spotlightProduct, spotlightColor, 1)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-full shadow-md shadow-slate-900/10 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Spotlight image */}
            <div className="relative w-full md:w-1/2 flex items-center justify-center mt-6 md:mt-0">
              <div className="absolute w-64 h-64 bg-slate-100 rounded-full filter blur-3xl opacity-60 z-0" />
              <img
                src={getProductImage(spotlightProduct)}
                className="w-64 h-64 md:w-80 md:h-80 object-contain z-10 transition-all duration-700 group-hover:scale-105 group-hover:rotate-2 filter drop-shadow-xl cursor-pointer"
                onClick={() => setActiveProductDetail(spotlightProduct)}
                alt={spotlightProduct.name}
              />
            </div>

            {/* Social links */}
            <div className="absolute bottom-6 left-8 flex gap-3 text-stone-400 z-10">
              <a href="#twitter" className="hover:text-slate-800 transition-colors"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
              <a href="#instagram" className="hover:text-slate-800 transition-colors"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
              <a href="#linkedin" className="hover:text-slate-800 transition-colors"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
            </div>
          </div>
        )}

        {/* Bottom Row of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Product Previews Thumbnails */}
          <div 
            onClick={scrollToCatalog}
            className="bg-white rounded-[24px] p-5 border border-stone-200/40 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:scale-[1.01] cursor-pointer"
          >
            <div>
              <h2 className="text-sm font-extrabold text-slate-800 mb-1">More Products</h2>
              <p className="text-xs text-stone-400 font-medium">{products.length} curated premium items.</p>
            </div>
            <div className="flex gap-2.5 mt-4">
              {products.slice(0, 3).map((prod) => (
                <div key={getProductId(prod)} className="w-12 h-12 bg-stone-100 rounded-xl overflow-hidden flex items-center justify-center p-1 hover:scale-110 transition-transform">
                  <img src={getProductImage(prod)} className="object-contain w-full h-full" alt={prod.name} />
                </div>
              ))}
            </div>
          </div>

          {/* Stats Card */}
          <div 
            onClick={toggleLike}
            className="bg-white rounded-[24px] p-5 border border-stone-200/40 shadow-sm flex flex-col justify-between items-center text-center transition-all duration-300 hover:shadow-md hover:scale-[1.01] cursor-pointer group"
          >
            <div className="flex -space-x-2">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=60" className="w-7 h-7 rounded-full border-2 border-white object-cover" alt="" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=60" className="w-7 h-7 rounded-full border-2 border-white object-cover" alt="" />
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=60" className="w-7 h-7 rounded-full border-2 border-white object-cover" alt="" />
            </div>
            
            <div className="my-2">
              <span className="block text-2xl font-black text-slate-800 leading-none group-hover:text-rose-500 transition-colors">
                {likes}
              </span>
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Product Likes</span>
            </div>

            <div className="flex items-center gap-1 text-xs font-extrabold text-slate-700 bg-stone-100 px-3 py-1 rounded-full">
              <span className="text-yellow-500">★</span> 4.6 ratings
            </div>
          </div>

          {/* Promo release card */}
          <div className="bg-white rounded-[24px] p-5 border border-stone-200/40 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-extrabold text-orange-500 bg-orange-50 px-2 py-1 rounded-md">
                🧡 Hot Release
              </span>
              {products.length > 2 && (
                <button 
                  onClick={() => setActiveProductDetail(products[2])}
                  className="w-7 h-7 bg-stone-100 hover:bg-slate-900 hover:text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              )}
            </div>
            <div className="mt-4">
              <h2 className="text-sm font-extrabold text-slate-800 leading-snug">
                Next-Gen Spatial VR Glass Has Released
              </h2>
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="flex flex-col gap-6">
        
        {/* Flash Sale Card */}
        {spotlightProduct && (
          <div className="bg-white rounded-[28px] p-6 border border-stone-200/40 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md relative overflow-hidden group">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black text-red-500 bg-red-50 px-2 py-1 rounded-md uppercase tracking-wider inline-flex items-center gap-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block animate-ping" />
                  Flash Sale
                </span>
                <span className="text-[10px] font-bold text-stone-400">Ends in</span>
              </div>

              <div className="my-2">
                <span className="text-xl font-mono font-black tracking-tight text-slate-800 bg-stone-50 px-2 py-1.5 rounded-xl block text-center border border-stone-200/20 shadow-inner">
                  {formatTime(timeLeft)}
                </span>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <div className="flex justify-between items-end text-[10px] font-bold text-stone-500">
                  <span>25% Off {spotlightProduct.name}</span>
                  <span className="text-slate-800">12/15 Claimed</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full rounded-full transition-all duration-500" style={{ width: '80%' }} />
                </div>
                <button
                  onClick={() => addToCart(spotlightProduct, spotlightColor, 1, Math.round(spotlightProduct.price * 0.75))}
                  className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-full text-center text-xs shadow-md shadow-red-500/10 cursor-pointer transition-transform duration-200 hover:scale-[1.02] active:scale-98"
                >
                  Claim Deal (${Math.round(spotlightProduct.price * 0.75)})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Earbuds Card */}
        {products.length > 1 && (
          <div className="bg-white rounded-[28px] p-6 border border-stone-200/40 shadow-sm flex flex-col justify-between min-h-[220px] relative overflow-hidden group transition-all duration-300 hover:shadow-md">
            <div className="flex justify-between items-start z-10">
              <div>
                <h2 className="text-md font-extrabold text-slate-900 leading-tight">{products[1].name}</h2>
                <p className="text-xs text-stone-400 font-bold uppercase mt-0.5">{categoryIdToNameMap[products[1].category] || products[1].category}</p>
                <p className="text-xs text-indigo-600 font-black mt-1">${products[1].price}</p>
              </div>
              <button 
                onClick={() => setActiveProductDetail(products[1])}
                className="w-8 h-8 bg-stone-100 group-hover:bg-slate-900 group-hover:text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
            
            <div className="absolute right-0 bottom-0 w-32 h-32 md:w-36 md:h-36">
              <img 
                src={getProductImage(products[1])} 
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 filter drop-shadow-md" 
                alt={products[1].name} 
              />
            </div>
          </div>
        )}

        {/* VR Headset Card */}
        {products.length > 2 && (
          <div className="bg-white rounded-[28px] p-6 border border-stone-200/40 shadow-sm flex flex-col justify-between min-h-[280px] relative overflow-hidden group transition-all duration-300 hover:shadow-md">
            <div className="flex justify-between items-start z-10">
              <div />
              <button 
                onClick={() => setActiveProductDetail(products[2])}
                className="w-8 h-8 bg-stone-100 group-hover:bg-slate-900 group-hover:text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            <div className="w-full flex justify-center py-4">
              <img 
                src={getProductImage(products[2])} 
                className="w-40 h-40 object-contain transition-transform duration-500 group-hover:scale-105 filter drop-shadow-lg" 
                alt={products[2].name} 
              />
            </div>

            <div className="z-10 mt-2">
              <h2 className="text-md font-extrabold text-slate-900 leading-tight">{products[2].name}</h2>
              <div className="flex items-center justify-between mt-0.5">
                <p className="text-xs text-stone-400 font-bold">Boosted with bass</p>
                <p className="text-sm text-indigo-600 font-black">${products[2].price}</p>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  )
}
