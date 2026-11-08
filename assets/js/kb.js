(() => {
  const sidebar = document.querySelector('.kb-sidebar');
  if (!sidebar) return;

  const compact = window.matchMedia('(max-width: 760px)');
  const setSidebar = () => { sidebar.open = !compact.matches; };
  setSidebar();
  compact.addEventListener('change', setSidebar);

  const index = document.querySelector('[data-kb-index]');
  if (!index) return;

  const input = document.getElementById('kb-search');
  const counter = document.getElementById('kb-result-count');
  const empty = document.getElementById('kb-empty');
  const reset = document.getElementById('kb-reset');
  const topicLinks = [...sidebar.querySelectorAll('[data-kb-topic]')];
  const rows = [...index.querySelectorAll('[data-kb-url]')];
  const notes = JSON.parse(document.getElementById('kb-search-data').textContent);
  const normalize = value => value.normalize('NFKC').toLocaleLowerCase();
  const searchable = new Map(notes.map(note => [note.url, normalize([
    note.title, note.summary, note.topic, ...note.tags, note.content,
  ].join(' '))]));
  const knownTopics = new Set(notes.map(note => note.topic));
  let topic = '';

  function render() {
    const terms = normalize(input.value).trim().split(/\s+/).filter(Boolean);
    let count = 0;
    rows.forEach(row => {
      const text = searchable.get(row.dataset.kbUrl) || '';
      const matches = (!topic || row.dataset.kbEntryTopic === topic)
        && terms.every(term => text.includes(term));
      row.hidden = !matches;
      if (matches) count += 1;
    });
    topicLinks.forEach(link => {
      const active = link.dataset.kbTopic === topic;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    counter.textContent = count === 1
      ? counter.dataset.singular
      : counter.dataset.template.replace('{count}', count);
    empty.hidden = count > 0;
    reset.hidden = !topic && !input.value;
  }

  function saveLocation(push) {
    const url = new URL(window.location.href);
    if (topic) url.searchParams.set('topic', topic);
    else url.searchParams.delete('topic');
    if (input.value) url.searchParams.set('q', input.value);
    else url.searchParams.delete('q');
    if (push) window.history.pushState(null, '', url);
    else window.history.replaceState(null, '', url);
  }

  function restoreLocation() {
    const params = new URLSearchParams(window.location.search);
    topic = knownTopics.has(params.get('topic')) ? params.get('topic') : '';
    input.value = params.get('q') || '';
    render();
  }

  topicLinks.forEach(link => link.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    topic = link.dataset.kbTopic;
    render();
    saveLocation(true);
    if (compact.matches) sidebar.open = false;
  }));
  input.addEventListener('input', () => { render(); saveLocation(false); });
  reset.addEventListener('click', () => {
    topic = '';
    input.value = '';
    render();
    saveLocation(false);
    input.focus();
  });
  window.addEventListener('popstate', restoreLocation);
  restoreLocation();
})();
