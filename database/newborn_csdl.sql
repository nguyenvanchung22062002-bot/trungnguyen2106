-- Tạo database
CREATE DATABASE newborn_gift;

-- Tạo user cho ứng dụng (khuyến nghị)
ALTER USER 'newborn_user'@'localhost' IDENTIFIED BY 'gift2025';

GRANT ALL PRIVILEGES ON newborn_gift.* TO 'newborn_user'@'localhost';
FLUSH PRIVILEGES;

-- Sử dụng database
USE newborn_gift;

-- Database initialization for Newborn Gift Website
-- Create database
CREATE DATABASE IF NOT EXISTS newborn_gift;

-- Create users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    role ENUM('admin', 'customer') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_role (role)
);

-- Create categories table
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
);

-- Create products table
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    discount_price DECIMAL(10,2),
    category_id INT,
    stock_quantity INT DEFAULT 0,
    age_range VARCHAR(50),
    images JSON,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_category (category_id),
    INDEX idx_status (status),
    INDEX idx_price (price),
    INDEX idx_name (name),
    FULLTEXT KEY ft_search (name, description)
);

-- Create orders table
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'shipping', 'delivered', 'cancelled') DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    payment_method VARCHAR(50),
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_created_at (created_at)
);

-- Create order_items table
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
);

-- Create wishlist table
CREATE TABLE wishlist (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_wishlist (user_id, product_id),
    INDEX idx_user_id (user_id)
);

-- Create reviews table
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    order_id INT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    UNIQUE KEY unique_review (user_id, product_id, order_id),
    INDEX idx_product_id (product_id),
    INDEX idx_rating (rating)
);

-- Create coupons table
CREATE TABLE coupons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type ENUM('percentage', 'fixed') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    minimum_order_value DECIMAL(10,2) DEFAULT 0,
    maximum_discount DECIMAL(10,2),
    usage_limit INT DEFAULT NULL,
    used_count INT DEFAULT 0,
    expires_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_is_active (is_active),
    INDEX idx_expires_at (expires_at)
);

-- Create coupon_usage table
CREATE TABLE coupon_usage (
    id INT PRIMARY KEY AUTO_INCREMENT,
    coupon_id INT NOT NULL,
    user_id INT NOT NULL,
    order_id INT NOT NULL,
    discount_amount DECIMAL(10,2) NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_coupon_id (coupon_id),
    INDEX idx_user_id (user_id)
);

-- Insert sample data

-- Insert admin user (password: admin123)
INSERT INTO users (username, email, password, full_name, role) VALUES
-- pass : admin@123
('admin', 'admin@newborngift.com', '$2a$10$GyZ2QmU5Bh8VKbn1aoYEYuN.2n3sIOXuhnwddethU0F4rl5K1sdly', 'Administrator', 'admin');

-- Insert sample categories
INSERT INTO categories (name, description, image) VALUES
('Sơ sinh (0-6 tháng)', 'Quà tặng dành cho trẻ sơ sinh từ 0-6 tháng tuổi', 'newborn.jpg'),
('Bé tập đi (6-24 tháng)', 'Sản phẩm hỗ trợ bé trong giai đoạn tập đi', 'toddler.jpg'),
('Trẻ mẫu giáo (2-5 tuổi)', 'Đồ chơi giáo dục và phát triển trí tuệ', 'preschool.jpg'),
('Trẻ tiểu học (6-12 tuổi)', 'Sản phẩm học tập và giải trí', 'school.jpg'),
('Quần áo trẻ em', 'Trang phục cao cấp cho bé', 'clothing.jpg'),
('Đồ chơi giáo dục', 'Đồ chơi phát triển trí tuệ và kỹ năng', 'educational.jpg'),
('Sách tranh', 'Sách tranh và truyện thiếu nhi', 'books.jpg'),
('Phụ kiện cho bé', 'Phụ kiện và đồ dùng thiết yếu cho bé', 'accessories.jpg');

