// YDD: consume share fragments locally before the tool initializes. No network.
(() => {
  const take = () => {
    if (!location.hash.startsWith('#v')) return false;
    window.__shareHash = location.hash;
    history.replaceState(null, '', location.pathname + location.search);
    return true;
  };
  take();
  const onNavigation = () => {
    if (take()) window.dispatchEvent(new Event('sharelink'));
  };
  window.addEventListener('popstate', onNavigation);
  window.addEventListener('hashchange', onNavigation);
})();
