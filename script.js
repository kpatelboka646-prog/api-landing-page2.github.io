// script.js — API Studio V5
// fixes: reliable full-page dark flip on mobile, persistent theme, meta theme-color update, accessible toggle

(function () {
  const THEME_KEY = 'api_studio_theme_v5';
  const body = document.body;
  const html = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const metaTheme = document.getElementById('meta-theme-color');

  // Apply theme 'light' or 'dark' (dark = noir)
  function applyTheme(name) {
    if (name === 'dark') {
      html.classList.add('theme-dark');      // update html too (full coverage)
      body.classList.add('theme-dark');
      body.classList.remove('theme-light');
      toggle.textContent = 'Light';
      toggle.setAttribute('aria-pressed', 'true');
      // update mobile address-bar color
      if (metaTheme) metaTheme.setAttribute('content', '#0b0b0b');
    } else {
      html.classList.remove('theme-dark');
      body.classList.remove('theme-dark');
      body.classList.add('theme-light');
      toggle.textContent = 'Dark';
      toggle.setAttribute('aria-pressed', 'false');
      if (metaTheme) metaTheme.setAttribute('content', '#ffffff');
    }
    try { localStorage.setItem(THEME_KEY, name); } catch (e) { /* ignore storage failures */ }
  }

  // Initialize theme from localStorage or OS preference
  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) { saved = null; }
    if (saved === 'dark' || saved === 'light') {
      applyTheme(saved);
      return;
    }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  // Toggle handler
  toggle.addEventListener('click', () => {
    const isDark = body.classList.contains('theme-dark');
    applyTheme(isDark ? 'light' : 'dark');

    // quick micro animation for feedback
    try {
      toggle.animate([{ transform: 'scale(.98)' }, { transform: 'scale(1)' }], { duration: 120, easing: 'ease-out' });
    } catch(e) {}
  });

  // keyboard access
  toggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle.click();
    }
  });

  // Prevent partial-screen flash: set initial background asap (runs before DOMContentComplete)
  (function preflight() {
    const saved = (function(){ try { return localStorage.getItem(THEME_KEY); } catch(e) { return null; } })();
    if (saved === 'dark') {
      document.documentElement.classList.add('theme-dark');
      document.body.classList.add('theme-dark');
      if (metaTheme) metaTheme.setAttribute('content', '#0b0b0b');
    } else {
      document.documentElement.classList.remove('theme-dark');
      document.body.classList.remove('theme-dark');
      if (metaTheme) metaTheme.setAttribute('content', '#ffffff');
    }
  })();

  // init when script runs
  initTheme();

  // Expose small dev API
  window.APIS_STUDIO_V5 = {
    setTheme: (t) => applyTheme(t === 'dark' ? 'dark' : 'light'),
    getTheme: () => (document.body.classList.contains('theme-dark') ? 'dark' : 'light')
  };
})();
