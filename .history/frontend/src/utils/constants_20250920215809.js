// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// App Information
export const APP_NAME = 'Newborn Gifts Vietnam';
export const APP_DESCRIPTION = 'Chuyên cung cấp set quà cao cấp cho trẻ em từ sơ sinh đến 5 tuổi';
export const APP_VERSION = '1.0.0';

// Contact Information
export const CONTACT_INFO = {
  phone: '1900-xxxx',
  email: 'support@newborngifts.vn',
  address: '123 Đường ABC, Quận XYZ, TP.HCM',
  website: 'https://newborngifts.vn'
};

// Social Media Links
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/newborngiftsvn',
  instagram: 'https://instagram.com/newborngiftsvn',
  youtube: 'https://youtube.com/newborngiftsvn',
  twitter: 'https://twitter.com/newborngiftsvn'
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer'
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPING: 'shipping',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Chờ xác nhận',
  [ORDER_STATUS.CONFIRMED]: 'Đã xác nhận',
  [ORDER_STATUS.PROCESSING]: 'Đang xử lý',
  [ORDER_STATUS.SHIPPING]: 'Đang giao hàng',
  [ORDER_STATUS.DELIVERED]: 'Đã giao hàng',
  [ORDER_STATUS.CANCELLED]: 'Đã hủy'
};

export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [ORDER_STATUS.CONFIRMED]: 'bg-blue-100 text-blue-800',
  [ORDER_STATUS.PROCESSING]: 'bg-indigo-100 text-indigo-800',
  [ORDER_STATUS.SHIPPING]: 'bg-purple-100 text-purple-800',
  [ORDER_STATUS.DELIVERED]: 'bg-green-100 text-green-800',
  [ORDER_STATUS.CANCELLED]: 'bg-red-100 text-red-800'
};

// Payment Methods
export const PAYMENT_METHODS = {
  COD: 'cod',
  BANK_TRANSFER: 'bank_transfer',
  MOMO: 'momo',
  ZALOPAY: 'zalopay',
  VNPAY: 'vnpay'
};

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.COD]: 'Thanh toán khi nhận hàng',
  [PAYMENT_METHODS.BANK_TRANSFER]: 'Chuyển khoản ngân hàng',
  [PAYMENT_METHODS.MOMO]: 'Ví MoMo',
  [PAYMENT_METHODS.ZALOPAY]: 'ZaloPay',
  [PAYMENT_METHODS.VNPAY]: 'VNPay'
};

// Product Categories
export const PRODUCT_CATEGORIES = {
  NEWBORN: 'newborn',
  TOYS: 'toys',
  CLOTHING: 'clothing',
  FEEDING: 'feeding',
  BATH: 'bath',
  BOOKS: 'books'
};

// Age Groups
export const AGE_GROUPS = [
  '0-6 tháng',
  '6-12 tháng',
  '1-2 tuổi',
  '2-3 tuổi',
  '3-5 tuổi',
  '5+ tuổi'
];

// Sort Options
export const SORT_OPTIONS = [
  { value: 'created_at', order: 'desc', label: 'Mới nhất' },
  { value: 'created_at', order: 'asc', label: 'Cũ nhất' },
  { value: 'price', order: 'asc', label: 'Giá thấp đến cao' },
  { value: 'price', order: 'desc', label: 'Giá cao đến thấp' },
  { value: 'name', order: 'asc', label: 'Tên A-Z' },
  { value: 'name', order: 'desc', label: 'Tên Z-A' },
  { value: 'popularity', order: 'desc', label: 'Phổ biến nhất' },
  { value: 'rating', order: 'desc', label: 'Đánh giá cao nhất' }
];

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100
};

// Price Ranges
export const PRICE_RANGES = [
  { label: 'Dưới 200K', min: 0, max: 200000 },
  { label: '200K - 500K', min: 200000, max: 500000 },
  { label: '500K - 1M', min: 500000, max: 1000000 },
  { label: '1M - 2M', min: 1000000, max: 2000000 },
  { label: 'Trên 2M', min: 2000000, max: 10000000 }
];

// Shipping
export const SHIPPING = {
  FREE_SHIPPING_THRESHOLD: 500000,
  STANDARD_FEE: 30000,
  EXPRESS_FEE: 50000
};

// Image Sizes
export const IMAGE_SIZES = {
  THUMBNAIL: { width: 150, height: 150 },
  SMALL: { width: 300, height: 300 },
  MEDIUM: { width: 600, height: 600 },
  LARGE: { width: 1200, height: 1200 }
};

// File Upload
export const UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_FILES: 10
};

// Validation
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[0-9+\-\s()]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 2000,
  ADDRESS_MAX_LENGTH: 200
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  CART_DATA: 'cart_data',
  RECENT_SEARCHES: 'recent_searches',
  VIEWED_PRODUCTS: 'viewed_products',
  THEME: 'theme',
  LANGUAGE: 'language'
};

