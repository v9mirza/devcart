import { useCart } from '../context/CartContext'

export default function ProductModal() {
  const {
    activeProductDetail,
    setActiveProductDetail,
    colorsMap,
    getProductImage,
    getProductColors,
    addToCart
  } = useCart()

  if (!activeProductDetail) return null

  const selectedColor = activeProductDetail.selectedColor || getProductColors(activeProductDetail)[0]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        onClick={() => setActiveProductDetail(null)} 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Modal Container */}
      <div className="bg-[#fcfcf9] rounded-[32px] w-full max-w-2xl border border-stone-200/50 shadow-2xl relative overflow-hidden z-10 flex flex-col md:flex-row max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible">
        {/* Left Column: Image Area */}
        <div className="md:w-1/2 bg-[#f5f6f2] p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-stone-200/30">
          <img 
            src={getProductImage(activeProductDetail)} 
            className="max-h-60 md:max-h-80 object-contain filter drop-shadow-xl" 
            alt={activeProductDetail.name} 
          />
        </div>

        {/* Right Column: Info Area */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between gap-6">
          <div>
            <div className="flex justify-between items-start gap-4 mb-2">
              <div>
                <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {activeProductDetail.categoryName || activeProductDetail.category}
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-2 leading-tight">
                  {activeProductDetail.name}
                </h2>
              </div>
              <span className="text-xl font-black text-indigo-600">${activeProductDetail.price}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-stone-500 font-bold mb-4">
              <span className="text-yellow-500">★</span> 
              <span className="text-slate-800">{activeProductDetail.rating || 4.7}</span> 
              <span>({activeProductDetail.reviewsCount || 100} reviews)</span>
            </div>

            <p className="text-xs text-stone-500 leading-relaxed font-medium mb-6">
              {activeProductDetail.description}
            </p>

            {/* Color Selector */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-800 mb-2.5 uppercase tracking-wider">Colors available</h4>
              <div className="flex gap-2.5">
                {getProductColors(activeProductDetail).map((colorName) => (
                  <button
                    key={colorName}
                    onClick={() => {
                      setActiveProductDetail(prev => ({...prev, selectedColor: colorName}))
                    }}
                    className={`w-7 h-7 rounded-full ${colorsMap[colorName]} transition-all duration-200 cursor-pointer ${
                      selectedColor === colorName 
                        ? 'ring-4 scale-110 shadow-xs' 
                        : 'opacity-85 hover:opacity-100'
                    }`}
                    aria-label={`Select color ${colorName}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Add to Cart Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => addToCart(
                activeProductDetail, 
                selectedColor, 
                1
              )}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-full text-center shadow-md cursor-pointer transition-transform duration-200 hover:scale-[1.02] active:scale-98"
            >
              Add to Cart
            </button>
            <button
              onClick={() => setActiveProductDetail(null)}
              className="px-5 py-3 border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 font-bold rounded-full cursor-pointer transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setActiveProductDetail(null)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          ×
        </button>
      </div>
    </div>
  )
}
