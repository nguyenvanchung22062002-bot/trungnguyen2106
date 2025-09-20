import React, { useState, useEffect, createContext, useContext } from 'react';
import { ShoppingCart, User, Search, Menu, X, Heart, Star, Gift, Baby, Sparkles } from 'lucide-react';


// Auth Context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage?.getItem('token') || null);

  useEffect(() => {
    if (token) {
      // In real app, verify token with backend
      const userData = JSON.parse(localStorage?.getItem('user') || '{}');
      setUser(userData);
    }
  }, [token]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    if (typeof Storage !== 'undefined') {
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof Storage !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Cart Context
const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.discount_price || item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      getTotalPrice,
      getTotalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

// Header Component
const Header = () => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-full">
              <Gift className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Newborn Gift
            </span>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Tìm kiếm quà tặng cho bé..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Xin chào, {user.full_name}</span>
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-pink-500 transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <button className="flex items-center space-x-1 text-gray-600 hover:text-pink-500 transition-colors">
                <User className="h-6 w-6" />
                <span className="hidden sm:block">Đăng nhập</span>
              </button>
            )}

            <button className="relative text-gray-600 hover:text-pink-500 transition-colors">
              <Heart className="h-6 w-6" />
            </button>

            <button className="relative text-gray-600 hover:text-pink-500 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>

            <button
              className="md:hidden text-gray-600 hover:text-pink-500 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm quà tặng cho bé..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <nav className="flex flex-col space-y-2">
                <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors">Trang chủ</a>
                <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors">Sản phẩm</a>
                <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors">Danh mục</a>
                <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors">Liên hệ</a>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

