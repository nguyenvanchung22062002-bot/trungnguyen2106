// frontend/src/pages/Checkout.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  FiCreditCard,
  FiTruck,
  FiMapPin,
  FiPhone,
  FiMail,
  FiUser,
  FiCheck,
  FiLock,
  FiArrowLeft,
  FiPackage,
  FiTag
} from 'react-icons/fi';

// Components
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

// Hooks
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

// Services
import { orderService } from '../services/orderService';

// Utils
import { formatCurrency } from '../utils/helpers';
import { validatePhone } from '../utils/validators';
import classNames from 'classnames';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm({
    defaultValues: {
      full_name: user?.full_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      payment_method: 'cod',
      shipping_method: 'standard',
      notes: ''
    }
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  // Fill form with user data
  useEffect(() => {
    if (user) {
      setValue('full_name', user.full_name);
      setValue('email', user.email);
      setValue('phone', user.phone || '');
      setValue('address', user.address || '');
    }
  }, [user, setValue]);

  const payment_method = watch('payment_method');
  const shipping_method = watch('shipping_method');

  // Calculate totals
  const subtotal = getTotalPrice();
  const shippingFee = shipping_method === 'express' ? 50000 : subtotal >= 500000 ? 0 : 30000;
  const discount = appliedCoupon?.discount_amount || 0;
  const total = subtotal + shippingFee - discount;

  // Handle coupon application
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    try {
      // TODO: Validate coupon with API
      // For now, simulate coupon validation
      const mockCoupons = {
        'WELCOME10': { discount_amount: subtotal * 0.1, type: 'percentage' },
        'FREESHIP': { discount_amount: shippingFee, type: 'shipping' },
        'SAVE50K': { discount_amount: 50000, type: 'fixed' }
      };

      if (mockCoupons[couponCode.toUpperCase()]) {
        setAppliedCoupon({
          code: couponCode.toUpperCase(),
          ...mockCoupons[couponCode.toUpperCase()]
        });
      } else {
        alert('Mã giảm giá không hợp lệ');
      }
    } catch (error) {
      alert('Có lỗi xảy ra khi áp dụng mã giảm giá');
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const orderData = {
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.discount_price || item.price
        })),
        total_amount: total,
        shipping_address: `${data.full_name}\n${data.phone}\n${data.address}`,
        payment_method: data.payment_method,
        notes: data.notes,
        coupon_code: appliedCoupon?.code
      };

      const response = await orderService.create(orderData);
      
      if (response.success) {
        clearCart();
        navigate(`/order-success/${response.data.order.id}`);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, title: 'Thông tin giao hàng', completed: currentStep > 1 },
    { id: 2, title: 'Phương thức thanh toán', completed: currentStep > 2 },
    { id: 3, title: 'Xác nhận đặt hàng', completed: false }
  ];

  if (!cartItems || cartItems.length === 0) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Thanh toán đơn hàng - Newborn Gifts</title>
        <meta name="description" content="Hoàn tất đơn hàng của bạn tại Newborn Gifts" />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="py-8">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Back Button */}
            <button
              onClick={() => navigate('/cart')}
              className="inline-flex items-center text-gray-600 hover:text-pink-600 mb-8"
            >
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Quay lại giỏ hàng
            </button>

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between max-w-md mx-auto">
                {steps.map((step, index) => (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center">
                      <div className={classNames(
                        'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold',
                        step.completed || currentStep === step.id
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      )}>
                        {step.completed ? <FiCheck className="w-5 h-5" /> : step.id}
                      </div>
                      <span className="text-xs mt-2 text-center max-w-20">{step.title}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={classNames(
                        'flex-1 h-px mx-4',
                        step.completed ? 'bg-pink-500' : 'bg-gray-200'
                      )} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  {/* Shipping Information */}
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex items-center mb-6">
                      <FiTruck className="w-6 h-6 text-pink-500 mr-3" />
                      <h2 className="text-xl font-semibold text-gray-900">
                        Thông tin giao hàng
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Họ và tên *
                        </label>
                        <div className="relative">
                          <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            {...register('full_name', {
                              required: 'Vui lòng nhập họ và tên'
                            })}
                            type="text"
                            className={classNames(
                              'w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500',
                              errors.full_name ? 'border-red-300' : 'border-gray-300'
                            )}
                            placeholder="Nhập họ và tên"
                          />
                        </div>
                        {errors.full_name && (
                          <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <div className="relative">
                          <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            {...register('email', {
                              required: 'Vui lòng nhập email',
                              pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Email không hợp lệ'
                              }
                            })}
                            type="email"
                            className={classNames(
                              'w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500',
                              errors.email ? 'border-red-300' : 'border-gray-300'
                            )}
                            placeholder="Nhập email"
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số điện thoại *
                        </label>
                        <div className="relative">
                          <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            {...register('phone', {
                              required: 'Vui lòng nhập số điện thoại',
                              validate: validatePhone
                            })}
                            type="tel"
                            className={classNames(
                              'w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500',
                              errors.phone ? 'border-red-300' : 'border-gray-300'
                            )}
                            placeholder="Nhập số điện thoại"
                          />
                        </div>
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                        )}
                      </div>

                      {/* Shipping Method */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phương thức giao hàng *
                        </label>
                        <div className="space-y-3">
                          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              {...register('shipping_method')}
                              type="radio"
                              value="standard"
                              className="text-pink-600 focus:ring-pink-500"
                            />
                            <div className="ml-3">
                              <div className="font-medium">Giao hàng tiêu chuẩn</div>
                              <div className="text-sm text-gray-600">2-3 ngày làm việc</div>
                            </div>
                            <div className="ml-auto text-sm font-medium">
                              {subtotal >= 500000 ? 'Miễn phí' : '30.000đ'}
                            </div>
                          </label>
                          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              {...register('shipping_method')}
                              type="radio"
                              value="express"
                              className="text-pink-600 focus:ring-pink-500"
                            />
                            <div className="ml-3">
                              <div className="font-medium">Giao hàng nhanh</div>
                              <div className="text-sm text-gray-600">1-2 ngày làm việc</div>
                            </div>
                            <div className="ml-auto text-sm font-medium">50.000đ</div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ giao hàng *
                      </label>
                      <div className="relative">
                        <FiMapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <textarea
                          {...register('address', {
                            required: 'Vui lòng nhập địa chỉ giao hàng'
                          })}
                          rows={3}
                          className={classNames(
                            'w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none',
                            errors.address ? 'border-red-300' : 'border-gray-300'
                          )}
                          placeholder="Nhập địa chỉ chi tiết..."
                        />
                      </div>
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex items-center mb-6">
                      <FiCreditCard className="w-6 h-6 text-pink-500 mr-3" />
                      <h2 className="text-xl font-semibold text-gray-900">
                        Phương thức thanh toán
                      </h2>
                    </div>

                    <div className="space-y-4">
                      {/* COD */}
                      <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          {...register('payment_method')}
                          type="radio"
                          value="cod"
                          className="text-pink-600 focus:ring-pink-500"
                        />
                        <div className="ml-4 flex-1">
                          <div className="flex items-center">
                            <FiPackage className="w-5 h-5 text-gray-400 mr-2" />
                            <span className="font-medium">Thanh toán khi nhận hàng (COD)</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Thanh toán bằng tiền mặt khi nhận hàng
                          </p>
                        </div>
                      </label>

                      {/* Bank Transfer */}
                      <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          {...register('payment_method')}
                          type="radio"
                          value="bank_transfer"
                          className="text-pink-600 focus:ring-pink-500"
                        />
                        <div className="ml-4 flex-1">
                          <div className="flex items-center">
                            <FiCreditCard className="w-5 h-5 text-gray-400 mr-2" />
                            <span className="font-medium">Chuyển khoản ngân hàng</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Chuyển khoản qua ATM/Internet Banking
                          </p>
                        </div>
                      </label>

                      {/* Online Payment */}
                      <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 opacity-50">
                        <input
                          type="radio"
                          value="online"
                          disabled
                          className="text-pink-600 focus:ring-pink-500"
                        />
                        <div className="ml-4 flex-1">
                          <div className="flex items-center">
                            <FiLock className="w-5 h-5 text-gray-400 mr-2" />
                            <span className="font-medium">Thanh toán online</span>
                            <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                              Sắp ra mắt
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Visa/Mastercard/JCB/VNPay/MoMo
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Bank Transfer Details */}
                    {payment_method === 'bank_transfer' && (
                      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-3">Thông tin chuyển khoản:</h4>
                        <div className="space-y-2 text-sm">
                          <div><strong>Ngân hàng:</strong> Techcombank</div>
                          <div><strong>Số tài khoản:</strong> 19036767456019</div>
                          <div><strong>Chủ tài khoản:</strong> NEWBORN GIFTS VIETNAM</div>
                          <div><strong>Nội dung:</strong> {user?.id || 'GUEST'} - {user?.phone || 'Số điện thoại'}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Notes */}
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Ghi chú đơn hàng
                    </h3>
                    <textarea
                      {...register('notes')}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                      placeholder="Ghi chú về đơn hàng, yêu cầu đặc biệt..."
                    />
                  </div>
                </form>
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                {/* Cart Items */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Đơn hàng của bạn ({cartItems.length} sản phẩm)
                  </h3>
                  
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.images?.[0] ? (
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <FiPackage className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Số lượng: {item.quantity}
                          </p>
                        </div>
                        
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency((item.discount_price || item.price) * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coupon */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center mb-4">
                    <FiTag className="w-5 h-5 text-pink-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Mã giảm giá</h3>
                  </div>
                  
                  {!appliedCoupon ? (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="Nhập mã giảm giá"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                      >
                        Áp dụng
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center">
                        <FiCheck className="w-5 h-5 text-green-500 mr-2" />
                        <span className="font-medium text-green-800">{appliedCoupon.code}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAppliedCoupon(null)}
                        className="text-green-600 hover:text-green-800"
                      >
                        Xóa
                      </button>
                    </div>
                  )}
                </div>

                {/* Order Total */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Chi tiết thanh toán</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tạm tính:</span>
                      <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phí vận chuyển:</span>
                      <span className="font-medium">
                        {shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}
                      </span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Giảm giá:</span>
                        <span className="font-medium">-{formatCurrency(discount)}</span>
                      </div>
                    )}
                    
                    <hr className="my-3" />
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span>Tổng cộng:</span>
                      <span className="text-pink-600">{formatCurrency(total)}</span>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    form="checkout-form"
                    disabled={loading || !isValid}
                    onClick={handleSubmit(onSubmit)}
                    className="w-full mt-6 bg-pink-500 text-white py-4 px-6 rounded-lg font-semibold hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Đang xử lý...' : 'Đặt hàng'}
                  </button>
                  
                  <div className="mt-4 flex items-center justify-center text-sm text-gray-600">
                    <FiLock className="w-4 h-4 mr-1" />
                    Thông tin của bạn được bảo mật an toàn
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Checkout;