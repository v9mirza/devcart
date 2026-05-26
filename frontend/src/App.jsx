import { useState, useMemo, useRef, useEffect } from 'react'
import blueHeadphones from './assets/blue_headphones.png'
import wirelessEarbuds from './assets/wireless_earbuds.png'
import vrHeadset from './assets/vr_headset.png'

// Fallback offline dataset
const PRODUCTS = [
  {
    id: 1,
    name: 'Sequoia Inspiring Musico',
    category: 'Headphones',
    price: 299,
    image: blueHeadphones,
    colors: ['blue', 'orange', 'green', 'red', 'teal'],
    description: 'Experience professional acoustic engineering. Built with dynamic 40mm drivers, active noise cancellation, and soft memory-foam cups for hours of luxurious listening.',
    rating: 4.8,
    reviewsCount: 1200
  },
  {
    id: 2,
    name: 'New Gen X-Bud',
    category: 'Earbuds',
    price: 149,
    image: wirelessEarbuds,
    colors: ['white', 'black', 'grey'],
    description: 'Sleek, splash-proof wireless earbuds featuring intelligent audio filters, ultra-clear microphones, and a dynamic 30-hour battery life charging case.',
    rating: 4.7,
    reviewsCount: 945
  },
  {
    id: 3,
    name: 'Aura VR Glass',
    category: 'VR & Tech',
    price: 499,
    image: vrHeadset,
    colors: ['white', 'black'],
    description: 'Immersive VR headset featuring dual 4K resolution screens, ultra-fast refresh rates, spatial sound, and smart spatial tracking controllers.',
    rating: 4.9,
    reviewsCount: 280
  },
  {
    id: 4,
    name: 'Surface Studio Headphone',
    category: 'Headphones',
    price: 349,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=600',
    colors: ['grey', 'black'],
    description: 'Delivers balanced sound, adjust up to 13 levels of noise cancellation, and use conversational controls to change tracks or summon virtual assistants.',
    rating: 4.6,
    reviewsCount: 430
  },
  {
    id: 5,
    name: 'Elite Active Smartwatch',
    category: 'VR & Tech',
    price: 199,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
    colors: ['black', 'silver', 'rose-gold'],
    description: 'Track workouts, heartbeat indices, sleep efficiency, and stay connected with integrated push alerts. Sleek metal frame with water-proof AMOLED glass screen.',
    rating: 4.5,
    reviewsCount: 710
  },
  {
    id: 6,
    name: 'Soundwave Mini Speaker',
    category: 'Accessories',
    price: 89,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=600',
    colors: ['black', 'blue', 'red'],
    description: 'Ultra-portable rugged waterproof Bluetooth speaker offering deep punchy bass, clear mids, and up to 12 hours of rich audio play-back.',
    rating: 4.7,
    reviewsCount: 580
  }
]

// Helper to get consistent product ID key from DB or offline array
const getProductId = (prod) => prod?._id || prod?.id

