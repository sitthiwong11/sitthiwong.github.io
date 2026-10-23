<?php
// api/db.php - Central Database Connection & Utilities

if (php_sapi_name() !== 'cli') {
    // Enable CORS for cross-origin requests & local dev server
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

    // Respond to preflight OPTIONS request
    if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }

    header('Content-Type: application/json; charset=utf-8');
}

$dbHost = '127.0.0.1';
$dbName = 'amphoreus_db';
$dbUser = 'root';
$dbPass = '';
$charset = 'utf8mb4';

function getDbConnection($selectDb = true) {
    global $dbHost, $dbName, $dbUser, $dbPass, $charset;
    
    $dsn = "mysql:host=$dbHost" . ($selectDb ? ";dbname=$dbName" : "") . ";charset=$charset";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    
    try {
        return new PDO($dsn, $dbUser, $dbPass, $options);
    } catch (PDOException $e) {
        return null;
    }
}

function json_response($data, $status = 200) {
    if (php_sapi_name() !== 'cli') {
        http_response_code($status);
    }
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

function json_error($message, $status = 400, $extra = []) {
    if (php_sapi_name() !== 'cli') {
        http_response_code($status);
    }
    echo json_encode(array_merge(['success' => false, 'error' => $message], $extra), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

function get_json_input() {
    $raw = file_get_contents('php://input');
    if (empty($raw)) {
        return $_POST;
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? array_merge($_POST, $decoded) : $_POST;
}
