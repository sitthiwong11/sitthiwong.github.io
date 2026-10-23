<?php
// api/setup_db.php - Database Initialization and Migration Tool
require_once __DIR__ . '/db.php';

$pdo = getDbConnection(false);

if (!$pdo) {
    json_error('Cannot connect to MySQL server. Please ensure MySQL is running in XAMPP on port 3306.', 500, [
        'hint' => 'Start MySQL in XAMPP Control Panel or run mysqld.'
    ]);
}

$sqlFile = __DIR__ . '/../database.sql';
if (!file_exists($sqlFile)) {
    json_error('database.sql file not found.', 404);
}

$sqlContent = file_get_contents($sqlFile);

try {
    // Run the entire SQL dump
    $pdo->exec($sqlContent);
    
    // Connect to amphoreus_db to count tables
    $pdoDb = getDbConnection(true);
    $tables = [];
    $stmt = $pdoDb->query("SHOW TABLES");
    while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
        $tableName = $row[0];
        $countStmt = $pdoDb->query("SELECT COUNT(*) FROM `$tableName`");
        $tables[$tableName] = (int)$countStmt->fetchColumn();
    }
    
    json_response([
        'success' => true,
        'message' => 'AMPHOREUS MySQL database setup completed successfully!',
        'database' => 'amphoreus_db',
        'tables' => $tables,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
} catch (PDOException $e) {
    json_error('Database setup failed: ' . $e->getMessage(), 500);
}
