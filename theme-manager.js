// =========================================================
// theme-manager.js (ฉบับสมบูรณ์: Theme Color, Clean Floating Nav, PWA & 3D Cat)
// =========================================================

// ชุดสีมาตรฐานสำหรับสลับธีมของแอป
const THEME_PALETTES = {
  brown:  { primary: '#755634', dark: '#583f2b', light: '#fff8f6', accent: 'linear-gradient(135deg, #8B653B, #5E4325)' },
  blue:   { primary: '#1e40af', dark: '#172554', light: '#f0f7ff', accent: 'linear-gradient(135deg, #2563eb, #1e40af)' },
  green:  { primary: '#166534', dark: '#14532d', light: '#f0fdf4', accent: 'linear-gradient(135deg, #16a34a, #166534)' },
  purple: { primary: '#6b21a8', dark: '#581c87', light: '#faf5ff', accent: 'linear-gradient(135deg, #9333ea, #6b21a8)' },
  orange: { primary: '#c2410c', dark: '#9a3412', light: '#fff7ed', accent: 'linear-gradient(135deg, #ea580c, #c2410c)' }
};

// ฟังก์ชันปรับสีหลักทั้งระบบ (รองรับการเปลี่ยนสีแบบ Realtime)
function applyThemeColor() {
  const currentTheme = localStorage.getItem('kru_theme_color') || 'brown';
  const palette = THEME_PALETTES[currentTheme] || THEME_PALETTES.brown;

  document.documentElement.style.setProperty('--color-primary', palette.primary);
  document.documentElement.style.setProperty('--color-primary-dark', palette.dark);

  let dynamicStyle = document.getElementById('dynamic-theme-override');
  if (!dynamicStyle) {
    dynamicStyle = document.createElement('style');
    dynamicStyle.id = 'dynamic-theme-override';
    document.head.appendChild(dynamicStyle);
  }

  // ดักทับคลาสสีของ Tailwind เพื่อให้ทุกหน้าเปลี่ยนสีตามทันทีโดยไม่ต้องแก้ HTML
  dynamicStyle.innerHTML = `
    /* สีพื้นหลังและข้อความมาตรฐาน */
    .bg-\\[\\#755634\\], .bg-\\[\\#755634\\]\\/95, .bg-\\[\\#755634\\]\\/90, .bg-primary { background-color: ${palette.primary} !important; }
    .text-\\[\\#755634\\], .text-primary { color: ${palette.primary} !important; }
    .border-\\[\\#755634\\], .border-primary { border-color: ${palette.primary} !important; }
    .hover\\:bg-\\[\\#583f2b\\]:hover, .hover\\:bg-\\[\\#5e4325\\]:hover { background-color: ${palette.dark} !important; }

    /* ปลดล็อกปุ่มที่เป็น Gradient ให้เปลี่ยนเป็นเฉดสีของธีมใหม่ทันที */
    .theme-accent-bg,
    [class*="from-\\[\\#755634\\]"],
    [class*="to-\\[\\#755634\\]"] {
      background-image: ${palette.accent} !important;
    }
  `;
}

