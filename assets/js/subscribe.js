const feeds = document.querySelector('[data-subscribe]');

for (const row of feeds.querySelectorAll('li')) {
  const link = row.querySelector('a');
  const button = row.querySelector('button');
  const status = row.querySelector('[role="status"]');

  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(link.href);
      status.textContent = feeds.dataset.copied;
    } catch {
      link.focus();
      window.getSelection()?.selectAllChildren(link);
      status.textContent = feeds.dataset.copyFailed;
    }
  });

  button.hidden = false;
}
