<?php
// api/wishlist.php - User Wishlist API
require_once __DIR__ . '/db.php';

$pdo = getDbConnection(true);
if (!$pdo) {
    json_error('Database connection failed', 500);
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$input = get_json_input();

function getUserWishlist($pdo, $userId) {
    $stmt = $pdo->prepare("SELECT `game_id` FROM `wishlists` WHERE `user_id` = ?");
    $stmt->execute([(int)$userId]);
    $ids = [];
    while ($row = $stmt->fetch()) {
        $ids[] = (int)$row['game_id'];
    }
    return $ids;
}

// -------------------------------------------------------------
// GET: Fetch wishlist IDs for user
// -------------------------------------------------------------
if ($method === 'GET') {
    $userId = (int)($_GET['user_id'] ?? 0);
    if ($userId <= 0) {
        json_response(['success' => true, 'wishlist' => []]);
    }
    json_response(['success' => true, 'wishlist' => getUserWishlist($pdo, $userId)]);
}

// -------------------------------------------------------------
// POST: Toggle Wishlist or Sync
// -------------------------------------------------------------
if ($method === 'POST') {
    $action = $input['action'] ?? 'toggle';
    $userId = (int)($input['user_id'] ?? 0);

    if ($userId <= 0) json_error('User id is required');

    if ($action === 'toggle') {
        $gameId = (int)($input['game_id'] ?? 0);
        if ($gameId <= 0) json_error('Game id is required');

        $stmt = $pdo->prepare("SELECT `id` FROM `wishlists` WHERE `user_id` = ? AND `game_id` = ?");
        $stmt->execute([$userId, $gameId]);
        $row = $stmt->fetch();

        if ($row) {
            $del = $pdo->prepare("DELETE FROM `wishlists` WHERE `id` = ?");
            $del->execute([$row['id']]);
            $added = false;
        } else {
            $ins = $pdo->prepare("INSERT INTO `wishlists` (`user_id`, `game_id`) VALUES (?, ?)");
            $ins->execute([$userId, $gameId]);
            $added = true;
        }

        json_response([
            'success' => true,
            'added' => $added,
            'wishlist' => getUserWishlist($pdo, $userId)
        ]);
    }

    if ($action === 'sync') {
        $ids = $input['wishlist'] ?? [];
        $stmt = $pdo->prepare("DELETE FROM `wishlists` WHERE `user_id` = ?");
        $stmt->execute([$userId]);

        if (!empty($ids) && is_array($ids)) {
            $ins = $pdo->prepare("INSERT IGNORE INTO `wishlists` (`user_id`, `game_id`) VALUES (?, ?)");
            foreach ($ids as $gid) {
                $ins->execute([$userId, (int)$gid]);
            }
        }

        json_response(['success' => true, 'wishlist' => getUserWishlist($pdo, $userId)]);
    }
}

json_error('Invalid request', 400);
