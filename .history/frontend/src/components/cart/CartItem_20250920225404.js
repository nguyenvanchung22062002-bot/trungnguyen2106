// frontend/src/components/cart/CartItem.js
import React, { useContext, useState } from 'react';
import { CartContext } from '../../contexts/CartContext';

const CartItem = ({ item }) => {
  const { updateItemQuantity, removeItem } = useContext(CartContext);
  const [isUpdating, setIsUpdating] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > 99) return;

    setIsUpdating(true);
    try {
      await updateItemQuantity(item.id, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await removeItem(item.id);
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleIncrement = () => {
    handleQuantityChange(item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      handleQuantityChange(item.quantity - 1);
    }
  };

  return (
    <div className={`cart-item ${isUpdating ? 'opacity-50' : ''}`}>
      <div className="flex space-x-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <img
            src={item.image || '/images/placeholder.jpg'}
            alt={item.name}
            className="w-16 h-16 object-cover rounded-lg"
            onError={(e) => {
              e.target.src = '/images/placeholder.jpg';
            }}
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {item.name}
              </h4>
              {item.variant && (
                <p className="text-xs text-gray-600">
                  Phân loại: {item.variant}
                </p>
              )}
            </div>
            
            {/* Remove Button */}
            <button
              onClick={handleRemove}
              disabled={isUpdating}
              className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Xóa sản phẩm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          {/* Price and Quantity */}
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="font-semibold text-primary-600">
                {formatPrice(item.price)}
              </span>
              {item.originalPrice && item.originalPrice > item.price && (
                <span className="ml-2 text-xs text-gray-500 line-through">
                  {formatPrice(item.originalPrice)}
                </span>
              )}
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDecrement}
                disabled={isUpdating || item.quantity <= 1}
                className="quantity-btn quantity-btn-decrease"
                aria-label="Giảm số lượng"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>

              <span className="quantity-display">
                {item.quantity}
              </span>

              <button
                onClick={handleIncrement}
                disabled={isUpdating || item.quantity >= 99}
                className="quantity-btn quantity-btn-increase"
                aria-label="Tăng số lượng"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Subtotal */}
          <div className="mt-2 text-right">
            <span className="text-sm font-semibold text-gray-900">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>

          {/* Stock Warning */}
          {item.stock && item.quantity >= item.stock && (
            <div className="mt-2">
              <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                Số lượng tối đa
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {isUpdating && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default CartItem;