import { useState, useEffect } from 'react';
import { Eye, CheckCircle, Clock, Package, XCircle, Trash2, Filter } from 'lucide-react';
import { orderAPI } from '../../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = filterStatus ? { status: filterStatus } : {};
      const { data } = await orderAPI.getAllOrders(params);
      setOrders(data.data.orders);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await orderAPI.updateOrderStatus(orderId, { orderStatus: status });
      toast.success(`Order marked as ${status}`);
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(prev => ({ ...prev, orderStatus: status }));
      }
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await orderAPI.cancelOrder(orderId);
      toast.success('Order cancelled successfully');
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(prev => ({ ...prev, orderStatus: 'cancelled' }));
      }
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const confirmDeleteOrder = (order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;
    
    try {
      await orderAPI.deleteOrder(orderToDelete._id);
      toast.success('Order deleted successfully');
      fetchOrders();
      setShowDeleteModal(false);
      setOrderToDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete order');
    }
  };

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
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gold-100 text-gold-700';
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-black-900 mb-2">
          Orders Management
        </h1>
        <p className="text-black-500">
          Manage and track all customer orders
        </p>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input-field w-full md:w-auto"
        >
          <option value="">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
                  Order #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-black-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-black-50">
                  <td className="px-6 py-4">
                    <span className="font-medium text-black-900">{order.orderNumber}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-black-900">{order.user?.name}</p>
                      <p className="text-sm text-black-500">{order.user?.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-black-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-black-600">{order.items.length} items</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gold-600">
                      Rs. {order.total.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.orderStatus)}
                      <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => viewOrderDetails(order)}
                        className="p-2 text-black-400 hover:text-gold-600 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {(order.orderStatus === 'cancelled' || order.orderStatus === 'delivered') && (
                        <button
                          onClick={() => confirmDeleteOrder(order)}
                          className="p-2 text-red-400 hover:text-red-600 transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black-900/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-semibold">
                  Order Details
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-black-400 hover:text-black-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-black-500">Order Number</p>
                  <p className="font-medium">{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-black-500">Date</p>
                  <p className="font-medium">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-black-500">Payment</p>
                  <p className="font-medium capitalize">{selectedOrder.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-black-500">Status</p>
                  <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(selectedOrder.orderStatus)}`}>
                    {selectedOrder.orderStatus}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-black-900 mb-3">Customer Information</h3>
                <div className="bg-black-50 p-4 rounded">
                  <p className="font-medium">{selectedOrder.shippingAddress.fullName}</p>
                  <p className="text-sm text-black-600">{selectedOrder.shippingAddress.email}</p>
                  <p className="text-sm text-black-600">{selectedOrder.shippingAddress.phone}</p>
                  <p className="text-sm text-black-600 mt-2">
                    {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city},
                    {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode},
                    {selectedOrder.shippingAddress.country}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-black-900 mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex gap-4 p-3 bg-black-50 rounded">
                      <div className="w-16 h-16 bg-black-100 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-black-900">{item.title}</p>
                        <p className="text-sm text-black-500">Quantity: {item.quantity}</p>
                        <p className="text-sm text-gold-600 font-semibold">
                          Rs. {item.price.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <p className="font-semibold text-black-900">
                        Rs. {(item.price * item.quantity).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-black-50 p-4 rounded">
                <div className="space-y-2">
                  <div className="flex justify-between text-black-600">
                    <span>Subtotal</span>
                    <span>Rs. {selectedOrder.subtotal.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-black-600">
                    <span>Discount</span>
                    <span>-Rs. {selectedOrder.discount.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-black-600">
                    <span>Shipping</span>
                    <span>Rs. {selectedOrder.shippingCost.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-black-600">
                    <span>Tax</span>
                    <span>Rs. {selectedOrder.tax.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-gold-600">Rs. {selectedOrder.total.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              {selectedOrder.orderStatus !== 'cancelled' && selectedOrder.orderStatus !== 'delivered' && (
                <div>
                  <h3 className="font-semibold text-black-900 mb-3">Update Status</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['pending', 'processing', 'shipped', 'delivered'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(selectedOrder._id, status)}
                        disabled={selectedOrder.orderStatus === status}
                        className={`px-4 py-2 text-sm font-medium rounded capitalize transition-colors ${
                          selectedOrder.orderStatus === status
                            ? 'bg-gold-600 text-white'
                            : 'bg-black-100 text-black-700 hover:bg-gold-100'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                  {selectedOrder.orderStatus === 'pending' || selectedOrder.orderStatus === 'processing' ? (
                    <button
                      onClick={() => handleCancelOrder(selectedOrder._id)}
                      className="w-full px-4 py-2 text-sm font-medium rounded capitalize transition-colors bg-red-100 text-red-700 hover:bg-red-200 flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel Order
                    </button>
                  ) : null}
                </div>
              )}

              {/* Delete Order (for cancelled/delivered) */}
              {(selectedOrder.orderStatus === 'cancelled' || selectedOrder.orderStatus === 'delivered') && (
                <div>
                  <h3 className="font-semibold text-black-900 mb-3 text-red-600">Danger Zone</h3>
                  <button
                    onClick={() => { setShowModal(false); confirmDeleteOrder(selectedOrder); }}
                    className="w-full px-4 py-2 text-sm font-medium rounded capitalize transition-colors bg-red-600 text-white hover:bg-red-700 flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Order Permanently
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && orderToDelete && (
        <div className="fixed inset-0 bg-black-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold text-black-900">Delete Order</h3>
                <p className="text-sm text-black-500">This action cannot be undone</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-black-700">
                Are you sure you want to delete order <span className="font-medium">{orderToDelete.orderNumber}</span>?
                This will permanently remove all order data including customer information and order history.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteModal(false); setOrderToDelete(null); }}
                className="flex-1 px-4 py-2 border border-black-300 text-black-700 rounded-lg hover:bg-black-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteOrder}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
