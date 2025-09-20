import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      toast.error('Không thể kết nối đến server');
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // Handle authentication errors
    if (status === 401) {
      localStorage.removeItem('token');
      
      // Don't show toast for token refresh failures
      if (!error.config.url?.includes('/auth/refresh')) {
        toast.error('Phiên đăng nhập đã hết hạn');
        // Redirect to login page
        window.location.href = '/login';
      }
    }

    // Handle authorization errors
    if (status === 403) {
      toast.error('Bạn không có quyền truy cập');
    }

    // Handle not found errors
    if (status === 404) {
      toast.error('Không tìm thấy tài nguyên');
    }

    // Handle server errors
    if (status >= 500) {
      toast.error('Lỗi server, vui lòng thử lại sau');
    }

    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  // Login
  login: (credentials) => {
    return api.post('/auth/login', credentials);
  },

  // Register
  register: (userData) => {
    return api.post('/auth/register', userData);
  },

  // Get current user profile
  getProfile: () => {
    return api.get('/auth/me');
  },

  // Update profile
  updateProfile: (profileData) => {
    return api.put('/auth/profile', profileData);
  },

  // Change password
  changePassword: (passwordData) => {
    return api.put('/auth/change-password', passwordData);
  },

  // Refresh token
  refreshToken: () => {
    return api.post('/auth/refresh');
  },

  // Forgot password
  forgotPassword: (email) => {
    return api.post('/auth/forgot-password', { email });
  },

  // Reset password
  resetPassword: (token, password) => {
    return api.post('/auth/reset-password', { token, password });
  },
};

// Product Services
export const productService = {
  // Get all products with filters
  getProducts: (params = {}) => {
    return api.get('/products', { params });
  },

  // Get single product
  getProduct: (id) => {
    return api.get(`/products/${id}`);
  },

  // Search products
  searchProducts: (query, filters = {}) => {
    return api.get('/products', { 
      params: { search: query, ...filters } 
    });
  },

  // Get featured products
  getFeaturedProducts: (limit = 8) => {
    return api.get('/products', { 
      params: { featured: true, limit } 
    });
  },

  // Get products by category
  getProductsByCategory: (categoryId, params = {}) => {
    return api.get('/products', { 
      params: { category_id: categoryId, ...params } 
    });
  },
};

// Category Services
export const categoryService = {
  // Get all categories
  getCategories: () => {
    return api.get('/categories');
  },

  // Get single category
  getCategory: (id) => {
    return api.get(`/categories/${id}`);
  },
};

// Cart Services
export const cartService = {
  // Get cart items
  getCart: () => {
    return api.get('/cart');
  },

  // Add item to cart
  addToCart: (productId, quantity = 1) => {
    return api.post('/cart/add', {
      product_id: productId,
      quantity: quantity,
    });
  },

  // Update cart item quantity
  updateCartItem: (productId, quantity) => {
    return api.put(`/cart/update/${productId}`, { quantity });
  },

  // Remove item from cart
  removeFromCart: (productId) => {
    return api.delete(`/cart/remove/${productId}`);
  },

  // Clear entire cart
  clearCart: () => {
    return api.delete('/cart/clear');
  },

  // Get cart count
  getCartCount: () => {
    return api.get('/cart/count');
  },
};

// Order Services
export const orderService = {
  // Create new order
  createOrder: (orderData) => {
    return api.post('/orders', orderData);
  },

  // Get user orders
  getOrders: (params = {}) => {
    return api.get('/orders', { params });
  },

  // Get single order
  getOrder: (id) => {
    return api.get(`/orders/${id}`);
  },

  // Cancel order
  cancelOrder: (id, reason) => {
    return api.put(`/orders/${id}/cancel`, { cancel_reason: reason });
  },

  // Get order statistics
  getOrderStats: () => {
    return api.get('/orders/stats/summary');
  },
};

// Review Services
export const reviewService = {
  // Get product reviews
  getProductReviews: (productId, params = {}) => {
    return api.get(`/reviews/product/${productId}`, { params });
  },

  // Create review
  createReview: (reviewData) => {
    return api.post('/reviews', reviewData);
  },

  // Update review
  updateReview: (id, reviewData) => {
    return api.put(`/reviews/${id}`, reviewData);
  },

  // Delete review
  deleteReview: (id) => {
    return api.delete(`/reviews/${id}`);
  },
};

// Upload Services
export const uploadService = {
  // Upload single image
  uploadImage: (file, folder = 'misc') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);
    
    return api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Upload multiple images
  uploadImages: (files, folder = 'misc') => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });
    formData.append('folder', folder);
    
    return api.post('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// User Services
export const userService = {
  // Get user profile
  getProfile: () => {
    return api.get('/users/profile');
  },

  // Update user profile
  updateProfile: (profileData) => {
    return api.put('/users/profile', profileData);
  },

  // Update avatar
  updateAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return api.put('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get user addresses
  getAddresses: () => {
    return api.get('/users/addresses');
  },

  // Add user address
  addAddress: (addressData) => {
    return api.post('/users/addresses', addressData);
  },

  // Update user address
  updateAddress: (id, addressData) => {
    return api.put(`/users/addresses/${id}`, addressData);
  },

  // Delete user address
  deleteAddress: (id) => {
    return api.delete(`/users/addresses/${id}`);
  },
};

// Utility function to handle file downloads
export const downloadFile = async (url, filename) => {
  try {
    const response = await api.get(url, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    return { success: true };
  } catch (error) {
    console.error('Download error:', error);
    toast.error('Không thể tải file');
    return { success: false, error };
  }
};

// Utility function to check API health
export const checkApiHealth = async () => {
  try {
    const response = await api.get('/health');
    return {
      status: 'healthy',
      data: response.data,
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
    };
  }
};

// Generic API call wrapper with error handling
export const apiCall = async (apiFunction, ...args) => {
  try {
    const response = await apiFunction(...args);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('API call error:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      status: error.response?.status,
    };
  }
};

// Export the main api instance for custom requests
export default api;