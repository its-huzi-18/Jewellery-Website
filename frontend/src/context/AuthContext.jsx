import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      if (storedUser && storedToken) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        } catch (error) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await authAPI.login({ email, password });
      const { user: userData, token: authToken } = data.data;

      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setToken(authToken);

      toast.success(`Welcome back, ${userData.name}!`);
      return userData;
    } catch (error) {
      // Return error data instead of throwing
      // This prevents unhandled promise rejections
      const message = error.response?.data?.message || 'Login failed';
      const errorObj = new Error(message);
      errorObj.response = error.response;
      throw errorObj;
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await authAPI.register(userData);
      const { user: newUser, token: authToken } = data.data;

      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(newUser));

      setUser(newUser);
      setToken(authToken);

      toast.success('Account created successfully!');
      return newUser;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    toast.success('Logged out successfully');
    navigate('/'); // Redirect to homepage
  };

  const updateUser = async (userData) => {
    try {
      const { data } = await authAPI.updateProfile(userData);
      const updatedUser = data.data.user;

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      toast.success('Profile updated successfully');
      return updatedUser;
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      toast.error(message);
      throw error;
    }
  };

  // Add function to refresh user data
  const refreshUser = async () => {
    try {
      const { data } = await authAPI.getMe();
      const updatedUser = data.data.user;
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return updatedUser;
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateUser,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
