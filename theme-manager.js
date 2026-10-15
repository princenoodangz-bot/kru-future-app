

  // 2. ปรับขนาดตัวอักษรทั้งหน้าจอตามที่ตั้งค่าไว้ใน settings.html (sm / md / lg)
  function applyFontSize() {
    const size = localStorage.getItem('kru_font_size') || 'md';
    let rootSize = '16px'; // ปกติ (md)
    if (size === 'sm') rootSize = '14px'; // เล็ก
    if (size === 'lg') rootSize = '18.5px'; // ใหญ่

    // ปรับ root font-size ซึ่งจะทำให้คลาส text-sm, text-base, text-lg ของ Tailwind ขยายตามทั้งหน้าทันที
    document.documentElement.style.fontSize = rootSize;
  }

  // 3. ปรับโทนสีหลักและกำหนดฟอนต์มาตรฐาน
  const style = document.createElement('style');
  style.id = 'global-theme-style';
  style.innerHTML = `
    /* กำหนดฟอนต์หลักทั้งระบบ */
    body, button, input, select, textarea {
      font-family: 'Sarabun', sans-serif !important;
    }
    h1, h2, h3, h4, h5, h6, .font-heading, .font-display {
      font-family: 'Prompt', sans-serif !important;
    }

    /* คุมโทนสีหลักของแบรนด์ (Academic Khaki & Cream Linen) */
    :root {
      --color-primary: #755634;
      --color-primary-dark: #583f2b;
      --color-surface: #fff8f6;
      --color-linen: #faf6f0;
      --color-accent: #964320;
    }

    /* บังคับสีพื้นหลังของแอปให้เป็นโทนธรรมชาติเนียนตาเหมือนกันทุกหน้า */
    body {
      background-color: #fff8f6 !important;
      color: #1e1b1a !important;
    }
  `;
  document.head.appendChild(style);

  // รันปรับขนาดฟอนต์ทันทีที่เปิดหน้า
  applyFontSize();

  // ดักฟังเหตุการณ์เมื่อมีการเปลี่ยนขนาดฟอนต์ในหน้า settings แบบเรียลไทม์
  window.addEventListener('storage', (e) => {
    if (e.key === 'kru_font_size') {
      applyFontSize();
    }
  });


