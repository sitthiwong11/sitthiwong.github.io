<?php
// api/status.php - Connection status endpoint
require_once __DIR__ . '/db.php';

$pdo = getDbConnection(true);

if (!$pdo) {
    // Check if MySQL server is running at all
    $pdoServer = getDbConnection(false);
    if (!$pdoServer) {
        json_response([
            'connected' => false,
            'databaseExists' => false,
            'message' => 'Cannot connect to MySQL server. Please make sure MySQL is started in XAMPP.',
            'server' => '127.0.0.1:3306'
        ], 200);
    } else {
        json_response([
            'connected' => true,
            'databaseExists' => false,
            'message' => 'MySQL server is running, but database `amphoreus_db` has not been initialized yet.',
            'server' => '127.0.0.1:3306',
            'actionRequired' => 'Run setup_db.php to initialize tables'
        ], 200);
    }
}

try {
    $tables = [];
    $stmt = $pdo->query("SHOW TABLES");
    while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
        $tableName = $row[0];
        $count = (int)$pdo->query("SELECT COUNT(*) FROM `$tableName`")->fetchColumn();
        $tables[$tableName] = $count;
    }
    
    $version = $pdo->query("SELECT VERSION()")->fetchColumn();

    json_response([
        'connected' => true,
        'databaseExists' => true,
        'database' => 'amphoreus_db',
        'serverVersion' => $version,
        'tables' => $tables,
        'status' => 'online',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
} catch (PDOException $e) {
    json_response([
        'connected' => false,
        'error' => $e->getMessage()
    ], 200);
}
