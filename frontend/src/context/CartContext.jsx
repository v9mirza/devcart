import { createContext, useContext, useState, useMemo, useEffect, useRef } from 'react'
import blueHeadphones from '../assets/blue_headphones.png'
import wirelessEarbuds from '../assets/wireless_earbuds.png'
import vrHeadset from '../assets/vr_headset.png'

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

export function CartProvider({ children }) {
  // Database states
  const [products, setProducts] = useState([])
  const [categoriesList, setCategoriesList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [activeProductDetail, setActiveProductDetail] = useState(null)
  
  // Spotlight options
  const [spotlightColor, setSpotlightColor] = useState('blue')
  const [likes, setLikes] = useState(460)
  const [hasLiked, setHasLiked] = useState(false)
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false)
  const [timeLeft, setTimeLeft] = useState(4 * 3600 + 12 * 60 + 9) // 4h 12m 9s
  const catalogRef = useRef(null)

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' })
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
      } catch (err) {
        console.warn('Backend server offline. Falling back to offline fallback data.', err)
        setProducts(OFFLINE_PRODUCTS)
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

  // Timer countdown
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

  // Filtered products list based on search and category selections
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const catName = categoryIdToNameMap[p.category] || p.category
      const matchesCategory = selectedCategory === 'All' || catName === selectedCategory
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
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

  // Image resolver to map placeholders to custom local files
  const getProductImage = (product) => {
    if (!product) return ''
    if (product.image === blueHeadphones) return blueHeadphones
    if (product.image === wirelessEarbuds) return wirelessEarbuds
    if (product.image === vrHeadset) return vrHeadset

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

  const getProductColors = (product) => {
    if (!product) return []
    return product.colors || ['blue', 'orange', 'green', 'red', 'teal']
  }

  // Helper to fetch cart from backend
  const fetchDbCart = async () => {
    const token = localStorage.getItem('devcart_token')
    if (!token || !user) return
    try {
      const res = await fetch('http://localhost:5000/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (res.ok) {
        const dbCart = await res.json()
        if (dbCart && dbCart.items) {
          const mappedItems = dbCart.items.map((item) => {
            const fullProduct = products.find((p) => getProductId(p) === item.product) || {
              _id: item.product,
              id: item.product,
              name: item.name,
              image: item.image,
              price: item.price,
              description: ''
            }
            return {
              product: fullProduct,
              color: 'black', // Default/fallback color
              quantity: item.qty,
              customPrice: null
            }
          })
          setCart(mappedItems)
        }
      } else if (res.status === 401) {
        logout()
      }
    } catch (err) {
      console.warn('Failed to fetch DB cart, offline fallback mode active.', err)
    }
  }

  // Fetch db cart on login or when products list finishes loading
  useEffect(() => {
    if (products.length > 0 && user) {
      fetchDbCart()
    }
  }, [products, user])

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
    setActiveProductDetail(null)

    // Sync to backend DB
    const token = localStorage.getItem('devcart_token')
    if (token && user) {
      fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId: getProductId(product), qty: quantity })
      }).catch(err => console.error('Failed to sync addToCart', err))
    }
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

    // Sync to backend DB
    const token = localStorage.getItem('devcart_token')
    if (token && user) {
      fetch(`http://localhost:5000/api/cart/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ qty: newQuantity })
      }).catch(err => console.error('Failed to sync updateCartQuantity', err))
    }
  }

  const removeFromCart = (productId, color, customPrice) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(getProductId(item.product) === productId && item.color === color && item.customPrice === customPrice))
    )

    // Sync to backend DB
    const token = localStorage.getItem('devcart_token')
    if (token && user) {
      fetch(`http://localhost:5000/api/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).catch(err => console.error('Failed to sync removeFromCart', err))
    }
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

  const login = (userData, token) => {
    localStorage.setItem('devcart_token', token)
    localStorage.setItem('devcart_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('devcart_token')
    localStorage.removeItem('devcart_user')
    setUser(null)
    setCart([])
  }

  return (
    <CartContext.Provider
      value={{
        products,
        categoriesList,
        loading,
        error,
        cart,
        user,
        login,
        logout,
        isCartOpen,
        setIsCartOpen,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        activeProductDetail,
        setActiveProductDetail,
        spotlightColor,
        setSpotlightColor,
        likes,
        hasLiked,
        showCheckoutSuccess,
        setShowCheckoutSuccess,
        timeLeft,
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
