import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function ProfilePage() {
  const { user, logout } = useCart()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('devcart_token')

    if (!token || !user) {
      setLoading(false)
      return
    }

    // Fetch user's orders from the backend API
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/orders/myorders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
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

  // Not logged in fallback
  if (!user) {
    return (
      <div className="w-full max-w-md bg-white rounded-[32px] border border-stone-200/50 shadow-sm p-8 text-center flex flex-col gap-6">
        <div>
          <span className="text-4xl">👤</span>
          <h2 className="text-xl font-black text-slate-900 mt-4">Not Signed In</h2>
          <p className="text-xs text-stone-400 font-medium mt-1">Please sign in to view your profile and order history.</p>
        </div>
        <div className="flex flex-col gap-2">
          <Link
            to="/login"
            className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-3 rounded-full text-center shadow-lg"
          >
            Sign In
          </Link>
          <Link
            to="/"
            className="w-full border border-stone-200 bg-white hover:bg-stone-50 text-slate-700 font-bold py-2.5 rounded-full text-center text-xs"
          >
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
      <div className="flex flex-col sm:flex-row gap-6 items-center bg-stone-50 p-6 rounded-3xl border border-stone-150/40">
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

      {/* Orders List */}
      <div>
        <h3 className="text-lg font-black text-slate-900 mb-4">Order History</h3>
        {orders.length > 0 ? (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div key={order._id} className="border border-stone-200/60 rounded-2xl p-4 flex flex-col sm:flex-row justify-between gap-3 text-sm font-medium">
                <div>
                  <span className="text-xs text-stone-400 font-bold block uppercase tracking-wider">Order ID</span>
                  <span className="font-bold text-slate-900 font-mono text-xs">{order._id}</span>
                  <span className="text-[10px] text-stone-400 block mt-1">Ordered on: {new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-col sm:items-end gap-1.5">
                  <span className="font-black text-indigo-600 block">${order.totalPrice || order.total}</span>
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
                </div>
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
        <Link
          to="/"
          className="text-xs font-bold text-stone-500 hover:text-slate-800 flex items-center gap-1.5"
        >
          ← Back to Shop
        </Link>
      </div>
    </div>
  )
}
