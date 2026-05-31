import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart, getProductId } from '../context/CartContext'
import ProductImage from '../components/ProductImage'

import { apiUrl } from '../utils/api'

export default function CheckoutPage() {
  const {
    cart,
    cartSubtotal,
    taxAmount,
    shippingCost,
    cartTotal,
    handleCheckout,
    getProductImage,
    logout,
    user,
    isBackendOnline
  } = useCart()

  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('')

  // Pre-fill shipping address details if saved in user profile
  useEffect(() => {
    if (user && user.shippingAddress) {
      setAddress(user.shippingAddress.address || '')
      setCity(user.shippingAddress.city || '')
      setPostalCode(user.shippingAddress.postalCode || '')
      setCountry(user.shippingAddress.country || '')
    }
  }, [user])
  const [paymentMethod] = useState('Cash On Delivery')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const token = localStorage.getItem('devcart_token')

    if (!token) {
      setError('Auth required. Please sign in to submit your order.')
      setLoading(false)
      return
    }
    if (!isBackendOnline) {
      setError('Server offline. Checkout is temporarily unavailable.')
      setLoading(false)
      return
    }

    try {
      // 1. Send cart items to the database cart endpoint first if required by the API,
      // or directly submit order if backend reads from cart collection (it reads from /api/cart)
      // Wait, the API.md states: "POST /api/orders: Create a new order from the logged-in user's cart. Auth required. Required body: shippingAddress, paymentMethod. Clears cart after successful order creation."
      // So we need to sync cart to backend first, or just submit!
      // Wait! Let's check: to submit the order, we post the shippingAddress and paymentMethod.
      const response = await fetch(apiUrl('/api/orders'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          shippingAddress: { address, city, postalCode, country },
          paymentMethod
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          logout()
        }
        throw new Error(data.message || 'Checkout failed')
      }

      // Trigger checkout success state in context
      handleCheckout(data)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Not logged in warning
  const token = localStorage.getItem('devcart_token')

  return (
    <div className="card-panel flex flex-col lg:flex-row gap-6 lg:gap-8">
      <div className="lg:w-3/5 flex flex-col gap-6">
        <div>
          <Link to="/" className="flex items-center gap-1.5 text-slate-900 mb-4 hover:opacity-90">
            <span className="bg-slate-900 text-white w-7 h-7 rounded-lg flex items-center justify-center font-serif text-lg font-black">d</span>
            <span className="font-extrabold text-2xl tracking-tighter">devcart.</span>
          </Link>
          <h2 className="text-2xl font-black text-slate-900">Shipping Details</h2>
          <p className="text-xs text-stone-400 font-medium mt-1">Please enter your delivery destination below.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-bold px-4 py-3 rounded-xl">
            {error}{' '}
            {!token && (
              <Link to="/login" className="underline font-black text-slate-900 ml-1">
                Sign In
              </Link>
            )}
          </div>
        )}
        {!isBackendOnline && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-4 py-3 rounded-xl">
            Server offline. You can browse products, but checkout is temporarily disabled.
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="form-label">Street address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="123 Main Street"
              className="form-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="form-label">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                placeholder="Mumbai"
                className="form-input"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="form-label">Postal code</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
                placeholder="400001"
                className="form-input"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="form-label">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              placeholder="India"
              className="form-input"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="form-label">Payment method</label>
            <input
              type="text"
              value={paymentMethod}
              disabled
              className="form-input opacity-70 cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={loading || cart.length === 0 || !isBackendOnline}
            className="btn-primary mt-2"
          >
            {loading ? 'Submitting Order...' : 'Complete Order'}
          </button>
        </form>
      </div>

      <div className="lg:w-2/5 section-muted flex flex-col justify-between gap-6">
        <div>
          <h3 className="text-lg font-black text-slate-900 mb-4">Order Summary</h3>
          <div className="flex flex-col divide-y divide-stone-200/50 max-h-60 overflow-y-auto mb-4">
            {cart.map((item, idx) => (
              <div key={`${getProductId(item.product)}-${idx}`} className="py-3 flex justify-between items-center gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 bg-surface border border-zinc-200/60 rounded-lg flex-shrink-0 p-0.5 overflow-hidden">
                    <ProductImage
                      product={item.product}
                      getProductImage={getProductImage}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="font-extrabold text-xs text-slate-800 truncate block leading-snug">{item.product.name}</span>
                    <span className="text-[10px] text-stone-400 capitalize font-bold">Qty: {item.quantity}</span>
                  </div>
                </div>
                <span className="font-black text-xs text-slate-700 flex-shrink-0">${item.product.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2.5 text-xs font-bold text-stone-500 border-t border-stone-200/60 pt-4">
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
              <span className="text-slate-800">{shippingCost === 0 ? 'FREE' : `$${shippingCost}`}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-900 font-black border-t border-stone-200/60 pt-3.5">
              <span>Total Price</span>
              <span className="text-slate-900">${cartTotal}</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/" className="text-xs font-bold text-stone-500 hover:text-slate-800">
            ← Cancel and go back
          </Link>
        </div>
      </div>
    </div>
  )
}
