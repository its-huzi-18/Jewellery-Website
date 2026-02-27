import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Minus, Plus, Star, ChevronLeft, ChevronRight, Heart, Share2 } from 'lucide-react';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, loading: cartLoading } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await productAPI.getProduct(id);
        setProduct(data.data.product);
        setSelectedImage(0);

        // Fetch related products
        const relatedRes = await productAPI.getByCategory(data.data.product.category);
        setRelatedProducts(
          relatedRes.data.data.products
            .filter(p => p._id !== data.data.product._id)
            .slice(0, 4)
        );
      } catch (error) {
        console.error('Error fetching product:', error);
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, quantity);
    } catch (error) {
      // Error handled in context
    }
  };

  const discountedPrice = product?.discount > 0
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : product?.price;

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!product) {
    return null;
  }

  const images = product.images?.length > 0 ? product.images : [{ url: product.mainImage }];

  return (
    <div className="pt-28 min-h-screen bg-black-50">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-black-500 mb-8">
          <Link to="/" className="hover:text-gold-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-gold-600 capitalize">{product.category}</Link>
          <span>/</span>
          <span className="text-black-900">{product.title}</span>
        </nav>

        {/* Product details */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Images */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="aspect-square bg-black-100 overflow-hidden">
              <img
                src={images[selectedImage]?.url || product.mainImage}
                alt={product.title}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Thumbnail navigation */}
            {images.length > 1 && (
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
                  className="p-2 border hover:border-gold-600 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-3 overflow-x-auto">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 flex-shrink-0 border-2 overflow-hidden ${
                        selectedImage === index ? 'border-gold-600' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={img.url || img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedImage(prev => prev < images.length - 1 ? prev + 1 : 0)}
                  className="p-2 border hover:border-gold-600 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Product info */}
          <div>
            {/* Badges */}
            <div className="flex items-center gap-3 mb-4">
              {product.discount > 0 && (
                <span className="bg-gold-600 text-white text-xs font-bold px-3 py-1 uppercase">
                  -{product.discount}% OFF
                </span>
              )}
              {product.featured && (
                <span className="bg-black-900 text-white text-xs font-bold px-3 py-1 uppercase">
                  Featured
                </span>
              )}
              {product.stock < 10 && product.stock > 0 && (
                <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 uppercase">
                  Only {product.stock} left
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-black-900 mb-4">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= (product.ratings?.average || 0)
                        ? 'fill-gold-500 text-gold-500'
                        : 'text-black-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-black-600">
                {product.ratings?.count || 0} reviews
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-gold-600">
                  Rs. {Number(discountedPrice).toLocaleString('en-PK')}
                </span>
                {product.discount > 0 && (
                  <span className="text-xl text-black-400 line-through">
                    Rs. {product.price.toLocaleString('en-PK')}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-black-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-black-900 mb-2">
                Quantity
              </label>
              <div className="flex items-center border w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-black-50 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-16 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 hover:bg-black-50 transition-colors"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Add to cart */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={cartLoading || product.stock === 0}
                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShoppingBag className="w-5 h-5" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button className="p-3 border hover:border-gold-600 transition-colors">
                <Heart className="w-6 h-6" />
              </button>
              <button className="p-3 border hover:border-gold-600 transition-colors">
                <Share2 className="w-6 h-6" />
              </button>
            </div>

            {/* Additional info */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-black-500 w-24">SKU:</span>
                <span className="text-black-900">BG-{product._id.slice(-8)}</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-black-500 w-24">Category:</span>
                <Link
                  to={`/products?category=${product.category}`}
                  className="text-gold-600 hover:underline capitalize"
                >
                  {product.category}
                </Link>
              </div>
              {product.stock > 0 && (
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-black-500 w-24">Availability:</span>
                  <span className="text-green-600">In Stock ({product.stock} available)</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-20">
          <div className="border-b">
            <div className="flex gap-8">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'text-gold-600 border-b-2 border-gold-600'
                      : 'text-black-500 hover:text-black-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="max-w-3xl text-black-600 leading-relaxed">
                <p>{product.description}</p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="max-w-3xl">
                {product.specifications?.length > 0 ? (
                  <table className="w-full">
                    <tbody>
                      {product.specifications.map((spec, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3 font-medium text-black-900 w-1/3">{spec.name}</td>
                          <td className="py-3 text-black-600">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-black-500">No specifications available.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="max-w-3xl text-center py-12">
                <p className="text-black-500">Reviews coming soon.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="section-title text-center mb-12">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