-- Insert sample products
INSERT INTO products (name, description, price, discount_price, category_id, stock_quantity, age_range, images, status) VALUES
('Set quà tặng sơ sinh cao cấp Premium', 'Bộ quà tặng hoàn hảo cho bé sơ sinh bao gồm: body suit cotton organic, mũ, bao tay, tất, khăn tắm siêu mềm và gấu bông an toàn', 599000, 449000, 1, 50, '0-6 tháng', '["newborn-set-1.jpg", "newborn-set-2.jpg", "newborn-set-3.jpg"]', 'active'),

('Bộ đồ chơi giáo dục thông minh Fisher Price', 'Bộ đồ chơi phát triển trí tuệ bao gồm: khối xếp hình, bảng chữ cái, số đếm và các hoạt động tương tác giúp bé học tập qua vui chơi', 399000, 299000, 3, 30, '1-3 tuổi', '["educational-toy-1.jpg", "educational-toy-2.jpg"]', 'active'),

('Set quần áo cotton organic Mamago', 'Bộ 5 bộ quần áo cotton 100% organic, mềm mại, thoáng mát, an toàn cho làn da nhạy cảm của bé. Thiết kế dễ thương với họa tiết động vật', 299000, NULL, 5, 75, '3-12 tháng', '["clothing-set-1.jpg", "clothing-set-2.jpg", "clothing-set-3.jpg"]', 'active'),

('Bộ sách tranh tương tác "Thế giới của bé"', 'Bộ 10 cuốn sách tranh với âm thanh và hiệu ứng 3D, kích thích khả năng sáng tạo và tư duy qua những câu chuyện thú vị về động vật, thiên nhiên', 199000, 149000, 7, 40, '2-5 tuổi', '["book-set-1.jpg", "book-set-2.jpg"]', 'active'),

('Xe tập đi đa năng Baby Walker Pro', 'Xe tập đi an toàn với nhiều tính năng: nhạc, đèn LED, đồ chơi tương tác. Giúp bé phát triển kỹ năng vận động và cân bằng', 1299000, 999000, 2, 25, '6-18 tháng', '["walker-1.jpg", "walker-2.jpg", "walker-3.jpg"]', 'active'),

('Gấu bông siêu mềm Teddy Bear', 'Gấu bông cao cấp làm từ chất liệu plush siêu mềm, an toàn cho bé. Có thể giặt máy, không phai màu. Size 40cm', 159000, 99000, 8, 100, '0-10 tuổi', '["teddy-1.jpg", "teddy-2.jpg"]', 'active'),

('Bộ xếp hình LEGO Duplo Starter', 'Bộ xếp hình LEGO Duplo dành cho trẻ nhỏ, phát triển khả năng sáng tạo và tư duy logic. Bao gồm 50 miếng ghép nhiều màu sắc', 899000, 699000, 6, 35, '18 tháng - 5 tuổi', '["lego-1.jpg", "lego-2.jpg", "lego-3.jpg"]', 'active'),

('Set đồ ăn dặm cao cấp BPA Free', 'Bộ đồ ăn dặm an toàn bao gồm: bát, thìa, nĩa, ly tập uống. Chất liệu silicone cao cấp, không chứa BPA, dễ vệ sinh', 199000, NULL, 8, 60, '6-24 tháng', '["feeding-set-1.jpg", "feeding-set-2.jpg"]', 'active'),

('Xe đạp thăng bằng cho bé Balance Bike', 'Xe đạp không bàn đạp giúp bé học thăng bằng trước khi chuyển sang xe đạp thật. Khung nhôm nhẹ, yên và tay lái có thể điều chỉnh', 1599000, 1299000, 4, 20, '2-5 tuổi', '["balance-bike-1.jpg", "balance-bike-2.jpg"]', 'active'),

('Bộ đồ chơi tắm vịt cao su', 'Set 6 con vịt cao su nhiều màu sắc, an toàn cho bé chơi trong lúc tắm. Chất liệu cao su tự nhiên, không độc hại', 79000, 59000, 8, 150, '6 tháng - 3 tuổi', '["duck-toys-1.jpg"]', 'active'),

('Máy hát karaoke trẻ em mini', 'Máy karaoke mini với micro không dây, đèn LED nhiều màu. Kết nối bluetooth, có sẵn 50 bài hát thiếu nhi', 499000, 399000, 6, 25, '3-10 tuổi', '["karaoke-1.jpg", "karaoke-2.jpg"]', 'active'),

