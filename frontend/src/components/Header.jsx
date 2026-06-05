import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProductId, useCart } from '../context/CartContext'
import { productMatchesSearch, productSearchRank } from '../utils/productSearch'
import ProductImage from './ProductImage'
import UserAvatar from './UserAvatar'

const SUGGESTION_LIMIT = 5

function SearchField({
  variant = 'default',
  searchQuery,
  setSearchQuery,
  products,
  loading,
  categoryIdToNameMap,
  getProductImage,
  setActiveProductDetail,
  scrollToCatalog
}) {
  const isMobile = variant === 'mobile'
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  const matchingProducts = useMemo(() => {
    const query = searchQuery.trim()
    if (!query) return []

    return products
      .filter((product) => {
        const categoryName = categoryIdToNameMap[product.category] || product.category
        return productMatchesSearch(product, query, categoryName)
      })
      .sort((a, b) => {
        const catA = categoryIdToNameMap[a.category] || a.category
        const catB = categoryIdToNameMap[b.category] || b.category
        return (
          productSearchRank(a, query, catA) - productSearchRank(b, query, catB) ||
          String(a.name || '').localeCompare(String(b.name || ''))
        )
      })
  }, [products, searchQuery, categoryIdToNameMap])

  const suggestions = matchingProducts.slice(0, SUGGESTION_LIMIT)
  const showDropdown = isOpen && searchQuery.trim().length > 0 && !loading

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  const handleClear = () => {
    setSearchQuery('')
    setIsOpen(false)
  }

  const handleSelectProduct = (product) => {
    setActiveProductDetail(product)
    setIsOpen(false)
  }

  const handleViewAll = () => {
    scrollToCatalog()
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative w-full min-w-0">
      <input
        type="text"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        spellCheck={false}
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setIsOpen(false)
          if (e.key === 'Enter' && searchQuery.trim()) handleViewAll()
        }}
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls="search-suggestions"
        aria-autocomplete="list"
        className={
          isMobile
            ? 'w-full rounded-full border bg-white font-medium text-slate-800 shadow-[0_2px_14px_-6px_rgba(13,148,136,0.14)] transition-all placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-accent py-3 pl-4 pr-12 text-[15px] border-teal-200/90'
            : 'form-input rounded-full w-full shadow-sm py-2.5 pl-5 pr-24 text-base md:text-sm'
        }
      />
      {searchQuery && !isMobile && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-12 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-bold cursor-pointer"
          aria-label="Clear search"
        >
          Clear
        </button>
      )}
      {searchQuery && isMobile && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-11 top-1/2 -translate-y-1/2 w-7 h-7 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full flex items-center justify-center cursor-pointer transition-colors"
          aria-label="Clear search"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      <button
        type="button"
        onClick={() => {
          if (searchQuery.trim()) handleViewAll()
        }}
        className={`absolute right-1 top-1/2 -translate-y-1/2 bg-accent text-accent-foreground rounded-full flex items-center justify-center cursor-pointer hover:bg-accent-hover transition-all active:scale-95 ${
          isMobile ? 'w-9 h-9 shadow-sm shadow-teal-900/15' : 'w-9 h-9'
        }`}
        aria-label="Search"
      >
        <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {showDropdown && (
        <div
          id="search-suggestions"
          role="listbox"
          className={`absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[60] overflow-hidden border border-zinc-200/90 bg-white ${
            isMobile
              ? 'rounded-2xl shadow-[0_20px_48px_-16px_rgba(15,23,42,0.22)]'
              : 'rounded-[18px] shadow-[0_16px_40px_-16px_rgba(15,23,42,0.28)]'
          }`}
        >
          {suggestions.length > 0 ? (
            <ul className="max-h-[min(20rem,60vh)] overflow-y-auto py-1.5">
              {suggestions.map((product) => (
                <li key={getProductId(product)}>
                  <button
                    type="button"
                    role="option"
                    onClick={() => handleSelectProduct(product)}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-surface-hover transition-colors cursor-pointer"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-200/70 bg-surface p-1.5">
                      <ProductImage
                        product={product}
                        getProductImage={getProductImage}
                        className="h-full w-full object-contain"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-slate-900">{product.name}</span>
                      <span className="block truncate text-[11px] font-semibold text-stone-500">
                        {categoryIdToNameMap[product.category] || product.category}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-black text-slate-900">${product.price}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-5 text-center">
              <p className="text-sm font-bold text-slate-800">No products found</p>
              <p className="mt-1 text-xs text-stone-500">Try a different search term.</p>
            </div>
          )}

          {matchingProducts.length > 0 && (
            <button
              type="button"
              onClick={handleViewAll}
              className="flex w-full items-center justify-center gap-1 border-t border-stone-100 bg-inset px-4 py-3 text-xs font-bold text-accent hover:bg-surface-hover transition-colors cursor-pointer"
            >
              View all {matchingProducts.length} result{matchingProducts.length === 1 ? '' : 's'}
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function Header() {
  const {
    searchQuery,
    setSearchQuery,
    products,
    loading,
    categoryIdToNameMap,
    getProductImage,
    setActiveProductDetail,
    scrollToCatalog,
    setIsCartOpen,
    cartTotalItems,
    cartBadgePulse,
    wishlist,
    setIsWishlistOpen,
    user
  } = useCart()

  const searchFieldProps = {
    searchQuery,
    setSearchQuery,
    products,
    loading,
    categoryIdToNameMap,
    getProductImage,
    setActiveProductDetail,
    scrollToCatalog
  }

  const iconBtnClass =
    'w-10 h-10 rounded-full flex items-center justify-center text-slate-700 border border-zinc-200/90 bg-white hover:bg-surface-hover hover:border-teal-200/60 active:scale-95 transition-all shadow-[0_1px_4px_rgba(15,23,42,0.06)] relative cursor-pointer'

  const iconButtons = (mobile = false) => (
    <div className={`flex items-center shrink-0 ${mobile ? 'gap-1.5' : 'gap-2'}`}>
      <button
        type="button"
        data-cart-target
        onClick={() => setIsCartOpen(true)}
        className={`${iconBtnClass} ${cartBadgePulse ? 'animate-cart-icon-bounce' : ''}`}
        aria-label="Open cart"
      >
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        {cartTotalItems > 0 && (
          <span
            className={`absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[9px] font-black min-w-[16px] h-4 px-0.5 rounded-full flex items-center justify-center ring-2 ring-white ${
              cartBadgePulse ? 'animate-cart-badge-pulse' : ''
            }`}
          >
            {cartTotalItems}
          </span>
        )}
      </button>

      <button
        onClick={() => setIsWishlistOpen(true)}
        className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all active:scale-95 cursor-pointer relative shadow-[0_1px_4px_rgba(15,23,42,0.06)] ${
          wishlist.length > 0
            ? 'bg-rose-50 border-rose-200 text-rose-500 hover:bg-rose-100/80'
            : iconBtnClass
        }`}
        aria-label="Open wishlist"
      >
        <svg className="w-[18px] h-[18px]" fill={wishlist.length > 0 ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        {wishlist.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-black min-w-[16px] h-4 px-0.5 rounded-full flex items-center justify-center ring-2 ring-white">
            {wishlist.length}
          </span>
        )}
      </button>

      {user ? (
        <Link
          to="/profile"
          className="w-10 h-10 flex items-center justify-center rounded-full shadow-sm hover:opacity-90 transition-all shrink-0 ring-2 ring-white"
          aria-label={`Profile (${user.name || user.email})`}
        >
          <UserAvatar user={user} className="w-full h-full" textClassName="text-sm" />
        </Link>
      ) : (
        <Link
          to="/login"
          className="shrink-0 inline-flex items-center justify-center h-10 px-4 text-sm font-bold text-accent-foreground bg-accent hover:bg-accent-hover rounded-full shadow-[0_2px_10px_-4px_rgba(13,148,136,0.45)] transition-all active:scale-[0.98]"
        >
          Sign in
        </Link>
      )}
    </div>
  )

  const logoMark = (showWordmark = true, mobile = false) => (
    <Link to="/" className="flex items-center gap-2 text-slate-900 hover:opacity-90 shrink-0 min-w-0 group">
      <span
        className={`bg-accent text-accent-foreground rounded-[10px] flex items-center justify-center font-serif font-black shrink-0 shadow-[0_2px_8px_-2px_rgba(13,148,136,0.35)] transition-transform group-active:scale-95 ${
          mobile ? 'w-9 h-9 text-lg' : 'w-7 h-7 text-lg'
        }`}
      >
        d
      </span>
      {showWordmark && (
        <span className={`font-extrabold tracking-tighter truncate ${mobile ? 'text-xl' : 'text-xl'}`}>
          devcart.
        </span>
      )}
    </Link>
  )

  return (
    <header className="w-full">
      <div className="md:hidden flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3 min-w-0">
          {logoMark(true, true)}
          {iconButtons(true)}
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-200/70 to-transparent" aria-hidden />
        <SearchField variant="mobile" {...searchFieldProps} />
      </div>

      <div className="hidden md:grid md:grid-cols-[auto_1fr_auto] gap-4 items-center">
        {logoMark(true)}
        <div className="relative w-full max-w-xl justify-self-center">
          <SearchField {...searchFieldProps} />
        </div>
        {iconButtons()}
      </div>
    </header>
  )
}
