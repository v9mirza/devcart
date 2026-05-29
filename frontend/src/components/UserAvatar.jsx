function getInitials(name, email) {
  const source = (name || email || '?').trim()
  if (!source) return '?'
  return source[0].toUpperCase()
}

const AVATAR_COLORS = [
  'bg-teal-600',
  'bg-sky-600',
  'bg-violet-600',
  'bg-amber-600',
  'bg-rose-600',
  'bg-emerald-600'
]

function getAvatarColor(seed = '') {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = seed.charCodeAt(i) + (hash << 5) - hash
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export default function UserAvatar({ user, className = 'w-10 h-10', textClassName = 'text-sm' }) {
  const name = user?.name || ''
  const email = user?.email || ''
  const initials = getInitials(name, email)
  const colorClass = getAvatarColor(email || name)

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-black text-white shrink-0 select-none ${colorClass} ${className} ${textClassName}`}
      aria-hidden="true"
    >
      {initials}
    </span>
  )
}
