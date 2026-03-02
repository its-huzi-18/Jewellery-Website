import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Settings,
  Menu, X, LogOut, TrendingUp, DollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { orderAPI } from '../../services/api';

const AdminLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/admin/customers', label: 'Customers', icon: Users },
    { path: '/admin/settings', label: 'Settings', icon: Settings }
  ];

  useEffect(() => {
    if (user?.role !== 'admin') {
      // Redirect non-admin users
    }
  }, [user]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await orderAPI.getStats();
        setStats(data.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const getTotalOrders = () => {
    if (!stats) return 0;
    return stats.totalOrders || 0;
  };

  return (
    <div className="min-h-screen bg-black-100">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black-900/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-black-900 text-white z-50 transform transition-transform duration-300 lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          <Link to="/" className="inline-block">
            <h1 className="font-serif text-xl font-bold">
              BLACK <span className="text-gold-500">&</span> GOLD
            </h1>
          </Link>
          <p className="text-xs text-black-400 mt-1">Admin Panel</p>
        </div>

        <nav className="mt-6">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const showOrderCount = item.label === 'Orders' && stats;
            const orderCount = showOrderCount ? getTotalOrders() : 0;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center justify-between gap-3 px-6 py-3 transition-colors ${
                  isActive
                    ? 'bg-gold-600 text-white'
                    : 'text-black-300 hover:bg-black-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {showOrderCount && orderCount > 0 && (
                  <span className="bg-gold-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {orderCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <button
            onClick={logout}
            className="flex items-center gap-3 text-black-300 hover:text-white transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4 ml-auto">
              <div className="text-right">
                <p className="font-medium text-black-900">{user?.name}</p>
                <p className="text-sm text-black-500">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {stats && location.pathname === '/admin/dashboard' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <span className="text-black-500 text-sm">Total Revenue</span>
                </div>
                <p className="text-2xl font-bold text-black-900">
                  Rs. {(stats.revenue?.totalRevenue || 0).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <span className="text-black-500 text-sm">Total Orders</span>
                </div>
                <p className="text-2xl font-bold text-black-900">
                  {stats.totalOrders || 0}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="text-black-500 text-sm">Avg Order Value</span>
                </div>
                <p className="text-2xl font-bold text-black-900">
                  Rs. {(stats.revenue?.totalOrders
                    ? (stats.revenue.totalRevenue / stats.revenue.totalOrders)
                    : 0).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                  <span className="text-black-500 text-sm">Pending Orders</span>
                </div>
                <p className="text-2xl font-bold text-black-900">
                  {stats.statusBreakdown?.pending || 0}
                </p>
              </div>
            </div>
          )}

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
