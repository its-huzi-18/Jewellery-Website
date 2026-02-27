import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, loading, updateCartItem, removeFromCart } = useCart();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="pt-28 min-h-screen bg-black-50">
        <div className="container-custom">
          <div className="max-w-md mx-auto text-center py-20">
            <ShoppingBag className="w-24 h-24 mx-auto text-black-300 mb-6" />
            <h1 className="font-serif text-3xl font-bold text-black-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-black-500 mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link to="/products" className="btn-primary inline-flex items-center gap-2">
              Start Shopping
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = cart.totalPrice;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  return (
    <div className="pt-28 min-h-screen bg-black-50">
      <div className="container-custom">
        {/* Header */}
        <h1 className="font-serif text-4xl font-bold text-black-900 mb-8">
          Shopping Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item._id}
                className="bg-white p-4 md:p-6 flex gap-4 md:gap-6"
              >
                {/* Product image */}
                <Link
                  to={`/products/${item.product._id}`}
                  className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-black-100 overflow-hidden"
                >
                  <img
                    src={item.product.mainImage}
                    alt={item.product.title}
                    className="w-full h-full object-cover"
                  />
                </Link>

                {/* Product details */}
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <Link
                      to={`/products/${item.product._id}`}
                      className="font-medium text-black-900 hover:text-gold-600 line-clamp-2"
                    >
                      {item.product.title}
                    </Link>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-black-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-sm text-black-500 mb-3 capitalize">
                    {item.product.category}
                  </p>

                  {/* Price */}
                  <div className="mb-3">
                    {item.product.discount > 0 ? (
                      <div className="flex items-center gap-2">
                        <span className="text-gold-600 font-semibold">
                          Rs. {item.price.toLocaleString('en-PK')}
                        </span>
                        <span className="text-black-400 line-through text-sm">
                          Rs. {item.product.price.toLocaleString('en-PK')}
                        </span>
                      </div>
                    ) : (
                      <span className="text-black-900 font-semibold">
                        Rs. {item.price.toLocaleString('en-PK')}
                      </span>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border">
                      <button
                        onClick={() => updateCartItem(item._id, item.quantity - 1)}
                        className="p-2 hover:bg-black-50 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateCartItem(item._id, item.quantity + 1)}
                        className="p-2 hover:bg-black-50 transition-colors"
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-sm text-black-500">
                      Stock: {item.product.stock}
                    </span>
                  </div>
                </div>

                {/* Item total */}
                <div className="text-right">
                  <p className="font-semibold text-black-900">
                    Rs. {(item.price * item.quantity).toLocaleString('en-PK')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 sticky top-32">
              <h2 className="font-serif text-xl font-semibold mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-black-600">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString('en-PK')}</span>
                </div>
                <div className="flex justify-between text-black-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `Rs. ${shipping.toLocaleString('en-PK')}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-sm text-gold-600">
                    Add Rs. {(15000 - subtotal).toLocaleString('en-PK')} more for free shipping!
                  </p>
                )}
                <div className="border-t pt-4 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-gold-600">Rs. {total.toLocaleString('en-PK')}</span>
                </div>
              </div>

              <button
                onClick={() => isAuthenticated ? navigate('/checkout') : navigate('/login')}
                className="btn-primary w-full mb-4"
              >
                {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
              </button>

              <Link
                to="/products"
                className="block text-center text-black-600 hover:text-gold-600 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
