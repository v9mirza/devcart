import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import UserAvatar from './UserAvatar'

function SearchField({ compact = false, searchQuery, setSearchQuery }) {
  return (
    <div className="relative w-full min-w-0">
      <input
        type="search"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={`form-input rounded-full w-full shadow-sm ${
          compact
            ? 'py-2 pl-4 pr-11 text-sm'
            : 'py-2.5 pl-5 pr-24 text-base md:text-sm'
        }`}
      />
      {searchQuery && !compact && (
        <button
          type="button"
          onClick={() => setSearchQuery('')}
          className="absolute right-12 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-bold cursor-pointer"
          aria-label="Clear search"
        >
          Clear
        </button>
      )}
      {searchQuery && compact && (
        <button
          type="button"
          onClick={() => setSearchQuery('')}
          className="absolute right-11 top-1/2 -translate-y-1/2 w-6 h-6 text-stone-400 hover:text-stone-600 flex items-center justify-center cursor-pointer"
          aria-label="Clear search"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      <button
        type="button"
        className={`absolute right-1 top-1/2 -translate-y-1/2 bg-accent text-accent-foreground rounded-full flex items-center justify-center cursor-pointer hover:bg-accent-hover transition-colors ${
          compact ? 'w-8 h-8' : 'w-9 h-9'
        }`}
        aria-label="Search"
      >
        <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>
  )
}

export default function Header({ compact = false }) {
  const {
    searchQuery,
    setSearchQuery,
    setIsCartOpen,
    cartTotalItems,
    cartBadgePulse,
    wishlist,
    setIsWishlistOpen,
    user
  } = useCart()

  const iconSize = compact ? 'w-9 h-9' : 'w-10 h-10'
  const badgeRing = compact ? 'ring-1 ring-white' : 'ring-2 ring-white'

  const iconButtons = (
    <div className={`flex items-center shrink-0 ${compact ? 'gap-1' : 'gap-2'}`}>
      <button
        type="button"
        data-cart-target
        onClick={() => setIsCartOpen(true)}
        className={`${iconSize} bg-inset border border-zinc-200 rounded-full flex items-center justify-center text-slate-800 hover:bg-surface-hover active:scale-95 transition-all shadow-sm relative cursor-pointer ${
          cartBadgePulse ? 'animate-cart-icon-bounce' : ''
        }`}
        aria-label="Open cart"
      >
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        {cartTotalItems > 0 && (
          <span
            className={`absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[9px] font-black min-w-[16px] h-4 px-0.5 rounded-full flex items-center justify-center ${badgeRing} ${
              cartBadgePulse ? 'animate-cart-badge-pulse' : ''
            }`}
          >
            {cartTotalItems}
          </span>
        )}
      </button>

      <button
        onClick={() => setIsWishlistOpen(true)}
        className={`${iconSize} rounded-full flex items-center justify-center border transition-all shadow-sm active:scale-95 cursor-pointer relative ${
          wishlist.length > 0
            ? 'bg-rose-50 border-rose-200 text-rose-500'
            : 'bg-inset border-zinc-200 text-slate-800 hover:bg-surface-hover'
        }`}
        aria-label="Open wishlist"
      >
        <svg className="w-[18px] h-[18px]" fill={wishlist.length > 0 ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        {wishlist.length > 0 && (
          <span
            className={`absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-black min-w-[16px] h-4 px-0.5 rounded-full flex items-center justify-center ${badgeRing}`}
          >
            {wishlist.length}
          </span>
        )}
      </button>

      {user ? (
        <Link
          to="/profile"
          className={`${iconSize} flex items-center justify-center rounded-full shadow-sm hover:opacity-90 transition-all shrink-0 ring-2 ring-white`}
          aria-label={`Profile (${user.name || user.email})`}
        >
          <UserAvatar
            user={user}
            className="w-full h-full"
            textClassName={compact ? 'text-xs' : 'text-sm'}
          />
        </Link>
      ) : (
        <Link
          to="/login"
          className={`shrink-0 inline-flex items-center justify-center font-bold text-accent-foreground bg-accent hover:bg-accent-hover rounded-full shadow-sm transition-all active:scale-[0.98] ${
            compact ? 'h-9 px-3.5 text-xs' : 'h-10 px-4 text-sm'
          }`}
        >
          Sign in
        </Link>
      )}
    </div>
  )

  const logoMark = (showWordmark = true) => (
    <Link to="/" className="flex items-center gap-1.5 text-slate-900 hover:opacity-90 shrink-0 min-w-0">
      <span
        className={`bg-accent text-accent-foreground rounded-lg flex items-center justify-center font-serif font-black shrink-0 ${
          compact ? 'w-8 h-8 text-base' : 'w-7 h-7 text-lg'
        }`}
      >
        d
      </span>
      {showWordmark && (
        <span
          className={`font-extrabold tracking-tighter truncate ${
            compact ? 'text-sm sm:text-base' : 'text-xl'
          }`}
        >
          devcart.
        </span>
      )}
    </Link>
  )

  return (
    <header className="w-full">
      {/* Mobile: compact single row when sticky/pinned */}
      <div className={`md:hidden ${compact ? 'flex items-center gap-2' : 'flex flex-col gap-2.5'}`}>
        {compact ? (
          <>
            {logoMark(true)}
            <SearchField compact searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            {iconButtons}
          </>
        ) : (
          <>
            <div className="flex items-center justify-between gap-2 min-w-0">
              {logoMark(true)}
              {iconButtons}
            </div>
            <SearchField searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden md:grid md:grid-cols-[auto_1fr_auto] gap-4 items-center">
        {logoMark(true)}
        <div className="relative w-full max-w-xl justify-self-center">
          <SearchField searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
        {iconButtons}
      </div>
    </header>
  )
}
