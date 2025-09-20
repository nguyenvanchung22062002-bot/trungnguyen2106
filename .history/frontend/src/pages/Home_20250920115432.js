import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// Components
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ProductCard from '../components/products/ProductCard';
import Loading, { ProductCardSkeleton } from '../components/common/Loading';

// Hooks
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';

// Icons
import {
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiHeadphones,
  FiStar,
  FiArrowRight,
  FiGift,
  FiHeart,
  FiAward,
  FiUsers
} from 'react-icons/fi';

const Home = () => {
  const { featuredProducts, categories, loading } = useProducts();
  const { user } = useAuth();
  const [activeSlide, setActiveSlide] = useState(0);

  // Hero slides data
  const heroSlides = [
    {
      id: 1,
      title: 'Set Quà Sơ Sinh Cao Cấp',
      subtitle: 'Chào đón thiên thần nhỏ với những món quà ý nghĩa nhất',
      description: 'Bộ sưu tập set quà sơ sinh được tuyển chọn kỹ lưỡng, an toàn tuyệt đối cho bé',
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1200&q=80',
      cta: 'Khám phá ngay',
      ctaLink: '/category/1',
      gradient: 'from-pink-500/80 to-purple-600/80'
    },
    {
      id: 2,
      title: 'Đồ Chơi Giáo Dục Thông Minh',
      subtitle: 'Phát triển trí tuệ và sáng tạo cho bé yêu',
      description: 'Hệ thống đồ chơi giáo dục giúp bé học hỏi qua vui chơi một cách hiệu quả nhất',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
      cta: 'Xem sản phẩm',
      ctaLink: '/category/2',
      gradient: 'from-blue-500/80 to-cyan-600/80'
    },
    {
      id: 3,
      title: 'Set Quà Sinh Nhật Đặc Biệt',
      subtitle: 'Tạo nên những kỷ niệm không thể quên',
      description: 'Biến ngày sinh nhật của bé thành một ngày đặc biệt với những món quà ý nghĩa',
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=80',
      cta: 'Đặt hàng ngay',
      ctaLink: '/category/3',
      gradient: 'from-orange-500/80 to-red-600/80'
    }
  ];

  // Age groups data
  const ageGroups = [
    {
      id: 1,
      name: '0-6 tháng',
      title: 'Sơ sinh',
      description: 'Set quà cho bé sơ sinh',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80',
      icon: '👶',
      link: '/products?age_group=0-6 tháng',
      color: 'from-pink-400 to-pink-600'
    },
    {
      id: 2,
      name: '6-12 tháng',
      title: 'Tập bò',
      description: 'Đồ chơi phát triển vận động',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&q=80',
      icon: '🧸',
      link: '/products?age_group=6-12 tháng',
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 3,
      name: '1-3 tuổi',
      title: 'Tập đi',
      description: 'Học tập và khám phá',
      image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&q=80',
      icon: '🚀',
      link: '/products?age_group=1-3 tuổi',
      color: 'from-green-400 to-green-600'
    },
    {
      id: 4,
      name: '3-5 tuổi',
      title: 'Mẫu giáo',
      description: 'Sáng tạo và tư duy',
      image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&q=80',
      icon: '🎨',
      link: '/products?age_group=3-5 tuổi',
      color: 'from-purple-400 to-purple-600'
    }
  ];

  // Features data
  const features = [
    {
      icon: <FiTruck className="w-8 h-8" />,
      title: 'Miễn phí vận chuyển',
      description: 'Đơn hàng từ 500.000đ',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: <FiShield className="w-8 h-8" />,
      title: 'Chất lượng đảm bảo',
      description: 'Sản phẩm chính hãng 100%',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: <FiRefreshCw className="w-8 h-8" />,
      title: 'Đổi trả dễ dàng',
      description: 'Trong vòng 7 ngày',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: <FiHeadphones className="w-8 h-8" />,
      title: 'Hỗ trợ 24/7',
      description: 'Tư vấn nhiệt tình',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  // Statistics data
  const stats = [
    {
      number: '10,000+',
      label: 'Khách hàng hài lòng',
      icon: <FiUsers className="w-8 h-8" />
    },
    {
      number: '5,000+',
      label: 'Sản phẩm chất lượng',
      icon: <FiGift className="w-8 h-8" />
    },
    {
      number: '4.9/5',
      label: 'Đánh giá trung bình',
      icon: <FiStar className="w-8 h-8" />
    },
    {
      number: '99%',
      label: 'Tỷ lệ hài lòng',
      icon: <FiAward className="w-8 h-8" />
    }
  ];

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Newborn Gifts Vietnam - Set Quà Cao Cấp Cho Bé Yêu</title>
        <meta name="description" content="Khám phá bộ sưu tập set quà độc đáo dành riêng cho trẻ em từ sơ sinh đến 5 tuổi. Chất lượng cao, an toàn, giá tốt nhất thị trường." />
        <meta name="keywords" content="set quà trẻ em, đồ chơi sơ sinh, quà sinh nhật, đồ chơi giáo dục, newborn gifts" />
        <link rel="canonical" href="https://newborngifts.vn" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Header />
        
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectFade]}
            effect="fade"
            navigation={{
              nextEl: '.hero-swiper-button-next',
              prevEl: '.hero-swiper-button-prev',
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={true}
            onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
            className="h-[500px] md:h-[600px] lg:h-[700px]"
          >
            {heroSlides.map((slide, index) => (
              <SwiperSlide key={slide.id}>
                <div className="relative h-full">
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${slide.image})` }}
                  />
                  
                  {/* Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
                  
                  {/* Content */}
                  <div className="relative h-full flex items-center">
                    <div className="container-custom">
                      <div className="max-w-3xl text-white">
                        <motion.div
                          initial={{ opacity: 0, x: -100 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                        >
                          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                            {slide.title}
                          </h1>
                          <h2 className="text-lg md:text-xl lg:text-2xl mb-6 text-white/90">
                            {slide.subtitle}
                          </h2>
                          <p className="text-sm text-gray-600 mb-2">{group.name}</p>
                        <p className="text-gray-500 text-sm">{group.description}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <motion.div {...fadeInUp} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Sản phẩm nổi bật
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Những set quà được yêu thích nhất tại Newborn Gifts
              </p>
            </motion.div>

            {loading.featured ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <ProductCardSkeleton count={8} />
              </div>
            ) : featuredProducts?.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                {...staggerChildren}
              >
                {featuredProducts.slice(0, 8).map((product, index) => (
                  <motion.div
                    key={product.id}
                    {...fadeInUp}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎁</div>
                <p className="text-gray-600">Đang cập nhật sản phẩm mới...</p>
              </div>
            )}

            <motion.div {...fadeInUp} className="text-center">
              <Link
                to="/products"
                className="btn-primary inline-flex items-center px-8 py-4 text-lg"
              >
                Xem tất cả sản phẩm
                <FiArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="section-padding">
          <div className="container-custom">
            <motion.div {...fadeInUp} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Danh mục sản phẩm
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Khám phá các danh mục sản phẩm đa dạng của chúng tôi
              </p>
            </motion.div>

            {categories?.length > 0 ? (
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
                {...staggerChildren}
              >
                {categories.slice(0, 6).map((category, index) => (
                  <motion.div
                    key={category.id}
                    {...fadeInUp}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={`/category/${category.id}`}
                      className="group block p-6 bg-white rounded-2xl hover:bg-gradient-to-br hover:from-primary-50 hover:to-accent-50 transition-all duration-300 text-center hover:shadow-medium hover:-translate-y-1"
                    >
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:bg-white group-hover:shadow-soft">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-8 h-8 object-contain"
                          />
                        ) : (
                          <span className="text-2xl">{category.icon || '🎁'}</span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-gray-700 group-hover:text-primary-600 transition-colors">
                        {category.name}
                      </h3>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="p-6 bg-white rounded-2xl">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-2xl"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Statistics Section */}
        <section className="section-padding bg-gradient-to-r from-primary-600 to-accent-600">
          <div className="container-custom">
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
              {...staggerChildren}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  {...fadeInUp}
                  transition={{ delay: index * 0.2 }}
                  className="text-center text-white"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-primary-100">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <motion.div {...fadeInUp} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Khách hàng nói gì về chúng tôi
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Những phản hồi tích cực từ các bậc phụ huynh
              </p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              {...staggerChildren}
            >
              {[
                {
                  name: 'Chị Minh Anh',
                  location: 'Hà Nội',
                  rating: 5,
                  comment: 'Set quà cho bé rất đẹp và chất lượng. Bé nhà mình rất thích. Sẽ ủng hộ shop lâu dài.',
                  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&q=80'
                },
                {
                  name: 'Anh Tuấn Việt',
                  location: 'TP.HCM',
                  rating: 5,
                  comment: 'Dịch vụ tuyệt vời, giao hàng nhanh. Sản phẩm đúng như mô tả, con rất thích chơi.',
                  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80'
                },
                {
                  name: 'Chị Thu Hà',
                  location: 'Đà Nẵng',
                  rating: 5,
                  comment: 'Lần đầu mua ở shop, chất lượng vượt mong đợi. Bao bì đẹp, phù hợp làm quà tặng.',
                  avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80'
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  {...fadeInUp}
                  transition={{ delay: index * 0.2 }}
                  className="bg-gray-50 rounded-2xl p-6 hover:shadow-medium transition-all duration-300"
                >
                  {/* Rating */}
                  <div className="flex mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-gray-700 mb-6 italic">
                    "{testimonial.comment}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.location}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="section-padding">
          <div className="container-custom">
            <motion.div 
              {...fadeInUp}
              className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-3xl p-8 md:p-12 text-center text-white"
            >
              <div className="max-w-2xl mx-auto">
                <div className="text-4xl mb-6">📧</div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Đăng ký nhận tin tức mới nhất
                </h2>
                <p className="text-primary-100 mb-8 text-lg">
                  Nhận thông báo về sản phẩm mới, ưu đãi đặc biệt và những mẹo chăm sóc bé hữu ích
                </p>
                
                <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    className="flex-1 px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/20"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-white text-primary-600 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors whitespace-nowrap"
                  >
                    Đăng ký ngay
                  </button>
                </form>
                
                <p className="text-primary-200 text-sm mt-4">
                  * Chúng tôi cam kết không spam và bảo vệ thông tin cá nhân của bạn
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Home;base md:text-lg mb-8 text-white/80 max-w-2xl leading-relaxed">
                            {slide.description}
                          </p>
                          
                          <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                              to={slide.ctaLink}
                              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 group"
                            >
                              {slide.cta}
                              <FiArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            
                            <Link
                              to="/about"
                              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-300"
                            >
                              Tìm hiểu thêm
                            </Link>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
            
            {/* Navigation */}
            <div className="hero-swiper-button-prev absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors cursor-pointer z-10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            
            <div className="hero-swiper-button-next absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors cursor-pointer z-10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Swiper>
        </section>

        {/* Features Section */}
        <section className="py-12 -mt-16 relative z-10">
          <div className="container-custom">
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
              {...staggerChildren}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  {...fadeInUp}
                  className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 text-center group hover:-translate-y-2"
                >
                  <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Welcome Section */}
        {user && (
          <section className="py-8">
            <div className="container-custom">
              <motion.div 
                {...fadeInUp}
                className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-6 md:p-8 text-white text-center"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  Chào mừng {user.full_name}! 👋
                </h2>
                <p className="text-primary-100 mb-6">
                  Khám phá những món quà tuyệt vời dành riêng cho bé yêu của bạn
                </p>
                <Link
                  to="/products"
                  className="inline-flex items-center px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Bắt đầu mua sắm
                  <FiArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </section>
        )}

        {/* Age Groups Section */}
        <section className="section-padding">
          <div className="container-custom">
            <motion.div {...fadeInUp} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Chọn theo độ tuổi
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Tìm những món quà phù hợp với từng giai đoạn phát triển của bé yêu
              </p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-2 lg:grid-cols-4 gap-6"
              {...staggerChildren}
            >
              {ageGroups.map((group, index) => (
                <motion.div
                  key={group.id}
                  {...fadeInUp}
                  className="group cursor-pointer"
                >
                  <Link to={group.link}>
                    <div className="relative overflow-hidden rounded-2xl bg-white shadow-soft hover:shadow-strong transition-all duration-500 group-hover:-translate-y-2">
                      {/* Image */}
                      <div className="aspect-square overflow-hidden relative">
                        <img
                          src={group.image}
                          alt={group.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${group.color} opacity-60 group-hover:opacity-70 transition-opacity`} />
                        
                        {/* Icon */}
                        <div className="absolute top-4 right-4 text-4xl">
                          {group.icon}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6 text-center">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {group.title}
                        </h3>
                        <p className="text-