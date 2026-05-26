import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { login } = useCart()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        const errorMsg = data.errors ? data.errors.join(', ') : (data.message || 'Registration failed')
        throw new Error(errorMsg)
      }

      // Automatically log in on signup success by updating context state
      login(data.user || data, data.token)
      
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-[32px] border border-stone-200/50 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)] p-8 flex flex-col gap-6">
      <div className="text-center">
        <Link to="/" className="flex items-center justify-center gap-1.5 text-slate-900 mb-4 hover:opacity-90">
          <span className="bg-slate-900 text-white w-7 h-7 rounded-lg flex items-center justify-center font-serif text-lg font-black">d</span>
          <span className="font-extrabold text-2xl tracking-tighter">devcart.</span>
        </Link>
        <h2 className="text-2xl font-black text-slate-900">Create Account</h2>
        <p className="text-xs text-stone-400 font-medium mt-1">Get started with a new account today.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-bold px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider pl-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="John Doe"
            className="bg-[#fcfcf9] border border-stone-200 pl-4 pr-4 py-3 rounded-full text-sm font-medium w-full focus:outline-none focus:ring-2 focus:ring-slate-300 shadow-inner"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider pl-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="name@example.com"
            className="bg-[#fcfcf9] border border-stone-200 pl-4 pr-4 py-3 rounded-full text-sm font-medium w-full focus:outline-none focus:ring-2 focus:ring-slate-300 shadow-inner"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider pl-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="bg-[#fcfcf9] border border-stone-200 pl-4 pr-4 py-3 rounded-full text-sm font-medium w-full focus:outline-none focus:ring-2 focus:ring-slate-300 shadow-inner"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-3.5 rounded-full text-center shadow-lg transition-transform hover:scale-[1.01] active:scale-99 disabled:opacity-50 mt-2 cursor-pointer"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <div className="text-center text-xs text-stone-400 font-bold border-t border-stone-100 pt-5">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-600 hover:text-indigo-700 hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  )
}
