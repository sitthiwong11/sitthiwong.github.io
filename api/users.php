<?php
// api/users.php - User Authentication, Roles, Profile & Wallet API
require_once __DIR__ . '/db.php';

$pdo = getDbConnection(true);
if (!$pdo) {
    json_error('Database connection failed', 500);
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$input = get_json_input();

function formatUserRow($row) {
    return [
        'id' => (int)$row['id'],
        'username' => $row['username'],
        'password' => $row['password'],
        'name' => $row['name'],
        'role' => $row['role'],
        'avatar' => $row['avatar'] ?? '',
        'wallet' => (float)$row['wallet'],
        'joinedDate' => $row['joined_date'] ?? date('Y-m-d'),
        'bio' => $row['bio'] ?? '',
        'createdAt' => $row['created_at'] ?? ''
    ];
}

function getUserPrefs($pdo, $userId) {
    $stmt = $pdo->prepare("SELECT * FROM `profile_prefs` WHERE `user_id` = ?");
    $stmt->execute([(int)$userId]);
    $row = $stmt->fetch();
    if (!$row) {
        return [
            'soundEnabled' => true,
            'notifPromos' => true,
            'notifOrders' => true,
            'notifWishlist' => true,
            'currency' => 'THB',
            'language' => 'th'
        ];
    }
    return [
        'soundEnabled' => (bool)$row['sound_enabled'],
        'notifPromos' => (bool)$row['notif_promos'],
        'notifOrders' => (bool)$row['notif_orders'],
        'notifWishlist' => (bool)$row['notif_wishlist'],
        'currency' => $row['currency'],
        'language' => $row['language']
    ];
}

// -------------------------------------------------------------
// GET: Fetch all users or single user
// -------------------------------------------------------------
if ($method === 'GET') {
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare("SELECT * FROM `users` WHERE `id` = ?");
        $stmt->execute([(int)$_GET['id']]);
        $row = $stmt->fetch();
        if (!$row) json_error('User not found', 404);
        json_response([
            'success' => true, 
            'user' => formatUserRow($row),
            'prefs' => getUserPrefs($pdo, $row['id'])
        ]);
    }

    $stmt = $pdo->query("SELECT * FROM `users` ORDER BY `id` ASC");
    $users = [];
    while ($row = $stmt->fetch()) {
        $users[] = formatUserRow($row);
    }
    json_response(['success' => true, 'users' => $users]);
}

