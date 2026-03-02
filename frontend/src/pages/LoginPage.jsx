import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: currentUser } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    // Clear server error when user modifies any field
    if (serverError) {
      setServerError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setServerError('');

    try {
      const response = await authAPI.login(formData);
      const data = response.data;

      if (data.success) {
        // Success - save to localStorage
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));

        // Force reload to update AuthContext
        window.location.href = data.data.user.role === 'admin' ? '/admin/dashboard' : (from || '/');
      } else {
        // Error - show message
        const message = data.message || 'Login failed';

        if (message.includes('not found') || message.includes('not signed up')) {
          setServerError('You are not signed up. Please create an account first.');
        } else if (message.includes('Invalid credentials')) {
          setErrors({
            email: 'Incorrect email or password',
            password: 'Incorrect email or password'
          });
        } else {
          setServerError(message);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network')) {
        setServerError('Cannot connect to server. Please try again later.');
      } else if (error.response?.data?.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 min-h-screen bg-gradient-to-br from-black-50 via-white to-gold-50">
      <div className="container-custom">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <Link to="/" className="inline-block mb-8">
            <h1 className="font-serif text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-black-900 to-gold-700">
              BLACK <span className="text-gold-600">&</span> GOLD
            </h1>
          </Link>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 mb-4 shadow-lg">
              <LogIn className="w-10 h-10 text-white" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-black-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-black-500">
              Sign in to your account to continue shopping
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl border border-black-100">
            <form onSubmit={handleSubmit} onReset={(e) => e.preventDefault()} noValidate className="space-y-6">
              {/* Server Error Message */}
              {serverError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                    </svg>
                    {serverError}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-black-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input-field ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input-field ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-gold-600 rounded" />
                  <span className="ml-2 text-sm text-black-600">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-gold-600 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-black-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-gold-600 font-medium hover:underline">
                  Sign up
                </Link>
              </p>
            </div>

            {/* Demo credentials */}
            <div className="mt-8 p-4 bg-black-50 rounded text-sm">
              <p className="font-medium text-black-900 mb-2">Demo Credentials:</p>
              <p className="text-black-600">
                <span className="font-mono">admin@blackgold.com</span> / <span className="font-mono">admin123</span>
              </p>
              <p className="text-black-600">
                <span className="font-mono">user@blackgold.com</span> / <span className="font-mono">user123</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
