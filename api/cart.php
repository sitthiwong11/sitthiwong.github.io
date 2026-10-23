<?php
// api/cart.php - User Shopping Cart API
require_once __DIR__ . '/db.php';

$pdo = getDbConnection(true);
if (!$pdo) {
    json_error('Database connection failed', 500);
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$input = get_json_input();

function getUserCart($pdo, $userId) {
    $stmt = $pdo->prepare("SELECT c.id AS cart_id, c.platform, c.quantity, g.* 
        FROM `carts` c 
        JOIN `games` g ON c.game_id = g.id 
        WHERE c.user_id = ? 
        ORDER BY c.id ASC");
    $stmt->execute([(int)$userId]);
    $items = [];
    while ($row = $stmt->fetch()) {
        $items[] = [
            'cartId' => (int)$row['cart_id'],
            'id' => (int)$row['id'],
            'title' => $row['title'],
            'titleTh' => $row['title_th'] ?? '',
            'price' => (float)$row['price'],
            'originalPrice' => (float)$row['original_price'],
            'discount' => (int)$row['discount'],
            'coverImage' => $row['cover_image'] ?? '',
            'platform' => $row['platform'],
            'quantity' => (int)$row['quantity']
        ];
    }
    return $items;
}

// -------------------------------------------------------------
// GET: Fetch cart items for user
// -------------------------------------------------------------
if ($method === 'GET') {
    $userId = (int)($_GET['user_id'] ?? 0);
    if ($userId <= 0) {
        json_response(['success' => true, 'cart' => []]);
    }
    $cart = getUserCart($pdo, $userId);
    json_response(['success' => true, 'cart' => $cart]);
}

// -------------------------------------------------------------
// POST: Add, Sync, Update Quantity, Remove, Clear
// -------------------------------------------------------------
if ($method === 'POST') {
    $action = $input['action'] ?? 'sync';
    $userId = (int)($input['user_id'] ?? 0);

    if ($userId <= 0) {
        json_error('User id is required');
    }

    // 1. SYNC FULL CART
    if ($action === 'sync') {
        $cartItems = $input['cart'] ?? [];
        
        $stmt = $pdo->prepare("DELETE FROM `carts` WHERE `user_id` = ?");
        $stmt->execute([$userId]);

        if (!empty($cartItems) && is_array($cartItems)) {
            $insert = $pdo->prepare("INSERT INTO `carts` (`user_id`, `game_id`, `platform`, `quantity`) VALUES (?, ?, ?, ?)");
            foreach ($cartItems as $item) {
                $gameId = (int)($item['id'] ?? $item['game_id'] ?? 0);
                $platform = $item['platform'] ?? 'PC';
                $qty = max(1, (int)($item['quantity'] ?? 1));
                if ($gameId > 0) {
                    $insert->execute([$userId, $gameId, $platform, $qty]);
                }
            }
        }

        json_response(['success' => true, 'cart' => getUserCart($pdo, $userId)]);
    }

    // 2. ADD TO CART
    if ($action === 'add') {
        $gameId = (int)($input['game_id'] ?? $input['id'] ?? 0);
        $platform = $input['platform'] ?? 'PC';

        if ($gameId <= 0) json_error('Game id is required');

        $stmt = $pdo->prepare("SELECT `id`, `quantity` FROM `carts` WHERE `user_id` = ? AND `game_id` = ? AND `platform` = ?");
        $stmt->execute([$userId, $gameId, $platform]);
        $existing = $stmt->fetch();

        if ($existing) {
            $update = $pdo->prepare("UPDATE `carts` SET `quantity` = `quantity` + 1 WHERE `id` = ?");
            $update->execute([$existing['id']]);
        } else {
            $insert = $pdo->prepare("INSERT INTO `carts` (`user_id`, `game_id`, `platform`, `quantity`) VALUES (?, ?, ?, 1)");
            $insert->execute([$userId, $gameId, $platform]);
        }

        json_response(['success' => true, 'cart' => getUserCart($pdo, $userId)]);
    }

    // 3. UPDATE QUANTITY
    if ($action === 'update_quantity') {
        $gameId = (int)($input['game_id'] ?? $input['id'] ?? 0);
        $platform = $input['platform'] ?? 'PC';
        $delta = (int)($input['delta'] ?? 0);

        if ($gameId <= 0) json_error('Game id is required');

        $stmt = $pdo->prepare("SELECT `id`, `quantity` FROM `carts` WHERE `user_id` = ? AND `game_id` = ? AND `platform` = ?");
        $stmt->execute([$userId, $gameId, $platform]);
        $row = $stmt->fetch();

        if ($row) {
            $newQty = (int)$row['quantity'] + $delta;
            if ($newQty <= 0) {
                $del = $pdo->prepare("DELETE FROM `carts` WHERE `id` = ?");
                $del->execute([$row['id']]);
            } else {
                $upd = $pdo->prepare("UPDATE `carts` SET `quantity` = ? WHERE `id` = ?");
                $upd->execute([$newQty, $row['id']]);
            }
        }

        json_response(['success' => true, 'cart' => getUserCart($pdo, $userId)]);
    }

    // 4. REMOVE ITEM
    if ($action === 'remove') {
        $gameId = (int)($input['game_id'] ?? $input['id'] ?? 0);
        $platform = $input['platform'] ?? 'PC';

        $stmt = $pdo->prepare("DELETE FROM `carts` WHERE `user_id` = ? AND `game_id` = ? AND `platform` = ?");
        $stmt->execute([$userId, $gameId, $platform]);

        json_response(['success' => true, 'cart' => getUserCart($pdo, $userId)]);
    }

    // 5. CLEAR CART
    if ($action === 'clear') {
        $stmt = $pdo->prepare("DELETE FROM `carts` WHERE `user_id` = ?");
        $stmt->execute([$userId]);
        json_response(['success' => true, 'cart' => []]);
    }
}

json_error('Invalid request', 400);
