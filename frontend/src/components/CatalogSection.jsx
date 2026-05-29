import { useMemo, useState } from 'react'
import { useCart, getProductId } from '../context/CartContext'
import ProductImage from './ProductImage'

export default function CatalogSection() {
  const [sortBy, setSortBy] = useState('featured')
  const {
    loading,
    error,
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

  const displayedProducts = useMemo(() => {
    const list = [...filteredProducts]
    switch (sortBy) {
      case 'price-low-high':
        return list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0))
      case 'price-high-low':
        return list.sort((a, b) => Number(b.price || 0) - Number(a.price || 0))
      case 'rating-high':
        return list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
      case 'name-az':
        return list.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')))
      default:
        return list
    }
  }, [filteredProducts, sortBy])

  const SkeletonCard = ({ idx }) => (
    <div
      key={idx}
      className="bg-inset rounded-[22px] p-5 border border-stone-300/40 shadow-sm flex flex-col justify-between animate-pulse"
    >
      <div className="h-44 w-full bg-stone-100 rounded-[18px] mb-4" />
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2 mb-3">
            <div className="h-4 w-40 bg-stone-100 rounded" />
            <div className="h-4 w-12 bg-stone-100 rounded" />
          </div>
          <div className="h-3 w-full bg-stone-100 rounded mb-2" />
          <div className="h-3 w-2/3 bg-stone-100 rounded mb-4" />
        </div>
        <div className="flex items-center justify-between border-t border-stone-100 pt-3">
          <div className="h-3 w-16 bg-stone-100 rounded" />
          <div className="h-8 w-24 bg-stone-100 rounded-full" />
        </div>
      </div>
    </div>
  )

  return (
    <section ref={catalogRef} className="pt-10 border-t border-stone-200/50 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Explore Our Collection</h2>
          <p className="text-sm text-stone-500 font-medium">
            Find premium tech and accessories crafted for high performance.
            {!loading && <span className="ml-1">Showing {displayedProducts.length} items.</span>}
          </p>
        </div>

        {/* Category Tags */}
        <div className="flex flex-wrap gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              disabled={loading}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-inset text-stone-600 border border-zinc-200 hover:bg-surface-hover'
              } ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => setSelectedCategory('All')}
          className="text-xs font-semibold px-3 py-1.5 rounded-full border border-zinc-200 bg-inset text-stone-600 hover:bg-surface-hover transition-colors cursor-pointer"
        >
          Reset filters
        </button>
        <label className="flex items-center gap-2 text-xs font-semibold text-stone-600">
          Sort by
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-full border border-stone-300/70 bg-inset text-stone-700 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <option value="featured">Featured</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="rating-high">Top Rated</option>
            <option value="name-az">Name: A-Z</option>
          </select>
        </label>
      </div>

      {/* Dynamic Grid */}
      {error && !loading ? (
        <div className="text-center py-10 bg-inset rounded-[22px] border border-stone-300/40">
          <h3 className="text-md font-bold text-slate-800">We couldn’t load the latest products.</h3>
          <p className="text-xs text-stone-400 mt-1">You can still browse what’s available right now.</p>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonCard key={idx} idx={idx} />
          ))}
        </div>
      ) : displayedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {displayedProducts.map((prod) => (
            <div 
              key={getProductId(prod)} 
              className="bg-inset rounded-[22px] p-4 sm:p-5 border border-zinc-200/80 shadow-sm flex flex-col justify-between group transition-all duration-300 hover:shadow-md md:hover:scale-[1.01]"
            >
              <div className="h-40 sm:h-44 w-full bg-surface rounded-[18px] border border-zinc-200/60 flex items-center justify-center p-4 relative overflow-hidden mb-4">
                <ProductImage
                  product={prod}
                  getProductImage={getProductImage}
                  className="h-full max-h-full w-full object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-md"
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
                    <h3 className="font-extrabold text-md text-slate-900 group-hover:text-slate-700 transition-colors leading-tight">
                      {prod.name}
                    </h3>
                    <span className="font-black text-md text-slate-900">${prod.price}</span>
                  </div>
                  <p className="text-xs text-stone-500 font-medium line-clamp-3 sm:line-clamp-2 mb-3 leading-relaxed">
                    {prod.description || 'Premium quality product with fast shipping and easy returns.'}
                  </p>
                  {/* Stock badge */}
                  {prod.countInStock !== undefined && (
                    <span className={`inline-block text-[10px] font-extrabold px-2.5 py-1 rounded-full mb-3 ${
                      prod.countInStock === 0
                        ? 'bg-red-50 text-red-500 border border-red-100'
                        : prod.countInStock <= 5
                        ? 'bg-amber-50 text-amber-600 border border-amber-100'
                        : 'bg-green-50 text-green-600 border border-green-100'
                    }`}>
                      {prod.countInStock === 0 ? '✕ Out of Stock' : prod.countInStock <= 5 ? `⚠ Low Stock (${prod.countInStock} left)` : `✓ In Stock`}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                  <span className="text-[11px] font-bold text-stone-500 flex items-center gap-0.5">
                    ★ {prod.rating || 4.7}
                  </span>
                  <button
                    onClick={() => setActiveProductDetail(prod)}
                    disabled={prod.countInStock === 0}
                    className="bg-stone-900 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {prod.countInStock === 0 ? 'Unavailable' : 'Details'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-inset rounded-[22px] border border-stone-300/40">
          <div className="w-14 h-14 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-md font-bold text-slate-800 mt-3">No products match your criteria</h3>
          <p className="text-xs text-stone-400 mt-1">Try clearing your search query or picking a different category tag.</p>
        </div>
      )}
    </section>
  )
}
