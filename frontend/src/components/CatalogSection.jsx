import { useCart, getProductId } from '../context/CartContext'

export default function CatalogSection() {
  const {
    filteredProducts,
    categories,
    selectedCategory,
    setSelectedCategory,
    categoryIdToNameMap,
    getProductImage,
    setActiveProductDetail,
    catalogRef,
    toggleWishlist,
    isProductInWishlist
  } = useCart()

  return (
    <section ref={catalogRef} className="pt-10 border-t border-stone-200/50 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Explore Our Collection</h2>
          <p className="text-sm text-stone-500 font-medium">Find premium tech and accessories crafted for high performance.</p>
        </div>

        {/* Category Tags */}
        <div className="flex flex-wrap gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-stone-600 border border-stone-200/50 hover:bg-stone-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => (
            <div 
              key={getProductId(prod)} 
              className="bg-white rounded-3xl p-5 border border-stone-200/40 shadow-sm flex flex-col justify-between group transition-all duration-300 hover:shadow-md hover:scale-[1.01]"
            >
              {/* Image container */}
              <div className="h-44 w-full bg-[#fcfcf9] rounded-2xl flex items-center justify-center p-4 relative overflow-hidden mb-4">
                <img 
                  src={getProductImage(prod)} 
                  className="h-full object-contain transition-transform duration-500 group-hover:scale-105 filter drop-shadow-md" 
                  alt={prod.name} 
                />
                <span className="absolute top-3 left-3 bg-stone-100/80 backdrop-blur-xs text-[10px] text-stone-500 font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {categoryIdToNameMap[prod.category] || prod.category}
                </span>
                
                {/* Floating Heart Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleWishlist(prod)
                  }}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm active:scale-90 hover:scale-105 cursor-pointer ${
                    isProductInWishlist(getProductId(prod))
                      ? 'bg-rose-50 text-rose-500 border border-rose-100'
                      : 'bg-white/80 backdrop-blur-xs text-stone-500 hover:text-slate-800 border border-stone-200/30'
                  }`}
                  aria-label="Add to wishlist"
                >
                  <svg className="w-4 h-4" fill={isProductInWishlist(getProductId(prod)) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              {/* Product Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <h3 className="font-extrabold text-md text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                      {prod.name}
                    </h3>
                    <span className="font-black text-md text-indigo-600">${prod.price}</span>
                  </div>
                  <p className="text-xs text-stone-400 font-medium line-clamp-2 mb-4 leading-relaxed">
                    {prod.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                  <span className="text-[11px] font-bold text-stone-500 flex items-center gap-0.5">
                    ★ {prod.rating || 4.7}
                  </span>
                  <button
                    onClick={() => setActiveProductDetail(prod)}
                    className="bg-stone-900 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200/40">
          <span className="text-4xl">🔍</span>
          <h3 className="text-md font-bold text-slate-800 mt-3">No products match your criteria</h3>
          <p className="text-xs text-stone-400 mt-1">Try clearing your search query or picking a different category tag.</p>
        </div>
      )}
    </section>
  )
}
