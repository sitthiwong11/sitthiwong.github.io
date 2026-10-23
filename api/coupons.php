<?php
// api/coupons.php - Coupon Management API
require_once __DIR__ . '/db.php';

$pdo = getDbConnection(true);
if (!$pdo) {
    json_error('Database connection failed', 500);
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$input = get_json_input();

function formatCouponRow($row) {
    return [
        'id' => (int)$row['id'],
        'code' => strtoupper($row['code']),
        'type' => $row['type'],
        'value' => (float)$row['value'],
        'minSpend' => (float)$row['min_spend'],
        'description' => $row['description'] ?? '',
        'createdAt' => $row['created_at'] ?? ''
    ];
}

// -------------------------------------------------------------
// GET: Fetch all coupons
// -------------------------------------------------------------
if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM `coupons` ORDER BY `id` ASC");
    $dict = [];
    $list = [];
    while ($row = $stmt->fetch()) {
        $item = formatCouponRow($row);
        $dict[$item['code']] = $item;
        $list[] = $item;
    }
    json_response([
        'success' => true, 
        'coupons' => $dict, // Key-value object for frontend compatibility
        'couponsList' => $list
    ]);
}

// -------------------------------------------------------------
// POST: Add coupon or Delete coupon
// -------------------------------------------------------------
if ($method === 'POST') {
    $action = $input['action'] ?? 'add';

    if ($action === 'add') {
        $code = strtoupper(trim($input['code'] ?? ''));
        $type = $input['type'] ?? 'percent';
        $val = (float)($input['value'] ?? 0);
        $minSpend = (float)($input['minSpend'] ?? $input['min_spend'] ?? 0);
        $desc = trim($input['description'] ?? '');

        if (empty($code) || $val <= 0) {
            json_error('กรุณาระบุโค้ดส่วนลดและมูลค่าให้ถูกต้อง');
        }

        // Check duplicate
        $stmt = $pdo->prepare("SELECT `id` FROM `coupons` WHERE `code` = ?");
        $stmt->execute([$code]);
        if ($stmt->fetch()) {
            json_error("โค้ด $code มีอยู่ในระบบแล้ว");
        }

        $stmt = $pdo->prepare("INSERT INTO `coupons` (`code`, `type`, `value`, `min_spend`, `description`) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$code, $type, $val, $minSpend, $desc]);

        $newId = (int)$pdo->lastInsertId();
        $stmt = $pdo->prepare("SELECT * FROM `coupons` WHERE `id` = ?");
        $stmt->execute([$newId]);
        $newCoupon = formatCouponRow($stmt->fetch());

        json_response([
            'success' => true,
            'message' => "สร้างคูปอง $code สำเร็จ",
            'coupon' => $newCoupon
        ], 201);
    }

    if ($action === 'delete') {
        $code = strtoupper(trim($input['code'] ?? ''));
        if (empty($code)) {
            json_error('ระบุโค้ดคูปองที่ต้องการลบ');
        }

        $stmt = $pdo->prepare("DELETE FROM `coupons` WHERE `code` = ?");
        $stmt->execute([$code]);

        json_response([
            'success' => true,
            'message' => "ลบคูปอง $code สำเร็จ"
        ]);
    }
}

if ($method === 'DELETE') {
    $code = strtoupper(trim($_GET['code'] ?? $input['code'] ?? ''));
    if (empty($code)) {
        json_error('ระบุโค้ดคูปองที่ต้องการลบ');
    }

    $stmt = $pdo->prepare("DELETE FROM `coupons` WHERE `code` = ?");
    $stmt->execute([$code]);

    json_response(['success' => true, 'message' => "ลบคูปอง $code สำเร็จ"]);
}

json_error('Invalid request method', 405);
