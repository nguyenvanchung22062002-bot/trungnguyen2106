import React, { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  FiGrid,
  FiList,
  FiFilter,
  FiX,
  FiChevronDown,
  FiSearch,
  FiSliders
} from 'react-icons/fi';

// Components
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ProductCard from '../components/products/ProductCard';
import ProductFilter from '../components/products/ProductFilter';
import ProductSort from '../components/products/ProductSort';
import Loading, { ProductCardSkeleton } from '../components/common/Loading';

// Hooks
import { useProducts } from '../contexts/ProductContext';

// Utils
import classNames from 'classnames';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categoryId } = useParams();
  
  const {
    products,
    categories,
    loading,
    pagination,
    filters,
    hasActiveFilters,
    getFilterSummary,
    getCategoryById,
    setFilters,
    resetFilters,
    setCurrentPage
  } = useProducts();

  // Local state
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileSort, setShowMobileSort] = useState(false);

  // Initialize filters from URL params
  useEffect(() => {
    const urlFilters = {};
    
    // Get filters from URL
    if (searchParams.get('search')) urlFilters.search = searchParams.get('search');
    if (searchParams.get('category_id')) urlFilters.category = searchParams.get('category_id');
    if (searchParams.get('age_group')) urlFilters.ageGroup = searchParams.get('age_group');
    if (searchParams.get('brand')) urlFilters.brand = searchParams.get('brand');
    if (searchParams.get('min_price')) urlFilters.priceRange = [parseInt(searchParams.get('min_price')), filters.priceRange[1]];
    if (searchParams.get('max_price')) urlFilters.priceRange = [filters.priceRange[0], parseInt(searchParams.get('max_price'))];
    if (searchParams.get('sort')) urlFilters.sortBy = searchParams.get('sort');
    if (searchParams.get('order')) urlFilters.sortOrder = searchParams.get('order');
    
    // Set category filter from URL param
    if (categoryId) {
      urlFilters.category = categoryId;
    }

    if (Object.keys(urlFilters).length > 0) {
      setFilters(urlFilters);
    }
  }, [searchParams, categoryId]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.search) params.set('search', filters.search);
    if (filters.category) params.set('category_id', filters.category);
    if (filters.ageGroup) params.set('age_group', filters.ageGroup);
    if (filters.brand) params.set('brand', filters.brand);
    if (filters.priceRange[0] > 0) params.set('min_price', filters.priceRange[0]);
    if (filters.priceRange[1] < 5000000) params.set('max_price', filters.priceRange[1]);
    if (filters.sortBy !== 'created_at') params.set('sort', filters.sortBy);
    if (filters.sortOrder !== 'desc') params.set('order', filters.sortOrder);

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Get page title and meta
  const getPageTitle = () => {
    if (filters.search) {
      return `Tìm kiếm "${filters.search}" - Newborn Gifts`;
    }
    
    if (categoryId) {
      const category = getCategoryById(parseInt(categoryId));
      return category ? `${category.name} - Newborn Gifts` : 'Sản phẩm - Newborn Gifts';
    }
    
    return 'Sản phẩm - Newborn Gifts Vietnam';
  };

  const getPageDescription = () => {
    if (filters.search) {
      return `Kết quả tìm kiếm cho "${filters.search}". Khám phá các sản phẩm chất lượng cao dành cho bé.`;
    }
    
    if (categoryId) {
      const category = getCategoryById(parseInt(categoryId));
      return category ? `${category.description || category.name} - Sản phẩm chất lượng cao cho bé yêu.` : 'Khám phá các sản phẩm chất lượng cao dành cho bé.';
    }
    
    return 'Khám phá bộ sưu tập sản phẩm đa dạng dành cho trẻ em từ sơ sinh đến 5 tuổi. Chất lượng cao, an toàn, giá tốt.';
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle filter change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Clear all filters
  const handleClearFilters = () => {
    resetFilters();
    setCurrentPage(1);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta name="description" content={getPageDescription()} />
        <meta name="keywords" content="sản phẩm trẻ em, đồ chơi, quần áo bé, set quà sơ sinh" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Header />
        
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="container-custom py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <a href="/" className="text-gray-500 hover:text-primary-600">Trang chủ</a>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900">Sản phẩm</span>
              {categoryId && (
                <>
                  <span className="text-gray-300">/</span>
                  <span className="text-primary-600">{getCategoryById(parseInt(categoryId))?.name}</span>
                </>
              )}
            </nav>
          </div>
        </div>

        <div className="container-custom py-8">
          <div className="flex gap-8">
            {/* Sidebar Filters - Desktop */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24">
                <ProductFilter 
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {categoryId ? getCategoryById(parseInt(categoryId))?.name : 'Tất cả sản phẩm'}
                  </h1>
                  
                  {/* Results count and filters summary */}
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                    <span>{pagination.totalItems} sản phẩm</span>
                    {hasActiveFilters() && (
                      <>
                        <span>•</span>
                        <span className="text-primary-600">{getFilterSummary()}</span>
                        <button
                          onClick={handleClearFilters}
                          className="text-primary-600 hover:text-primary-700 underline"
                        >
                          Xóa bộ lọc
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* View and Sort Controls */}
                <div className="flex items-center space-x-4">
                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden btn-secondary flex items-center gap-2"
                  >
                    <FiFilter className="w-4 h-4" />
                    Lọc
                  </button>

                  {/* View Mode Toggle */}
                  <div className="hidden sm:flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={classNames(
                        'p-2 rounded-md transition-colors',
                        viewMode === 'grid'
                          ? 'bg-white text-primary-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      )}
                    >
                      <FiGrid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={classNames(
                        'p-2 rounded-md transition-colors',
                        viewMode === 'list'
                          ? 'bg-white text-primary-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      )}
                    >
                      <FiList className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Sort */}
                  <div className="hidden sm:block">
                    <ProductSort />
                  </div>

                  {/* Mobile Sort Button */}
                  <button
                    onClick={() => setShowMobileSort(true)}
                    className="sm:hidden btn-secondary flex items-center gap-2"
                  >
                    <FiSliders className="w-4 h-4" />
                    Sắp xếp
                  </button>
                </div>
              </div>

              {/* Products Grid */}
              {loading.products ? (
                <div className={classNames(
                  'grid gap-6',
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-1'
                )}>
                  <ProductCardSkeleton count={12} />
                </div>
              ) : products.length > 0 ? (
                <>
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className={classNames(
                      'grid gap-6',
                      viewMode === 'grid' 
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                        : 'grid-cols-1'
                    )}
                  >
                    {products.map((product) => (
                      <motion.div
                        key={product.id}
                        variants={itemVariants}
                        layout
                      >
                        <ProductCard 
                          product={product} 
                          variant={viewMode === 'list' ? 'minimal' : 'default'}
                        />
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="mt-12 flex justify-center">
                      <div className="flex items-center space-x-2">
                        {/* Previous button */}
                        <button
                          onClick={() => handlePageChange(pagination.currentPage - 1)}
                          disabled={pagination.currentPage === 1}
                          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Trước
                        </button>

                        {/* Page numbers */}
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                          const pageNum = Math.max(1, pagination.currentPage - 2) + i;
                          if (pageNum > pagination.totalPages) return null;
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={classNames(
                                'px-3 py-2 text-sm font-medium rounded-md',
                                pageNum === pagination.currentPage
                                  ? 'text-white bg-primary-600 border border-primary-600'
                                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                              )}
                            >
                              {pageNum}
                            </button>
                          );
                        })}

                        {/* Next button */}
                        <button
                          onClick={() => handlePageChange(pagination.currentPage + 1)}
                          disabled={pagination.currentPage === pagination.totalPages}
                          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Sau
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                // Empty state
                <div className="text-center py-16">
                  <div className="text-6xl mb-6">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Không tìm thấy sản phẩm
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    {hasActiveFilters() 
                      ? 'Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác'
                      : 'Chúng tôi đang cập nhật sản phẩm mới. Vui lòng quay lại sau.'
                    }
                  </p>
                  {hasActiveFilters() && (
                    <button
                      onClick={handleClearFilters}
                      className="btn-primary"
                    >
                      Xóa tất cả bộ lọc
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Modal */}
        {showFilters && (
          <div className="lg:hidden fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              
              <div className="inline-block align-bottom bg-white rounded-t-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:rounded-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Bộ lọc</h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <FiX className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <ProductFilter 
                    onFilterChange={(filters) => {
                      handleFilterChange(filters);
                      setShowFilters(false);
                    }}
                    onClearFilters={() => {
                      handleClearFilters();
                      setShowFilters(false);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Sort Modal */}
        {showMobileSort && (
          <div className="sm:hidden fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              
              <div className="inline-block align-bottom bg-white rounded-t-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:rounded-lg">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Sắp xếp</h3>
                    <button
                      onClick={() => setShowMobileSort(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <FiX className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <ProductSort 
                    onSortChange={() => setShowMobileSort(false)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
};

export default Products;