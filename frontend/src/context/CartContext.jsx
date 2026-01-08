import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCart, addToCart as addToCartApi, updateCartItem, removeFromCart as removeFromCartApi, clearCart as clearCartApi } from '../services/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], summary: { totalItems: 0, total: 0 } });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getCart();
      if (response.success) {
        setCart(response.data);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      const response = await addToCartApi(productId, quantity);
      if (response.success) {
        setCart(response.data);
        return { success: true, message: response.message };
      }
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to add item to cart';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      setLoading(true);
      const response = await updateCartItem(productId, quantity);
      if (response.success) {
        setCart(response.data);
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to update quantity';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      const response = await removeFromCartApi(productId);
      if (response.success) {
        setCart(response.data);
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to remove item';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      const response = await clearCartApi();
      if (response.success) {
        setCart(response.data);
        return { success: true };
      }
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to clear cart';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const cartItemCount = cart.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      error,
      cartItemCount,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
