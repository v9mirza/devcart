export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export function apiUrl(path) {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${API_URL}${normalized}`
}
