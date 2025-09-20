import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { productService, categoryService } from '../services/api';

// Initial state
const initialState = {
  // Products
  products: [],
  featuredProducts: [],
  currentProduct: null,
  
  // Categories
  categories: [],
  
  // Filters & Search
  filters: {
    category: '',
    priceRange: [0, 5000000],
    ageGroup: '',
    brand: '',
    search: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
  },
  
  // Pagination
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  },
  
  // Loading states
  loading: {
    products: false,
    featured: false,
    categories: false,
    currentProduct: false,
  },
  
  // Errors
  error: null,
};

// Action types
const PRODUCT_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_FEATURED_PRODUCTS: 'SET_FEATURED_PRODUCTS',
  SET_CURRENT_PRODUCT: 'SET_CURRENT_PRODUCT',
  SET_CATEGORIES: 'SET_CATEGORIES',
  SET_FILTERS: 'SET_FILTERS',
  RESET_FILTERS: 'RESET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  APPEND_PRODUCTS: 'APPEND_PRODUCTS',
};

// Reducer function
const productReducer = (state, action) => {
  switch (action.type) {
    case PRODUCT_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value,
        },
      };

    case PRODUCT_ACTIONS.SET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
        loading: {
          ...state.loading,
          products: false,
        },
        error: null,
      };

    case PRODUCT_ACTIONS.APPEND_PRODUCTS:
      return {
        ...state,
        products: [...state.products, ...action.payload],
        loading: {
          ...state.loading,
          products: false,
        },
      };

    case PRODUCT_ACTIONS.SET_FEATURED_PRODUCTS:
      return {
        ...state,
        featuredProducts: action.payload,
        loading: {
          ...state.loading,
          featured: false,
        },
      };

    case PRODUCT_ACTIONS.SET_CURRENT_PRODUCT:
      return {
        ...state,
        currentProduct: action.payload,
        loading: {
          ...state.loading,
          currentProduct: false,
        },
        error: null,
      };

    case PRODUCT_ACTIONS.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
        loading: {
          ...state.loading,
          categories: false,
        },
      };

    case PRODUCT_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };

    case PRODUCT_ACTIONS.RESET_FILTERS:
      return {
        ...state,
        filters: {
          ...initialState.filters,
          search: state.filters.search, // Keep search term
        },
      };

    case PRODUCT_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...action.payload,
        },
      };

    case PRODUCT_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: {
          products: false,
          featured: false,
          categories: false,
          currentProduct: false,
        },
      };

    case PRODUCT_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Create context
const ProductContext = createContext();

// Custom hook to use product context
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

