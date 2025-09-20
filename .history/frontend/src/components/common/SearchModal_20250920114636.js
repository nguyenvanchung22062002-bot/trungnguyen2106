import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiX, 
  FiTrendingUp, 
  FiClock,
  FiArrowRight,
  FiTag
} from 'react-icons/fi';

// Hooks
import { useProducts } from '../../contexts/ProductContext';
import { productService } from '../../services/api';

// Utils
import { debounce } from 'lodash';

const SearchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { categories, searchProducts } = useProducts();
  
  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState([]);
  
  // Refs
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  // Popular search terms
  const popularSearches = [
    'Set quà sơ sinh',
    'Đồ chơi giáo dục',
    'Quà sinh nhật',
    'Đồ chơi gỗ',
    'Bình sữa',
    'Quần áo bé',
    'Đồ chơi phát triển trí tuệ',
    'Set quà full month'
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  // Debounced search function
  const debouncedSearch = debounce(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await productService.searchProducts(query, { limit: 6 });
      setSearchResults(response.data.data.products || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  // Handle search input change
  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel();
  }, [searchQuery]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!searchResults.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && searchResults[selectedIndex]) {
          handleProductClick(searchResults[selectedIndex]);
        } else if (searchQuery.trim()) {
          handleSearch(searchQuery);
        }
        break;
      case 'Escape':
        onClose();
        break;
      default:
        break;
    }
  };

  // Handle search submission
  const handleSearch = (query) => {
    if (!query.trim()) return;

    // Save to recent searches
    const newRecentSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(newRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));

    // Perform search
    searchProducts(query);
    navigate(`/products?search=${encodeURIComponent(query)}`);
    onClose();
  };

  // Handle product click
  const handleProductClick = (product) => {
    navigate(`/products/${product.id}`);
    onClose();
  };

  // Handle category click
  const handleCategoryClick = (category) => {
    navigate(`/category/${category.id}`);
    onClose();
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-strong z-50 max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center p-6 border-b border-gray-100">
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Tìm kiếm sản phẩm, danh mục..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-200 focus:border-primary-500 transition-all"
                />
              </div>
              
              <button
                onClick={onClose}
                className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-96 overflow-y-auto">
              {/* Search Results */}
              {searchQuery.trim() && (
                <div className="p-6">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-2 text-gray-600">Đang tìm kiếm...</span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Kết quả tìm kiếm
                      </h3>
                      <div className="space-y-2" ref={resultsRef}>
                        {searchResults.map((product, index) => (
                          <motion.button
                            key={product.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleProductClick(product)}
                            className={`w-full p-3 rounded-lg text-left transition-colors ${
                              index === selectedIndex 
                                ? 'bg-primary-50 border border-primary-200' 
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <img
                                src={product.images?.[0]?.image_url || product.primary_image || '/images/placeholder-product.jpg'}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                              />
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                                  {product.name}
                                </h4>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="text-sm font-semibold text-primary-600">
                                    {formatPrice(product.discount_price || product.price)}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {product.category_name}
                                  </span>
                                </div>
                              </div>
                              <FiArrowRight className="w-4 h-4 text-gray-400" />
                            </div>
                          </motion.button>
                        ))}
                      </div>
                      
                      {/* View all results */}
                      <button
                        onClick={() => handleSearch(searchQuery)}
                        className="w-full mt-4 p-3 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors font-medium"
                      >
                        Xem tất cả kết quả cho "{searchQuery}"
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">🔍</div>
                      <p className="text-gray-600">Không tìm thấy sản phẩm nào</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Thử tìm kiếm với từ khóa khác
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Default Content */}
              {!searchQuery.trim() && (
                <div className="p-6 space-y-6">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                          <FiClock className="inline w-4 h-4 mr-1" />
                          Tìm kiếm gần đây
                        </h3>
                        <button
                          onClick={clearRecentSearches}
                          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          Xóa tất cả
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleSearch(search)}
                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Searches */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      <FiTrendingUp className="inline w-4 h-4 mr-1" />
                      Tìm kiếm phổ biến
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {popularSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearch(search)}
                          className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <span className="text-sm text-gray-700">{search}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Categories */}
                  {categories.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        <FiTag className="inline w-4 h-4 mr-1" />
                        Danh mục sản phẩm
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.slice(0, 6).map((category) => (
                          <button
                            key={category.id}
                            onClick={() => handleCategoryClick(category)}
                            className="p-3 text-left bg-gray-50 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors group"
                          >
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{category.icon || '📦'}</span>
                              <span className="text-sm font-medium">{category.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">↑↓</kbd>
                  <span>di chuyển</span>
                </div>
                <div className="flex items-center space-x-1">
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">↵</kbd>
                  <span>chọn</span>
                </div>
                <div className="flex items-center space-x-1">
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">esc</kbd>
                  <span>đóng</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;