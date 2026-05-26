import { Link } from 'react-router-dom'
import { useCart, getProductId } from '../context/CartContext'

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    cartTotalItems,
    cartSubtotal,
    taxAmount,
    shippingCost,
    cartTotal,
    colorsMap,
    getProductImage,
    handleCheckout
  } = useCart()

  if (!isCartOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Slide panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-stone-200/50 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h2 className="text-lg font-black text-slate-900">Your Cart</h2>
              <span className="text-xs bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded-full">
                {cartTotalItems}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              ×
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-stone-100">
            {cart.length > 0 ? (
              cart.map((item, idx) => (
                <div key={`${getProductId(item.product)}-${item.color}-${idx}`} className="py-4.5 flex gap-4 items-center">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 bg-stone-100 rounded-xl overflow-hidden flex items-center justify-center p-1.5 flex-shrink-0">
                    <img src={getProductImage(item.product)} className="object-contain w-full h-full" alt="" />
                  </div>
                  
                  {/* Metadata */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-sm text-slate-900 truncate leading-snug">
                      {item.product.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`w-3.5 h-3.5 rounded-full ${colorsMap[item.color]}`} />
                      <span className="text-xs text-stone-400 capitalize font-bold">{item.color}</span>
                    </div>
                    <span className="block text-xs font-black text-indigo-600 mt-1.5">${item.customPrice || item.product.price}</span>
                  </div>

                  {/* Quantity Actions */}
                  <div className="flex flex-col items-end gap-2.5">
                    <div className="flex items-center border border-stone-200 rounded-full px-2 py-1 bg-white">
                      <button
                        onClick={() => updateCartQuantity(getProductId(item.product), item.color, item.quantity - 1, item.customPrice)}
                        className="w-5 h-5 rounded-full flex items-center justify-center text-slate-600 hover:bg-stone-100 font-black cursor-pointer text-xs"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-extrabold text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(getProductId(item.product), item.color, item.quantity + 1, item.customPrice)}
                        className="w-5 h-5 rounded-full flex items-center justify-center text-slate-600 hover:bg-stone-100 font-black cursor-pointer text-xs"
                      >
                        +
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(getProductId(item.product), item.color, item.customPrice)}
                      className="text-xs text-stone-400 hover:text-red-500 font-bold transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="text-4xl mb-4">🛒</span>
                <h4 className="text-sm font-bold text-slate-800">Your cart is empty</h4>
                <p className="text-xs text-stone-400 mt-1.5 max-w-[200px]">Fill it with high-end tech products from our dashboard.</p>
              </div>
            )}
          </div>

          {/* Drawer footer summary */}
          {cart.length > 0 && (
            <div className="px-6 py-6 bg-stone-50 border-t border-stone-100 flex flex-col gap-3">
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
                  <span className="text-indigo-600">${cartTotal}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <Link
                  to="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-3 rounded-full text-center shadow-lg transition-transform duration-200 hover:scale-[1.01] active:scale-99"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={handleCheckout}
                  className="w-full border border-stone-200 bg-white hover:bg-stone-50 text-slate-700 font-bold py-2 rounded-full text-center text-xs transition-colors cursor-pointer"
                >
                  Instant MVP Checkout
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
