import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { orderAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await orderAPI.getMyOrders();
        setOrders(data.data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'shipped':
        return <Package className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-gold-600" />;
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

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="pt-28 min-h-screen bg-black-50">
      <div className="container-custom">
        <h1 className="font-serif text-4xl font-bold text-black-900 mb-8">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white p-12 text-center">
            <Package className="w-16 h-16 mx-auto text-black-300 mb-4" />
            <h2 className="text-xl font-semibold text-black-900 mb-2">
              No orders yet
            </h2>
            <p className="text-black-500 mb-6">
              Start shopping to see your orders here
            </p>
            <Link to="/products" className="btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-6">
                {/* Order header */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b">
                  <div>
                    <p className="text-sm text-black-500">Order Number</p>
                    <p className="font-medium text-black-900">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-black-500">Date Placed</p>
                    <p className="font-medium text-black-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-black-500">Total</p>
                    <p className="font-semibold text-gold-600">
                      Rs. {order.total.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(order.orderStatus)}`}>
                    {getStatusIcon(order.orderStatus)}
                    <span className="font-medium capitalize">{order.orderStatus}</span>
                  </div>
                </div>

                {/* Order items */}
                <div className="py-4">
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex gap-4">
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
                            className="font-medium text-black-900 hover:text-gold-600"
                          >
                            {item.title}
                          </Link>
                          <p className="text-sm text-black-500">
                            Quantity: {item.quantity}
                          </p>
                          <p className="text-sm font-semibold text-gold-600">
                            Rs. {item.price.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order footer */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
                  <div className="text-sm text-black-500">
                    <p>Shipping to: {order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.street}, {order.shippingAddress.city}</p>
                  </div>
                  {order.orderStatus === 'pending' || order.orderStatus === 'processing' ? (
                    <button className="btn-outline text-sm py-2">
                      Cancel Order
                    </button>
                  ) : (
                    <Link to={`/orders/${order._id}`} className="btn-outline text-sm py-2">
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
