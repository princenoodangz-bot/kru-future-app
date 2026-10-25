// check-auth.js (ฉบับรองรับทั้งสมาชิกและ Guest)
(async function verifySession() {
  const currentPath = window.location.pathname.toLowerCase();
  if (currentPath.endsWith('login.html')) return; // ยกเว้นหน้าล็อกอิน

  const token = localStorage.getItem('kru_active_session');
  const userInfoStr = localStorage.getItem('kru_user_info');

  if (!token || !userInfoStr) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const userInfo = JSON.parse(userInfoStr);

    // 🌟 ถ้ารหัสผู้ใช้ขึ้นต้นด้วย guest_ ให้ผ่านได้เลย ไม่ต้องตรวจในฐานข้อมูล users
    if (userInfo.id && String(userInfo.id).startsWith('guest_')) {
      return;
    }

    // สำหรับสมาชิกทั่วไป ตรวจสอบ Token กับ Supabase (ตรวจสอบเบื้องหลัง ไม่บล็อกหน้าจอ)
  if (window.supabase) {
    supabase
      .from('users')
      .select('active_session_token')
      .eq('id', userInfo.id)
      .single()
      .then(({ data, error }) => {
        if (error || !data || data.active_session_token !== token) {
          alert("เซสชันหมดอายุ หรือมีการเข้าสู่ระบบจากอุปกรณ์อื่น");
          localStorage.clear();
          window.location.href = 'login.html';
        }
      })
      .catch(err => {
        console.warn("ตรวจสอบ session เบื้องหลังล้มเหลว:", err);
      });
  }
  } catch (e) {
    console.warn("Session check error:", e);
  }
})();