// frontend/src/pages/ProductDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import {
  FiHeart,
  FiShare2,
  FiMinus,
  FiPlus,
  FiShoppingCart,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiInfo
} from 'react-icons/fi';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

// Components
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ProductCard from '../components/products/ProductCard';
import Loading from '../components/common/Loading';

// Hooks
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductContext';

// Services
import { productService } from '../services/productService';

// Utils
import { formatCurrency } from '../utils/helpers';
import classNames from 'classnames';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { getRelatedProducts } = useProducts();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [selectedTab, setSelectedTab] = useState('description');

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await productService.getById(id);
        setProduct(response.data.product);
        
        // Fetch related products
        if (response.data.product.category_id) {
          const relatedResponse = await getRelatedProducts(response.data.product.category_id, id);
          setRelatedProducts(relatedResponse);
        }
        
        // Check if product is in wishlist
        if (user) {
          // TODO: Check wishlist status
        }
        
      } catch (err) {
        setError(err.response?.data?.message || 'Không thể tải thông tin sản phẩm');
        if (err.response?.status === 404) {
          navigate('/404');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, user, navigate]);

  // Handle quantity change
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock_quantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart(product, quantity);
    // Show success message
    // TODO: Show toast notification
  };

  // Handle buy now
  const handleBuyNow = () => {
    if (!product) return;
    
    addToCart(product, quantity);
    navigate('/checkout');
  };

  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // TODO: Toggle wishlist
    setIsWishlisted(!isWishlisted);
  };

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Calculate discount percentage
  const discountPercent = product?.discount_price 
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  // Get current price
  const currentPrice = product?.discount_price || product?.price || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <Loading />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 lg:px-8 py-16 text-center">
          <div className="text-6xl mb-6">😞</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Không tìm thấy sản phẩm'}
          </h1>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition-colors"
          >
            Xem tất cả sản phẩm
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product.name} - Newborn Gifts</title>
        <meta name="description" content={product.description} />
        <meta name="keywords" content={`${product.name}, ${product.category_name}, set quà trẻ em`} />
        <link rel="canonical" href={`https://newborngifts.vn/product/${product.id}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.images?.[0] || '/default-product.jpg'} />
        <meta property="og:type" content="product" />
        <meta property="og:price:amount" content={currentPrice} />
        <meta property="og:price:currency" content="VND" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Header />

        {/* Breadcrumb */}
        <section className="bg-white border-b">
          <div className="container mx-auto px-4 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm">
              <Link to="/" className="text-gray-500 hover:text-pink-600 transition-colors">
                Trang chủ
              </Link>
              <span className="text-gray-400">/</span>
              <Link to="/products" className="text-gray-500 hover:text-pink-600 transition-colors">
                Sản phẩm
              </Link>
              {product.category_name && (
                <>
                  <span className="text-gray-400">/</span>
                  <Link 
                    to={`/category/${product.category_id}`}
                    className="text-gray-500 hover:text-pink-600 transition-colors"
                  >
                    {product.category_name}
                  </Link>
                </>
              )}
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium truncate">
                {product.name}
              </span>
            </nav>
          </div>
        </section>

        {/* Product Detail */}
        <section className="py-8">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              {/* Product Images */}
              <div className="space-y-4">
                {/* Main Image Slider */}
                <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
                  {product.images && product.images.length > 0 ? (
                    <Swiper
                      modules={[Navigation, Pagination, Thumbs]}
                      thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                      navigation={{
                        prevEl: '.product-prev',
                        nextEl: '.product-next'
                      }}
                      pagination={{ clickable: true }}
                      onSlideChange={(swiper) => setActiveImageIndex(swiper.activeIndex)}
                      className="h-full"
                    >
                      {product.images.map((image, index) => (
                        <SwiperSlide key={index}>
                          <img
                            src={image}
                            alt={`${product.name} - ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </SwiperSlide>
                      ))}
                      
                      {/* Navigation */}
                      <button className="product-prev absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-colors z-10">
                        <FiChevronLeft className="w-5 h-5" />
                      </button>
                      <button className="product-next absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-colors z-10">
                        <FiChevronRight className="w-5 h-5" />
                      </button>
                    </Swiper>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <div className="text-gray-400 text-center">
                        <div className="text-4xl mb-2">📦</div>
                        <p>Không có hình ảnh</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Discount Badge */}
                  {discountPercent > 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      -{discountPercent}%
                    </div>
                  )}
                </div>

                {/* Thumbnail Images */}
                {product.images && product.images.length > 1 && (
                  <Swiper
                    modules={[Navigation, Thumbs]}
                    onSwiper={setThumbsSwiper}
                    slidesPerView={4}
                    spaceBetween={10}
                    breakpoints={{
                      640: { slidesPerView: 5 },
                      1024: { slidesPerView: 4 }
                    }}
                    className="thumbs-swiper"
                  >
                    {product.images.map((image, index) => (
                      <SwiperSlide key={index}>
                        <div className={classNames(
                          'aspect-square bg-white rounded-lg overflow-hidden cursor-pointer border-2 transition-colors',
                          activeImageIndex === index ? 'border-pink-500' : 'border-gray-200 hover:border-gray-300'
                        )}>
                          <img
                            src={image}
                            alt={`${product.name} thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  {/* Category */}
                  {product.category_name && (
                    <Link
                      to={`/category/${product.category_id}`}
                      className="inline-block text-sm text-pink-600 hover:text-pink-700 font-medium mb-2"
                    >
                      {product.category_name}
                    </Link>
                  )}
                  
                  {/* Product Name */}
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                    {product.name}
                  </h1>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FiStar
                          key={i}
                          className={classNames(
                            'w-5 h-5',
                            i < Math.floor(product.avg_rating || 4.8)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({product.review_count || 128} đánh giá)
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="border-b pb-6">
                  <div className="flex items-center space-x-4 mb-2">
                    <span className="text-3xl font-bold text-pink-600">
                      {formatCurrency(currentPrice)}
                    </span>
                    {product.discount_price && (
                      <span className="text-xl text-gray-400 line-through">
                        {formatCurrency(product.price)}
                      </span>
                    )}
                  </div>
                  {discountPercent > 0 && (
                    <p className="text-sm text-green-600 font-medium">
                      Tiết kiệm {formatCurrency(product.price - product.discount_price)}
                    </p>
                  )}
                </div>

                {/* Stock Status */}
                <div className="flex items-center space-x-2">
                  {product.stock_quantity > 0 ? (
                    <>
                      <FiCheck className="w-5 h-5 text-green-500" />
                      <span className="text-green-600 font-medium">
                        Còn hàng ({product.stock_quantity} sản phẩm)
                      </span>
                    </>
                  ) : (
                    <>
                      <FiInfo className="w-5 h-5 text-red-500" />
                      <span className="text-red-600 font-medium">Hết hàng</span>
                    </>
                  )}
                </div>

                {/* Age Range */}
                {product.age_range && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">👶</span>
                      <div>
                        <p className="font-medium text-blue-900">Độ tuổi phù hợp</p>
                        <p className="text-blue-700">{product.age_range}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quantity and Actions */}
                {product.stock_quantity > 0 && (
                  <div className="space-y-4 border-b pb-6">
                    {/* Quantity Selector */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số lượng:
                      </label>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleQuantityChange(quantity - 1)}
                          disabled={quantity <= 1}
                          className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FiMinus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                          className="w-20 h-10 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          min="1"
                          max={product.stock_quantity}
                        />
                        <button
                          onClick={() => handleQuantityChange(quantity + 1)}
                          disabled={quantity >= product.stock_quantity}
                          className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FiPlus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                      <button
                        onClick={handleAddToCart}
                        className="flex-1 bg-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-pink-600 transition-colors flex items-center justify-center"
                      >
                        <FiShoppingCart className="w-5 h-5 mr-2" />
                        Thêm vào giỏ hàng
                      </button>
                      <button
                        onClick={handleBuyNow}
                        className="flex-1 bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                      >
                        Mua ngay
                      </button>
                    </div>
                  </div>
                )}

                {/* Secondary Actions */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleWishlistToggle}
                    className={classNames(
                      'flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors',
                      isWishlisted
                        ? 'border-pink-500 text-pink-600 bg-pink-50'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <FiHeart className={classNames('w-4 h-4', isWishlisted && 'fill-current')} />
                    <span className="text-sm">
                      {isWishlisted ? 'Đã yêu thích' : 'Yêu thích'}
                    </span>
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FiShare2 className="w-4 h-4" />
                    <span className="text-sm">Chia sẻ</span>
                  </button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <FiTruck className="w-5 h-5 text-green-600" />
                    <div className="text-xs">
                      <p className="font-medium text-gray-900">Miễn phí ship</p>
                      <p className="text-gray-600">Đơn từ 500k</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <FiShield className="w-5 h-5 text-blue-600" />
                    <div className="text-xs">
                      <p className="font-medium text-gray-900">Chính hãng</p>
                      <p className="text-gray-600">100% authentic</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <FiRefreshCw className="w-5 h-5 text-orange-600" />
                    <div className="text-xs">
                      <p className="font-medium text-gray-900">Đổi trả</p>
                      <p className="text-gray-600">Trong 7 ngày</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border p-8 mb-16">
              {/* Tab Headers */}
              <div className="border-b border-gray-200 mb-8">
                <nav className="flex space-x-8">
                  {[
                    { id: 'description', label: 'Mô tả sản phẩm' },
                    { id: 'specifications', label: 'Thông số kỹ thuật' },
                    { id: 'reviews', label: 'Đánh giá' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTab(tab.id)}
                      className={classNames(
                        'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                        selectedTab === tab.id
                          ? 'border-pink-500 text-pink-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="prose prose-gray max-w-none">
                {selectedTab === 'description' && (
                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}
                
                {selectedTab === 'specifications' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Thông tin cơ bản</h4>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Danh mục:</dt>
                          <dd className="font-medium">{product.category_name}</dd>
                        </div>
                        {product.age_range && (
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Độ tuổi:</dt>
                            <dd className="font-medium">{product.age_range}</dd>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Tồn kho:</dt>
                          <dd className="font-medium">{product.stock_quantity} sản phẩm</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                )}
                
                {selectedTab === 'reviews' && (
                  <div>
                    <p className="text-gray-600">Tính năng đánh giá đang được phát triển...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Related Products */}
            {relatedProducts && relatedProducts.length > 0 && (
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                  Sản phẩm liên quan
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.slice(0, 4).map((relatedProduct) => (
                    <ProductCard key={relatedProduct.id} product={relatedProduct} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ProductDetail;