('Set bàn chải đánh răng cho bé', 'Bộ 3 bàn chải đánh răng với lông mềm, thiết kế ergonomic phù hợp tay bé. Kèm theo kem đánh răng hương trái cây', 89000, NULL, 8, 80, '1-6 tuổi', '["toothbrush-set.jpg"]', 'active');

-- Insert sample customer users
INSERT INTO users (username, email, password, full_name, phone, address, role) VALUES
('nguyenvan_a', 'nguyenvana@email.com', '$2a$10$8K1p/a9C4GG2xm9.8B5qFOo8sP3kOYe7Iy4YtYz1K8rT9S5cX8vNa', 'Nguyễn Văn A', '0901234567', '123 Đường ABC, Quận 1, TP.HCM', 'customer'),
('tranthib', 'tranthib@email.com', '$2a$10$8K1p/a9C4GG2xm9.8B5qFOo8sP3kOYe7Iy4YtYz1K8rT9S5cX8vNa', 'Trần Thị B', '0912345678', '456 Đường XYZ, Quận 2, TP.HCM', 'customer'),
('phamvanc', 'phamvanc@email.com', '$2a$10$8K1p/a9C4GG2xm9.8B5qFOo8sP3kOYe7Iy4YtYz1K8rT9S5cX8vNa', 'Phạm Văn C', '0923456789', '789 Đường MNO, Quận 3, TP.HCM', 'customer');

-- Insert sample orders
INSERT INTO orders (user_id, total_amount, status, shipping_address, payment_method, payment_status, notes) VALUES
(2, 449000, 'delivered', '123 Đường ABC, Quận 1, TP.HCM', 'COD', 'paid', 'Giao hàng giờ hành chính'),
(3, 598000, 'shipping', '456 Đường XYZ, Quận 2, TP.HCM', 'Bank Transfer', 'paid', 'Gọi trước khi giao'),
(4, 299000, 'pending', '789 Đường MNO, Quận 3, TP.HCM', 'COD', 'pending', '');

-- Insert sample order items
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 449000),
(2, 2, 1, 299000),
(2, 4, 2, 149000),
(3, 3, 1, 299000);

-- Insert sample reviews
INSERT INTO reviews (user_id, product_id, order_id, rating, comment) VALUES
(2, 1, 1, 5, 'Sản phẩm chất lượng tuyệt vời, bé rất thích. Đóng gói cẩn thận, giao hàng nhanh.'),
(3, 2, 2, 4, 'Đồ chơi bổ ích, giúp bé phát triển tư duy. Chỉ có điều hộp đựng hơi nhỏ.'),
(3, 4, 2, 5, 'Bộ sách hay, hình ảnh đẹp, bé thích đọc mỗi tối. Sẽ mua thêm bộ khác.');

-- Insert sample coupons
INSERT INTO coupons (code, discount_type, discount_value, minimum_order_value, maximum_discount, usage_limit, expires_at, is_active) VALUES
('WELCOME10', 'percentage', 10.00, 200000, 50000, 100, '2024-12-31 23:59:59', TRUE),
('NEWBORN2024', 'fixed', 50000, 500000, NULL, 50, '2024-12-31 23:59:59', TRUE),
('FREESHIP', 'fixed', 30000, 300000, NULL, 200, '2024-12-31 23:59:59', TRUE);

-- Insert sample wishlist items
INSERT INTO wishlist (user_id, product_id) VALUES
(2, 5), (2, 7), (2, 9),
(3, 1), (3, 6), (3, 8),
(4, 2), (4, 4), (4, 11);

-- Create views for common queries

-- View for product details with category info
CREATE VIEW product_details AS
SELECT 
    p.id,
    p.name,
    p.description,
    p.price,
    p.discount_price,
    p.stock_quantity,
    p.age_range,
    p.images,
    p.status,
    p.created_at,
    p.updated_at,
    c.name as category_name,
    c.id as category_id,
    COALESCE(AVG(r.rating), 0) as avg_rating,
    COUNT(r.id) as review_count
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN reviews r ON p.id = r.product_id
GROUP BY p.id, c.id;

