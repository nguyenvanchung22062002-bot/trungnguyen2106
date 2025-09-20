// frontend/src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiEdit3,
  FiSave,
  FiX,
  FiEye,
  FiEyeOff,
  FiLock,
  FiPackage,
  FiHeart,
  FiClock,
  FiShoppingBag,
  FiStar,
  FiTruck
} from 'react-icons/fi';

// Components
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Loading from '../components/common/Loading';

// Hooks
import { useAuth } from '../contexts/AuthContext';

// Services
import { userService } from '../services/userService';
import { orderService } from '../services/orderService';

// Utils
import { formatCurrency, formatDate } from '../utils/helpers';
import { validatePhone } from '../utils/validators';
import classNames from 'classnames';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { errors: profileErrors, isDirty }
  } = useForm({
    defaultValues: {
      full_name: user?.full_name || '',
      phone: user?.phone || '',
      address: user?.address || ''
    }
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    watch,
    formState: { errors: passwordErrors }
  } = useForm();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const newPassword = watch('newPassword');

  // Load user orders when tab changes
  useEffect(() => {
    if (activeTab === 'orders') {
      loadOrders();
    }
  }, [activeTab]);

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await orderService.getUserOrders();
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Handle profile update
  const onSubmitProfile = async (data) => {
    try {
      setLoading(true);
      await updateUser(data);
      setIsEditing(false);
      // Show success message
    } catch (error) {
      console.error('Error updating profile:', error);
      // Show error message
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const onSubmitPassword = async (data) => {
    try {
      setLoading(true);
      await userService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      resetPassword();
      setShowPasswordForm(false);
      // Show success message
    } catch (error) {
      console.error('Error changing password:', error);
      // Show error message
    } finally {
      setLoading(false);
    }
  };

  // Reset profile form when user data changes
  useEffect(() => {
    if (user) {
      resetProfile({
        full_name: user.full_name || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user, resetProfile]);

  const tabs = [
    { id: 'profile', label: 'Thông tin cá nhân', icon: FiUser },
    { id: 'orders', label: 'Đơn hàng của tôi', icon: FiPackage },
    { id: 'wishlist', label: 'Danh sách yêu thích', icon: FiHeart },
    { id: 'security', label: 'Bảo mật', icon: FiLock }
  ];

  const getOrderStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipping: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getOrderStatusText = (status) => {
    const texts = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      shipping: 'Đang giao hàng',
      delivered: 'Đã giao hàng',
      cancelled: 'Đã hủy'
    };
    return texts[status] || status;
  };

  return (
    <>
      <Helmet>
        <title>Trang cá nhân - Newborn Gifts</title>
        <meta name="description" content="Quản lý thông tin cá nhân và đơn hàng tại Newborn Gifts" />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="py-8">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  {/* User Info */}
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiUser className="w-10 h-10 text-pink-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {user?.full_name || 'Người dùng'}
                    </h3>
                    <p className="text-gray-600">{user?.email}</p>
                  </div>

                  {/* Navigation Tabs */}
                  <nav className="space-y-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={classNames(
                          'w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors',
                          activeTab === tab.id
                            ? 'bg-pink-50 text-pink-600 border border-pink-200'
                            : 'text-gray-700 hover:bg-gray-50'
                        )}
                      >
                        <tab.icon className="w-5 h-5 mr-3" />
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl shadow-sm p-8">
                  {/* Profile Tab */}
                  {activeTab === 'profile' && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900">
                          Thông tin cá nhân
                        </h2>
                        {!isEditing ? (
                          <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                          >
                            <FiEdit3 className="w-4 h-4 mr-2" />
                            Chỉnh sửa
                          </button>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setIsEditing(false);
                                resetProfile();
                              }}
                              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <FiX className="w-4 h-4 mr-2" />
                              Hủy
                            </button>
                            <button
                              onClick={handleSubmitProfile(onSubmitProfile)}
                              disabled={loading || !isDirty}
                              className="flex items-center px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 transition-colors"
                            >
                              <FiSave className="w-4 h-4 mr-2" />
                              {loading ? 'Đang lưu...' : 'Lưu'}
                            </button>
                          </div>
                        )}
                      </div>

                      <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-6">
                        {/* Email (readonly) */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <div className="relative">
                            <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              type="email"
                              value={user?.email || ''}
                              disabled
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                            />
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            Email không thể thay đổi
                          </p>
                        </div>

                        {/* Full Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Họ và tên *
                          </label>
                          <div className="relative">
                            <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              {...registerProfile('full_name', {
                                required: 'Vui lòng nhập họ và tên'
                              })}
                              type="text"
                              disabled={!isEditing}
                              className={classNames(
                                'w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors',
                                !isEditing ? 'bg-gray-50 text-gray-700 border-gray-300' : 'border-gray-300',
                                profileErrors.full_name ? 'border-red-300' : ''
                              )}
                              placeholder="Nhập họ và tên"
                            />
                          </div>
                          {profileErrors.full_name && (
                            <p className="mt-1 text-sm text-red-600">{profileErrors.full_name.message}</p>
                          )}
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Số điện thoại
                          </label>
                          <div className="relative">
                            <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              {...registerProfile('phone', {
                                validate: (value) => !value || validatePhone(value) || 'Số điện thoại không hợp lệ'
                              })}
                              type="tel"
                              disabled={!isEditing}
                              className={classNames(
                                'w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors',
                                !isEditing ? 'bg-gray-50 text-gray-700 border-gray-300' : 'border-gray-300',
                                profileErrors.phone ? 'border-red-300' : ''
                              )}
                              placeholder="Nhập số điện thoại"
                            />
                          </div>
                          {profileErrors.phone && (
                            <p className="mt-1 text-sm text-red-600">{profileErrors.phone.message}</p>
                          )}
                        </div>

                        {/* Address */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Địa chỉ
                          </label>
                          <div className="relative">
                            <FiMapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <textarea
                              {...registerProfile('address')}
                              rows={3}
                              disabled={!isEditing}
                              className={classNames(
                                'w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none transition-colors',
                                !isEditing ? 'bg-gray-50 text-gray-700 border-gray-300' : 'border-gray-300'
                              )}
                              placeholder="Nhập địa chỉ"
                            />
                          </div>
                        </div>
                      </form>

                      {/* Account Statistics */}
                      <div className="mt-8 pt-8 border-t">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Thống kê tài khoản
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center">
                              <FiShoppingBag className="w-8 h-8 text-blue-600 mr-3" />
                              <div>
                                <p className="text-2xl font-bold text-blue-600">
                                  {user?.total_orders || 0}
                                </p>
                                <p className="text-sm text-gray-600">Đơn hàng</p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg">
                            <div className="flex items-center">
                              <FiTruck className="w-8 h-8 text-green-600 mr-3" />
                              <div>
                                <p className="text-2xl font-bold text-green-600">
                                  {formatCurrency(user?.total_spent || 0)}
                                </p>
                                <p className="text-sm text-gray-600">Đã mua</p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-purple-50 p-4 rounded-lg">
                            <div className="flex items-center">
                              <FiClock className="w-8 h-8 text-purple-600 mr-3" />
                              <div>
                                <p className="text-2xl font-bold text-purple-600">
                                  {formatDate(user?.created_at)}
                                </p>
                                <p className="text-sm text-gray-600">Thành viên từ</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Orders Tab */}
                  {activeTab === 'orders' && (
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                        Đơn hàng của tôi
                      </h2>

                      {ordersLoading ? (
                        <Loading />
                      ) : orders.length === 0 ? (
                        <div className="text-center py-12">
                          <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Chưa có đơn hàng nào
                          </h3>
                          <p className="text-gray-600 mb-6">
                            Bạn chưa có đơn hàng nào. Hãy khám phá và mua sắm ngay!
                          </p>
                          <Link
                            to="/products"
                            className="inline-flex items-center px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                          >
                            Mua sắm ngay
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {orders.map((order) => (
                            <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <h3 className="font-semibold text-gray-900">
                                    Đơn hàng #{order.id}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    Đặt ngày {formatDate(order.created_at)}
                                  </p>
                                </div>
                                <span className={classNames(
                                  'px-3 py-1 rounded-full text-sm font-medium',
                                  getOrderStatusColor(order.status)
                                )}>
                                  {getOrderStatusText(order.status)}
                                </span>
                              </div>

                              {/* Order Items */}
                              <div className="space-y-3 mb-4">
                                {order.items?.map((item, index) => (
                                  <div key={index} className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                      {item.images?.[0] ? (
                                        <img
                                          src={item.images[0]}
                                          alt={item.product_name}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                          <FiPackage className="w-4 h-4 text-gray-400" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-900">
                                        {item.product_name}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        Số lượng: {item.quantity}
                                      </p>
                                    </div>
                                    <p className="font-medium">
                                      {formatCurrency(item.price * item.quantity)}
                                    </p>
                                  </div>
                                ))}
                              </div>

                              <div className="flex items-center justify-between pt-4 border-t">
                                <div className="text-lg font-bold">
                                  Tổng: {formatCurrency(order.total_amount)}
                                </div>
                                <div className="flex space-x-2">
                                  <Link
                                    to={`/order/${order.id}`}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                  >
                                    Xem chi tiết
                                  </Link>
                                  {order.status === 'delivered' && (
                                    <button className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors">
                                      Đánh giá
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Wishlist Tab */}
                  {activeTab === 'wishlist' && (
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                        Danh sách yêu thích
                      </h2>
                      <div className="text-center py-12">
                        <FiHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Danh sách trống
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Bạn chưa có sản phẩm yêu thích nào. Hãy thêm những sản phẩm bạn thích!
                        </p>
                        <Link
                          to="/products"
                          className="inline-flex items-center px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                        >
                          Khám phá sản phẩm
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Security Tab */}
                  {activeTab === 'security' && (
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                        Bảo mật tài khoản
                      </h2>

                      <div className="space-y-6">
                        {/* Change Password */}
                        <div className="border border-gray-200 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                Đổi mật khẩu
                              </h3>
                              <p className="text-gray-600">
                                Thay đổi mật khẩu để bảo mật tài khoản
                              </p>
                            </div>
                            <button
                              onClick={() => setShowPasswordForm(!showPasswordForm)}
                              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                            >
                              {showPasswordForm ? 'Hủy' : 'Đổi mật khẩu'}
                            </button>
                          </div>

                          {showPasswordForm && (
                            <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
                              {/* Current Password */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Mật khẩu hiện tại *
                                </label>
                                <div className="relative">
                                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                  <input
                                    {...registerPassword('currentPassword', {
                                      required: 'Vui lòng nhập mật khẩu hiện tại'
                                    })}
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                  >
                                    {showCurrentPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                                  </button>
                                </div>
                                {passwordErrors.currentPassword && (
                                  <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                                )}
                              </div>

                              {/* New Password */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Mật khẩu mới *
                                </label>
                                <div className="relative">
                                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                  <input
                                    {...registerPassword('newPassword', {
                                      required: 'Vui lòng nhập mật khẩu mới',
                                      minLength: {
                                        value: 6,
                                        message: 'Mật khẩu phải có ít nhất 6 ký tự'
                                      }
                                    })}
                                    type={showNewPassword ? 'text' : 'password'}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                  >
                                    {showNewPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                                  </button>
                                </div>
                                {passwordErrors.newPassword && (
                                  <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                                )}
                              </div>

                              {/* Confirm Password */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Xác nhận mật khẩu mới *
                                </label>
                                <div className="relative">
                                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                  <input
                                    {...registerPassword('confirmPassword', {
                                      required: 'Vui lòng xác nhận mật khẩu mới',
                                      validate: value => value === newPassword || 'Mật khẩu xác nhận không khớp'
                                    })}
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                  >
                                    {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                                  </button>
                                </div>
                                {passwordErrors.confirmPassword && (
                                  <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                                )}
                              </div>

                              <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-pink-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-pink-600 disabled:opacity-50 transition-colors"
                              >
                                {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                              </button>
                            </form>
                          )}
                        </div>

                        {/* Account Activity */}
                        <div className="border border-gray-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Hoạt động tài khoản
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Đăng nhập lần cuối:</span>
                              <span className="font-medium">Hôm nay, 10:30 AM</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Thiết bị:</span>
                              <span className="font-medium">Chrome trên Windows</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Địa chỉ IP:</span>
                              <span className="font-medium">192.168.1.1</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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

export default Profile;