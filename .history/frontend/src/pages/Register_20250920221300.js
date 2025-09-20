// frontend/src/pages/Register.js
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  FiEye,
  FiEyeOff,
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiMapPin,
  FiCheck,
  FiX,
  FiLoader
} from 'react-icons/fi';

// Components
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

// Hooks
import { useAuth } from '../contexts/AuthContext';

// Utils
import { validateEmail, validatePhone, validatePassword } from '../utils/validators';
import classNames from 'classnames';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register: registerUser, loading } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setError,
    clearErrors
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      full_name: '',
      phone: '',
      address: '',
      agreeTerms: false
    }
  });

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  // Check password strength
  React.useEffect(() => {
    if (password) {
      let strength = 0;
      if (password.length >= 8) strength++;
      if (/[a-z]/.test(password)) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/\d/.test(password)) strength++;
      if (/[!@#$%^&*]/.test(password)) strength++;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [password]);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      clearErrors();
      
      const userData = {
        username: data.username.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        full_name: data.full_name.trim(),
        phone: data.phone.trim(),
        address: data.address.trim()
      };

      await registerUser(userData);
      
      // Redirect to intended page or home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      
      // Handle specific field errors
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) => {
          if (err.field === 'email') {
            setError('email', { type: 'manual', message: err.message });
          } else if (err.field === 'username') {
            setError('username', { type: 'manual', message: err.message });
          }
        });
      } else {
        setError('root', { type: 'manual', message: errorMessage });
      }
    }
  };

  // Password strength indicator
  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return { text: 'Rất yếu', color: 'text-red-500', bg: 'bg-red-100' };
      case 2:
        return { text: 'Yếu', color: 'text-orange-500', bg: 'bg-orange-100' };
      case 3:
        return { text: 'Trung bình', color: 'text-yellow-500', bg: 'bg-yellow-100' };
      case 4:
        return { text: 'Mạnh', color: 'text-green-500', bg: 'bg-green-100' };
      case 5:
        return { text: 'Rất mạnh', color: 'text-green-600', bg: 'bg-green-100' };
      default:
        return { text: '', color: '', bg: '' };
    }
  };

  const strengthInfo = getPasswordStrengthText();

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <>
      <Helmet>
        <title>Đăng ký tài khoản - Newborn Gifts</title>
        <meta name="description" content="Tạo tài khoản Newborn Gifts để mua sắm và nhận những ưu đãi độc quyền dành cho thành viên." />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-md mx-auto">
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Tạo tài khoản
                  </h1>
                  <p className="text-gray-600">
                    Tham gia Newborn Gifts để nhận những ưu đãi đặc biệt
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Global Error */}
                  {errors.root && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <FiX className="w-5 h-5 text-red-500 mr-2" />
                        <span className="text-red-700 text-sm">{errors.root.message}</span>
                      </div>
                    </div>
                  )}

                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên đăng nhập *
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        {...register('username', {
                          required: 'Vui lòng nhập tên đăng nhập',
                          minLength: {
                            value: 3,
                            message: 'Tên đăng nhập phải có ít nhất 3 ký tự'
                          },
                          pattern: {
                            value: /^[a-zA-Z0-9_]+$/,
                            message: 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới'
                          }
                        })}
                        type="text"
                        className={classNames(
                          'w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors',
                          errors.username ? 'border-red-300' : 'border-gray-300'
                        )}
                        placeholder="Nhập tên đăng nhập"
                      />
                    </div>
                    {errors.username && (
                      <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
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
                          validate: validateEmail
                        })}
                        type="email"
                        className={classNames(
                          'w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors',
                          errors.email ? 'border-red-300' : 'border-gray-300'
                        )}
                        placeholder="Nhập địa chỉ email"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên *
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        {...register('full_name', {
                          required: 'Vui lòng nhập họ và tên',
                          minLength: {
                            value: 2,
                            message: 'Họ và tên phải có ít nhất 2 ký tự'
                          }
                        })}
                        type="text"
                        className={classNames(
                          'w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors',
                          errors.full_name ? 'border-red-300' : 'border-gray-300'
                        )}
                        placeholder="Nhập họ và tên"
                      />
                    </div>
                    {errors.full_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
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
                        {...register('phone', {
                          validate: (value) => !value || validatePhone(value) || 'Số điện thoại không hợp lệ'
                        })}
                        type="tel"
                        className={classNames(
                          'w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors',
                          errors.phone ? 'border-red-300' : 'border-gray-300'
                        )}
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
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
                        {...register('address')}
                        rows={3}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors resize-none"
                        placeholder="Nhập địa chỉ"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu *
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        {...register('password', {
                          required: 'Vui lòng nhập mật khẩu',
                          validate: validatePassword
                        })}
                        type={showPassword ? 'text' : 'password'}
                        className={classNames(
                          'w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors',
                          errors.password ? 'border-red-300' : 'border-gray-300'
                        )}
                        placeholder="Nhập mật khẩu"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Password Strength */}
                    {password && (
                      <div className="mt-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={classNames(
                                'h-2 rounded-full transition-all duration-300',
                                passwordStrength === 1 ? 'bg-red-500 w-1/5' : '',
                                passwordStrength === 2 ? 'bg-orange-500 w-2/5' : '',
                                passwordStrength === 3 ? 'bg-yellow-500 w-3/5' : '',
                                passwordStrength === 4 ? 'bg-green-500 w-4/5' : '',
                                passwordStrength === 5 ? 'bg-green-600 w-full' : ''
                              )}
                            />
                          </div>
                          <span className={classNames('text-xs font-medium', strengthInfo.color)}>
                            {strengthInfo.text}
                          </span>
                        </div>
                      </div>
                    )}

                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Xác nhận mật khẩu *
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        {...register('confirmPassword', {
                          required: 'Vui lòng xác nhận mật khẩu',
                          validate: value => value === password || 'Mật khẩu xác nhận không khớp'
                        })}
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={classNames(
                          'w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors',
                          errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                        )}
                        placeholder="Nhập lại mật khẩu"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  {/* Terms Agreement */}
                  <div>
                    <label className="flex items-start space-x-3">
                      <input
                        {...register('agreeTerms', {
                          required: 'Vui lòng đồng ý với điều khoản sử dụng'
                        })}
                        type="checkbox"
                        className="mt-1 w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                      />
                      <span className="text-sm text-gray-600">
                        Tôi đồng ý với{' '}
                        <Link to="/terms" className="text-pink-600 hover:text-pink-700 font-medium">
                          Điều khoản sử dụng
                        </Link>{' '}
                        và{' '}
                        <Link to="/privacy" className="text-pink-600 hover:text-pink-700 font-medium">
                          Chính sách bảo mật
                        </Link>
                      </span>
                    </label>
                    {errors.agreeTerms && (
                      <p className="mt-1 text-sm text-red-600">{errors.agreeTerms.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !isValid}
                    className="w-full bg-pink-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <FiLoader className="w-5 h-5 mr-2 animate-spin" />
                        Đang tạo tài khoản...
                      </div>
                    ) : (
                      'Tạo tài khoản'
                    )}
                  </button>
                </form>

                {/* Login Link */}
                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    Đã có tài khoản?{' '}
                    <Link
                      to="/login"
                      state={{ from: location.state?.from }}
                      className="text-pink-600 hover:text-pink-700 font-medium"
                    >
                      Đăng nhập ngay
                    </Link>
                  </p>
                </div>
              </motion.div>

              {/* Benefits */}
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.2 }}
                className="mt-8 bg-white rounded-2xl shadow-sm p-6"
              >
                <h3 className="font-semibold text-gray-900 mb-4">Lợi ích khi đăng ký:</h3>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <FiCheck className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">Theo dõi đơn hàng dễ dàng</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <FiCheck className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">Nhận thông báo ưu đãi đặc biệt</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <FiCheck className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">Tích điểm và đổi quà</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <FiCheck className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">Lưu danh sách yêu thích</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Register;