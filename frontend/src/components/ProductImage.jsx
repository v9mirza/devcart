import { useEffect, useState } from 'react'
import fallbackImg from '../assets/blue_headphones.png'

export default function ProductImage({
  product,
  getProductImage,
  className = '',
  alt,
  ...imgProps
}) {
  const resolved = product ? getProductImage(product) : fallbackImg
  const [src, setSrc] = useState(resolved || fallbackImg)

  useEffect(() => {
    setSrc(getProductImage(product) || fallbackImg)
  }, [product, getProductImage])

  return (
    <img
      {...imgProps}
      src={src}
      alt={alt || product?.name || 'Product'}
      className={className}
      loading="lazy"
      onError={(e) => {
        setSrc(fallbackImg)
        imgProps.onError?.(e)
      }}
    />
  )
}
