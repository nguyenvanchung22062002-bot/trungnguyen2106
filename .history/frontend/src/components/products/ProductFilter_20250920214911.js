import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiChevronDown, 
  FiChevronUp, 
  FiX, 
  FiFilter,
  FiRefreshCw,
  FiDollarSign,
  FiTag,
  FiCalendar,
  FiStar
} from 'react-icons/fi';

// Hooks
import { useProducts } from '../../contexts/ProductContext';

// Utils
import classNames from 'classnames';
import { debounce } from 'lodash';

const ProductFilter = ({ onFilterChange, onClearFilters }) => {
  const { 
    categories, 
    filters, 
    getAvailableBrands, 
    getAvailableAgeGroups,
    getPriceRange 
  } = useProducts();

  // Local state for expanded sections
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    ageGroup: true,
    brand: false,
    features: false
  });

  // Local state for filters
  const [localFilters, setLocalFilters] = useState(filters);
  
  // Price range state
  const [priceRange, setPriceRange] = useState(filters.priceRange || [0, 5000000]);
  const availablePriceRange = getPriceRange();

  // Update local filters when global filters change
  useEffect(() => {
    setLocalFilters(filters);
    setPriceRange(filters.priceRange || [0, 5000000]);
  }, [filters]);

  // Debounced price change handler
  const debouncedPriceChange = debounce((newRange) => {
    handleFilterChange({ priceRange: newRange });
  }, 500);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...localFilters, ...newFilters };
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  // Handle price range change
  const handlePriceRangeChange = (range) => {
    setPriceRange(range);
    debouncedPriceChange(range);
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Clear all filters
  const handleClearAll = () => {
    setLocalFilters({
      category: '',
      priceRange: [0, 5000000],
      ageGroup: '',
      brand: '',
      search: '',
      sortBy: 'created_at',
      sortOrder: 'desc'
    });
    setPriceRange([0, 5000000]);
    onClearFilters();
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Check if filters are active
  const hasActiveFilters = () => {
    return (
      localFilters.category ||
      localFilters.ageGroup ||
      localFilters.brand ||
      localFilters.search ||
      localFilters.priceRange[0] > 0 ||
      localFilters.priceRange[1] < 5000000
    );
  };

  // Available age groups and brands
  const availableAgeGroups = getAvailableAgeGroups();
  const availableBrands = getAvailableBrands();

  // Filter sections configuration
  const FilterSection = ({ 
    title, 
    icon: Icon, 
    sectionKey, 
    children, 
    count 
  }) => (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          {Icon && <Icon className="w-5 h-5 text-gray-500" />}
          <span className="font-medium text-gray-900">{title}</span>
          {count > 0 && (
            <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
              {count}
            </span>
          )}
        </div>
        {expandedSections[sectionKey] ? (
          <FiChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <FiChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      
      <AnimatePresence>
        {expandedSections[sectionKey] && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-soft border border-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FiFilter className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900">Bộ lọc</h3>
          </div>
          
          {hasActiveFilters() && (
            <button
              onClick={handleClearAll}
              className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>Xóa tất cả</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Sections */}
      <div className="divide-y divide-gray-100">
        {/* Categories */}
        <FilterSection 
          title="Danh mục" 
          icon={FiTag}
          sectionKey="category"
          count={localFilters.category ? 1 : 0}
        >
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="category"
                value=""
                checked={!localFilters.category}
                onChange={(e) => handleFilterChange({ category: e.target.value })}
                className="form-radio text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-3 text-sm text-gray-700">Tất cả danh mục</span>
            </label>
            
            {categories.map((category) => (
              <label key={category.id} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={category.id}
                  checked={localFilters.category === category.id.toString()}
                  onChange={(e) => handleFilterChange({ category: e.target.value })}
                  className="form-radio text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-3 text-sm text-gray-700 flex-1">
                  {category.name}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection 
          title="Khoảng giá" 
          icon={FiDollarSign}
          sectionKey="price"
          count={priceRange[0] > 0 || priceRange[1] < 5000000 ? 1 : 0}
        >
          <div className="space-y-4">
            {/* Price Range Slider */}
            <div className="px-2">
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="5000000"
                  step="50000"
                  value={priceRange[0]}
                  onChange={(e) => {
                    const newMin = parseInt(e.target.value);
                    if (newMin <= priceRange[1]) {
                      handlePriceRangeChange([newMin, priceRange[1]]);
                    }
                  }}
                  className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                />
                <input
                  type="range"
                  min="0"
                  max="5000000"
                  step="50000"
                  value={priceRange[1]}
                  onChange={(e) => {
                    const newMax = parseInt(e.target.value);
                    if (newMax >= priceRange[0]) {
                      handlePriceRangeChange([priceRange[0], newMax]);
                    }
                  }}
                  className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                />
              </div>
            </div>

            {/* Price Range Display */}
            <div className="flex items-center justify-between text-sm">
              <div className="bg-gray-50 px-3 py-2 rounded-lg">
                <span className="text-gray-600">Từ:</span>
                <span className="font-medium ml-1">
                  {formatCurrency(priceRange[0])}
                </span>
              </div>
              <span className="text-gray-400">-</span>
              <div className="bg-gray-50 px-3 py-2 rounded-lg">
                <span className="text-gray-600">Đến:</span>
                <span className="font-medium ml-1">
                  {formatCurrency(priceRange[1])}
                </span>
              </div>
            </div>

            {/* Quick Price Buttons */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: '< 200K', range: [0, 200000] },
                { label: '200K - 500K', range: [200000, 500000] },
                { label: '500K - 1M', range: [500000, 1000000] },
                { label: '> 1M', range: [1000000, 5000000] }
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePriceRangeChange(preset.range)}
                  className={classNames(
                    'px-3 py-2 text-xs rounded-lg border transition-colors',
                    priceRange[0] === preset.range[0] && priceRange[1] === preset.range[1]
                      ? 'bg-primary-50 border-primary-300 text-primary-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </FilterSection>

        {/* Age Groups */}
        {availableAgeGroups.length > 0 && (
          <FilterSection 
            title="Độ tuổi" 
            icon={FiCalendar}
            sectionKey="ageGroup"
            count={localFilters.ageGroup ? 1 : 0}
          >
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="ageGroup"
                  value=""
                  checked={!localFilters.ageGroup}
                  onChange={(e) => handleFilterChange({ ageGroup: e.target.value })}
                  className="form-radio text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-3 text-sm text-gray-700">Tất cả độ tuổi</span>
              </label>
              
              {availableAgeGroups.map((ageGroup) => (
                <label key={ageGroup} className="flex items-center">
                  <input
                    type="radio"
                    name="ageGroup"
                    value={ageGroup}
                    checked={localFilters.ageGroup === ageGroup}
                    onChange={(e) => handleFilterChange({ ageGroup: e.target.value })}
                    className="form-radio text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">{ageGroup}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Brands */}
        {availableBrands.length > 0 && (
          <FilterSection 
            title="Thương hiệu" 
            icon={FiStar}
            sectionKey="brand"
            count={localFilters.brand ? 1 : 0}
          >
            <div className="space-y-2 max-h-40 overflow-y-auto">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="brand"
                  value=""
                  checked={!localFilters.brand}
                  onChange={(e) => handleFilterChange({ brand: e.target.value })}
                  className="form-radio text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-3 text-sm text-gray-700">Tất cả thương hiệu</span>
              </label>
              
              {availableBrands.map((brand) => (
                <label key={brand} className="flex items-center">
                  <input
                    type="radio"
                    name="brand"
                    value={brand}
                    checked={localFilters.brand === brand}
                    onChange={(e) => handleFilterChange({ brand: e.target.value })}
                    className="form-radio text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Features */}
        <FilterSection 
          title="Tính năng" 
          sectionKey="features"
        >
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-3 text-sm text-gray-700">Miễn phí vận chuyển</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-3 text-sm text-gray-700">Sản phẩm nổi bật</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-3 text-sm text-gray-700">Có giảm giá</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-3 text-sm text-gray-700">Còn hàng</span>
            </label>
          </div>
        </FilterSection>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters() && (
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {localFilters.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-primary-100 text-primary-800">
                {categories.find(c => c.id.toString() === localFilters.category)?.name}
                <button
                  onClick={() => handleFilterChange({ category: '' })}
                  className="ml-2 hover:text-primary-900"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {localFilters.ageGroup && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-primary-100 text-primary-800">
                {localFilters.ageGroup}
                <button
                  onClick={() => handleFilterChange({ ageGroup: '' })}
                  className="ml-2 hover:text-primary-900"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {localFilters.brand && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-primary-100 text-primary-800">
                {localFilters.brand}
                <button
                  onClick={() => handleFilterChange({ brand: '' })}
                  className="ml-2 hover:text-primary-900"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {(priceRange[0] > 0 || priceRange[1] < 5000000) && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-primary-100 text-primary-800">
                {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                <button
                  onClick={() => handlePriceRangeChange([0, 5000000])}
                  className="ml-2 hover:text-primary-900"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilter;