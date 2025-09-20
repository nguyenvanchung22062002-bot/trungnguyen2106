// frontend/src/components/cart/Cart.js
import React, { useContext } from 'react';
import { CartContext } from '../../contexts/CartContext';
import CartItem from './CartItem';

const Cart = ({ isOpen, onClose }) => {
  const { items, totalItems, totalPrice, clearCart } = useContext(CartContext);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleCheckout = () => {
    // Navigate to checkout page
    window.location.href = '/checkout';
    onClose();
  };

  const handleContinueShopping = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Giỏ hàng ({totalItems})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            // Empty Cart
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v5a2 2 0 11-4 0v-5m4 0V8a2 2 0 00-2-2H9a2 2 0 00-2 2v5" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Giỏ hàng trống
              </h3>
              <p className="text-gray-600 mb-6">
                Thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
              </p>
              <button
                onClick={handleContinueShopping}
                className="btn btn-primary"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>

              {/* Cart Footer */}
              <div className="border-t border-gray-200 p-4 space-y-4">
                {/* Clear Cart Button */}
                <button
                  onClick={clearCart}
                  className="w-full text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Xóa tất cả sản phẩm
                </button>

                {/* Total */}
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Tổng cộng:</span>
                  <span className="text-primary-600">{formatPrice(totalPrice)}</span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={handleCheckout}
                    className="btn btn-primary w-full"
                  >
                    Thanh toán
                  </button>
                  <button
                    onClick={handleContinueShopping}
                    className="btn btn-secondary w-full"
                  >
                    Tiếp tục mua sắm
                  </button>
                </div>

                {/* Shipping Info */}
                <div className="text-sm text-gray-600 text-center">
                  <p className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Miễn phí vận chuyển cho đơn hàng trên 500.000đ
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;