-- View for order summary
CREATE VIEW order_summary AS
SELECT 
    o.id,
    o.user_id,
    u.full_name,
    u.email,
    u.phone,
    o.total_amount,
    o.status,
    o.payment_status,
    o.shipping_address,
    o.payment_method,
    o.created_at,
    COUNT(oi.id) as item_count
FROM orders o
JOIN users u ON o.user_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id;

-- Create indexes for better performance
CREATE INDEX idx_products_search ON products(name, category_id, status, price);
CREATE INDEX idx_orders_user_status ON orders(user_id, status, created_at);
CREATE INDEX idx_reviews_product_rating ON reviews(product_id, rating);

-- Create stored procedures

-- Procedure to update product stock after order
DELIMITER //

CREATE PROCEDURE UpdateProductStock(
    IN p_product_id INT,
    IN p_quantity INT,
    IN p_operation VARCHAR(10) /* 'decrease' or 'increase' */
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    IF p_operation = 'decrease' THEN
        UPDATE products 
        SET stock_quantity = stock_quantity - p_quantity 
        WHERE id = p_product_id AND stock_quantity >= p_quantity;

        IF ROW_COUNT() = 0 THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Insufficient stock or product not found';
        END IF;

    ELSEIF p_operation = 'increase' THEN
        UPDATE products 
        SET stock_quantity = stock_quantity + p_quantity 
        WHERE id = p_product_id;
    END IF;

    COMMIT;
END //

DELIMITER ;


-- Procedure to calculate order total
DELIMITER //
CREATE PROCEDURE CalculateOrderTotal(
    IN p_order_id INT,
    OUT p_total DECIMAL(10,2)
)
BEGIN
    SELECT SUM(oi.price * oi.quantity) INTO p_total
    FROM order_items oi
    WHERE oi.order_id = p_order_id;
END//
DELIMITER ;

-- Function to get product discount percentage
DELIMITER //
CREATE FUNCTION GetDiscountPercentage(
    p_original_price DECIMAL(10,2),
    p_discount_price DECIMAL(10,2)
) RETURNS INT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE discount_percent INT DEFAULT 0;
    
    IF p_discount_price IS NOT NULL AND p_discount_price < p_original_price THEN
        SET discount_percent = ROUND(((p_original_price - p_discount_price) / p_original_price) * 100);
    END IF;
    
    RETURN discount_percent;
END//
DELIMITER ;

-- Trigger to update product rating when review is added/updated
DELIMITER //
CREATE TRIGGER UpdateProductRating
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    DECLARE avg_rating DECIMAL(3,2);
    
    SELECT AVG(rating) INTO avg_rating
    FROM reviews
    WHERE product_id = NEW.product_id;
    
    -- You could add a rating column to products table if needed
    -- UPDATE products SET avg_rating = avg_rating WHERE id = NEW.product_id;
END//
DELIMITER ;

-- Create admin dashboard statistics view
CREATE VIEW admin_statistics AS
SELECT 
    (SELECT COUNT(*) FROM users WHERE role = 'customer') as total_customers,
    (SELECT COUNT(*) FROM products WHERE status = 'active') as total_products,
    (SELECT COUNT(*) FROM orders WHERE status != 'cancelled') as total_orders,
    (SELECT SUM(total_amount) FROM orders WHERE status = 'delivered') as total_revenue,
    (SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURDATE()) as today_orders,
    (SELECT SUM(total_amount) FROM orders WHERE DATE(created_at) = CURDATE()) as today_revenue;

-- Sample data verification queries (commented out - can be used for testing)
/*
-- Test queries
SELECT * FROM product_details WHERE category_name = 'Sơ sinh (0-6 tháng)';
SELECT * FROM order_summary WHERE status = 'pending';
SELECT * FROM admin_statistics;
SELECT GetDiscountPercentage(599000, 449000) as discount_percent;
*/

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON newborn_gift.* TO 'app_user'@'localhost';
-- FLUSH PRIVILEGES;