// theme-manager.js (ฉบับแก้ไข: จัดระเบียบใหม่ ลบส่วนที่ซ้ำซ้อน)
(function initGlobalTheme() {
  // 1. นำเข้าฟอนต์และไอคอนเพียงครั้งเดียว
  if (!document.getElementById('global-fonts')) {
    const fontLink = document.createElement('link');
    fontLink.id = 'global-fonts';
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(fontLink);
  }
  if (!document.getElementById('global-icons')) {
    const iconLink = document.createElement('link');
    iconLink.id = 'global-icons';
    iconLink.rel = 'stylesheet';
    iconLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
    document.head.appendChild(iconLink);
  }

  // 2. ปรับขนาดฟอนต์ตาม settings
  function applyFontSize() {
    const size = localStorage.getItem('kru_font_size') || 'md';
    let rootSize = '16px';
    if (size === 'sm') rootSize = '14px';
    if (size === 'lg') rootSize = '18.5px';
    document.documentElement.style.fontSize = rootSize;
  }
  applyFontSize();

  // 3. กำหนดโทนสีและฟอนต์มาตรฐาน
  if (!document.getElementById('global-theme-style')) {
    const style = document.createElement('style');
    style.id = 'global-theme-style';
    style.innerHTML = `
      body, button, input, select, textarea { font-family: 'Sarabun', sans-serif !important; }
      h1, h2, h3, h4, h5, h6, .font-heading, .font-display, .font-prompt { font-family: 'Prompt', sans-serif !important; }
      body { background-color: #fff8f6 !important; color: #1e1b1a !important; }
    `;
    document.head.appendChild(style);
  }

  // ดักฟังการเปลี่ยนขนาดฟอนต์แบบเรียลไทม์
  window.addEventListener('storage', (e) => {
    if (e.key === 'kru_font_size') applyFontSize();
  });

  // 4. ตรวจจับหน้าปัจจุบันและสร้างแถบ Nav ด้านล่างให้อัตโนมัติ (ยกเว้นหน้าบางหน้า)
  document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.toLowerCase();
    
    if (path.endsWith('login.html') || path.endsWith('admin.html') || path.endsWith('quiz.html')) return;
    if (document.querySelector('nav[data-auto-nav]')) return;

    const isHome = path.endsWith('index.html') || path.endsWith('/') || path === '';
    const isAllExams = path.endsWith('all-exams.html');
    const isHistory = path.endsWith('history.html');
    const isSettings = path.endsWith('settings.html');

    const nav = document.createElement('nav');
    nav.setAttribute('data-auto-nav', 'true');
    nav.className = 'fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[425px] bg-[#FBF9F5]/95 backdrop-blur-md border-t border-[#E8DFD3] px-3 py-2 z-50';
    nav.innerHTML = `
      <div class="flex items-center justify-around">
        <a href="index.html" class="flex flex-col items-center gap-1 py-1 px-2 ${isHome ? 'text-[#755634] font-bold' : 'text-slate-400 hover:text-slate-600'}">
          <i class="fa-solid fa-house text-sm"></i><span class="text-[10px]">หน้าแรก</span>
        </a>
        <a href="all-exams.html" class="flex flex-col items-center gap-1 py-1 px-2 ${isAllExams ? 'text-[#755634] font-bold' : 'text-slate-400 hover:text-slate-600'}">
          <i class="fa-solid fa-book-open text-sm"></i><span class="text-[10px]">รวมข้อสอบ</span>
        </a>
        <a href="quiz.html" class="flex flex-col items-center -mt-5 group active:scale-95 transition-transform">
          <div class="w-12 h-12 rounded-full bg-[#755634] flex items-center justify-center text-white shadow-lg border-2 border-white">
            <i class="fa-solid fa-pen-nib text-base"></i>
          </div>
          <span class="text-[10px] font-bold text-slate-700 mt-1">ทำข้อสอบ</span>
        </a>
        <a href="history.html" class="flex flex-col items-center gap-1 py-1 px-2 ${isHistory ? 'text-[#755634] font-bold' : 'text-slate-400 hover:text-slate-600'}">
          <i class="fa-solid fa-chart-line text-sm"></i><span class="text-[10px]">ประวัติ</span>
        </a>
        <a href="settings.html" class="flex flex-col items-center gap-1 py-1 px-2 ${isSettings ? 'text-[#755634] font-bold' : 'text-slate-400 hover:text-slate-600'}">
          <i class="fa-solid fa-gear text-sm"></i><span class="text-[10px]">ตั้งค่า</span>
        </a>
      </div>
      <div class="w-32 h-1 bg-[#D9CABE] rounded-full mx-auto mt-2 mb-0.5"></div>
    `;
    document.body.appendChild(nav);
  });
})();
// ==========================================
// ลงทะเบียน PWA อัตโนมัติทุกหน้า
// ==========================================
(function registerPWA() {
  if (typeof document === 'undefined') return;

  // 1. เพิ่ม Meta & Link สำหรับ PWA ลงใน <head>
  if (!document.querySelector('link[rel="manifest"]')) {
    const head = document.head;

    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = 'manifest.json';
    head.appendChild(manifestLink);

    const themeColor = document.createElement('meta');
    themeColor.name = 'theme-color';
    themeColor.content = '#755634';
    head.appendChild(themeColor);

    const appleIcon = document.createElement('link');
    appleIcon.rel = 'apple-touch-icon';
    appleIcon.href = 'apple-touch-icon.png';
    head.appendChild(appleIcon);

    const appleMobile = document.createElement('meta');
    appleMobile.name = 'apple-mobile-web-app-capable';
    appleMobile.content = 'yes';
    head.appendChild(appleMobile);

    const appleStatus = document.createElement('meta');
    appleStatus.name = 'apple-mobile-web-app-status-bar-style';
    appleStatus.content = 'default';
    head.appendChild(appleStatus);
  }

  // 2. ลงทะเบียน Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => console.log('✅ PWA Service Worker Ready:', reg.scope))
        .catch((err) => console.warn('PWA registration error:', err));
    });
  }
})();