import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function LoginPage() {
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
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMsg = data.errors ? data.errors.join(', ') : (data.message || 'Login failed')
        throw new Error(errorMsg)
      }

      login(data.user, data.token)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card-panel flex flex-col gap-6">
      <div className="text-center">
        <Link to="/" className="inline-flex items-center justify-center gap-1.5 text-slate-900 mb-4 hover:opacity-90">
          <span className="bg-slate-900 text-white w-7 h-7 rounded-lg flex items-center justify-center font-serif text-lg font-black">d</span>
          <span className="font-extrabold text-2xl tracking-tighter">devcart.</span>
        </Link>
        <h1 className="text-2xl font-black text-slate-900">Welcome Back</h1>
        <p className="text-sm text-stone-500 font-medium mt-1">Sign in to manage your orders and cart.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-bold px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" autoComplete="on">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-email" className="form-label">Email</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="name@example.com"
            className="form-input"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-password" className="form-label">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="form-input"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary mt-1">
          {loading ? 'Logging in...' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-sm text-stone-500 font-medium border-t border-zinc-100 pt-5">
        New to DevCart?{' '}
        <Link to="/signup" className="text-slate-900 font-bold hover:underline">
          Create account
        </Link>
      </p>
    </div>
  )
}
