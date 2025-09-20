import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiTrash2,
  FiPlus,
  FiMinus,
  FiShoppingBag,
  FiArrowRight,
  FiTruck,
  FiGift,
  FiShield,
  FiHeart,
  FiRefreshCw
} from 'react-icons/fi';

// Components
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Loading from '../components/common/Loading';

// Hooks
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

// Utils
import toast from 'react-hot-toast';
import classNames from 'classnames';

const Cart = () => {
  const navigate = useNavigate();
  const { items, total, totalItems, loading, updateItem, removeItem, clearCart, getShippingFee, getFinalTotal } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [isClearing, setIsClearing] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để xem giỏ hàng');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Handle quantity change
  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }

    const result = await updateItem(productId, newQuantity);
    if (!result.success) {
      toast.error(result.error || 'Không thể cập nhật số lượng');
    }
  };

  // Handle remove item
  const handleRemoveItem = async (productId) => {
    const result = await removeItem(productId);
    if (result.success) {
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
    }
  };

  // Handle clear cart
  const handleClearCart = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng?')) {
      setIsClearing(true);
      const result = await clearCart();
      if (result.success) {
        toast.success('Đã xóa toàn bộ giỏ hàng');
      }
      setIsClearing(false);
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Giỏ hàng của bạn đang trống');
      return;
    }
    navigate('/checkout');
  };

  // Calculate shipping fee
  const shippingFee = getShippingFee();
  const finalTotal = getFinalTotal();
  const freeShippingThreshold = 500000;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - total);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-8">
          <Loading fullScreen text="Đang tải giỏ hàng..." />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Giỏ hàng ({totalItems}) - Newborn Gifts</title>
        <meta name="description" content="Xem và quản lý sản phẩm trong giỏ hàng của bạn tại Newborn Gifts Vietnam." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Header />

        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="container-custom py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <Link to="/" className="text-gray-500 hover:text-primary-600">Trang chủ</Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900">Giỏ hàng</span>
            </nav>
          </div>
        </div>

        <div className="container-custom py-8">
          {items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
                  {/* Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h1 className="text-2xl font-bold text-gray-900">
                        Giỏ hàng của bạn
                        <span className="text-primary-600 ml-2">({totalItems} sản phẩm)</span>
                      </h1>
                      
                      {items.length > 1 && (
                        <button
                          onClick={handleClearCart}
                          disabled={isClearing}
                          className="flex items-center space-x-2 text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                        >
                          {isClearing ? (
                            <div className="w-4 h-4 border border-red-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <FiTrash2 className="w-4 h-4" />
                          )}
                          <span>Xóa tất cả</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Free Shipping Progress */}
                  {remainingForFreeShipping > 0 && (
                    <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-100">
                      <div className="flex items-center space-x-3 mb-2">
                        <FiTruck className="w-5 h-5 text-green-600" />
                        <p className="text-sm font-medium text-gray-900">
                          Mua thêm <span className="text-green-600 font-bold">{formatCurrency(remainingForFreeShipping)}</span> để được miễn phí vận chuyển!
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((total / freeShippingThreshold) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Items List */}
                  <div className="divide-y divide-gray-100">
                    <AnimatePresence>
                      {items.map((item) => (
                        <motion.div
                          key={item.product_id}
                          initial={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="p-6"
                        >
                          <div className="flex items-start space-x-4">
                            {/* Product Image */}
                            <Link to={`/products/${item.product_id}`} className="flex-shrink-0">
                              <img
                                src={item.image || '/images/placeholder-product.jpg'}
                                alt={item.product_name}
                                className="w-20 h-20 object-cover rounded-xl bg-gray-100 hover:scale-105 transition-transform"
                              />
                            </Link>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <Link 
                                to={`/products/${item.product_id}`}
                                className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2"
                              >
                                {item.product_name}
                              </Link>
                              
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-lg font-bold text-primary-600">
                                  {formatCurrency(item.discount_price || item.price)}
                                </span>
                                {item.discount_price && (
                                  <span className="text-sm text-gray-400 line-through">
                                    {formatCurrency(item.price)}
                                  </span>
                                )}
                              </div>

                              {/* Stock Warning */}
                              {item.stock_quantity > 0 && item.stock_quantity <= 5 && (
                                <p className="text-sm text-orange-600 font-medium mt-1">
                                  ⚠️ Chỉ còn {item.stock_quantity} sản phẩm
                                </p>
                              )}
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                  onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
                                  disabled={loading}
                                >
                                  <FiMinus className="w-4 h-4" />
                                </button>
                                <input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => handleQuantityChange(item.product_id, parseInt(e.target.value) || 1)}
                                  className="w-16 text-center border-0 focus:ring-0 focus:outline-none"
                                  min="1"
                                  max={item.stock_quantity}
                                  disabled={loading}
                                />
                                <button
                                  onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
                                  disabled={loading || item.quantity >= item.stock_quantity}
                                >
                                  <FiPlus className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Remove Button */}
                              <button
                                onClick={() => handleRemoveItem(item.product_id)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                disabled={loading}
                                title="Xóa sản phẩm"
                              >
                                <FiTrash2 className="w-5 h-5" />
                              </button>
                            </div>

                            {/* Item Total */}
                            <div className="text-right min-w-[80px]">
                              <p className="text-lg font-bold text-gray-900">
                                {formatCurrency(item.item_total)}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Continue Shopping */}
                <div className="mt-6">
                  <Link
                    to="/products"
                    className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  >
                    <FiArrowRight className="w-5 h-5 transform rotate-180" />
                    <span>Tiếp tục mua sắm</span>
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-soft p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Tổng kết đơn hàng</h2>
                  
                  {/* Summary Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Tạm tính ({totalItems} sản phẩm):</span>
                      <span className="font-medium">{formatCurrency(total)}</span>
                    </div>
                    
                    <div className="flex justify-between text-gray-600">
                      <span>Phí vận chuyển:</span>
                      <span className="font-medium">
                        {shippingFee === 0 ? (
                          <span className="text-green-600">Miễn phí</span>
                        ) : (
                          formatCurrency(shippingFee)
                        )}
                      </span>
                    </div>
                    
                    <hr className="border-gray-200" />
                    
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Tổng cộng:</span>
                      <span className="text-primary-600">{formatCurrency(finalTotal)}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-soft hover:shadow-medium transform hover:scale-105 active:scale-95"
                    disabled={loading}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <FiShoppingBag className="w-5 h-5" />
                      <span>Tiến hành thanh toán</span>
                    </div>
                  </button>

                  {/* Security Features */}
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <FiShield className="w-4 h-4 text-green-600" />
                      <span>Thanh toán an toàn & bảo mật</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <FiRefreshCw className="w-4 h-4 text-blue-600" />
                      <span>Đổi trả miễn phí trong 7 ngày</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <FiTruck className="w-4 h-4 text-orange-600" />
                      <span>Giao hàng nhanh toàn quốc</span>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-3">Chấp nhận thanh toán:</p>
                    <div className="flex space-x-2">
                      {['visa', 'mastercard', 'momo', 'zalopay'].map((method) => (
                        <div key={method} className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
                          <img 
                            src={`/images/payment/${method}.png`} 
                            alt={method}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Empty Cart
            <div className="max-w-md mx-auto text-center py-16">
              <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
                <FiShoppingBag className="w-16 h-16 text-gray-400" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Giỏ hàng của bạn đang trống
              </h1>
              
              <p className="text-gray-600 mb-8">
                Hãy khám phá các sản phẩm tuyệt vời và thêm chúng vào giỏ hàng!
              </p>
              
              <Link
                to="/products"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <FiGift className="w-5 h-5" />
                <span>Khám phá sản phẩm</span>
              </Link>
              
              {/* Wishlist Link */}
              <div className="mt-6">
                <Link
                  to="/wishlist"
                  className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <FiHeart className="w-4 h-4" />
                  <span>Xem danh sách yêu thích</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Cart;