import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { cartService } from '../services/api';
import toast from 'react-hot-toast';

// Initial state
const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  loading: false,
  error: null,
};

// Action types
const CART_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_CART: 'SET_CART',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_CART: 'CLEAR_CART',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Helper function to calculate totals
const calculateTotals = (items) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const price = item.discount_price || item.price;
    return sum + (price * item.quantity);
  }, 0);
  
  return { totalItems, totalPrice };
};

// Reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case CART_ACTIONS.SET_CART:
      const { totalItems, totalPrice } = calculateTotals(action.payload);
      return {
        ...state,
        items: action.payload,
        totalItems,
        totalPrice,
        loading: false,
        error: null,
      };

    case CART_ACTIONS.ADD_ITEM:
      const existingItemIndex = state.items.findIndex(
        item => item.product_id === action.payload.product_id
      );

      let newItems;
      if (existingItemIndex >= 0) {
        // Update existing item
        newItems = [...state.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + action.payload.quantity,
        };
      } else {
        // Add new item
        newItems = [...state.items, action.payload];
      }

      const newTotals = calculateTotals(newItems);
      return {
        ...state,
        items: newItems,
        totalItems: newTotals.totalItems,
        totalPrice: newTotals.totalPrice,
        error: null,
      };

    case CART_ACTIONS.UPDATE_ITEM:
      const updatedItems = state.items.map(item =>
        item.product_id === action.payload.product_id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );

      const updatedTotals = calculateTotals(updatedItems);
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedTotals.totalItems,
        totalPrice: updatedTotals.totalPrice,
      };

    case CART_ACTIONS.REMOVE_ITEM:
      const filteredItems = state.items.filter(
        item => item.product_id !== action.payload
      );

      const filteredTotals = calculateTotals(filteredItems);
      return {
        ...state,
        items: filteredItems,
        totalItems: filteredTotals.totalItems,
        totalPrice: filteredTotals.totalPrice,
      };

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      };

    case CART_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case CART_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Create context
const CartContext = createContext();

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated, user } = useAuth();

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      // Clear cart when user logs out
      dispatch({ type: CART_ACTIONS.CLEAR_CART });
    }
  }, [isAuthenticated, user]);

  // Load cart from server
  const loadCart = async () => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      const response = await cartService.getCart();
      
      dispatch({
        type: CART_ACTIONS.SET_CART,
        payload: response.data.data.items || [],
      });
    } catch (error) {
      console.error('Load cart error:', error);
      dispatch({
        type: CART_ACTIONS.SET_ERROR,
        payload: error.response?.data?.message || 'Không thể tải giỏ hàng',
      });
    }
  };

  // Add item to cart
  const addItem = async (product, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng');
      return { success: false, error: 'Not authenticated' };
    }

    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

      // Check stock
      if (product.stock_quantity < quantity) {
        toast.error(`Chỉ còn ${product.stock_quantity} sản phẩm trong kho`);
        return { success: false, error: 'Insufficient stock' };
      }

      await cartService.addToCart(product.id, quantity);

      // Add to local state
      const cartItem = {
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        discount_price: product.discount_price,
        image: product.images?.[0]?.image_url || product.primary_image,
        quantity: quantity,
        stock_quantity: product.stock_quantity,
      };

      dispatch({
        type: CART_ACTIONS.ADD_ITEM,
        payload: cartItem,
      });

      toast.success('Đã thêm vào giỏ hàng');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Không thể thêm vào giỏ hàng';
      toast.error(errorMessage);
      
      dispatch({
        type: CART_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Update item quantity
  const updateItem = async (productId, quantity) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập');
      return { success: false };
    }

    if (quantity <= 0) {
      return removeItem(productId);
    }

    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

      await cartService.updateCartItem(productId, quantity);

      dispatch({
        type: CART_ACTIONS.UPDATE_ITEM,
        payload: { product_id: productId, quantity },
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Không thể cập nhật giỏ hàng';
      toast.error(errorMessage);
      
      dispatch({
        type: CART_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Remove item from cart
  const removeItem = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập');
      return { success: false };
    }

    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

      await cartService.removeFromCart(productId);

      dispatch({
        type: CART_ACTIONS.REMOVE_ITEM,
        payload: productId,
      });

      toast.success('Đã xóa khỏi giỏ hàng');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Không thể xóa khỏi giỏ hàng';
      toast.error(errorMessage);
      
      dispatch({
        type: CART_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!isAuthenticated) {
      return { success: false };
    }

    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

      await cartService.clearCart();

      dispatch({ type: CART_ACTIONS.CLEAR_CART });

      toast.success('Đã xóa toàn bộ giỏ hàng');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Không thể xóa giỏ hàng';
      toast.error(errorMessage);
      
      dispatch({
        type: CART_ACTIONS.SET_ERROR,
        payload: errorMessage,
      });
      
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Get item by product ID
  const getItem = (productId) => {
    return state.items.find(item => item.product_id === productId);
  };

  // Check if product is in cart
  const isInCart = (productId) => {
    return state.items.some(item => item.product_id === productId);
  };

  // Get item quantity
  const getItemQuantity = (productId) => {
    const item = getItem(productId);
    return item ? item.quantity : 0;
  };

  // Calculate shipping fee (free shipping over 500k)
  const getShippingFee = () => {
    return state.totalPrice >= 500000 ? 0 : 30000;
  };

  // Calculate final total including shipping
  const getFinalTotal = () => {
    return state.totalPrice + getShippingFee();
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    // State
    ...state,
    
    // Actions
    loadCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    clearError,
    
    // Helpers
    getItem,
    isInCart,
    getItemQuantity,
    getShippingFee,
    getFinalTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};