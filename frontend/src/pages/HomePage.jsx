
import StickyStoreHeader from '../components/StickyStoreHeader'
import BentoGrid from '../components/BentoGrid'
import CatalogSection from '../components/CatalogSection'
const TRUST_ITEMS = [
  {
    title: 'Fast shipping',
    text: 'Dispatch in 24h for most products.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    )
  },
  {
    title: 'Secure payments',
    text: 'Encrypted checkout and trusted gateways.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    )
  },
  {
    title: 'Easy returns',
    text: 'Simple return flow with quick support.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    )
  }
]

export default function HomePage() {
  return (
    <div className="w-full min-h-screen px-3 sm:px-4 md:px-6 pb-3 sm:pb-5 flex justify-center animate-page-in">
      <div className="w-full max-w-[1280px] mt-3 sm:mt-5 bg-shell rounded-[20px] sm:rounded-[30px] border border-zinc-200 shadow-[0_18px_44px_-24px_rgba(20,24,36,0.12)] flex flex-col min-h-0">
        <StickyStoreHeader />

        <div className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-6 pt-4 sm:pt-5 flex flex-col gap-4 sm:gap-6 lg:gap-7">
          <BentoGrid />

          <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TRUST_ITEMS.map((item) => (
              <div
                key={item.title}
                className="bg-inset border border-zinc-200/80 rounded-[18px] p-4 shadow-sm flex gap-3"
              >
                <span className="w-10 h-10 rounded-xl bg-accent-muted text-accent flex items-center justify-center shrink-0">
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm font-extrabold text-slate-800">{item.title}</h3>
                  <p className="text-xs text-stone-500 mt-1 font-medium">{item.text}</p>
                </div>
              </div>
            ))}
          </section>

          <CatalogSection />

          <footer className="pt-5 border-t border-stone-200/60 text-center text-xs text-stone-400 font-medium">
            <p>&copy; {new Date().getFullYear()} DevCart Inc. All rights reserved.</p>
          </footer>

        </div>
      </div>
    </div>
  )
}
