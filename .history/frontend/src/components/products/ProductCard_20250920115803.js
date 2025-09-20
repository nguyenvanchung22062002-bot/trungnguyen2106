import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {
  FiShoppingCart,
  FiHeart,
  FiEye,
  FiStar,
  FiTruck,
  FiTag
} from 'react-icons/fi';
import toast from 'react-hot-toast';

// Hooks
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

// Utils
import classNames from 'classnames';

const ProductCard = ({ 
  product, 
  variant = 'default',
  showQuickView = true,
  showWishlist = true,
  className = ''
}) => {
  const { addItem, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Calculate discount percentage
  const discountPercentage = product.discount_price 
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  // Get final price
  const finalPrice = product.discount_price || product.price;

  // Get primary image
  const primaryImage = product.images?.[0]?.image_url || 
                      product.primary_image || 
                      '/images/placeholder-product.jpg';

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Handle add to cart
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng');
      return;
    }

    if (product.stock_quantity === 0) {
      toast.error('Sản phẩm đã hết hàng');
      return;
    }

    setIsAddingToCart(true);
    try {
      const result = await addItem(product, 1);
      if (result.success) {
        toast.success('Đã thêm vào giỏ hàng');
      }
    } catch (error) {
      toast.error('Không thể thêm vào giỏ hàng');
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Handle wishlist (placeholder)
  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success('Đã thêm vào danh sách yêu thích');
  };

  // Handle quick view (placeholder)
  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement quick view modal
    toast('Quick view coming soon!');
  };

  // Card variants
  const cardVariants = {
    default: 'bg-white rounded-2xl shadow-soft hover:shadow-medium border border-gray-100',
    minimal: 'bg-white rounded-xl shadow-soft hover:shadow-medium',
    bordered: 'bg-white rounded-2xl border-2 border-gray-200 hover:border-primary-300',
    elevated: 'bg-white rounded-2xl shadow-medium hover:shadow-strong'
  };

  return (
    <motion.div
      className={classNames(
        'group relative overflow-hidden transition-all duration-300',
        cardVariants[variant],
        'hover:-translate-y-2',
        className
      )}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      layout
    >
      <Link to={`/products/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-t-2xl">
          <LazyLoadImage
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            effect="blur"
            onError={() => setImageError(true)}
            placeholderSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNHB4IiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TG9hZGluZy4uLjwvdGV4dD48L3N2Zz4="
          />
          
          {/* Overlay for hover effects */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discountPercentage > 0 && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                -{discountPercentage}%
              </span>
            )}
            {product.is_featured && (
              <span className="bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                Nổi bật
              </span>
            )}
            {product.stock_quantity === 0 && (
              <span className="bg-gray-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                Hết hàng
              </span>
            )}
            {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
              <span className="bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                Sắp hết
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            {showWishlist && (
              <button
                onClick={handleWishlist}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 hover:text-red-500 transition-colors group/btn"
                title="Thêm vào yêu thích"
              >
                <FiHeart className="w-5 h-5" />
              </button>
            )}
            
            {showQuickView && (
              <button
                onClick={handleQuickView}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-primary-50 hover:text-primary-600 transition-colors"
                title="Xem nhanh"
              >
                <FiEye className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Free shipping badge */}
          {finalPrice >= 500000 && (
            <div className="absolute bottom-3 left-3 bg-green-100 text-green-800 px-2 py-1 rounded-lg text-xs font-medium flex items-center">
              <FiTruck className="w-3 h-3 mr-1" />
              Freeship
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Category & Age Group */}
          <div className="flex items-center justify-between text-xs">
            {product.category_name && (
              <span className="text-gray-500 uppercase tracking-wide">
                {product.category_name}
              </span>
            )}
            {product.age_group && (
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {product.age_group}
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors min-h-[3rem] text-sm leading-tight">
            {product.name}
          </h3>

          {/* Rating */}
          {product.avg_rating > 0 && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    className={classNames(
                      'w-4 h-4',
                      star <= Math.floor(product.avg_rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                ({product.review_count || 0})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-1">
              <span className="text-lg font-bold text-primary-600">
                {formatCurrency(finalPrice)}
              </span>
              {product.discount_price && (
                <span className="text-sm text-gray-400 line-through">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
            
            {/* Stock status */}
            {product.stock_quantity > 0 && product.stock_quantity <= 10 && (
              <span className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded">
                Còn {product.stock_quantity}
              </span>
            )}
          </div>

          {/* Brand */}
          {product.brand && (
            <div className="text-xs text-gray-500 flex items-center">
              <FiTag className="w-3 h-3 mr-1" />
              <span>{product.brand}</span>
            </div>
          )}
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="p-4 pt-0">
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart || loading || product.stock_quantity === 0}
          className={classNames(
            'w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2',
            product.stock_quantity === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-primary-500 hover:bg-primary-600 text-white transform hover:scale-105 active:scale-95 shadow-soft hover:shadow-medium'
          )}
        >
          {isAddingToCart ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <FiShoppingCart className="w-5 h-5" />
              {product.stock_quantity === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
            </>
          )}
        </button>
      </div>

      {/* Hover animation overlay */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-primary-600/10 to-transparent pointer-events-none rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

export default ProductCard;