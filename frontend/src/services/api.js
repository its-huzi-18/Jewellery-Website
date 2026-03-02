import axios from 'axios';

// Use env variable if available, otherwise use production backend URL
const API_URL = import.meta.env.VITE_API_URL || 'https://jewellery-website-backend-eta.vercel.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data)
};

// Product APIs
export const productAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  getFeatured: () => api.get('/products/featured'),
  getTopSelling: () => api.get('/products/top-selling'),
  getByCategory: (category) => api.get(`/products/category/${category}`),
  createProduct: (data) => api.post('/products', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateProduct: (id, data) => api.put(`/products/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteProduct: (id) => api.delete(`/products/${id}`)
};

// Cart APIs
export const cartAPI = {
  getCart: () => api.get('/cart'),
  getCartCount: () => api.get('/cart/count'),
  addToCart: (data) => api.post('/cart/add', data),
  updateItem: (itemId, data) => api.put(`/cart/update/${itemId}`, data),
  removeFromCart: (itemId) => api.delete(`/cart/remove/${itemId}`),
  clearCart: () => api.delete('/cart/clear')
};

// Order APIs
export const orderAPI = {
  createOrder: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getOrder: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
  getAllOrders: (params) => api.get('/orders', { params }),
  updateOrderStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  getStats: () => api.get('/orders/stats')
};

// Settings APIs
export const settingAPI = {
  getSettings: () => api.get('/settings'),
  updateSettings: (data) => api.put('/settings', data),
  getAdminProfile: () => api.get('/settings/admin-profile'),
  updateAdminProfile: (data) => api.put('/settings/admin-profile', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateSocialMedia: (data) => api.put('/settings/social-media', data),
  updateContact: (data) => api.put('/settings/contact', data),
  updateBusiness: (data) => api.put('/settings/business', data),
  toggleMaintenance: (data) => api.put('/settings/maintenance-mode', data)
};

export default api;
