import { useLocation } from 'react-router-dom'

export default function PageLayout({ children, maxWidth = 'max-w-md' }) {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen w-full bg-page px-4 py-8 sm:py-12 flex items-center justify-center">
      <div key={pathname} className={`w-full ${maxWidth} animate-page-in`}>
        {children}
      </div>
    </div>
  )
}
