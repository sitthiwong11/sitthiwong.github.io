/**
 * AMPHOREUS - Game Catalog Database
 * ข้อมูลรายชื่อเกม รายละเอียด สเปกคอมพิวเตอร์ ภาพตัวอย่าง และราคา
 */

const INITIAL_GAMES_DATA = [
  {
    id: 1,
    title: "Black Myth: Wukong",
    titleTh: "แบล็ก มิท: หงอคง",
    category: "Action RPG",
    platforms: ["PC", "PS5"],
    price: 1790,
    originalPrice: 1790,
    discount: 0,
    rating: 4.9,
    reviewsCount: 14200,
    releaseDate: "2024-08-20",
    publisher: "Game Science",
    isFeatured: true,
    isHot: true,
    isBestSeller: true,
    coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    description: "เกมแอ็กชันสวมบทบาทที่อิงจากวรรณกรรมไซอิ๋วสุดคลาสสิกของจีน คุณจะได้รับบทเป็น 'ผู้ถูกเลือก' ออกผจญภัยในดินแดนลี้ลับ ต่อสู้กับเหล่าปีศาจและทวยเทพด้วยกระบองวิเศษและเวทมนตร์แปลงร่าง 72 กระบวนท่า กราฟิกสมจริงระดับ Unreal Engine 5",
    tags: ["Action", "Souls-like", "Mythology", "Singleplayer", "Unreal Engine 5"],
    screenshots: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "https://www.youtube.com/embed/O2nNljv0MOI",
    systemReq: {
      minimum: {
        os: "Windows 10 64-bit",
        cpu: "Intel Core i5-8400 / AMD Ryzen 5 1600",
        ram: "16 GB RAM",
        gpu: "NVIDIA GeForce GTX 1060 (6GB) / AMD Radeon RX 580 (8GB)",
        storage: "130 GB SSD"
      },
      recommended: {
        os: "Windows 11 64-bit",
        cpu: "Intel Core i7-9700 / AMD Ryzen 5 5500",
        ram: "16 GB RAM",
        gpu: "NVIDIA GeForce RTX 2060 / AMD Radeon RX 5700 XT",
        storage: "130 GB SSD"
      }
    }
  },
  {
    id: 2,
    title: "Cyberpunk 2077: Phantom Liberty Bundle",
    titleTh: "ไซเบอร์พังค์ 2077 แฟนทอม ลิเบอร์ตี",
    category: "Open World",
    platforms: ["PC", "PS5", "Xbox Series X"],
    price: 1180,
    originalPrice: 1970,
    discount: 40,
    rating: 4.8,
    reviewsCount: 38900,
    releaseDate: "2023-09-26",
    publisher: "CD PROJEKT RED",
    isFeatured: true,
    isHot: true,
    isBestSeller: true,
    coverImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80",
    description: "มหากาพย์เกม RPG แบบ Open World ในมหานครไนท์ซิตี้อันตื่นตา สัมผัสชีวิตทหารรับจ้างไซเบอร์เนติกส์ V พร้อมเนื้อเรื่องส่วนขยายสายลับ Phantom Liberty สุดระทึกที่นำแสดงโดย Idris Elba รองรับระบบ Ray Tracing และ DLSS 3.5 เต็มรูปแบบ",
    tags: ["Cyberpunk", "Open World", "RPG", "Sci-Fi", "Ray Tracing"],
    screenshots: [
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "https://www.youtube.com/embed/8X2kIfS6fb8",
    systemReq: {
      minimum: {
        os: "Windows 10 64-bit",
        cpu: "Core i7-6700 / Ryzen 5 1600",
        ram: "12 GB RAM",
        gpu: "GeForce GTX 1060 6GB / Radeon RX 580 8GB",
        storage: "70 GB SSD"
      },
      recommended: {
        os: "Windows 11 64-bit",
        cpu: "Core i7-12700 / Ryzen 7 7800X3D",
        ram: "16 GB RAM",
        gpu: "GeForce RTX 3080 / Radeon RX 7900 XTX",
        storage: "70 GB SSD"
      }
    }
  },
  {
    id: 3,
    title: "Elden Ring: Shadow of the Erdtree",
    titleTh: "เอลเดน ริงก์: เงาแห่งพฤกษาทอง",
    category: "Action RPG",
    platforms: ["PC", "PS5", "Xbox Series X"],
    price: 1390,
    originalPrice: 1790,
    discount: 22,
    rating: 4.9,
    reviewsCount: 52100,
    releaseDate: "2024-06-21",
    publisher: "FromSoftware / Bandai Namco",
    isFeatured: true,
    isHot: true,
    isBestSeller: true,
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    description: "เกมยอดเยี่ยมแห่งปีสู่การเดินทางครั้งใหม่ในดินแดนแห่งเงา (Realm of Shadow) สำรวจดันเจี้ยนใหม่ ท้าทายบอสสุดโหด และค้นพบอาวุธ ชุดเกราะ เวทมนตร์ใหม่ๆ มากมาย จากฝีมือ Hidetaka Miyazaki ร่วมกับ George R. R. Martin",
    tags: ["Souls-like", "Dark Fantasy", "Open World", "Difficult", "GOTY"],
    screenshots: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "https://www.youtube.com/embed/qLZenOn7WUo",
    systemReq: {
      minimum: {
        os: "Windows 10 64-bit",
        cpu: "INTEL CORE I5-8400 / AMD RYZEN 3 3300X",
        ram: "12 GB RAM",
        gpu: "NVIDIA GEFORCE GTX 1060 3 GB / AMD RADEON RX 580 4 GB",
        storage: "60 GB SSD"
      },
      recommended: {
        os: "Windows 10/11 64-bit",
        cpu: "INTEL CORE I7-8700K / AMD RYZEN 5 3600X",
        ram: "16 GB RAM",
        gpu: "NVIDIA GEFORCE GTX 1070 8 GB / AMD RADEON RX VEGA 56 8 GB",
        storage: "60 GB SSD"
      }
    }
  },
  {
    id: 4,
    title: "Grand Theft Auto V: Premium Edition",
    titleTh: "แกรนด์ เทฟต์ ออโต V พรีเมียม",
    category: "Open World",
    platforms: ["PC", "PS5", "Xbox Series X"],
    price: 399,
    originalPrice: 799,
    discount: 50,
    rating: 4.8,
    reviewsCount: 154000,
    releaseDate: "2015-04-14",
    publisher: "Rockstar Games",
    isFeatured: false,
    isHot: true,
    isBestSeller: true,
    coverImage: "https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
    description: "สัมผัสชีวิตอาชญากรสุดระห่ำของ Michael, Franklin และ Trevor ในเมืองลอสซานโตส พร้อมเข้าถึง GTA Online และ Criminal Enterprise Starter Pack รับเงินเริ่มต้น 1,000,000 GTA$ ฟรี!",
    tags: ["Open World", "Action", "Multiplayer", "Crime", "Classic"],
    screenshots: [
      "https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "https://www.youtube.com/embed/QkkoHAzjnUs",
    systemReq: {
      minimum: {
        os: "Windows 10 64 Bit",
        cpu: "Intel Core 2 Quad CPU Q6600 @ 2.40GHz",
        ram: "4 GB RAM",
        gpu: "NVIDIA 9800 GT 1GB / AMD HD 4870 1GB",
        storage: "110 GB HDD/SSD"
      },
      recommended: {
        os: "Windows 10 64 Bit",
        cpu: "Intel Core i5 3470 @ 3.2GHz / AMD X8 FX-8350 @ 4GHz",
        ram: "8 GB RAM",
        gpu: "NVIDIA GTX 660 2GB / AMD HD 7870 2GB",
        storage: "110 GB SSD"
      }
    }
  },
  {
    id: 5,
    title: "Helldivers 2 - Super Citizen Edition",
    titleTh: "เฮลไดฟ์เวอร์ส 2 ซูเปอร์ ซิติเซน",
    category: "Shooter / Co-op",
    platforms: ["PC", "PS5"],
    price: 1290,
    originalPrice: 1590,
    discount: 19,
    rating: 4.7,
    reviewsCount: 29800,
    releaseDate: "2024-02-08",
    publisher: "PlayStation Publishing LLC",
    isFeatured: true,
    isHot: true,
    isBestSeller: true,
    coverImage: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    description: "ร่วมมือกับเพื่อนสูงสุด 4 คนเพื่อปกป้องประชาธิปไตยแห่งซูเปอร์เอิร์ธในเกมยิงมุมมองบุคคลที่สามสุดเดือด เผชิญหน้ากับฝูงแมลงมฤตยูและกองทัพหุ่นยนต์สังหารพร้อมคลังอาวุธทำลายล้างสูง",
    tags: ["Co-op", "Shooter", "Sci-Fi", "Third-Person", "Multiplayer"],
    screenshots: [
      "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "https://www.youtube.com/embed/l_nfl_bY7dY",
    systemReq: {
      minimum: {
        os: "Windows 10 64-bit",
        cpu: "Intel Core i7-4790K / AMD Ryzen 5 1500X",
        ram: "8 GB RAM",
        gpu: "NVIDIA GeForce GTX 1050 Ti / AMD Radeon RX 470",
        storage: "100 GB HDD/SSD"
      },
      recommended: {
        os: "Windows 10/11 64-bit",
        cpu: "Intel Core i7-9700K / AMD Ryzen 7 3700X",
        ram: "16 GB RAM",
        gpu: "NVIDIA GeForce RTX 2060 / AMD Radeon RX 6600XT",
        storage: "100 GB SSD"
      }
    }
  },
  {
    id: 6,
    title: "Resident Evil 4 Remake - Gold Edition",
    titleTh: "เรซิเดนต์อีวิล 4 รีเมค โกลด์ เอดิชัน",
    category: "Horror / Action",
    platforms: ["PC", "PS5", "Xbox Series X"],
    price: 1190,
    originalPrice: 1690,
    discount: 30,
    rating: 4.9,
    reviewsCount: 31200,
    releaseDate: "2023-03-24",
    publisher: "CAPCOM",
    isFeatured: false,
    isHot: true,
    isBestSeller: false,
    coverImage: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    description: "การกลับมาของผลงานระดับมาสเตอร์พีซของเกมสยองขวัญเอาชีวิตรอด ลีออน เอส. เคนเนดี ได้รับภารกิจบุกหมู่บ้านลี้ลับในยุโรปเพื่อช่วยลูกสาวประธานาธิบดี มาพร้อมเนื้อเรื่องเสริม Separate Ways ของ Ada Wong ครบชุด",
    tags: ["Horror", "Survival", "Action", "Zombies", "Remake"],
    screenshots: [
      "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "https://www.youtube.com/embed/j5Xv2lM9dVU",
    systemReq: {
      minimum: {
        os: "Windows 10 (64 bit)",
        cpu: "AMD Ryzen 3 1200 / Intel Core i5-7500",
        ram: "8 GB RAM",
        gpu: "AMD Radeon RX 560 4GB / NVIDIA GeForce GTX 1050 Ti 4GB",
        storage: "65 GB SSD"
      },
      recommended: {
        os: "Windows 10/11 (64 bit)",
        cpu: "AMD Ryzen 5 3600 / Intel Core i7 8700",
        ram: "16 GB RAM",
        gpu: "AMD Radeon RX 5700 / NVIDIA GeForce GTX 1070",
        storage: "65 GB SSD"
      }
    }
  },
  {
    id: 7,
    title: "Valorant Radiant Points Pack (5,350 VP)",
    titleTh: "วาโลแรนต์ พ้อยท์ 5,350 VP (คีย์เติมเงิน)",
    category: "Gift Card / Topup",
    platforms: ["PC"],
    price: 1450,
    originalPrice: 1550,
    discount: 6,
    rating: 4.9,
    reviewsCount: 68400,
    releaseDate: "2024-01-01",
    publisher: "Riot Games",
    isFeatured: false,
    isHot: true,
    isBestSeller: true,
    coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
    description: "รหัสเติมเงินเกม Valorant บัญชีเซิร์ฟเวอร์ประเทศไทยและเอเชีย (TH / APAC) เติมเข้าทันที 5,350 Valorant Points สำหรับซื้อสกินปืน Battle Pass หรือบันเดิลแรร์ล่าสุด",
    tags: ["Gift Card", "Topup", "FPS", "Esports", "Instant Key"],
    screenshots: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "",
    systemReq: {
      minimum: {
        os: "Windows 10/11 64-bit",
        cpu: "Intel Core 2 Duo E8400 / AMD Athlon 200GE",
        ram: "4 GB RAM",
        gpu: "Intel HD 4000 / AMD Radeon R5 200",
        storage: "30 GB"
      },
      recommended: {
        os: "Windows 10/11 64-bit",
        cpu: "Intel i3-4150 / AMD Ryzen 3 1200",
        ram: "8 GB RAM",
        gpu: "GeForce GT 730 / Radeon R7 240",
        storage: "30 GB SSD"
      }
    }
  },
  {
    id: 8,
    title: "Final Fantasy VII Rebirth",
    titleTh: "ไฟนอล แฟนตาซี VII รีเบิร์ธ",
    category: "Action RPG",
    platforms: ["PS5", "PC"],
    price: 1990,
    originalPrice: 2290,
    discount: 13,
    rating: 4.9,
    reviewsCount: 18700,
    releaseDate: "2024-02-29",
    publisher: "Square Enix",
    isFeatured: true,
    isHot: true,
    isBestSeller: false,
    coverImage: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80",
    description: "บทต่อของการผจญภัยระดับตำนาน Cloud, Tifa, Aerith และ Barret ออกเดินทางพ้นกำแพงมิดการ์สู่โลกกว้างอันไพศาลเพื่อหยุดยั้ง Sephiroth การผสมผสานระหว่างระบบต่อสู้แบบแอ็กชันและวางแผนเชิงกลยุทธ์",
    tags: ["JRPG", "Story Rich", "Action RPG", "Open World", "Fantasy"],
    screenshots: [
      "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "https://www.youtube.com/embed/1L6XQyX7d78",
    systemReq: {
      minimum: {
        os: "PlayStation 5 Console หรือ Windows 11",
        cpu: "Core i7-8700K / Ryzen 5 3600",
        ram: "16 GB RAM",
        gpu: "RTX 2070 8GB / Radeon RX 5700 XT",
        storage: "150 GB SSD"
      },
      recommended: {
        os: "Windows 11 64-bit",
        cpu: "Core i7-13700K / Ryzen 7 7800X3D",
        ram: "32 GB RAM",
        gpu: "RTX 4070 Ti / Radeon RX 7900 XT",
        storage: "150 GB NVMe SSD"
      }
    }
  },
  {
    id: 9,
    title: "Forza Horizon 5: Premium Edition",
    titleTh: "ฟอร์ซา ฮอไรซอน 5 พรีเมียม",
    category: "Racing / Sports",
    platforms: ["PC", "Xbox Series X"],
    price: 1045,
    originalPrice: 2090,
    discount: 50,
    rating: 4.8,
    reviewsCount: 45600,
    releaseDate: "2021-11-09",
    publisher: "Xbox Game Studios",
    isFeatured: false,
    isHot: false,
    isBestSeller: true,
    coverImage: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
    description: "สุดยอดเกมแข่งรถโอเพนเวิลด์ชั้นนำระดับโลก ซิ่งทะยานผ่านภูมิประเทศอันงดงามและมีชีวิตชีวาของเม็กซิโก พร้อมรถยนต์หรูและซูเปอร์คาร์กว่า 700 คัน",
    tags: ["Racing", "Open World", "Driving", "Multiplayer", "Simulation"],
    screenshots: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "https://www.youtube.com/embed/FYH9n37B7Yw",
    systemReq: {
      minimum: {
        os: "Windows 10 version 15063.0 or higher",
        cpu: "Intel i5-4460 or AMD Ryzen 3 1200",
        ram: "8 GB RAM",
        gpu: "NVidia GTX 970 OR AMD RX 470",
        storage: "110 GB SSD"
      },
      recommended: {
        os: "Windows 10/11 64-bit",
        cpu: "Intel i7-10700K or AMD Ryzen 7 3800XT",
        ram: "16 GB RAM",
        gpu: "NVidia RTX 2070 OR AMD RX 6700 XT",
        storage: "110 GB SSD"
      }
    }
  },
  {
    id: 10,
    title: "Baldur's Gate 3 - Digital Deluxe",
    titleTh: "บัลดรูส์ เกท 3 ดิจิทัล ดีลักซ์",
    category: "Strategy / RPG",
    platforms: ["PC", "PS5", "Xbox Series X"],
    price: 1490,
    originalPrice: 1790,
    discount: 17,
    rating: 4.9,
    reviewsCount: 89000,
    releaseDate: "2023-08-03",
    publisher: "Larian Studios",
    isFeatured: true,
    isHot: true,
    isBestSeller: true,
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    description: "ผู้ชนะรางวัล Game of the Year 2023 เกม RPG เทิร์นเบสที่มีอิสระในการตัดสินใจระดับไร้ขีดจำกัด สร้างเรื่องราวของคุณเองในโลก Dungeons & Dragons ร่วมกับสหายที่มีมิติและบุคลิกเฉพาะตัว",
    tags: ["RPG", "Story Rich", "Turn-Based", "Choices Matter", "Co-op"],
    screenshots: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "https://www.youtube.com/embed/1T22wN1BIzU",
    systemReq: {
      minimum: {
        os: "Windows 10 64-bit",
        cpu: "Intel I5 4690 / AMD FX 8350",
        ram: "8 GB RAM",
        gpu: "Nvidia GTX 970 / RX 480 (4GB+ of VRAM)",
        storage: "150 GB SSD"
      },
      recommended: {
        os: "Windows 10/11 64-bit",
        cpu: "Intel i7 8700K / AMD r5 3600",
        ram: "16 GB RAM",
        gpu: "Nvidia 2060 Super / RX 5700 XT (8GB+ of VRAM)",
        storage: "150 GB SSD"
      }
    }
  },
  {
    id: 11,
    title: "Hogwarts Legacy: Digital Deluxe",
    titleTh: "ฮอกวอตส์ เลกาซี ดีลักซ์",
    category: "Open World",
    platforms: ["PC", "PS5", "Xbox Series X", "Nintendo Switch"],
    price: 945,
    originalPrice: 1890,
    discount: 50,
    rating: 4.7,
    reviewsCount: 56300,
    releaseDate: "2023-02-10",
    publisher: "Warner Bros. Games",
    isFeatured: false,
    isHot: false,
    isBestSeller: true,
    coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    description: "สัมผัสชีวิตนักเรียนเวทมนตร์ในโรงเรียนฮอกวอตส์ยุคศตวรรษที่ 1800 ร่ายคาถา ปรุงน้ำยา เลี้ยงสัตว์วิเศษ และค้นพบความลับโบราณที่อาจคุกคามโลกแห่งเวทมนตร์",
    tags: ["Magic", "Open World", "Fantasy", "Singleplayer", "Adventure"],
    screenshots: [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "https://www.youtube.com/embed/1O6Qstn54Qo",
    systemReq: {
      minimum: {
        os: "64-bit Windows 10",
        cpu: "Intel Core i5-6600 (3.3Ghz) or AMD Ryzen 5 1400 (3.2Ghz)",
        ram: "16 GB RAM",
        gpu: "NVIDIA GeForce GTX 960 4GB or AMD Radeon RX 470 4GB",
        storage: "85 GB SSD"
      },
      recommended: {
        os: "64-bit Windows 10/11",
        cpu: "Intel Core i7-8700 (3.2Ghz) or AMD Ryzen 5 3600 (3.6 Ghz)",
        ram: "16 GB RAM",
        gpu: "NVIDIA GeForce 1080 Ti or AMD Radeon RX 5700 XT",
        storage: "85 GB SSD"
      }
    }
  },
  {
    id: 12,
    title: "Palworld",
    titleTh: "พัลเวิลด์ (เพื่อนพาลผจญภัย)",
    category: "Survival / Indie",
    platforms: ["PC", "Xbox Series X", "PS5"],
    price: 590,
    originalPrice: 590,
    discount: 0,
    rating: 4.8,
    reviewsCount: 78200,
    releaseDate: "2024-01-19",
    publisher: "Pocketpair",
    isFeatured: false,
    isHot: true,
    isBestSeller: true,
    coverImage: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80",
    description: "เกมเอาชีวิตรอดและสะสมมอนสเตอร์ 'Pal' สุดฮิต สร้างฐาน ทำฟาร์ม ผลิตอาวุธ และต่อสู้ในโลกกว้างร่วมกับเพื่อนๆ ออนไลน์",
    tags: ["Survival", "Creature Collector", "Multiplayer", "Crafting", "Open World"],
    screenshots: [
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "https://www.youtube.com/embed/Yv013e2O0s8",
    systemReq: {
      minimum: {
        os: "Windows 10 or later (64-Bit)",
        cpu: "i5-3570K 3.4 GHz 4 Core",
        ram: "16 GB RAM",
        gpu: "GeForce GTX 1050 (2GB)",
        storage: "40 GB SSD"
      },
      recommended: {
        os: "Windows 10 or later (64-Bit)",
        cpu: "i9-9900K 3.6 GHz 8 Core",
        ram: "32 GB RAM",
        gpu: "GeForce RTX 2070",
        storage: "40 GB SSD"
      }
    }
  },
  {
    id: 13,
    title: "Steam Wallet Code 1,000 THB",
    titleTh: "บัตรเติมเงิน Steam Wallet 1,000 บาท",
    category: "Gift Card / Topup",
    platforms: ["PC"],
    price: 990,
    originalPrice: 1000,
    discount: 1,
    rating: 5.0,
    reviewsCount: 120500,
    releaseDate: "2024-01-01",
    publisher: "Valve Corporation",
    isFeatured: false,
    isHot: true,
    isBestSeller: true,
    coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    description: "รหัสเติมเงิน Steam Wallet มูลค่า 1,000 บาทไทย รหัสจัดส่งทันทีหลังจากชำระเงิน สามารถใช้ซื้อเกม ไอเทม Dota 2, CS2 หรือซอฟต์แวร์บน Steam ได้ทันที ไม่มีวันหมดอายุ",
    tags: ["Steam", "Wallet", "Topup", "Instant Key", "Official"],
    screenshots: [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "",
    systemReq: {
      minimum: { os: "Any OS", cpu: "Standard", ram: "1 GB", gpu: "Standard", storage: "100 MB" },
      recommended: { os: "Any OS", cpu: "Standard", ram: "2 GB", gpu: "Standard", storage: "100 MB" }
    }
  },
  {
    id: 14,
    title: "Red Dead Redemption 2: Ultimate Edition",
    titleTh: "เรด เดด รีดิมพ์ชัน 2 อัลติเมต",
    category: "Open World",
    platforms: ["PC", "PS5", "Xbox Series X"],
    price: 699,
    originalPrice: 2290,
    discount: 69,
    rating: 4.9,
    reviewsCount: 198000,
    releaseDate: "2019-11-05",
    publisher: "Rockstar Games",
    isFeatured: false,
    isHot: false,
    isBestSeller: true,
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    description: "มหากาพย์แห่งคาวบอยตะวันตกยุคปลายกับ Arthur Morgan และแก๊ง Van der Linde เนื้อเรื่องระดับรางวัลวรรณกรรม โลกที่ละเอียดสมจริงที่สุดในประวัติศาสตร์วิดีโอเกม",
    tags: ["Open World", "Story Rich", "Western", "Realistic", "Masterpiece"],
    screenshots: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "https://www.youtube.com/embed/eaW0tYPxyl0",
    systemReq: {
      minimum: {
        os: "Windows 10 - April 2018 Update (v1803)",
        cpu: "Intel Core i5-2500K / AMD FX-6300",
        ram: "8 GB RAM",
        gpu: "Nvidia GeForce GTX 770 2GB / AMD Radeon R9 280 3GB",
        storage: "150 GB HDD/SSD"
      },
      recommended: {
        os: "Windows 10/11 64-bit",
        cpu: "Intel Core i7-4770K / AMD Ryzen 5 1500X",
        ram: "12 GB RAM",
        gpu: "Nvidia GeForce GTX 1060 6GB / AMD Radeon RX 480 4GB",
        storage: "150 GB SSD"
      }
    }
  },
  {
    id: 15,
    title: "EA SPORTS FC 24",
    titleTh: "อีเอ สปอร์ตส์ เอฟซี 24",
    category: "Racing / Sports",
    platforms: ["PC", "PS5", "Xbox Series X", "Nintendo Switch"],
    price: 499,
    originalPrice: 1899,
    discount: 74,
    rating: 4.3,
    reviewsCount: 34000,
    releaseDate: "2023-09-29",
    publisher: "Electronic Arts",
    isFeatured: false,
    isHot: false,
    isBestSeller: true,
    coverImage: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80",
    description: "ยุคใหม่ของเกมฟุตบอลระดับโลก ด้วยเทคโนโลยี HyperMotionV และ PlayStyles ที่ขับเคลื่อนนักเตะกว่า 19,000 คน จากกว่า 700 สโมสรทั่วโลก โหมด Ultimate Team และ Career สุดมันส์",
    tags: ["Sports", "Football", "Soccer", "Multiplayer", "Competitive"],
    screenshots: [
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "https://www.youtube.com/embed/XhP3Xh4LMA8",
    systemReq: {
      minimum: {
        os: "Windows 10 - 64-Bit",
        cpu: "Intel Core i5-6600K @ 3.50GHz or AMD Ryzen 5 1600 @ 3.2 GHZ",
        ram: "8 GB RAM",
        gpu: "NVIDIA GeForce GTX 1050 Ti 4GB or AMD Radeon RX 570 4GB",
        storage: "100 GB SSD"
      },
      recommended: {
        os: "Windows 10/11 - 64-Bit",
        cpu: "Intel Core i7-6700 @ 3.40GHz or AMD Ryzen 7 2700X @ 3.7 GHZ",
        ram: "12 GB RAM",
        gpu: "NVIDIA GeForce GTX 1660 or AMD RX 5600 XT",
        storage: "100 GB SSD"
      }
    }
  },
  {
    id: 16,
    title: "Marvel's Spider-Man 2",
    titleTh: "มาร์เวลส์ สไปเดอร์แมน 2",
    category: "Action RPG",
    platforms: ["PS5"],
    price: 1890,
    originalPrice: 2290,
    discount: 17,
    rating: 4.9,
    reviewsCount: 38200,
    releaseDate: "2023-10-20",
    publisher: "Sony Interactive Entertainment",
    isFeatured: true,
    isHot: true,
    isBestSeller: true,
    coverImage: "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=1200&q=80",
    description: "สองไอ้แมงมุม ปีเตอร์ ปาร์คเกอร์ และ ไมลส์ โมราเลส รวมพลังปกป้องมหานครนิวยอร์กจากภัยคุกคามของ Venom และ Kraven the Hunter บินโฉบด้วย Web Wings และพลัง Symbiote สุดทรงพลัง",
    tags: ["Superhero", "Action", "Open World", "Singleplayer", "Great Story"],
    screenshots: [
      "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80"
    ],
    videoUrl: "https://www.youtube.com/embed/9fVYKsEmuRo",
    systemReq: {
      minimum: { os: "PlayStation 5 Console Exclusive", cpu: "Custom AMD Zen 2", ram: "16 GB GDDR6", gpu: "Custom RDNA 2", storage: "98 GB SSD" },
      recommended: { os: "PlayStation 5 Console Exclusive", cpu: "Custom AMD Zen 2", ram: "16 GB GDDR6", gpu: "Custom RDNA 2", storage: "98 GB SSD" }
    }
  }
];

// Coupons database
const COUPONS_DATA = {
  "GAMEON10": { code: "GAMEON10", type: "percent", value: 10, minSpend: 500, description: "ลดทันที 10% เมื่อซื้อครบ 500 บาท" },
  "CYBER50": { code: "CYBER50", type: "fixed", value: 50, minSpend: 300, description: "ลด 50 บาท สำหรับทุกออเดอร์ 300 บาทขึ้นไป" },
  "NEXUS100": { code: "NEXUS100", type: "fixed", value: 100, minSpend: 1000, description: "ส่วนลด 100 บาท เมื่อซื้อครบ 1,000 บาท" },
  "STUDENTVIP": { code: "STUDENTVIP", type: "percent", value: 15, minSpend: 200, description: "ส่วนลดพิเศษนักศึกษา 15%" }
};



// Pre-configured Users Database & Roles (ระบบผู้ใช้งานและสิทธิ์)
const INITIAL_USERS_DATA = [
  {
    id: 1,
    username: "admin@amphoreus.com",
    password: "admin123",
    name: "ผู้ดูแลระบบ (Admin AMPHOREUS)",
    role: "Admin", // มีสิทธิ์จัดการเกม, คูปอง, ดูสถิติยอดขาย, จัดการสิทธิ์
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80",
    wallet: 33550336,
    joinedDate: "2024-01-01"
  },
  {
    id: 2,
    username: "rachata@amphoreus.com",
    password: "user123",
    name: "รัชต สิทธิวงศ์ (VIP Member)",
    role: "Member", // สมาชิกทั่วไป สั่งซื้อเกม คลังเกม เติมเงิน
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    wallet: 2500,
    joinedDate: "2024-02-15"
  },
  {
    id: 3,
    username: "gamer@amphoreus.com",
    password: "gamer123",
    name: "Cyber Knight",
    role: "Member",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
    wallet: 1200,
    joinedDate: "2024-03-10"
  }
];

