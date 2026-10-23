<?php
// api/generate_sql.php

$content = file_get_contents(__DIR__ . '/../js/games-data.js');

preg_match('/const INITIAL_GAMES_DATA\s*=\s*(\[[\s\S]*?\]);\s*\/\/\s*Coupons/i', $content, $m);
preg_match('/const COUPONS_DATA\s*=\s*(\{[\s\S]*?\});\s*\/\/\s*Pre-configured/i', $content, $m2);
preg_match('/const INITIAL_USERS_DATA\s*=\s*(\[[\s\S]*?\]);/i', $content, $m3);

function jsCleanToJson($js) {
    $clean = preg_replace('/\s+\/\/.*$/m', '', $js);
    $clean = preg_replace('/([{,]\s*)([a-zA-Z0-9_]+)\s*:/', '$1"$2":', $clean);
    $clean = preg_replace('/,\s*([\}\]])/', '$1', $clean);
    return $clean;
}

$games = json_decode(jsCleanToJson($m[1]), true);
$coupons = json_decode(jsCleanToJson($m2[1]), true);
$users = json_decode(jsCleanToJson($m3[1]), true);

$sql = <<<SQL
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

SQL;

function escapeSql($val) {
    if ($val === null) return 'NULL';
    if (is_bool($val)) return $val ? '1' : '0';
    if (is_numeric($val)) return $val;
    return "'" . addslashes((string)$val) . "'";
}

// 1. Insert Users
$sql .= "\n-- --------------------------------------------------------\n-- Dumping data for table `users`\n-- --------------------------------------------------------\n";
foreach ($users as $u) {
    $id = (int)$u['id'];
    $username = escapeSql($u['username']);
    $password = escapeSql($u['password']);
    $name = escapeSql($u['name']);
    $role = escapeSql($u['role']);
    $avatar = escapeSql($u['avatar']);
    $wallet = (float)$u['wallet'];
    $joined = escapeSql($u['joinedDate'] ?? date('Y-m-d'));
    $bio = escapeSql($u['bio'] ?? ($u['role'] === 'Admin' ? 'ผู้ดูแลระบบ AMPHOREUS และคลังเกม' : 'เกมเมอร์สายชิล ชอบเล่นเกมแนว RPG และ Open-world'));
    $sql .= "INSERT INTO `users` (`id`, `username`, `password`, `name`, `role`, `avatar`, `wallet`, `joined_date`, `bio`) VALUES ($id, $username, $password, $name, $role, $avatar, $wallet, $joined, $bio);\n";
    $sql .= "INSERT INTO `profile_prefs` (`user_id`, `sound_enabled`, `notif_promos`, `notif_orders`, `notif_wishlist`, `currency`, `language`) VALUES ($id, 1, 1, 1, 1, 'THB', 'th');\n";
}

// 2. Insert Coupons
$sql .= "\n-- --------------------------------------------------------\n-- Dumping data for table `coupons`\n-- --------------------------------------------------------\n";
foreach ($coupons as $c) {
    $code = escapeSql($c['code']);
    $type = escapeSql($c['type']);
    $val = (float)$c['value'];
    $min = (float)$c['minSpend'];
    $desc = escapeSql($c['description']);
    $sql .= "INSERT INTO `coupons` (`code`, `type`, `value`, `min_spend`, `description`) VALUES ($code, $type, $val, $min, $desc);\n";
}

// 3. Insert Games
$sql .= "\n-- --------------------------------------------------------\n-- Dumping data for table `games`\n-- --------------------------------------------------------\n";
foreach ($games as $g) {
    $id = (int)$g['id'];
    $title = escapeSql($g['title']);
    $titleTh = escapeSql($g['titleTh'] ?? null);
    $category = escapeSql($g['category'] ?? 'Action');
    $platforms = escapeSql(json_encode($g['platforms'] ?? ['PC'], JSON_UNESCAPED_UNICODE));
    $price = (float)$g['price'];
    $origPrice = (float)($g['originalPrice'] ?? $g['price']);
    $discount = (int)($g['discount'] ?? 0);
    $rating = (float)($g['rating'] ?? 5.0);
    $reviews = (int)($g['reviewsCount'] ?? 0);
    $release = escapeSql($g['releaseDate'] ?? date('Y-m-d'));
    $pub = escapeSql($g['publisher'] ?? '');
    $isFeat = !empty($g['isFeatured']) ? 1 : 0;
    $isHot = !empty($g['isHot']) ? 1 : 0;
    $isBest = !empty($g['isBestSeller']) ? 1 : 0;
    $cover = escapeSql($g['coverImage'] ?? '');
    $banner = escapeSql($g['bannerImage'] ?? '');
    $desc = escapeSql($g['description'] ?? '');
    $tags = escapeSql(json_encode($g['tags'] ?? [], JSON_UNESCAPED_UNICODE));
    $screens = escapeSql(json_encode($g['screenshots'] ?? [], JSON_UNESCAPED_UNICODE));
    $video = escapeSql($g['videoUrl'] ?? '');
    $req = escapeSql(json_encode($g['systemReq'] ?? [], JSON_UNESCAPED_UNICODE));

    $sql .= "INSERT INTO `games` (`id`, `title`, `title_th`, `category`, `platforms`, `price`, `original_price`, `discount`, `rating`, `reviews_count`, `release_date`, `publisher`, `is_featured`, `is_hot`, `is_bestseller`, `cover_image`, `banner_image`, `description`, `tags`, `screenshots`, `video_url`, `system_req`) VALUES ($id, $title, $titleTh, $category, $platforms, $price, $origPrice, $discount, $rating, $reviews, $release, $pub, $isFeat, $isHot, $isBest, $cover, $banner, $desc, $tags, $screens, $video, $req);\n";
}

file_put_contents(__DIR__ . '/../database.sql', $sql);
file_put_contents(__DIR__ . '/../amphoreus_db.sql', $sql);
echo "SQL files generated successfully!\n";
