// check-auth.js (ฉบับเสถียร รองรับสมาชิก, Guest และเน็ตหลุดชั่วคราว)
(function verifySession() {
  const currentPath = window.location.pathname.toLowerCase();
  
  // 1. ยกเว้นหน้าที่ไม่ต้องล็อกอิน (หน้าล็อกอิน และหน้าทดลองสอบฟรี)
  if (currentPath.endsWith('login.html') || currentPath.endsWith('trial-quiz.html')) {
    return;
  }

  const token = localStorage.getItem('kru_active_session');
  const userInfoStr = localStorage.getItem('kru_user_info');

  // ตรวจสอบเบื้องต้นจากข้อมูลในเครื่อง (ไว 0 วินาที)
  if (!token || !userInfoStr) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const userInfo = JSON.parse(userInfoStr);

    // 🌟 บัญชี Guest ให้ผ่านได้ทันที ไม่ต้องยิงเช็กฐานข้อมูล
    if (userInfo.id && String(userInfo.id).startsWith('guest_')) {
      return;
    }

    // 2. สำหรับสมาชิกทั่วไป ตรวจสอบ Token เบื้องหลัง (Background Validation)
    if (window.supabase) {
      supabase
        .from('users')
        .select('active_session_token')
        .eq('id', userInfo.id)
        .single()
        .then(({ data, error }) => {
          // ถ้ามี Network Error หรือเชื่อมต่อไม่ได้ ให้ปล่อยผ่าน (ไม่เตะผู้ใช้ออก)
          if (error) {
            console.warn("ไม่สามารถตรวจสอบสถานะเซสชันได้ (ปัญหาเครือข่าย):", error.message);
            return;
          }

          // ⚠️ จะสั่งเตะออกเฉพาะกรณีที่เซิร์ฟเวอร์ตอบกลับมาแล้วพบว่า Token ไม่ตรงกันจริงๆ เท่านั้น
          if (data && data.active_session_token && data.active_session_token !== token) {
            alert("เซสชันหมดอายุ มีการเข้าสู่ระบบจากอุปกรณ์อื่น");
            localStorage.clear();
            window.location.href = 'login.html';
          }
        })
        .catch(err => {
          console.warn("ตรวจสอบ session ล้มเหลว:", err);
        });
    }
  } catch (e) {
    console.warn("Session check error:", e);
  }
})();