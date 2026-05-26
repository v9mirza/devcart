import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-hidden selection:bg-purple-500/30 selection:text-purple-200">
      {/* Decorative Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50rem] h-[50rem] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      {/* Floating Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/50 bg-slate-950/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              DevCart
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
              Vite + Tailwind v4
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <a href="https://tailwindcss.com" target="_blank" rel="noreferrer" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">Tailwind Docs</a>
            <a href="https://vite.dev" target="_blank" rel="noreferrer" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">Vite Docs</a>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 flex flex-col items-center justify-center text-center z-10">
        
        {/* Tech Logos with Hover & Pulsing Animations */}
        <div className="flex items-center justify-center gap-8 mb-8">
          <a href="https://vite.dev" target="_blank" rel="noreferrer" className="group">
            <img 
              src={viteLogo} 
              className="w-20 h-20 transition-all duration-500 group-hover:scale-110 filter drop-shadow-[0_0_15px_rgba(100,108,255,0.4)]" 
              alt="Vite logo" 
            />
          </a>
          <span className="text-2xl text-slate-600 font-light">+</span>
          <a href="https://react.dev" target="_blank" rel="noreferrer" className="group">
            <img 
              src={reactLogo} 
              className="w-20 h-20 animate-[spin_20s_linear_infinite] transition-all duration-500 group-hover:scale-110 filter drop-shadow-[0_0_15px_rgba(97,218,251,0.4)]" 
              alt="React logo" 
            />
          </a>
        </div>

        {/* Hero Section */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          React + Vite + Tailwind v4
        </h1>
        
        <p className="text-lg text-slate-400 max-w-lg mb-8 leading-relaxed">
          Tailwind CSS v4 is successfully configured and running with Vite's lightning-fast compilation in your <code className="text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded text-sm font-mono border border-pink-500/20">frontend</code> directory.
        </p>

        {/* Interactive Counter Card */}
        <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm mb-12 flex flex-col items-center">
          <span className="text-slate-400 text-sm mb-4">Click button to verify React state HMR</span>
          <button
            type="button"
            onClick={() => setCount((count) => count + 1)}
            className="px-6 py-3 min-h-[44px] min-w-[120px] bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200 active:scale-95 hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            Count is {count}
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full text-left">
          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/50 hover:border-indigo-500/30 hover:bg-slate-900/60 transition-all duration-300 group">
            <h2 className="text-lg font-semibold text-slate-200 mb-2 group-hover:text-indigo-400 transition-colors">Vite 8 Integration</h2>
            <p className="text-sm text-slate-400 leading-relaxed">Powered by the new official `@tailwindcss/vite` plugin for native, ultra-fast CSS compilation on the fly without PostCSS configuration overhead.</p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/50 hover:border-purple-500/30 hover:bg-slate-900/60 transition-all duration-300 group">
            <h2 className="text-lg font-semibold text-slate-200 mb-2 group-hover:text-purple-400 transition-colors">Tailwind CSS v4</h2>
            <p className="text-sm text-slate-400 leading-relaxed">Embrace CSS-first styling. Features automatic discovery of source files, native cascade layers, modern `@import "tailwindcss"` and zero configuration.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-900 text-center text-xs text-slate-600">
        <p>&copy; {new Date().getFullYear()} DevCart. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