// ---------------------------------------------------------
// 1. ระบบจัดการธีม, ฟอนต์ และเมนูล่าง
// ---------------------------------------------------------
(function initGlobalTheme() {
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

  function applyFontSize() {
    const size = localStorage.getItem('kru_font_size') || 'md';
    let rootSize = '16px';
    if (size === 'sm') rootSize = '14px';
    if (size === 'lg') rootSize = '18.5px';
    document.documentElement.style.fontSize = rootSize;
  }
  applyFontSize();
  applyThemeColor();

  if (!document.getElementById('global-theme-style')) {
    const style = document.createElement('style');
    style.id = 'global-theme-style';
    style.innerHTML = `
      body, button, input, select, textarea { font-family: 'Sarabun', sans-serif !important; }
      h1, h2, h3, h4, h5, h6, .font-heading, .font-display, .font-prompt { font-family: 'Prompt', sans-serif !important; }
      body { background-color: #fff8f6 !important; color: #1e1b1a !important; }

      @keyframes catPhysicsJump {
        0% { transform: translateY(0) scale(1, 1); }
        15% { transform: translateY(8px) scale(1.2, 0.75); }
        45% { transform: translateY(-65px) scale(0.9, 1.2); }
        85% { transform: translateY(5px) scale(1.18, 0.78); }
        100% { transform: translateY(0) scale(1, 1); }
      }

      @keyframes shadowPhysicsShrink {
        0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.25; }
        15% { transform: translateX(-50%) scale(1.2); opacity: 0.35; }
        45% { transform: translateX(-50%) scale(0.4); opacity: 0.08; }
        85% { transform: translateX(-50%) scale(1.25); opacity: 0.38; }
      }

      .cat-leaping {
        animation: catPhysicsJump var(--jump-dur, 1.1s) cubic-bezier(0.35, 0, 0.25, 1) forwards !important;
      }
      .shadow-leaping {
        animation: shadowPhysicsShrink var(--jump-dur, 1.1s) cubic-bezier(0.35, 0, 0.25, 1) forwards !important;
      }
    `;
    document.head.appendChild(style);
  }

  window.addEventListener('storage', (e) => {
    if (e.key === 'kru_font_size') applyFontSize();
    if (e.key === 'kru_theme_color') applyThemeColor();
  });

  // สร้างแถบเมนูนำทางด้านล่างแบบ Floating Glass (ตัดปัญหาแท็บซ้อน 100%)
  function renderCleanBottomNav() {
    const path = window.location.pathname.toLowerCase();
    
    // ยกเว้นหน้า login, admin, quiz ไม่ต้องมีเมนูล่าง
    if (path.endsWith('login.html') || path.endsWith('admin.html') || path.endsWith('quiz.html')) {
      document.querySelectorAll('nav').forEach(el => el.remove());
      return;
    }

    // ล้างแท็บเก่าที่อาจค้างอยู่ออกทั้งหมด
    document.querySelectorAll('nav').forEach(el => el.remove());

    const isHome = path.endsWith('index.html') || path.endsWith('/') || path === '';
    const isAllExams = path.endsWith('all-exams.html');
    const isHistory = path.endsWith('history.html');
    const isSettings = path.endsWith('settings.html');

    const nav = document.createElement('nav');
    nav.setAttribute('data-auto-nav', 'true');
    nav.className = 'fixed bottom-3 left-1/2 -translate-x-1/2 w-[calc(100%-24px)] max-w-[406px] bg-white/90 backdrop-blur-xl border-2 border-white rounded-3xl px-3 py-2 z-40 shadow-[0_10px_30px_rgba(117,86,52,0.12)] select-none';
    nav.innerHTML = `
      <div class="flex items-center justify-around">
        <a href="index.html" class="flex flex-col items-center gap-1 py-1 px-2 ${isHome ? 'text-[var(--color-primary)] font-extrabold relative' : 'text-slate-400 hover:text-slate-700 transition-colors'}">
          <i class="fa-solid fa-house text-sm"></i><span class="text-[10px] font-semibold">หน้าแรก</span>
          ${isHome ? '<span class="w-1 h-1 rounded-full bg-[var(--color-primary)] absolute -bottom-0.5"></span>' : ''}
        </a>
        <a href="all-exams.html" class="flex flex-col items-center gap-1 py-1 px-2 ${isAllExams ? 'text-[var(--color-primary)] font-extrabold relative' : 'text-slate-400 hover:text-slate-700 transition-colors'}">
          <i class="fa-solid fa-book-open text-sm"></i><span class="text-[10px] font-semibold">รวมข้อสอบ</span>
          ${isAllExams ? '<span class="w-1 h-1 rounded-full bg-[var(--color-primary)] absolute -bottom-0.5"></span>' : ''}
        </a>
        <a href="quiz.html" class="flex flex-col items-center -mt-6 group active:scale-90 transition-transform">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8B653B] to-[#5E4325] flex items-center justify-center text-white shadow-lg shadow-amber-900/25 border-2 border-white group-hover:rotate-6 transition-transform theme-accent-bg">
            <i class="fa-solid fa-pen-nib text-base"></i>
          </div>
          <span class="text-[10px] font-extrabold text-slate-700 mt-1">ทำข้อสอบ</span>
        </a>
        <a href="history.html" class="flex flex-col items-center gap-1 py-1 px-2 ${isHistory ? 'text-[var(--color-primary)] font-extrabold relative' : 'text-slate-400 hover:text-slate-700 transition-colors'}">
          <i class="fa-solid fa-chart-line text-sm"></i><span class="text-[10px] font-semibold">ประวัติ</span>
          ${isHistory ? '<span class="w-1 h-1 rounded-full bg-[var(--color-primary)] absolute -bottom-0.5"></span>' : ''}
        </a>
        <a href="settings.html" class="flex flex-col items-center gap-1 py-1 px-2 ${isSettings ? 'text-[var(--color-primary)] font-extrabold relative' : 'text-slate-400 hover:text-slate-700 transition-colors'}">
          <i class="fa-solid fa-gear text-sm"></i><span class="text-[10px] font-semibold">ตั้งค่า</span>
          ${isSettings ? '<span class="w-1 h-1 rounded-full bg-[var(--color-primary)] absolute -bottom-0.5"></span>' : ''}
        </a>
      </div>
    `;
    document.body.appendChild(nav);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderCleanBottomNav);
  } else {
    renderCleanBottomNav();
  }
})();

