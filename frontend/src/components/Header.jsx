import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X, Heart, LogOut, LayoutDashboard, ChevronDown, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const categories = [
    { name: 'Rings', path: '/products?category=rings', icon: '💍' },
    { name: 'Bracelets', path: '/products?category=bracelets', icon: '📿' },
    { name: 'Necklaces', path: '/products?category=necklaces', icon: '📿' },
    { name: 'Earrings', path: '/products?category=earrings', icon: '✨' },
    { name: 'Charms', path: '/products?category=charms', icon: '🎁' },
    { name: 'Gifts', path: '/products?category=gifts', icon: '🎁' }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-gradient-to-r from-amber-200 via-amber-100 to-yellow-100 backdrop-blur-xl shadow-2xl border-b-2 border-amber-400' 
        : 'bg-gradient-to-r from-amber-200 via-amber-100 to-yellow-100'
    }`}>
      
      {/* Top Bar - Elegant Black with Gold */}
      <div className="bg-gradient-to-r from-black-900 via-black-800 to-black-900 text-white text-xs py-2 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        <p className="flex items-center justify-center gap-2 relative z-10 tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span className="font-light">Free shipping on orders over <span className="font-semibold text-gold-300">Rs. 15,000</span></span>
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
        </p>
      </div>

      {/* Main Header */}
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo - Enhanced */}
          <Link to="/" className="flex-shrink-0 group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <div>
                <h1 className="font-serif text-xl md:text-2xl font-bold text-black-900 tracking-tight">
                  BLACK <span className="text-gold-600">&</span> GOLD
                </h1>
                <p className="text-xs text-black-500 tracking-widest uppercase -mt-1">Jewellery</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation - Professional Layout */}
          <nav className="hidden lg:flex items-center gap-1">
            {categories.map((category) => (
              <div
                key={category.name}
                className="relative group"
                onMouseEnter={() => setHoveredCategory(category.name)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <Link
                  to={category.path}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg relative ${
                    hoveredCategory === category.name
                      ? 'text-gold-700 bg-gold-100'
                      : 'text-black-700 hover:text-gold-700'
                  }`}
                >
                  {category.name}
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gold-600 transition-all duration-300 ${
                    hoveredCategory === category.name ? 'w-full' : ''
                  }`} />
                </Link>
              </div>
            ))}
          </nav>

          {/* Right Side Actions - Enhanced */}
          <div className="flex items-center gap-3">
            
            {/* Search Bar - Sleek Design */}
            <form onSubmit={handleSearch} className="hidden md:block relative group">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-64 px-4 py-2.5 pl-11 bg-white/70 border border-gold-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500/60 transition-all duration-300 group-hover:bg-white group-hover:shadow-lg placeholder-black-400"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gold-600" />
            </form>

            {/* Actions Icons */}
            <div className="flex items-center gap-1">
              {/* Wishlist */}
              <button className="relative p-3 text-black-700 hover:text-gold-700 hover:bg-gold-100/70 rounded-full transition-all duration-300 group">
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>

              {/* Cart with Badge */}
              <Link to="/cart" className="relative p-3 text-black-700 hover:text-gold-700 hover:bg-gold-100/70 rounded-full transition-all duration-300 group">
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-gradient-to-br from-gold-500 to-gold-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-lg font-bold ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Menu - Premium Design */}
              {isAuthenticated && user ? (
                <div className="relative group ml-2">
                  <button className="flex items-center gap-2 p-1.5 pr-3 bg-white/80 hover:bg-gold-100/70 rounded-full transition-all duration-300 border border-gold-200 hover:border-gold-400 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 flex items-center justify-center shadow-md ring-2 ring-white">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <ChevronDown className="w-4 h-4 text-black-700 group-hover:text-gold-700 transition-colors" />
                  </button>

                  {/* Premium Dropdown */}
                  <div className="absolute right-0 mt-2 w-72 bg-white shadow-2xl rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden border-2 border-gold-200">
                    {/* User Header */}
                    <div className="bg-gradient-to-br from-gold-500 to-gold-600 px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">{user?.name}</p>
                          <p className="text-white/80 text-xs">{user?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      {isAdmin && (
                        <Link to="/admin/dashboard" className="flex items-center gap-3 px-6 py-3 text-sm text-black-700 hover:bg-gold-50 hover:text-gold-700 transition-colors">
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                      <Link to="/account/orders" className="flex items-center gap-3 px-6 py-3 text-sm text-black-700 hover:bg-gold-50 hover:text-gold-700 transition-colors">
                        <ShoppingBag className="w-4 h-4" />
                        <span>My Orders</span>
                      </Link>
                      <Link to="/account/profile" className="flex items-center gap-3 px-6 py-3 text-sm text-black-700 hover:bg-gold-50 hover:text-gold-700 transition-colors">
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <hr className="my-2 border-gold-200" />
                      <button onClick={logout} className="w-full flex items-center gap-3 px-6 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="px-5 py-2.5 bg-gradient-to-br from-gold-500 to-gold-600 text-white text-sm font-medium rounded-full hover:from-gold-600 hover:to-gold-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                  Login
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 text-black-700 hover:bg-gold-100/70 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Premium Design */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-gradient-to-b from-amber-200 via-amber-100 to-yellow-100 border-t-2 border-amber-400 animate-slide-down shadow-2xl">
          <div className="container-custom py-6">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-6 relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-white/80 border-2 border-gold-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-400 transition-all duration-300"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold-600" />
            </form>

            {/* Mobile Nav Links */}
            <nav className="space-y-1 mb-6">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={category.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 text-black-700 hover:bg-gold-100 hover:text-gold-700 rounded-xl transition-all duration-300 font-medium border border-transparent hover:border-gold-200"
                >
                  <span className="text-lg">{category.icon}</span>
                  <span>{category.name}</span>
                </Link>
              ))}
            </nav>

            {/* Mobile User Section */}
            <div className="pt-4 border-t-2 border-gold-200">
              {isAuthenticated ? (
                <>
                  {/* User Info Card */}
                  <div className="flex items-center gap-3 px-4 py-4 mb-4 bg-gradient-to-br from-gold-100 to-amber-100/60 rounded-xl border-2 border-gold-300 shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg flex-shrink-0">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-black-900 truncate">{user?.name}</p>
                      <p className="text-xs text-black-600 truncate">{user?.email}</p>
                    </div>
                  </div>

                  {/* Mobile Menu Links */}
                  <div className="space-y-1">
                    <Link
                      to="/account/orders"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-black-700 hover:bg-gold-100 hover:text-gold-700 rounded-xl transition-all duration-300 font-medium border border-transparent hover:border-gold-200"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      <span>My Orders</span>
                    </Link>
                    <Link
                      to="/account/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-black-700 hover:bg-gold-100 hover:text-gold-700 rounded-xl transition-all duration-300 font-medium border border-transparent hover:border-gold-200"
                    >
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gold-700 bg-gold-100 rounded-xl transition-all duration-300 font-medium border border-gold-200"
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 font-medium border border-transparent hover:border-red-200"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-gradient-to-br from-gold-500 to-gold-600 text-white font-medium rounded-xl hover:from-gold-600 hover:to-gold-700 transition-all duration-300 shadow-lg"
                >
                  <User className="w-5 h-5" />
                  <span>Login / Register</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
