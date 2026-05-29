export default function PageLayout({ children, maxWidth = 'max-w-md' }) {
  return (
    <div className="min-h-screen w-full bg-page px-4 py-8 sm:py-12 flex items-center justify-center">
      <div className={`w-full ${maxWidth}`}>{children}</div>
    </div>
  )
}
