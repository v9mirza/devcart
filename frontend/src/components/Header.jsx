import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Header() {
  const { 
    searchQuery, 
    setSearchQuery, 
    setIsCartOpen, 
    cartTotalItems, 
    hasLiked, 
    toggleLike,
    user
  } = useCart()

  return (
    <header className="flex flex-col sm:flex-row gap-4 justify-between items-center w-full z-10">
      <div className="flex flex-wrap items-center gap-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5 text-slate-900 hover:opacity-90 transition-opacity">
          <span className="bg-slate-900 text-white w-7 h-7 rounded-lg flex items-center justify-center font-serif text-lg font-black">d</span>
          <span className="font-extrabold text-2xl tracking-tighter">devcart.</span>
        </Link>
        {/* Search */}
        <div className="relative ml-2">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white border border-stone-200/50 pl-5 pr-10 py-2.5 rounded-full text-sm font-medium w-64 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all shadow-sm"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-3">
        {/* Cart Trigger */}
        <button 
          onClick={() => setIsCartOpen(true)}
          className="w-11 h-11 bg-white border border-stone-200/50 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all shadow-sm relative cursor-pointer"
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
        {/* Likes Button */}
        <button 
          onClick={toggleLike}
          className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all shadow-sm active:scale-95 hover:scale-105 cursor-pointer ${
            hasLiked 
              ? 'bg-rose-50 border-rose-200 text-rose-500' 
              : 'bg-white border-stone-200/50 text-slate-800 hover:bg-slate-50'
          }`}
        >
          <svg className="w-5 h-5" fill={hasLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        {/* Profile Navigation */}
        {user ? (
          <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 bg-white border border-stone-200/50 rounded-full shadow-sm hover:bg-slate-50 hover:scale-[1.02] active:scale-98 transition-all">
            <span className="text-xs font-semibold text-slate-700 hidden sm:inline">{user.name}</span>
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" 
              className="w-7 h-7 rounded-full object-cover" 
              alt={`${user.name} avatar`} 
            />
          </Link>
        ) : (
          <Link to="/login" className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-full shadow-sm hover:scale-[1.02] active:scale-98 transition-all cursor-pointer">
            Sign In
          </Link>
        )}
      </div>
    </header>
  )
}
