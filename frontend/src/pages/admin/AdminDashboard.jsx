import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, DollarSign, TrendingUp, ShoppingCart, ArrowUpRight } from 'lucide-react';
import { orderAPI, productAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, productsRes] = await Promise.all([
          orderAPI.getStats(),
          productAPI.getTopSelling()
        ]);

        setStats(statsRes.data.data);
        setTopProducts(productsRes.data.data.products.slice(0, 5));
        setRecentOrders(statsRes.data.data.recentOrders);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-black-900 mb-2">
          Dashboard Overview
        </h1>
        <p className="text-black-500">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-green-600 text-sm font-medium flex items-center">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +12.5%
            </span>
          </div>
          <p className="text-black-500 text-sm mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-black-900">
            Rs. {(stats?.revenue?.totalRevenue || 0).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <span className="text-green-600 text-sm font-medium flex items-center">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +8.2%
            </span>
          </div>
          <p className="text-black-500 text-sm mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-black-900">
            {stats?.totalOrders || 0}
          </p>
        </div>

        <div className="bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <span className="text-black-400 text-sm font-medium">Products</span>
          </div>
          <p className="text-black-500 text-sm mb-1">Total Products</p>
          <p className="text-2xl font-bold text-black-900">
            {topProducts.length * 4}
          </p>
        </div>

        <div className="bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-green-600 text-sm font-medium flex items-center">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +5.3%
            </span>
          </div>
          <p className="text-black-500 text-sm mb-1">Avg Order Value</p>
          <p className="text-2xl font-bold text-black-900">
            Rs. {(stats?.revenue?.totalOrders
              ? (stats.revenue.totalRevenue / stats.revenue.totalOrders)
              : 0).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl font-semibold">Top Selling Products</h2>
            <Link to="/admin/products" className="text-gold-600 text-sm font-medium hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product._id} className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0">
                <span className="w-6 h-6 rounded-full bg-black-100 text-black-600 flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <div className="w-12 h-12 bg-black-100 flex-shrink-0">
                  <img
                    src={product.mainImage}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-black-900 truncate">{product.title}</p>
                  <p className="text-sm text-black-500">{product.soldCount || 0} sold</p>
                </div>
                <p className="font-semibold text-gold-600">
                  Rs. {product.price.toLocaleString('en-PK')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl font-semibold">Recent Orders</h2>
            <Link to="/admin/orders" className="text-gold-600 text-sm font-medium hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order._id} className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-black-900">{order.orderNumber}</p>
                  <p className="text-sm text-black-500">{order.user?.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gold-600">Rs. {order.total.toLocaleString('en-PK')}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-gold-100 text-gold-700'
                  }`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-white p-6 shadow-sm mt-6">
        <h2 className="font-serif text-xl font-semibold mb-6">Order Status Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(stats?.statusBreakdown || {}).map(([status, count]) => (
            <div key={status} className="text-center p-4 bg-black-50 rounded-lg">
              <p className="text-2xl font-bold text-black-900 mb-1">{count}</p>
              <p className="text-sm text-black-500 capitalize">{status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
