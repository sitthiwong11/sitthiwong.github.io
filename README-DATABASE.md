# ฐานข้อมูล MySQL สำหรับ AMPHOREUS Game Store

โปรเจกต์นี้ได้รับการปรับเปลี่ยนและยกระดับระบบจัดเก็บข้อมูลทั้งหมดเป็น **MySQL Database** อย่างสมบูรณ์ เชื่อมต่อผ่าน PHP PDO RESTful API พร้อมระบบซิงค์ข้อมูลสองทางแบบเรียลไทม์

---

## 🗄️ โครงสร้างฐานข้อมูล (Database Structure)
- **Database Name**: `amphoreus_db`
- **Charset / Collation**: `utf8mb4` / `utf8mb4_unicode_ci`
- **SQL Files**: 
  - `database.sql` (ไฟล์สคริปต์ SQL พร้อมคำสั่งสร้างตารางและชุดข้อมูลเริ่มต้นทั้งหมด)
  - `amphoreus_db.sql` (ไฟล์สำรอง)

### รายชื่อตารางทั้งหมดในระบบ (7 ตารางหลัก):
1. **`users`**: จัดเก็บข้อมูลผู้ใช้งาน, รหัสผ่าน, สิทธิ์ (Admin / Member), กระเป๋าเงิน (Wallet), รูปโปรไฟล์, ประวัติส่วนตัว
2. **`games`**: จัดเก็บแคตตาล็อกเกมทั้งหมด, ราคา, ส่วนลด, คะแนนรีวิว, สเปกคอมพิวเตอร์ (System Requirements), แท็ก, รูปภาพ, วิดีโอตัวอย่าง
3. **`coupons`**: จัดเก็บรหัสคูปองส่วนลด, ประเภทส่วนลด (เปอร์เซ็นต์ / จำนวนเงินคงที่), ยอดสั่งซื้อขั้นต่ำ
4. **`carts`**: จัดเก็บตะกร้าสินค้าของผู้ใช้งานแต่ละคนแบบแยกตามบัญชี (user_id, game_id, platform, quantity)
5. **`wishlists`**: จัดเก็บรายชื่อเกมสิ่งที่ชอบ (Wishlist) ของผู้ใช้งานแต่ละคน
6. **`order_transactions`**: จัดเก็บประวัติคำสั่งซื้อ, คลังเกมที่ซื้อแล้ว (My Library), ซีดีคีย์เกม (CD-Keys) ที่ระบบสุ่มสร้างให้อัตโนมัติ, ยอดชำระ และช่องทางการชำระเงิน
7. **`profile_prefs`**: จัดเก็บการตั้งค่าส่วนบุคคลของผู้ใช้แต่ละคน เช่น เสียงเอฟเฟกต์, การแจ้งเตือน, สกุลเงิน, ภาษา

---

## 🚀 วิธีการเปิดใช้งานระบบ (How to Run)

### วิธีที่ 1: ดับเบิลคลิกเปิดใช้งานผ่านไฟล์ Batch (ง่ายที่สุด แนะนำ)
1. ดับเบิลคลิกที่ไฟล์ **`start-server.bat`** ในโฟลเดอร์ `profinal`
2. ตัวสคริปต์จะทำการ:
   - ตรวจสอบและเริ่มทำงาน MySQL Server (XAMPP) ให้อัตโนมัติ
   - ตรวจสอบและสร้างฐานข้อมูล `amphoreus_db` พร้อมตารางและข้อมูลตั้งต้น
   - เปิดเว็บเบราว์เซอร์ไปที่ `http://localhost/profinal/` ทันที

### วิธีที่ 2: เปิดผ่าน XAMPP Control Panel
1. เปิดโปรแกรม **XAMPP Control Panel**
2. กดปุ่ม **Start** ที่โมดูล **Apache** และ **MySQL**
3. เข้าใช้งานผ่านเบราว์เซอร์:
   - หน้าร้านค้าเกม: [http://localhost/profinal/](http://localhost/profinal/)
   - หน้าจัดการฐานข้อมูล phpMyAdmin: [http://localhost/phpmyadmin/](http://localhost/phpmyadmin/)

---

## 🔑 บัญชีผู้ใช้งานเริ่มต้นสำหรับการทดสอบ (Default Accounts)

| Email / Username | Password | Role | สิทธิ์การใช้งาน | ยอดเงินเริ่มต้น |
| :--- | :--- | :--- | :--- | :--- |
| **admin@amphoreus.com** | `admin123` | **Admin** | จัดการเพิ่ม/แก้ไข/ลบเกม, จัดการคูปอง, ดูยอดขาย | 33,550,336 ฿ |
| **rachata@amphoreus.com** | `user123` | **Member** | สั่งซื้อเกม, เติมเงิน Wallet, คลังเกม, รายการโปรด | 2,500 ฿ |
| **gamer@amphoreus.com** | `gamer123` | **Member** | สมาชิกทั่วไป, ตะกร้าสินค้า, สั่งซื้อเกม | 1,200 ฿ |

---

## 📡 รายการ Backend API Endpoints (PHP + MySQL)

- **`GET api/status.php`**: ตรวจสอบสถานะการเชื่อมต่อ MySQL, ตรวจสอบตาราง และเวอร์ชันเซิร์ฟเวอร์
- **`GET api/setup_db.php`**: คำสั่งติดตั้ง / รีเซ็ตโครงสร้างฐานข้อมูลและตารางอัตโนมัติ
- **`api/games.php`**: 
  - `GET`: ดึงรายชื่อเกมทั้งหมด
  - `POST (action=create)`: แอดมินเพิ่มเกมใหม่
  - `POST (action=update)`: แอดมินแก้ไขข้อมูลเกม
  - `POST (action=delete)`: แอดมินลบเกม
- **`api/users.php`**: 
  - `GET`: ดึงรายชื่อผู้ใช้
  - `POST (action=login)`: ตรวจสอบการเข้าสู่ระบบ
  - `POST (action=register)`: สมัครสมาชิกใหม่
  - `POST (action=topup)`: เติมเงินเข้ากระเป๋าเงิน (Wallet)
  - `POST (action=update_profile)`: บันทึกข้อมูลโปรไฟล์
  - `POST (action=update_password)`: เปลี่ยนรหัสผ่าน
  - `POST (action=toggle_role)`: เปลี่ยนระดับสิทธิ์ Admin <-> Member
- **`api/coupons.php`**: 
  - `GET`: ดึงคูปองส่วนลดทั้งหมด
  - `POST (action=add)`: แอดมินเพิ่มโค้ดส่วนลดใหม่
  - `POST (action=delete)`: แอดมินลบโค้ดส่วนลด
- **`api/cart.php`**: 
  - `GET`: ดึงสินค้าในตะกร้าของผู้ใช้
  - `POST (action=sync / add / update_quantity / remove / clear)`: จัดการตะกร้าสินค้า
- **`api/wishlist.php`**: 
  - `GET`: ดึงรายการสิ่งที่ชอบ
  - `POST (action=toggle)`: เพิ่มหรือนำเกมออกจากสิ่งที่ชอบ
- **`api/orders.php`**: 
  - `GET`: ดูประวัติคำสั่งซื้อและคลังเกม
  - `POST (action=checkout)`: ประมวลผลการชำระเงิน, ตัดเงินในกระเป๋า Wallet, สุ่มออกคีย์เกม (CD-Key) และบันทึกลงตาราง `order_transactions`
