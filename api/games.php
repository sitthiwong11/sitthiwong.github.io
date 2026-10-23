<?php
// api/games.php - Games Catalog API (CRUD)
require_once __DIR__ . '/db.php';

$pdo = getDbConnection(true);
if (!$pdo) {
    json_error('Database connection failed', 500);
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$input = get_json_input();

function formatGameRow($row) {
    return [
        'id' => (int)$row['id'],
        'title' => $row['title'],
        'titleTh' => $row['title_th'] ?? '',
        'category' => $row['category'] ?? 'General',
        'platforms' => !empty($row['platforms']) ? json_decode($row['platforms'], true) : ['PC'],
        'price' => (float)$row['price'],
        'originalPrice' => (float)$row['original_price'],
        'discount' => (int)$row['discount'],
        'rating' => (float)$row['rating'],
        'reviewsCount' => (int)$row['reviews_count'],
        'releaseDate' => $row['release_date'] ?? '',
        'publisher' => $row['publisher'] ?? '',
        'isFeatured' => (bool)$row['is_featured'],
        'isHot' => (bool)$row['is_hot'],
        'isBestSeller' => (bool)$row['is_bestseller'],
        'coverImage' => $row['cover_image'] ?? '',
        'bannerImage' => $row['banner_image'] ?? '',
        'description' => $row['description'] ?? '',
        'tags' => !empty($row['tags']) ? json_decode($row['tags'], true) : [],
        'screenshots' => !empty($row['screenshots']) ? json_decode($row['screenshots'], true) : [],
        'videoUrl' => $row['video_url'] ?? '',
        'systemReq' => !empty($row['system_req']) ? json_decode($row['system_req'], true) : new stdClass(),
    ];
}

// -------------------------------------------------------------
// GET: Fetch all games or single game
// -------------------------------------------------------------
if ($method === 'GET') {
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare("SELECT * FROM `games` WHERE `id` = ?");
        $stmt->execute([(int)$_GET['id']]);
        $row = $stmt->fetch();
        if (!$row) {
            json_error('Game not found', 404);
        }
        json_response(['success' => true, 'game' => formatGameRow($row)]);
    }

    $stmt = $pdo->query("SELECT * FROM `games` ORDER BY `id` ASC");
    $games = [];
    while ($row = $stmt->fetch()) {
        $games[] = formatGameRow($row);
    }
    json_response(['success' => true, 'games' => $games]);
}

