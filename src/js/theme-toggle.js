(function () {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');

  function updateToggle() {
    const isDark = root.getAttribute('data-theme') === 'dark';
    const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    toggle.setAttribute('aria-label', label);
    toggle.setAttribute('title', label);
    const icon = toggle.querySelector('.theme-icon');
    if (icon) icon.style.filter = isDark ? 'invert(1)' : 'none';
    const sr = toggle.querySelector('.sr-only');
    if (sr) sr.textContent = label;
  }

  root.setAttribute('data-theme', theme);
  updateToggle();

  toggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateToggle();
  });
})();