// Cache Keys
export const CACHE_KEYS = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  USER_PROFILE: 'user_profile',
  CART: 'cart'
};

// Cache Duration (in milliseconds)
export const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 15 * 60 * 1000, // 15 minutes
  LONG: 60 * 60 * 1000, // 1 hour
  VERY_LONG: 24 * 60 * 60 * 1000 // 24 hours
};

// Breakpoints (matches Tailwind CSS)
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px'
};

// Z-Index Layers
export const Z_INDEX = {
  DROPDOWN: 10,
  STICKY: 20,
  MODAL: 30,
  POPOVER: 40,
  TOOLTIP: 50,
  OVERLAY: 60,
  TOAST: 70
};

// Animation Durations
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000
};

// Toast Configuration
export const TOAST_CONFIG = {
  DURATION: {
    SUCCESS: 3000,
    ERROR: 5000,
    WARNING: 4000,
    INFO: 3000
  },
  POSITION: 'top-right'
};

// SEO
export const SEO = {
  DEFAULT_TITLE: 'Newborn Gifts Vietnam - Set Quà Cao Cấp Cho Bé Yêu',
  TITLE_SUFFIX: ' - Newborn Gifts',
  DEFAULT_DESCRIPTION: 'Chuyên cung cấp set quà cao cấp cho trẻ em từ sơ sinh đến 5 tuổi. Sản phẩm chất lượng, an toàn, giá tốt nhất.',
  DEFAULT_KEYWORDS: 'set quà trẻ em, đồ chơi sơ sinh, quà sinh nhật bé, newborn gifts vietnam',
  OG_IMAGE: '/images/og-default.jpg'
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet.',
  UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  FORBIDDEN: 'Bạn không có quyền truy cập chức năng này.',
  NOT_FOUND: 'Không tìm thấy tài nguyên yêu cầu.',
  SERVER_ERROR: 'Lỗi server. Vui lòng thử lại sau.',
  VALIDATION: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
  TIMEOUT: 'Yêu cầu quá hạn thời gian chờ. Vui lòng thử lại.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Đăng nhập thành công!',
  REGISTER: 'Đăng ký thành công!',
  LOGOUT: 'Đã đăng xuất.',
  ADD_TO_CART: 'Đã thêm vào giỏ hàng.',
  UPDATE_CART: 'Đã cập nhật giỏ hàng.',
  REMOVE_FROM_CART: 'Đã xóa khỏi giỏ hàng.',
  ORDER_CREATED: 'Đặt hàng thành công!',
  PROFILE_UPDATED: 'Cập nhật thông tin thành công.',
  PASSWORD_CHANGED: 'Đổi mật khẩu thành công.'
};

// Feature Flags
export const FEATURES = {
  WISHLIST: true,
  REVIEWS: true,
  LIVE_CHAT: false,
  MULTI_LANGUAGE: false,
  DARK_MODE: false,
  PWA: true,
  SOCIAL_LOGIN: true,
  PAYMENT_GATEWAY: true
};

// Third-party Service IDs
export const SERVICES = {
  GOOGLE_ANALYTICS: process.env.REACT_APP_GA_ID,
  FACEBOOK_PIXEL: process.env.REACT_APP_FB_PIXEL_ID,
  GOOGLE_TAG_MANAGER: process.env.REACT_APP_GTM_ID,
  HOTJAR: process.env.REACT_APP_HOTJAR_ID
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/me',
  
  // Products
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  SEARCH: '/products/search',
  
  // Categories
  CATEGORIES: '/categories',
  CATEGORY_PRODUCTS: '/categories/:id/products',
  
  // Cart
  CART: '/cart',
  ADD_TO_CART: '/cart/add',
  UPDATE_CART: '/cart/update/:id',
  REMOVE_FROM_CART: '/cart/remove/:id',
  CLEAR_CART: '/cart/clear',
  
  // Orders
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  CREATE_ORDER: '/orders',
  CANCEL_ORDER: '/orders/:id/cancel',
  
  // Reviews
  REVIEWS: '/reviews',
  PRODUCT_REVIEWS: '/reviews/product/:id',
  CREATE_REVIEW: '/reviews',
  
  // Upload
  UPLOAD_IMAGE: '/upload/image',
  UPLOAD_MULTIPLE: '/upload/multiple'
};

// Regular Expressions
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9+\-\s()]+$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_TIME: 'DD/MM/YYYY HH:mm',
  API: 'YYYY-MM-DD',
  API_TIME: 'YYYY-MM-DD HH:mm:ss'
};

// Currency
export const CURRENCY = {
  CODE: 'VND',
  SYMBOL: '₫',
  LOCALE: 'vi-VN'
};