// -------------------------------------------------------------
// POST: Create or Update game
// -------------------------------------------------------------
if ($method === 'POST') {
    $action = $input['action'] ?? (isset($input['id']) && (int)$input['id'] > 0 ? 'update' : 'create');

    if ($action === 'create') {
        $title = trim($input['title'] ?? '');
        if (empty($title)) {
            json_error('Game title is required');
        }

        $titleTh = $input['titleTh'] ?? $input['title_th'] ?? '';
        $category = $input['category'] ?? 'Action RPG';
        $platforms = json_encode($input['platforms'] ?? ['PC'], JSON_UNESCAPED_UNICODE);
        $price = (float)($input['price'] ?? 0);
        $originalPrice = (float)($input['originalPrice'] ?? $input['original_price'] ?? $price);
        $discount = (int)($input['discount'] ?? 0);
        $rating = (float)($input['rating'] ?? 5.0);
        $reviewsCount = (int)($input['reviewsCount'] ?? $input['reviews_count'] ?? 100);
        $releaseDate = $input['releaseDate'] ?? $input['release_date'] ?? date('Y-m-d');
        $publisher = $input['publisher'] ?? '';
        $isFeatured = !empty($input['isFeatured']) || !empty($input['is_featured']) ? 1 : 0;
        $isHot = !empty($input['isHot']) || !empty($input['is_hot']) ? 1 : 0;
        $isBestSeller = !empty($input['isBestSeller']) || !empty($input['is_bestseller']) ? 1 : 0;
        $coverImage = $input['coverImage'] ?? $input['cover_image'] ?? '';
        $bannerImage = $input['bannerImage'] ?? $input['banner_image'] ?? $coverImage;
        $description = $input['description'] ?? '';
        $tags = json_encode($input['tags'] ?? [], JSON_UNESCAPED_UNICODE);
        $screenshots = json_encode($input['screenshots'] ?? [], JSON_UNESCAPED_UNICODE);
        $videoUrl = $input['videoUrl'] ?? $input['video_url'] ?? '';
        $systemReq = json_encode($input['systemReq'] ?? $input['system_req'] ?? new stdClass(), JSON_UNESCAPED_UNICODE);

        $stmt = $pdo->prepare("INSERT INTO `games` 
            (`title`, `title_th`, `category`, `platforms`, `price`, `original_price`, `discount`, `rating`, `reviews_count`, `release_date`, `publisher`, `is_featured`, `is_hot`, `is_bestseller`, `cover_image`, `banner_image`, `description`, `tags`, `screenshots`, `video_url`, `system_req`) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        $stmt->execute([
            $title, $titleTh, $category, $platforms, $price, $originalPrice, $discount, $rating, $reviewsCount,
            $releaseDate, $publisher, $isFeatured, $isHot, $isBestSeller, $coverImage, $bannerImage,
            $description, $tags, $screenshots, $videoUrl, $systemReq
        ]);

        $newId = (int)$pdo->lastInsertId();
        $stmt = $pdo->prepare("SELECT * FROM `games` WHERE `id` = ?");
        $stmt->execute([$newId]);
        $newGame = formatGameRow($stmt->fetch());

        json_response(['success' => true, 'message' => 'Game added successfully', 'game' => $newGame], 201);
    }

    if ($action === 'update') {
        $id = (int)($input['id'] ?? 0);
        if ($id <= 0) {
            json_error('Invalid game id');
        }

        $title = trim($input['title'] ?? '');
        if (empty($title)) {
            json_error('Game title is required');
        }

        $titleTh = $input['titleTh'] ?? $input['title_th'] ?? '';
        $category = $input['category'] ?? 'Action RPG';
        $platforms = json_encode($input['platforms'] ?? ['PC'], JSON_UNESCAPED_UNICODE);
        $price = (float)($input['price'] ?? 0);
        $originalPrice = (float)($input['originalPrice'] ?? $input['original_price'] ?? $price);
        $discount = (int)($input['discount'] ?? 0);
        $rating = (float)($input['rating'] ?? 5.0);
        $reviewsCount = (int)($input['reviewsCount'] ?? $input['reviews_count'] ?? 100);
        $releaseDate = $input['releaseDate'] ?? $input['release_date'] ?? date('Y-m-d');
        $publisher = $input['publisher'] ?? '';
        $isFeatured = !empty($input['isFeatured']) || !empty($input['is_featured']) ? 1 : 0;
        $isHot = !empty($input['isHot']) || !empty($input['is_hot']) ? 1 : 0;
        $isBestSeller = !empty($input['isBestSeller']) || !empty($input['is_bestseller']) ? 1 : 0;
        $coverImage = $input['coverImage'] ?? $input['cover_image'] ?? '';
        $bannerImage = $input['bannerImage'] ?? $input['banner_image'] ?? $coverImage;
        $description = $input['description'] ?? '';
        $tags = json_encode($input['tags'] ?? [], JSON_UNESCAPED_UNICODE);
        $screenshots = json_encode($input['screenshots'] ?? [], JSON_UNESCAPED_UNICODE);
        $videoUrl = $input['videoUrl'] ?? $input['video_url'] ?? '';
        $systemReq = json_encode($input['systemReq'] ?? $input['system_req'] ?? new stdClass(), JSON_UNESCAPED_UNICODE);

        $stmt = $pdo->prepare("UPDATE `games` SET 
            `title` = ?, `title_th` = ?, `category` = ?, `platforms` = ?, `price` = ?, `original_price` = ?, 
            `discount` = ?, `rating` = ?, `reviews_count` = ?, `release_date` = ?, `publisher` = ?, 
            `is_featured` = ?, `is_hot` = ?, `is_bestseller` = ?, `cover_image` = ?, `banner_image` = ?, 
            `description` = ?, `tags` = ?, `screenshots` = ?, `video_url` = ?, `system_req` = ? 
            WHERE `id` = ?");
        
        $stmt->execute([
            $title, $titleTh, $category, $platforms, $price, $originalPrice, $discount, $rating, $reviewsCount,
            $releaseDate, $publisher, $isFeatured, $isHot, $isBestSeller, $coverImage, $bannerImage,
            $description, $tags, $screenshots, $videoUrl, $systemReq, $id
        ]);

        $stmt = $pdo->prepare("SELECT * FROM `games` WHERE `id` = ?");
        $stmt->execute([$id]);
        $updatedGame = formatGameRow($stmt->fetch());

        json_response(['success' => true, 'message' => 'Game updated successfully', 'game' => $updatedGame]);
    }

    if ($action === 'delete') {
        $id = (int)($input['id'] ?? 0);
        if ($id <= 0) {
            json_error('Invalid game id');
        }
        $stmt = $pdo->prepare("DELETE FROM `games` WHERE `id` = ?");
        $stmt->execute([$id]);
        json_response(['success' => true, 'message' => 'Game deleted successfully', 'deletedId' => $id]);
    }
}

// -------------------------------------------------------------
// DELETE method
// -------------------------------------------------------------
if ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? $input['id'] ?? 0);
    if ($id <= 0) {
        json_error('Invalid game id');
    }
    $stmt = $pdo->prepare("DELETE FROM `games` WHERE `id` = ?");
    $stmt->execute([$id]);
    json_response(['success' => true, 'message' => 'Game deleted successfully', 'deletedId' => $id]);
}

json_error('Invalid request method', 405);
