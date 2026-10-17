

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
// =========================================================
// 🐾 AI Mascot & Tutor Cat (Safe Injector for All Pages)
// =========================================================
function initAiMascot() {
  if (document.getElementById('aiCatMascotContainer')) return;
  if (!document.body) return; // ป้องกันกรณี body ยังไม่พร้อม

  // ในฟังก์ชัน initAiMascot() ภายใน theme-manager.js
  const mascotHTML = `
    <div id="aiCatMascotContainer" class="fixed bottom-24 right-2 z-50 flex items-center pointer-events-auto select-none">
      <div id="catSpeechBubble" class="hidden mr-1 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-xl border border-amber-200 text-xs font-extrabold text-slate-700 animate-bounce max-w-[150px] text-center">
        "สู้ๆ นะคะคุณครู! 🐾"
      </div>
      <!-- ตัวละครแมว 3D จากไฟล์ cat.glb -->
      <div onclick="toggleCatChat()" class="relative cursor-pointer group active:scale-95 transition-transform" title="แตะเพื่อคุยกับน้องเหมียวติวเตอร์ AI">
        <div class="absolute inset-0 rounded-full bg-amber-400/20 blur-md group-hover:scale-110 transition-transform pointer-events-none"></div>
        <div class="relative w-24 h-24 flex items-center justify-center animate-float">
          <model-viewer 
            id="catModelViewer"
            src="./cat.glb" 
            alt="Toon Cat AI" 
            autoplay 
            auto-rotate
            rotation-per-second="30deg"
            shadow-intensity="1"
            exposure="1"
            bounds="tight"
            camera-controls
            disable-zoom
            style="display: block; width: 90px; height: 90px; background: transparent; --poster-color: transparent;">
          </model-viewer>
        </div>
      </div>
    </div>

    <div id="catChatModal" class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 hidden">
      <div class="bg-white/95 backdrop-blur-2xl w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border-t-2 border-white space-y-3 animate-sheet-up flex flex-col max-h-[80vh]">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-2xl bg-amber-100 flex items-center justify-center text-xl shadow-2xs">🐱</div>
            <div>
              <h4 class="text-xs font-extrabold text-slate-800">น้องเหมียวติวเตอร์ AI</h4>
              <span class="text-[9px] font-bold text-emerald-600 flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> พร้อมช่วยคุณครูติวข้อสอบ
              </span>
            </div>
          </div>
          <button onclick="toggleCatChat()" class="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div id="catChatMessages" class="flex-1 overflow-y-auto space-y-2.5 p-2 text-xs bg-slate-50/80 rounded-2xl border border-slate-100 min-h-[220px] max-h-[300px]">
          <div class="flex items-start gap-2">
            <span class="text-base">🐱</span>
            <div class="bg-white p-3 rounded-2xl rounded-tl-xs shadow-2xs text-slate-700 font-medium leading-relaxed">
              เมี๊ยว! สวัสดีค่ะคุณครู มีเรื่องไหนสงสัย หรืออยากให้เหมียวช่วยติวข้อสอบ ถามมาได้เลยนะคะ! 📚✨
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 pt-1">
          <input id="catChatInput" type="text" placeholder="พิมพ์คำถามที่สงสัย เช่น ถามเรื่องอนุกรม..." 
                 class="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-amber-500 focus:bg-white transition-all"
                 onkeydown="if(event.key==='Enter') sendCatMessage()">
          <button onclick="sendCatMessage()" class="bg-[#755634] hover:bg-[#5E4325] text-white px-3.5 py-2 rounded-xl text-xs font-extrabold shadow-sm active:scale-95 transition-all flex items-center justify-center">
            <i class="fa-solid fa-paper-plane text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  if (!document.getElementById('catCustomStyle')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'catCustomStyle';
    styleEl.innerHTML = `
      @keyframes catFloat {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-5px) rotate(3deg); }
      }
      .animate-float { animation: catFloat 3s ease-in-out infinite; }
    `;
    document.head.appendChild(styleEl);
  }

  const wrapper = document.createElement('div');
  wrapper.innerHTML = mascotHTML;
  document.body.appendChild(wrapper);
}

// รอให้หน้าเว็บโหลดโครงสร้าง HTML เสร็จก่อน ค่อยเรียกฟังก์ชันสร้างแมว
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAiMascot);
} else {
  initAiMascot();
}

function toggleCatChat() {
  const modal = document.getElementById('catChatModal');
  if (modal) {
    modal.classList.toggle('hidden');
    document.getElementById('catSpeechBubble')?.classList.add('hidden');
  }
}

function sendCatMessage() {
  const input = document.getElementById('catChatInput');
  const msgContainer = document.getElementById('catChatMessages');
  if (!input || !input.value.trim()) return;

  const userText = input.value.trim();
  input.value = '';

  msgContainer.innerHTML += `
    <div class="flex items-end justify-end gap-2">
      <div class="bg-[#755634] text-white p-3 rounded-2xl rounded-tr-xs shadow-2xs font-medium max-w-[80%] leading-relaxed">
        ${userText}
      </div>
    </div>
  `;
  msgContainer.scrollTop = msgContainer.scrollHeight;

  setTimeout(() => {
    let reply = "เมี๊ยว! เป็นคำถามที่ดีมากค่ะคุณครู สู้ๆ นะคะ เดี๋ยวเราไปลองลุยทำข้อสอบในคลังกันต่อเลย! 💪";
    if (userText.includes('อนุกรม') || userText.includes('เลข')) {
      reply = "เทคนิคข้อสอบอนุกรม ให้ลองหาผลต่างทีละชั้นก่อนนะคะ ถ้าชั้นแรกไม่เท่ากัน ให้ลองหาผลต่างชั้นที่สองต่อค่ะ! 🧮";
    } else if (userText.includes('กฎหมาย') || userText.includes('พ.ร.บ.')) {
      reply = "สู้ๆ ค่ะคุณครู หมวด พ.ร.บ. ระเบียบบริหารราชการแผ่นดิน ออกสอบบ่อยมาก อย่าลืมจำโครงสร้าง ส่วนกลาง ส่วนภูมิภาค และท้องถิ่นให้แม่นนะคะ ⚖️";
    }

    msgContainer.innerHTML += `
      <div class="flex items-start gap-2">
        <span class="text-base">🐱</span>
        <div class="bg-white p-3 rounded-2xl rounded-tl-xs shadow-2xs text-slate-700 font-medium leading-relaxed max-w-[80%]">
          ${reply}
        </div>
      </div>
    `;
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }, 600);
}

// สุ่มเด้งบอลลูนทักทาย
setInterval(() => {
  const bubble = document.getElementById('catSpeechBubble');
  const modal = document.getElementById('catChatModal');
  if (bubble && modal && modal.classList.contains('hidden')) {
    const messages = ['คลิกเหมียวได้นะ! 🐾', 'สู้ๆ เพื่อตั๋วครูค่ะ! ✨', 'วันนี้ทำข้อสอบยังเอ่ย? 📚', 'พักดื่มน้ำก่อนได้น้า 🍵'];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    bubble.innerText = `"${randomMsg}"`;
    bubble.classList.remove('hidden');
    setTimeout(() => bubble.classList.add('hidden'), 5000);
  }
}, 25000);