// -------------------------------------------------------------
// POST: Login, Register, Profile Updates, Roles, Wallet
// -------------------------------------------------------------
if ($method === 'POST') {
    $action = $input['action'] ?? 'login';

    // 1. LOGIN
    if ($action === 'login') {
        $username = trim($input['username'] ?? '');
        $password = trim($input['password'] ?? '');

        if (empty($username) || empty($password)) {
            json_error('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
        }

        $stmt = $pdo->prepare("SELECT * FROM `users` WHERE LOWER(`username`) = LOWER(?) LIMIT 1");
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        if (!$user) {
            json_error('ไม่พบบัญชีผู้ใช้นี้ในระบบ');
        }

        if ($user['password'] !== $password) {
            json_error('รหัสผ่านไม่ถูกต้อง');
        }

        $formatted = formatUserRow($user);
        $prefs = getUserPrefs($pdo, $user['id']);

        json_response([
            'success' => true,
            'message' => 'เข้าสู่ระบบสำเร็จ',
            'user' => $formatted,
            'prefs' => $prefs
        ]);
    }

    // 2. REGISTER
    if ($action === 'register') {
        $username = trim($input['username'] ?? '');
        $password = trim($input['password'] ?? '');
        $name = trim($input['name'] ?? '');

        if (empty($username) || empty($password) || empty($name)) {
            json_error('กรุณากรอกข้อมูลให้ครบทุกช่อง');
        }

        // Check if username already exists
        $stmt = $pdo->prepare("SELECT `id` FROM `users` WHERE LOWER(`username`) = LOWER(?) LIMIT 1");
        $stmt->execute([$username]);
        if ($stmt->fetch()) {
            json_error('ชื่อผู้ใช้หรืออีเมลนี้มีผู้ใช้งานแล้ว');
        }

        $avatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80";
        $wallet = 500.00; // Welcome credit
        $joinedDate = date('Y-m-d');
        $bio = 'สมาชิกใหม่ของ AMPHOREUS Game Store';

        $stmt = $pdo->prepare("INSERT INTO `users` (`username`, `password`, `name`, `role`, `avatar`, `wallet`, `joined_date`, `bio`) VALUES (?, ?, ?, 'Member', ?, ?, ?, ?)");
        $stmt->execute([$username, $password, $name, $avatar, $wallet, $joinedDate, $bio]);
        
        $newId = (int)$pdo->lastInsertId();

        // Create default profile prefs
        $prefStmt = $pdo->prepare("INSERT INTO `profile_prefs` (`user_id`, `sound_enabled`, `notif_promos`, `notif_orders`, `notif_wishlist`, `currency`, `language`) VALUES (?, 1, 1, 1, 1, 'THB', 'th')");
        $prefStmt->execute([$newId]);

        $stmt = $pdo->prepare("SELECT * FROM `users` WHERE `id` = ?");
        $stmt->execute([$newId]);
        $newUser = formatUserRow($stmt->fetch());

        json_response([
            'success' => true,
            'message' => 'สมัครสมาชิกสำเร็จ! ได้รับโบนัสเริ่มต้น 500 บาท',
            'user' => $newUser,
            'prefs' => getUserPrefs($pdo, $newId)
        ], 201);
    }

    // 3. UPDATE PROFILE
    if ($action === 'update_profile') {
        $userId = (int)($input['user_id'] ?? $input['id'] ?? 0);
        $name = trim($input['name'] ?? '');
        $bio = trim($input['bio'] ?? '');

        if ($userId <= 0 || empty($name)) {
            json_error('ข้อมูลโปรไฟล์ไม่ถูกต้อง');
        }

        $stmt = $pdo->prepare("UPDATE `users` SET `name` = ?, `bio` = ? WHERE `id` = ?");
        $stmt->execute([$name, $bio, $userId]);

        $stmt = $pdo->prepare("SELECT * FROM `users` WHERE `id` = ?");
        $stmt->execute([$userId]);
        json_response([
            'success' => true,
            'message' => 'บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว',
            'user' => formatUserRow($stmt->fetch())
        ]);
    }

    // 4. UPDATE AVATAR
    if ($action === 'update_avatar') {
        $userId = (int)($input['user_id'] ?? $input['id'] ?? 0);
        $avatar = trim($input['avatar'] ?? '');

        if ($userId <= 0 || empty($avatar)) {
            json_error('URL รูปโปรไฟล์ไม่ถูกต้อง');
        }

        $stmt = $pdo->prepare("UPDATE `users` SET `avatar` = ? WHERE `id` = ?");
        $stmt->execute([$avatar, $userId]);

        $stmt = $pdo->prepare("SELECT * FROM `users` WHERE `id` = ?");
        $stmt->execute([$userId]);
        json_response([
            'success' => true,
            'message' => 'เปลี่ยนรูปโปรไฟล์สำเร็จ',
            'user' => formatUserRow($stmt->fetch())
        ]);
    }

    // 5. UPDATE PASSWORD
    if ($action === 'update_password') {
        $userId = (int)($input['user_id'] ?? $input['id'] ?? 0);
        $oldPassword = trim($input['oldPassword'] ?? '');
        $newPassword = trim($input['newPassword'] ?? '');

        if ($userId <= 0 || empty($oldPassword) || empty($newPassword)) {
            json_error('กรุณากรอกรหัสผ่านเดิมและรหัสผ่านใหม่');
        }

        $stmt = $pdo->prepare("SELECT `password` FROM `users` WHERE `id` = ?");
        $stmt->execute([$userId]);
        $row = $stmt->fetch();
        if (!$row || $row['password'] !== $oldPassword) {
            json_error('รหัสผ่านปัจจุบันไม่ถูกต้อง');
        }

        $stmt = $pdo->prepare("UPDATE `users` SET `password` = ? WHERE `id` = ?");
        $stmt->execute([$newPassword, $userId]);

        json_response(['success' => true, 'message' => 'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว']);
    }

    // 6. TOGGLE ROLE (Admin / Member)
    if ($action === 'toggle_role') {
        $userId = (int)($input['user_id'] ?? $input['id'] ?? 0);
        if ($userId <= 0) json_error('Invalid user id');

        $stmt = $pdo->prepare("SELECT `role` FROM `users` WHERE `id` = ?");
        $stmt->execute([$userId]);
        $curr = $stmt->fetch();
        if (!$curr) json_error('User not found');

        $newRole = ($curr['role'] === 'Admin') ? 'Member' : 'Admin';
        $stmt = $pdo->prepare("UPDATE `users` SET `role` = ? WHERE `id` = ?");
        $stmt->execute([$newRole, $userId]);

        $stmt = $pdo->prepare("SELECT * FROM `users` WHERE `id` = ?");
        $stmt->execute([$userId]);
        json_response([
            'success' => true,
            'message' => "เปลี่ยนระดับสิทธิ์เป็น $newRole สำเร็จ",
            'user' => formatUserRow($stmt->fetch())
        ]);
    }

    // 7. TOPUP WALLET
    if ($action === 'topup') {
        $userId = (int)($input['user_id'] ?? $input['id'] ?? 0);
        $amount = (float)($input['amount'] ?? 0);

        if ($userId <= 0 || $amount <= 0) {
            json_error('ยอดเงินไม่ถูกต้อง');
        }

        $stmt = $pdo->prepare("UPDATE `users` SET `wallet` = `wallet` + ? WHERE `id` = ?");
        $stmt->execute([$amount, $userId]);

        $stmt = $pdo->prepare("SELECT `wallet` FROM `users` WHERE `id` = ?");
        $stmt->execute([$userId]);
        $wallet = (float)$stmt->fetchColumn();

        json_response([
            'success' => true,
            'message' => 'เติมเงินเข้าสู่กระเป๋าเรียบร้อยแล้ว!',
            'wallet' => $wallet
        ]);
    }

    // 8. UPDATE PREFERENCES
    if ($action === 'update_prefs') {
        $userId = (int)($input['user_id'] ?? $input['id'] ?? 0);
        if ($userId <= 0) json_error('Invalid user id');

        $soundEnabled = !empty($input['soundEnabled']) ? 1 : 0;
        $notifPromos = !empty($input['notifPromos']) ? 1 : 0;
        $notifOrders = !empty($input['notifOrders']) ? 1 : 0;
        $notifWishlist = !empty($input['notifWishlist']) ? 1 : 0;
        $currency = $input['currency'] ?? 'THB';
        $language = $input['language'] ?? 'th';

        $stmt = $pdo->prepare("INSERT INTO `profile_prefs` (`user_id`, `sound_enabled`, `notif_promos`, `notif_orders`, `notif_wishlist`, `currency`, `language`) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            `sound_enabled` = VALUES(`sound_enabled`),
            `notif_promos` = VALUES(`notif_promos`),
            `notif_orders` = VALUES(`notif_orders`),
            `notif_wishlist` = VALUES(`notif_wishlist`),
            `currency` = VALUES(`currency`),
            `language` = VALUES(`language`)");
        
        $stmt->execute([$userId, $soundEnabled, $notifPromos, $notifOrders, $notifWishlist, $currency, $language]);

        json_response([
            'success' => true,
            'message' => 'บันทึกการตั้งค่าสำเร็จ',
            'prefs' => getUserPrefs($pdo, $userId)
        ]);
    }
}

json_error('Invalid request', 400);
