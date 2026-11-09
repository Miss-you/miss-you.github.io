// Shared header appearance only. Never read, store or transmit page input.
(() => {
  'use strict';
  const settings = document.currentScript.dataset;
  const isolated = settings.isolated === 'true';
  const root = document.documentElement;
  const defaultTheme = settings.defaultTheme;
  const preferredDark = () => {
    let preference;
    try {
      preference = localStorage.getItem('pref-theme');
    } catch {
      // Privacy settings may disable storage; appearance still works in memory.
    }
    return preference === 'dark' || (preference !== 'light' &&
      (defaultTheme === 'dark' || (defaultTheme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches)));
  };
  const applyAppearance = dark => {
    root.dataset.theme = dark ? 'dark' : 'light';
    document.body?.classList.toggle('dark', dark);
  };
  applyAppearance(preferredDark());

  // A restored document may predate a preference change on another page/tab.
  window.addEventListener('pageshow', event => {
    if (event.persisted) applyAppearance(preferredDark());
  });
  window.addEventListener('storage', event => {
    if (event.key === 'pref-theme') applyAppearance(preferredDark());
  });

  const initialize = () => {
    const button = document.getElementById('theme-toggle');
    if (isolated) {
      // Match the comparator's refusal to initialize inside any frame.
      if (window.top !== window.self) return;
      if (button) {
        button.disabled = false;
        button.addEventListener('click', () => {
          const dark = !document.body.classList.contains('dark');
          applyAppearance(dark);
          try {
            localStorage.setItem('pref-theme', dark ? 'dark' : 'light');
          } catch {
            // Do not let blocked storage prevent a local appearance change.
          }
        });
      }
    } else if (typeof MutationObserver === 'function') {
      // PaperMod's footer owns ordinary-page theme clicks. Do not install a
      // second click handler or fork the vendored footer just for navigation.
      new MutationObserver(() => {
        root.dataset.theme = document.body.classList.contains('dark') ? 'dark' : 'light';
      }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }

    const menu = document.getElementById('site-menu');
    const selected = menu?.querySelector('[aria-current]');
    if (selected && menu.scrollWidth > menu.clientWidth) {
      // Scroll only the menu, preserving article anchors and page position.
      menu.scrollLeft = selected.offsetLeft - menu.offsetLeft - 16;
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
