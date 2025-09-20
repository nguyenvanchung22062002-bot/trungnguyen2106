// frontend/src/pages/Products.js
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
  }, [searchParams, categoryId, setFilters]);

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
    if (categoryId) {
      const category = getCategoryById(categoryId);
      return category ? `${category.name} - Newborn Gifts` : 'Sản phẩm - Newborn Gifts';
    }
    
    if (filters.search) {
      return `Tìm kiếm "${filters.search}" - Newborn Gifts`;
    }
    
    return 'Sản phẩm - Newborn Gifts';
  };

  const getPageDescription = () => {
    if (categoryId) {
      const category = getCategoryById(categoryId);
      return category?.description || `Khám phá các sản phẩm trong danh mục ${category?.name}`;
    }
    
    if (filters.search) {
      return `Kết quả tìm kiếm cho "${filters.search}" tại Newborn Gifts`;
    }
    
    return 'Khám phá bộ sưu tập set quà cao cấp dành cho trẻ em tại Newborn Gifts';
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle sort change
  const handleSortChange = (sortBy, sortOrder) => {
    setFilters({ ...filters, sortBy, sortOrder });
    setCurrentPage(1);
    setShowMobileSort(false);
  };

  // Clear all filters
  const handleClearFilters = () => {
    resetFilters();
    setCurrentPage(1);
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta name="description" content={getPageDescription()} />
        <meta name="keywords" content="set quà trẻ em, đồ chơi sơ sinh, quà sinh nhật, đồ chơi giáo dục" />
        {categoryId && (
          <link rel="canonical" href={`https://newborngifts.vn/category/${categoryId}`} />
        )}
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Header />

        {/* Breadcrumb */}
        <section className="bg-white border-b">
          <div className="container mx-auto px-4 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <a href="/" className="text-gray-500 hover:text-pink-600 transition-colors">
                Trang chủ
              </a>
              <span className="text-gray-400">/</span>
              {categoryId ? (
                <>
                  <a href="/products" className="text-gray-500 hover:text-pink-600 transition-colors">
                    Sản phẩm
                  </a>
                  <span className="text-gray-400">/</span>
                  <span className="text-gray-900 font-medium">
                    {getCategoryById(categoryId)?.name || 'Danh mục'}
                  </span>
                </>
              ) : (
                <span className="text-gray-900 font-medium">Sản phẩm</span>
              )}
            </nav>
          </div>
        </section>

        {/* Page Header */}
        <section className="bg-white">
          <div className="container mx-auto px-4 lg:px-8 py-8">
            <motion.div variants={fadeInUp} initial="initial" animate="animate">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {categoryId ? getCategoryById(categoryId)?.name : 'Tất cả sản phẩm'}
              </h1>
              
              {categoryId && getCategoryById(categoryId)?.description && (
                <p className="text-lg text-gray-600 mb-6">
                  {getCategoryById(categoryId).description}
                </p>
              )}

              {/* Filter Summary */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-sm text-gray-600">Lọc theo:</span>
                  {getFilterSummary().map((filter, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-pink-100 text-pink-800"
                    >
                      {filter}
                    </span>
                  ))}
                  <button
                    onClick={handleClearFilters}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <FiX className="w-4 h-4 mr-1" />
                    Xóa bộ lọc
                  </button>
                </div>
              )}

              {/* Results count */}
              <div className="text-sm text-gray-600">
                {loading.products ? (
                  'Đang tải...'
                ) : (
                  `Hiển thị ${products.length} trong số ${pagination.totalProducts} sản phẩm`
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters and Products */}
        <section className="py-8">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filters - Desktop */}
              <aside className="hidden lg:block w-80 flex-shrink-0">
                <div className="sticky top-8">
                  <ProductFilter
                    filters={filters}
                    categories={categories}
                    onChange={handleFilterChange}
                    onReset={handleClearFilters}
                  />
                </div>
              </aside>

              {/* Main Content */}
              <main className="flex-1 min-w-0">
                {/* Toolbar */}
                <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                  <div className="flex items-center justify-between">
                    {/* Mobile Filter Button */}
                    <button
                      onClick={() => setShowFilters(true)}
                      className="lg:hidden inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <FiFilter className="w-4 h-4 mr-2" />
                      Bộ lọc
                      {hasActiveFilters && (
                        <span className="ml-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          !
                        </span>
                      )}
                    </button>

                    {/* View Mode Switcher */}
                    <div className="hidden md:flex items-center space-x-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={classNames(
                          'p-2 rounded-lg transition-colors',
                          viewMode === 'grid'
                            ? 'bg-pink-100 text-pink-600'
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                        )}
                      >
                        <FiGrid className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={classNames(
                          'p-2 rounded-lg transition-colors',
                          viewMode === 'list'
                            ? 'bg-pink-100 text-pink-600'
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                        )}
                      >
                        <FiList className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Sort Dropdown - Desktop */}
                    <div className="hidden md:block">
                      <ProductSort
                        sortBy={filters.sortBy}
                        sortOrder={filters.sortOrder}
                        onChange={handleSortChange}
                      />
                    </div>

                    {/* Mobile Sort Button */}
                    <button
                      onClick={() => setShowMobileSort(true)}
                      className="md:hidden inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <FiSliders className="w-4 h-4 mr-2" />
                      Sắp xếp
                    </button>
                  </div>
                </div>

                {/* Products Grid/List */}
                {loading.products ? (
                  <div className={classNames(
                    'grid gap-6',
                    viewMode === 'grid'
                      ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                      : 'grid-cols-1'
                  )}>
                    {Array.from({ length: 12 }).map((_, index) => (
                      <ProductCardSkeleton key={index} listView={viewMode === 'list'} />
                    ))}
                  </div>
                ) : products.length > 0 ? (
                  <>
                    <motion.div 
                      className={classNames(
                        'grid gap-6',
                        viewMode === 'grid'
                          ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                          : 'grid-cols-1'
                      )}
                      variants={staggerChildren}
                      initial="initial"
                      animate="animate"
                    >
                      {products.map((product, index) => (
                        <motion.div
                          key={product.id}
                          variants={fadeInUp}
                          transition={{ delay: index * 0.05 }}
                        >
                          <ProductCard 
                            product={product} 
                            listView={viewMode === 'list'}
                          />
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                      <div className="mt-12 flex justify-center">
                        <nav className="flex items-center space-x-2">
                          {/* Previous Page */}
                          <button
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            disabled={!pagination.hasPrevPage}
                            className={classNames(
                              'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                              pagination.hasPrevPage
                                ? 'text-gray-700 hover:bg-gray-100'
                                : 'text-gray-400 cursor-not-allowed'
                            )}
                          >
                            Trước
                          </button>

                          {/* Page Numbers */}
                          {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                            let pageNum;
                            if (pagination.totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (pagination.currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (pagination.currentPage >= pagination.totalPages - 2) {
                              pageNum = pagination.totalPages - 4 + i;
                            } else {
                              pageNum = pagination.currentPage - 2 + i;
                            }

                            return (
                              <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={classNames(
                                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                  pageNum === pagination.currentPage
                                    ? 'bg-pink-500 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                )}
                              >
                                {pageNum}
                              </button>
                            );
                          })}

                          {/* Next Page */}
                          <button
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            disabled={!pagination.hasNextPage}
                            className={classNames(
                              'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                              pagination.hasNextPage
                                ? 'text-gray-700 hover:bg-gray-100'
                                : 'text-gray-400 cursor-not-allowed'
                            )}
                          >
                            Tiếp
                          </button>
                        </nav>
                      </div>
                    )}
                  </>
                ) : (
                  /* No Products Found */
                  <motion.div 
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    className="text-center py-16"
                  >
                    <div className="text-6xl mb-6">🔍</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Không tìm thấy sản phẩm nào
                    </h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      Không có sản phẩm nào phù hợp với tiêu chí tìm kiếm của bạn. 
                      Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác.
                    </p>
                    <button
                      onClick={handleClearFilters}
                      className="inline-flex items-center px-6 py-3 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition-colors"
                    >
                      <FiX className="w-4 h-4 mr-2" />
                      Xóa tất cả bộ lọc
                    </button>
                  </motion.div>
                )}
              </main>
            </div>
          </div>
        </section>

        {/* Mobile Filter Modal */}
        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowFilters(false)} />
            <div className="absolute inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Bộ lọc</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto h-full pb-20">
                <ProductFilter
                  filters={filters}
                  categories={categories}
                  onChange={handleFilterChange}
                  onReset={handleClearFilters}
                  onClose={() => setShowFilters(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Mobile Sort Modal */}
        {showMobileSort && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileSort(false)} />
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Sắp xếp theo</h3>
                <button
                  onClick={() => setShowMobileSort(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <ProductSort
                  sortBy={filters.sortBy}
                  sortOrder={filters.sortOrder}
                  onChange={handleSortChange}
                  mobile={true}
                />
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