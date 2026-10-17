// =========================================================
// theme-manager.js (ฉบับแก้บั๊ก: หันหน้าตรงตลอดเวลา ไม่ค้าง ไม่เดินถอยหลัง)
// =========================================================

// ---------------------------------------------------------
// 1. ระบบจัดการธีม, ฟอนต์ และขนาดตัวอักษรทั้งระบบ
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

  if (!document.getElementById('global-theme-style')) {
    const style = document.createElement('style');
    style.id = 'global-theme-style';
    style.innerHTML = `
      body, button, input, select, textarea { font-family: 'Sarabun', sans-serif !important; }
      h1, h2, h3, h4, h5, h6, .font-heading, .font-display, .font-prompt { font-family: 'Prompt', sans-serif !important; }
      body { background-color: #fff8f6 !important; color: #1e1b1a !important; }

      /* แอนิเมชันกระโดดโค้งกลางอากาศ (Squash & Stretch Arc) */
      @keyframes catPhysicsJump {
        0% { transform: translateY(0) scale(1, 1); }
        15% { transform: translateY(8px) scale(1.2, 0.75); }
        45% { transform: translateY(-65px) scale(0.9, 1.2); }
        85% { transform: translateY(5px) scale(1.18, 0.78); }
        100% { transform: translateY(0) scale(1, 1); }
      }

      /* เงาใต้ฝ่าเท้าหด-ขยายตามความสูง */
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
  });

  // สร้างแถบเมนูด้านล่าง (Bottom Nav) อัตโนมัติ (ยกเว้น login, admin, quiz)
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
// 3. 🐾 น้องแมว 3D AI ผู้ช่วยติวข้อสอบ (หันหน้าตรงตลอดเวลา ไม่ค้าง ไม่เดินถอยหลัง)
// ---------------------------------------------------------
function initAiMascot() {
  const path = window.location.pathname.toLowerCase();
  // ยกเว้นไม่ให้แมวปรากฏในหน้า quiz.html, login.html และ admin.html
  if (path.includes('quiz.html') || path.includes('login.html') || path.endsWith('admin.html')) return;

  if (document.getElementById('aiCatMascotContainer')) return;
  if (!document.body) return;

  if (!document.querySelector('script[src*="model-viewer"]')) {
    const mvScript = document.createElement('script');
    mvScript.type = 'module';
    mvScript.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
    document.head.appendChild(mvScript);
  }

  const mascotHTML = `
    <!-- กล่องพิกัดน้องแมว -->
    <div id="aiCatMascotContainer" 
         class="fixed z-40 select-none pointer-events-none"
         style="left: calc(100vw - 110px); top: calc(100vh - 185px); width: 95px; height: 95px;">
      
      <!-- บอลลูนคำพูดลอยเหนือหัว -->
      <div id="catSpeechBubble" 
           class="hidden absolute -top-10 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-xl border border-amber-200 text-[11px] font-extrabold text-slate-700 whitespace-nowrap z-50">
        "สู้ๆ นะคะคุณครู! 🐾"
      </div>

      <!-- เงาใต้ฝ่าเท้า -->
      <div id="catGroundShadow" 
           class="absolute bottom-1 left-1/2 -translate-x-1/2 w-14 h-3 rounded-full bg-amber-950/20 blur-[1px]"></div>

      <!-- กล่องฟิสิกส์กระโดด -->
      <div id="catJumpPhysicsWrapper" class="relative w-full h-full pointer-events-auto">
        <!-- กล่องกลับด้านซ้าย-ขวา (Flipper) -->
        <div id="catFlipper" onclick="onCatClicked(event)" class="relative w-full h-full cursor-pointer transition-transform duration-300">
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

    <!-- หน้าต่างแชต AI ติวเตอร์ -->
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

  // ระบบจัดการพิกัดและการเคลื่อนที่
  const catEl = document.getElementById('aiCatMascotContainer');
  const catJumpWrapper = document.getElementById('catJumpPhysicsWrapper');
  const catShadow = document.getElementById('catGroundShadow');
  const catFlipper = document.getElementById('catFlipper');
  const catViewer = document.getElementById('catModelViewer');

  let currentPosX = window.innerWidth - 110;
  let currentPosY = window.innerHeight - 185;
  let isMoving = false;

  // 1. ฟังก์ชันก้าวเดินจริงข้ามจอ (หันหน้าตามทิศทางที่ถูกต้อง ไม่เดินถอยหลัง)
  window.walkCatTo = function(targetX, targetY, callback) {
    if (!catEl || isMoving) return;

    const minX = 15;
    const maxX = window.innerWidth - 110;
    const minY = 80;
    const maxY = window.innerHeight - 180;

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

    // แก้ไขบั๊กทิศทาง: โมเดลหน้าเดิมหันไปทางซ้าย
    // ถ้าเดินไปทางซ้าย (clampedX < currentPosX) ให้ใช้ scaleX(1)
    // ถ้าเดินไปทางขวา (clampedX > currentPosX) ให้กลับด้าน scaleX(-1) เพื่อหันไปทางขวา
    if (catFlipper) {
      catFlipper.style.transform = (clampedX < currentPosX) ? 'scaleX(1)' : 'scaleX(-1)';
    }

    isMoving = true;

    catEl.style.transition = `left ${walkDuration}s linear, top ${walkDuration}s linear`;
    catEl.style.left = `${clampedX}px`;
    catEl.style.top = `${clampedY}px`;

    currentPosX = clampedX;
    currentPosY = clampedY;

    // รีเซ็ตสถานะเมื่อเดินถึงที่หมาย (และมี Watchdog ป้องกันค้าง)
    setTimeout(() => {
      isMoving = false;
      if (callback) callback();
    }, walkDuration * 1000);
  };

  // 2. ฟังก์ชันกระโดดโค้งข้ามจอ
  window.jumpCatTo = function(targetX, targetY) {
    if (!catEl || isMoving) return;

    const minX = 15;
    const maxX = window.innerWidth - 110;
    const minY = 80;
    const maxY = window.innerHeight - 180;

    const clampedX = Math.max(minX, Math.min(maxX, targetX));
    const clampedY = Math.max(minY, Math.min(maxY, targetY));

    const distX = clampedX - currentPosX;
    const distY = clampedY - currentPosY;
    const distance = Math.hypot(distX, distY);

    if (distance < 25) return;

    const jumpDur = Math.min(1.4, Math.max(0.9, distance / 220));

    if (catFlipper) {
      catFlipper.style.transform = (clampedX < currentPosX) ? 'scaleX(1)' : 'scaleX(-1)';
    }

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
      catJumpWrapper.classList.remove('cat-leaping');
      catShadow.classList.remove('shadow-leaping');
    }, jumpDur * 1000);
  };

  // แตะที่ว่างบนหน้าจอ -> เดินมาหาทันที
  document.addEventListener('click', (e) => {
    const ignoreTags = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA', 'NAV'];
    if (ignoreTags.includes(e.target.tagName)) return;
    if (e.target.closest('button, a, nav, #catChatModal, #aiCatMascotContainer, [onclick]')) return;

    showCatBubble('เหมียว! กำลังเดินไปหา 🐾', 2000);
    walkCatTo(e.clientX - 45, e.clientY - 45);
  });

  // สุ่มเดิน / กระโดดทุกๆ 30–60 วินาที
  function scheduleNextCatAction() {
    const randomDelay = Math.floor(Math.random() * (60000 - 30000 + 1)) + 30000;

    setTimeout(() => {
      const modal = document.getElementById('catChatModal');
      if (!modal || modal.classList.contains('hidden')) {
        const actionType = Math.random();

        if (actionType < 0.6) {
          // เดินลาดตระเวนแนวนอน
          const targetX = (currentPosX > window.innerWidth / 2) ? 25 : (window.innerWidth - 110);
          const targetY = window.innerHeight - 185;
          walkCatTo(targetX, targetY);
        } else {
          // กระโดดเปลี่ยนมุม
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

// สุ่มคำพูดทักทายทุก 35 วินาที
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