// Product Provider Component
export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
    loadFeaturedProducts();
  }, []);

  // Load products when filters change
  useEffect(() => {
    loadProducts();
  }, [state.filters, state.pagination.currentPage]);

  // Load categories
  const loadCategories = async () => {
    try {
      dispatch({
        type: PRODUCT_ACTIONS.SET_LOADING,
        payload: { key: 'categories', value: true },
      });

      const response = await categoryService.getCategories();
      
      dispatch({
        type: PRODUCT_ACTIONS.SET_CATEGORIES,
        payload: response.data.data,
      });
    } catch (error) {
      console.error('Load categories error:', error);
      dispatch({
        type: PRODUCT_ACTIONS.SET_ERROR,
        payload: error.response?.data?.message || 'Không thể tải danh mục',
      });
    }
  };

  // Load products
  const loadProducts = async (append = false) => {
    try {
      dispatch({
        type: PRODUCT_ACTIONS.SET_LOADING,
        payload: { key: 'products', value: true },
      });

      const params = {
        page: state.pagination.currentPage,
        limit: state.pagination.itemsPerPage,
        ...state.filters,
        category_id: state.filters.category,
        min_price: state.filters.priceRange[0],
        max_price: state.filters.priceRange[1],
        age_group: state.filters.ageGroup,
        brand: state.filters.brand,
        search: state.filters.search,
        sort: state.filters.sortBy,
        order: state.filters.sortOrder,
      };

      // Remove empty parameters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await productService.getProducts(params);
      const { products, pagination } = response.data.data;

      if (append) {
        dispatch({
          type: PRODUCT_ACTIONS.APPEND_PRODUCTS,
          payload: products,
        });
      } else {
        dispatch({
          type: PRODUCT_ACTIONS.SET_PRODUCTS,
          payload: products,
        });
      }

      dispatch({
        type: PRODUCT_ACTIONS.SET_PAGINATION,
        payload: {
          currentPage: pagination.current_page,
          totalPages: pagination.total_pages,
          totalItems: pagination.total,
          itemsPerPage: pagination.per_page,
        },
      });
    } catch (error) {
      console.error('Load products error:', error);
      dispatch({
        type: PRODUCT_ACTIONS.SET_ERROR,
        payload: error.response?.data?.message || 'Không thể tải sản phẩm',
      });
    }
  };

  // Load featured products
  const loadFeaturedProducts = async () => {
    try {
      dispatch({
        type: PRODUCT_ACTIONS.SET_LOADING,
        payload: { key: 'featured', value: true },
      });

      const response = await productService.getProducts({
        featured: true,
        limit: 8,
      });

      dispatch({
        type: PRODUCT_ACTIONS.SET_FEATURED_PRODUCTS,
        payload: response.data.data.products,
      });
    } catch (error) {
      console.error('Load featured products error:', error);
    }
  };

  // Load single product
  const loadProduct = async (productId) => {
    try {
      dispatch({
        type: PRODUCT_ACTIONS.SET_LOADING,
        payload: { key: 'currentProduct', value: true },
      });

      const response = await productService.getProduct(productId);
      
      dispatch({
        type: PRODUCT_ACTIONS.SET_CURRENT_PRODUCT,
        payload: response.data.data,
      });
    } catch (error) {
      console.error('Load product error:', error);
      dispatch({
        type: PRODUCT_ACTIONS.SET_ERROR,
        payload: error.response?.data?.message || 'Không thể tải sản phẩm',
      });
    }
  };

  // Search products
  const searchProducts = async (searchTerm) => {
    dispatch({
      type: PRODUCT_ACTIONS.SET_FILTERS,
      payload: { search: searchTerm },
    });
    
    dispatch({
      type: PRODUCT_ACTIONS.SET_PAGINATION,
      payload: { currentPage: 1 },
    });
  };

  // Set filters
  const setFilters = (newFilters) => {
    dispatch({
      type: PRODUCT_ACTIONS.SET_FILTERS,
      payload: newFilters,
    });
    
    // Reset to first page when filters change
    dispatch({
      type: PRODUCT_ACTIONS.SET_PAGINATION,
      payload: { currentPage: 1 },
    });
  };

  // Reset filters
  const resetFilters = () => {
    dispatch({ type: PRODUCT_ACTIONS.RESET_FILTERS });
    dispatch({
      type: PRODUCT_ACTIONS.SET_PAGINATION,
      payload: { currentPage: 1 },
    });
  };

  // Set current page
  const setCurrentPage = (page) => {
    dispatch({
      type: PRODUCT_ACTIONS.SET_PAGINATION,
      payload: { currentPage: page },
    });
  };

  // Load more products (infinite scroll)
  const loadMoreProducts = async () => {
    if (state.pagination.currentPage < state.pagination.totalPages) {
      const nextPage = state.pagination.currentPage + 1;
      dispatch({
        type: PRODUCT_ACTIONS.SET_PAGINATION,
        payload: { currentPage: nextPage },
      });
      await loadProducts(true); // append = true
    }
  };

  // Get products by category
  const getProductsByCategory = (categoryId) => {
    return state.products.filter(product => 
      product.category_id === categoryId
    );
  };

  // Get category by ID
  const getCategoryById = (categoryId) => {
    return state.categories.find(category => 
      category.id === categoryId
    );
  };

  // Get available brands
  const getAvailableBrands = () => {
    const brands = [...new Set(state.products
      .map(product => product.brand)
      .filter(brand => brand && brand.trim() !== ''))];
    return brands.sort();
  };

  // Get available age groups
  const getAvailableAgeGroups = () => {
    const ageGroups = [...new Set(state.products
      .map(product => product.age_group)
      .filter(ageGroup => ageGroup && ageGroup.trim() !== ''))];
    return ageGroups.sort();
  };

  // Get price range of current products
  const getPriceRange = () => {
    if (state.products.length === 0) {
      return { min: 0, max: 5000000 };
    }

    const prices = state.products.map(product => 
      product.discount_price || product.price
    );

    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  };

  // Check if there are active filters
  const hasActiveFilters = () => {
    return (
      state.filters.category !== '' ||
      state.filters.ageGroup !== '' ||
      state.filters.brand !== '' ||
      state.filters.search !== '' ||
      state.filters.priceRange[0] !== 0 ||
      state.filters.priceRange[1] !== 5000000
    );
  };

  // Get filter summary text
  const getFilterSummary = () => {
    const filters = [];
    
    if (state.filters.category) {
      const category = getCategoryById(parseInt(state.filters.category));
      if (category) {
        filters.push(`Danh mục: ${category.name}`);
      }
    }
    
    if (state.filters.ageGroup) {
      filters.push(`Độ tuổi: ${state.filters.ageGroup}`);
    }
    
    if (state.filters.brand) {
      filters.push(`Thương hiệu: ${state.filters.brand}`);
    }
    
    if (state.filters.search) {
      filters.push(`Tìm kiếm: "${state.filters.search}"`);
    }
    
    if (state.filters.priceRange[0] > 0 || state.filters.priceRange[1] < 5000000) {
      filters.push(
        `Giá: ${state.filters.priceRange[0].toLocaleString('vi-VN')}đ - ${state.filters.priceRange[1].toLocaleString('vi-VN')}đ`
      );
    }
    
    return filters.join(', ');
  };

  // Clear current product
  const clearCurrentProduct = () => {
    dispatch({
      type: PRODUCT_ACTIONS.SET_CURRENT_PRODUCT,
      payload: null,
    });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: PRODUCT_ACTIONS.CLEAR_ERROR });
  };

  // Get related products (same category, different product)
  const getRelatedProducts = (productId, categoryId, limit = 4) => {
    return state.products
      .filter(product => 
        product.id !== productId && 
        product.category_id === categoryId
      )
      .slice(0, limit);
  };

  const value = {
    // State
    ...state,
    
    // Actions
    loadProducts,
    loadFeaturedProducts,
    loadProduct,
    loadCategories,
    searchProducts,
    setFilters,
    resetFilters,
    setCurrentPage,
    loadMoreProducts,
    clearCurrentProduct,
    clearError,
    
    // Helpers
    getProductsByCategory,
    getCategoryById,
    getAvailableBrands,
    getAvailableAgeGroups,
    getPriceRange,
    hasActiveFilters,
    getFilterSummary,
    getRelatedProducts,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};