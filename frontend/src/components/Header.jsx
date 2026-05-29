import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Header() {
  const {
    searchQuery,
    setSearchQuery,
    setIsCartOpen,
    cartTotalItems,
    wishlist,
    setIsWishlistOpen,
    user
  } = useCart()

  const iconButtons = (
    <>
      <button
        onClick={() => setIsCartOpen(true)}
        className="w-10 h-10 bg-inset border border-zinc-200 rounded-full flex items-center justify-center text-slate-800 hover:bg-surface-hover active:scale-95 transition-all shadow-sm relative cursor-pointer"
        aria-label="Open cart"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        {cartTotalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
            {cartTotalItems}
          </span>
        )}
      </button>

      <button
        onClick={() => setIsWishlistOpen(true)}
        className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all shadow-sm active:scale-95 cursor-pointer relative ${
          wishlist.length > 0
            ? 'bg-rose-50 border-rose-200 text-rose-500'
            : 'bg-inset border-zinc-200 text-slate-800 hover:bg-surface-hover'
        }`}
        aria-label="Open wishlist"
      >
        <svg className="w-5 h-5" fill={wishlist.length > 0 ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        {wishlist.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
            {wishlist.length}
          </span>
        )}
      </button>

      <Link
        to={user ? '/profile' : '/login'}
        className="w-10 h-10 flex items-center justify-center bg-inset border border-zinc-200 rounded-full shadow-sm hover:bg-surface-hover transition-all overflow-hidden shrink-0"
        aria-label={user ? 'Profile' : 'Sign in'}
      >
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
          className="w-full h-full object-cover"
          alt=""
        />
      </Link>
    </>
  )

  return (
    <header className="w-full z-10">
      {/* Mobile: logo + actions on one row, search below */}
      <div className="flex flex-col gap-3 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-1.5 text-slate-900 hover:opacity-90 min-w-0">
            <span className="bg-slate-900 text-white w-7 h-7 rounded-lg flex items-center justify-center font-serif text-lg font-black shrink-0">d</span>
            <span className="font-extrabold text-xl tracking-tighter truncate">devcart.</span>
          </Link>
          <div className="flex items-center gap-2 shrink-0">{iconButtons}</div>
        </div>
        <div className="relative w-full">
          <input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input rounded-full pl-5 pr-24 py-2.5 shadow-sm text-base"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-12 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-bold cursor-pointer"
              aria-label="Clear search"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-slate-950 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-slate-800 transition-colors"
            aria-label="Search"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop: three-column grid */}
      <div className="hidden md:grid md:grid-cols-[auto_1fr_auto] gap-4 items-center">
        <Link to="/" className="flex items-center gap-1.5 text-slate-900 hover:opacity-90 justify-self-start">
          <span className="bg-slate-900 text-white w-7 h-7 rounded-lg flex items-center justify-center font-serif text-lg font-black">d</span>
          <span className="font-extrabold text-2xl tracking-tighter">devcart.</span>
        </Link>

        <div className="relative w-full max-w-xl justify-self-center">
          <input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input rounded-full pl-5 pr-24 py-2.5 shadow-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-12 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-bold cursor-pointer"
              aria-label="Clear search"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-slate-950 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-slate-800 transition-colors"
            aria-label="Search"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2.5 justify-self-end">{iconButtons}</div>
      </div>
    </header>
  )
}
