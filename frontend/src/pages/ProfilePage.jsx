import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function ProfilePage() {
  const { user, logout, updateProfile, refreshUser } = useCart()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState(null)
  const navigate = useNavigate()

  // Shipping Address input states
  const [address, setAddress] = useState(user?.shippingAddress?.address || '')
  const [city, setCity] = useState(user?.shippingAddress?.city || '')
  const [postalCode, setPostalCode] = useState(user?.shippingAddress?.postalCode || '')
  const [country, setCountry] = useState(user?.shippingAddress?.country || '')
  const [savingAddr, setSavingAddr] = useState(false)
  const [addrSuccess, setAddrSuccess] = useState(false)

  // Account settings states
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingAccount, setSavingAccount] = useState(false)
  const [accountSuccess, setAccountSuccess] = useState(false)
  const [accountError, setAccountError] = useState('')

  // Sync address form states when user context updates
  useEffect(() => {
    if (user && user.shippingAddress) {
      setAddress(user.shippingAddress.address || '')
      setCity(user.shippingAddress.city || '')
      setPostalCode(user.shippingAddress.postalCode || '')
      setCountry(user.shippingAddress.country || '')
    }
    if (user) {
      setNewName(user.name || '')
      setNewEmail(user.email || '')
    }
  }, [user])

  const handleSaveAddress = async (e) => {
    e.preventDefault()
    setSavingAddr(true)
    setAddrSuccess(false)
    const success = await updateProfile({
      shippingAddress: { address, city, postalCode, country }
    })
    setSavingAddr(false)
    if (success) {
      setAddrSuccess(true)
      setTimeout(() => setAddrSuccess(false), 3000)
    }
  }

  const handleSaveAccount = async (e) => {
    e.preventDefault()
    setAccountError('')
    setAccountSuccess(false)

    if (newPassword && newPassword !== confirmPassword) {
      setAccountError('Passwords do not match.')
      return
    }
    if (newPassword && newPassword.length < 6) {
      setAccountError('Password must be at least 6 characters.')
      return
    }

    const payload = {}
    if (newName && newName !== user?.name) payload.name = newName
    if (newEmail && newEmail !== user?.email) payload.email = newEmail
    if (newPassword) payload.password = newPassword

    if (Object.keys(payload).length === 0) {
      setAccountError('No changes to save.')
      return
    }

    setSavingAccount(true)
    const success = await updateProfile(payload)
    setSavingAccount(false)

    if (success) {
      setAccountSuccess(true)
      setNewPassword('')
      setConfirmPassword('')
      await refreshUser()
      setTimeout(() => setAccountSuccess(false), 3000)
    } else {
      setAccountError('Failed to update. Try again.')
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('devcart_token')

    if (!token || !user) {
      setLoading(false)
      return
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/orders/myorders', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
          setOrders(data || [])
        } else if (response.status === 401) {
          logout()
        }
      } catch (err) {
        console.error('Failed to load orders', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="w-full max-w-2xl bg-white rounded-[32px] border border-stone-200/50 shadow-sm p-8 flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="w-full max-w-md bg-white rounded-[32px] border border-stone-200/50 shadow-sm p-8 text-center flex flex-col gap-6">
        <div>
          <span className="text-4xl">👤</span>
          <h2 className="text-xl font-black text-slate-900 mt-4">Not Signed In</h2>
          <p className="text-xs text-stone-400 font-medium mt-1">Please sign in to view your profile and order history.</p>
        </div>
        <div className="flex flex-col gap-2">
          <Link to="/login" className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-3 rounded-full text-center shadow-lg">
            Sign In
          </Link>
          <Link to="/" className="w-full border border-stone-200 bg-white hover:bg-stone-50 text-slate-700 font-bold py-2.5 rounded-full text-center text-xs">
            Back to Store
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl bg-white rounded-[40px] border border-stone-200/50 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] p-6 md:p-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-stone-100 pb-5">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-1.5 text-slate-900 hover:opacity-90">
            <span className="bg-slate-900 text-white w-7 h-7 rounded-lg flex items-center justify-center font-serif text-lg font-black">d</span>
            <span className="font-extrabold text-2xl tracking-tighter">devcart.</span>
          </Link>
          <span className="text-xs bg-slate-100 text-stone-500 font-bold px-3 py-1 rounded-full uppercase tracking-wider">Profile</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100/60 px-4 py-2 rounded-full cursor-pointer transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Profile Details Block */}
      <div className="flex flex-col sm:flex-row gap-6 items-center bg-stone-50 p-6 rounded-3xl border border-zinc-200/60">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
          alt="Avatar"
        />
        <div className="text-center sm:text-left flex-1">
          <h3 className="text-xl font-black text-slate-900">{user.name}</h3>
          <p className="text-xs text-stone-400 font-bold mt-0.5">{user.email}</p>
          <span className="inline-block text-[10px] font-extrabold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-md mt-2 uppercase tracking-wider">
            {user.isAdmin ? 'Admin Account' : 'Customer Account'}
          </span>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-stone-50 p-6 rounded-3xl border border-zinc-200/60 flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-black text-slate-900">Account Settings</h3>
          <p className="text-xs text-stone-400 font-medium mt-0.5">Update your name, email, or password.</p>
        </div>

        {accountSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-600 text-xs font-bold px-4 py-2.5 rounded-xl">
            Account updated successfully!
          </div>
        )}
        {accountError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-bold px-4 py-2.5 rounded-xl">
            {accountError}
          </div>
        )}

        <form onSubmit={handleSaveAccount} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-800 uppercase tracking-wider pl-1">Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Your Name"
                className="bg-white border border-stone-200 pl-4 pr-4 py-2.5 rounded-full text-xs font-medium w-full focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-800 uppercase tracking-wider pl-1">Email</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="you@email.com"
                className="bg-white border border-stone-200 pl-4 pr-4 py-2.5 rounded-full text-xs font-medium w-full focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-800 uppercase tracking-wider pl-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Leave blank to keep current"
                className="bg-white border border-stone-200 pl-4 pr-4 py-2.5 rounded-full text-xs font-medium w-full focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-800 uppercase tracking-wider pl-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="bg-white border border-stone-200 pl-4 pr-4 py-2.5 rounded-full text-xs font-medium w-full focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingAccount}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-sm cursor-pointer transition-transform hover:scale-[1.01] active:scale-99 disabled:opacity-50"
            >
              {savingAccount ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Default Shipping Address Form */}
      <div className="bg-stone-50 p-6 rounded-3xl border border-zinc-200/60 flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-black text-slate-900">Default Shipping Address</h3>
          <p className="text-xs text-stone-400 font-medium mt-0.5">Used to automatically fill your details during checkout.</p>
        </div>

        {addrSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-600 text-xs font-bold px-4 py-2.5 rounded-xl">
            Address saved successfully!
          </div>
        )}

        <form onSubmit={handleSaveAddress} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-800 uppercase tracking-wider pl-1">Street Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main Street"
              className="bg-white border border-stone-200 pl-4 pr-4 py-2.5 rounded-full text-xs font-medium w-full focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-[10px] font-bold text-slate-800 uppercase tracking-wider pl-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Mumbai"
                className="bg-white border border-stone-200 pl-4 pr-4 py-2.5 rounded-full text-xs font-medium w-full focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-800 uppercase tracking-wider pl-1">Postal Code</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="400001"
                className="bg-white border border-stone-200 pl-4 pr-4 py-2.5 rounded-full text-xs font-medium w-full focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-800 uppercase tracking-wider pl-1">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="India"
              className="bg-white border border-stone-200 pl-4 pr-4 py-2.5 rounded-full text-xs font-medium w-full focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingAddr}
              className="bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-sm cursor-pointer transition-transform hover:scale-[1.01] active:scale-99 disabled:opacity-50"
            >
              {savingAddr ? 'Saving...' : 'Save Address'}
            </button>
          </div>
        </form>
      </div>

      {/* Orders List */}
      <div>
        <h3 className="text-lg font-black text-slate-900 mb-4">Order History</h3>
        {orders.length > 0 ? (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <div key={order._id} className="border border-stone-200/60 rounded-2xl overflow-hidden">
                {/* Order Summary Row */}
                <button
                  onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                  className="w-full p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-sm font-medium hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  <div className="text-left">
                    <span className="text-xs text-stone-400 font-bold block uppercase tracking-wider">Order ID</span>
                    <span className="font-bold text-slate-900 font-mono text-xs">{order._id}</span>
                    <span className="text-[10px] text-stone-400 block mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase ${
                        order.isPaid ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                      }`}>
                        {order.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase ${
                        order.isDelivered ? 'bg-blue-50 text-blue-600' : 'bg-stone-100 text-stone-500'
                      }`}>
                        {order.isDelivered ? 'Delivered' : 'Pending'}
                      </span>
                    </div>
                    <span className="font-black text-indigo-600 text-sm">${order.totalPrice || order.total}</span>
                    <span className={`text-stone-400 transition-transform duration-200 ${expandedOrder === order._id ? 'rotate-180' : ''}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </div>
                </button>

                {/* Expanded Order Items */}
                {expandedOrder === order._id && (
                  <div className="border-t border-stone-100 bg-stone-50/60 px-4 pb-4 pt-3 flex flex-col gap-2">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Items in this order</p>
                    {(order.orderItems || []).map((item, i) => (
                      <div key={i} className="flex items-center justify-between gap-3 py-2 border-b border-stone-100 last:border-0">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 bg-white border border-stone-200/40 rounded-lg flex items-center justify-center overflow-hidden p-1 flex-shrink-0">
                            <img src={item.image} className="object-contain w-full h-full" alt={item.name} />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-extrabold text-slate-800 truncate block">{item.name}</span>
                            <span className="text-[10px] text-stone-400 font-bold">Qty: {item.qty}</span>
                          </div>
                        </div>
                        <span className="text-xs font-black text-slate-700 flex-shrink-0">${item.price * item.qty}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-xs font-bold text-stone-500 pt-2">
                      <span>Shipping</span>
                      <span className="text-slate-700">{order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice}`}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-black text-slate-900 border-t border-stone-200/60 pt-2 mt-1">
                      <span>Total</span>
                      <span className="text-indigo-600">${order.totalPrice}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border border-dashed border-stone-200 rounded-2xl text-stone-400">
            <span className="text-3xl">📦</span>
            <p className="text-xs font-bold mt-2">No orders placed yet.</p>
          </div>
        )}
      </div>

      <div className="flex justify-start">
        <Link to="/" className="text-xs font-bold text-stone-500 hover:text-slate-800 flex items-center gap-1.5">
          ← Back to Shop
        </Link>
      </div>
    </div>
  )
}