function App() {
  // Database states
  const [products, setProducts] = useState([])
  const [categoriesList, setCategoriesList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // E-commerce state variables
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [activeProductDetail, setActiveProductDetail] = useState(null)
  
  // Spotlight customizable options
  const [spotlightColor, setSpotlightColor] = useState('blue')
  const [likes, setLikes] = useState(460)
  const [hasLiked, setHasLiked] = useState(false)
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false)
  const [timeLeft, setTimeLeft] = useState(4 * 3600 + 12 * 60 + 9) // 4h 12m 9s

  // Ref to scroll to catalog section
  const catalogRef = useRef(null)

  // Fetch products and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [prodRes, catRes] = await Promise.all([
          fetch('http://localhost:5000/api/products?limit=100'),
          fetch('http://localhost:5000/api/categories')
        ])

        if (!prodRes.ok || !catRes.ok) {
          throw new Error('Server returned non-ok status')
        }

        const prodData = await prodRes.json()
        const catData = await catRes.json()

        setProducts(prodData.data || [])
        setCategoriesList(catData || [])
        setError(null)
      } catch (err) {
        console.warn('Backend server offline. Falling back to offline fallback data.', err)
        setProducts(PRODUCTS)
        setCategoriesList([
          { _id: 'Headphones', name: 'Headphones' },
          { _id: 'Earbuds', name: 'Earbuds' },
          { _id: 'VR & Tech', name: 'VR & Tech' },
          { _id: 'Accessories', name: 'Accessories' }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Timer interval countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Map category _id to name
  const categoryIdToNameMap = useMemo(() => {
    const map = {}
    categoriesList.forEach((cat) => {
      map[cat._id] = cat.name
    })
    return map
  }, [categoriesList])

  // Resolve dynamic category filter options
  const categories = useMemo(() => {
    const cats = new Set(
      products.map((p) => categoryIdToNameMap[p.category] || p.category)
    )
    return ['All', ...Array.from(cats)]
  }, [products, categoryIdToNameMap])

  // Spotlight product resolver
  const spotlightProduct = useMemo(() => {
    if (products.length === 0) return null
    const audioProd = products.find((p) => {
      const catName = categoryIdToNameMap[p.category] || p.category
      return catName.toLowerCase() === 'audio' || catName.toLowerCase() === 'headphones'
    })
    return audioProd || products[0]
  }, [products, categoryIdToNameMap])

  const colorsMap = {
    blue: 'bg-blue-600 ring-blue-600/30',
    orange: 'bg-orange-500 ring-orange-500/30',
    green: 'bg-green-600 ring-green-600/30',
    red: 'bg-red-500 ring-red-500/30',
    teal: 'bg-teal-400 ring-teal-400/30',
    white: 'bg-white ring-stone-200/50 border border-stone-200',
    black: 'bg-black ring-black/30',
    grey: 'bg-stone-400 ring-stone-400/30',
    silver: 'bg-slate-300 ring-slate-300/30',
    'rose-gold': 'bg-rose-200 ring-rose-200/30'
  }

  // Smart image resolver to map DB placeholders to local custom designs
  const getProductImage = (product) => {
    if (!product) return ''
    if (product.image === blueHeadphones) return blueHeadphones
    if (product.image === wirelessEarbuds) return wirelessEarbuds
    if (product.image === vrHeadset) return vrHeadset

    // Map keywords to premium local assets
    const nameLower = product.name.toLowerCase()
    if (nameLower.includes('headphone') && !nameLower.includes('surface') && !nameLower.includes('studio')) {
      return blueHeadphones
    }
    if (nameLower.includes('earbud') || nameLower.includes('x-bud')) {
      return wirelessEarbuds
    }
    if (nameLower.includes('vr') || nameLower.includes('glass') || nameLower.includes('headset')) {
      return vrHeadset
    }

    return product.image
  }

  // Get available colors for a product
  const getProductColors = (product) => {
    if (!product) return []
    return product.colors || ['blue', 'orange', 'green', 'red', 'teal']
  }

  // Filter products based on search query and category
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryName = categoryIdToNameMap[product.category] || product.category
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || categoryName === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [products, searchQuery, selectedCategory, categoryIdToNameMap])

  // Cart operations
  const addToCart = (product, color, quantity = 1, customPrice = null) => {
    setCart((prevCart) => {
      const targetPrice = customPrice !== null ? customPrice : product.price
      const existingItemIndex = prevCart.findIndex(
        (item) => getProductId(item.product) === getProductId(product) && 
                  item.color === color && 
                  (item.customPrice || item.product.price) === targetPrice
      )

      if (existingItemIndex > -1) {
        const newCart = [...prevCart]
        newCart[existingItemIndex].quantity += quantity
        return newCart
      } else {
        return [...prevCart, { product, color, quantity, customPrice }]
      }
    })
    setIsCartOpen(true)
    setActiveProductDetail(null) // Close modal if open
  }

  const updateCartQuantity = (productId, color, newQuantity, customPrice) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, color, customPrice)
      return
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        getProductId(item.product) === productId && item.color === color && item.customPrice === customPrice
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  const removeFromCart = (productId, color, customPrice) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(getProductId(item.product) === productId && item.color === color && item.customPrice === customPrice))
    )
  }

  const cartTotalItems = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }, [cart])

  const cartSubtotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.customPrice || item.product.price) * item.quantity, 0)
  }, [cart])

  const taxAmount = useMemo(() => Math.round(cartSubtotal * 0.08), [cartSubtotal])
  const shippingCost = cartSubtotal > 350 ? 0 : cartSubtotal > 0 ? 15 : 0
  const cartTotal = cartSubtotal + taxAmount + shippingCost

  const handleCheckout = () => {
    setShowCheckoutSuccess(true)
    setCart([])
  }

  const toggleLike = () => {
    if (hasLiked) {
      setLikes(likes - 1)
      setHasLiked(false)
    } else {
      setLikes(likes + 1)
      setHasLiked(true)
    }
  }

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, '0')}h : ${m.toString().padStart(2, '0')}m : ${s.toString().padStart(2, '0')}s`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eaede7] flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-sm font-bold text-slate-700">Connecting to DevCart Database...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#eaede7] text-slate-800 flex items-center justify-center p-4 md:p-8 font-sans selection:bg-[#d7f954]/50 selection:text-slate-900">
      
      {/* Main Container Dashboard */}
      <div className="w-full max-w-7xl bg-[#f5f6f2] rounded-[40px] border border-stone-200/50 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.12)] p-6 md:p-8 flex flex-col gap-8 relative">
        
        {/* Navigation / Header */}
        <header className="flex flex-col sm:flex-row gap-4 justify-between items-center w-full z-10">
          <div className="flex flex-wrap items-center gap-3">
            {/* Logo */}
            <a href="/" className="flex items-center gap-1.5 text-slate-900 hover:opacity-90 transition-opacity">
              <span className="bg-slate-900 text-white w-7 h-7 rounded-lg flex items-center justify-center font-serif text-lg font-black">d</span>
              <span className="font-extrabold text-2xl tracking-tighter">devcart.</span>
            </a>
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
            {/* Cart Icon trigger */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="w-11 h-11 bg-white border border-stone-200/50 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all shadow-sm relative"
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
            {/* Likes / Heart button */}
            <button 
              onClick={toggleLike}
              className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all shadow-sm active:scale-95 hover:scale-105 ${
                hasLiked 
                  ? 'bg-rose-50 border-rose-200 text-rose-500' 
                  : 'bg-white border-stone-200/50 text-slate-800 hover:bg-slate-50'
              }`}
            >
              <svg className="w-5 h-5" fill={hasLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            {/* Profile Avatar */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-stone-200/50 rounded-full shadow-sm">
              <span className="text-xs font-semibold text-slate-700 hidden sm:inline">Ryman Alex</span>
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" 
                className="w-7 h-7 rounded-full object-cover" 
                alt="Ryman Alex avatar" 
              />
            </div>
          </div>
        </header>

        {/* Bento Dashboard grid */}
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

        {/* FULL CATALOG SECTION */}
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

        {/* Footer */}
        <footer className="py-6 border-t border-stone-200/50 text-center text-xs text-stone-400 font-medium">
          <p>&copy; {new Date().getFullYear()} DevCart Inc. All rights reserved.</p>
        </footer>

      </div>

      {/* PRODUCT DETAIL MODAL */}
      {activeProductDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            onClick={() => setActiveProductDetail(null)} 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Modal Container */}
          <div className="bg-[#fcfcf9] rounded-[32px] w-full max-w-2xl border border-stone-200/50 shadow-2xl relative overflow-hidden z-10 flex flex-col md:flex-row max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible">
            {/* Left Column: Image Area */}
            <div className="md:w-1/2 bg-[#f5f6f2] p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-stone-200/30">
              <img 
                src={getProductImage(activeProductDetail)} 
                className="max-h-60 md:max-h-80 object-contain filter drop-shadow-xl" 
                alt={activeProductDetail.name} 
              />
            </div>

            {/* Right Column: Info Area */}
            <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between gap-6">
              <div>
                <div className="flex justify-between items-start gap-4 mb-2">
                  <div>
                    <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {categoryIdToNameMap[activeProductDetail.category] || activeProductDetail.category}
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 mt-2 leading-tight">
                      {activeProductDetail.name}
                    </h2>
                  </div>
                  <span className="text-xl font-black text-indigo-600">${activeProductDetail.price}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-stone-500 font-bold mb-4">
                  <span className="text-yellow-500">★</span> 
                  <span className="text-slate-800">{activeProductDetail.rating || 4.7}</span> 
                  <span>({activeProductDetail.reviewsCount || 100} reviews)</span>
                </div>

                <p className="text-xs text-stone-500 leading-relaxed font-medium mb-6">
                  {activeProductDetail.description}
                </p>

                {/* Color Selector */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-800 mb-2.5 uppercase tracking-wider">Colors available</h4>
                  <div className="flex gap-2.5">
                    {getProductColors(activeProductDetail).map((colorName) => (
                      <button
                        key={colorName}
                        onClick={() => {
                          setActiveProductDetail(prev => ({...prev, selectedColor: colorName}))
                        }}
                        className={`w-7 h-7 rounded-full ${colorsMap[colorName]} transition-all duration-200 cursor-pointer ${
                          (activeProductDetail.selectedColor || getProductColors(activeProductDetail)[0]) === colorName 
                            ? 'ring-4 scale-110 shadow-xs' 
                            : 'opacity-80 hover:opacity-100'
                        }`}
                        aria-label={`Select color ${colorName}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Add to Cart Footer block */}
              <div className="flex gap-3">
                <button
                  onClick={() => addToCart(
                    activeProductDetail, 
                    activeProductDetail.selectedColor || getProductColors(activeProductDetail)[0], 
                    1
                  )}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-full text-center shadow-md cursor-pointer transition-transform duration-200 hover:scale-[1.02] active:scale-98"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => setActiveProductDetail(null)}
                  className="px-5 py-3 border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 font-bold rounded-full cursor-pointer transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Close Cross button */}
            <button
              onClick={() => setActiveProductDetail(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* SLIDE-OVER CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Overlay backdrop */}
          <div 
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Slide panel */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white border-l border-stone-200/50 shadow-2xl flex flex-col justify-between">
              
              {/* Header */}
              <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <h2 className="text-lg font-black text-slate-900">Your Cart</h2>
                  <span className="text-xs bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded-full">
                    {cartTotalItems}
                  </span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
                >
                  ×
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-stone-100">
                {cart.length > 0 ? (
                  cart.map((item, idx) => (
                    <div key={`${getProductId(item.product)}-${item.color}-${idx}`} className="py-4.5 flex gap-4 items-center">
                      {/* Thumbnail */}
                      <div className="w-16 h-16 bg-stone-100 rounded-xl overflow-hidden flex items-center justify-center p-1.5 flex-shrink-0">
                        <img src={getProductImage(item.product)} className="object-contain w-full h-full" alt="" />
                      </div>
                      
                      {/* Metadata */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-extrabold text-sm text-slate-900 truncate leading-snug">
                          {item.product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`w-3.5 h-3.5 rounded-full ${colorsMap[item.color]}`} />
                          <span className="text-xs text-stone-400 capitalize font-bold">{item.color}</span>
                        </div>
                        <span className="block text-xs font-black text-indigo-600 mt-1.5">${item.customPrice || item.product.price}</span>
                      </div>

                      {/* Quantity Actions */}
                      <div className="flex flex-col items-end gap-2.5">
                        <div className="flex items-center border border-stone-200 rounded-full px-2 py-1 bg-white">
                          <button
                            onClick={() => updateCartQuantity(getProductId(item.product), item.color, item.quantity - 1, item.customPrice)}
                            className="w-5 h-5 rounded-full flex items-center justify-center text-slate-600 hover:bg-stone-100 font-black cursor-pointer text-xs"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-xs font-extrabold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(getProductId(item.product), item.color, item.quantity + 1, item.customPrice)}
                            className="w-5 h-5 rounded-full flex items-center justify-center text-slate-600 hover:bg-stone-100 font-black cursor-pointer text-xs"
                          >
                            +
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(getProductId(item.product), item.color, item.customPrice)}
                          className="text-xs text-stone-400 hover:text-red-500 font-bold transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <span className="text-4xl mb-4">🛒</span>
                    <h4 className="text-sm font-bold text-slate-800">Your cart is empty</h4>
                    <p className="text-xs text-stone-400 mt-1.5 max-w-[200px]">Fill it with high-end tech products from our dashboard.</p>
                  </div>
                )}
              </div>

              {/* Drawer footer summary */}
              {cart.length > 0 && (
                <div className="px-6 py-6 bg-stone-50 border-t border-stone-100 flex flex-col gap-4">
                  <div className="flex flex-col gap-2.5 text-sm font-bold text-stone-500">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-slate-800">${cartSubtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (8%)</span>
                      <span className="text-slate-800">${taxAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-slate-800">
                        {shippingCost === 0 ? 'FREE' : `$${shippingCost}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-base text-slate-900 font-black border-t border-stone-200/60 pt-3.5">
                      <span>Total Amount</span>
                      <span className="text-indigo-600">${cartTotal}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-3.5 rounded-full text-center shadow-lg transition-transform duration-200 hover:scale-[1.01] active:scale-99 cursor-pointer mt-2"
                  >
                    Checkout Simulation
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT SUCCESS MODAL */}
      {showCheckoutSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setShowCheckoutSuccess(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
          />

          <div className="bg-[#fcfcf9] rounded-[32px] w-full max-w-sm border border-stone-200/50 shadow-2xl relative overflow-hidden z-10 p-8 flex flex-col items-center text-center">
            <span className="text-5xl mb-4 animate-bounce">🎉</span>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Order Confirmed!</h2>
            <p className="text-xs text-stone-500 font-medium leading-relaxed mb-6">
              Thank you for shopping with DevCart. Your simulation order has been processed successfully.
            </p>
            <button
              onClick={() => setShowCheckoutSuccess(false)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-full cursor-pointer transition-transform hover:scale-[1.02]"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default App
