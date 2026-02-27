import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X, Heart, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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

  const navLinks = [
    { name: 'Rings', path: '/products?category=rings' },
    { name: 'Bracelets', path: '/products?category=bracelets' },
    { name: 'Necklaces', path: '/products?category=necklaces' },
    { name: 'Earrings', path: '/products?category=earrings' },
    { name: 'Charms', path: '/products?category=charms' },
    { name: 'Gifts', path: '/products?category=gifts' }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/98 backdrop-blur-md shadow-lg' : 'bg-white'
    }`}>
      {/* Top bar - Black with Gold text */}
      <div className="bg-gradient-to-r from-black-900 via-black-800 to-black-900 text-gold-300 text-xs py-2.5 text-center border-b border-gold-600/20">
        <p className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
          </svg>
          <span>Free shipping on all orders over Rs. 15,000</span>
        </p>
      </div>

      {/* Main header */}
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 group">
            <div className="bg-gradient-to-br from-black-900 via-black-800 to-gold-700 bg-clip-text">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-transparent bg-clip-text tracking-wider group-hover:opacity-80 transition-opacity">
                BLACK <span className="text-gold-600">&</span> GOLD
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="nav-link"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search form */}
            <form onSubmit={handleSearch} className="hidden md:block relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pr-10 w-48 lg:w-64 bg-black-50"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-600 hover:text-gold-700 transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </form>

            {/* Wishlist */}
            <button className="hidden md:block p-2 text-black-600 hover:text-gold-600 transition-colors">
              <Heart className="w-6 h-6" />
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-black-600 hover:text-gold-600 transition-colors group">
              <div className="relative">
                <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-br from-gold-500 to-gold-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md font-semibold">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>

            {/* User menu */}
            {isAuthenticated && user ? (
              <div className="relative group">
                <button className="flex items-center justify-center p-1 hover:scale-105 transition-all duration-200">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 
                                  flex items-center justify-center shadow-lg hover:shadow-xl 
                                  ring-2 ring-white hover:ring-gold-300 transition-all duration-200">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  {/* Online status indicator */}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full 
                                  border-2 border-white animate-pulse"></div>
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-lg 
                                opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                                transition-all duration-200 z-50 overflow-hidden">
                  {/* User info header */}
                  <div className="bg-gradient-to-br from-gold-500 to-gold-600 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm 
                                      flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
                        <p className="text-white/80 text-xs truncate">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu items */}
                  <div className="py-2">
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-black-700 
                                   hover:bg-gold-50 hover:text-gold-600 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <Link
                      to="/account/orders"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-black-700 
                                 hover:bg-gold-50 hover:text-gold-600 transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>My Orders</span>
                    </Link>
                    <Link
                      to="/account/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-black-700 
                                 hover:bg-gold-50 hover:text-gold-600 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <hr className="my-2 border-black-100" />
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 
                                 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="p-2 hover:text-gold-600 transition-colors">
                <User className="w-6 h-6" />
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2"
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

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gold-200 animate-slide-down shadow-lg">
          <div className="container-custom py-4">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="mb-4 relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pr-10 bg-black-50"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-600">
                <Search className="w-5 h-5" />
              </button>
            </form>

            {/* Mobile nav links */}
            <nav className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-4 nav-link text-base rounded-lg hover:bg-gold-50"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t">
                {isAuthenticated ? (
                  <>
                    {/* User info in mobile menu */}
                    <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-black-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center shadow-md flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-black-900 truncate">{user?.name}</p>
                        <p className="text-xs text-black-500 truncate">{user?.email}</p>
                      </div>
                    </div>
                    
                    <Link
                      to="/account/orders"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-2 nav-link"
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/account/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-2 nav-link"
                    >
                      Profile
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-2 nav-link text-gold-600"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left py-2 nav-link text-red-600"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 nav-link"
                  >
                    Login / Register
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
