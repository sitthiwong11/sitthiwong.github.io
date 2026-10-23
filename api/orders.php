<?php
// api/orders.php - Orders, Transactions & Checkout API
require_once __DIR__ . '/db.php';

$pdo = getDbConnection(true);
if (!$pdo) {
    json_error('Database connection failed', 500);
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$input = get_json_input();

function formatOrderRow($row) {
    return [
        'id' => (int)$row['id'],
        'orderId' => $row['order_id'],
        'userId' => (int)$row['user_id'],
        'userEmail' => $row['user_email'],
        'gameId' => (int)$row['game_id'],
        'gameTitle' => $row['game_title'],
        'coverImage' => $row['cover_image'] ?? '',
        'platform' => $row['platform'] ?? 'PC',
        'key' => $row['game_key'],
        'gameKey' => $row['game_key'],
        'price' => (float)$row['price'],
        'originalPrice' => (float)$row['original_price'],
        'discountApplied' => (int)$row['discount_applied'],
        'paymentMethod' => $row['payment_method'],
        'purchaseDate' => $row['purchase_date'],
        'createdAt' => $row['created_at'] ?? ''
    ];
}

function generateGameKey() {
    $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    $len = strlen($chars);
    $segments = [];
    for ($s = 0; $s < 4; $s++) {
        $seg = '';
        for ($i = 0; $i < 4; $i++) {
            $seg .= $chars[random_int(0, $len - 1)];
        }
        $segments[] = $seg;
    }
    return implode('-', $segments);
}

// -------------------------------------------------------------
// GET: Fetch transactions / library
// -------------------------------------------------------------
if ($method === 'GET') {
    $userId = (int)($_GET['user_id'] ?? 0);
    $userEmail = trim($_GET['user_email'] ?? '');

    if ($userId > 0) {
        $stmt = $pdo->prepare("SELECT * FROM `order_transactions` WHERE `user_id` = ? OR LOWER(`user_email`) = LOWER(?) ORDER BY `id` DESC");
        $stmt->execute([$userId, $userEmail]);
    } else {
        $stmt = $pdo->query("SELECT * FROM `order_transactions` ORDER BY `id` DESC");
    }

    $orders = [];
    while ($row = $stmt->fetch()) {
        $orders[] = formatOrderRow($row);
    }

    json_response(['success' => true, 'orders' => $orders]);
}

// -------------------------------------------------------------
// POST: Process Checkout
// -------------------------------------------------------------
if ($method === 'POST') {
    $action = $input['action'] ?? 'checkout';

    if ($action === 'checkout') {
        $userId = (int)($input['user_id'] ?? $input['userId'] ?? 0);
        $userEmail = trim($input['user_email'] ?? $input['userEmail'] ?? '');
        $paymentMethod = $input['payment_method'] ?? $input['paymentMethod'] ?? 'Wallet';
        $items = $input['items'] ?? [];
        $totalPrice = (float)($input['total_price'] ?? $input['totalPrice'] ?? 0);

        if (empty($items) || !is_array($items)) {
            json_error('ไม่มีรายการสินค้าในคำสั่งซื้อ');
        }

        // If paying by Wallet, verify and deduct balance
        $currentWallet = 0;
        if ($paymentMethod === 'Wallet') {
            if ($userId <= 0) {
                json_error('กรุณาเข้าสู่ระบบเพื่อชำระเงินผ่านกระเป๋าเงิน (Wallet)');
            }

            $userStmt = $pdo->prepare("SELECT `wallet`, `username` FROM `users` WHERE `id` = ?");
            $userStmt->execute([$userId]);
            $userData = $userStmt->fetch();

            if (!$userData) {
                json_error('ไม่พบข้อมูลผู้ใช้งาน');
            }

            $currentWallet = (float)$userData['wallet'];
            if ($currentWallet < $totalPrice) {
                json_error("ยอดเงินในกระเป๋าไม่เพียงพอ (คงเหลือ ฿" . number_format($currentWallet, 2) . " ขาดอีก ฿" . number_format($totalPrice - $currentWallet, 2) . ") กรุณาเติมเงินก่อนทำรายการ");
            }

            // Deduct wallet
            $deductStmt = $pdo->prepare("UPDATE `users` SET `wallet` = `wallet` - ? WHERE `id` = ?");
            $deductStmt->execute([$totalPrice, $userId]);
            $currentWallet -= $totalPrice;
        }

        // Generate Order ID & Records
        $orderId = 'ORD-' . strtoupper(substr(uniqid(), -6)) . '-' . random_int(100, 999);
        $purchaseDate = date('d/m/Y H:i:s');
        $createdRecords = [];

        $insOrder = $pdo->prepare("INSERT INTO `order_transactions` 
            (`order_id`, `user_id`, `user_email`, `game_id`, `game_title`, `cover_image`, `platform`, `game_key`, `price`, `original_price`, `discount_applied`, `payment_method`, `purchase_date`) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

        foreach ($items as $item) {
            $game = $item['game'] ?? $item;
            $gameId = (int)($game['id'] ?? 0);
            $gameTitle = $game['title'] ?? 'Game';
            $coverImage = $game['coverImage'] ?? $game['cover_image'] ?? '';
            $platform = $item['platform'] ?? 'PC';
            $gameKey = generateGameKey();
            $price = (float)($item['finalPrice'] ?? $game['price'] ?? 0);
            $originalPrice = (float)($game['originalPrice'] ?? $game['original_price'] ?? $price);
            $discount = (int)($game['discount'] ?? 0);

            $insOrder->execute([
                $orderId, $userId, $userEmail, $gameId, $gameTitle, $coverImage, $platform,
                $gameKey, $price, $originalPrice, $discount, $paymentMethod, $purchaseDate
            ]);

            $newRowId = (int)$pdo->lastInsertId();
            $getStmt = $pdo->prepare("SELECT * FROM `order_transactions` WHERE `id` = ?");
            $getStmt->execute([$newRowId]);
            $createdRecords[] = formatOrderRow($getStmt->fetch());
        }

        // Clear user's cart in MySQL
        if ($userId > 0) {
            $clearCart = $pdo->prepare("DELETE FROM `carts` WHERE `user_id` = ?");
            $clearCart->execute([$userId]);
        }

        json_response([
            'success' => true,
            'message' => 'ชำระเงินและออกคีย์เกมสำเร็จเรียบร้อยแล้ว!',
            'orderId' => $orderId,
            'orders' => $createdRecords,
            'wallet' => $currentWallet
        ], 201);
    }
}

json_error('Invalid request', 400);
