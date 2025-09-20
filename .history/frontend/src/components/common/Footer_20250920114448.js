import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiFacebook,
  FiInstagram,
  FiYoutube,
  FiTwitter,
  FiArrowUp,
  FiHeart,
} from 'react-icons/fi';

const Footer = () => {
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 py-12">
        <div className="container-custom">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Đăng ký nhận thông tin khuyến mãi
            </h3>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              Nhận thông báo về các sản phẩm mới, ưu đãi đặc biệt và tips chăm sóc bé yêu
            </p>
            
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/20"
                required
              />
              <button
                type="submit"
                className="bg-white text-primary-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  🎁
                </div>
                <div>
                  <h2 className="text-xl font-bold">Newborn Gifts</h2>
                  <p className="text-gray-400 text-sm">Set quà cho bé yêu</p>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm leading-relaxed">
                Chúng tôi chuyên cung cấp các set quà cao cấp dành cho trẻ em từ sơ sinh đến 5 tuổi. 
                Mang đến niềm vui và hạnh phúc cho những thiên thần nhỏ.
              </p>

              {/* Social Links */}
              <div className="flex space-x-4">
                <motion.a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <FiFacebook className="w-5 h-5" />
                </motion.a>
                
                <motion.a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-colors"
                >
                  <FiInstagram className="w-5 h-5" />
                </motion.a>
                
                <motion.a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center hover:bg-red-700 transition-colors"
                >
                  <FiYoutube className="w-5 h-5" />
                </motion.a>
                
                <motion.a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors"
                >
                  <FiTwitter className="w-5 h-5" />
                </motion.a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Liên kết nhanh</h3>
              <ul className="space-y-3">
                {[
                  { name: 'Trang chủ', path: '/' },
                  { name: 'Sản phẩm', path: '/products' },
                  { name: 'Set quà sơ sinh', path: '/category/1' },
                  { name: 'Đồ chơi giáo dục', path: '/category/2' },
                  { name: 'Giới thiệu', path: '/about' },
                  { name: 'Liên hệ', path: '/contact' },
                ].map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-gray-300 hover:text-primary-400 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Support */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Hỗ trợ khách hàng</h3>
              <ul className="space-y-3">
                {[
                  { name: 'Hướng dẫn mua hàng', path: '/guide' },
                  { name: 'Chính sách đổi trả', path: '/return-policy' },
                  { name: 'Chính sách bảo mật', path: '/privacy-policy' },
                  { name: 'Điều khoản sử dụng', path: '/terms' },
                  { name: 'Câu hỏi thường gặp', path: '/faq' },
                  { name: 'Phương thức thanh toán', path: '/payment' },
                ].map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-gray-300 hover:text-primary-400 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Thông tin liên hệ</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FiMapPin className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300 text-sm">
                      123 Đường ABC, Quận XYZ<br />
                      Thành phố Hồ Chí Minh, Việt Nam
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <FiPhone className="w-5 h-5 text-primary-400" />
                  <div>
                    <p className="text-gray-300 text-sm">Hotline: 1900-xxxx</p>
                    <p className="text-gray-400 text-xs">Hỗ trợ 24/7</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <FiMail className="w-5 h-5 text-primary-400" />
                  <div>
                    <p className="text-gray-300 text-sm">support@newborngifts.vn</p>
                    <p className="text-gray-400 text-xs">Email hỗ trợ</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <FiClock className="w-5 h-5 text-primary-400 mt-1" />
                  <div>
                    <p className="text-gray-300 text-sm">
                      Thứ 2 - Chủ nhật<br />
                      8:00 - 22:00
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="border-t border-gray-800 py-8">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🚚</span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">Miễn phí vận chuyển</p>
                <p className="text-gray-400 text-xs">Đơn hàng từ 500K</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">Chất lượng đảm bảo</p>
                <p className="text-gray-400 text-xs">Sản phẩm chính hãng</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔄</span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">Đổi trả dễ dàng</p>
                <p className="text-gray-400 text-xs">Trong vòng 7 ngày</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">Hỗ trợ 24/7</p>
                <p className="text-gray-400 text-xs">Tư vấn nhiệt tình</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="border-t border-gray-800 py-6">
        <div className="container-custom">
          <div className="text-center">
            <h4 className="text-gray-400 text-sm font-medium mb-4">Phương thức thanh toán</h4>
            <div className="flex items-center justify-center space-x-4 flex-wrap">
              <div className="bg-white rounded-lg p-2 m-1">
                <img src="/images/payment/visa.png" alt="Visa" className="h-6" />
              </div>
              <div className="bg-white rounded-lg p-2 m-1">
                <img src="/images/payment/mastercard.png" alt="MasterCard" className="h-6" />
              </div>
              <div className="bg-white rounded-lg p-2 m-1">
                <img src="/images/payment/momo.png" alt="MoMo" className="h-6" />
              </div>
              <div className="bg-white rounded-lg p-2 m-1">
                <img src="/images/payment/zalopay.png" alt="ZaloPay" className="h-6" />
              </div>
              <div className="bg-white rounded-lg p-2 m-1">
                <img src="/images/payment/vnpay.png" alt="VNPay" className="h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © 2024 Newborn Gifts Vietnam. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Giấy phép kinh doanh số: 0123456789 - Sở KH&ĐT TP.HCM cấp
              </p>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>Made with</span>
              <FiHeart className="w-4 h-4 text-red-500" />
              <span>for babies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 w-12 h-12 bg-primary-600 text-white rounded-full shadow-strong flex items-center justify-center hover:bg-primary-700 transition-colors z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <FiArrowUp className="w-6 h-6" />
      </motion.button>
    </footer>
  );
};

export default Footer;