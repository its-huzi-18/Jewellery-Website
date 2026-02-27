import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';
import { orderAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'USA',
    paymentMethod: 'card',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const subtotal = cart?.totalPrice || 0;
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.street.trim()) newErrors.street = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!cart || cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod,
        notes: formData.notes
      };

      const { data } = await orderAPI.createOrder(orderData);
      await clearCart();
      
      toast.success('Order placed successfully!');
      navigate(`/orders/${data.data.order._id}`, { state: { order: data.data.order } });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to place order';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="pt-28 min-h-screen bg-black-50">
      <div className="container-custom">
        <h1 className="font-serif text-4xl font-bold text-black-900 mb-8">
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form section */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Information */}
              <div className="bg-white p-6">
                <h2 className="font-serif text-xl font-semibold mb-6 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-gold-600" />
                  Contact Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`input-field ${errors.fullName ? 'border-red-500' : ''}`}
                      placeholder="John Doe"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-black-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white p-6">
                <h2 className="font-serif text-xl font-semibold mb-6 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-gold-600" />
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black-700 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      className={`input-field ${errors.street ? 'border-red-500' : ''}`}
                      placeholder="123 Main Street"
                    />
                    {errors.street && (
                      <p className="text-red-500 text-sm mt-1">{errors.street}</p>
                    )}
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`input-field ${errors.city ? 'border-red-500' : ''}`}
                        placeholder="Karachi"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={`input-field ${errors.state ? 'border-red-500' : ''}`}
                        placeholder="Sindh"
                      />
                      {errors.state && (
                        <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black-700 mb-1">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className={`input-field ${errors.zipCode ? 'border-red-500' : ''}`}
                        placeholder="75500"
                      />
                      {errors.zipCode && (
                        <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black-700 mb-1">
                      Country
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="input-field"
                      disabled
                    >
                      <option value="Pakistan">Pakistan</option>
                    </select>
                    <p className="text-xs text-black-500 mt-1">Currently shipping within Pakistan only</p>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white p-6">
                <h2 className="font-serif text-xl font-semibold mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-gold-600" />
                  Payment Method
                </h2>
                
                {/* Cash on Delivery - Currently Active */}
                <label
                  className={`flex items-center p-4 border cursor-pointer transition-colors ${
                    formData.paymentMethod === 'cod'
                      ? 'border-gold-600 bg-gold-50'
                      : 'hover:border-gold-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                    className="w-4 h-4 text-gold-600 focus:ring-gold-500"
                  />
                  <div className="ml-3">
                    <span className="font-medium block">Cash on Delivery</span>
                    <span className="text-xs text-black-500 block">Pay with cash when you receive your order</span>
                  </div>
                </label>

                {/* Coming Soon - Other Payment Methods */}
                <div className="mt-4 p-4 bg-black-50 rounded-lg border border-black-200">
                  <p className="text-sm font-medium text-black-700 mb-2">More Payment Options Coming Soon:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-black-500">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-black-300 rounded-full"></div>
                      <span>Credit/Debit Card</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-black-300 rounded-full"></div>
                      <span>JazzCash</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-black-300 rounded-full"></div>
                      <span>Easypaisa</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-black-300 rounded-full"></div>
                      <span>Bank Transfer</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white p-6">
                <h2 className="font-serif text-xl font-semibold mb-6">
                  Order Notes (Optional)
                </h2>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Any special instructions for your order..."
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 sticky top-32">
                <h2 className="font-serif text-xl font-semibold mb-6">
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item._id} className="flex gap-4">
                      <div className="w-16 h-16 bg-black-100 flex-shrink-0">
                        <img
                          src={item.product.mainImage}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black-900 line-clamp-2">
                          {item.product.title}
                        </p>
                        <p className="text-sm text-black-500">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-gold-600">
                          Rs. {(item.price * item.quantity).toLocaleString('en-PK')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-black-600">
                    <span>Subtotal</span>
                    <span>Rs. {subtotal.toLocaleString('en-PK')}</span>
                  </div>
                  <div className="flex justify-between text-black-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `Rs. ${shipping.toLocaleString('en-PK')}`}</span>
                  </div>
                  <div className="flex justify-between text-black-600">
                    <span>Tax</span>
                    <span>Rs. {tax.toLocaleString('en-PK')}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-gold-600">Rs. {total.toLocaleString('en-PK')}</span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full mt-6 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : `Place Order - Rs. ${total.toLocaleString('en-PK')}`}
                </button>

                <p className="text-xs text-black-500 text-center mt-4">
                  By placing this order, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
