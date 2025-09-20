import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiCheck } from 'react-icons/fi';

// Hooks
import { useProducts } from '../../contexts/ProductContext';

// Utils
import classNames from 'classnames';

const ProductSort = ({ onSortChange }) => {
  const { filters, setFilters } = useProducts();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Sort options
  const sortOptions = [
    {
      label: 'Mới nhất',
      value: 'created_at',
      order: 'desc',
      description: 'Sản phẩm được thêm gần đây nhất'
    },
    {
      label: 'Cũ nhất',
      value: 'created_at',
      order: 'asc',
      description: 'Sản phẩm được thêm lâu nhất'
    },
    {
      label: 'Giá thấp đến cao',
      value: 'price',
      order: 'asc',
      description: 'Từ rẻ đến đắt'
    },
    {
      label: 'Giá cao đến thấp',
      value: 'price',
      order: 'desc',
      description: 'Từ đắt đến rẻ'
    },
    {
      label: 'Tên A-Z',
      value: 'name',
      order: 'asc',
      description: 'Sắp xếp theo bảng chữ cái'
    },
    {
      label: 'Tên Z-A',
      value: 'name',
      order: 'desc',
      description: 'Sắp xếp ngược bảng chữ cái'
    },
    {
      label: 'Phổ biến nhất',
      value: 'popularity',
      order: 'desc',
      description: 'Dựa trên lượt mua và đánh giá'
    },
    {
      label: 'Đánh giá cao nhất',
      value: 'rating',
      order: 'desc',
      description: 'Sản phẩm có rating cao nhất'
    }
  ];

  // Get current sort option
  const currentSort = sortOptions.find(
    option => option.value === filters.sortBy && option.order === filters.sortOrder
  ) || sortOptions[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle sort change
  const handleSortChange = (option) => {
    setFilters({
      sortBy: option.value,
      sortOrder: option.order
    });
    setIsOpen(false);
    if (onSortChange) {
      onSortChange(option);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={classNames(
          'flex items-center justify-between min-w-[200px] px-4 py-2 text-sm font-medium text-left bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors',
          isOpen && 'ring-2 ring-primary-500 border-primary-500'
        )}
      >
        <div className="flex flex-col">
          <span className="text-gray-900">{currentSort.label}</span>
          <span className="text-xs text-gray-500 hidden sm:block">
            {currentSort.description}
          </span>
        </div>
        <FiChevronDown
          className={classNames(
            'w-5 h-5 text-gray-400 transition-transform ml-2',
            isOpen && 'transform rotate-180'
          )}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-strong z-50 py-2"
          >
            <div className="max-h-80 overflow-y-auto">
              {sortOptions.map((option, index) => {
                const isSelected = 
                  option.value === filters.sortBy && 
                  option.order === filters.sortOrder;

                return (
                  <button
                    key={`${option.value}-${option.order}`}
                    onClick={() => handleSortChange(option)}
                    className={classNames(
                      'w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors',
                      isSelected && 'bg-primary-50 text-primary-700'
                    )}
                  >
                    <div className="flex flex-col flex-1 pr-2">
                      <span className="font-medium text-sm">
                        {option.label}
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5">
                        {option.description}
                      </span>
                    </div>
                    
                    {isSelected && (
                      <FiCheck className="w-5 h-5 text-primary-600 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Mobile Sort Component (for modal usage)
export const MobileProductSort = ({ onSortChange }) => {
  const { filters, setFilters } = useProducts();

  const sortOptions = [
    { label: 'Mới nhất', value: 'created_at', order: 'desc' },
    { label: 'Cũ nhất', value: 'created_at', order: 'asc' },
    { label: 'Giá thấp đến cao', value: 'price', order: 'asc' },
    { label: 'Giá cao đến thấp', value: 'price', order: 'desc' },
    { label: 'Tên A-Z', value: 'name', order: 'asc' },
    { label: 'Tên Z-A', value: 'name', order: 'desc' },
    { label: 'Phổ biến nhất', value: 'popularity', order: 'desc' },
    { label: 'Đánh giá cao nhất', value: 'rating', order: 'desc' }
  ];

  const handleSortChange = (option) => {
    setFilters({
      sortBy: option.value,
      sortOrder: option.order
    });
    if (onSortChange) {
      onSortChange(option);
    }
  };

  return (
    <div className="space-y-2">
      {sortOptions.map((option) => {
        const isSelected = 
          option.value === filters.sortBy && 
          option.order === filters.sortOrder;

        return (
          <button
            key={`${option.value}-${option.order}`}
            onClick={() => handleSortChange(option)}
            className={classNames(
              'w-full flex items-center justify-between p-4 text-left rounded-lg border transition-colors',
              isSelected
                ? 'border-primary-300 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:bg-gray-50'
            )}
          >
            <span className="font-medium">{option.label}</span>
            {isSelected && (
              <FiCheck className="w-5 h-5 text-primary-600" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ProductSort;