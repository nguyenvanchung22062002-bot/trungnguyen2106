import React from 'react';
import { motion } from 'framer-motion';
import classNames from 'classnames';

const Loading = ({ 
  fullScreen = false, 
  size = 'medium',
  text = 'Đang tải...',
  showText = true,
  variant = 'default',
  className = ''
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl'
  };

  // Spinner variants
  const SpinnerDefault = ({ size }) => (
    <motion.div
      className={classNames(
        'border-4 border-gray-200 border-t-primary-500 rounded-full',
        sizeClasses[size]
      )}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  );

  const SpinnerDots = ({ size }) => (
    <div className="flex space-x-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={classNames(
            'bg-primary-500 rounded-full',
            size === 'small' ? 'w-2 h-2' :
            size === 'medium' ? 'w-3 h-3' :
            size === 'large' ? 'w-4 h-4' : 'w-5 h-5'
          )}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  );

  const SpinnerPulse = ({ size }) => (
    <motion.div
      className={classNames(
        'bg-primary-500 rounded-full',
        sizeClasses[size]
      )}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.7, 1]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  );

  const SpinnerBounce = ({ size }) => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={classNames(
            'bg-primary-500 rounded-full',
            size === 'small' ? 'w-2 h-2' :
            size === 'medium' ? 'w-3 h-3' :
            size === 'large' ? 'w-4 h-4' : 'w-5 h-5'
          )}
          animate={{
            y: [0, -10, 0]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1
          }}
        />
      ))}
    </div>
  );

  const SpinnerGradient = ({ size }) => (
    <motion.div
      className={classNames(
        'rounded-full bg-gradient-to-r from-primary-500 to-accent-500',
        sizeClasses[size]
      )}
      animate={{ rotate: 360 }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'linear'
      }}
      style={{
        background: 'conic-gradient(from 0deg, #ef4444, #d946ef, #ef4444)'
      }}
    />
  );

  // Gift box loading animation
  const GiftBoxLoader = ({ size }) => (
    <div className="relative">
      <motion.div
        className={classNames(
          'text-primary-500',
          size === 'small' ? 'text-2xl' :
          size === 'medium' ? 'text-4xl' :
          size === 'large' ? 'text-6xl' : 'text-8xl'
        )}
        animate={{
          rotateY: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        🎁
      </motion.div>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity
        }}
      >
        <div className="w-full h-full border-2 border-primary-200 rounded-lg animate-pulse" />
      </motion.div>
    </div>
  );

  // Select spinner based on variant
  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return <SpinnerDots size={size} />;
      case 'pulse':
        return <SpinnerPulse size={size} />;
      case 'bounce':
        return <SpinnerBounce size={size} />;
      case 'gradient':
        return <SpinnerGradient size={size} />;
      case 'gift':
        return <GiftBoxLoader size={size} />;
      default:
        return <SpinnerDefault size={size} />;
    }
  };

  // Skeleton loading component
  if (variant === 'skeleton') {
    return (
      <div className={classNames('animate-pulse space-y-4', className)}>
        <div className="flex space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  const content = (
    <div className={classNames(
      'flex flex-col items-center justify-center',
      className
    )}>
      {renderSpinner()}
      {showText && (
        <motion.p
          className={classNames(
            'text-gray-600 font-medium mt-4',
            textSizeClasses[size]
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <div className="text-center">
          {content}
        </div>
      </motion.div>
    );
  }

  return content;
};

// Product card loading skeleton
export const ProductCardSkeleton = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden animate-pulse">
          <div className="aspect-square bg-gray-200"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="flex items-center justify-between">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </>
  );
};

// Page loading skeleton
export const PageSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="h-16 bg-gray-200 mb-6"></div>
      
      {/* Content skeleton */}
      <div className="container-custom space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProductCardSkeleton count={8} />
        </div>
      </div>
    </div>
  );
};

// Button loading state
export const ButtonLoading = ({ children, loading, ...props }) => {
  return (
    <button {...props} disabled={loading}>
      <div className="flex items-center justify-center">
        {loading && (
          <Loading 
            size="small" 
            variant="default" 
            showText={false} 
            className="mr-2"
          />
        )}
        {children}
      </div>
    </button>
  );
};

export default Loading;