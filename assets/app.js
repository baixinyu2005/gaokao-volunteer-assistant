/* ============================================================
   志愿星图 · 高考志愿智能填报
   纯前端、离线运行。数据与推荐逻辑均为本地文件。
   ============================================================ */
(function () {
  'use strict';

  const DATA = window.GK_DATA;
  const ENGINE = window.GKEngine;
  const app = document.getElementById('app');

  if (!DATA || !ENGINE) {
    app.innerHTML = '<div class="empty-state" style="min-height:100vh"><h3>数据加载失败</h3><p>请确认 assets/data.js 与 assets/engine.js 已完整复制。</p></div>';
    return;
  }

  /* ---------------- Icons ---------------- */
  const ICONS = {
    home: '<path d="m3 10.5 9-7.5 9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H15v-7H9v7H4.5A1.5 1.5 0 0 1 3 20v-9.5Z"/>',
    spark: '<path d="M12 3.5 14 9l5.5 2L14 13l-2 5.5L10 13l-5.5-2L10 9l2-5.5Z"/><path d="M18.5 16.5 19.3 19l2.5.8-2.5.8-.8 2.5-.8-2.5-2.5-.8 2.5-.8.8-2.5Z"/>',
    school: '<path d="m2.8 9.2 9.2-5 9.2 5-9.2 5-9.2-5Z"/><path d="M6.7 11.3v4.9c3.1 2 7.5 2 10.6 0v-4.9"/><path d="M21.2 9.2v6.2"/>',
    heart: '<path d="M20.7 4.8a5.4 5.4 0 0 0-7.6 0L12 5.9l-1.1-1.1a5.4 5.4 0 1 0-7.6 7.6L12 21l8.7-8.6a5.4 5.4 0 0 0 0-7.6Z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    arrowRight: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    arrowLeft: '<path d="M19 12H5"/><path d="m11 18-6-6 6-6"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    chevronLeft: '<path d="m15 18-6-6 6-6"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c.8-4 3.4-6 8-6s7.2 2 8 6"/>',
    pin: '<path d="M20 10c0 5.2-8 11-8 11S4 15.2 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.6"/>',
    trendUp: '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    trendDown: '<path d="m3 7 6 6 4-4 8 8"/><path d="M15 17h6v-6"/>',
    print: '<path d="M6 9V3h12v6"/><path d="M6 18H4a1 1 0 0 1-1-1v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1h-2"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    check: '<path d="m4.5 12.5 5 5L20 6.5"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>',
    chart: '<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M22 20H2"/>',
    database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
    shield: '<path d="M12 3 4.5 6v5.5c0 4.8 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.7 7.5-9.5V6L12 3Z"/><path d="m8.5 12 2.4 2.4 4.8-5"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z"/><path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    sliders: '<path d="M4 7h10"/><path d="M18 7h2"/><circle cx="16" cy="7" r="2"/><path d="M4 17h2"/><path d="M10 17h10"/><circle cx="8" cy="17" r="2"/>',
    filter: '<path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6"/><path d="M12 17h.01"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.7-4L3 10"/><path d="M3 4v6h6"/><path d="M4 13a8 8 0 0 0 14.7 4L21 14"/><path d="M21 20v-6h-6"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m16 8-2.2 5.8L8 16l2.2-5.8L16 8Z"/>',
    flag: '<path d="M5 21V4"/><path d="M5 4c4-2 8 2 14 0v9c-6 2-10-2-14 0"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 16 9 5 9-5"/>',
    moon: '<path d="M20 15.5A8.5 8.5 0 0 1 8.5 4a8.5 8.5 0 1 0 11.5 11.5Z"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    external: '<path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'
  };

  function icon(name, cls) {
    return '<svg class="icon ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || ICONS.info) + '</svg>';
  }

  function logoMark() {
    return '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 4.8 29.5 18.5 43.2 24 29.5 29.5 24 43.2 18.5 29.5 4.8 24 18.5 18.5 24 4.8Z" fill="currentColor"/><circle cx="24" cy="24" r="3.4" fill="#0b1a34" opacity=".68"/></svg>';
  }

  /* ---------------- Helpers ---------------- */
  const ROUTES = {
    home: { title: '首页', sub: '志愿规划总览', icon: 'home' },
    recommend: { title: '智能填报', sub: '生成你的 96 个专业志愿梯度', icon: 'spark' },
    schools: { title: '院校库', sub: '按省份、层次与类型查询历年分数', icon: 'school' },
    favorites: { title: '我的收藏', sub: '把心仪院校放在一起比较', icon: 'heart' },
    about: { title: '关于系统', sub: '数据说明与推荐逻辑', icon: 'info' }
  };
  const ROUTE_KEYS = Object.keys(ROUTES);
  const AVATAR_CLASSES = ['', 'teal', 'orange'];
  const FEATURED_NAMES = ['浙江大学', '武汉大学', '四川大学', '厦门大学', '哈尔滨工业大学', '西安交通大学'];
  const ENTRY_SCHOOLS = ['清华大学', '北京大学', '浙江大学', '复旦大学', '上海交通大学', '南京大学', '武汉大学', '四川大学', '中山大学', '华中科技大学', '西安交通大学', '哈尔滨工业大学'];
  const ENTRY_SPOTS = [
    { x: 55, y: 14, r: -4, dur: 18, delay: -2, depth: 12 },
    { x: 68, y: 11, r: 3, dur: 22, delay: -7, depth: 18 },
    { x: 82, y: 22, r: -5, dur: 19, delay: -4, depth: 10 },
    { x: 59, y: 36, r: 5, dur: 21, delay: -9, depth: 20 },
    { x: 73, y: 29, r: -3, dur: 17, delay: -3, depth: 14 },
    { x: 87, y: 40, r: 6, dur: 23, delay: -10, depth: 22 },
    { x: 55, y: 61, r: -4, dur: 20, delay: -6, depth: 9 },
    { x: 69, y: 67, r: 4, dur: 18, delay: -1, depth: 16 },
    { x: 84, y: 64, r: -6, dur: 24, delay: -8, depth: 12 },
    { x: 92, y: 82, r: 3, dur: 21, delay: -5, depth: 8 },
    { x: 61, y: 86, r: -2, dur: 19, delay: -11, depth: 7 },
    { x: 76, y: 86, r: 5, dur: 22, delay: -12, depth: 10 }
  ];

  const state = {
    user: null,
    route: 'home',
    profile: loadProfile(),
    recommend: null,
    recFilter: { tier: 'all', q: '' },
    library: { q: '', province: 'all', level: 'all', type: 'all', sort: 'score', page: 1, pageSize: 12 },
    detail: null,
    favorites: loadFavorites(),
    loginId: '',
    loginError: '',
    loginBusy: false,
    loginPrompt: '',
    entry: true,
    entryMode: 'choice',
    entryError: '',
    entryBusy: false,
    entryAccount: ''
  };

  let toastEl = null;
  let toastTimer = null;
  let recSearchTimer = null;
  let libSearchTimer = null;
  let profileSaveTimer = null;
  let hashBound = false;

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
  }

  function formatNumber(value) {
    if (value == null || value === '' || Number.isNaN(Number(value))) return '—';
    return Number(value).toLocaleString('zh-CN');
  }

  function formatWan(value) {
    if (value == null || value === '' || Number.isNaN(Number(value)) || Number(value) <= 0) return '—';
    const n = Number(value);
    return n >= 10000 ? (n / 10000).toFixed(1) + '万' : formatNumber(n);
  }

  function clamp(n, min, max) { return Math.min(max, Math.max(min, n)); }

  function currentProvince() {
    return ENGINE.getProvince(DATA, state.profile.provinceId);
  }

  function currentTrack() {
    const province = currentProvince();
    const track = ENGINE.getTrack(province, state.profile.trackId);
    if (state.profile.trackId !== track.id) state.profile.trackId = track.id;
    return track;
  }

  function ensureProfileTrack() {
    const province = currentProvince();
    const track = ENGINE.getTrack(province, state.profile.trackId);
    state.profile.provinceId = province.id;
    state.profile.trackId = track.id;
  }

  function currentScore() {
    const n = Number(state.profile.score);
    return Number.isFinite(n) && state.profile.score !== '' ? n : null;
  }

  function findSchool(id) {
    return DATA.schools.find((school) => school.id === Number(id));
  }

  function getSchoolRows(school, provinceId, trackId) {
    return ENGINE.getRows(DATA, school.id, provinceId, trackId);
  }

  function avatarClass(account) {
    const index = DATA.accounts.findIndex((item) => item.id === account.id);
    return AVATAR_CLASSES[Math.max(0, index) % AVATAR_CLASSES.length];
  }

  function levelClass(level) {
    if (level === '985') return 'tag-985';
    if (level === '211') return 'tag-211';
    if (level === 'SYL') return 'tag-syl';
    if (level === 'PVT') return 'tag-private';
    return 'tag-regular';
  }

  function tagsHtml(school, limit) {
    const tags = school.tags && school.tags.length ? school.tags : [school.levelName];
    return tags.slice(0, limit || 3).map((tag) => {
      let cls = 'tag-ghost';
      if (tag === '985') cls = 'tag-985';
      else if (tag === '211') cls = 'tag-211';
      else if (tag === '双一流') cls = 'tag-syl';
      else if (tag === '民办本科') cls = 'tag-private';
      return '<span class="tag ' + cls + '">' + escapeHtml(tag) + '</span>';
    }).join('');
  }

  function locationText(school) {
    return school.province === school.city ? school.province : school.province + ' · ' + school.city;
  }

  function trendDelta(rows) {
    if (!rows || rows.length < 2) return 0;
    return rows[0].min - rows[rows.length - 1].min;
  }

  function trendHtml(rows) {
    const delta = trendDelta(rows);
    if (!delta) return '';
    const cls = delta > 0 ? 'up' : 'down';
    return '<span class="trend ' + cls + '" title="最新一年最低分较最早一年变化">' +
      icon(delta > 0 ? 'trendUp' : 'trendDown') + (delta > 0 ? '+' : '') + delta + '</span>';
  }

  function sparkline(rows, color) {
    if (!rows || rows.length < 2) return '';
    const values = rows.slice().reverse().map((row) => row.min);
    const w = 70, h = 26, pad = 3;
    const min = Math.min.apply(null, values);
    const max = Math.max.apply(null, values);
    const range = max - min || 1;
    const points = values.map((value, index) => {
      const x = pad + index * (w - pad * 2) / Math.max(1, values.length - 1);
      const y = h - pad - ((value - min) / range) * (h - pad * 2);
      return [x, y];
    });
    const line = points.map((point, index) => (index ? 'L' : 'M') + point[0].toFixed(1) + ' ' + point[1].toFixed(1)).join(' ');
    const area = line + ' L' + points[points.length - 1][0].toFixed(1) + ' ' + (h - 1) + ' L' + points[0][0].toFixed(1) + ' ' + (h - 1) + ' Z';
    const last = points[points.length - 1];
    return '<svg class="spark" viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true">' +
      '<path class="spark-area" d="' + area + '" fill="' + color + '"></path>' +
      '<path class="spark-line" d="' + line + '" stroke="' + color + '"></path>' +
      '<circle cx="' + last[0].toFixed(1) + '" cy="' + last[1].toFixed(1) + '" r="2.2" fill="' + color + '"></circle>' +
      '</svg>';
  }

  function selectOptions(items, selected, valueKey, labelKey) {
    return items.map((item) => {
      const value = item[valueKey];
      return '<option value="' + escapeHtml(value) + '"' + (String(value) === String(selected) ? ' selected' : '') + '>' + escapeHtml(item[labelKey]) + '</option>';
    }).join('');
  }

  function provinceOptions(selected) {
    return DATA.provinces.map((province) =>
      '<option value="' + province.id + '"' + (province.id === selected ? ' selected' : '') + '>' + escapeHtml(province.name) + '</option>'
    ).join('');
  }

  function trackOptions(province, selected) {
    return province.tracks.map((track) =>
      '<option value="' + track.id + '"' + (track.id === selected ? ' selected' : '') + '>' + escapeHtml(track.name) + '</option>'
    ).join('');
  }

  function provinceById(id) {
    return DATA.provinces.find((province) => province.id === id) || DATA.provinces[0];
  }

  function dateText() {
    try {
      return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' }).format(new Date());
    } catch (err) {
      return '';
    }
  }

  function loadProfile() {
    const fallback = { provinceId: 'henan', trackId: 'physics', score: '' };
    try {
      const saved = JSON.parse(localStorage.getItem('gkzy.profile') || 'null');
      if (!saved || !saved.provinceId) return fallback;
      const province = DATA.provinces.find((item) => item.id === saved.provinceId);
      if (!province) return fallback;
      const track = province.tracks.find((item) => item.id === saved.trackId) || province.tracks[0];
      return { provinceId: province.id, trackId: track.id, score: saved.score == null ? '' : String(saved.score) };
    } catch (err) {
      return fallback;
    }
  }

  function saveProfile() {
    try { localStorage.setItem('gkzy.profile', JSON.stringify(state.profile)); } catch (err) { /* ignore */ }
  }

  function saveProfileSoon() {
    clearTimeout(profileSaveTimer);
    profileSaveTimer = setTimeout(saveProfile, 220);
  }

  function loadFavorites() {
    try {
      const saved = JSON.parse(localStorage.getItem('gkzy.favorites') || '[]');
      return new Set(Array.isArray(saved) ? saved.map(Number) : []);
    } catch (err) {
      return new Set();
    }
  }

  function saveFavorites() {
    try { localStorage.setItem('gkzy.favorites', JSON.stringify(Array.from(state.favorites))); } catch (err) { /* ignore */ }
  }

  function ensureToast() {
    if (toastEl) return;
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    toastEl.setAttribute('role', 'status');
    toastEl.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastEl);
  }

  function showToast(message) {
    ensureToast();
    toastEl.innerHTML = icon('check') + '<span>' + escapeHtml(message) + '</span>';
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2400);
  }

  function sha256Hex(text) {
    const bytes = new TextEncoder().encode(text);
    return crypto.subtle.digest('SHA-256', bytes).then((buffer) =>
      Array.from(new Uint8Array(buffer)).map((byte) => byte.toString(16).padStart(2, '0')).join('')
    );
  }

  /* ---------------- Login ---------------- */
  function renderLoginModal() {
    if (state.user) return;
    const root = document.getElementById('login-root');
    if (!root) return;
    let remembered = state.loginId || '';
    if (!remembered) {
      try { remembered = localStorage.getItem('gkzy.lastId') || ''; } catch (err) { remembered = ''; }
    }
    const checked = remembered ? ' checked' : '';
    const counts = DATA.meta;
    const prompt = state.loginPrompt || '';
    root.innerHTML = '<div class="login-overlay" data-action="close-login">' +
      '<div class="login-modal" role="dialog" aria-modal="true" aria-labelledby="login-modal-title">' +
        '<button type="button" class="login-modal-close" data-action="close-login" aria-label="关闭登录">' + icon('close') + '</button>' +
        '<section class="login-modal-visual">' +
          '<div class="brand">' +
            '<div class="brand-mark">' + logoMark() + '</div>' +
            '<div class="brand-text"><div class="brand-name">志愿星图</div><div class="brand-sub">GAOKAO COMPASS</div></div>' +
          '</div>' +
          '<div class="login-visual-copy">' +
            '<div class="visual-eyebrow">MEMBER ACCESS</div>' +
            '<h2>登录，解锁<br><em>完整数据权限</em></h2>' +
            '<p>游客也能直接生成 96 个专业志愿。登录后，把专业看到底、把方案留下来。</p>' +
          '</div>' +
          '<div class="login-benefits">' +
            '<div class="login-benefit"><span class="lb-num">01</span><div><strong>全部分专业明细</strong><p>游客仅展示前 6 个专业，登录后查看全部专业组与分数。</p></div></div>' +
            '<div class="login-benefit"><span class="lb-num">02</span><div><strong>收藏与打印</strong><p>收藏院校、打印方案或保存 PDF，方便对比和留档。</p></div></div>' +
            '<div class="login-benefit"><span class="lb-num">03</span><div><strong>管理员身份标识</strong><p>顶部显示管理员身份，权限状态一目了然。</p></div></div>' +
          '</div>' +
          '<div class="login-visual-foot">本机离线 · 无需上传 · 账号和数据只在这台电脑</div>' +
        '</section>' +
        '<section class="login-modal-panel">' +
          '<div class="login-eyebrow">ACCOUNT ACCESS</div>' +
          '<h2 id="login-modal-title">管理员登录</h2>' +
          '<p class="login-lead">使用六位账号登录，初始密码为账号后四位。游客可直接关闭此窗口继续体验。</p>' +
          (prompt ? '<div class="login-reason">' + icon('spark') + '<span>' + escapeHtml(prompt) + '</span></div>' : '') +
          '<form class="login-form" data-form="login" novalidate>' +
            '<div class="field">' +
              '<label for="login-id">账号</label>' +
              '<input class="input" id="login-id" name="id" type="text" inputmode="numeric" autocomplete="username" maxlength="6" placeholder="请输入六位账号" value="' + escapeHtml(remembered) + '" required>' +
            '</div>' +
            '<div class="field">' +
              '<label for="login-password">密码</label>' +
              '<input class="input" id="login-password" name="password" type="password" inputmode="numeric" autocomplete="current-password" maxlength="4" placeholder="请输入四位密码" required>' +
            '</div>' +
            '<div class="login-error' + (state.loginError ? ' show' : '') + '" role="alert">' + icon('alert') + '<span>' + escapeHtml(state.loginError || '') + '</span></div>' +
            '<div class="login-options">' +
              '<label class="checkbox"><input type="checkbox" name="remember"' + checked + '>记住账号</label>' +
              '<button type="button" class="login-help" data-action="login-help">忘记密码？</button>' +
            '</div>' +
            '<button class="btn btn-primary login-submit' + (state.loginBusy ? ' loading' : '') + '" type="submit"' + (state.loginBusy ? ' disabled' : '') + '>' +
              '<span class="spinner" aria-hidden="true"></span><span class="btn-label">登录并解锁</span>' + icon('arrowRight') +
            '</button>' +
          '</form>' +
          '<button type="button" class="login-skip" data-action="close-login">暂不登录，继续游客体验</button>' +
          '<div class="login-meta">' + icon('shield') + '<span>课程作业演示系统 · 账号在本机校验<br>当前共 ' + counts.schoolCount + ' 所院校 · ' + formatNumber(counts.majorCount) + ' 条分专业记录</span></div>' +
        '</section>' +
      '</div>' +
    '</div>';
    document.body.classList.add('login-open');
    setTimeout(() => {
      const target = remembered ? document.getElementById('login-password') : document.getElementById('login-id');
      if (target) target.focus();
    }, 120);
  }

  function openLogin(prompt) {
    if (state.user) {
      showToast('当前已是登录状态');
      return;
    }
    state.loginPrompt = prompt || '';
    state.loginError = '';
    state.loginBusy = false;
    renderLoginModal();
  }

  function closeLogin() {
    const root = document.getElementById('login-root');
    if (root) root.innerHTML = '';
    document.body.classList.remove('login-open');
    state.loginPrompt = '';
    state.loginError = '';
    state.loginBusy = false;
  }

  /* ---------------- Entry / Welcome ---------------- */
  function entrySchoolCards() {
    return ENTRY_SPOTS.map((spot, index) => {
      const school = DATA.schools.find((item) => item.name === ENTRY_SCHOOLS[index]);
      if (!school) return '';
      const tags = [school.level].concat(school.tags || []).filter((tag, i, all) => tag && all.indexOf(tag) === i).slice(0, 3);
      return '<div class="school-float' + (index % 4 === 0 ? ' is-soft' : '') + '" data-depth="' + spot.depth + '" style="left:' + spot.x + '%;top:' + spot.y + '%;--rot:' + spot.r + 'deg;--dur:' + spot.dur + 's;--delay:' + spot.delay + 's" aria-hidden="true">' +
        '<div class="school-float-inner">' +
          '<div class="fc-top"><span class="fc-logo">' + escapeHtml(school.name.slice(0, 1)) + '</span><span class="fc-level">' + escapeHtml(school.level || '本科') + '</span></div>' +
          '<strong>' + escapeHtml(school.name) + '</strong>' +
          '<div class="fc-meta">' + escapeHtml(school.province || '') + ' · ' + escapeHtml(school.type || '综合') + '</div>' +
          '<div class="fc-tags">' + tags.map((tag) => '<span>' + escapeHtml(tag) + '</span>').join('') + '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function entrySchoolWall() {
    const rank = (school) => {
      if (school.level === '985') return 0;
      if (school.level === '211') return 1;
      if ((school.tags || []).includes('双一流')) return 2;
      if (school.nature === '民办') return 4;
      return 3;
    };
    const sorted = DATA.schools.slice().sort((a, b) => rank(a) - rank(b) || (b.strength || 0) - (a.strength || 0) || a.id - b.id);
    const rows = Array.from({ length: 8 }, () => []);
    sorted.forEach((school, index) => rows[index % 8].push(school));
    const card = (school) => {
      const level = school.level === '普通本科' ? '本科' : (school.level === '民办本科' ? '民办' : (school.level || '本科'));
      return '<div class="wall-card">' +
        '<div class="wc-top"><span class="wc-badge">' + escapeHtml(level) + '</span><span class="wc-city">' + escapeHtml(school.city || school.province || '') + '</span></div>' +
        '<strong>' + escapeHtml(school.name) + '</strong>' +
        '<span class="wc-type">' + escapeHtml(school.type || '综合') + ' · ' + escapeHtml(school.nature || '公办') + '</span>' +
      '</div>';
    };
    return '<section class="entry-schools" id="entry-schools">' +
      '<div class="schools-head"><div><div class="entry-kicker">ALL ' + formatNumber(DATA.schools.length) + ' SCHOOLS</div><h2>每一所，都在这里。</h2><p>31 个省份、' + formatNumber(DATA.schools.length) + ' 所本科院校，按层次排成 8 条星轨持续滚动。鼠标悬停可暂停，慢慢看。</p></div><div class="schools-head-side"><span class="schools-count">' + formatNumber(DATA.schools.length) + ' 所</span><span class="schools-note">按 985 / 211 / 双一流 / 公办本科排序</span></div></div>' +
      '<div class="school-wall">' + rows.map((row, index) => '<div class="school-row' + (index % 2 ? ' reverse' : '') + '"><div class="school-track" style="--dur:' + (180 + index * 18) + 's">' + row.concat(row).map(card).join('') + '</div></div>').join('') + '</div>' +
    '</section>';
  }

  function entryFeatureSection() {
    return '<section class="entry-features">' +
      '<div class="entry-features-head"><div><div class="entry-kicker">WHY THIS WORKS</div><h2>不是堆数据，是帮你做选择。</h2><p>从分数到位次，从院校到专业，把 96 个志愿拆成一条能看懂的路径。</p></div></div>' +
      '<div class="entry-feature-grid">' +
        '<article class="entry-feature"><span class="ef-icon">' + icon('target') + '</span><span class="ef-index">01</span><h3>位次优先</h3><p>先用一分一段表把分数换算成位次，再对比历年录取，减少“只看分数”的误判。</p></article>' +
        '<article class="entry-feature"><span class="ef-icon">' + icon('layers') + '</span><span class="ef-index">02</span><h3>冲稳保梯度</h3><p>96 个专业志愿按录取概率由低到高排列，冲刺、稳妥、保底自然拉开。</p></article>' +
        '<article class="entry-feature"><span class="ef-icon">' + icon('school') + '</span><span class="ef-index">03</span><h3>具体到专业</h3><p>不只看院校最低分，还能看到专业组、选科要求、分专业最低位次和录取人数。</p></article>' +
      '</div>' +
      '<div class="entry-final-cta"><div><div class="entry-kicker">READY WHEN YOU ARE</div><h2>现在，找到你的那一所。</h2><p>游客可以直接生成 96 个专业志愿；登录后解锁全部专业明细、收藏与打印。</p></div><div class="entry-final-actions"><button type="button" class="entry-action entry-action-primary entry-action-compact" data-action="enter-guest"><span class="ea-copy"><strong>游客模式，直接进入</strong><small>无需账号 · 96 个专业志愿</small></span>' + icon('arrowRight') + '</button><button type="button" class="entry-action entry-action-glass entry-action-compact" data-action="entry-login"><span class="ea-copy"><strong>管理员登录</strong><small>解锁完整数据权限</small></span>' + icon('arrowRight') + '</button></div></div>' +
      '<footer class="entry-page-footer"><span>数据来源：掌上高考 · GaokaoCompass · 公开录取数据</span><span>志愿星图 2026 · 课程作业演示</span></footer>' +
    '</section>';
  }

  function renderEntry() {
    state.entry = true;
    const meta = DATA.meta;
    let remembered = '';
    try { remembered = localStorage.getItem('gkzy.lastId') || ''; } catch (err) { remembered = ''; }
    const accountValue = state.entryAccount || remembered;
    const checked = remembered ? ' checked' : '';
    const mode = state.entryMode || 'choice';
    const login = mode === 'login';
    app.className = 'entry-mode';
    document.body.classList.remove('login-open', 'modal-open');
    document.title = '志愿星图 · 选择你的进入方式';

    const choiceHtml = '<div class="entry-choice">' +
      '<div class="entry-kicker"><span class="dot"></span>2026 高考志愿规划 · 无需登录</div>' +
      '<h1>让每一分，<br>都有更好的<span>去向</span>。</h1>' +
      '<p class="entry-lead">把分数换算成位次，把位次放进真实录取数据里。先生成一套 96 个专业志愿，再慢慢找到最适合你的那一所。</p>' +
      '<div class="entry-actions">' +
        '<button type="button" class="entry-action entry-action-primary" data-action="enter-guest">' +
          '<span class="ea-icon">' + icon('spark') + '</span>' +
          '<span class="ea-copy"><strong>游客模式，直接进入</strong><small>无需账号 · 生成 96 个专业志愿</small></span>' +
          '<span class="ea-arrow">' + icon('arrowRight') + '</span>' +
        '</button>' +
        '<button type="button" class="entry-action entry-action-glass" data-action="entry-login">' +
          '<span class="ea-icon">' + icon('lock') + '</span>' +
          '<span class="ea-copy"><strong>管理员登录</strong><small>解锁全部专业明细、收藏与打印</small></span>' +
          '<span class="ea-arrow">' + icon('arrowRight') + '</span>' +
        '</button>' +
      '</div>' +
      '<div class="entry-proof"><span>' + icon('check') + '31 省录取数据</span><span>' + icon('check') + '3 年院校样本</span><span>' + icon('check') + '本机离线运行</span></div>' +
      '<div class="entry-stats">' +
        '<div><b>' + formatNumber(meta.schoolCount) + '</b><span>本科院校</span></div>' +
        '<div><b>' + meta.provinceCount + '</b><span>覆盖省份</span></div>' +
        '<div><b>' + formatNumber(meta.majorCount) + '</b><span>分专业记录</span></div>' +
        '<div><b>96</b><span>志愿梯度</span></div>' +
      '</div>' +
      '<div class="entry-note">' + icon('info') + '游客无需登录即可使用核心功能；登录仅用于解锁完整专业明细、收藏与打印。</div>' +
    '</div>';

    const loginHtml = '<div class="entry-login-card">' +
      '<button type="button" class="entry-back" data-action="entry-back">' + icon('arrowLeft') + '返回选择</button>' +
      '<div class="entry-kicker">ADMIN ACCESS</div>' +
      '<h2>登录，解锁<br><em>完整数据权限</em></h2>' +
      '<p class="entry-login-lead">游客也能直接生成 96 个专业志愿。登录后，把专业看到底、把方案留下来。</p>' +
      '<form class="entry-form" data-form="entry-login" novalidate>' +
        '<div class="entry-field"><label for="entry-account">账号</label><input class="input" id="entry-account" name="id" type="text" inputmode="numeric" autocomplete="username" maxlength="6" placeholder="请输入六位账号" value="' + escapeHtml(accountValue) + '" required></div>' +
        '<div class="entry-field"><label for="entry-password">密码</label><input class="input" id="entry-password" name="password" type="password" inputmode="numeric" autocomplete="current-password" maxlength="4" placeholder="请输入四位密码" required></div>' +
        '<div class="entry-error' + (state.entryError ? ' show' : '') + '" role="alert">' + icon('alert') + '<span>' + escapeHtml(state.entryError || '') + '</span></div>' +
        '<div class="entry-form-row"><label class="checkbox"><input type="checkbox" name="remember"' + checked + '>记住账号</label><button type="button" class="entry-help" data-action="login-help">忘记密码？</button></div>' +
        '<button type="submit" class="btn btn-light entry-submit' + (state.entryBusy ? ' loading' : '') + '"' + (state.entryBusy ? ' disabled' : '') + '><span class="spinner" aria-hidden="true"></span><span class="btn-label">登录并进入</span>' + icon('arrowRight') + '</button>' +
      '</form>' +
      '<button type="button" class="entry-skip" data-action="enter-guest">先不登录，以游客身份进入 →</button>' +
      '<div class="entry-login-note">' + icon('lock') + '账号仅在本机校验；游客模式无需任何账号。</div>' +
    '</div>';

    app.innerHTML = '<div class="entry-screen">' +
      '<section class="entry-hero">' +
        '<div class="entry-aurora aurora-a"></div><div class="entry-aurora aurora-b"></div><div class="entry-grid"></div>' +
        '<div class="entry-orbit orbit-a"></div><div class="entry-orbit orbit-b"></div>' +
        '<div class="entry-top"><div class="entry-brand"><div class="brand-mark">' + logoMark() + '</div><div class="brand-text"><div class="brand-name">志愿星图</div><div class="brand-sub">GAOKAO COMPASS</div></div></div>' +
          '<div class="entry-top-right"><span class="entry-live"><span class="dot"></span>2026 数据已就绪</span><span class="entry-top-count">31 省 · ' + formatNumber(meta.schoolCount) + ' 院校</span></div>' +
        '</div>' +
        '<div class="entry-cards">' + entrySchoolCards() + '</div>' +
        '<div class="entry-inner"><div class="entry-copy' + (login ? ' is-login' : '') + '">' + (login ? loginHtml : choiceHtml) + '</div></div>' +
        (login ? '' : '<button type="button" class="entry-scroll" data-action="scroll-schools">向下滑动 · 看看全部 ' + formatNumber(meta.schoolCount) + ' 所学校 ' + icon('chevronDown') + '</button>') +
        '<div class="entry-footer"><span>数据来源：掌上高考 · GaokaoCompass · 公开录取数据</span><span>2026 · 课程作业演示</span></div>' +
      '</section>' +
      entrySchoolWall() +
      entryFeatureSection() +
    '</div>';

    bindEntryParallax();
    if (login) {
      setTimeout(() => {
        const target = document.getElementById(state.entryError ? 'entry-password' : (accountValue ? 'entry-password' : 'entry-account'));
        if (target) target.focus();
      }, 160);
    }
  }

  function bindEntryParallax() {
    const screen = document.querySelector('.entry-screen');
    if (!screen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cards = Array.from(screen.querySelectorAll('.school-float'));
    let frame = 0;
    let mx = 0;
    let my = 0;
    const apply = () => {
      frame = 0;
      cards.forEach((card) => {
        const depth = Number(card.dataset.depth) || 10;
        card.style.setProperty('--px', (mx * depth).toFixed(1) + 'px');
        card.style.setProperty('--py', (my * depth).toFixed(1) + 'px');
      });
    };
    screen.addEventListener('mousemove', (event) => {
      mx = (event.clientX / window.innerWidth - 0.5) * 2;
      my = (event.clientY / window.innerHeight - 0.5) * 2;
      if (!frame) frame = window.requestAnimationFrame(apply);
    }, { passive: true });
    screen.addEventListener('mouseleave', () => {
      mx = 0; my = 0;
      if (!frame) frame = window.requestAnimationFrame(apply);
    }, { passive: true });
  }

  function enterGuest() {
    closeLogin();
    state.user = null;
    state.entry = false;
    state.entryMode = 'choice';
    state.entryError = '';
    state.entryBusy = false;
    try { sessionStorage.removeItem('gkzy.session'); } catch (err) { /* ignore */ }
    history.replaceState(null, '', '#/home');
    state.route = 'home';
    renderShell();
    showToast('已进入游客模式 · 96 个专业志愿免费生成');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function enterApp(account) {
    state.user = account;
    state.entry = false;
    state.entryMode = 'choice';
    state.entryError = '';
    state.entryBusy = false;
    state.entryAccount = '';
    history.replaceState(null, '', '#/home');
    state.route = 'home';
    renderShell();
    showToast('欢迎回来，' + account.name + '，完整权限已解锁');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  async function handleEntryLogin(form) {
    if (state.entryBusy) return;
    const id = String(form.elements.id.value || '').trim();
    const password = String(form.elements.password.value || '').trim();
    const remember = !!form.elements.remember.checked;
    state.entryAccount = id;
    if (!/^\d{6}$/.test(id)) {
      state.entryError = '账号应为 6 位数字，请检查后重新输入。';
      renderEntry();
      return;
    }
    if (!/^\d{4}$/.test(password)) {
      state.entryError = '密码应为 4 位数字，初始密码为账号后四位。';
      renderEntry();
      return;
    }
    const account = DATA.accounts.find((item) => item.id === id);
    if (!account) {
      state.entryError = '未找到该账号，请确认是否为学校发放的六位账号。';
      renderEntry();
      return;
    }
    state.entryBusy = true;
    state.entryError = '';
    renderEntry();
    try {
      const hash = await sha256Hex('gkzy2026:' + id + ':' + password);
      if (hash !== account.hash) {
        state.entryBusy = false;
        state.entryError = '账号或密码不正确，请重新输入。';
        renderEntry();
        return;
      }
      if (remember) {
        try { localStorage.setItem('gkzy.lastId', id); } catch (err) { /* ignore */ }
      } else {
        try { localStorage.removeItem('gkzy.lastId'); } catch (err) { /* ignore */ }
      }
      try { sessionStorage.setItem('gkzy.session', id); } catch (err) { /* ignore */ }
      enterApp(account);
    } catch (err) {
      state.entryBusy = false;
      state.entryError = '当前环境无法完成安全校验，请使用 Chrome 或 Edge 打开。';
      renderEntry();
    }
  }

  function showEntry() {
    closeModal();
    closeLogin();
    try { sessionStorage.removeItem('gkzy.session'); } catch (err) { /* ignore */ }
    state.user = null;
    state.entry = true;
    state.entryMode = 'choice';
    state.entryError = '';
    state.entryBusy = false;
    state.entryAccount = '';
    state.detail = null;
    history.replaceState(null, '', '#/home');
    state.route = 'home';
    renderEntry();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  async function handleLogin(form) {
    if (state.loginBusy) return;
    const id = String(form.elements.id.value || '').trim();
    const password = String(form.elements.password.value || '').trim();
    const remember = !!form.elements.remember.checked;
    if (!/^\d{6}$/.test(id)) {
      state.loginError = '账号应为 6 位数字，请检查后重新输入。';
      state.loginId = id;
      renderLoginModal();
      return;
    }
    if (!/^\d{4}$/.test(password)) {
      state.loginError = '密码应为 4 位数字，初始密码为账号后四位。';
      state.loginId = id;
      renderLoginModal();
      return;
    }
    const account = DATA.accounts.find((item) => item.id === id);
    if (!account) {
      state.loginError = '未找到该账号，请确认是否为学校发放的六位账号。';
      state.loginId = id;
      renderLoginModal();
      return;
    }
    const submit = form.querySelector('.login-submit');
    state.loginBusy = true;
    if (submit) {
      submit.classList.add('loading');
      submit.disabled = true;
    }
    try {
      const hash = await sha256Hex('gkzy2026:' + id + ':' + password);
      if (hash !== account.hash) {
        state.loginError = '账号或密码不正确，请重新输入。';
        state.loginId = id;
        state.loginBusy = false;
        renderLoginModal();
        return;
      }
      if (remember) {
        try { localStorage.setItem('gkzy.lastId', id); } catch (err) { /* ignore */ }
      } else {
        try { localStorage.removeItem('gkzy.lastId'); } catch (err) { /* ignore */ }
      }
      try { sessionStorage.setItem('gkzy.session', id); } catch (err) { /* ignore */ }
      const reopenDetail = !!state.detail;
      state.user = account;
      state.loginError = '';
      state.loginId = '';
      state.loginBusy = false;
      closeLogin();
      ensureProfileTrack();
      if (!location.hash || !ROUTE_KEYS.includes(location.hash.replace('#/', ''))) {
        history.replaceState(null, '', '#/home');
      }
      state.route = routeFromHash();
      renderShell();
      if (reopenDetail && state.detail) {
        renderModal();
        document.body.classList.add('modal-open');
      }
      showToast('欢迎回来，' + account.name + '，完整权限已解锁');
    } catch (err) {
      state.loginError = '当前环境无法完成安全校验，请使用 Chrome 或 Edge 打开。';
      state.loginBusy = false;
      renderLoginModal();
    }
  }

  /* ---------------- Shell ---------------- */
  function routeFromHash() {
    const raw = (location.hash || '').replace(/^#\/?/, '');
    return ROUTE_KEYS.includes(raw) ? raw : 'home';
  }

  function navigate(route) {
    if (!ROUTE_KEYS.includes(route)) route = 'home';
    if (location.hash === '#/' + route) {
      state.route = route;
      renderRoute();
      window.scrollTo({ top: 0, behavior: 'auto' });
    } else {
      location.hash = '#/' + route;
    }
  }

  function restoreSession() {
    try {
      const id = sessionStorage.getItem('gkzy.session');
      if (!id) return;
      const account = DATA.accounts.find((item) => item.id === id);
      if (account) state.user = account;
    } catch (err) { /* ignore */ }
  }

  function renderShell() {
    state.entry = false;
    ensureProfileTrack();
    state.route = routeFromHash();
    app.className = '';
    const account = state.user;
    const guest = !account;
    const initials = guest ? '游' : account.name.slice(0, 1);
    app.innerHTML = '<div class="app-shell">' +
      '<aside class="sidebar">' +
        '<div class="brand">' +
          '<div class="brand-mark">' + logoMark() + '</div>' +
          '<div class="brand-text"><div class="brand-name">志愿星图</div><div class="brand-sub">GAOKAO COMPASS</div></div>' +
        '</div>' +
        '<div class="nav-section">' +
          '<div class="nav-label">规划工具</div>' +
          '<div class="nav-list">' +
            '<a class="nav-item" data-nav="home" href="#/home">' + icon('home') + '<span class="nav-text">首页</span></a>' +
            '<a class="nav-item" data-nav="recommend" href="#/recommend">' + icon('spark') + '<span class="nav-text">智能填报</span><span class="nav-badge">96</span></a>' +
            '<a class="nav-item" data-nav="schools" href="#/schools">' + icon('school') + '<span class="nav-text">院校库</span></a>' +
          '</div>' +
        '</div>' +
        '<div class="nav-section">' +
          '<div class="nav-label">我的</div>' +
          '<div class="nav-list">' +
            '<a class="nav-item" data-nav="favorites" href="#/favorites">' + icon('heart') + '<span class="nav-text">我的收藏</span>' + (guest ? '<span class="nav-lock">登录</span>' : '') + '</a>' +
            '<a class="nav-item" data-nav="about" href="#/about">' + icon('info') + '<span class="nav-text">关于系统</span></a>' +
          '</div>' +
        '</div>' +
        '<div class="sidebar-foot">' +
          '<div class="sidebar-note">' + (guest
            ? '<strong>游客模式</strong><br>96 个专业志愿免费生成；登录解锁全部分专业明细、收藏和打印。'
            : '<strong>管理员权限</strong><br>全部分专业明细、收藏与打印已解锁。') + '</div>' +
          (guest
            ? '<div class="user-card guest-card">' +
                '<div class="avatar guest">游</div>' +
                '<div class="user-meta"><div class="user-name">游客</div><div class="user-id">无需登录 · 即刻体验</div></div>' +
                '<button class="btn btn-primary btn-xs" data-action="open-login">登录</button>' +
              '</div>'
            : '<div class="user-card">' +
                '<div class="avatar ' + avatarClass(account) + '">' + escapeHtml(initials) + '</div>' +
                '<div class="user-meta"><div class="user-name">' + escapeHtml(account.name) + '</div><div class="user-id">' + escapeHtml(account.id) + ' · 管理员</div></div>' +
                '<button class="icon-btn" data-action="logout" title="退出登录" aria-label="退出登录">' + icon('logout') + '</button>' +
              '</div>') +
          '<button class="sidebar-switch" data-action="show-entry">' + icon('arrowLeft') + '切换进入方式</button>' +
        '</div>' +
      '</aside>' +
      '<main class="main">' +
        '<header class="topbar">' +
          '<div class="page-heading"><div class="page-icon" id="page-icon">' + icon(ROUTES[state.route].icon) + '</div><div><h1 id="page-title">' + ROUTES[state.route].title + '</h1><p id="page-sub">' + ROUTES[state.route].sub + '</p></div></div>' +
          '<div class="top-actions"><span class="top-date">' + dateText() + '</span><div id="top-context"></div>' +
            (guest
              ? '<button class="btn btn-primary btn-sm top-login" data-action="open-login">' + icon('user') + '登录解锁</button>'
              : '<button class="icon-btn top-logout" data-action="logout" title="退出登录" aria-label="退出登录">' + icon('logout') + '</button>') +
          '</div>' +
        '</header>' +
        '<div class="content" id="view"></div>' +
      '</main>' +
    '</div><div id="modal-root"></div><div id="login-root"></div>';
    updateChrome();
    if (!hashBound) {
      window.addEventListener('hashchange', onHashChange);
      hashBound = true;
    }
    renderRoute();
  }

  function updateChrome() {
    const route = ROUTES[state.route] || ROUTES.home;
    const title = document.getElementById('page-title');
    const sub = document.getElementById('page-sub');
    const pageIcon = document.getElementById('page-icon');
    if (title) title.textContent = route.title;
    if (sub) sub.textContent = route.sub;
    if (pageIcon) pageIcon.innerHTML = icon(route.icon);
    document.title = route.title + ' · 志愿星图';
    document.querySelectorAll('.nav-item[data-nav]').forEach((item) => {
      item.classList.toggle('active', item.getAttribute('data-nav') === state.route);
    });
    const top = document.getElementById('top-context');
    if (top) {
      if (state.user) {
        const province = currentProvince();
        const track = currentTrack();
        top.innerHTML = '<div class="profile-chip">' +
          '<div class="avatar ' + avatarClass(state.user) + '">' + escapeHtml(state.user.name.slice(0, 1)) + '</div>' +
          '<div><strong>' + escapeHtml(state.user.name) + '<em class="member-tag">管理员</em></strong><span>' + escapeHtml(province.short) + ' · ' + escapeHtml(track.name) + ' · ' + escapeHtml(state.user.id) + '</span></div>' +
        '</div>';
      } else {
        top.innerHTML = '<span class="guest-mode"><span class="dot"></span>游客模式</span>';
      }
    }
  }

  function onHashChange() {
    if (state.entry) return;
    const next = routeFromHash();
    if (next === state.route && document.getElementById('view') && !document.getElementById('modal-root').children.length) {
      // 同一路由也重新绘制，便于从详情等状态恢复。
    }
    state.route = next;
    closeModal();
    closeLogin();
    renderRoute();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function renderRoute() {
    if (state.entry) return;
    state.route = routeFromHash();
    updateChrome();
    const view = document.getElementById('view');
    if (!view) return;
    let html = '';
    if (state.route === 'home') html = homeHtml();
    else if (state.route === 'recommend') html = recommendHtml();
    else if (state.route === 'schools') html = schoolsHtml();
    else if (state.route === 'favorites') html = favoritesHtml();
    else if (state.route === 'about') html = aboutHtml();
    view.innerHTML = html;
    if (state.route === 'recommend' && state.recommend) {
      // 结果已直接渲染，无需二次操作。
    }
  }

  function logout() {
    showEntry();
    showToast('已退出登录，请选择新的进入方式');
  }

  /* ---------------- Home ---------------- */
  function homeHtml() {
    ensureProfileTrack();
    const province = currentProvince();
    const track = currentTrack();
    const score = currentScore();
    const meta = DATA.meta;
    const latestLine = track.years['2025'];
    const guest = !state.user;
    const available = (school) => getSchoolRows(school, province.id, track.id).some((row) => row.year === 2025);
    const featured = FEATURED_NAMES.map((name) => DATA.schools.find((school) => school.name === name)).filter((school) => school && available(school));
    const fillers = DATA.schools.filter((school) => school.level === '985' && available(school) && !featured.includes(school)).slice(0, 6 - featured.length);
    const miniSchools = featured.concat(fillers).slice(0, 6);

    return '<section class="hero">' +
      '<div class="hero-copy">' +
        '<div class="hero-eyebrow"><span class="dot"></span>2026 高考志愿填报 · ' + (guest ? '无需登录直接体验' : '管理员模式 · 全权限已开启') + '</div>' +
        '<h1>让每一分，<br>都有更好的<em>去向</em>。</h1>' +
        '<p>以分数换算位次，以位次对照历年录取。系统会从院校池中为你挑出最多 96 个专业志愿，并按录取概率从低到高排好冲刺、稳妥与保底。</p>' +
        '<div class="hero-points">' +
          '<span class="hero-point">' + icon('target') + '位次优先</span>' +
          '<span class="hero-point">' + icon('layers') + '冲稳保梯度</span>' +
          '<span class="hero-point">' + icon('shield') + '本机离线</span>' +
        '</div>' +
        '<div class="hero-hot"><span>热门方向</span><em>计算机</em><em>临床医学</em><em>法学</em><em>电气</em><em>师范</em><em>金融</em></div>' +
      '</div>' +
      '<form class="hero-form" data-form="recommend" novalidate>' +
        '<div class="hero-form-head"><strong>快速生成志愿方案</strong><span>96 个专业志愿 · 约 1 秒</span></div>' +
        '<div class="hero-form-grid">' +
          '<div class="field"><label for="quick-province">高考省份</label><select class="select" id="quick-province" name="provinceId" data-change="quick-province">' + provinceOptions(province.id) + '</select></div>' +
          '<div class="field"><label for="quick-track">选科类别</label><select class="select" id="quick-track" name="trackId" data-change="quick-track">' + trackOptions(province, track.id) + '</select></div>' +
          '<div class="field field-score"><label for="quick-score">高考分数</label><div class="input-wrap"><input class="input" id="quick-score" name="score" data-bind="score" type="number" inputmode="decimal" min="0" max="' + province.maxScore + '" step="1" placeholder="输入你的高考分数" value="' + escapeHtml(state.profile.score || '') + '"><span class="input-suffix">分 / ' + province.maxScore + '</span></div></div>' +
        '</div>' +
        '<button class="btn btn-light" type="submit">生成我的 96 个专业志愿' + icon('arrowRight') + '</button>' +
        '<div class="hero-form-note">' + icon('lock') + '分数仅用于本机匹配，不会上传</div>' +
      '</form>' +
    '</section>' +
    (guest
      ? '<div class="access-banner guest-access"><div class="access-icon">' + icon('spark') + '</div><div class="access-copy"><strong>游客模式 · 核心功能免费使用</strong><span>无需登录即可生成 96 个专业志愿、查询院校和分专业分数；登录后可解锁全部专业明细、收藏与打印。</span></div><button class="btn btn-primary btn-sm" data-action="open-login" data-prompt="登录后即可解锁全部分专业明细、收藏和打印权限。">登录解锁完整权限</button></div>'
      : '<div class="access-banner member-access"><div class="access-icon">' + icon('shield') + '</div><div class="access-copy"><strong>管理员权限已开启</strong><span>全部分专业明细、收藏与打印已解锁。你的身份会在本次窗口内保持登录。</span></div><span class="member-badge">' + icon('check') + '全权限</span></div>') +
    '<div class="stat-grid">' +
      '<div class="stat-card"><div class="stat-icon">' + icon('school') + '</div><div><div class="stat-value">' + meta.schoolCount + '</div><div class="stat-label">收录院校</div></div></div>' +
      '<div class="stat-card"><div class="stat-icon teal">' + icon('pin') + '</div><div><div class="stat-value">' + meta.provinceCount + '</div><div class="stat-label">覆盖省份</div></div></div>' +
      '<div class="stat-card"><div class="stat-icon orange">' + icon('layers') + '</div><div><div class="stat-value">' + formatNumber(meta.majorCount) + '</div><div class="stat-label">分专业记录</div></div></div>' +
      '<div class="stat-card"><div class="stat-icon violet">' + icon('database') + '</div><div><div class="stat-value">' + formatNumber(meta.recordCount) + '</div><div class="stat-label">院校记录</div></div></div>' +
    '</div>' +
    '<div class="dashboard-grid">' +
      '<div>' +
        '<div class="section-head"><div><h2 class="section-title">院校速览</h2><p class="section-sub">按 ' + escapeHtml(province.name) + ' · ' + escapeHtml(track.name) + ' 口径显示 2025 年最低分</p></div><button class="text-link" data-action="go-schools">查看全部' + icon('arrowRight') + '</button></div>' +
        '<div class="mini-grid">' + miniSchools.map((school) => miniSchoolCard(school, province, track)).join('') + '</div>' +
      '</div>' +
      '<div class="side-stack">' +
        '<div class="side-card">' +
          '<div class="side-card-head"><h3>2025 年批次线与考生</h3><span class="tag tag-ghost">' + escapeHtml(province.short) + '</span></div>' +
          '<div class="line-list">' + province.tracks.map((item) => {
            const line = item.years['2025'];
            return '<div class="line-row"><div class="line-name">' + escapeHtml(item.name) + '</div><div class="line-val">本科 <b>' + (line[0] == null ? '—' : line[0]) + '</b></div><div class="line-val special">考生 <b>' + formatWan(item.candidates) + '</b></div></div>';
          }).join('') + '</div>' +
          '<div class="province-lines-footer">' + icon('info') + '2025 年公开批次线与一分一段统计</div>' +
        '</div>' +
        '<div class="tips-card">' +
          '<h3>填好 96 个专业志愿的三件事</h3>' +
          '<p>先看位次，再看梯度，最后核对选科。</p>' +
          '<div class="tip-step"><span class="tip-num">01</span><p><strong>用位次定位。</strong>分数会波动，位次更稳定，优先比较历年最低位次。</p></div>' +
          '<div class="tip-step"><span class="tip-num">02</span><p><strong>把梯度拉开。</strong>前段冲刺、中段稳妥、后段保底，避免全部集中在一个分数带。</p></div>' +
          '<div class="tip-step"><span class="tip-num">03</span><p><strong>核对硬条件。</strong>选科要求、体检限制、单科成绩与学费，都要在正式填报前确认。</p></div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    (score != null ? '<div class="notice-bar">' + icon('target') + '<span>当前参考分数 <b>' + score + '</b> 分（' + escapeHtml(province.name) + ' · ' + escapeHtml(track.name) + '），预计位次约 <b>' + formatNumber(ENGINE.estimateRank(province, track, score)) + '</b>。本科线为 ' + (latestLine[0] == null ? '—' : latestLine[0]) + ' 分，点击上方按钮即可生成方案。</span></div>' : '') +
    '<div class="notice-bar">' + icon('alert') + '<span>' + escapeHtml(meta.dataNote) + '</span></div>';
  }

  function miniSchoolCard(school, province, track) {
    const rows = getSchoolRows(school, province.id, track.id);
    const latest = rows[0];
    return '<article class="mini-card" data-action="detail" data-school="' + school.id + '" role="button" tabindex="0">' +
      '<div class="mini-card-top"><div><h4>' + escapeHtml(school.name) + '</h4><div class="mini-loc">' + escapeHtml(locationText(school)) + ' · ' + escapeHtml(school.type) + '</div></div><span class="mini-arrow">' + icon('arrowRight') + '</span></div>' +
      '<div class="mini-tags">' + tagsHtml(school, 3) + '</div>' +
      '<div class="mini-score-row">' +
        '<div><div class="mini-score-label">' + (latest ? latest.year + ' 最低分' : '暂无数据') + '</div><div class="mini-score">' + (latest ? latest.min : '—') + (latest ? '<small>分</small>' : '') + '</div></div>' +
        '<div class="mini-rank">最低位次<b>' + (latest ? formatNumber(latest.rank) : '—') + '</b></div>' +
      '</div>' +
      (rows.length ? sparkline(rows, '#2c5cf6') : '') +
    '</article>';
  }

  /* ---------------- Recommendation ---------------- */
  function recommendHtml() {
    ensureProfileTrack();
    const province = currentProvince();
    const track = currentTrack();
    const result = state.recommend;
    let html = '<section class="query-panel">' +
      '<div class="query-head"><div><h2>生成志愿方案</h2><p>输入分数，系统按冲、稳、保分段生成最多 96 个专业志愿。</p></div><span class="tag tag-ghost">' + escapeHtml(province.mode) + '</span></div>' +
      '<form class="query-form" data-form="recommend" novalidate>' +
        '<div class="field"><label for="rec-province">高考省份</label><select class="select" id="rec-province" name="provinceId" data-change="rec-province">' + provinceOptions(province.id) + '</select></div>' +
        '<div class="field"><label for="rec-track">选科类别</label><select class="select" id="rec-track" name="trackId" data-change="rec-track">' + trackOptions(province, track.id) + '</select></div>' +
        '<div class="field"><label for="rec-score">高考分数</label><div class="input-wrap"><input class="input" id="rec-score" name="score" data-bind="score" type="number" inputmode="decimal" min="0" max="' + province.maxScore + '" step="1" placeholder="例如 600" value="' + escapeHtml(state.profile.score || '') + '"><span class="input-suffix">分</span></div></div>' +
        '<button class="btn btn-primary" type="submit">' + icon('spark') + '生成 96 专业志愿</button>' +
      '</form>' +
    '</section>';

    if (!result) {
      html += '<div class="panel" style="margin-top:17px;border:1px solid var(--line);border-radius:17px;background:#fff">' +
        '<div class="empty-state">' +
          '<div class="empty-illustration">' + icon('compass') + '</div>' +
          '<h3>先输入分数，再生成你的专属梯度</h3>' +
          '<p>系统会把你的分数换算成位次，与本省历年真实录取数据逐一对照，按录取概率从低到高选出最多 96 个专业志愿。</p>' +
          '<div class="rec-actions"><button class="btn btn-soft" data-action="go-schools">' + icon('school') + '先去院校库看看</button></div>' +
        '</div>' +
      '</div>';
      return html;
    }

    const counts = result.counts;
    const lowLine = result.track.years['2025'][0];
    const first = result.items[0];
    const last = result.items[result.items.length - 1];

    html += '<section class="result-summary">' +
      '<div class="summary-main">' +
        '<div class="score-box">' +
          '<div class="score-label">你的参考分数 <span class="tag tag-syl">' + escapeHtml(result.province.short) + '</span></div>' +
          '<div class="score-number">' + result.score + '<small>分</small></div>' +
          '<div class="score-meta"><span>' + escapeHtml(result.province.name) + ' · ' + escapeHtml(result.track.name) + '</span><span>预估位次 <b>' + formatNumber(result.studentRank) + '</b></span></div>' +
        '</div>' +
        '<div class="summary-summary">' +
          '<h3>为你匹配 ' + result.items.length + ' 个专业志愿</h3>' +
          '<p>按录取概率从低到高排列，前段冲刺，中段稳妥，后段保底。</p>' +
          '<div class="count-row">' +
            '<span class="count-chip reach"><i class="pill-dot"></i>冲刺 <b>' + counts.reach + '</b></span>' +
            '<span class="count-chip match"><i class="pill-dot"></i>稳妥 <b>' + counts.match + '</b></span>' +
            '<span class="count-chip safe"><i class="pill-dot"></i>保底 <b>' + counts.safe + '</b></span>' +
            '<span class="count-chip">专业池 <b>' + result.totalCandidates + '</b></span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="strategy-box">' +
        '<h4>录取概率梯度</h4>' +
        '<div class="gradient-scale"><span class="g-reach"></span><span class="g-match"></span><span class="g-safe"></span></div>' +
        '<div class="scale-labels"><span>冲刺 ' + first.percent + '%</span><span>稳妥</span><span>保底 ' + last.percent + '%</span></div>' +
        '<p>概率由历年最低分、分数趋势与院校层次估算，仅作排序参考。' + (lowLine != null && result.score < lowLine ? ' 当前分数低于本科线，结果仅作本科批次参考。' : '') + '</p>' +
      '</div>' +
    '</section>' +
    (result.items.length < 96 ? '<div class="notice-bar">' + icon('alert') + '<span>该省份当前符合条件的真实专业志愿共 ' + result.items.length + ' 个，已全部列出，无法补足 96 个；未使用虚构数据填充。</span></div>' : '') +
    '<div class="rec-toolbar">' +
      '<div class="chip-row">' +
        chip('all', '全部', result.items.length) +
        chip('reach', '冲刺', counts.reach) +
        chip('match', '稳妥', counts.match) +
        chip('safe', '保底', counts.safe) +
      '</div>' +
      '<div class="toolbar-right"><div class="search-mini">' + icon('search') + '<input id="rec-search" type="search" placeholder="搜索院校或城市" value="' + escapeHtml(state.recFilter.q) + '" autocomplete="off"></div><button class="btn btn-ghost btn-sm" data-action="print">' + icon('print') + '打印</button></div>' +
    '</div>' +
    '<div id="rec-results">' + recResultsHtml() + '</div>' +
    '<div class="rec-footnote">' + icon('info') + '录取概率为估算值，不作为正式填报依据；请以省教育考试院官方数据为准。</div>' +
    '<div class="rec-actions"><button class="btn btn-soft" data-action="go-schools">' + icon('school') + '去院校库继续查分</button><button class="btn btn-ghost" data-action="print">' + icon('print') + '打印 / 保存 PDF</button></div>';

    return html;
  }

  function chip(tier, label, count) {
    const active = state.recFilter.tier === tier;
    return '<button type="button" class="chip' + (active ? ' active' : '') + '" data-action="filter-tier" data-tier="' + tier + '">' + label + '<span class="chip-count">' + count + '</span></button>';
  }

  function filteredRecItems() {
    const result = state.recommend;
    if (!result) return [];
    const q = state.recFilter.q.trim().toLowerCase();
    return result.items.map((item, index) => ({ item, index })).filter(({ item }) => {
      if (state.recFilter.tier !== 'all' && item.tier !== state.recFilter.tier) return false;
      if (!q) return true;
      const majorText = item.major ? (item.major.name + ' ' + item.major.group + ' ' + item.major.subject) : '';
      const text = (item.school.name + ' ' + item.school.city + ' ' + item.school.province + ' ' + item.school.type + ' ' + majorText).toLowerCase();
      return text.includes(q);
    });
  }

  function recResultsHtml() {
    const result = state.recommend;
    if (!result) return '';
    const list = filteredRecItems();
    let body = '';
    if (!list.length) {
      body = '<div class="rec-empty">没有找到符合条件的院校，试试切换筛选或清空搜索。</div>';
    } else {
      body = list.map(({ item, index }) => {
        const school = item.school;
        const rows = item.rows;
        const major = item.major;
        const tierClass = item.tier === 'reach' ? 'reach' : item.tier === 'match' ? 'match' : 'safe';
        const probClass = tierClass;
        const majorLine = major
          ? '<div class="rec-major"><span class="rec-major-name">' + escapeHtml(major.name) + '</span>' + (major.group ? '<span class="rec-major-group">' + escapeHtml(major.group) + '</span>' : '') + '</div><div class="rec-major-sub">' + (major.subject ? escapeHtml(major.subject) : '专业录取数据') + '</div>'
          : '';
        return '<div class="rec-row" data-action="detail" data-school="' + school.id + '" role="button" tabindex="0" aria-label="查看' + escapeHtml(school.name) + (major ? ' ' + escapeHtml(major.name) : '') + '详情">' +
          '<div class="rec-index' + (index < 3 ? ' is-top' : '') + '">' + String(index + 1).padStart(2, '0') + '</div>' +
          '<div class="rec-school"><div class="rec-school-head"><span class="rec-school-name">' + escapeHtml(school.name) + '</span><span class="rec-tags">' + tagsHtml(school, 2) + '</span></div>' + majorLine + '<div class="rec-school-sub"><span>' + escapeHtml(locationText(school)) + '</span><span class="dot-sep"></span><span>' + escapeHtml(school.type) + '</span><span class="dot-sep"></span><span>' + escapeHtml(school.nature) + '</span></div><div class="rec-school-mobile-data"><span>2025 专业最低 <b>' + (item.latest ? item.latest.min : '—') + '</b> 分</span><span>位次 <b>' + (item.latest ? formatNumber(item.latest.rank) : '—') + '</b></span></div></div>' +
          '<div class="rec-min"><div class="rec-min-top"><span class="rec-min-score">' + (item.latest ? item.latest.min : '—') + '</span><span class="rec-min-label">2025 专业最低</span>' + trendHtml(rows) + '</div><div class="rec-min-rank">专业位次 <b>' + (item.latest ? formatNumber(item.latest.rank) : '—') + '</b></div></div>' +
          '<div class="rec-prob"><div class="prob-line"><span class="pill pill-' + tierClass + '"><i class="pill-dot"></i>' + item.tierLabel + '</span><span class="prob-value ' + probClass + '">' + item.percent + '%</span></div><div class="prob-track"><div class="prob-fill ' + probClass + '" style="width:' + item.percent + '%"></div></div></div>' +
          '<div class="rec-action"><button type="button" class="rec-fav' + (state.favorites.has(school.id) ? ' on' : '') + '" data-action="fav" data-school="' + school.id + '" aria-label="' + (state.favorites.has(school.id) ? '取消收藏' : '收藏') + '" aria-pressed="' + state.favorites.has(school.id) + '">' + icon('heart') + '</button></div>' +
        '</div>';
      }).join('');
    }
    return '<div class="rec-panel"><div class="rec-head"><span>序号</span><span>院校 / 专业</span><span>2025 专业最低</span><span>录取概率</span><span></span></div><div class="rec-list">' + body + '</div></div>';
  }

  function refreshRecResults() {
    const container = document.getElementById('rec-results');
    if (container) container.innerHTML = recResultsHtml();
  }

  /* ---------------- School library ---------------- */
  function latestForContext(school) {
    const province = currentProvince();
    const track = currentTrack();
    return getSchoolRows(school, province.id, track.id)[0] || null;
  }

  function filteredSchoolList() {
    const library = state.library;
    const q = library.q.trim().toLowerCase();
    let list = DATA.schools.filter((school) => {
      if (q && !(school.name + ' ' + school.city + ' ' + school.province + ' ' + school.type).toLowerCase().includes(q)) return false;
      if (library.province !== 'all' && school.province !== library.province) return false;
      if (library.level !== 'all' && school.level !== library.level) return false;
      if (library.type !== 'all' && school.type !== library.type) return false;
      return true;
    });
    if (library.sort === 'name') {
      list = list.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'));
    } else if (library.sort === 'strength') {
      list = list.sort((a, b) => b.strength - a.strength || a.name.localeCompare(b.name, 'zh-Hans-CN'));
    } else {
      list = list.sort((a, b) => {
        const ar = latestForContext(a);
        const br = latestForContext(b);
        return (br ? br.min : -1) - (ar ? ar.min : -1) || a.name.localeCompare(b.name, 'zh-Hans-CN');
      });
    }
    return list;
  }

  function schoolsHtml() {
    ensureProfileTrack();
    const province = currentProvince();
    const track = currentTrack();
    const types = Array.from(new Set(DATA.schools.map((school) => school.type))).sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'));
    const levels = [
      ['all', '全部层次'],
      ['985', '985'],
      ['211', '211'],
      ['SYL', '双一流'],
      ['REG', '普通本科'],
      ['PVT', '民办本科']
    ];
    const lib = state.library;
    return '<div class="library-hero">' +
      '<div><h2>' + DATA.meta.schoolCount + ' 所院校，逐一看分数</h2><p>切换查分口径，查看不同省份与选科组合下的近三年录取数据。</p></div>' +
      '<div class="context-switch"><span class="context-label">查分口径</span><select class="select" data-change="lib-context-province">' + provinceOptions(province.id) + '</select><select class="select" data-change="lib-context-track">' + trackOptions(province, track.id) + '</select></div>' +
    '</div>' +
    '<div class="filter-panel">' +
      '<div class="search-box">' + icon('search') + '<input id="lib-search" class="input" type="search" placeholder="搜索院校名称、城市或类型…" value="' + escapeHtml(lib.q) + '" autocomplete="off"></div>' +
      '<select class="select" data-change="lib-province"><option value="all">全部所在地</option>' + DATA.provinces.map((item) => '<option value="' + item.id + '"' + (lib.province === item.id ? ' selected' : '') + '>' + escapeHtml(item.name) + '</option>').join('') + '</select>' +
      '<select class="select" data-change="lib-level">' + levels.map(([value, label]) => '<option value="' + value + '"' + (lib.level === value ? ' selected' : '') + '>' + label + '</option>').join('') + '</select>' +
      '<select class="select" data-change="lib-type"><option value="all">全部类型</option>' + types.map((type) => '<option value="' + escapeHtml(type) + '"' + (lib.type === type ? ' selected' : '') + '>' + escapeHtml(type) + '</option>').join('') + '</select>' +
    '</div>' +
    '<div class="filter-meta"><span>共找到 <b id="library-count">' + filteredSchoolList().length + '</b> 所院校</span><select class="select sort-select" data-change="lib-sort"><option value="score"' + (lib.sort === 'score' ? ' selected' : '') + '>按 2025 最低分排序</option><option value="strength"' + (lib.sort === 'strength' ? ' selected' : '') + '>按综合热度排序</option><option value="name"' + (lib.sort === 'name' ? ' selected' : '') + '>按院校名称排序</option></select></div>' +
    '<div id="library-results">' + libraryResultsHtml() + '</div>' +
    '<div class="notice-bar">' + icon('info') + '<span>当前查分口径：' + escapeHtml(province.name) + ' · ' + escapeHtml(track.name) + '。切换上方省份或选科后，院校卡片会同步更新。</span></div>';
  }

  function libraryResultsHtml() {
    const all = filteredSchoolList();
    const pageSize = state.library.pageSize;
    const pages = Math.max(1, Math.ceil(all.length / pageSize));
    if (state.library.page > pages) state.library.page = pages;
    const current = state.library.page;
    const start = (current - 1) * pageSize;
    const slice = all.slice(start, start + pageSize);
    let cards = '';
    if (!slice.length) {
      cards = '<div class="empty-state" style="grid-column:1/-1;padding-top:40px"><div class="empty-illustration">' + icon('search') + '</div><h3>没有找到匹配的院校</h3><p>试试更换关键词，或把筛选条件放宽一些。</p></div>';
    } else {
      cards = slice.map((school) => schoolCardHtml(school)).join('');
    }
    return '<div class="school-grid">' + cards + '</div>' +
      (all.length > pageSize ? '<div class="pagination">' + paginationHtml(current, pages) + '</div>' : '');
  }

  function paginationHtml(current, pages) {
    const buttons = [];
    buttons.push('<button class="page-btn" data-action="lib-page" data-page="' + (current - 1) + '"' + (current === 1 ? ' disabled' : '') + ' aria-label="上一页">' + icon('chevronLeft') + '</button>');
    const nums = [];
    if (pages <= 7) {
      for (let i = 1; i <= pages; i += 1) nums.push(i);
    } else {
      nums.push(1);
      if (current > 3) nums.push('…');
      for (let i = Math.max(2, current - 1); i <= Math.min(pages - 1, current + 1); i += 1) nums.push(i);
      if (current < pages - 2) nums.push('…');
      nums.push(pages);
    }
    nums.forEach((num) => {
      if (num === '…') buttons.push('<span class="page-btn" style="border:0;background:transparent;cursor:default">…</span>');
      else buttons.push('<button class="page-btn' + (num === current ? ' active' : '') + '" data-action="lib-page" data-page="' + num + '">' + num + '</button>');
    });
    buttons.push('<button class="page-btn" data-action="lib-page" data-page="' + (current + 1) + '"' + (current === pages ? ' disabled' : '') + ' aria-label="下一页">' + icon('chevronRight') + '</button>');
    buttons.push('<span class="page-info">第 ' + current + ' / ' + pages + ' 页</span>');
    return buttons.join('');
  }

  function schoolCardHtml(school) {
    const rows = getSchoolRows(school, currentProvince().id, currentTrack().id);
    const latest = rows[0];
    const on = state.favorites.has(school.id);
    return '<article class="school-card" data-action="detail" data-school="' + school.id + '" role="button" tabindex="0">' +
      '<div class="school-card-top"><div>' + tagsHtml(school, 3) + '<h3>' + escapeHtml(school.name) + '</h3><div class="school-meta"><span>' + escapeHtml(locationText(school)) + '</span><span class="dot-sep"></span><span>' + escapeHtml(school.type) + '</span><span class="dot-sep"></span><span>' + escapeHtml(school.nature) + '</span></div></div><button type="button" class="card-fav' + (on ? ' on' : '') + '" data-action="fav" data-school="' + school.id + '" aria-label="' + (on ? '取消收藏' : '收藏') + '" aria-pressed="' + on + '">' + icon('heart') + '</button></div>' +
      '<div class="school-data"><div><div class="school-score-label">2025 最低分</div><div class="school-score"><b>' + (latest ? latest.min : '—') + '</b><span>分</span></div><div class="school-rank">位次 <b>' + (latest ? formatNumber(latest.rank) : '—') + '</b>' + trendHtml(rows) + '</div></div>' + (rows.length ? sparkline(rows, on ? '#f0a128' : '#2c5cf6') : '') + '</div>' +
    '</article>';
  }

  function refreshLibraryResults() {
    const all = filteredSchoolList();
    const count = document.getElementById('library-count');
    if (count) count.textContent = all.length;
    const results = document.getElementById('library-results');
    if (results) results.innerHTML = libraryResultsHtml();
  }

  /* ---------------- Favorites ---------------- */
  function favoritesHtml() {
    ensureProfileTrack();
    if (!state.user) {
      return '<div class="guest-gate">' +
        '<div class="guest-gate-glow"></div>' +
        '<div class="guest-gate-icon">' + icon('heart') + '</div>' +
        '<div class="guest-gate-copy"><div class="eyebrow">MEMBER ACCESS</div><h2>登录后，收藏你的志愿</h2><p>游客可以免费生成 96 个专业志愿、查询院校和分专业分数；登录后还可以收藏院校、打印方案，并查看完整的分专业明细。</p>' +
          '<div class="guest-gate-list"><span>' + icon('check') + '收藏院校与心仪专业</span><span>' + icon('check') + '打印 / 保存 PDF</span><span>' + icon('check') + '全部分专业录取明细</span></div>' +
          '<div class="guest-gate-actions"><button class="btn btn-primary" data-action="open-login" data-prompt="登录后即可使用收藏、打印和全部分专业明细。">登录解锁</button><button class="btn btn-ghost" data-action="go-schools">继续逛院校库</button></div>' +
        '</div>' +
      '</div>';
    }
    const schools = Array.from(state.favorites).map((id) => findSchool(id)).filter(Boolean);
    return '<div class="fav-toolbar"><div><h2>已收藏的院校</h2><p>收藏只保存在本机浏览器中，换一台电脑不会同步。</p></div>' + (schools.length ? '<button class="btn btn-ghost btn-sm" data-action="clear-favs">' + icon('close') + '清空收藏</button>' : '') + '</div>' +
      (schools.length
        ? '<div class="fav-grid">' + schools.map((school) => schoolCardHtml(school)).join('') + '</div>'
        : '<div class="empty-state" style="background:#fff;border:1px solid var(--line);border-radius:17px"><div class="empty-illustration">' + icon('heart') + '</div><h3>还没有收藏的院校</h3><p>在智能填报或院校库中点击心形按钮，就能把心仪院校集中到这里。</p><div class="rec-actions"><button class="btn btn-soft" data-action="go-schools">' + icon('school') + '去院校库逛逛</button></div></div>') +
      '<div class="notice-bar">' + icon('lock') + '<span>收藏与登录状态都存储在本机浏览器，不会上传到服务器。</span></div>';
  }

  function toggleFavorite(id) {
    if (!state.user) {
      openLogin('登录后即可收藏院校，游客模式暂不支持收藏。');
      return;
    }
    const schoolId = Number(id);
    const added = !state.favorites.has(schoolId);
    if (added) state.favorites.add(schoolId);
    else state.favorites.delete(schoolId);
    saveFavorites();
    document.querySelectorAll('[data-action="fav"][data-school="' + schoolId + '"]').forEach((button) => {
      button.classList.toggle('on', added);
      button.setAttribute('aria-pressed', String(added));
      button.setAttribute('aria-label', added ? '取消收藏' : '收藏');
    });
    const modalLabel = document.getElementById('modal-fav-label');
    if (modalLabel) modalLabel.textContent = added ? '已收藏' : '加入收藏';
    showToast(added ? '已加入收藏' : '已取消收藏');
    if (state.route === 'favorites' && !document.querySelector('.modal-backdrop')) {
      renderRoute();
    }
  }

  /* ---------------- About ---------------- */
  function aboutHtml() {
    const meta = DATA.meta;
    return '<section class="about-hero"><div><h2>志愿星图</h2><p>一个面向高考志愿填报场景的离线查询与推荐工具。支持按省份、选科类别查询院校及分专业录取分数，并根据考生分数生成最多 96 个“冲刺—稳妥—保底”专业志愿梯度。</p></div><div class="about-version"><b>v' + escapeHtml(meta.version) + '</b><span>REAL DATA EDITION</span></div></section>' +
      '<div class="about-grid">' +
        '<div class="about-card"><h3>推荐逻辑</h3><p>不是简单按分数排序，而是把分数、历年最低分、变化趋势和院校层次放在一起估算。</p><div class="algo-list">' +
          '<div class="algo-item"><span class="algo-num">01</span><div><strong>分数换算位次</strong><p>优先使用 2025 年官方一分一段表，缺失时按省份批次线与考生人数估算。</p></div></div>' +
          '<div class="algo-item"><span class="algo-num">02</span><div><strong>分专业对照</strong><p>用 2025 年各专业的最低分、最低位次和录取人数逐项比较，不再只看院校最低分。</p></div></div>' +
          '<div class="algo-item"><span class="algo-num">03</span><div><strong>概率估算</strong><p>使用专业最低分与考生分数的差值估算录取概率，并限制在 1%–99%。</p></div></div>' +
          '<div class="algo-item"><span class="algo-num">04</span><div><strong>冲稳保分段</strong><p>按专业分数区间选取，再按概率从低到高排列；每校最多保留 2 个专业，避免过度集中。</p></div></div>' +
        '</div></div>' +
        '<div>' +
          '<div class="about-card disclaimer-card"><h3>数据说明（请务必阅读）</h3><p>本系统已替换为公开真实录取数据，但仍不是教育考试院官方填报系统。</p><ul class="disclaimer-list"><li>2025 年数据来自掌上高考公开录取数据；2023–2024 年来自 GaokaoCompass 对各省教育考试院公开投档线的整理。</li><li>部分省份/年份/专业存在缺漏，页面以“—”显示；少数省份真实本科院校不足 96 所，不做虚构填充。</li><li>录取概率为估算值，不代表真实录取结果，不能作为正式志愿填报依据。正式填报请以各省教育考试院、招生计划汇编和高校招生章程为准。</li></ul></div>' +
          '<div class="about-card" style="margin-top:14px"><h3>访问与权限</h3><p>默认游客模式，打开即可使用，不需要登录；可生成完整 96 个专业志愿。登录后解锁全部分专业明细、收藏和打印。系统内置 3 个管理员账号，密码为账号后四位，账号清单见软件目录下的《使用说明.txt》。登录状态使用 sessionStorage 保存，关闭窗口后恢复游客模式。</p><div class="about-meta"><div><span>收录院校</span><b>' + meta.schoolCount + ' 所</b></div><div><span>省份</span><b>' + meta.provinceCount + ' 个</b></div><div><span>分专业记录</span><b>' + formatNumber(meta.majorCount) + ' 条</b></div></div></div>' +
        '</div>' +
      '</div>' +
      '<div class="notice-bar">' + icon('shield') + '<span>技术栈：原生 HTML / CSS / JavaScript，无外部依赖；数据文件位于 assets/data.js，可离线运行。</span></div>';
  }

  /* ---------------- Detail modal ---------------- */
  function openDetail(schoolId) {
    const school = findSchool(schoolId);
    if (!school) return;
    ensureProfileTrack();
    state.detail = {
      schoolId: school.id,
      provinceId: state.profile.provinceId,
      trackId: state.profile.trackId
    };
    renderModal();
    document.body.classList.add('modal-open');
    setTimeout(() => {
      const close = document.querySelector('.modal-close');
      if (close) close.focus();
    }, 80);
  }

  function closeModal() {
    const root = document.getElementById('modal-root');
    if (root) root.innerHTML = '';
    state.detail = null;
    document.body.classList.remove('modal-open');
  }

  function renderModal() {
    const root = document.getElementById('modal-root');
    if (!root || !state.detail) return;
    const school = findSchool(state.detail.schoolId);
    if (!school) { closeModal(); return; }
    const province = provinceById(state.detail.provinceId);
    const track = ENGINE.getTrack(province, state.detail.trackId);
    state.detail.provinceId = province.id;
    state.detail.trackId = track.id;
    const rows = getSchoolRows(school, province.id, track.id);
    const majorRows = ENGINE.getMajors(DATA, school.id, province.id, track.id);
    const latest = rows[0];
    const old = rows[rows.length - 1];
    const delta = latest && old ? latest.min - old.min : 0;
    const favorite = state.favorites.has(school.id);

    const stats = latest ? '<div class="detail-stats">' +
      '<div class="detail-stat"><span>' + latest.year + ' 最低分</span><b>' + latest.min + '</b><small>分</small>' + (delta ? '<small class="' + (delta > 0 ? 'up' : 'down') + '">较 ' + old.year + ' ' + (delta > 0 ? '+' : '') + delta + '</small>' : '') + '</div>' +
      '<div class="detail-stat"><span>最低位次</span><b>' + formatNumber(latest.rank) + '</b></div>' +
      '<div class="detail-stat"><span>平均分</span><b>' + (latest.avg == null ? '—' : latest.avg) + '</b>' + (latest.avg == null ? '' : '<small>分</small>') + '</div>' +
      '<div class="detail-stat"><span>录取人数</span><b>' + (latest.plan == null ? '—' : formatNumber(latest.plan)) + '</b>' + (latest.plan == null ? '' : '<small>人</small>') + '</div>' +
    '</div>' : '<div class="rec-empty">该省份与选科组合暂无可展示数据。</div>';

    root.innerHTML = '<div class="modal-backdrop" data-action="close-modal">' +
      '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">' +
        '<div class="modal-head">' +
          '<div class="modal-title-row"><div class="school-emblem">' + escapeHtml(school.name.slice(0, 1)) + '</div><div><h2 id="modal-title">' + escapeHtml(school.name) + '</h2><div class="modal-title-meta">' + tagsHtml(school, 3) + '<span>' + escapeHtml(locationText(school)) + '</span><span class="dot-sep"></span><span>' + escapeHtml(school.type) + '</span><span class="dot-sep"></span><span>' + escapeHtml(school.nature) + '</span></div></div></div>' +
          '<button class="modal-close" data-action="close-modal" aria-label="关闭详情">' + icon('close') + '</button>' +
        '</div>' +
        '<div class="modal-body">' +
          '<div class="detail-context"><div class="detail-context-left"><span>查询口径</span><select class="select" data-change="detail-province">' + provinceOptions(province.id) + '</select><select class="select" data-change="detail-track">' + trackOptions(province, track.id) + '</select></div><button class="btn btn-soft btn-sm" data-action="fav" data-school="' + school.id + '" aria-pressed="' + favorite + '">' + icon('heart') + '<span id="modal-fav-label">' + (favorite ? '已收藏' : '加入收藏') + '</span></button></div>' +
          stats +
          (majorRows.length ? majorTableHtml(majorRows, province, track) : '<div class="detail-note">' + icon('info') + '<span>该院校在本省暂无分专业录取数据。</span></div>') +
          (rows.length > 1 ? chartCard(rows, province, track) : '') +
          (rows.length ? dataTable(rows) : '') +
          '<div class="detail-note">' + icon('info') + '<span>以上为 ' + escapeHtml(province.name) + ' · ' + escapeHtml(track.name) + ' 的公开录取数据整理。最低分为该校各普通类专业组的最低值，可能来自护理等专业组；部分年份或字段缺失以“—”显示。正式填报请以官方一分一段表和招生计划为准。</span></div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function majorTableHtml(majorRows, province, track) {
    const isMember = !!state.user;
    const visible = isMember ? majorRows : majorRows.slice(0, 6);
    const hidden = majorRows.length - visible.length;
    return '<div class="major-card"><div class="chart-head"><div><h3>2025 分专业录取</h3><p>' + escapeHtml(province.name) + ' · ' + escapeHtml(track.name) + ' · 共 ' + majorRows.length + ' 个专业' + (!isMember && hidden > 0 ? ' · 游客展示前 6 个' : '') + '</p></div><span class="tag tag-ghost">按最低分排序</span></div>' +
      '<div class="major-table-wrap"><table class="data-table major-table"><thead><tr><th>专业组</th><th>专业</th><th>选科要求</th><th>最低分</th><th>平均分</th><th>最低位次</th><th>录取</th></tr></thead><tbody>' +
        visible.map((major) => '<tr><td>' + escapeHtml(major.group || '—') + '</td><td class="major-name-cell">' + escapeHtml(major.name) + '</td><td class="major-subject-cell">' + escapeHtml(major.subject || '—') + '</td><td>' + major.min + '</td><td>' + (major.avg == null ? '—' : major.avg) + '</td><td>' + formatNumber(major.rank) + '</td><td>' + (major.plan == null ? '—' : formatNumber(major.plan)) + '</td></tr>').join('') +
      '</tbody></table></div>' +
      (!isMember && hidden > 0 ? '<div class="major-locked"><div class="major-locked-icon">' + icon('lock') + '</div><div><strong>还有 ' + hidden + ' 个专业未展示</strong><span>登录后可查看完整分专业明细、平均分、位次和录取人数。</span></div><button class="btn btn-primary btn-sm" data-action="open-login" data-prompt="登录后即可查看全部 ' + majorRows.length + ' 个分专业明细。">登录查看全部</button></div>' : '') +
    '</div>';
  }

  function chartCard(rows, province, track) {
    return '<div class="chart-card"><div class="chart-head"><div><h3>历年录取走势</h3><p>' + escapeHtml(province.name) + ' · ' + escapeHtml(track.name) + ' · 最低分 / 省控线</p></div><div class="chart-legend"><span class="legend-item"><i class="legend-line"></i>最低分</span><span class="legend-item"><i class="legend-line dash"></i>省控线</span></div></div>' + chartSvg(rows) + '</div>';
  }

  function chartSvg(rows) {
    const data = rows.slice().reverse();
    if (!data.length) return '';
    const narrow = window.innerWidth < 700;
    const W = narrow ? 420 : 840;
    const H = narrow ? 250 : 220;
    const padL = narrow ? 38 : 48;
    const padR = narrow ? 18 : 28;
    const padT = narrow ? 27 : 28;
    const padB = narrow ? 38 : 36;
    const values = [];
    data.forEach((row) => { values.push(row.min); if (row.line != null) values.push(row.line); });
    let min = Math.min.apply(null, values);
    let max = Math.max.apply(null, values);
    min = Math.floor((min - 8) / 10) * 10;
    max = Math.ceil((max + 8) / 10) * 10;
    if (max - min < 30) { const mid = (max + min) / 2; min = Math.floor((mid - 15) / 10) * 10; max = Math.ceil((mid + 15) / 10) * 10; }
    const x = (index) => padL + index * (W - padL - padR) / Math.max(1, data.length - 1);
    const y = (value) => padT + (max - value) / (max - min) * (H - padT - padB);
    let grid = '';
    for (let i = 0; i < 4; i += 1) {
      const value = max - (max - min) * i / 3;
      const yy = y(value);
      grid += '<line class="chart-axis" x1="' + padL + '" y1="' + yy.toFixed(1) + '" x2="' + (W - padR) + '" y2="' + yy.toFixed(1) + '"></line>';
      grid += '<text class="chart-label" x="' + (padL - 9) + '" y="' + (yy + 3).toFixed(1) + '" text-anchor="end">' + Math.round(value) + '</text>';
    }
    const minPoints = data.map((row, index) => [x(index), y(row.min)]);
    const linePoints = data.map((row, index) => (row.line == null ? null : [x(index), y(row.line)]));
    const minPath = minPoints.map((point, index) => (index ? 'L' : 'M') + point[0].toFixed(1) + ' ' + point[1].toFixed(1)).join(' ');
    const validLine = linePoints.filter(Boolean);
    const linePath = validLine.length > 1
      ? validLine.map((point, index) => (index ? 'L' : 'M') + point[0].toFixed(1) + ' ' + point[1].toFixed(1)).join(' ')
      : '';
    const areaPath = minPath + ' L' + minPoints[minPoints.length - 1][0].toFixed(1) + ' ' + (H - padB) + ' L' + minPoints[0][0].toFixed(1) + ' ' + (H - padB) + ' Z';
    let dots = '';
    data.forEach((row, index) => {
      const p = minPoints[index];
      const lp = linePoints[index];
      dots += '<circle class="chart-dot" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="4"></circle>';
      dots += '<text class="chart-value" x="' + p[0].toFixed(1) + '" y="' + (p[1] - 10).toFixed(1) + '" text-anchor="middle">' + row.min + '</text>';
      if (lp) {
        dots += '<circle class="chart-dot-line" cx="' + lp[0].toFixed(1) + '" cy="' + lp[1].toFixed(1) + '" r="3"></circle>';
        dots += '<text class="chart-value line-value" x="' + lp[0].toFixed(1) + '" y="' + (lp[1] + 15).toFixed(1) + '" text-anchor="middle">' + row.line + '</text>';
      }
      dots += '<text class="chart-label" x="' + p[0].toFixed(1) + '" y="' + (H - 12) + '" text-anchor="middle">' + row.year + ' 年</text>';
    });
    return '<div class="chart-wrap"><svg class="detail-chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="历年最低分与省控线走势">' +
      '<defs><linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2c5cf6" stop-opacity=".18"/><stop offset="100%" stop-color="#2c5cf6" stop-opacity="0"/></linearGradient></defs>' +
      grid +
      '<path class="chart-area" d="' + areaPath + '"></path>' +
      '<path d="' + minPath + '" fill="none" stroke="#2c5cf6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>' +
      (linePath ? '<path d="' + linePath + '" fill="none" stroke="#b8c3d3" stroke-width="1.8" stroke-dasharray="5 5" stroke-linecap="round"></path>' : '') +
      dots +
    '</svg></div>';
  }

  function dataTable(rows) {
    return '<div class="data-table-wrap"><table class="data-table"><thead><tr><th>年份</th><th>最低分</th><th>平均分</th><th>最低位次</th><th>省控线</th><th>线差</th><th>录取</th></tr></thead><tbody>' +
      rows.map((row) => {
        const diff = row.line == null ? null : row.min - row.line;
        return '<tr><td>' + row.year + '</td><td>' + row.min + '</td><td>' + (row.avg == null ? '—' : row.avg) + '</td><td>' + formatNumber(row.rank) + '</td><td>' + (row.line == null ? '—' : row.line) + '</td><td class="' + (diff == null ? '' : (diff >= 0 ? 'delta-up' : 'delta-down')) + '">' + (diff == null ? '—' : (diff > 0 ? '+' : '') + diff) + '</td><td>' + (row.plan == null ? '—' : formatNumber(row.plan)) + '</td></tr>';
      }).join('') +
    '</tbody></table></div>';
  }

  /* ---------------- Events ---------------- */
  function handleSubmit(event) {
    const form = event.target.closest('form[data-form]');
    if (!form) return;
    event.preventDefault();
    if (form.dataset.form === 'entry-login') {
      handleEntryLogin(form);
      return;
    }
    if (form.dataset.form === 'login') {
      handleLogin(form);
      return;
    }
    const province = ENGINE.getProvince(DATA, form.elements.provinceId.value);
    const track = ENGINE.getTrack(province, form.elements.trackId.value);
    const input = form.querySelector('[name="score"]');
    const raw = String(input && input.value || '').trim();
    if (!raw) {
      showToast('请先输入高考分数');
      if (input) input.focus();
      return;
    }
    const score = Number(raw);
    if (!Number.isFinite(score) || score < 0 || score > province.maxScore) {
      showToast('请输入 0–' + province.maxScore + ' 之间的有效分数');
      if (input) input.focus();
      return;
    }
    state.profile = { provinceId: province.id, trackId: track.id, score: String(Math.round(score)) };
    saveProfile();
    state.recommend = ENGINE.recommend(DATA, { provinceId: province.id, trackId: track.id, score: Math.round(score), count: 96 });
    state.recFilter = { tier: 'all', q: '' };
    if (state.route === 'recommend') {
      renderRoute();
    } else {
      navigate('recommend');
    }
    showToast('已生成 ' + state.recommend.items.length + ' 个专业志愿');
  }

  function handleClick(event) {
    const target = event.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    if (action === 'enter-guest') {
      event.preventDefault();
      enterGuest();
      return;
    }
    if (action === 'entry-login') {
      event.preventDefault();
      state.entryMode = 'login';
      state.entryError = '';
      renderEntry();
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
    if (action === 'entry-back') {
      event.preventDefault();
      state.entryMode = 'choice';
      state.entryError = '';
      state.entryBusy = false;
      renderEntry();
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
    if (action === 'scroll-schools') {
      event.preventDefault();
      const schools = document.querySelector('.entry-schools');
      if (schools) schools.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (action === 'show-entry') {
      event.preventDefault();
      if (state.user && !window.confirm('切换进入方式会退出当前登录，确定吗？')) return;
      showEntry();
      return;
    }
    if (action === 'close-modal') {
      if (target.classList.contains('modal-backdrop') && event.target !== target) return;
      closeModal();
      return;
    }
    if (action === 'close-login') {
      if (target.classList.contains('login-overlay') && event.target !== target) return;
      closeLogin();
      return;
    }
    if (action === 'open-login') {
      event.preventDefault();
      openLogin(target.dataset.prompt || '');
      return;
    }
    if (action === 'logout') {
      event.preventDefault();
      logout();
      return;
    }
    if (action === 'login-help') {
      event.preventDefault();
      showToast('请联系管理员重置密码，初始密码为账号后四位。');
      return;
    }
    if (action === 'detail') {
      event.preventDefault();
      openDetail(target.dataset.school);
      return;
    }
    if (action === 'fav') {
      event.preventDefault();
      event.stopPropagation();
      if (!state.user) {
        openLogin('登录后即可收藏院校，游客模式暂不支持收藏。');
        return;
      }
      toggleFavorite(target.dataset.school);
      return;
    }
    if (action === 'go-schools') {
      event.preventDefault();
      navigate('schools');
      return;
    }
    if (action === 'filter-tier') {
      event.preventDefault();
      state.recFilter.tier = target.dataset.tier || 'all';
      renderRoute();
      return;
    }
    if (action === 'print') {
      event.preventDefault();
      if (!state.user) {
        openLogin('登录后即可打印或保存 PDF，游客模式仅支持在线查看。');
        return;
      }
      window.print();
      return;
    }
    if (action === 'lib-page') {
      event.preventDefault();
      const page = Number(target.dataset.page);
      const pages = Math.max(1, Math.ceil(filteredSchoolList().length / state.library.pageSize));
      if (!Number.isFinite(page) || page < 1 || page > pages) return;
      state.library.page = page;
      refreshLibraryResults();
      const results = document.getElementById('library-results');
      if (results) {
        const top = results.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: 'smooth' });
      }
      return;
    }
    if (action === 'clear-favs') {
      event.preventDefault();
      if (state.favorites.size && window.confirm('确定要清空全部收藏吗？')) {
        state.favorites.clear();
        saveFavorites();
        renderRoute();
        showToast('收藏已清空');
      }
    }
  }

  function handleChange(event) {
    const change = event.target.dataset.change;
    if (!change) return;
    if (change === 'quick-province' || change === 'rec-province') {
      const scoreInput = document.querySelector('[data-bind="score"]');
      if (scoreInput) state.profile.score = scoreInput.value;
      const province = ENGINE.getProvince(DATA, event.target.value);
      const track = ENGINE.getTrack(province, state.profile.trackId);
      state.profile.provinceId = province.id;
      state.profile.trackId = track.id;
      saveProfile();
      if (change === 'rec-province') state.recommend = null;
      renderRoute();
      return;
    }
    if (change === 'quick-track' || change === 'rec-track') {
      state.profile.trackId = event.target.value;
      saveProfile();
      if (change === 'rec-track') state.recommend = null;
      updateChrome();
      if (change === 'rec-track') renderRoute();
      return;
    }
    if (change === 'lib-context-province') {
      const province = ENGINE.getProvince(DATA, event.target.value);
      state.profile.provinceId = province.id;
      state.profile.trackId = ENGINE.getTrack(province, state.profile.trackId).id;
      saveProfile();
      renderRoute();
      return;
    }
    if (change === 'lib-context-track') {
      state.profile.trackId = event.target.value;
      saveProfile();
      renderRoute();
      return;
    }
    if (change === 'lib-province') { state.library.province = event.target.value; state.library.page = 1; refreshLibraryResults(); return; }
    if (change === 'lib-level') { state.library.level = event.target.value; state.library.page = 1; refreshLibraryResults(); return; }
    if (change === 'lib-type') { state.library.type = event.target.value; state.library.page = 1; refreshLibraryResults(); return; }
    if (change === 'lib-sort') { state.library.sort = event.target.value; state.library.page = 1; refreshLibraryResults(); return; }
    if (change === 'detail-province') {
      if (!state.detail) return;
      const province = ENGINE.getProvince(DATA, event.target.value);
      state.detail.provinceId = province.id;
      state.detail.trackId = ENGINE.getTrack(province, state.detail.trackId).id;
      renderModal();
      return;
    }
    if (change === 'detail-track') {
      if (!state.detail) return;
      state.detail.trackId = event.target.value;
      renderModal();
    }
  }

  function handleInput(event) {
    const bind = event.target.dataset.bind;
    if (bind === 'score') {
      state.profile.score = event.target.value;
      saveProfileSoon();
      return;
    }
    if (event.target.id === 'rec-search') {
      state.recFilter.q = event.target.value;
      clearTimeout(recSearchTimer);
      recSearchTimer = setTimeout(refreshRecResults, 120);
      return;
    }
    if (event.target.id === 'lib-search') {
      state.library.q = event.target.value;
      state.library.page = 1;
      clearTimeout(libSearchTimer);
      libSearchTimer = setTimeout(refreshLibraryResults, 140);
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      if (state.entry && state.entryMode === 'login') {
        state.entryMode = 'choice';
        state.entryError = '';
        state.entryBusy = false;
        renderEntry();
      } else if (document.querySelector('.login-overlay')) closeLogin();
      else if (document.querySelector('.modal-backdrop')) closeModal();
      return;
    }
    if (event.key === 'Enter' && event.target.matches('[data-action="detail"]')) {
      event.preventDefault();
      openDetail(event.target.dataset.school);
    }
  }

  function bind() {
    document.addEventListener('click', handleClick);
    document.addEventListener('submit', handleSubmit);
    document.addEventListener('change', handleChange);
    document.addEventListener('input', handleInput);
    document.addEventListener('keydown', handleKeyDown);
  }

  /* ---------------- Boot ---------------- */
  function boot() {
    ensureToast();
    try {
      const lastId = localStorage.getItem('gkzy.lastId');
      if (lastId) state.loginId = lastId;
    } catch (err) { /* ignore */ }
    restoreSession();
    ensureProfileTrack();
    if (state.user) {
      if (!location.hash || location.hash === '#/login' || !ROUTE_KEYS.includes(location.hash.replace('#/', ''))) {
        history.replaceState(null, '', '#/home');
      }
      state.route = routeFromHash();
      renderShell();
    } else {
      if (location.hash === '#/login') state.entryMode = 'login';
      renderEntry();
    }
    bind();
  }

  boot();
})();





