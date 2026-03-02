import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Heart } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart, loading } = useCart();
  
  // Fallback image if mainImage fails
  const getFallbackImage = (category) => {
    const fallbacks = {
      rings: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop',
      bracelets: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop',
      necklaces: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=400&h=400&fit=crop',
      earrings: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop',
      charms: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
      default: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop'
    };
    return fallbacks[category] || fallbacks.default;
  };

  const [imageError, setImageError] = useState(false);

  const discountedPrice = product.discount > 0
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : product.price;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product._id, 1);
    } catch (error) {
      // Error handled in context
    }
  };

  const displayImage = imageError 
    ? getFallbackImage(product.category) 
    : (product.mainImage ? `${product.mainImage}&q=80&w=400` : getFallbackImage(product.category));

  return (
    <Link to={`/products/${product._id}`} className="product-card group block animate-fade-in">
      <div className="relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-2xl transition-all duration-500">
        {/* Badges */}
        {product.discount > 0 && (
          <span className="badge-sale rounded-full px-3 py-1 text-xs font-bold shadow-lg">
            -{product.discount}% OFF
          </span>
        )}
        {product.featured && !product.discount && (
          <span className="badge-new rounded-full px-3 py-1 text-xs font-bold shadow-lg">
            NEW
          </span>
        )}

        {/* Wishlist button */}
        <button 
          className="absolute top-3 right-3 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-gold-600 hover:text-white z-20 shadow-lg"
          onClick={(e) => e.preventDefault()}
        >
          <Heart className="w-5 h-5" />
        </button>

        {/* Product image */}
        <div className="product-image relative bg-gradient-to-br from-black-50 to-black-100">
          <img
            src={displayImage}
            alt={product.title}
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center"
          />
          {/* Image overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
        </div>

        {/* Quick add to cart */}
        <button
          onClick={handleAddToCart}
          disabled={loading || product.stock === 0}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black-900/95 backdrop-blur-sm text-white px-6 py-3 text-sm font-medium rounded-full
                     opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300
                     hover:bg-gold-600 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2 shadow-lg z-10 min-w-[160px]"
        >
          <ShoppingBag className="w-4 h-4" />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>

        {/* Product info */}
        <div className="p-5">
          {/* Category */}
          <p className="text-xs text-gold-600 uppercase tracking-widest font-semibold mb-2">
            {product.category}
          </p>
          
          {/* Title */}
          <h3 className="font-serif text-base font-semibold text-black-900 mb-3 line-clamp-2 leading-snug group-hover:text-gold-600 transition-colors duration-300">
            {product.title}
          </h3>

          {/* Rating */}
          {product.ratings?.average > 0 && (
            <div className="flex items-center justify-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3.5 h-3.5 ${
                    star <= Math.round(product.ratings.average)
                      ? 'fill-gold-500 text-gold-500'
                      : 'text-black-200'
                  }`}
                />
              ))}
              <span className="text-xs text-black-500 ml-1">({product.ratings.count})</span>
            </div>
          )}

          {/* Price - Professional Design */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-black-100">
            <div className="flex items-center gap-2">
              {product.discount > 0 ? (
                <>
                  <span className="text-xl font-bold text-gold-600">
                    Rs. {Number(discountedPrice).toLocaleString('en-PK')}
                  </span>
                  <span className="text-sm text-black-400 line-through font-medium">
                    Rs. {product.price.toLocaleString('en-PK')}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-black-900">
                  Rs. {product.price.toLocaleString('en-PK')}
                </span>
              )}
            </div>
            {product.stock > 0 && product.stock <= 5 && (
              <span className="text-xs text-red-500 font-medium bg-red-50 px-2 py-1 rounded-full">
                Only {product.stock} left
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
