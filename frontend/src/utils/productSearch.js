/**
 * Returns true when a product matches the search query.
 * Short queries (under 3 chars) only match name and category to avoid noisy description hits.
 */
export function productMatchesSearch(product, query, categoryName = '') {
  const q = query.trim().toLowerCase()
  if (!q) return true

  const name = (product.name || '').toLowerCase()
  const category = (categoryName || product.category || '').toLowerCase()

  if (name.includes(q) || category.includes(q)) return true

  if (q.length < 3) return false

  return (product.description || '').toLowerCase().includes(q)
}

/** Lower score = higher relevance for sorting suggestions. */
export function productSearchRank(product, query, categoryName = '') {
  const q = query.trim().toLowerCase()
  const name = (product.name || '').toLowerCase()
  const category = (categoryName || product.category || '').toLowerCase()

  if (name.startsWith(q)) return 0
  if (name.includes(q)) return 1
  if (category.includes(q)) return 2
  return 3
}
