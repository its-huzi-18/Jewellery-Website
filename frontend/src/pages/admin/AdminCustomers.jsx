import { useState, useEffect } from 'react';
import { Users, Mail, Phone, MapPin, Search, Eye, Trash2 } from 'lucide-react';
import { orderAPI } from '../../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      // Fetch all orders to get customer data
      const { data } = await orderAPI.getAllOrders({});
      const orders = data.data.orders || [];
      
      // Extract unique customers from orders
      const customerMap = new Map();
      orders.forEach(order => {
        if (order.user && !customerMap.has(order.user._id)) {
          customerMap.set(order.user._id, {
            ...order.user,
            ordersCount: 0,
            totalSpent: 0,
            lastOrderDate: null
          });
        }
        if (order.user) {
          const customer = customerMap.get(order.user._id);
          customer.ordersCount += 1;
          customer.totalSpent += order.total || 0;
          if (!customer.lastOrderDate || new Date(order.createdAt) > new Date(customer.lastOrderDate)) {
            customer.lastOrderDate = order.createdAt;
          }
        }
      });
      
      setCustomers(Array.from(customerMap.values()));
    } catch (error) {
      toast.error('Failed to fetch customers');
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const viewCustomerDetails = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-black-900 mb-2">
          Customers Management
        </h1>
        <p className="text-black-500">
          View and manage your customer base
        </p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 mb-6">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-black-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field w-full md:w-auto flex-1"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-black-500 text-sm">Total Customers</span>
          </div>
          <p className="text-2xl font-bold text-black-900">{customers.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-black-500 text-sm">Active Customers</span>
          </div>
          <p className="text-2xl font-bold text-black-900">
            {customers.filter(c => c.ordersCount > 0).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <span className="text-black-500 text-sm">Avg Orders/Customer</span>
          </div>
          <p className="text-2xl font-bold text-black-900">
            {customers.length > 0 ? (customers.reduce((sum, c) => sum + c.ordersCount, 0) / customers.length).toFixed(1) : '0'}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-black-500 text-sm">Total Revenue</span>
          </div>
          <p className="text-2xl font-bold text-black-900">
            Rs. {formatCurrency(customers.reduce((sum, c) => sum + c.totalSpent, 0))}
          </p>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider">
                  Last Order
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-black-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-black-500">
                    {searchTerm ? 'No customers found matching your search' : 'No customers yet'}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-black-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center font-semibold">
                          {customer.name?.charAt(0).toUpperCase() || 'C'}
                        </div>
                        <div>
                          <p className="font-medium text-black-900">{customer.name}</p>
                          <p className="text-sm text-black-500">ID: {customer._id?.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-black-600">
                          <Mail className="w-4 h-4" />
                          {customer.email}
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-2 text-sm text-black-600">
                            <Phone className="w-4 h-4" />
                            {customer.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-black-900">{customer.ordersCount} orders</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gold-600">
                        Rs. {formatCurrency(customer.totalSpent)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {customer.lastOrderDate ? (
                        <span className="text-black-600">{formatDate(customer.lastOrderDate)}</span>
                      ) : (
                        <span className="text-black-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => viewCustomerDetails(customer)}
                          className="p-2 text-black-400 hover:text-gold-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details Modal */}
      {showModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black-900/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-semibold">
                  Customer Details
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-black-400 hover:text-black-600"
                >
                  <Users className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center text-2xl font-bold">
                  {selectedCustomer.name?.charAt(0).toUpperCase() || 'C'}
                </div>
                <div>
                  <h3 className="font-semibold text-xl text-black-900">{selectedCustomer.name}</h3>
                  <p className="text-black-500">Customer since {formatDate(selectedCustomer.createdAt)}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="font-semibold text-black-900 mb-3">Contact Information</h4>
                <div className="bg-black-50 p-4 rounded space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-black-400" />
                    <span className="text-black-700">{selectedCustomer.email}</span>
                  </div>
                  {selectedCustomer.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-black-400" />
                      <span className="text-black-700">{selectedCustomer.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black-50 p-4 rounded">
                  <p className="text-sm text-black-500 mb-1">Total Orders</p>
                  <p className="text-2xl font-bold text-black-900">{selectedCustomer.ordersCount}</p>
                </div>
                <div className="bg-black-50 p-4 rounded">
                  <p className="text-sm text-black-500 mb-1">Total Spent</p>
                  <p className="text-2xl font-bold text-gold-600">Rs. {formatCurrency(selectedCustomer.totalSpent)}</p>
                </div>
              </div>

              {/* Last Order */}
              {selectedCustomer.lastOrderDate && (
                <div>
                  <p className="text-sm text-black-500 mb-1">Last Order Date</p>
                  <p className="font-medium text-black-900">{formatDate(selectedCustomer.lastOrderDate)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
