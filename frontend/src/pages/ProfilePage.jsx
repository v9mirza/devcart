import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import UserAvatar from '../components/UserAvatar'

const TABS = [
  { id: 'orders', label: 'Orders' },
  { id: 'account', label: 'Account' },
  { id: 'shipping', label: 'Shipping' }
]

function shortOrderId(id) {
  if (!id) return '—'
  return `#${String(id).slice(-6).toUpperCase()}`
}

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

function Alert({ tone, children }) {
  const styles =
    tone === 'success'
      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
      : 'bg-red-50 border-red-200 text-red-600'
  return (
    <div className={`border text-xs font-bold px-4 py-2.5 rounded-xl ${styles}`}>{children}</div>
  )
}

export default function ProfilePage() {
  const { user, logout, updateProfile, refreshUser, wishlist } = useCart()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [activeTab, setActiveTab] = useState('orders')
  const navigate = useNavigate()

  const [address, setAddress] = useState(user?.shippingAddress?.address || '')
  const [city, setCity] = useState(user?.shippingAddress?.city || '')
  const [postalCode, setPostalCode] = useState(user?.shippingAddress?.postalCode || '')
  const [country, setCountry] = useState(user?.shippingAddress?.country || '')
  const [savingAddr, setSavingAddr] = useState(false)
  const [addrSuccess, setAddrSuccess] = useState(false)

  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingAccount, setSavingAccount] = useState(false)
  const [accountSuccess, setAccountSuccess] = useState(false)
  const [accountError, setAccountError] = useState('')

  const addressComplete = useMemo(
    () => Boolean(address?.trim() && city?.trim() && postalCode?.trim() && country?.trim()),
    [address, city, postalCode, country]
  )

  const totalSpent = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.totalPrice || order.total || 0), 0),
    [orders]
  )

  useEffect(() => {
    if (user?.shippingAddress) {
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
          headers: { Authorization: `Bearer ${token}` }
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
  }, [user, logout])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="card-panel flex flex-col items-center justify-center min-h-[320px] gap-3">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-stone-400">Loading your profile…</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="card-panel text-center flex flex-col gap-6 animate-empty-in">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-accent-muted text-accent flex items-center justify-center">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900">Sign in to your account</h2>
          <p className="text-sm text-stone-500 font-medium mt-1.5 max-w-sm mx-auto">
            View orders, manage shipping details, and update your account settings.
          </p>
        </div>
        <div className="flex flex-col gap-2 max-w-xs mx-auto w-full">
          <Link to="/login" className="btn-primary block text-center">
            Sign In
          </Link>
          <Link
            to="/"
            className="w-full border border-zinc-200 bg-inset hover:bg-surface-hover text-slate-700 font-bold py-2.5 rounded-full text-center text-sm transition-colors"
          >
            Back to Store
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="card-panel flex flex-col gap-5 sm:gap-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-accent transition-colors mb-2"
          >
            <span aria-hidden>←</span> Back to store
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Your profile</h1>
          <p className="text-sm text-stone-500 font-medium mt-0.5">
            Manage orders, account details, and checkout defaults.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="self-start sm:self-center text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/70 border border-red-100 px-4 py-2 rounded-full cursor-pointer transition-colors"
        >
          Log out
        </button>
      </header>

      <section className="section-muted flex flex-col sm:flex-row gap-5 sm:items-center">
        <UserAvatar user={user} className="w-20 h-20 ring-4 ring-white shadow-md mx-auto sm:mx-0" textClassName="text-xl" />
        <div className="flex-1 text-center sm:text-left min-w-0">
          <h2 className="text-xl font-black text-slate-900 truncate">{user.name}</h2>
          <p className="text-sm text-stone-500 font-medium mt-0.5 truncate">{user.email}</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wide bg-white border border-zinc-200 text-slate-600 px-2.5 py-1 rounded-full">
              {user.isAdmin ? 'Admin' : 'Customer'}
            </span>
            {user.createdAt && (
              <span className="text-[10px] font-bold text-stone-400">
                Member since {formatDate(user.createdAt)}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-2 sm:gap-3">
        {[
          { label: 'Orders', value: orders.length },
          { label: 'Wishlist', value: wishlist.length },
          { label: 'Total spent', value: `$${totalSpent.toFixed(0)}` }
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-inset border border-zinc-200/80 rounded-2xl px-3 py-3 sm:px-4 sm:py-4 text-center"
          >
            <p className="text-lg sm:text-xl font-black text-slate-900 tabular-nums">{stat.value}</p>
            <p className="text-[10px] sm:text-xs font-bold text-stone-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </section>

      <nav className="flex gap-2 p-1 bg-inset border border-zinc-200/80 rounded-full">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 text-xs sm:text-sm font-bold py-2.5 rounded-full transition-all cursor-pointer ${
              activeTab === tab.id ? 'pill-active' : 'text-stone-500 hover:text-slate-800 hover:bg-white/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === 'orders' && (
        <section className="flex flex-col gap-3">
          <div>
            <h3 className="text-base font-black text-slate-900">Order history</h3>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              {orders.length > 0 ? `${orders.length} order${orders.length === 1 ? '' : 's'} placed` : 'No purchases yet'}
            </p>
          </div>

          {orders.length > 0 ? (
            <div className="flex flex-col gap-3">
              {orders.map((order) => {
                const isOpen = expandedOrder === order._id
                const itemCount = (order.orderItems || []).reduce((n, item) => n + (item.qty || 0), 0)
                return (
                  <div key={order._id} className="border border-zinc-200/80 rounded-2xl overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setExpandedOrder(isOpen ? null : order._id)}
                      className="w-full p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left hover:bg-inset/60 transition-colors cursor-pointer"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-black text-slate-900 font-mono">
                            {shortOrderId(order._id)}
                          </span>
                          <span className="text-[10px] font-bold text-stone-400">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 font-medium mt-1">
                          {itemCount} item{itemCount === 1 ? '' : 's'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                            order.isPaid ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {order.isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                            order.isDelivered ? 'bg-sky-50 text-sky-700' : 'bg-zinc-100 text-stone-500'
                          }`}
                        >
                          {order.isDelivered ? 'Delivered' : 'Processing'}
                        </span>
                        <span className="text-sm font-black text-slate-900 tabular-nums">
                          ${Number(order.totalPrice || order.total || 0).toFixed(2)}
                        </span>
                        <span className={`text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="border-t border-zinc-100 bg-inset/50 px-4 pb-4 pt-3 flex flex-col gap-2">
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Items</p>
                        {(order.orderItems || []).map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between gap-3 py-2 border-b border-zinc-100 last:border-0"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-10 h-10 bg-white border border-zinc-200/60 rounded-xl flex items-center justify-center overflow-hidden p-1 shrink-0">
                                <img src={item.image} className="object-contain w-full h-full" alt="" />
                              </div>
                              <div className="min-w-0">
                                <span className="text-xs font-extrabold text-slate-800 truncate block">
                                  {item.name}
                                </span>
                                <span className="text-[10px] text-stone-400 font-bold">Qty {item.qty}</span>
                              </div>
                            </div>
                            <span className="text-xs font-black text-slate-700 tabular-nums shrink-0">
                              ${(item.price * item.qty).toFixed(2)}
                            </span>
                          </div>
                        ))}
                        <div className="flex justify-between text-xs font-bold text-stone-500 pt-2">
                          <span>Shipping</span>
                          <span className="text-slate-700">
                            {order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice}`}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-black text-slate-900 border-t border-zinc-200/60 pt-2">
                          <span>Total</span>
                          <span className="tabular-nums">${Number(order.totalPrice || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-zinc-200 rounded-2xl bg-inset/40 animate-empty-in">
              <span className="text-3xl">📦</span>
              <p className="text-sm font-bold text-slate-800 mt-3">No orders yet</p>
              <p className="text-xs text-stone-500 font-medium mt-1 max-w-xs mx-auto">
                When you check out, your orders will show up here.
              </p>
              <Link to="/" className="inline-block mt-4 text-xs font-bold text-accent hover:text-accent-hover">
                Browse products →
              </Link>
            </div>
          )}
        </section>
      )}

      {activeTab === 'account' && (
        <section className="section-muted flex flex-col gap-4">
          <div>
            <h3 className="text-base font-black text-slate-900">Account settings</h3>
            <p className="text-xs text-stone-500 font-medium mt-0.5">Update your name, email, or password.</p>
          </div>

          {accountSuccess && <Alert tone="success">Account updated successfully.</Alert>}
          {accountError && <Alert tone="error">{accountError}</Alert>}

          <form onSubmit={handleSaveAccount} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Your name"
                  className="form-input py-2.5 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="you@email.com"
                  autoComplete="email"
                  className="form-input py-2.5 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="form-label">New password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Leave blank to keep current"
                  autoComplete="new-password"
                  className="form-input py-2.5 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="form-label">Confirm password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  autoComplete="new-password"
                  className="form-input py-2.5 text-sm"
                />
              </div>
            </div>
            <div className="flex justify-stretch sm:justify-end pt-1">
              <button type="submit" disabled={savingAccount} className="btn-primary sm:w-auto sm:px-8">
                {savingAccount ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </section>
      )}

      {activeTab === 'shipping' && (
        <section className="section-muted flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div>
              <h3 className="text-base font-black text-slate-900">Default shipping address</h3>
              <p className="text-xs text-stone-500 font-medium mt-0.5">
                Pre-fills checkout so you can place orders faster.
              </p>
            </div>
            <span
              className={`self-start text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-full border ${
                addressComplete
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                  : 'bg-amber-50 text-amber-700 border-amber-100'
              }`}
            >
              {addressComplete ? 'Complete' : 'Incomplete'}
            </span>
          </div>

          {addrSuccess && <Alert tone="success">Address saved successfully.</Alert>}

          <form onSubmit={handleSaveAddress} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="form-label">Street address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main Street"
                className="form-input py-2.5 text-sm"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="form-label">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="San Francisco"
                  className="form-input py-2.5 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="form-label">Postal code</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="94102"
                  className="form-input py-2.5 text-sm"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="form-label">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="United States"
                className="form-input py-2.5 text-sm"
              />
            </div>
            <div className="flex justify-stretch sm:justify-end pt-1">
              <button type="submit" disabled={savingAddr} className="btn-primary sm:w-auto sm:px-8">
                {savingAddr ? 'Saving…' : 'Save address'}
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  )
}
