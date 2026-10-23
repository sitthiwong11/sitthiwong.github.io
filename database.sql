-- ========================================================
-- AMPHOREUS Game Store - MySQL Database Schema & Seed Data
-- Database: amphoreus_db
-- Character Set: utf8mb4, Collation: utf8mb4_unicode_ci
-- ========================================================

CREATE DATABASE IF NOT EXISTS `amphoreus_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `amphoreus_db`;

-- --------------------------------------------------------
-- Table structure for table `users`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(191) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `role` ENUM('Admin', 'Member') NOT NULL DEFAULT 'Member',
  `avatar` TEXT,
  `wallet` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `joined_date` VARCHAR(50),
  `bio` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `games`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `games`;
CREATE TABLE `games` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `title_th` VARCHAR(255) DEFAULT NULL,
  `category` VARCHAR(100) DEFAULT 'General',
  `platforms` TEXT,
  `price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `original_price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `discount` INT NOT NULL DEFAULT 0,
  `rating` DECIMAL(3, 1) NOT NULL DEFAULT 5.0,
  `reviews_count` INT NOT NULL DEFAULT 0,
  `release_date` VARCHAR(50) DEFAULT NULL,
  `publisher` VARCHAR(255) DEFAULT NULL,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `is_hot` TINYINT(1) NOT NULL DEFAULT 0,
  `is_bestseller` TINYINT(1) NOT NULL DEFAULT 0,
  `cover_image` TEXT,
  `banner_image` TEXT,
  `description` LONGTEXT,
  `tags` TEXT,
  `screenshots` LONGTEXT,
  `video_url` TEXT,
  `system_req` LONGTEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `coupons`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `coupons`;
CREATE TABLE `coupons` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `type` VARCHAR(20) NOT NULL,
  `value` DECIMAL(10, 2) NOT NULL,
  `min_spend` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `carts`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `carts`;
CREATE TABLE `carts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `game_id` INT NOT NULL,
  `platform` VARCHAR(50) DEFAULT 'PC',
  `quantity` INT NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_user_cart` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `wishlists`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `wishlists`;
CREATE TABLE `wishlists` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `game_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_user_game` (`user_id`, `game_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `order_transactions`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `order_transactions`;
CREATE TABLE `order_transactions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` VARCHAR(100) NOT NULL,
  `user_id` INT NOT NULL,
  `user_email` VARCHAR(191) NOT NULL,
  `game_id` INT NOT NULL,
  `game_title` VARCHAR(255) NOT NULL,
  `cover_image` TEXT,
  `platform` VARCHAR(50) DEFAULT 'PC',
  `game_key` VARCHAR(100) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `original_price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `discount_applied` INT NOT NULL DEFAULT 0,
  `payment_method` VARCHAR(50) DEFAULT 'Wallet',
  `purchase_date` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_user_orders` (`user_id`),
  INDEX `idx_email_orders` (`user_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `profile_prefs`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `profile_prefs`;
CREATE TABLE `profile_prefs` (
  `user_id` INT PRIMARY KEY,
  `sound_enabled` TINYINT(1) DEFAULT 1,
  `notif_promos` TINYINT(1) DEFAULT 1,
  `notif_orders` TINYINT(1) DEFAULT 1,
  `notif_wishlist` TINYINT(1) DEFAULT 1,
  `currency` VARCHAR(20) DEFAULT 'THB',
  `language` VARCHAR(20) DEFAULT 'th',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Dumping data for table `users`
-- --------------------------------------------------------
INSERT INTO `users` (`id`, `username`, `password`, `name`, `role`, `avatar`, `wallet`, `joined_date`, `bio`) VALUES (1, 'admin@amphoreus.com', 'admin123', 'ผู้ดูแลระบบ (Admin AMPHOREUS)', 'Admin', 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80', 33550336, '2024-01-01', 'ผู้ดูแลระบบ AMPHOREUS และคลังเกม');
INSERT INTO `profile_prefs` (`user_id`, `sound_enabled`, `notif_promos`, `notif_orders`, `notif_wishlist`, `currency`, `language`) VALUES (1, 1, 1, 1, 1, 'THB', 'th');
INSERT INTO `users` (`id`, `username`, `password`, `name`, `role`, `avatar`, `wallet`, `joined_date`, `bio`) VALUES (2, 'rachata@amphoreus.com', 'user123', 'รัชต สิทธิวงศ์ (VIP Member)', 'Member', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80', 2500, '2024-02-15', 'เกมเมอร์สายชิล ชอบเล่นเกมแนว RPG และ Open-world');
INSERT INTO `profile_prefs` (`user_id`, `sound_enabled`, `notif_promos`, `notif_orders`, `notif_wishlist`, `currency`, `language`) VALUES (2, 1, 1, 1, 1, 'THB', 'th');
INSERT INTO `users` (`id`, `username`, `password`, `name`, `role`, `avatar`, `wallet`, `joined_date`, `bio`) VALUES (3, 'gamer@amphoreus.com', 'gamer123', 'Cyber Knight', 'Member', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80', 1200, '2024-03-10', 'เกมเมอร์สายชิล ชอบเล่นเกมแนว RPG และ Open-world');
INSERT INTO `profile_prefs` (`user_id`, `sound_enabled`, `notif_promos`, `notif_orders`, `notif_wishlist`, `currency`, `language`) VALUES (3, 1, 1, 1, 1, 'THB', 'th');

-- --------------------------------------------------------
-- Dumping data for table `coupons`
-- --------------------------------------------------------
INSERT INTO `coupons` (`code`, `type`, `value`, `min_spend`, `description`) VALUES ('GAMEON10', 'percent', 10, 500, 'ลดทันที 10% เมื่อซื้อครบ 500 บาท');
INSERT INTO `coupons` (`code`, `type`, `value`, `min_spend`, `description`) VALUES ('CYBER50', 'fixed', 50, 300, 'ลด 50 บาท สำหรับทุกออเดอร์ 300 บาทขึ้นไป');
INSERT INTO `coupons` (`code`, `type`, `value`, `min_spend`, `description`) VALUES ('NEXUS100', 'fixed', 100, 1000, 'ส่วนลด 100 บาท เมื่อซื้อครบ 1,000 บาท');
INSERT INTO `coupons` (`code`, `type`, `value`, `min_spend`, `description`) VALUES ('STUDENTVIP', 'percent', 15, 200, 'ส่วนลดพิเศษนักศึกษา 15%');

-- --------------------------------------------------------
-- Dumping data for table `games`
-- --------------------------------------------------------
INSERT INTO `games` (`id`, `title`, `title_th`, `category`, `platforms`, `price`, `original_price`, `discount`, `rating`, `reviews_count`, `release_date`, `publisher`, `is_featured`, `is_hot`, `is_bestseller`, `cover_image`, `banner_image`, `description`, `tags`, `screenshots`, `video_url`, `system_req`) VALUES (1, 'Black Myth: Wukong', 'แบล็ก มิท: หงอคง', 'Action RPG', '[\"PC\",\"PS5\"]', 1790, 1790, 0, 4.9, 14200, '2024-08-20', 'Game Science', 1, 1, 1, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80', 'เกมแอ็กชันสวมบทบาทที่อิงจากวรรณกรรมไซอิ๋วสุดคลาสสิกของจีน คุณจะได้รับบทเป็น \'ผู้ถูกเลือก\' ออกผจญภัยในดินแดนลี้ลับ ต่อสู้กับเหล่าปีศาจและทวยเทพด้วยกระบองวิเศษและเวทมนตร์แปลงร่าง 72 กระบวนท่า กราฟิกสมจริงระดับ Unreal Engine 5', '[\"Action\",\"Souls-like\",\"Mythology\",\"Singleplayer\",\"Unreal Engine 5\"]', '[\"https:\\/\\/images.unsplash.com\\/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80\",\"https:\\/\\/images.unsplash.com\\/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80\",\"https:\\/\\/images.unsplash.com\\/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80\"]', 'https://www.youtube.com/embed/O2nNljv0MOI', '{\"minimum\":{\"os\":\"Windows 10 64-bit\",\"cpu\":\"Intel Core i5-8400 \\/ AMD Ryzen 5 1600\",\"ram\":\"16 GB RAM\",\"gpu\":\"NVIDIA GeForce GTX 1060 (6GB) \\/ AMD Radeon RX 580 (8GB)\",\"storage\":\"130 GB SSD\"},\"recommended\":{\"os\":\"Windows 11 64-bit\",\"cpu\":\"Intel Core i7-9700 \\/ AMD Ryzen 5 5500\",\"ram\":\"16 GB RAM\",\"gpu\":\"NVIDIA GeForce RTX 2060 \\/ AMD Radeon RX 5700 XT\",\"storage\":\"130 GB SSD\"}}');
INSERT INTO `games` (`id`, `title`, `title_th`, `category`, `platforms`, `price`, `original_price`, `discount`, `rating`, `reviews_count`, `release_date`, `publisher`, `is_featured`, `is_hot`, `is_bestseller`, `cover_image`, `banner_image`, `description`, `tags`, `screenshots`, `video_url`, `system_req`) VALUES (2, 'Cyberpunk 2077: Phantom Liberty Bundle', 'ไซเบอร์พังค์ 2077 แฟนทอม ลิเบอร์ตี', 'Open World', '[\"PC\",\"PS5\",\"Xbox Series X\"]', 1180, 1970, 40, 4.8, 38900, '2023-09-26', 'CD PROJEKT RED', 1, 1, 1, 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80', 'มหากาพย์เกม RPG แบบ Open World ในมหานครไนท์ซิตี้อันตื่นตา สัมผัสชีวิตทหารรับจ้างไซเบอร์เนติกส์ V พร้อมเนื้อเรื่องส่วนขยายสายลับ Phantom Liberty สุดระทึกที่นำแสดงโดย Idris Elba รองรับระบบ Ray Tracing และ DLSS 3.5 เต็มรูปแบบ', '[\"Cyberpunk\",\"Open World\",\"RPG\",\"Sci-Fi\",\"Ray Tracing\"]', '[\"https:\\/\\/images.unsplash.com\\/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80\",\"https:\\/\\/images.unsplash.com\\/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80\",\"https:\\/\\/images.unsplash.com\\/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80\"]', 'https://www.youtube.com/embed/8X2kIfS6fb8', '{\"minimum\":{\"os\":\"Windows 10 64-bit\",\"cpu\":\"Core i7-6700 \\/ Ryzen 5 1600\",\"ram\":\"12 GB RAM\",\"gpu\":\"GeForce GTX 1060 6GB \\/ Radeon RX 580 8GB\",\"storage\":\"70 GB SSD\"},\"recommended\":{\"os\":\"Windows 11 64-bit\",\"cpu\":\"Core i7-12700 \\/ Ryzen 7 7800X3D\",\"ram\":\"16 GB RAM\",\"gpu\":\"GeForce RTX 3080 \\/ Radeon RX 7900 XTX\",\"storage\":\"70 GB SSD\"}}');
INSERT INTO `games` (`id`, `title`, `title_th`, `category`, `platforms`, `price`, `original_price`, `discount`, `rating`, `reviews_count`, `release_date`, `publisher`, `is_featured`, `is_hot`, `is_bestseller`, `cover_image`, `banner_image`, `description`, `tags`, `screenshots`, `video_url`, `system_req`) VALUES (3, 'Elden Ring: Shadow of the Erdtree', 'เอลเดน ริงก์: เงาแห่งพฤกษาทอง', 'Action RPG', '[\"PC\",\"PS5\",\"Xbox Series X\"]', 1390, 1790, 22, 4.9, 52100, '2024-06-21', 'FromSoftware / Bandai Namco', 1, 1, 1, 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80', 'เกมยอดเยี่ยมแห่งปีสู่การเดินทางครั้งใหม่ในดินแดนแห่งเงา (Realm of Shadow) สำรวจดันเจี้ยนใหม่ ท้าทายบอสสุดโหด และค้นพบอาวุธ ชุดเกราะ เวทมนตร์ใหม่ๆ มากมาย จากฝีมือ Hidetaka Miyazaki ร่วมกับ George R. R. Martin', '[\"Souls-like\",\"Dark Fantasy\",\"Open World\",\"Difficult\",\"GOTY\"]', '[\"https:\\/\\/images.unsplash.com\\/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80\",\"https:\\/\\/images.unsplash.com\\/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80\"]', 'https://www.youtube.com/embed/qLZenOn7WUo', '{\"minimum\":{\"os\":\"Windows 10 64-bit\",\"cpu\":\"INTEL CORE I5-8400 \\/ AMD RYZEN 3 3300X\",\"ram\":\"12 GB RAM\",\"gpu\":\"NVIDIA GEFORCE GTX 1060 3 GB \\/ AMD RADEON RX 580 4 GB\",\"storage\":\"60 GB SSD\"},\"recommended\":{\"os\":\"Windows 10\\/11 64-bit\",\"cpu\":\"INTEL CORE I7-8700K \\/ AMD RYZEN 5 3600X\",\"ram\":\"16 GB RAM\",\"gpu\":\"NVIDIA GEFORCE GTX 1070 8 GB \\/ AMD RADEON RX VEGA 56 8 GB\",\"storage\":\"60 GB SSD\"}}');
INSERT INTO `games` (`id`, `title`, `title_th`, `category`, `platforms`, `price`, `original_price`, `discount`, `rating`, `reviews_count`, `release_date`, `publisher`, `is_featured`, `is_hot`, `is_bestseller`, `cover_image`, `banner_image`, `description`, `tags`, `screenshots`, `video_url`, `system_req`) VALUES (4, 'Grand Theft Auto V: Premium Edition', 'แกรนด์ เทฟต์ ออโต V พรีเมียม', 'Open World', '[\"PC\",\"PS5\",\"Xbox Series X\"]', 399, 799, 50, 4.8, 154000, '2015-04-14', 'Rockstar Games', 0, 1, 1, 'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80', 'สัมผัสชีวิตอาชญากรสุดระห่ำของ Michael, Franklin และ Trevor ในเมืองลอสซานโตส พร้อมเข้าถึง GTA Online และ Criminal Enterprise Starter Pack รับเงินเริ่มต้น 1,000,000 GTA$ ฟรี!', '[\"Open World\",\"Action\",\"Multiplayer\",\"Crime\",\"Classic\"]', '[\"https:\\/\\/images.unsplash.com\\/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=800&q=80\",\"https:\\/\\/images.unsplash.com\\/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80\"]', 'https://www.youtube.com/embed/QkkoHAzjnUs', '{\"minimum\":{\"os\":\"Windows 10 64 Bit\",\"cpu\":\"Intel Core 2 Quad CPU Q6600 @ 2.40GHz\",\"ram\":\"4 GB RAM\",\"gpu\":\"NVIDIA 9800 GT 1GB \\/ AMD HD 4870 1GB\",\"storage\":\"110 GB HDD\\/SSD\"},\"recommended\":{\"os\":\"Windows 10 64 Bit\",\"cpu\":\"Intel Core i5 3470 @ 3.2GHz \\/ AMD X8 FX-8350 @ 4GHz\",\"ram\":\"8 GB RAM\",\"gpu\":\"NVIDIA GTX 660 2GB \\/ AMD HD 7870 2GB\",\"storage\":\"110 GB SSD\"}}');
INSERT INTO `games` (`id`, `title`, `title_th`, `category`, `platforms`, `price`, `original_price`, `discount`, `rating`, `reviews_count`, `release_date`, `publisher`, `is_featured`, `is_hot`, `is_bestseller`, `cover_image`, `banner_image`, `description`, `tags`, `screenshots`, `video_url`, `system_req`) VALUES (5, 'Helldivers 2 - Super Citizen Edition', 'เฮลไดฟ์เวอร์ส 2 ซูเปอร์ ซิติเซน', 'Shooter / Co-op', '[\"PC\",\"PS5\"]', 1290, 1590, 19, 4.7, 29800, '2024-02-08', 'PlayStation Publishing LLC', 1, 1, 1, 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80', 'ร่วมมือกับเพื่อนสูงสุด 4 คนเพื่อปกป้องประชาธิปไตยแห่งซูเปอร์เอิร์ธในเกมยิงมุมมองบุคคลที่สามสุดเดือด เผชิญหน้ากับฝูงแมลงมฤตยูและกองทัพหุ่นยนต์สังหารพร้อมคลังอาวุธทำลายล้างสูง', '[\"Co-op\",\"Shooter\",\"Sci-Fi\",\"Third-Person\",\"Multiplayer\"]', '[\"https:\\/\\/images.unsplash.com\\/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80\"]', 'https://www.youtube.com/embed/l_nfl_bY7dY', '{\"minimum\":{\"os\":\"Windows 10 64-bit\",\"cpu\":\"Intel Core i7-4790K \\/ AMD Ryzen 5 1500X\",\"ram\":\"8 GB RAM\",\"gpu\":\"NVIDIA GeForce GTX 1050 Ti \\/ AMD Radeon RX 470\",\"storage\":\"100 GB HDD\\/SSD\"},\"recommended\":{\"os\":\"Windows 10\\/11 64-bit\",\"cpu\":\"Intel Core i7-9700K \\/ AMD Ryzen 7 3700X\",\"ram\":\"16 GB RAM\",\"gpu\":\"NVIDIA GeForce RTX 2060 \\/ AMD Radeon RX 6600XT\",\"storage\":\"100 GB SSD\"}}');
INSERT INTO `games` (`id`, `title`, `title_th`, `category`, `platforms`, `price`, `original_price`, `discount`, `rating`, `reviews_count`, `release_date`, `publisher`, `is_featured`, `is_hot`, `is_bestseller`, `cover_image`, `banner_image`, `description`, `tags`, `screenshots`, `video_url`, `system_req`) VALUES (6, 'Resident Evil 4 Remake - Gold Edition', 'เรซิเดนต์อีวิล 4 รีเมค โกลด์ เอดิชัน', 'Horror / Action', '[\"PC\",\"PS5\",\"Xbox Series X\"]', 1190, 1690, 30, 4.9, 31200, '2023-03-24', 'CAPCOM', 0, 1, 0, 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80', 'การกลับมาของผลงานระดับมาสเตอร์พีซของเกมสยองขวัญเอาชีวิตรอด ลีออน เอส. เคนเนดี ได้รับภารกิจบุกหมู่บ้านลี้ลับในยุโรปเพื่อช่วยลูกสาวประธานาธิบดี มาพร้อมเนื้อเรื่องเสริม Separate Ways ของ Ada Wong ครบชุด', '[\"Horror\",\"Survival\",\"Action\",\"Zombies\",\"Remake\"]', '[\"https:\\/\\/images.unsplash.com\\/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80\"]', 'https://www.youtube.com/embed/j5Xv2lM9dVU', '{\"minimum\":{\"os\":\"Windows 10 (64 bit)\",\"cpu\":\"AMD Ryzen 3 1200 \\/ Intel Core i5-7500\",\"ram\":\"8 GB RAM\",\"gpu\":\"AMD Radeon RX 560 4GB \\/ NVIDIA GeForce GTX 1050 Ti 4GB\",\"storage\":\"65 GB SSD\"},\"recommended\":{\"os\":\"Windows 10\\/11 (64 bit)\",\"cpu\":\"AMD Ryzen 5 3600 \\/ Intel Core i7 8700\",\"ram\":\"16 GB RAM\",\"gpu\":\"AMD Radeon RX 5700 \\/ NVIDIA GeForce GTX 1070\",\"storage\":\"65 GB SSD\"}}');
INSERT INTO `games` (`id`, `title`, `title_th`, `category`, `platforms`, `price`, `original_price`, `discount`, `rating`, `reviews_count`, `release_date`, `publisher`, `is_featured`, `is_hot`, `is_bestseller`, `cover_image`, `banner_image`, `description`, `tags`, `screenshots`, `video_url`, `system_req`) VALUES (7, 'Valorant Radiant Points Pack (5,350 VP)', 'วาโลแรนต์ พ้อยท์ 5,350 VP (คีย์เติมเงิน)', 'Gift Card / Topup', '[\"PC\"]', 1450, 1550, 6, 4.9, 68400, '2024-01-01', 'Riot Games', 0, 1, 1, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80', 'รหัสเติมเงินเกม Valorant บัญชีเซิร์ฟเวอร์ประเทศไทยและเอเชีย (TH / APAC) เติมเข้าทันที 5,350 Valorant Points สำหรับซื้อสกินปืน Battle Pass หรือบันเดิลแรร์ล่าสุด', '[\"Gift Card\",\"Topup\",\"FPS\",\"Esports\",\"Instant Key\"]', '[\"https:\\/\\/images.unsplash.com\\/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80\"]', '', '{\"minimum\":{\"os\":\"Windows 10\\/11 64-bit\",\"cpu\":\"Intel Core 2 Duo E8400 \\/ AMD Athlon 200GE\",\"ram\":\"4 GB RAM\",\"gpu\":\"Intel HD 4000 \\/ AMD Radeon R5 200\",\"storage\":\"30 GB\"},\"recommended\":{\"os\":\"Windows 10\\/11 64-bit\",\"cpu\":\"Intel i3-4150 \\/ AMD Ryzen 3 1200\",\"ram\":\"8 GB RAM\",\"gpu\":\"GeForce GT 730 \\/ Radeon R7 240\",\"storage\":\"30 GB SSD\"}}');
INSERT INTO `games` (`id`, `title`, `title_th`, `category`, `platforms`, `price`, `original_price`, `discount`, `rating`, `reviews_count`, `release_date`, `publisher`, `is_featured`, `is_hot`, `is_bestseller`, `cover_image`, `banner_image`, `description`, `tags`, `screenshots`, `video_url`, `system_req`) VALUES (8, 'Final Fantasy VII Rebirth', 'ไฟนอล แฟนตาซี VII รีเบิร์ธ', 'Action RPG', '[\"PS5\",\"PC\"]', 1990, 2290, 13, 4.9, 18700, '2024-02-29', 'Square Enix', 1, 1, 0, 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80', 'บทต่อของการผจญภัยระดับตำนาน Cloud, Tifa, Aerith และ Barret ออกเดินทางพ้นกำแพงมิดการ์สู่โลกกว้างอันไพศาลเพื่อหยุดยั้ง Sephiroth การผสมผสานระหว่างระบบต่อสู้แบบแอ็กชันและวางแผนเชิงกลยุทธ์', '[\"JRPG\",\"Story Rich\",\"Action RPG\",\"Open World\",\"Fantasy\"]', '[\"https:\\/\\/images.unsplash.com\\/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80\"]', 'https://www.youtube.com/embed/1L6XQyX7d78', '{\"minimum\":{\"os\":\"PlayStation 5 Console หรือ Windows 11\",\"cpu\":\"Core i7-8700K \\/ Ryzen 5 3600\",\"ram\":\"16 GB RAM\",\"gpu\":\"RTX 2070 8GB \\/ Radeon RX 5700 XT\",\"storage\":\"150 GB SSD\"},\"recommended\":{\"os\":\"Windows 11 64-bit\",\"cpu\":\"Core i7-13700K \\/ Ryzen 7 7800X3D\",\"ram\":\"32 GB RAM\",\"gpu\":\"RTX 4070 Ti \\/ Radeon RX 7900 XT\",\"storage\":\"150 GB NVMe SSD\"}}');
INSERT INTO `games` (`id`, `title`, `title_th`, `category`, `platforms`, `price`, `original_price`, `discount`, `rating`, `reviews_count`, `release_date`, `publisher`, `is_featured`, `is_hot`, `is_bestseller`, `cover_image`, `banner_image`, `description`, `tags`, `screenshots`, `video_url`, `system_req`) VALUES (9, 'Forza Horizon 5: Premium Edition', 'ฟอร์ซา ฮอไรซอน 5 พรีเมียม', 'Racing / Sports', '[\"PC\",\"Xbox Series X\"]', 1045, 2090, 50, 4.8, 45600, '2021-11-09', 'Xbox Game Studios', 0, 0, 1, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80', 'สุดยอดเกมแข่งรถโอเพนเวิลด์ชั้นนำระดับโลก ซิ่งทะยานผ่านภูมิประเทศอันงดงามและมีชีวิตชีวาของเม็กซิโก พร้อมรถยนต์หรูและซูเปอร์คาร์กว่า 700 คัน', '[\"Racing\",\"Open World\",\"Driving\",\"Multiplayer\",\"Simulation\"]', '[\"https:\\/\\/images.unsplash.com\\/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80\"]', 'https://www.youtube.com/embed/FYH9n37B7Yw', '{\"minimum\":{\"os\":\"Windows 10 version 15063.0 or higher\",\"cpu\":\"Intel i5-4460 or AMD Ryzen 3 1200\",\"ram\":\"8 GB RAM\",\"gpu\":\"NVidia GTX 970 OR AMD RX 470\",\"storage\":\"110 GB SSD\"},\"recommended\":{\"os\":\"Windows 10\\/11 64-bit\",\"cpu\":\"Intel i7-10700K or AMD Ryzen 7 3800XT\",\"ram\":\"16 GB RAM\",\"gpu\":\"NVidia RTX 2070 OR AMD RX 6700 XT\",\"storage\":\"110 GB SSD\"}}');
INSERT INTO `games` (`id`, `title`, `title_th`, `category`, `platforms`, `price`, `original_price`, `discount`, `rating`, `reviews_count`, `release_date`, `publisher`, `is_featured`, `is_hot`, `is_bestseller`, `cover_image`, `banner_image`, `description`, `tags`, `screenshots`, `video_url`, `system_req`) VALUES (10, 'Baldur\'s Gate 3 - Digital Deluxe', 'บัลดรูส์ เกท 3 ดิจิทัล ดีลักซ์', 'Strategy / RPG', '[\"PC\",\"PS5\",\"Xbox Series X\"]', 1490, 1790, 17, 4.9, 89000, '2023-08-03', 'Larian Studios', 1, 1, 1, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80', 'ผู้ชนะรางวัล Game of the Year 2023 เกม RPG เทิร์นเบสที่มีอิสระในการตัดสินใจระดับไร้ขีดจำกัด สร้างเรื่องราวของคุณเองในโลก Dungeons & Dragons ร่วมกับสหายที่มีมิติและบุคลิกเฉพาะตัว', '[\"RPG\",\"Story Rich\",\"Turn-Based\",\"Choices Matter\",\"Co-op\"]', '[\"https:\\/\\/images.unsplash.com\\/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80\"]', 'https://www.youtube.com/embed/1T22wN1BIzU', '{\"minimum\":{\"os\":\"Windows 10 64-bit\",\"cpu\":\"Intel I5 4690 \\/ AMD FX 8350\",\"ram\":\"8 GB RAM\",\"gpu\":\"Nvidia GTX 970 \\/ RX 480 (4GB+ of VRAM)\",\"storage\":\"150 GB SSD\"},\"recommended\":{\"os\":\"Windows 10\\/11 64-bit\",\"cpu\":\"Intel i7 8700K \\/ AMD r5 3600\",\"ram\":\"16 GB RAM\",\"gpu\":\"Nvidia 2060 Super \\/ RX 5700 XT (8GB+ of VRAM)\",\"storage\":\"150 GB SSD\"}}');
INSERT INTO `games` (`id`, `title`, `title_th`, `category`, `platforms`, `price`, `original_price`, `discount`, `rating`, `reviews_count`, `release_date`, `publisher`, `is_featured`, `is_hot`, `is_bestseller`, `cover_image`, `banner_image`, `description`, `tags`, `screenshots`, `video_url`, `system_req`) VALUES (11, 'Hogwarts Legacy: Digital Deluxe', 'ฮอกวอตส์ เลกาซี ดีลักซ์', 'Open World', '[\"PC\",\"PS5\",\"Xbox Series X\",\"Nintendo Switch\"]', 945, 1890, 50, 4.7, 56300, '2023-02-10', 'Warner Bros. Games', 0, 0, 1, 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80', 'สัมผัสชีวิตนักเรียนเวทมนตร์ในโรงเรียนฮอกวอตส์ยุคศตวรรษที่ 1800 ร่ายคาถา ปรุงน้ำยา เลี้ยงสัตว์วิเศษ และค้นพบความลับโบราณที่อาจคุกคามโลกแห่งเวทมนตร์', '[\"Magic\",\"Open World\",\"Fantasy\",\"Singleplayer\",\"Adventure\"]', '[\"https:\\/\\/images.unsplash.com\\/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80\"]', 'https://www.youtube.com/embed/1O6Qstn54Qo', '{\"minimum\":{\"os\":\"64-bit Windows 10\",\"cpu\":\"Intel Core i5-6600 (3.3Ghz) or AMD Ryzen 5 1400 (3.2Ghz)\",\"ram\":\"16 GB RAM\",\"gpu\":\"NVIDIA GeForce GTX 960 4GB or AMD Radeon RX 470 4GB\",\"storage\":\"85 GB SSD\"},\"recommended\":{\"os\":\"64-bit Windows 10\\/11\",\"cpu\":\"Intel Core i7-8700 (3.2Ghz) or AMD Ryzen 5 3600 (3.6 Ghz)\",\"ram\":\"16 GB RAM\",\"gpu\":\"NVIDIA GeForce 1080 Ti or AMD Radeon RX 5700 XT\",\"storage\":\"85 GB SSD\"}}');
INSERT INTO `games` (`id`, `title`, `title_th`, `category`, `platforms`, `price`, `original_price`, `discount`, `rating`, `reviews_count`, `release_date`, `publisher`, `is_featured`, `is_hot`, `is_bestseller`, `cover_image`, `banner_image`, `description`, `tags`, `screenshots`, `video_url`, `system_req`) VALUES (12, 'Palworld', 'พัลเวิลด์ (เพื่อนพาลผจญภัย)', 'Survival / Indie', '[\"PC\",\"Xbox Series X\",\"PS5\"]', 590, 590, 0, 4.8, 78200, '2024-01-19', 'Pocketpair', 0, 1, 1, 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80', 'เกมเอาชีวิตรอดและสะสมมอนสเตอร์ \'Pal\' สุดฮิต สร้างฐาน ทำฟาร์ม ผลิตอาวุธ และต่อสู้ในโลกกว้างร่วมกับเพื่อนๆ ออนไลน์', '[\"Survival\",\"Creature Collector\",\"Multiplayer\",\"Crafting\",\"Open World\"]', '[\"https:\\/\\/images.unsplash.com\\/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80\"]', 'https://www.youtube.com/embed/Yv013e2O0s8', '{\"minimum\":{\"os\":\"Windows 10 or later (64-Bit)\",\"cpu\":\"i5-3570K 3.4 GHz 4 Core\",\"ram\":\"16 GB RAM\",\"gpu\":\"GeForce GTX 1050 (2GB)\",\"storage\":\"40 GB SSD\"},\"recommended\":{\"os\":\"Windows 10 or later (64-Bit)\",\"cpu\":\"i9-9900K 3.6 GHz 8 Core\",\"ram\":\"32 GB RAM\",\"gpu\":\"GeForce RTX 2070\",\"storage\":\"40 GB SSD\"}}');
INSERT INTO `games` (`id`, `title`, `title_th`, `category`, `platforms`, `price`, `original_price`, `discount`, `rating`, `reviews_count`, `release_date`, `publisher`, `is_featured`, `is_hot`, `is_bestseller`, `cover_image`, `banner_image`, `description`, `tags`, `screenshots`, `video_url`, `system_req`) VALUES (13, 'Steam Wallet Code 1,000 THB', 'บัตรเติมเงิน Steam Wallet 1,000 บาท', 'Gift Card / Topup', '[\"PC\"]', 990, 1000, 1, 5, 120500, '2024-01-01', 'Valve Corporation', 0, 1, 1, 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80', 'รหัสเติมเงิน Steam Wallet มูลค่า 1,000 บาทไทย รหัสจัดส่งทันทีหลังจากชำระเงิน สามารถใช้ซื้อเกม ไอเทม Dota 2, CS2 หรือซอฟต์แวร์บน Steam ได้ทันที ไม่มีวันหมดอายุ', '[\"Steam\",\"Wallet\",\"Topup\",\"Instant Key\",\"Official\"]', '[\"https:\\/\\/images.unsplash.com\\/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80\"]', '', '{\"minimum\":{\"os\":\"Any OS\",\"cpu\":\"Standard\",\"ram\":\"1 GB\",\"gpu\":\"Standard\",\"storage\":\"100 MB\"},\"recommended\":{\"os\":\"Any OS\",\"cpu\":\"Standard\",\"ram\":\"2 GB\",\"gpu\":\"Standard\",\"storage\":\"100 MB\"}}');
INSERT INTO `games` (`id`, `title`, `title_th`, `category`, `platforms`, `price`, `original_price`, `discount`, `rating`, `reviews_count`, `release_date`, `publisher`, `is_featured`, `is_hot`, `is_bestseller`, `cover_image`, `banner_image`, `description`, `tags`, `screenshots`, `video_url`, `system_req`) VALUES (14, 'Red Dead Redemption 2: Ultimate Edition', 'เรด เดด รีดิมพ์ชัน 2 อัลติเมต', 'Open World', '[\"PC\",\"PS5\",\"Xbox Series X\"]', 699, 2290, 69, 4.9, 198000, '2019-11-05', 'Rockstar Games', 0, 0, 1, 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80', 'มหากาพย์แห่งคาวบอยตะวันตกยุคปลายกับ Arthur Morgan และแก๊ง Van der Linde เนื้อเรื่องระดับรางวัลวรรณกรรม โลกที่ละเอียดสมจริงที่สุดในประวัติศาสตร์วิดีโอเกม', '[\"Open World\",\"Story Rich\",\"Western\",\"Realistic\",\"Masterpiece\"]', '[\"https:\\/\\/images.unsplash.com\\/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80\"]', 'https://www.youtube.com/embed/eaW0tYPxyl0', '{\"minimum\":{\"os\":\"Windows 10 - April 2018 Update (v1803)\",\"cpu\":\"Intel Core i5-2500K \\/ AMD FX-6300\",\"ram\":\"8 GB RAM\",\"gpu\":\"Nvidia GeForce GTX 770 2GB \\/ AMD Radeon R9 280 3GB\",\"storage\":\"150 GB HDD\\/SSD\"},\"recommended\":{\"os\":\"Windows 10\\/11 64-bit\",\"cpu\":\"Intel Core i7-4770K \\/ AMD Ryzen 5 1500X\",\"ram\":\"12 GB RAM\",\"gpu\":\"Nvidia GeForce GTX 1060 6GB \\/ AMD Radeon RX 480 4GB\",\"storage\":\"150 GB SSD\"}}');
INSERT INTO `games` (`id`, `title`, `title_th`, `category`, `platforms`, `price`, `original_price`, `discount`, `rating`, `reviews_count`, `release_date`, `publisher`, `is_featured`, `is_hot`, `is_bestseller`, `cover_image`, `banner_image`, `description`, `tags`, `screenshots`, `video_url`, `system_req`) VALUES (15, 'EA SPORTS FC 24', 'อีเอ สปอร์ตส์ เอฟซี 24', 'Racing / Sports', '[\"PC\",\"PS5\",\"Xbox Series X\",\"Nintendo Switch\"]', 499, 1899, 74, 4.3, 34000, '2023-09-29', 'Electronic Arts', 0, 0, 1, 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80', 'ยุคใหม่ของเกมฟุตบอลระดับโลก ด้วยเทคโนโลยี HyperMotionV และ PlayStyles ที่ขับเคลื่อนนักเตะกว่า 19,000 คน จากกว่า 700 สโมสรทั่วโลก โหมด Ultimate Team และ Career สุดมันส์', '[\"Sports\",\"Football\",\"Soccer\",\"Multiplayer\",\"Competitive\"]', '[\"https:\\/\\/images.unsplash.com\\/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80\"]', 'https://www.youtube.com/embed/XhP3Xh4LMA8', '{\"minimum\":{\"os\":\"Windows 10 - 64-Bit\",\"cpu\":\"Intel Core i5-6600K @ 3.50GHz or AMD Ryzen 5 1600 @ 3.2 GHZ\",\"ram\":\"8 GB RAM\",\"gpu\":\"NVIDIA GeForce GTX 1050 Ti 4GB or AMD Radeon RX 570 4GB\",\"storage\":\"100 GB SSD\"},\"recommended\":{\"os\":\"Windows 10\\/11 - 64-Bit\",\"cpu\":\"Intel Core i7-6700 @ 3.40GHz or AMD Ryzen 7 2700X @ 3.7 GHZ\",\"ram\":\"12 GB RAM\",\"gpu\":\"NVIDIA GeForce GTX 1660 or AMD RX 5600 XT\",\"storage\":\"100 GB SSD\"}}');
INSERT INTO `games` (`id`, `title`, `title_th`, `category`, `platforms`, `price`, `original_price`, `discount`, `rating`, `reviews_count`, `release_date`, `publisher`, `is_featured`, `is_hot`, `is_bestseller`, `cover_image`, `banner_image`, `description`, `tags`, `screenshots`, `video_url`, `system_req`) VALUES (16, 'Marvel\'s Spider-Man 2', 'มาร์เวลส์ สไปเดอร์แมน 2', 'Action RPG', '[\"PS5\"]', 1890, 2290, 17, 4.9, 38200, '2023-10-20', 'Sony Interactive Entertainment', 1, 1, 1, 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=1200&q=80', 'สองไอ้แมงมุม ปีเตอร์ ปาร์คเกอร์ และ ไมลส์ โมราเลส รวมพลังปกป้องมหานครนิวยอร์กจากภัยคุกคามของ Venom และ Kraven the Hunter บินโฉบด้วย Web Wings และพลัง Symbiote สุดทรงพลัง', '[\"Superhero\",\"Action\",\"Open World\",\"Singleplayer\",\"Great Story\"]', '[\"https:\\/\\/images.unsplash.com\\/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80\"]', 'https://www.youtube.com/embed/9fVYKsEmuRo', '{\"minimum\":{\"os\":\"PlayStation 5 Console Exclusive\",\"cpu\":\"Custom AMD Zen 2\",\"ram\":\"16 GB GDDR6\",\"gpu\":\"Custom RDNA 2\",\"storage\":\"98 GB SSD\"},\"recommended\":{\"os\":\"PlayStation 5 Console Exclusive\",\"cpu\":\"Custom AMD Zen 2\",\"ram\":\"16 GB GDDR6\",\"gpu\":\"Custom RDNA 2\",\"storage\":\"98 GB SSD\"}}');
