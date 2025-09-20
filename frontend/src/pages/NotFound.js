import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  FiHome,
  FiArrowLeft,
  FiSearch,
  FiShoppingBag,
  FiGift
} from 'react-icons/fi';

// Components
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

// Hooks
import { useProducts } from '../contexts/ProductContext';

const NotFound = () => {
  const navigate = useNavigate();
  const { categories, featuredProducts } = useProducts();
  const [countdown, setCountdown] = useState(10);

  // Auto redirect countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  // Suggested pages
  const suggestions = [
    {
      title: 'Trang chủ',
      description: 'Quay về trang chủ của chúng tôi',
      icon: <FiHome className="w-6 h-6" />,
      link: '/',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Sản phẩm',
      description: 'Xem tất cả sản phẩm có sẵn',
      icon: <FiShoppingBag className="w-6 h-6" />,
      link: '/products',
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Set quà nổi bật',
      description: 'Khám phá các set quà được yêu thích',
      icon: <FiGift className="w-6 h-6" />,
      link: '/products?featured=true',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Trang không tìm thấy - Newborn Gifts</title>
        <meta name="description" content="Trang bạn đang tìm kiếm không tồn tại. Quay về trang chủ hoặc tìm kiếm sản phẩm khác." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12">
          <div className="max-w-2xl mx-auto text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* 404 Animation */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-8"
              >
                <div className="text-8xl md:text-9xl font-bold text-primary-500 mb-4">
                  4
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    className="inline-block"
                  >
                    🎁
                  </motion.span>
                  4
                </div>
              </motion.div>

              {/* Error Message */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-8"
              >
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Oops! Trang không tồn tại
                </h1>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Trang bạn đang tìm kiếm có thể đã được di chuyển, xóa hoặc không bao giờ tồn tại. 
                  Nhưng đừng lo, chúng tôi có rất nhiều món quà tuyệt vời khác dành cho bé!
                </p>
                
                {/* Auto redirect notice */}
                <div className="inline-flex items-center px-4 py-2 bg-primary-50 border border-primary-200 rounded-lg text-primary-700">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 mr-2"
                  >
                    ⏱️
                  </motion.div>
                  <span className="text-sm">
                    Tự động chuyển về trang chủ sau <strong>{countdown}</strong> giây
                  </span>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              >
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  <FiArrowLeft className="w-5 h-5" />
                  <span>Quay lại</span>
                </button>

                <Link
                  to="/"
                  className="inline-flex items-center justify-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                >
                  <FiHome className="w-5 h-5" />
                  <span>Về trang chủ</span>
                </Link>
              </motion.div>

              {/* Suggestions */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Hoặc bạn có thể:
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {suggestions.map((suggestion, index) => (
                    <motion.div
                      key={suggestion.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                    >
                      <Link
                        to={suggestion.link}
                        className="block p-6 bg-white rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 group hover:-translate-y-1"
                      >
                        <div className={`w-12 h-12 ${suggestion.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                          {suggestion.icon}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {suggestion.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {suggestion.description}
                        </p>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Popular Categories */}
              {categories.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="mb-8"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Danh mục phổ biến
                  </h3>
                  <div className="flex flex-wrap justify-center gap-3">
                    {categories.slice(0, 6).map((category) => (
                      <Link
                        key={category.id}
                        to={`/category/${category.id}`}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-full hover:border-primary-300 hover:text-primary-600 transition-colors text-sm"
                      >
                        <span>{category.icon || '🎁'}</span>
                        <span>{category.name}</span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="mb-8"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Hoặc tìm kiếm sản phẩm
                </h3>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const query = e.target.search.value.trim();
                    if (query) {
                      navigate(`/products?search=${encodeURIComponent(query)}`);
                    }
                  }}
                  className="max-w-md mx-auto"
                >
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="search"
                      placeholder="Tìm kiếm sản phẩm..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-primary-200 focus:border-primary-500 transition-all"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Tìm
                    </button>
                  </div>
                </form>
              </motion.div>

              {/* Contact Support */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.6 }}
                className="text-center"
              >
                <p className="text-sm text-gray-500 mb-2">
                  Vẫn không tìm thấy những gì bạn cần?
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="mailto:support@newborngifts.vn"
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
                  >
                    📧 support@newborngifts.vn
                  </a>
                  <a
                    href="tel:1900xxxx"
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
                  >
                    📞 1900-xxxx
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default NotFound;