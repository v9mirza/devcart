import { createContext, useContext, useState, useMemo, useEffect, useRef } from 'react'
import { calculateCartPricing } from '../utils/pricing'
import { productMatchesSearch } from '../utils/productSearch'
import vrHeadset from '../assets/vr_headset.png'
import blueHeadphones from '../assets/blue_headphones.png'
import wirelessEarbuds from '../assets/wireless_earbuds.png'

const CartContext = createContext()

const OFFLINE_PRODUCTS = [
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

export const getProductId = (prod) => prod?._id || prod?.id

const isValidObjectId = (id) => typeof id === 'string' && /^[a-f0-9]{24}$/i.test(id)

export function CartProvider({ children }) {
  // Database states
  const [products, setProducts] = useState([])
  const [categoriesList, setCategoriesList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isBackendOnline, setIsBackendOnline] = useState(true)
  const [cartSyncError, setCartSyncError] = useState(null)

  // Auth state
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('devcart_user')
    try {
      return savedUser ? JSON.parse(savedUser) : null
    } catch {
      return null
    }
  })

  // E-commerce state variables
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [wishlist, setWishlist] = useState([])
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [activeProductDetail, setActiveProductDetail] = useState(null)
  
  // Spotlight options
  const [likes, setLikes] = useState(460)
  const [hasLiked, setHasLiked] = useState(false)
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false)
  const [checkoutSuccessMode, setCheckoutSuccessMode] = useState('demo')
  const [lastOrderId, setLastOrderId] = useState(null)
  const [cartToast, setCartToast] = useState(null)
  const [cartBadgePulse, setCartBadgePulse] = useState(false)
  const [flyToCartSignal, setFlyToCartSignal] = useState(0)
  const toastTimerRef = useRef(null)
  const pulseTimerRef = useRef(null)
  const [cartPricing, setCartPricing] = useState({
    itemsPrice: 0,
    taxPrice: 0,
    shippingPrice: 0,
    totalPrice: 0
  })
  const catalogRef = useRef(null)
  const authSyncRef = useRef(false)

  const notifyAddedToCart = (product) => {
    setCartToast({ message: 'Added to cart', name: product?.name })
    setCartBadgePulse(true)
    setFlyToCartSignal((n) => n + 1)
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current)
    toastTimerRef.current = setTimeout(() => setCartToast(null), 3200)
    pulseTimerRef.current = setTimeout(() => setCartBadgePulse(false), 650)
  }

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const openProductDetail = (product, event) => {
    if (!product) return
    setActiveProductDetail(product)
  }

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
        setIsBackendOnline(true)
      } catch (err) {
        console.warn('Backend server offline. Falling back to offline fallback data.', err)
        setProducts(OFFLINE_PRODUCTS)
        setCategoriesList([
          { _id: 'Headphones', name: 'Headphones' },
          { _id: 'Earbuds', name: 'Earbuds' },
          { _id: 'VR & Tech', name: 'VR & Tech' },
          { _id: 'Accessories', name: 'Accessories' }
        ])
        setIsBackendOnline(false)
        setError('Server offline. Browse is available, but checkout is disabled.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
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

  // Filtered products list based on search and category selections
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const catName = categoryIdToNameMap[p.category] || p.category
      const matchesCategory = selectedCategory === 'All' || catName === selectedCategory
      const matchesSearch = productMatchesSearch(p, searchQuery, catName)
      return matchesCategory && matchesSearch
    })
  }, [products, selectedCategory, searchQuery, categoryIdToNameMap])

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

  // Prefer real product URLs from the database; only fall back to local assets offline.
  const getProductImage = (product) => {
    if (!product) return blueHeadphones
    const productName = String(product.name || '').toLowerCase()

    if (productName.includes('x-bud') || productName.includes('earbud')) {
      return wirelessEarbuds
    }
    if (
      productName.includes('sequoia') ||
      productName.includes('musico') ||
      productName.includes('wireless headset')
    ) {
      return blueHeadphones
    }
    if (productName.includes('vr') || productName.includes('aura')) {
      return vrHeadset
    }
    if (productName.includes('headphone') || productName.includes('headset') || productName.includes('surface')) {
      return blueHeadphones
    }

    const image = product.image
    if (typeof image === 'string' && image.length > 0) {
      if (image.includes('source.unsplash.com')) return blueHeadphones
      if (/^https?:\/\//.test(image)) return image
    }
    return image || blueHeadphones
  }

  const getProductColors = (product) => {
    if (!product) return []
    return product.colors || ['blue', 'orange', 'green', 'red', 'teal']
  }

  // Refresh user data from server (keeps localStorage in sync with DB)
  const refreshUser = async () => {
    const token = localStorage.getItem('devcart_token')
    if (!token) return
    try {
      const res = await fetch('http://localhost:5000/api/users/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const freshUser = await res.json()
        const userData = {
          id: freshUser._id || freshUser.id,
          name: freshUser.name,
          email: freshUser.email,
          isAdmin: freshUser.isAdmin,
          createdAt: freshUser.createdAt,
          shippingAddress: freshUser.shippingAddress || { address: '', city: '', postalCode: '', country: '' }
        }
        localStorage.setItem('devcart_user', JSON.stringify(userData))
        setUser(userData)
      } else if (res.status === 401) {
        logout()
      }
    } catch (err) {
      console.warn('Failed to refresh user, using cached data.', err)
    }
  }

  const resolveCartLineProduct = (item) => {
    const productId = String(item.product?._id || item.product || '')
    const fromCatalog = products.find((p) => String(getProductId(p)) === productId)
    if (fromCatalog) return fromCatalog
    if (!item.name) return null
    return {
      _id: productId,
      id: productId,
      name: item.name,
      image: item.image,
      price: item.price,
      description: item.description || ''
    }
  }

  // Helper to fetch cart from backend
  const fetchDbCart = async () => {
    const token = localStorage.getItem('devcart_token')
    if (!token || !user) return
    try {
      const res = await fetch('http://localhost:5000/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (res.ok) {
        const dbCart = await res.json()
        if (dbCart && dbCart.items) {
          const mappedItems = dbCart.items
            .map((item) => {
              const fullProduct = resolveCartLineProduct(item)
              if (!fullProduct) return null
              return {
                product: fullProduct,
                quantity: item.qty
              }
            })
            .filter(Boolean)
          setCart(mappedItems)
          setCartPricing({
            itemsPrice: dbCart.summary?.itemsPrice || 0,
            taxPrice: dbCart.summary?.taxPrice || 0,
            shippingPrice: dbCart.summary?.shippingPrice || 0,
            totalPrice: dbCart.summary?.totalPrice || 0
          })
          setCartSyncError(null)
          setIsBackendOnline(true)
        } else {
          setCart([])
        }
      } else if (res.status === 401) {
        logout()
      }
    } catch (err) {
      console.warn('Failed to fetch DB cart, offline fallback mode active.', err)
      setIsBackendOnline(false)
      setCartSyncError('Could not sync cart with server. Please try again when backend is online.')
    }
  }

  // Helper to fetch wishlist from backend
  const fetchWishlist = async () => {
    const token = localStorage.getItem('devcart_token')
    if (!token || !user) return
    try {
      const res = await fetch('http://localhost:5000/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (res.ok) {
        const data = await res.json()
        setWishlist(data.products || [])
      } else if (res.status === 401) {
        logout()
      }
    } catch (err) {
      console.warn('Failed to fetch wishlist, offline fallback mode active.', err)
    }
  }

  const toggleWishlist = async (product) => {
    const token = localStorage.getItem('devcart_token')
    if (!token || !user) {
      alert('Please sign in to add items to your wishlist.')
      return
    }
    
    // Optimistic UI update
    const productId = getProductId(product)
    const exists = wishlist.some((item) => getProductId(item) === productId)
    if (exists) {
      setWishlist((prev) => prev.filter((item) => getProductId(item) !== productId))
    } else {
      setWishlist((prev) => [...prev, product])
    }

    try {
      const res = await fetch('http://localhost:5000/api/wishlist/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      })
      if (res.ok) {
        const data = await res.json()
        setWishlist(data.wishlist.products || [])
      } else if (res.status === 401) {
        logout()
      }
    } catch (err) {
      console.error('Failed to toggle wishlist item', err)
    }
  }

  const isProductInWishlist = (productId) => {
    return wishlist.some((item) => getProductId(item) === productId)
  }

  // On mount: refresh user if token exists; drop legacy guest-cart storage
  useEffect(() => {
    localStorage.removeItem('devcart_guest_cart')
    const token = localStorage.getItem('devcart_token')
    if (token) refreshUser()
  }, [])

  // Load account cart & wishlist when signed in
  useEffect(() => {
    if (products.length === 0) return

    if (!user) {
      setWishlist([])
      setCart([])
      return
    }

    if (authSyncRef.current) return

    authSyncRef.current = true
    ;(async () => {
      try {
        await fetchDbCart()
        await fetchWishlist()
      } finally {
        authSyncRef.current = false
      }
    })()
  }, [products, user])

  // Cart operations
  const addToCart = async (product, quantity = 1) => {
    const token = localStorage.getItem('devcart_token')
    if (!token || !user) {
      alert('Please sign in to add items to your cart.')
      return
    }

    const previousCart = cart
    const previousPricing = cartPricing
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => getProductId(item.product) === getProductId(product)
      )

      if (existingItemIndex > -1) {
        const newCart = [...prevCart]
        newCart[existingItemIndex].quantity += quantity
        return newCart
      } else {
        return [...prevCart, { product, quantity }]
      }
    })
    notifyAddedToCart(product)
    setActiveProductDetail(null)

    const productId = String(getProductId(product))

    if (!isValidObjectId(productId)) {
      setCartSyncError('Could not add this product. Refresh the catalog while the server is online.')
      setCart(previousCart)
      return
    }

    try {
        const res = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId, qty: quantity })
      })
        if (res.ok) {
          const data = await res.json()
          await fetchDbCart()
          setCartPricing({
            itemsPrice: data.summary?.itemsPrice || 0,
            taxPrice: data.summary?.taxPrice || 0,
            shippingPrice: data.summary?.shippingPrice || 0,
            totalPrice: data.summary?.totalPrice || 0
          })
          setCartSyncError(null)
          setIsBackendOnline(true)
        } else if (res.status === 401) {
          logout()
        } else {
          throw new Error('Cart sync failed')
        }
      } catch (err) {
        console.error('Failed to sync addToCart', err)
        setCart(previousCart)
        setCartPricing(previousPricing)
        setCartSyncError('Could not sync cart with server. Your last change was not saved.')
        setIsBackendOnline(false)
      }
  }

  const updateCartQuantity = async (productId, newQuantity) => {
    const token = localStorage.getItem('devcart_token')
    if (!token || !user) return

    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }
    const previousCart = cart
    const previousPricing = cartPricing
    setCart((prevCart) =>
      prevCart.map((item) =>
        getProductId(item.product) === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )

    if (isValidObjectId(String(productId))) {
      try {
        const res = await fetch(`http://localhost:5000/api/cart/${productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ qty: newQuantity })
        })
        if (res.ok) {
          const data = await res.json()
          await fetchDbCart()
          setCartPricing({
            itemsPrice: data.summary?.itemsPrice || 0,
            taxPrice: data.summary?.taxPrice || 0,
            shippingPrice: data.summary?.shippingPrice || 0,
            totalPrice: data.summary?.totalPrice || 0
          })
          setCartSyncError(null)
          setIsBackendOnline(true)
        } else if (res.status === 401) {
          logout()
        } else {
          throw new Error('Cart sync failed')
        }
      } catch (err) {
        console.error('Failed to sync updateCartQuantity', err)
        setCart(previousCart)
        setCartPricing(previousPricing)
        setCartSyncError('Could not sync cart with server. Your last change was not saved.')
        setIsBackendOnline(false)
      }
    }
  }

  const removeFromCart = async (productId) => {
    const token = localStorage.getItem('devcart_token')
    if (!token || !user) return

    const previousCart = cart
    const previousPricing = cartPricing
    setCart((prevCart) =>
      prevCart.filter((item) => getProductId(item.product) !== productId)
    )

    if (isValidObjectId(String(productId))) {
      try {
        const res = await fetch(`http://localhost:5000/api/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        if (res.ok) {
          const data = await res.json()
          await fetchDbCart()
          setCartPricing({
            itemsPrice: data.summary?.itemsPrice || 0,
            taxPrice: data.summary?.taxPrice || 0,
            shippingPrice: data.summary?.shippingPrice || 0,
            totalPrice: data.summary?.totalPrice || 0
          })
          setCartSyncError(null)
          setIsBackendOnline(true)
        } else if (res.status === 401) {
          logout()
        } else {
          throw new Error('Cart sync failed')
        }
      } catch (err) {
        console.error('Failed to sync removeFromCart', err)
        setCart(previousCart)
        setCartPricing(previousPricing)
        setCartSyncError('Could not sync cart with server. Your last change was not saved.')
        setIsBackendOnline(false)
      }
    }
  }

  const clearCart = async () => {
    const previousCart = cart
    const previousPricing = cartPricing
    setCart([])
    const token = localStorage.getItem('devcart_token')
    if (!token || !user) {
      setCartPricing({ itemsPrice: 0, taxPrice: 0, shippingPrice: 0, totalPrice: 0 })
      return
    }
    try {
      const res = await fetch('http://localhost:5000/api/cart', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (res.ok) {
        const data = await res.json()
        await fetchDbCart()
        setCartPricing({
          itemsPrice: data.summary?.itemsPrice || 0,
          taxPrice: data.summary?.taxPrice || 0,
          shippingPrice: data.summary?.shippingPrice || 0,
          totalPrice: data.summary?.totalPrice || 0
        })
        setCartSyncError(null)
        setIsBackendOnline(true)
      } else if (res.status === 401) {
        logout()
      } else {
        throw new Error('Cart clear failed')
      }
    } catch (err) {
      console.error('Failed to clear cart', err)
      setCart(previousCart)
      setCartPricing(previousPricing)
      setCartSyncError('Could not sync cart with server. Please try again when backend is online.')
      setIsBackendOnline(false)
    }
  }

  const cartTotalItems = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }, [cart])

  const computedCartPricing = useMemo(
    () =>
      calculateCartPricing(
        cart.map((item) => ({
          price: item.product?.price,
          qty: item.quantity
        }))
      ),
    [cart]
  )

  const cartSubtotal = computedCartPricing.itemsPrice
  const taxAmount = computedCartPricing.taxPrice
  const shippingCost = computedCartPricing.shippingPrice
  const cartTotal = computedCartPricing.totalPrice

  const handleCheckout = async (createdOrder = null, options = {}) => {
    const isDemo = options.demo === true || !createdOrder
    setCheckoutSuccessMode(isDemo ? 'demo' : 'order')
    setLastOrderId(createdOrder?._id ?? null)
    setShowCheckoutSuccess(true)

    if (isDemo) {
      // Clear server cart too — otherwise fetchDbCart on next addToCart restores old items
      await clearCart()
      return
    }

    setCart([])
    setCartPricing({
      itemsPrice: createdOrder.itemsPrice || 0,
      taxPrice: createdOrder.taxPrice || 0,
      shippingPrice: createdOrder.shippingPrice || 0,
      totalPrice: createdOrder.totalPrice || 0
    })
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

  const login = (userData, token) => {
    localStorage.setItem('devcart_token', token)
    localStorage.setItem('devcart_user', JSON.stringify(userData))
    setUser(userData)
    setCartSyncError(null)
  }

  const logout = () => {
    localStorage.removeItem('devcart_token')
    localStorage.removeItem('devcart_user')
    localStorage.removeItem('devcart_guest_cart')
    setUser(null)
    setWishlist([])
    setCart([])
    setCartSyncError(null)
    setCartPricing({ itemsPrice: 0, taxPrice: 0, shippingPrice: 0, totalPrice: 0 })
  }

  const clearWishlist = async () => {
    const token = localStorage.getItem('devcart_token')
    if (!token || !user) return
    try {
      const res = await fetch('http://localhost:5000/api/wishlist', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) setWishlist([])
      else if (res.status === 401) logout()
    } catch (err) {
      console.error('Failed to clear wishlist', err)
    }
  }

  const updateProfile = async (profileData) => {
    const token = localStorage.getItem('devcart_token')
    if (!token || !user) return false
    try {
      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      })
      if (res.ok) {
        const updatedUser = await res.json()
        localStorage.setItem('devcart_user', JSON.stringify(updatedUser))
        setUser(updatedUser)
        return true
      } else if (res.status === 401) {
        logout()
      }
    } catch (err) {
      console.error('Failed to update profile', err)
    }
    return false
  }

  return (
    <CartContext.Provider
      value={{
        products,
        categoriesList,
        loading,
        error,
        isBackendOnline,
        cartSyncError,
        cart,
        user,
        login,
        logout,
        updateProfile,
        wishlist,
        setWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
        toggleWishlist,
        clearWishlist,
        isProductInWishlist,
        refreshUser,
        isCartOpen,
        setIsCartOpen,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        activeProductDetail,
        setActiveProductDetail,
        openProductDetail,
        likes,
        hasLiked,
        showCheckoutSuccess,
        setShowCheckoutSuccess,
        checkoutSuccessMode,
        lastOrderId,
        cartToast,
        setCartToast,
        cartBadgePulse,
        flyToCartSignal,
        categoryIdToNameMap,
        categories,
        filteredProducts,
        catalogRef,
        scrollToCatalog,
        spotlightProduct,
        colorsMap,
        getProductImage,
        getProductColors,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotalItems,
        cartSubtotal,
        taxAmount,
        shippingCost,
        cartTotal,
        handleCheckout,
        toggleLike
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
