@echo off
chcp 65001 > nul
title AMPHOREUS Game Store - MySQL & Web Server Launcher
echo ========================================================
echo   AMPHOREUS Game Store - MySQL & Web Server Launcher
echo ========================================================
echo.

:: 1. Check & Start MySQL
echo [1/3] กำลังตรวจสอบสถานะ MySQL...
C:\xampp\mysql\bin\mysql.exe -u root -e "SHOW DATABASES;" > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo กำลังเปิดใช้งาน MySQL Server (C:\xampp\mysql)...
    start "" /B C:\xampp\mysql\bin\mysqld.exe --defaults-file="C:\xampp\mysql\bin\my.ini" --standalone
    timeout /t 3 /nobreak > nul
) else (
    echo [OK] MySQL กำลังทำงานอยู่แล้ว
)

:: 2. Initialize Database if needed
echo [2/3] ตรวจสอบและเตรียมโครงสร้างฐานข้อมูล amphoreus_db...
C:\xampp\php\php.exe api\setup_db.php
echo [OK] ตรวจสอบตารางและชุดข้อมูล MySQL เรียบร้อยแล้ว

:: 3. Start Apache if not already running
echo [3/3] ตรวจสอบเว็บเซิร์ฟเวอร์ Apache...
curl -s http://localhost/profinal/api/status.php > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo กำลังเปิดใช้งาน Apache Web Server...
    start "" /B C:\xampp\apache\bin\httpd.exe
    timeout /t 2 /nobreak > nul
) else (
    echo [OK] Apache Web Server กำลังทำงานอยู่แล้ว
)

echo.
echo ========================================================
echo   เปิดเว็บเบราว์เซอร์ไปที่: http://localhost/profinal/
echo   phpMyAdmin: http://localhost/phpmyadmin/
echo ========================================================
start http://localhost/profinal/
echo.
pause
