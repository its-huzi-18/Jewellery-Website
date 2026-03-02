import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, Truck, ChevronLeft } from 'lucide-react';
import { orderAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await orderAPI.getOrder(id);
        setOrder(data.data.order);
      } catch (error) {
        toast.error('Order not found');
        navigate('/account/orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      await orderAPI.cancelOrder(id);
      toast.success('Order cancelled successfully');
      setOrder(prev => ({ ...prev, orderStatus: 'cancelled', cancelledAt: new Date().toISOString() }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-6 h-6 text-red-600" />;
      case 'shipped':
        return <Package className="w-6 h-6 text-blue-600" />;
      default:
        return <Clock className="w-6 h-6 text-gold-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      case 'shipped':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gold-600 bg-gold-50';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return { color: 'bg-gold-100 text-gold-700', icon: <Clock className="w-4 h-4" /> };
      case 'processing':
        return { color: 'bg-blue-100 text-blue-700', icon: <Package className="w-4 h-4" /> };
      case 'shipped':
        return { color: 'bg-blue-100 text-blue-700', icon: <Truck className="w-4 h-4" /> };
      case 'delivered':
        return { color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-4 h-4" /> };
      case 'cancelled':
        return { color: 'bg-red-100 text-red-700', icon: <XCircle className="w-4 h-4" /> };
      default:
        return { color: 'bg-gray-100 text-gray-700', icon: <Clock className="w-4 h-4" /> };
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!order) {
    return null;
  }

  const statusBadge = getStatusBadge(order.orderStatus);

  return (
    <div className="pt-28 min-h-screen bg-black-50">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-black-500 mb-8">
          <Link to="/" className="hover:text-gold-600">Home</Link>
          <span>/</span>
          <Link to="/account/orders" className="hover:text-gold-600">My Orders</Link>
          <span>/</span>
          <span className="text-black-900">{order.orderNumber}</span>
        </nav>

        {/* Order Header */}
        <div className="bg-white p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-serif text-3xl font-bold text-black-900 mb-2">
                Order Details
              </h1>
              <p className="text-black-500">Order #{order.orderNumber}</p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusBadge.color}`}>
              {statusBadge.icon}
              <span className="font-medium capitalize">{order.orderStatus}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-black-500 mb-1">Date Placed</p>
              <p className="font-medium text-black-900">
                {new Date(order.createdAt).toLocaleDateString('en-PK', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-black-500 mb-1">Payment Method</p>
              <p className="font-medium text-black-900 capitalize">{order.paymentMethod}</p>
            </div>
            <div>
              <p className="text-sm text-black-500 mb-1">Total Amount</p>
              <p className="font-bold text-gold-600 text-lg">
                Rs. {order.total.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items List */}
            <div className="bg-white p-6">
              <h2 className="font-serif text-xl font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                    <div className="w-20 h-20 bg-black-100 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Link
                        to={`/products/${item.product}`}
                        className="font-medium text-black-900 hover:text-gold-600 line-clamp-2"
                      >
                        {item.title}
                      </Link>
                      <div className="flex items-center gap-4 mt-2">
                        <p className="text-sm text-black-500">Quantity: {item.quantity}</p>
                        {item.discount > 0 && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                            -{item.discount}%
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {item.discount > 0 ? (
                          <>
                            <span className="font-semibold text-gold-600">
                              Rs. {item.price.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                            <span className="text-sm text-black-400 line-through">
                              Rs. {(item.price / (1 - item.discount / 100)).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </>
                        ) : (
                          <span className="font-semibold text-black-900">
                            Rs. {item.price.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="font-semibold text-black-900">
                      Rs. {(item.price * item.quantity).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Info Sidebar */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-white p-6">
              <h2 className="font-serif text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="text-black-600">
                <p className="font-medium text-black-900">{order.shippingAddress.fullName}</p>
                <p className="text-sm">{order.shippingAddress.street}</p>
                <p className="text-sm">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p className="text-sm">{order.shippingAddress.country}</p>
                <p className="text-sm mt-2">{order.shippingAddress.phone}</p>
                <p className="text-sm">{order.shippingAddress.email}</p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white p-6">
              <h2 className="font-serif text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-black-600">
                  <span>Subtotal</span>
                  <span>Rs. {order.subtotal.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-black-600">
                  <span>Discount</span>
                  <span className="text-green-600">-Rs. {order.discount.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-black-600">
                  <span>Shipping</span>
                  <span>{order.shippingCost === 0 ? <span className="text-green-600 font-medium">FREE</span> : `Rs. ${order.shippingCost.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span>
                </div>
                <div className="flex justify-between text-black-600">
                  <span>Tax</span>
                  <span>Rs. {order.tax.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-gold-600">Rs. {order.total.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Cancel Order Button */}
            {(order.orderStatus === 'pending' || order.orderStatus === 'processing') && (
              <div className="bg-white p-6">
                <h2 className="font-serif text-lg font-semibold mb-4 text-red-600">Cancel Order</h2>
                <p className="text-sm text-black-500 mb-4">
                  You can cancel this order as it hasn't been shipped yet.
                </p>
                <button
                  onClick={handleCancelOrder}
                  className="w-full btn-outline border-red-300 text-red-600 hover:bg-red-50 flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel Order
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
