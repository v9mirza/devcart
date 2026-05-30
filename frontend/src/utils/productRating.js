export function formatProductRating(rating) {
  const value = Number(rating)
  if (!Number.isFinite(value) || value <= 0) return '4.5'
  return value.toFixed(1)
}

export function formatReviewsCount(reviewsCount) {
  const value = Number(reviewsCount)
  if (!Number.isFinite(value) || value < 0) return 0
  return value
}
