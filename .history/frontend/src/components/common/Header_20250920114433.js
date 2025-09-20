import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiHeart,
  FiPhone,
  FiMail,
  FiMapPin,
  FiChevronDown,
  FiLogOut,
  FiPackage,
  FiSettings,
} from 'react-icons/fi';

// Hooks & Context
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useProducts } from '../../contexts/ProductContext';

// Components
import SearchModal from './SearchModal';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Contexts
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const { categories, searchProducts } = useProducts();

  // Local state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  // Refs
  const userMenuRef = useRef(null);
  const categoriesRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setIsCategoriesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchProducts(searchQuery.trim());
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary-600 text-white py-2 text-sm">
        <div className="container-custom">
          <div className="flex items-center justify-between">
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <FiPhone className="w-4 h-4" />
                <span>Hotline: 1900-xxxx</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiMail className="w-4 h-4" />
                <span>support@newborngifts.vn</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-xs md:text-sm">
              <div className="flex items-center space-x-2">
                <FiMapPin className="w-4 h-4" />
                <span>Miễn phí vận chuyển đơn hàng từ 500.000đ</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header 
        className={`sticky top-0 bg-white z-50 transition-all duration-300 ${
          isScrolled ? 'shadow-medium' : 'shadow-soft'
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform">
                🎁
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-800 group-hover:text-primary-600 transition-colors">
                  Newborn Gifts
                </h1>
                <p className="text-xs text-gray-500">Set quà cho bé yêu</p>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative w-full group">
                <input
                  type="text"
                  placeholder="Tìm kiếm set quà cho bé..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-4 focus:ring-primary-200 focus:border-primary-500 transition-all duration-200 group-hover:border-primary-300"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-4 bg-primary-500 text-white rounded-r-lg hover:bg-primary-600 transition-colors flex items-center justify-center"
                >
                  <FiSearch className="w-5 h-5" />
                </button>
              </form>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Mobile Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="lg:hidden btn-icon text-gray-600 hover:text-primary-500"
              >
                <FiSearch className="w-6 h-6" />
              </button>

              {/* Wishlist */}
              <button className="btn-icon text-gray-600 hover:text-primary-500 hidden md:flex">
                <FiHeart className="w-6 h-6" />
              </button>

              {/* Cart */}
              <Link 
                to="/cart"
                className="btn-icon text-gray-600 hover:text-primary-500 relative"
              >
                <FiShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium"
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </motion.span>
                )}
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-primary-500 transition-colors p-2 rounded-lg hover:bg-gray-50"
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.full_name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <FiUser className="w-5 h-5 text-primary-600" />
                      )}
                    </div>
                    <span className="hidden md:block font-medium text-sm">
                      {user?.full_name}
                    </span>
                    <FiChevronDown className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-strong border border-gray-100 py-2 z-50"
                      >
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FiUser className="w-4 h-4 mr-3" />
                          Tài khoản
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FiPackage className="w-4 h-4 mr-3" />
                          Đơn hàng
                        </Link>
                        <Link
                          to="/profile/settings"
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FiSettings className="w-4 h-4 mr-3" />
                          Cài đặt
                        </Link>
                        <hr className="my-2" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <FiLogOut className="w-4 h-4 mr-3" />
                          Đăng xuất
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-primary-500 font-medium text-sm transition-colors"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary text-sm py-2 px-4"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden btn-icon text-gray-600 hover:text-primary-500"
              >
                {isMobileMenuOpen ? (
                  <FiX className="w-6 h-6" />
                ) : (
                  <FiMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="border-t border-gray-100">
          <div className="container-custom">
            <div className="hidden md:flex items-center py-3 space-x-8">
              <Link
                to="/"
                className={`font-medium transition-colors hover:text-primary-600 ${
                  location.pathname === '/' ? 'text-primary-600' : 'text-gray-700'
                }`}
              >
                Trang chủ
              </Link>
              
              <div className="relative" ref={categoriesRef}>
                <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="flex items-center space-x-1 font-medium text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <span>Danh mục</span>
                  <FiChevronDown className="w-4 h-4" />
                </button>

                <AnimatePresence>
                  {isCategoriesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-strong border border-gray-100 py-2 z-50"
                    >
                      {categories.slice(0, 6).map((category) => (
                        <Link
                          key={category.id}
                          to={`/category/${category.id}`}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                          onClick={() => setIsCategoriesOpen(false)}
                        >
                          <span className="mr-3 text-lg">
                            {category.icon || '🎁'}
                          </span>
                          {category.name}
                        </Link>
                      ))}
                      <hr className="my-2" />
                      <Link
                        to="/products"
                        className="flex items-center px-4 py-2 text-primary-600 hover:bg-primary-50 transition-colors font-medium"
                        onClick={() => setIsCategoriesOpen(false)}
                      >
                        Xem tất cả sản phẩm
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/products"
                className={`font-medium transition-colors hover:text-primary-600 ${
                  location.pathname === '/products' ? 'text-primary-600' : 'text-gray-700'
                }`}
              >
                Sản phẩm
              </Link>
              
              <Link
                to="/about"
                className={`font-medium transition-colors hover:text-primary-600 ${
                  location.pathname === '/about' ? 'text-primary-600' : 'text-gray-700'
                }`}
              >
                Giới thiệu
              </Link>
              
              <Link
                to="/contact"
                className="font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                Liên hệ
              </Link>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white border-t border-gray-100"
            >
              <div className="container-custom py-4 space-y-4">
                {/* Auth Links for Mobile */}
                {!isAuthenticated && (
                  <div className="flex space-x-4 pb-4 border-b border-gray-100">
                    <Link
                      to="/login"
                      className="btn-secondary flex-1 text-center text-sm py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      to="/register"
                      className="btn-primary flex-1 text-center text-sm py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Đăng ký
                    </Link>
                  </div>
                )}

                {/* Navigation Links */}
                <div className="space-y-2">
                  <Link
                    to="/"
                    className={`block py-3 px-4 rounded-lg font-medium transition-colors ${
                      location.pathname === '/' 
                        ? 'bg-primary-50 text-primary-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Trang chủ
                  </Link>
                  
                  <Link
                    to="/products"
                    className={`block py-3 px-4 rounded-lg font-medium transition-colors ${
                      location.pathname === '/products' 
                        ? 'bg-primary-50 text-primary-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sản phẩm
                  </Link>

                  {/* Categories for Mobile */}
                  <div className="py-2">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide px-4 mb-2">
                      Danh mục
                    </h3>
                    <div className="space-y-1">
                      {categories.slice(0, 4).map((category) => (
                        <Link
                          key={category.id}
                          to={`/category/${category.id}`}
                          className="flex items-center py-2 px-4 text-gray-600 hover:bg-gray-50 hover:text-primary-600 transition-colors rounded-lg ml-4"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="mr-3 text-lg">
                            {category.icon || '🎁'}
                          </span>
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <Link
                    to="/about"
                    className={`block py-3 px-4 rounded-lg font-medium transition-colors ${
                      location.pathname === '/about' 
                        ? 'bg-primary-50 text-primary-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Giới thiệu
                  </Link>
                  
                  <Link
                    to="/contact"
                    className="block py-3 px-4 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Liên hệ
                  </Link>
                </div>

                {/* User Menu for Mobile */}
                {isAuthenticated && (
                  <div className="pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex items-center space-x-3 px-4 py-2">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        {user?.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt={user.full_name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <FiUser className="w-5 h-5 text-primary-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user?.full_name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center py-2 px-4 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FiUser className="w-5 h-5 mr-3" />
                      Tài khoản
                    </Link>
                    
                    <Link
                      to="/orders"
                      className="flex items-center py-2 px-4 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FiPackage className="w-5 h-5 mr-3" />
                      Đơn hàng
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full py-2 px-4 text-red-600 hover:bg-red-50 transition-colors rounded-lg"
                    >
                      <FiLogOut className="w-5 h-5 mr-3" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
};

export default Header;