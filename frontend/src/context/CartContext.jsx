import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const fetchCart = async () => {
    try {
      const { data } = await cartAPI.getCart();
      setCart(data.data.cart);
      setCartCount(data.data.cart.totalItems);
    } catch (error) {
      console.error('Fetch cart error:', error);
    }
  };

  const fetchCartCount = async () => {
    try {
      const { data } = await cartAPI.getCartCount();
      setCartCount(data.data.count);
    } catch (error) {
      console.error('Fetch cart count error:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCart();
    }
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      const { data } = await cartAPI.addToCart({ productId, quantity });
      setCart(data.data.cart);
      setCartCount(data.data.cart.totalItems);
      toast.success('Added to cart!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to cart';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const { data } = await cartAPI.updateItem(itemId, { quantity });
      setCart(data.data.cart);
      setCartCount(data.data.cart.totalItems);
      toast.success('Cart updated');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update cart';
      toast.error(message);
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const { data } = await cartAPI.removeFromCart(itemId);
      setCart(data.data.cart);
      setCartCount(data.data.cart.totalItems);
      toast.success('Item removed from cart');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove item';
      toast.error(message);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const { data } = await cartAPI.clearCart();
      setCart(data.data.cart);
      setCartCount(0);
      toast.success('Cart cleared');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear cart';
      toast.error(message);
      throw error;
    }
  };

  const value = {
    cart,
    loading,
    cartCount,
    fetchCart,
    fetchCartCount,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