// Hero Section Component
const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-pink-600">
              <Sparkles className="h-6 w-6" />
              <span className="font-medium">Quà tặng đặc biệt cho bé yêu</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight">
              Những món quà
              <span className="block text-pink-500">tuyệt vời nhất</span>
              cho trẻ em
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Khám phá bộ sưu tập quà tặng cao cấp, an toàn và đầy yêu thương dành riêng cho các bé yêu của bạn.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-full font-semibold transition-colors transform hover:scale-105">
                Mua sắm ngay
              </button>
              <button className="border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white px-8 py-4 rounded-full font-semibold transition-all">
                Xem bộ sưu tập
              </button>
            </div>
            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-500">500+</div>
                <div className="text-gray-600">Sản phẩm</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-500">1000+</div>
                <div className="text-gray-600">Khách hàng hài lòng</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-500">4.9</div>
                <div className="text-gray-600">Đánh giá</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-pink-200 to-purple-300 rounded-3xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <Baby className="h-32 w-32 text-pink-400 mx-auto mb-4" />
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Set quà cao cấp</h3>
                  <p className="text-gray-600">Được tuyển chọn kỹ lưỡng</p>
                  <div className="flex items-center justify-center mt-4 space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-800 px-4 py-2 rounded-full font-semibold animate-bounce">
              🎁 Miễn phí ship
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Product Card Component
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  const originalPrice = product.price;
  const salePrice = product.discount_price;
  const discountPercent = salePrice ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0;

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <div className="aspect-square bg-gray-100 flex items-center justify-center">
          <Gift className="h-24 w-24 text-gray-300" />
        </div>
        {discountPercent > 0 && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            -{discountPercent}%
          </div>
        )}
        <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-pink-50 transition-colors">
          <Heart className="h-5 w-5 text-gray-400 hover:text-pink-500" />
        </button>
        <div className={`absolute inset-x-0 bottom-0 bg-black bg-opacity-50 text-white p-4 transform transition-transform duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}>
          <button 
            onClick={handleAddToCart}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg font-semibold transition-colors"
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-2">
          <span className="inline-block bg-pink-100 text-pink-600 text-xs px-2 py-1 rounded-full">
            {product.category_name || 'Quà tặng'}
          </span>
        </div>
        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {salePrice ? (
              <>
                <span className="text-2xl font-bold text-pink-500">
                  {salePrice.toLocaleString('vi-VN')}đ
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {originalPrice.toLocaleString('vi-VN')}đ
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-gray-800">
                {originalPrice.toLocaleString('vi-VN')}đ
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">4.8</span>
          </div>
        </div>
        
        {product.age_range && (
          <div className="mt-4 text-sm text-gray-600">
            <span className="font-medium">Độ tuổi:</span> {product.age_range}
          </div>
        )}
      </div>
    </div>
  );
};

// Featured Products Section
const FeaturedProducts = () => {
  const [products] = useState([
    {
      id: 1,
      name: "Set quà tặng sơ sinh cao cấp",
      description: "Bộ quà tặng hoàn hảo cho bé sơ sinh với chất liệu organic an toàn",
      price: 599000,
      discount_price: 449000,
      category_name: "Sơ sinh",
      age_range: "0-6 tháng",
      images: []
    },
    {
      id: 2,
      name: "Bộ đồ chơi giáo dục thông minh",
      description: "Giúp phát triển trí tuệ và khả năng tư duy logic cho trẻ",
      price: 399000,
      discount_price: 299000,
      category_name: "Đồ chơi",
      age_range: "1-3 tuổi",
      images: []
    },
    {
      id: 3,
      name: "Set quần áo cotton organic",
      description: "Quần áo mềm mại, thoáng mát, an toàn cho làn da nhạy cảm của bé",
      price: 299000,
      category_name: "Quần áo",
      age_range: "3-12 tháng",
      images: []
    },
    {
      id: 4,
      name: "Bộ sách tranh tương tác",
      description: "Kích thích khả năng sáng tạo và tư duy qua những câu chuyện thú vị",
      price: 199000,
      discount_price: 149000,
      category_name: "Sách",
      age_range: "2-5 tuổi",
      images: []
    }
  ]);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 text-pink-600 mb-4">
            <Sparkles className="h-6 w-6" />
            <span className="font-medium">Sản phẩm nổi bật</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Những món quà được yêu thích nhất
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Được tuyển chọn kỹ lưỡng từ các thương hiệu uy tín, đảm bảo chất lượng và an toàn tuyệt đối cho bé yêu
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-full font-semibold transition-colors transform hover:scale-105">
            Xem tất cả sản phẩm
          </button>
        </div>
      </div>
    </section>
  );
};

// Categories Section
const CategoriesSection = () => {
  const categories = [
    { name: "Sơ sinh (0-6 tháng)", icon: "👶", count: 120, color: "bg-pink-100 text-pink-600" },
    { name: "Bé tập đi (6-24 tháng)", icon: "🚼", count: 85, color: "bg-blue-100 text-blue-600" },
    { name: "Trẻ mẫu giáo (2-5 tuổi)", icon: "🧸", count: 95, color: "bg-purple-100 text-purple-600" },
    { name: "Trẻ tiểu học (6-12 tuổi)", icon: "🎒", count: 75, color: "bg-green-100 text-green-600" }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 text-pink-600 mb-4">
            <Baby className="h-6 w-6" />
            <span className="font-medium">Danh mục sản phẩm</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Quà tặng theo độ tuổi
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chúng tôi phân loại sản phẩm theo từng độ tuổi để bạn dễ dàng tìm kiếm món quà phù hợp nhất
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group">
              <div className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {category.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {category.name}
              </h3>
              <p className="text-gray-600 mb-4">
                {category.count} sản phẩm
              </p>
              <div className="flex items-center text-pink-500 font-medium group-hover:text-pink-600">
                <span>Xem ngay</span>
                <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-full">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">Newborn Gift</span>
            </div>
            <p className="text-gray-300">
              Cửa hàng quà tặng cao cấp dành riêng cho trẻ em, mang đến những món quà đầy yêu thương và an toàn.
            </p>
            <div className="flex space-x-4">
              <button className="bg-gray-700 p-2 rounded-full hover:bg-pink-500 transition-colors">
                <span className="sr-only">Facebook</span>
                📘
              </button>
              <button className="bg-gray-700 p-2 rounded-full hover:bg-pink-500 transition-colors">
                <span className="sr-only">Instagram</span>
                📷
              </button>
              <button className="bg-gray-700 p-2 rounded-full hover:bg-pink-500 transition-colors">
                <span className="sr-only">YouTube</span>
                📺
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Danh mục</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-pink-400 transition-colors">Sơ sinh</a></li>
              <li><a href="#" className="text-gray-300 hover:text-pink-400 transition-colors">Đồ chơi</a></li>
              <li><a href="#" className="text-gray-300 hover:text-pink-400 transition-colors">Quần áo</a></li>
              <li><a href="#" className="text-gray-300 hover:text-pink-400 transition-colors">Sách tranh</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-pink-400 transition-colors">Liên hệ</a></li>
              <li><a href="#" className="text-gray-300 hover:text-pink-400 transition-colors">Giao hàng</a></li>
              <li><a href="#" className="text-gray-300 hover:text-pink-400 transition-colors">Đổi trả</a></li>
              <li><a href="#" className="text-gray-300 hover:text-pink-400 transition-colors">Bảo hành</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Liên hệ</h3>
            <div className="space-y-3 text-gray-300">
              <div>📍 123 Đường ABC, Quận 1, TP.HCM</div>
              <div>📞 (028) 1234 5678</div>
              <div>✉️ info@newborngift.com</div>
              <div>⏰ 8:00 - 22:00 (Thứ 2 - Chủ nhật)</div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Newborn Gift. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
// const NewbornGiftHomepage = () => {
//   return (
//     <AuthProvider>
//       <CartProvider>
//         <div className="min-h-screen bg-white">
//           <Header />
//           <main>
//             <HeroSection />
//             <FeaturedProducts />
//             <CategoriesSection />
//           </main>
//           <Footer />
//         </div>
//       </CartProvider>
//     </AuthProvider>
//   );
// };

// export default NewbornGiftHomepage;
export default App;