// ---------------------------------------------------------
// 2. ระบบลงทะเบียน PWA (เว็บแอปมือถือ)
// ---------------------------------------------------------
(function registerPWA() {
  if (typeof document === 'undefined') return;

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

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => console.log('✅ PWA Service Worker Ready:', reg.scope))
        .catch((err) => console.warn('PWA registration error:', err));
    });
  }
})();

// ---------------------------------------------------------
// 3. 🐾 น้องแมว 3D AI ผู้ช่วยติวข้อสอบ (ระบบจำพิกัดต่อเนื่องข้ามหน้า)
// ---------------------------------------------------------
function initAiMascot() {
  const path = window.location.pathname.toLowerCase();
  if (path.includes('quiz.html') || path.includes('login.html') || path.endsWith('admin.html')) return;

  if (document.getElementById('aiCatMascotContainer')) return;
  if (!document.body) return;

  if (!document.querySelector('script[src*="model-viewer"]')) {
    const mvScript = document.createElement('script');
    mvScript.type = 'module';
    mvScript.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
    document.head.appendChild(mvScript);
  }

  const savedX = parseFloat(sessionStorage.getItem('cat_pos_x'));
  const savedY = parseFloat(sessionStorage.getItem('cat_pos_y'));
  const savedFacing = sessionStorage.getItem('cat_facing') || 'scaleX(1)';

  const minX = 15;
  const maxX = window.innerWidth - 110;
  const minY = 80;
  const maxY = window.innerHeight - 180;

  let currentPosX = (!isNaN(savedX)) ? Math.max(minX, Math.min(maxX, savedX)) : (window.innerWidth - 110);
  let currentPosY = (!isNaN(savedY)) ? Math.max(minY, Math.min(maxY, savedY)) : (window.innerHeight - 185);

  const mascotHTML = `
    <div id="aiCatMascotContainer" 
         class="fixed z-40 select-none pointer-events-none"
         style="left: ${currentPosX}px; top: ${currentPosY}px; width: 95px; height: 95px;">
      
      <div id="catSpeechBubble" 
           class="hidden absolute -top-10 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-xl border border-amber-200 text-[11px] font-extrabold text-slate-700 whitespace-nowrap z-50">
        "สู้ๆ นะคะคุณครู! 🐾"
      </div>

      <div id="catGroundShadow" 
           class="absolute bottom-1 left-1/2 -translate-x-1/2 w-14 h-3 rounded-full bg-amber-950/20 blur-[1px]"></div>

      <div id="catJumpPhysicsWrapper" class="relative w-full h-full pointer-events-auto">
        <div id="catFlipper" onclick="onCatClicked(event)" style="transform: ${savedFacing};" class="relative w-full h-full cursor-pointer transition-transform duration-300">
          <model-viewer 
            id="catModelViewer"
            src="./cat.glb" 
            alt="Toon Cat AI" 
            autoplay 
            shadow-intensity="1"
            exposure="1"
            bounds="tight"
            interaction-prompt="none"
            camera-orbit="15deg 75deg 105%"
            style="display: block; width: 95px; height: 95px; background: transparent; --poster-color: transparent; pointer-events: none;">
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

  const wrapper = document.createElement('div');
  wrapper.innerHTML = mascotHTML;
  document.body.appendChild(wrapper);

  const catEl = document.getElementById('aiCatMascotContainer');
  const catJumpWrapper = document.getElementById('catJumpPhysicsWrapper');
  const catShadow = document.getElementById('catGroundShadow');
  const catFlipper = document.getElementById('catFlipper');

  let isMoving = false;

  function saveCatState(x, y, facing) {
    try {
      sessionStorage.setItem('cat_pos_x', x);
      sessionStorage.setItem('cat_pos_y', y);
      if (facing) sessionStorage.setItem('cat_facing', facing);
    } catch (e) {}
  }

  window.addEventListener('beforeunload', () => {
    if (catEl) {
      const rect = catEl.getBoundingClientRect();
      const facing = catFlipper ? catFlipper.style.transform : 'scaleX(1)';
      saveCatState(rect.left, rect.top, facing);
    }
  });

  window.walkCatTo = function(targetX, targetY, callback) {
    if (!catEl || isMoving) return;

    const clampedX = Math.max(minX, Math.min(maxX, targetX));
    const clampedY = Math.max(minY, Math.min(maxY, targetY));

    const distX = clampedX - currentPosX;
    const distY = clampedY - currentPosY;
    const distance = Math.hypot(distX, distY);

    if (distance < 20) {
      if (callback) callback();
      return;
    }

    const walkDuration = Math.max(1.2, distance / 70);
    const facing = (clampedX < currentPosX) ? 'scaleX(1)' : 'scaleX(-1)';
    if (catFlipper) catFlipper.style.transform = facing;

    isMoving = true;
    catEl.style.transition = `left ${walkDuration}s linear, top ${walkDuration}s linear`;
    catEl.style.left = `${clampedX}px`;
    catEl.style.top = `${clampedY}px`;

    currentPosX = clampedX;
    currentPosY = clampedY;

    setTimeout(() => {
      isMoving = false;
      saveCatState(currentPosX, currentPosY, facing);
      if (callback) callback();
    }, walkDuration * 1000);
  };

  window.jumpCatTo = function(targetX, targetY) {
    if (!catEl || isMoving) return;

    const clampedX = Math.max(minX, Math.min(maxX, targetX));
    const clampedY = Math.max(minY, Math.min(maxY, targetY));

    const distX = clampedX - currentPosX;
    const distY = clampedY - currentPosY;
    const distance = Math.hypot(distX, distY);

    if (distance < 25) return;

    const jumpDur = Math.min(1.4, Math.max(0.9, distance / 220));
    const facing = (clampedX < currentPosX) ? 'scaleX(1)' : 'scaleX(-1)';

    if (catFlipper) catFlipper.style.transform = facing;

    isMoving = true;
    catJumpWrapper.style.setProperty('--jump-dur', `${jumpDur}s`);
    catShadow.style.setProperty('--jump-dur', `${jumpDur}s`);

    catJumpWrapper.classList.remove('cat-leaping');
    catShadow.classList.remove('shadow-leaping');
    void catJumpWrapper.offsetWidth;
    catJumpWrapper.classList.add('cat-leaping');
    catShadow.classList.add('shadow-leaping');

    catEl.style.transition = `left ${jumpDur}s cubic-bezier(0.35, 0, 0.25, 1), top ${jumpDur}s cubic-bezier(0.35, 0, 0.25, 1)`;
    catEl.style.left = `${clampedX}px`;
    catEl.style.top = `${clampedY}px`;

    currentPosX = clampedX;
    currentPosY = clampedY;

    setTimeout(() => {
      isMoving = false;
      saveCatState(currentPosX, currentPosY, facing);
      catJumpWrapper.classList.remove('cat-leaping');
      catShadow.classList.remove('shadow-leaping');
    }, jumpDur * 1000);
  };

  document.addEventListener('click', (e) => {
    const ignoreTags = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA', 'NAV'];
    if (ignoreTags.includes(e.target.tagName)) return;
    if (e.target.closest('button, a, nav, #catChatModal, #aiCatMascotContainer, [onclick]')) return;

    showCatBubble('เหมียว! กำลังเดินไปหา 🐾', 2000);
    walkCatTo(e.clientX - 45, e.clientY - 45);
  });

  function scheduleNextCatAction() {
    const randomDelay = Math.floor(Math.random() * (60000 - 30000 + 1)) + 30000;

    setTimeout(() => {
      const modal = document.getElementById('catChatModal');
      if (!modal || modal.classList.contains('hidden')) {
        const actionType = Math.random();
        if (actionType < 0.6) {
          const targetX = (currentPosX > window.innerWidth / 2) ? 25 : (window.innerWidth - 110);
          const targetY = window.innerHeight - 185;
          walkCatTo(targetX, targetY);
        } else {
          const randomX = Math.random() * (window.innerWidth - 130) + 15;
          const randomY = Math.random() * (window.innerHeight - 270) + 90;
          showCatBubble('ฮึบ! กระโดดแล้วน้า 💨', 2000);
          jumpCatTo(randomX, randomY);
        }
      }
      scheduleNextCatAction();
    }, randomDelay);
  }

  scheduleNextCatAction();

  window.addEventListener('resize', () => {
    if (!isMoving) {
      catEl.style.transition = 'none';
      catEl.style.left = `${Math.min(currentPosX, window.innerWidth - 110)}px`;
      catEl.style.top = `${Math.min(currentPosY, window.innerHeight - 180)}px`;
    }
  });
}

function onCatClicked(event) {
  event.stopPropagation();
  toggleCatChat();
}

function showCatBubble(text, duration = 3000) {
  const bubble = document.getElementById('catSpeechBubble');
  if (!bubble) return;
  bubble.innerText = `"${text}"`;
  bubble.classList.remove('hidden');
  setTimeout(() => bubble.classList.add('hidden'), duration);
}

function toggleCatChat() {
  const modal = document.getElementById('catChatModal');
  if (modal) {
    modal.classList.toggle('hidden');
    document.getElementById('catSpeechBubble')?.classList.add('hidden');
  }
}

// ฟังก์ชันดึง Gemini API Key จากตาราง system_configs บน Supabase
async function getGeminiApiKey() {
  try {
    if (window.supabase) {
      const { data, error } = await supabase
        .from('system_configs')
        .select('value')
        .eq('key', 'gemini_api_key')
        .maybeSingle();

      if (!error && data && data.value) {
        return data.value.trim();
      }
    }
  } catch (e) {
    console.warn("ไม่สามารถดึง API Key จาก Supabase ได้:", e);
  }
  return null;
}

// ฟังก์ชันเรียก Gemini API ตอบคำถามติวสอบ
async function askCatAiTutor(promptText) {
  // ดึงคีย์จากระบบฐานข้อมูล Supabase อัตโนมัติ
  const apiKey = await getGeminiApiKey();

  if (!apiKey) {
    return "เมี๊ยว! ยังไม่พบการตั้งค่า Gemini API Key ในตาราง system_configs บน Supabase เลยน้า 🐾";
  }

  // ใช้โมเดล gemini-2.5-flash-lite เพื่อความเร็วสูงสุด
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [
      {
        parts: [{ text: promptText }]
      }
    ],
    systemInstruction: {
      parts: [{
        text: "คุณคือน้องเหมียว ติวเตอร์ AI ผู้ช่วยเตรียมสอบบรรจุครูผู้ช่วย สพฐ. (ภาค ก และ ภาค ข) มีนิสัยใจดี น่ารัก ฉลาด หน้าที่ของคุณคือให้คำแนะนำ เทคนิคทำข้อสอบ หรืออธิบายเนื้อหาวิชาการสั้นๆ กฎเหล็ก: ตอบสั้นกระชับ 2-3 ประโยค ตรงประเด็น ใช้คำเข้าใจง่าย และลงท้ายอย่างสดใส เช่น เมี๊ยว, น้า, สู้ๆ นะคะคุณครู"
      }]
    },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 300
    }
  };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.error) {
      console.error("❌ Google Gemini API Error:", data.error);
      return `เมี๊ยว... API แจ้งเตือน: ${data.error.message || 'เกิดข้อผิดพลาด'} 😿`;
    }

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text.trim();
    }

    return "เมี๊ยว... สัญญาณคลื่นสมองแมวติดขัดนิดหน่อย ลองถามใหม่อีกทีนะคะ 🐱";
  } catch (err) {
    console.error("❌ Fetch Error:", err);
    return "เมี๊ยว! เชื่อมต่ออินเทอร์เน็ตไม่สำเร็จ ลองใหม่อีกทีน้า 😿";
  }
}

// ส่งข้อความคุยกับน้องแมว AI พร้อมแอนิเมชันตอนกำลังคิด
async function sendCatMessage() {
  const input = document.getElementById('catChatInput');
  const msgContainer = document.getElementById('catChatMessages');
  if (!input || !input.value.trim()) return;

  const userText = input.value.trim();
  input.value = '';

  // 1. แสดงกล่องข้อความของผู้ใช้
  msgContainer.innerHTML += `
    <div class="flex items-end justify-end gap-2">
      <div class="bg-[var(--color-primary,#755634)] text-white p-3 rounded-2xl rounded-tr-xs shadow-2xs font-medium max-w-[80%] leading-relaxed text-xs">
        ${userText}
      </div>
    </div>
  `;
  msgContainer.scrollTop = msgContainer.scrollHeight;

  // 2. แสดงสถานะ "น้องเหมียวกำลังคิด... 🐾"
  const loadingId = 'cat-loading-' + Date.now();
  msgContainer.innerHTML += `
    <div id="${loadingId}" class="flex items-start gap-2">
      <span class="text-base">🐱</span>
      <div class="bg-white p-3 rounded-2xl rounded-tl-xs shadow-2xs text-slate-400 font-medium leading-relaxed max-w-[80%] text-xs flex items-center gap-1.5 border border-slate-100">
        <span class="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
        <span>เหมียวกำลังคิดคำตอบให้คุณครูน้า...</span>
      </div>
    </div>
  `;
  msgContainer.scrollTop = msgContainer.scrollHeight;

  // 3. ยิงไปถาม AI แล้วนำคำตอบมาแทนที่กล่องสถานะ
  const reply = await askCatAiTutor(userText);
  const loadingEl = document.getElementById(loadingId);
  if (loadingEl) {
    loadingEl.innerHTML = `
      <span class="text-base">🐱</span>
      <div class="bg-white p-3 rounded-2xl rounded-tl-xs shadow-2xs text-slate-700 font-medium leading-relaxed max-w-[80%] text-xs border border-slate-100">
        ${reply}
      </div>
    `;
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }
}

setInterval(() => {
  const bubble = document.getElementById('catSpeechBubble');
  const modal = document.getElementById('catChatModal');
  if (bubble && modal && modal.classList.contains('hidden')) {
    const messages = ['คลิกเหมียวได้นะ! 🐾', 'สู้ๆ เพื่อตั๋วครูค่ะ! ✨', 'แตะที่ว่างเรียกเหมียวเดินไปหาได้น้า 🏃', 'พักดื่มน้ำก่อนได้น้า 🍵'];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    showCatBubble(randomMsg, 3500);
  }
}, 35000);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAiMascot);
} else {
  initAiMascot();
}