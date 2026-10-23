/**
 * AMPHOREUS - Vue 3 Single Page Application Logic
 * Theme: White / Black / Red Crimson Luxury Gaming
 * Framework: Vue.js 3 (Composition API / Reactive Engine)
 * Features: MySQL Database Integration, Authentication, RBAC, Cart, Checkout, Wallet, Library
 */

const { createApp, ref, computed, onMounted, watch } = Vue;

createApp({
  setup() {
    // --- Audio Sound Effects Engine (Web Audio API) ---
    const isSoundEnabled = ref(true);
    let audioCtx = null;

    const initAudio = () => {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
    };

    const playSound = (type = 'click') => {
      if (!isSoundEnabled.value) return;
      try {
        initAudio();
        const now = audioCtx.currentTime;

        if (type === 'click') {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.05);
        } else if (type === 'hover') {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(320, now);
          gain.gain.setValueAtTime(0.03, now);
          gain.gain.linearRampToValueAtTime(0.001, now + 0.03);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.03);
        } else if (type === 'buy') {
          [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.08);
            gain.gain.setValueAtTime(0.12, now + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.2);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.2);
          });
        } else if (type === 'win') {
          [440, 554.37, 659.25, 880].forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + i * 0.06);
            gain.gain.setValueAtTime(0.1, now + i * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.15);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now + i * 0.06);
            osc.stop(now + i * 0.06 + 0.15);
          });
        }
      } catch (e) {
        // AudioContext not allowed or autoplay blocked
      }
    };

    const toggleSound = () => {
      isSoundEnabled.value = !isSoundEnabled.value;
      if (isSoundEnabled.value) {
        playSound('click');
        showToast('เปิดเสียงเอฟเฟกต์แล้ว 🔊', 'info');
      } else {
        showToast('ปิดเสียงเอฟเฟกต์แล้ว 🔇', 'info');
      }
    };

    // --- Theme System (Light / Dark) ---
    const isDarkMode = ref(localStorage.getItem('nexus_theme') !== 'light');

    const applyTheme = (dark) => {
      const html = document.documentElement;
      if (dark) {
        html.setAttribute('data-theme', 'dark');
        html.setAttribute('data-bs-theme', 'dark');
      } else {
        html.setAttribute('data-theme', 'light');
        html.setAttribute('data-bs-theme', 'light');
      }
      localStorage.setItem('nexus_theme', dark ? 'dark' : 'light');
    };

    const toggleTheme = () => {
      playSound('click');
      isDarkMode.value = !isDarkMode.value;
      applyTheme(isDarkMode.value);
      showToast(isDarkMode.value ? '🌙 เปลี่ยนเป็นธีมมืดแล้ว' : '☀️ เปลี่ยนเป็นธีมสว่างแล้ว', 'info');
    };

    // --- Database Integration (MySQL via PHP API) ---
    const dbConnected = ref(false);
    const dbInfo = ref(null);
    const isDbSyncing = ref(false);

    const checkDbStatus = async () => {
      try {
        const res = await fetch('api/status.php');
        if (res.ok) {
          const data = await res.json();
          dbConnected.value = !!data.connected && !!data.databaseExists;
          dbInfo.value = data;
          return dbConnected.value;
        }
      } catch (err) {
        dbConnected.value = false;
      }
      return false;
    };

    const refreshDatabaseData = async (showNotification = false) => {
      isDbSyncing.value = true;
      const online = await checkDbStatus();
      if (online) {
        try {
          // 1. Load Games
          const resG = await fetch('api/games.php');
          const dataG = await resG.json();
          if (dataG.success && Array.isArray(dataG.games) && dataG.games.length > 0) {
            games.value = dataG.games;
          }

          // 2. Load Users
          const resU = await fetch('api/users.php');
          const dataU = await resU.json();
          if (dataU.success && Array.isArray(dataU.users) && dataU.users.length > 0) {
            users.value = dataU.users;
            if (currentUser.value) {
              const fresh = dataU.users.find(u => u.id === currentUser.value.id || u.username.toLowerCase() === currentUser.value.username.toLowerCase());
              if (fresh) currentUser.value = fresh;
            }
          }

          // 3. Load Coupons
          const resC = await fetch('api/coupons.php');
          const dataC = await resC.json();
          if (dataC.success && dataC.coupons) {
            coupons.value = dataC.coupons;
          }

          // 4. Load Orders & Library
          const resO = await fetch('api/orders.php');
          const dataO = await resO.json();
          if (dataO.success && Array.isArray(dataO.orders)) {
            allPurchasedLibrary.value = dataO.orders;
            orderTransactions.value = dataO.orders;
          }

          // 5. User Cart & Wishlist
          if (currentUser.value && currentUser.value.id) {
            await loadUserCartAndWishlist(currentUser.value.id);
          }

          if (showNotification) {
            showToast('ซิงค์ข้อมูลกับ MySQL สำเร็จแล้ว! 🚀', 'success');
          }
        } catch (err) {
          console.warn('DB load error:', err);
        }
      }
      isDbSyncing.value = false;
    };

    const loadUserCartAndWishlist = async (userId) => {
      if (!dbConnected.value || !userId) return;
      try {
        // Cart
        const resCart = await fetch(`api/cart.php?user_id=${userId}`);
        const dataCart = await resCart.json();
        if (dataCart.success && Array.isArray(dataCart.cart)) {
          cart.value = dataCart.cart;
        }
        // Wishlist
        const resWish = await fetch(`api/wishlist.php?user_id=${userId}`);
        const dataWish = await resWish.json();
        if (dataWish.success && Array.isArray(dataWish.wishlist)) {
          wishlist.value = dataWish.wishlist;
        }
      } catch (e) {
        console.warn('loadUserCartAndWishlist error:', e);
      }
    };

    const resetAndSeedDb = async () => {
      playSound('click');
      try {
        const res = await fetch('api/setup_db.php');
        const data = await res.json();
        if (data.success) {
          await refreshDatabaseData(false);
          Swal.fire({
            icon: 'success',
            title: 'ติดตั้ง / รีเซ็ตฐานข้อมูลสำเร็จ!',
            html: `สร้างและนำเข้าข้อมูลตาราง MySQL (<b>${data.database}</b>) เรียบร้อยแล้ว`,
            background: '#110909',
            color: '#fff',
            confirmButtonColor: '#dc2626'
          });
        } else {
          showToast(data.error || 'Setup ล้มเหลว', 'error');
        }
      } catch (err) {
        showToast('ไม่สามารถเชื่อมต่อ setup_db.php ได้', 'error');
      }
    };

    // --- State & Catalog Data ---
    const users = ref(JSON.parse(localStorage.getItem('nexus_users') || JSON.stringify(INITIAL_USERS_DATA)));
    const currentUser = ref(JSON.parse(localStorage.getItem('nexus_current_user') || JSON.stringify(INITIAL_USERS_DATA[1]))); // Default as Member (รัชต)
    
    const loginForm = ref({ username: '', password: '' });
    const registerForm = ref({ name: '', username: '', password: '', confirmPassword: '' });

    const isLoggedIn = computed(() => !!currentUser.value);
    const isAdmin = computed(() => currentUser.value && currentUser.value.role === 'Admin');
    const isMember = computed(() => currentUser.value && currentUser.value.role === 'Member');

    // Save users & session locally as cache
    watch(users, (newVal) => localStorage.setItem('nexus_users', JSON.stringify(newVal)), { deep: true });
    watch(currentUser, (newVal) => localStorage.setItem('nexus_current_user', JSON.stringify(newVal)), { deep: true });

    const games = ref(JSON.parse(localStorage.getItem('nexus_games') || JSON.stringify(INITIAL_GAMES_DATA)));
    const coupons = ref(JSON.parse(localStorage.getItem('nexus_coupons') || JSON.stringify(COUPONS_DATA)));
    const searchQuery = ref('');
    const selectedCategory = ref('All');
    const selectedPlatform = ref('All');
    const selectedPriceFilter = ref('all');
    const sortBy = ref('popular');

    // Modals & Detail state
    const selectedGame = ref(null);
    const activeScreenshot = ref('');
    const selectedDetailPlatform = ref('PC');

    // Cart & Wishlist & Wallet state
    const cart = ref(JSON.parse(localStorage.getItem('nexus_cart') || '[]'));
    const wishlist = ref(JSON.parse(localStorage.getItem('nexus_wishlist') || '[]'));
    const walletBalance = computed({
      get: () => currentUser.value ? currentUser.value.wallet : 0,
      set: (val) => {
        if (currentUser.value) {
          currentUser.value.wallet = val;
          const u = users.value.find(x => x.id === currentUser.value.id);
          if (u) u.wallet = val;
        }
      }
    });

    const allPurchasedLibrary = ref(JSON.parse(localStorage.getItem('nexus_library') || '[]'));
    const orderTransactions = ref(JSON.parse(localStorage.getItem('nexus_transactions') || '[]'));

    // Separate user library for current active account
    const userLibrary = computed(() => {
      if (!currentUser.value) return [];
      const currentId = currentUser.value.id;
      const currentEmail = (currentUser.value.username || '').toLowerCase().trim();
      const currentName = (currentUser.value.name || '').toLowerCase().trim();

      return allPurchasedLibrary.value.filter(item => {
        if (item.userId && currentId) {
          return item.userId === currentId;
        }
        if (item.userEmail && currentEmail) {
          return item.userEmail.toLowerCase().trim() === currentEmail;
        }
        if (item.userName && currentName) {
          return item.userName.toLowerCase().trim() === currentName;
        }
        return false;
      });
    });

    const purchasedLibrary = userLibrary;

    // Coupon state
    const couponCodeInput = ref('');
    const appliedCoupon = ref(null);

    // Topup state
    const selectedTopupAmount = ref(500);
    const customTopupAmount = ref(null);
    const topupPaymentMethod = ref('PromptPay');

    // Checkout state
    const checkoutPaymentMethod = ref('Wallet');
    const checkoutEmail = ref(currentUser.value ? currentUser.value.username : 'user.gamer@nexus.com');
    const isProcessing = ref(false);

    // Admin CRUD state
    const adminActiveTab = ref('games');
    const gameForm = ref({});
    const couponForm = ref({ code: '', type: 'percent', value: 10, minSpend: 500, description: '' });
    const isEditingGame = ref(false);

    // Toast notifications
    const toasts = ref([]);
    const showToast = (message, type = 'success') => {
      const id = Date.now() + Math.random();
      toasts.value.push({ id, message, type });
      setTimeout(() => {
        toasts.value = toasts.value.filter(t => t.id !== id);
      }, 3500);
    };

    // Profile Settings state
    const profileActiveTab = ref('info');
    const profileForm = ref({
      name: '',
      bio: '',
      country: 'TH',
      favPlatform: 'PC',
      avatar: ''
    });
    const passwordForm = ref({
      current: '',
      newPw: '',
      confirm: ''
    });
    const showCurrentPw = ref(false);
    const showNewPw = ref(false);
    const showConfirmPw = ref(false);

    const profilePrefs = ref(JSON.parse(localStorage.getItem('nexus_profile_prefs') || JSON.stringify({
      soundEnabled: true,
      notifPromos: true,
      notifOrders: true,
      notifWishlist: true,
      currency: 'THB',
      language: 'th'
    })));

    watch(profilePrefs, (val) => localStorage.setItem('nexus_profile_prefs', JSON.stringify(val)), { deep: true });

    const presetAvatars = [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
    ];

    const pwStrength = computed(() => {
      const pw = passwordForm.value.newPw;
      if (!pw) return 0;
      let score = 0;
      if (pw.length >= 6) score++;
      if (pw.length >= 10) score++;
      if (/[A-Z]/.test(pw)) score++;
      if (/[0-9]/.test(pw)) score++;
      if (/[^A-Za-z0-9]/.test(pw)) score++;
      return score;
    });

    const pwStrengthWidth = computed(() => {
      return (pwStrength.value / 5) * 100 + '%';
    });

    const pwStrengthClass = computed(() => {
      const s = pwStrength.value;
      if (s <= 1) return 'bg-danger';
      if (s <= 3) return 'bg-warning';
      return 'bg-success';
    });

    const pwStrengthTextClass = computed(() => {
      const s = pwStrength.value;
      if (s <= 1) return 'text-danger';
      if (s <= 3) return 'text-warning';
      return 'text-success';
    });

    const pwStrengthLabel = computed(() => {
      const s = pwStrength.value;
      if (s === 0) return 'ยังไม่ได้ระบุ';
      if (s <= 1) return 'อ่อนมาก';
      if (s <= 2) return 'อ่อน';
      if (s <= 3) return 'ปานกลาง';
      if (s <= 4) return 'แข็งแกร่ง';
      return 'แข็งแกร่งมาก!';
    });

    const openProfileSettings = () => {
      if (!currentUser.value) return;
      profileActiveTab.value = 'info';
      profileForm.value = {
        name: currentUser.value.name || '',
        bio: currentUser.value.bio || '',
        country: currentUser.value.country || 'TH',
        favPlatform: currentUser.value.favPlatform || 'PC',
        avatar: currentUser.value.avatar || ''
      };
      passwordForm.value = { current: '', newPw: '', confirm: '' };
      showCurrentPw.value = false;
      showNewPw.value = false;
      showConfirmPw.value = false;

      setTimeout(() => {
        document.querySelectorAll('.profile-tab-btn').forEach(btn => btn.classList.remove('active'));
        const firstTab = document.getElementById('tab-info');
        if (firstTab) firstTab.classList.add('active');
      }, 50);
    };

    watch(profileActiveTab, (tab) => {
      setTimeout(() => {
        document.querySelectorAll('.profile-tab-btn').forEach(btn => btn.classList.remove('active'));
        const tabEl = document.getElementById('tab-' + tab);
        if (tabEl) tabEl.classList.add('active');
      }, 10);
    });

    const saveProfileInfo = async () => {
      playSound('click');
      if (!profileForm.value.name.trim()) {
        showToast('กรุณากรอกชื่อแสดงผล', 'error');
        return;
      }

      if (dbConnected.value && currentUser.value) {
        try {
          const res = await fetch('api/users.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'update_profile',
              user_id: currentUser.value.id,
              name: profileForm.value.name.trim(),
              bio: profileForm.value.bio || ''
            })
          });
          const data = await res.json();
          if (data.success && data.user) {
            currentUser.value.name = data.user.name;
            currentUser.value.bio = data.user.bio;
            const u = users.value.find(x => x.id === currentUser.value.id);
            if (u) {
              u.name = data.user.name;
              u.bio = data.user.bio;
            }
            playSound('win');
            showToast('บันทึกข้อมูลโปรไฟล์ลง MySQL เรียบร้อยแล้ว! ✅', 'success');
            return;
          }
        } catch (e) {
          console.warn('MySQL profile update error:', e);
        }
      }

      currentUser.value.name = profileForm.value.name.trim();
      currentUser.value.bio = profileForm.value.bio || '';
      currentUser.value.country = profileForm.value.country || 'TH';
      currentUser.value.favPlatform = profileForm.value.favPlatform || 'PC';
      const u = users.value.find(x => x.id === currentUser.value.id);
      if (u) {
        u.name = currentUser.value.name;
        u.bio = currentUser.value.bio;
      }
      playSound('win');
      showToast('บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว! ✅', 'success');
    };

    const saveProfileAvatar = async () => {
      playSound('click');
      if (!profileForm.value.avatar) {
        showToast('กรุณาเลือกหรือกรอก URL รูปโปรไฟล์', 'error');
        return;
      }

      if (dbConnected.value && currentUser.value) {
        try {
          const res = await fetch('api/users.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'update_avatar',
              user_id: currentUser.value.id,
              avatar: profileForm.value.avatar
            })
          });
          const data = await res.json();
          if (data.success && data.user) {
            currentUser.value.avatar = data.user.avatar;
            const u = users.value.find(x => x.id === currentUser.value.id);
            if (u) u.avatar = data.user.avatar;
            playSound('win');
            showToast('เปลี่ยนรูปโปรไฟล์ใน MySQL เรียบร้อยแล้ว! 🖼️', 'success');
            return;
          }
        } catch (e) {
          console.warn('MySQL avatar update error:', e);
        }
      }

      currentUser.value.avatar = profileForm.value.avatar;
      const u = users.value.find(x => x.id === currentUser.value.id);
      if (u) u.avatar = currentUser.value.avatar;
      playSound('win');
      showToast('เปลี่ยนรูปโปรไฟล์เรียบร้อยแล้ว! 🖼️', 'success');
    };

    const savePassword = async () => {
      playSound('click');
      const { current, newPw, confirm } = passwordForm.value;
      if (!current || !newPw || !confirm) {
        showToast('กรุณากรอกข้อมูลให้ครบทุกช่อง', 'error');
        return;
      }
      if (newPw.length < 6) {
        showToast('รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร', 'error');
        return;
      }
      if (newPw !== confirm) {
        showToast('รหัสผ่านใหม่และการยืนยันไม่ตรงกัน', 'error');
        return;
      }

      if (dbConnected.value && currentUser.value) {
        try {
          const res = await fetch('api/users.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'update_password',
              user_id: currentUser.value.id,
              oldPassword: current,
              newPassword: newPw
            })
          });
          const data = await res.json();
          if (!data.success) {
            showToast(data.error || 'รหัสผ่านปัจจุบันไม่ถูกต้อง', 'error');
            return;
          }
          currentUser.value.password = newPw;
          const u = users.value.find(x => x.id === currentUser.value.id);
          if (u) u.password = newPw;
          passwordForm.value = { current: '', newPw: '', confirm: '' };
          playSound('win');
          showToast('เปลี่ยนรหัสผ่านใน MySQL เรียบร้อยแล้ว! 🔒', 'success');
          return;
        } catch (e) {
          console.warn('MySQL password update error:', e);
        }
      }

      if (current !== currentUser.value.password) {
        showToast('รหัสผ่านปัจจุบันไม่ถูกต้อง', 'error');
        return;
      }
      currentUser.value.password = newPw;
      const u = users.value.find(x => x.id === currentUser.value.id);
      if (u) u.password = newPw;
      passwordForm.value = { current: '', newPw: '', confirm: '' };
      playSound('win');
      showToast('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว! 🔒', 'success');
    };

    const savePreferences = async () => {
      playSound('click');
      if (dbConnected.value && currentUser.value) {
        try {
          await fetch('api/users.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'update_prefs',
              user_id: currentUser.value.id,
              ...profilePrefs.value
            })
          });
        } catch (e) {}
      }
      localStorage.setItem('nexus_profile_prefs', JSON.stringify(profilePrefs.value));
      playSound('win');
      showToast('บันทึกการตั้งค่าเรียบร้อยแล้ว! ⚙️', 'success');
    };

    // Cache to LocalStorage for offline speed
    watch(games, (newVal) => localStorage.setItem('nexus_games', JSON.stringify(newVal)), { deep: true });
    watch(coupons, (newVal) => localStorage.setItem('nexus_coupons', JSON.stringify(newVal)), { deep: true });
    watch(cart, (newVal) => {
      localStorage.setItem('nexus_cart', JSON.stringify(newVal));
      if (dbConnected.value && currentUser.value && currentUser.value.id) {
        fetch('api/cart.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'sync', user_id: currentUser.value.id, cart: newVal })
        }).catch(() => {});
      }
    }, { deep: true });
    watch(wishlist, (newVal) => {
      localStorage.setItem('nexus_wishlist', JSON.stringify(newVal));
      if (dbConnected.value && currentUser.value && currentUser.value.id) {
        fetch('api/wishlist.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'sync', user_id: currentUser.value.id, wishlist: newVal })
        }).catch(() => {});
      }
    }, { deep: true });
    watch(allPurchasedLibrary, (newVal) => localStorage.setItem('nexus_library', JSON.stringify(newVal)), { deep: true });
    watch(orderTransactions, (newVal) => localStorage.setItem('nexus_transactions', JSON.stringify(newVal)), { deep: true });

    // Sync checkout email when user logs in
    watch(currentUser, (u) => {
      if (u) {
        checkoutEmail.value = u.username;
        if (dbConnected.value) {
          loadUserCartAndWishlist(u.id);
        }
      }
    });

    // --- Authentication Actions ---
    const handleLogin = async () => {
      playSound('click');
      const { username, password } = loginForm.value;
      if (!username || !password) {
        showToast('กรุณากรอกอีเมลและรหัสผ่าน', 'error');
        return;
      }

      if (dbConnected.value) {
        try {
          const res = await fetch('api/users.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'login', username, password })
          });
          const data = await res.json();
          if (!data.success) {
            Swal.fire({
              icon: 'error',
              title: 'เข้าสู่ระบบไม่สำเร็จ',
              text: data.error || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
              background: '#110909',
              color: '#fff',
              confirmButtonColor: '#dc2626'
            });
            return;
          }

          currentUser.value = data.user;
          if (data.prefs) profilePrefs.value = data.prefs;
          loginForm.value = { username: '', password: '' };

          // Load user's cart & wishlist from MySQL
          await loadUserCartAndWishlist(data.user.id);

          const loginModalEl = document.getElementById('loginModal');
          if (loginModalEl) bootstrap.Modal.getInstance(loginModalEl)?.hide();

          playSound('win');
          Swal.fire({
            icon: 'success',
            title: `ยินดีต้อนรับคุณ ${data.user.name}`,
            text: `เข้าสู่ระบบสำเร็จในฐานะ [${data.user.role}] (เชื่อมต่อ MySQL)`,
            background: '#110909',
            color: '#fff',
            confirmButtonColor: '#dc2626'
          });
          return;
        } catch (e) {
          console.warn('MySQL login failed, trying fallback:', e);
        }
      }

      // Local fallback
      const found = users.value.find(u => u.username.toLowerCase() === username.toLowerCase().trim() && u.password === password);
      if (!found) {
        Swal.fire({
          icon: 'error',
          title: 'เข้าสู่ระบบไม่สำเร็จ',
          text: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง',
          background: '#110909',
          color: '#fff',
          confirmButtonColor: '#dc2626'
        });
        return;
      }

      currentUser.value = found;
      loginForm.value = { username: '', password: '' };

      const loginModalEl = document.getElementById('loginModal');
      if (loginModalEl) bootstrap.Modal.getInstance(loginModalEl)?.hide();

      playSound('win');
      Swal.fire({
        icon: 'success',
        title: `ยินดีต้อนรับคุณ ${found.name}`,
        text: `เข้าสู่ระบบสำเร็จในฐานะ [${found.role}]`,
        background: '#110909',
        color: '#fff',
        confirmButtonColor: '#dc2626'
      });
    };

    const quickLogin = async (role) => {
      playSound('click');
      const targetUser = users.value.find(u => u.role === role);
      if (targetUser) {
        currentUser.value = targetUser;
        if (dbConnected.value) {
          await loadUserCartAndWishlist(targetUser.id);
        }
        const loginModalEl = document.getElementById('loginModal');
        if (loginModalEl) bootstrap.Modal.getInstance(loginModalEl)?.hide();

        playSound('win');
        showToast(`เข้าสู่ระบบเป็น ${targetUser.name} (${targetUser.role}) เรียบร้อยแล้ว!`, 'success');
      }
    };

    const handleRegister = async () => {
      playSound('click');
      const { name, username, password, confirmPassword } = registerForm.value;
      if (!name || !username || !password) {
        showToast('กรุณากรอกข้อมูลให้ครบทุกช่อง', 'error');
        return;
      }

      if (password !== confirmPassword) {
        showToast('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน', 'error');
        return;
      }

      if (dbConnected.value) {
        try {
          const res = await fetch('api/users.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'register', name, username, password })
          });
          const data = await res.json();
          if (!data.success) {
            showToast(data.error || 'สมัครสมาชิกไม่สำเร็จ', 'error');
            return;
          }

          users.value.push(data.user);
          currentUser.value = data.user;
          registerForm.value = { name: '', username: '', password: '', confirmPassword: '' };

          const registerModalEl = document.getElementById('registerModal');
          if (registerModalEl) bootstrap.Modal.getInstance(registerModalEl)?.hide();

          playSound('win');
          triggerConfetti();

          Swal.fire({
            icon: 'success',
            title: 'สมัครสมาชิกสำเร็จ (MySQL)!',
            html: `ยินดีต้อนรับคุณ <b>${data.user.name}</b> สู่ AMPHOREUS เข้าสู่ระบบเรียบร้อยแล้ว`,
            background: '#110909',
            color: '#fff',
            confirmButtonColor: '#dc2626'
          });
          return;
        } catch (e) {
          console.warn('MySQL register error, using fallback:', e);
        }
      }

      // Local fallback
      const existing = users.value.find(u => u.username.toLowerCase() === username.toLowerCase().trim());
      if (existing) {
        showToast('อีเมลนี้ถูกใช้งานแล้วในระบบ', 'error');
        return;
      }

      const newUser = {
        id: Date.now(),
        username: username.trim(),
        password: password,
        name: name.trim(),
        role: 'Member',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        wallet: 500,
        joinedDate: new Date().toISOString().split('T')[0]
      };

      users.value.push(newUser);
      currentUser.value = newUser;
      registerForm.value = { name: '', username: '', password: '', confirmPassword: '' };

      const registerModalEl = document.getElementById('registerModal');
      if (registerModalEl) bootstrap.Modal.getInstance(registerModalEl)?.hide();

      playSound('win');
      triggerConfetti();

      Swal.fire({
        icon: 'success',
        title: 'สมัครสมาชิกสำเร็จ!',
        html: `ยินดีต้อนรับคุณ <b>${newUser.name}</b> สู่ AMPHOREUS เข้าสู่ระบบเรียบร้อยแล้ว`,
        background: '#110909',
        color: '#fff',
        confirmButtonColor: '#dc2626'
      });
    };

    const handleLogout = () => {
      playSound('click');
      currentUser.value = null;
      showToast('ออกจากระบบเรียบร้อยแล้ว', 'info');
    };

    // Toggle Role in Admin table
    const toggleUserRole = async (u) => {
      playSound('click');
      if (u.id === currentUser.value.id) {
        showToast('ไม่สามารถเปลี่ยนสิทธิ์ของบัญชีที่กำลังใช้งานอยู่ได้', 'error');
        return;
      }

      if (dbConnected.value) {
        try {
          const res = await fetch('api/users.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'toggle_role', user_id: u.id })
          });
          const data = await res.json();
          if (data.success && data.user) {
            u.role = data.user.role;
            showToast(`เปลี่ยนสิทธิ์ ${u.name} เป็น ${u.role} ใน MySQL แล้ว! 🛡️`);
            return;
          }
        } catch (e) {
          console.warn('MySQL toggle role error:', e);
        }
      }

      u.role = u.role === 'Admin' ? 'Member' : 'Admin';
      showToast(`เปลี่ยนสิทธิ์ ${u.name} เป็น ${u.role} แล้ว`);
    };

    // --- Computed Filtered Games ---
    const categories = computed(() => {
      const set = new Set(['All']);
      games.value.forEach(g => set.add(g.category));
      return Array.from(set);
    });

    const platformsList = ['All', 'PC', 'PS5', 'Xbox Series X', 'Nintendo Switch'];

    const filteredGames = computed(() => {
      return games.value.filter(game => {
        // Search Filter
        const query = searchQuery.value.toLowerCase().trim();
        const matchesSearch = !query || 
          game.title.toLowerCase().includes(query) ||
          (game.titleTh && game.titleTh.toLowerCase().includes(query)) ||
          (game.publisher && game.publisher.toLowerCase().includes(query)) ||
          (game.tags && game.tags.some(t => t.toLowerCase().includes(query)));

        // Category Filter
        const matchesCategory = selectedCategory.value === 'All' || game.category === selectedCategory.value;

        // Platform Filter
        const matchesPlatform = selectedPlatform.value === 'All' || 
          (game.platforms && game.platforms.includes(selectedPlatform.value));

        // Price Filter
        let matchesPrice = true;
        if (selectedPriceFilter.value === 'under500') {
          matchesPrice = game.price < 500;
        } else if (selectedPriceFilter.value === '500-1500') {
          matchesPrice = game.price >= 500 && game.price <= 1500;
        } else if (selectedPriceFilter.value === 'over1500') {
          matchesPrice = game.price > 1500;
        } else if (selectedPriceFilter.value === 'discounted') {
          matchesPrice = game.discount > 0;
        }

        return matchesSearch && matchesCategory && matchesPlatform && matchesPrice;
      }).sort((a, b) => {
        if (sortBy.value === 'priceAsc') return a.price - b.price;
        if (sortBy.value === 'priceDesc') return b.price - a.price;
        if (sortBy.value === 'rating') return b.rating - a.rating;
        if (sortBy.value === 'discount') return b.discount - a.discount;
        // Default popular
        return (b.reviewsCount || 0) - (a.reviewsCount || 0);
      });
    });

    // Special game subsets
    const featuredGames = computed(() => games.value.filter(g => g.isFeatured));
    const hotGames = computed(() => games.value.filter(g => g.isHot));
    const bestSellerGames = computed(() => games.value.filter(g => g.isBestSeller));
    const onSaleGames = computed(() => games.value.filter(g => g.discount > 0));

    // Cart calculations
    const cartCount = computed(() => cart.value.reduce((total, item) => total + item.quantity, 0));
    const cartSubtotal = computed(() => cart.value.reduce((total, item) => total + (item.price * item.quantity), 0));

    const discountAmount = computed(() => {
      if (!appliedCoupon.value) return 0;
      if (appliedCoupon.value.type === 'percent') {
        return Math.round((cartSubtotal.value * appliedCoupon.value.value) / 100);
      }
      return appliedCoupon.value.value;
    });

    const cartTotal = computed(() => Math.max(0, cartSubtotal.value - discountAmount.value));

    // --- Cart Actions ---
    const addToCart = (game, platform = null) => {
      playSound('click');
      const targetPlatform = platform || (game.platforms && game.platforms[0]) || 'PC';
      const existing = cart.value.find(item => item.id === game.id && item.platform === targetPlatform);

      if (existing) {
        existing.quantity += 1;
        showToast(`เพิ่มจำนวน ${game.title} ในตะกร้าแล้ว (+1)`);
      } else {
        cart.value.push({
          id: game.id,
          title: game.title,
          titleTh: game.titleTh,
          price: game.price,
          originalPrice: game.originalPrice,
          discount: game.discount,
          coverImage: game.coverImage,
          platform: targetPlatform,
          quantity: 1
        });
        showToast(`เพิ่ม "${game.title}" ลงในตะกร้าแล้ว! 🛒`);
      }
    };

    const updateQuantity = (index, delta) => {
      playSound('click');
      if (cart.value[index]) {
        cart.value[index].quantity += delta;
        if (cart.value[index].quantity <= 0) {
          cart.value.splice(index, 1);
          showToast('นำสินค้าออกจากตะกร้าแล้ว');
        }
      }
    };

    const removeFromCart = (index) => {
      playSound('click');
      cart.value.splice(index, 1);
      showToast('นำสินค้าออกจากตะกร้าแล้ว');
    };

    const clearCart = () => {
      playSound('click');
      cart.value = [];
      appliedCoupon.value = null;
    };

    // --- Wishlist Actions ---
    const isInWishlist = (gameId) => wishlist.value.includes(gameId);

    const toggleWishlist = async (game) => {
      playSound('click');
      const idx = wishlist.value.indexOf(game.id);
      if (idx > -1) {
        wishlist.value.splice(idx, 1);
        showToast(`นำ ${game.title} ออกจากรายการโปรดแล้ว`, 'info');
      } else {
        wishlist.value.push(game.id);
        showToast(`เพิ่ม ${game.title} ในรายการโปรดแล้ว! ❤️`, 'success');
      }

      if (dbConnected.value && currentUser.value) {
        try {
          await fetch('api/wishlist.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'toggle',
              user_id: currentUser.value.id,
              game_id: game.id
            })
          });
        } catch (e) {}
      }
    };

    const wishlistGames = computed(() => {
      return games.value.filter(g => wishlist.value.includes(g.id));
    });

    // --- Coupon Actions ---
    const applyCoupon = () => {
      playSound('click');
      const code = couponCodeInput.value.trim().toUpperCase();
      if (!code) {
        showToast('กรุณากรอกโค้ดส่วนลด', 'error');
        return;
      }

      const coupon = coupons.value[code];
      if (!coupon) {
        Swal.fire({
          icon: 'error',
          title: 'โค้ดไม่ถูกต้อง',
          text: 'ไม่พบคูปองส่วนลดนี้ หรือหมดอายุการใช้งานแล้ว',
          background: '#110909',
          color: '#fff',
          confirmButtonColor: '#dc2626'
        });
        return;
      }

      if (cartSubtotal.value < coupon.minSpend) {
        Swal.fire({
          icon: 'warning',
          title: 'ยอดซื้อไม่ถึงเกณฑ์',
          text: `คูปองนี้ต้องมียอดซื้อขั้นต่ำ ${coupon.minSpend.toLocaleString()} บาท (ยอดปัจจุบัน: ${cartSubtotal.value.toLocaleString()} บาท)`,
          background: '#110909',
          color: '#fff',
          confirmButtonColor: '#dc2626'
        });
        return;
      }

      appliedCoupon.value = coupon;
      couponCodeInput.value = '';
      playSound('win');
      
      Swal.fire({
        icon: 'success',
        title: 'ใช้โค้ดส่วนลดสำเร็จ!',
        text: `ได้รับ ${coupon.description}`,
        background: '#110909',
        color: '#fff',
        confirmButtonColor: '#dc2626'
      });
    };

    const removeCoupon = () => {
      appliedCoupon.value = null;
      showToast('ยกเลิกโค้ดส่วนลดแล้ว', 'info');
    };

    // --- Game Detail Modal ---
    const openGameDetail = (game) => {
      playSound('click');
      selectedGame.value = game;
      activeScreenshot.value = (game.screenshots && game.screenshots.length > 0) ? game.screenshots[0] : game.coverImage;
      selectedDetailPlatform.value = (game.platforms && game.platforms[0]) || 'PC';
      
      const modalEl = document.getElementById('gameDetailModal');
      if (modalEl) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
      }
    };

    const generateKey = () => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      const segment = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      return `AMPH-${segment()}-${segment()}-${segment()}`;
    };

    const triggerConfetti = () => {
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#ef4444', '#dc2626', '#ffffff', '#f87171', '#fee2e2']
        });
      }
    };

    // --- Checkout Logic (MySQL & Wallet) ---
    const processCheckout = async () => {
      if (!isLoggedIn.value) {
        const checkoutModalEl = document.getElementById('checkoutModal');
        if (checkoutModalEl) bootstrap.Modal.getInstance(checkoutModalEl)?.hide();

        const loginModalEl = document.getElementById('loginModal');
        if (loginModalEl) bootstrap.Modal.getOrCreateInstance(loginModalEl).show();
        showToast('กรุณาเข้าสู่ระบบก่อนชำระเงิน', 'info');
        return;
      }

      if (cart.value.length === 0) {
        showToast('ไม่มีสินค้าในตะกร้า', 'error');
        return;
      }

      if (checkoutPaymentMethod.value === 'Wallet') {
        if (walletBalance.value < cartTotal.value) {
          Swal.fire({
            icon: 'error',
            title: 'ยอดเงินใน Wallet ไม่เพียงพอ',
            html: `ยอดคงเหลือ: <b>${walletBalance.value.toLocaleString()} ฿</b><br>ยอดที่ต้องชำระ: <b>${cartTotal.value.toLocaleString()} ฿</b><br><br>กรุณาเติมเงินเข้า Wallet ก่อนทำรายการ`,
            background: '#110909',
            color: '#fff',
            showCancelButton: true,
            confirmButtonText: 'ไปหน้าเติมเงิน',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#4b5563'
          }).then((res) => {
            if (res.isConfirmed) {
              const checkoutModalEl = document.getElementById('checkoutModal');
              if (checkoutModalEl) bootstrap.Modal.getInstance(checkoutModalEl)?.hide();
              
              const topupModalEl = document.getElementById('topupModal');
              if (topupModalEl) bootstrap.Modal.getOrCreateInstance(topupModalEl).show();
            }
          });
          return;
        }
      }

      isProcessing.value = true;
      playSound('click');

      // Process via MySQL API if connected
      if (dbConnected.value) {
        try {
          const res = await fetch('api/orders.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'checkout',
              user_id: currentUser.value.id,
              user_email: checkoutEmail.value || currentUser.value.username,
              payment_method: checkoutPaymentMethod.value,
              total_price: cartTotal.value,
              items: cart.value.map(item => ({
                id: item.id,
                title: item.title,
                titleTh: item.titleTh,
                coverImage: item.coverImage,
                platform: item.platform,
                finalPrice: item.price,
                originalPrice: item.originalPrice,
                discount: item.discount,
                quantity: item.quantity
              }))
            })
          });

          const data = await res.json();
          isProcessing.value = false;

          if (!data.success) {
            Swal.fire({
              icon: 'error',
              title: 'การสั่งซื้อไม่สำเร็จ',
              text: data.error || 'เกิดข้อผิดพลาดในการบันทึกคำสั่งซื้อลง MySQL',
              background: '#110909',
              color: '#fff',
              confirmButtonColor: '#dc2626'
            });
            return;
          }

          if (checkoutPaymentMethod.value === 'Wallet' && typeof data.wallet === 'number') {
            walletBalance.value = data.wallet;
          }

          const newPurchases = data.orders || [];
          newPurchases.forEach(o => {
            allPurchasedLibrary.value.unshift(o);
            orderTransactions.value.unshift(o);
          });

          const checkoutModalEl = document.getElementById('checkoutModal');
          if (checkoutModalEl) bootstrap.Modal.getInstance(checkoutModalEl)?.hide();

          cart.value = [];
          appliedCoupon.value = null;

          playSound('buy');
          triggerConfetti();

          Swal.fire({
            icon: 'success',
            title: 'ชำระเงินสำเร็จ (บันทึกลง MySQL)!',
            html: `ขอบคุณสำหรับการสั่งซื้อ ได้ทำการบันทึกข้อมูลและออกคีย์เกม <b>${newPurchases.length} คีย์</b> ลงฐานข้อมูล MySQL เรียบร้อยแล้ว (Order ID: <b>${data.orderId}</b>) จัดส่งไปยัง <b>${checkoutEmail.value}</b> และบันทึกใน "คลังเกมของฉัน" ทันที!`,
            background: '#110909',
            color: '#fff',
            confirmButtonText: 'ดูคีย์เกมในคลัง (My Library)',
            confirmButtonColor: '#dc2626'
          }).then(() => {
            const libModalEl = document.getElementById('libraryModal');
            if (libModalEl) bootstrap.Modal.getOrCreateInstance(libModalEl).show();
          });
          return;
        } catch (err) {
          console.warn('MySQL checkout error, using local fallback:', err);
        }
      }

      // Local fallback
      setTimeout(() => {
        isProcessing.value = false;

        if (checkoutPaymentMethod.value === 'Wallet') {
          walletBalance.value -= cartTotal.value;
        }

        const newPurchases = [];
        const purchaseDate = new Date().toLocaleString('th-TH');

        cart.value.forEach(item => {
          for (let i = 0; i < item.quantity; i++) {
            const key = generateKey();
            const orderRecord = {
              id: Date.now() + Math.random(),
              userId: currentUser.value ? currentUser.value.id : null,
              userEmail: currentUser.value ? currentUser.value.username : (checkoutEmail.value || ''),
              userName: currentUser.value ? currentUser.value.name : 'ผู้ใช้งาน',
              gameTitle: item.title,
              gameTitleTh: item.titleTh,
              platform: item.platform,
              coverImage: item.coverImage,
              price: item.price,
              key: key,
              purchaseDate: purchaseDate,
              paymentMethod: checkoutPaymentMethod.value
            };
            allPurchasedLibrary.value.unshift(orderRecord);
            orderTransactions.value.unshift(orderRecord);
            newPurchases.push(orderRecord);
          }
        });

        const checkoutModalEl = document.getElementById('checkoutModal');
        if (checkoutModalEl) bootstrap.Modal.getInstance(checkoutModalEl)?.hide();

        cart.value = [];
        appliedCoupon.value = null;

        playSound('buy');
        triggerConfetti();

        Swal.fire({
          icon: 'success',
          title: 'ชำระเงินสำเร็จ!',
          html: `ขอบคุณสำหรับการสั่งซื้อ ได้ทำการออกคีย์เกมทั้งหมด <b>${newPurchases.length} คีย์</b> เรียบร้อยแล้ว จัดส่งไปยัง <b>${checkoutEmail.value}</b> และบันทึกใน "คลังเกมของฉัน" ทันที!`,
          background: '#110909',
          color: '#fff',
          confirmButtonText: 'ดูคีย์เกมในคลัง (My Library)',
          confirmButtonColor: '#dc2626'
        }).then(() => {
          const libModalEl = document.getElementById('libraryModal');
          if (libModalEl) bootstrap.Modal.getOrCreateInstance(libModalEl).show();
        });
      }, 800);
    };

    // --- Topup Wallet Simulation ---
    const processTopup = async () => {
      if (!isLoggedIn.value) {
        const topupModalEl = document.getElementById('topupModal');
        if (topupModalEl) bootstrap.Modal.getInstance(topupModalEl)?.hide();

        const loginModalEl = document.getElementById('loginModal');
        if (loginModalEl) bootstrap.Modal.getOrCreateInstance(loginModalEl).show();
        showToast('กรุณาเข้าสู่ระบบก่อนเติมเงิน', 'info');
        return;
      }

      const amount = customTopupAmount.value && customTopupAmount.value > 0 
        ? parseFloat(customTopupAmount.value) 
        : selectedTopupAmount.value;

      if (!amount || amount <= 0) {
        showToast('กรุณาระบุจำนวนเงินที่ต้องการเติม', 'error');
        return;
      }

      playSound('click');
      isProcessing.value = true;

      if (dbConnected.value) {
        try {
          const res = await fetch('api/users.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'topup',
              user_id: currentUser.value.id,
              amount: amount
            })
          });
          const data = await res.json();
          isProcessing.value = false;
          if (data.success) {
            walletBalance.value = data.wallet;
            customTopupAmount.value = null;
            const topupModalEl = document.getElementById('topupModal');
            if (topupModalEl) bootstrap.Modal.getInstance(topupModalEl)?.hide();
            playSound('buy');
            triggerConfetti();
            Swal.fire({
              icon: 'success',
              title: 'เติมเงินสำเร็จ (MySQL)!',
              text: `เติมเงินจำนวน +${amount.toLocaleString()} ฿ เข้า AMPHOREUS Wallet บันทึกลง MySQL เรียบร้อยแล้ว (ยอดคงเหลือใหม่: ${walletBalance.value.toLocaleString()} ฿)`,
              background: '#110909',
              color: '#fff',
              confirmButtonColor: '#dc2626'
            });
            return;
          }
        } catch (e) {
          console.warn('MySQL topup error, using local fallback:', e);
        }
      }

      setTimeout(() => {
        isProcessing.value = false;
        walletBalance.value += amount;
        customTopupAmount.value = null;

        const topupModalEl = document.getElementById('topupModal');
        if (topupModalEl) bootstrap.Modal.getInstance(topupModalEl)?.hide();

        playSound('buy');
        triggerConfetti();

        Swal.fire({
          icon: 'success',
          title: 'เติมเงินสำเร็จ!',
          text: `เติมเงินจำนวน +${amount.toLocaleString()} ฿ เข้า AMPHOREUS Wallet เรียบร้อยแล้ว (ยอดคงเหลือใหม่: ${walletBalance.value.toLocaleString()} ฿)`,
          background: '#110909',
          color: '#fff',
          confirmButtonColor: '#dc2626'
        });
      }, 800);
    };

    const copyKey = (key) => {
      playSound('click');
      navigator.clipboard.writeText(key).then(() => {
        showToast(`คัดลอกคีย์ ${key} แล้ว! 📋`);
      }).catch(() => {
        showToast(`คัดลอกคีย์แล้ว: ${key}`);
      });
    };

    const setCategory = (cat) => {
      playSound('click');
      selectedCategory.value = cat;
    };

    const setPlatform = (plat) => {
      playSound('click');
      selectedPlatform.value = plat;
    };

    // --- Admin CRUD Operations ---
    const openAddGameModal = () => {
      playSound('click');
      isEditingGame.value = false;
      gameForm.value = {
        id: Date.now(),
        title: '',
        titleTh: '',
        category: 'Action RPG',
        platforms: ['PC'],
        price: 990,
        originalPrice: 990,
        discount: 0,
        rating: 4.8,
        reviewsCount: 120,
        releaseDate: new Date().toISOString().split('T')[0],
        publisher: 'AMPHOREUS Studio',
        isFeatured: false,
        isHot: true,
        coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
        description: 'คำอธิบายเกมใหม่ล่าสุด กราฟิกระดับเน็กซ์เจน',
        tags: 'Action, RPG, New',
        systemReq: {
          minimum: { os: "Windows 10 64-bit", cpu: "Intel Core i5", ram: "8 GB RAM", gpu: "GTX 1060", storage: "50 GB" },
          recommended: { os: "Windows 11 64-bit", cpu: "Intel Core i7", ram: "16 GB RAM", gpu: "RTX 3060", storage: "50 GB SSD" }
        }
      };
      const modalEl = document.getElementById('adminGameModal');
      if (modalEl) bootstrap.Modal.getOrCreateInstance(modalEl).show();
    };

    const openEditGameModal = (g) => {
      playSound('click');
      isEditingGame.value = true;
      gameForm.value = {
        ...g,
        tags: Array.isArray(g.tags) ? g.tags.join(', ') : g.tags
      };
      const modalEl = document.getElementById('adminGameModal');
      if (modalEl) bootstrap.Modal.getOrCreateInstance(modalEl).show();
    };

    const saveGameFromAdmin = async () => {
      playSound('click');
      if (!gameForm.value.title || !gameForm.value.price) {
        showToast('กรุณากรอกชื่อเกมและราคา', 'error');
        return;
      }

      const tagsArray = typeof gameForm.value.tags === 'string' 
        ? gameForm.value.tags.split(',').map(t => t.trim()).filter(Boolean)
        : gameForm.value.tags;

      const gamePayload = {
        ...gameForm.value,
        price: parseFloat(gameForm.value.price),
        originalPrice: parseFloat(gameForm.value.originalPrice || gameForm.value.price),
        discount: parseInt(gameForm.value.discount || 0),
        tags: tagsArray,
        systemReq: gameForm.value.systemReq || {
          minimum: { os: "Windows 10 64-bit", cpu: "Intel Core i5", ram: "8 GB RAM", gpu: "GTX 1060", storage: "50 GB" },
          recommended: { os: "Windows 11 64-bit", cpu: "Intel Core i7", ram: "16 GB RAM", gpu: "RTX 3060", storage: "50 GB SSD" }
        }
      };

      if (dbConnected.value) {
        try {
          const action = isEditingGame.value ? 'update' : 'create';
          const res = await fetch('api/games.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, ...gamePayload })
          });
          const data = await res.json();
          if (data.success && data.game) {
            if (isEditingGame.value) {
              const idx = games.value.findIndex(x => x.id === data.game.id);
              if (idx > -1) games.value[idx] = data.game;
              showToast(`บันทึกการแก้ไข "${data.game.title}" ลงใน MySQL แล้ว! 💾`);
            } else {
              games.value.unshift(data.game);
              showToast(`เพิ่มเกมใหม่ "${data.game.title}" ลงใน MySQL เรียบร้อยแล้ว! 🎮`);
            }
            const modalEl = document.getElementById('adminGameModal');
            if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
            return;
          }
        } catch (err) {
          console.warn('MySQL save game error, using local fallback:', err);
        }
      }

      // Local fallback
      if (isEditingGame.value) {
        const idx = games.value.findIndex(x => x.id === gamePayload.id);
        if (idx > -1) {
          games.value[idx] = gamePayload;
          showToast(`บันทึกการแก้ไข "${gamePayload.title}" แล้ว!`);
        }
      } else {
        gamePayload.id = Date.now();
        games.value.unshift(gamePayload);
        showToast(`เพิ่มเกมใหม่ "${gamePayload.title}" เรียบร้อยแล้ว! 🎮`);
      }

      const modalEl = document.getElementById('adminGameModal');
      if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
    };

    const deleteGameFromAdmin = (g) => {
      playSound('click');
      Swal.fire({
        icon: 'warning',
        title: `ต้องการลบเกม "${g.title}" หรือไม่?`,
        text: 'เมื่อลบจากฐานข้อมูล MySQL แล้วจะไม่สามารถกู้คืนได้',
        showCancelButton: true,
        confirmButtonText: 'ยืนยันลบ',
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#4b5563',
        background: '#110909',
        color: '#fff'
      }).then(async (res) => {
        if (res.isConfirmed) {
          if (dbConnected.value) {
            try {
              const apiRes = await fetch('api/games.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete', id: g.id })
              });
              const apiData = await apiRes.json();
              if (apiData.success) {
                games.value = games.value.filter(x => x.id !== g.id);
                showToast(`ลบเกม ${g.title} ออกจาก MySQL สำเร็จ! 🗑️`);
                return;
              }
            } catch (err) {
              console.warn('MySQL delete error:', err);
            }
          }
          games.value = games.value.filter(x => x.id !== g.id);
          showToast(`ลบเกม ${g.title} ออกจากระบบแล้ว`);
        }
      });
    };

    const addCouponFromAdmin = async () => {
      playSound('click');
      const { code, type, value, minSpend, description } = couponForm.value;
      if (!code || !value) {
        showToast('กรุณากรอกโค้ดและมูลค่าส่วนลด', 'error');
        return;
      }
      const cCode = code.trim().toUpperCase();

      if (dbConnected.value) {
        try {
          const res = await fetch('api/coupons.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'add',
              code: cCode,
              type,
              value: parseFloat(value),
              minSpend: parseFloat(minSpend || 0),
              description
            })
          });
          const data = await res.json();
          if (data.success && data.coupon) {
            coupons.value[cCode] = data.coupon;
            couponForm.value = { code: '', type: 'percent', value: 10, minSpend: 500, description: '' };
            showToast(`สร้างโค้ดส่วนลด [${cCode}] ลง MySQL สำเร็จ! 🎟️`);
            return;
          } else {
            showToast(data.error || 'สร้างคูปองไม่สำเร็จ', 'error');
            return;
          }
        } catch (e) {
          console.warn('MySQL coupon error, using local fallback:', e);
        }
      }

      coupons.value[cCode] = {
        code: cCode,
        type: type,
        value: parseFloat(value),
        minSpend: parseFloat(minSpend || 0),
        description: description || `ส่วนลด ${value}${type === 'percent' ? '%' : ' บาท'}`
      };
      couponForm.value = { code: '', type: 'percent', value: 10, minSpend: 500, description: '' };
      showToast(`สร้างโค้ดส่วนลด [${cCode}] สำเร็จ!`);
    };

    const deleteCouponFromAdmin = async (code) => {
      playSound('click');
      if (dbConnected.value) {
        try {
          await fetch('api/coupons.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete', code })
          });
        } catch (e) {}
      }
      delete coupons.value[code];
      showToast(`ลบคูปอง ${code} ออกจาก MySQL แล้ว`);
    };

    // Admin Dashboard Summary Metrics
    const totalSalesRevenue = computed(() => orderTransactions.value.reduce((sum, t) => sum + (t.price || 0), 0));
    const totalOrdersCount = computed(() => orderTransactions.value.length);

    // Initial onMounted hook
    onMounted(async () => {
      await refreshDatabaseData(false);
    });

    return {
      // Sound & Theme
      isSoundEnabled,
      toggleSound,
      playSound,
      isDarkMode,
      toggleTheme,

      // Database
      dbConnected,
      dbInfo,
      isDbSyncing,
      checkDbStatus,
      refreshDatabaseData,
      resetAndSeedDb,

      // Authentication & Roles
      users,
      currentUser,
      isLoggedIn,
      isAdmin,
      isMember,
      loginForm,
      registerForm,
      handleLogin,
      quickLogin,
      handleRegister,
      handleLogout,
      toggleUserRole,

      // Catalog & Filters
      games,
      coupons,
      searchQuery,
      selectedCategory,
      selectedPlatform,
      selectedPriceFilter,
      sortBy,
      categories,
      platformsList,
      filteredGames,
      featuredGames,
      hotGames,
      bestSellerGames,
      onSaleGames,

      // Detail Modal
      selectedGame,
      activeScreenshot,
      selectedDetailPlatform,
      openGameDetail,

      // Cart
      cart,
      cartCount,
      cartSubtotal,
      discountAmount,
      cartTotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,

      // Wishlist
      wishlist,
      wishlistGames,
      isInWishlist,
      toggleWishlist,

      // Coupons
      couponCodeInput,
      appliedCoupon,
      applyCoupon,
      removeCoupon,

      // Checkout
      checkoutPaymentMethod,
      checkoutEmail,
      isProcessing,
      processCheckout,

      // Wallet & Topup
      walletBalance,
      selectedTopupAmount,
      customTopupAmount,
      topupPaymentMethod,
      processTopup,

      // Library & Transactions
      purchasedLibrary,
      userLibrary,
      allPurchasedLibrary,
      orderTransactions,
      copyKey,

      // Admin CRUD
      adminActiveTab,
      gameForm,
      couponForm,
      isEditingGame,
      openAddGameModal,
      openEditGameModal,
      saveGameFromAdmin,
      deleteGameFromAdmin,
      addCouponFromAdmin,
      deleteCouponFromAdmin,
      totalSalesRevenue,
      totalOrdersCount,

      // Toasts
      toasts,

      // Profile Settings
      profileActiveTab,
      profileForm,
      passwordForm,
      showCurrentPw,
      showNewPw,
      showConfirmPw,
      profilePrefs,
      presetAvatars,
      pwStrengthWidth,
      pwStrengthClass,
      pwStrengthTextClass,
      pwStrengthLabel,
      openProfileSettings,
      saveProfileInfo,
      saveProfileAvatar,
      savePassword,
      savePreferences
    };
  }
}).mount('#app');

// Apply saved theme immediately on page load (before Vue mounts)
(function() {
  const saved = localStorage.getItem('nexus_theme');
  if (saved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.setAttribute('data-bs-theme', 'light');
  }
})();
