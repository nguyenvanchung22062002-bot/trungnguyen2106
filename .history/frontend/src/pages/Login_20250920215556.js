import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowLeft,
  FiShield,
  FiHeart,
  FiGift
} from 'react-icons/fi';

// Components
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Loading from '../components/common/Loading';

// Hooks
import { useAuth } from '../contexts/AuthContext';

// Utils
import toast from 'react-hot-toast';
import classNames from 'classnames';

// Validation schema
const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email là bắt buộc')
    .email('Email không hợp lệ'),
  password: yup
    .string()
    .required('Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get redirect path from location state
  const from = location.state?.from?.pathname || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, from]);

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // Focus email input on mount
  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await login(data);
      if (result.success) {
        toast.success('Đăng nhập thành công!');
        navigate(from, { replace: true });
      } else {
        toast.error(result.error || 'Đăng nhập thất bại');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Demo accounts data
  const demoAccounts = [
    {
      email: 'admin@newborngifts.vn',
      password: 'admin123456',
      role: 'Admin',
      description: 'Tài khoản quản trị viên'
    },
    {
      email: 'customer@demo.vn',
      password: 'customer123',
      role: 'Khách hàng',
      description: 'Tài khoản khách hàng demo'
    }
  ];

  // Fill demo account
  const fillDemoAccount = (account) => {
    // Use React Hook Form setValue if available
    const emailInput = document.querySelector('input[name="email"]');
    const passwordInput = document.querySelector('input[name="password"]');
    
    if (emailInput && passwordInput) {
      emailInput.value = account.email;
      passwordInput.value = account.password;
      
      // Trigger change events
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Loading fullScreen text="Đang xử lý..." />
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Đăng nhập - Newborn Gifts Vietnam</title>
        <meta name="description" content="Đăng nhập vào tài khoản Newborn Gifts để mua sắm các sản phẩm cho bé yêu." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12">
          <div className="max-w-6xl w-full mx-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Branding */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="hidden lg:block"
              >
                <div className="text-center space-y-8">
                  {/* Logo & Brand */}
                  <div className="space-y-4">
                    <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto">
                      <span className="text-3xl">🎁</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      Chào mừng trở lại!
                    </h1>
                    <p className="text-lg text-gray-600">
                      Đăng nhập để tiếp tục hành trình mua sắm cho bé yêu
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <FiGift className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900">Set quà đặc biệt</h3>
                        <p className="text-gray-600 text-sm">Sản phẩm chất lượng cao cho bé</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <FiShield className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900">An toàn tuyệt đối</h3>
                        <p className="text-gray-600 text-sm">Cam kết sản phẩm an toàn cho trẻ em</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                        <FiHeart className="w-6 h-6 text-pink-600" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900">Yêu thương trọn vẹn</h3>
                        <p className="text-gray-600 text-sm">Mang niềm vui đến cho bé yêu</p>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Image */}
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80"
                      alt="Happy baby"
                      className="rounded-2xl shadow-soft max-w-sm mx-auto"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-500/20 to-transparent rounded-2xl" />
                  </div>
                </div>
              </motion.div>

              {/* Right Side - Login Form */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="bg-white rounded-3xl shadow-strong p-8 md:p-12">
                  {/* Back Button */}
                  <div className="mb-6">
                    <button
                      onClick={() => navigate(-1)}
                      className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <FiArrowLeft className="w-4 h-4" />
                      <span className="text-sm">Quay lại</span>
                    </button>
                  </div>

                  {/* Header */}
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      Đăng nhập
                    </h2>
                    <p className="text-gray-600">
                      Vui lòng đăng nhập để tiếp tục
                    </p>
                  </div>

                  {/* Login Form */}
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Email Field */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          {...register('email')}
                          type="email"
                          id="email"
                          className={classNames(
                            'input-field pl-10',
                            errors.email && 'border-red-300 focus:ring-red-200 focus:border-red-500'
                          )}
                          placeholder="Nhập email của bạn"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Password Field */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Mật khẩu
                      </label>
                      <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          {...register('password')}
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          className={classNames(
                            'input-field pl-10 pr-10',
                            errors.password && 'border-red-300 focus:ring-red-200 focus:border-red-500'
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
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                      )}
                    </div>

                    {/* Remember & Forgot */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox text-primary-600 focus:ring-primary-500 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-600">Ghi nhớ đăng nhập</span>
                      </label>
                      
                      <Link
                        to="/forgot-password"
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Quên mật khẩu?
                      </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={classNames(
                        'w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 active:scale-95',
                        isSubmitting
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-primary-500 hover:bg-primary-600 shadow-soft hover:shadow-medium'
                      )}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Đang đăng nhập...</span>
                        </div>
                      ) : (
                        'Đăng nhập'
                      )}
                    </button>
                  </form>

                  {/* Demo Accounts */}
                  <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      🧪 Tài khoản demo để trải nghiệm
                    </h3>
                    <div className="space-y-2">
                      {demoAccounts.map((account, index) => (
                        <button
                          key={index}
                          onClick={() => fillDemoAccount(account)}
                          className="w-full text-left p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-primary-300"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{account.role}</p>
                              <p className="text-xs text-gray-500">{account.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-600">{account.email}</p>
                              <p className="text-xs text-gray-500">Click để điền</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">hoặc</span>
                    </div>
                  </div>

                  {/* Social Login */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span>Google</span>
                    </button>
                    
                    <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span>Facebook</span>
                    </button>
                  </div>

                  {/* Sign Up Link */}
                  <div className="text-center">
                    <p className="text-gray-600">
                      Chưa có tài khoản?{' '}
                      <Link
                        to="/register"
                        className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                      >
                        Đăng ký ngay
                      </Link>
                    </p>
                  </div>

                  {/* Terms */}
                  <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                      Bằng việc đăng nhập, bạn đồng ý với{' '}
                      <Link to="/terms" className="text-primary-600 hover:underline">
                        Điều khoản sử dụng
                      </Link>{' '}
                      và{' '}
                      <Link to="/privacy" className="text-primary-600 hover:underline">
                        Chính sách bảo mật
                      </Link>{' '}
                      của chúng tôi.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Login;