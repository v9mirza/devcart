import { Link } from 'react-router-dom'
import { useCart, getProductId } from '../context/CartContext'
import DrawerShell from './DrawerShell'
import ProductImage from './ProductImage'

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotalItems,
    cartSubtotal,
    taxAmount,
    shippingCost,
    cartTotal,
    getProductImage,
    handleCheckout,
    isBackendOnline,
    cartSyncError,
    user
  } = useCart()

  const handleDemoCheckout = () => {
    handleCheckout(null, { demo: true })
    setIsCartOpen(false)
  }

  return (
    <DrawerShell open={isCartOpen} onClose={() => setIsCartOpen(false)}>
      <header className="shrink-0 px-6 py-5 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h2 className="text-lg font-black text-slate-900">Your Cart</h2>
              <span className="text-xs bg-accent-muted text-accent font-bold px-2 py-0.5 rounded-full">
                {cartTotalItems}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              ×
            </button>
      </header>

      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 py-4 divide-y divide-stone-100">
            {cart.length > 0 ? (
              cart.map((item, idx) => (
                <div key={`${getProductId(item.product)}-${idx}`} className="py-4.5 flex gap-4 items-center">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 bg-stone-100 rounded-xl overflow-hidden flex items-center justify-center p-1.5 flex-shrink-0">
                    <ProductImage
                      product={item.product}
                      getProductImage={getProductImage}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  
                  {/* Metadata */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-sm text-slate-900 truncate leading-snug">
                      {item.product.name}
                    </h4>
                    <span className="block text-xs font-black text-slate-900 mt-1.5">${item.product.price}</span>
                  </div>

                  {/* Quantity Actions */}
                  <div className="flex flex-col items-end gap-2.5">
                    <div className="flex items-center border border-stone-200 rounded-full px-2 py-1 bg-white">
                      <button
                        onClick={() => updateCartQuantity(getProductId(item.product), item.quantity - 1)}
                        className="w-5 h-5 rounded-full flex items-center justify-center text-slate-600 hover:bg-stone-100 font-black cursor-pointer text-xs"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-extrabold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(getProductId(item.product), item.quantity + 1)}
                        className="w-5 h-5 rounded-full flex items-center justify-center text-slate-600 hover:bg-stone-100 font-black cursor-pointer text-xs"
                      >
                        +
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(getProductId(item.product))}
                      className="text-xs text-stone-400 hover:text-red-500 font-bold transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-empty-in px-4">
                <span className="text-4xl mb-4">🛒</span>
                <h4 className="text-sm font-bold text-slate-800">Your cart is empty</h4>
                <p className="text-xs text-stone-400 mt-1.5 max-w-[220px]">
                  {user
                    ? 'Browse the catalog and add items to get started.'
                    : 'Sign in to save items in your cart and check out.'}
                </p>
                {!user && (
                  <Link
                    to="/login"
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 text-xs font-bold text-accent hover:text-accent-hover"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            )}
      </div>

      {cart.length > 0 && (
        <footer className="shrink-0 px-6 py-6 bg-inset border-t border-zinc-200 flex flex-col gap-3 safe-area-pb">
              <div className="flex flex-col gap-2 text-sm font-bold text-stone-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-800">${cartSubtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span className="text-slate-800">${taxAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-slate-800">
                    {shippingCost === 0 ? 'FREE' : `$${shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between text-base text-slate-900 font-black border-t border-stone-200/60 pt-3">
                  <span>Total Amount</span>
                  <span className="text-slate-900">${cartTotal}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                {isBackendOnline ? (
                  <Link
                    to="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full btn-primary py-3 shadow-lg"
                  >
                    Proceed to Checkout
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full bg-stone-300 text-stone-600 font-bold py-3 rounded-full text-center cursor-not-allowed"
                  >
                    Checkout Unavailable (Server Offline)
                  </button>
                )}
                {import.meta.env.DEV && (
                  <button
                    type="button"
                    onClick={handleDemoCheckout}
                    className="w-full border border-dashed border-amber-300 bg-amber-50/80 hover:bg-amber-50 text-amber-900 font-bold py-2 rounded-full text-center text-xs transition-colors cursor-pointer"
                  >
                    Demo checkout (no order)
                  </button>
                )}
                <button
                  onClick={clearCart}
                  className="w-full border border-stone-200 bg-white hover:bg-stone-50 text-slate-700 font-bold py-2 rounded-full text-center text-xs transition-colors cursor-pointer"
                >
                  Clear Cart
                </button>
                {!isBackendOnline && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 font-semibold">
                    Server offline. Cart changes and checkout are temporarily disabled.
                  </p>
                )}
                {cartSyncError && (
                  <p className="text-[11px] text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 font-semibold">
                    {cartSyncError}
                  </p>
                )}
              </div>
        </footer>
      )}

    </DrawerShell>
  )
}
