import { LIMITS } from './engine.mjs';

const workspace = document.getElementById('workspace');
const en = workspace.dataset.lang === 'en';
const message = en ? {
  ready: 'Ready. Paste two texts, or try the example.',
  changed: 'Text or options changed. Compare again to update the result.',
  working: 'Comparing locally…', rendering: 'Preparing comparison…', cancelled: 'Comparison cancelled.',
  cleared: 'Both texts and the result have been cleared.', timeout: 'Comparison exceeded 5 seconds and was stopped. Try a shorter text.',
  unavailable: 'The local worker could not start. Reload this page in a current browser to retry.',
  failed: 'Comparison failed. Try a shorter text or reload the page.',
  limit: 'Each side supports at most 200,000 characters and 3,000 lines. Nothing was truncated; shorten the input to compare.',
  pasteLimit: 'This paste would exceed 200,000 characters, so it was not inserted. Use a smaller selection.',
  identical: 'No differences under the current comparison rules.', empty: 'Both texts are empty.',
  coarse: ' Large changes are shown as whole-region changes; alignment and counts may be less precise.',
  detail: ' Some long or complex lines are highlighted as whole regions.',
  copied: 'Text copied to clipboard.', copyFailed: 'Clipboard access was unavailable. Text selected; copy it manually.',
  blank: '(empty line)', chars: 'characters', lines: 'lines',
  summary: (added, removed, groups) => `${groups} change block(s) · − ${removed} removed line(s) · + ${added} added line(s)`,
  position: (index, total) => `${index} / ${total}`,
} : {
  ready: '准备就绪。粘贴两份文本，或先试用示例。',
  changed: '文本或选项已修改，请重新对比。',
  working: '正在本地对比…', rendering: '正在准备对比结果…', cancelled: '已取消对比。',
  cleared: '两侧文本和对比结果已清空。', timeout: '计算超过 5 秒，已停止。请缩短文本后重试。',
  unavailable: '本地计算线程未能启动，请用较新版本的浏览器重新加载此页。',
  failed: '对比未能完成，请缩短文本或重新加载页面后重试。',
  limit: '每侧最多支持 20 万字符、3,000 行。文本未被截断，请缩短后再对比。',
  pasteLimit: '此次粘贴会超过 20 万字符，已阻止插入。请分段选取较短的文本。',
  identical: '按当前比较规则，未发现差异。', empty: '两侧文本均为空。',
  coarse: ' 大幅变化已按整块增删显示，对齐和行数统计可能较粗略。',
  detail: ' 部分超长或复杂行已使用整块高亮。',
  copied: '文本已复制到剪贴板。', copyFailed: '浏览器未允许复制，已选中文本，请手动复制。',
  blank: '（空行）', chars: '字符', lines: '行',
  summary: (added, removed, groups) => `${groups} 处变化 · − 删除 ${removed} 行 · + 新增 ${added} 行`,
  position: (index, total) => `${index} / ${total}`,
};

const left = document.getElementById('left-input');
const right = document.getElementById('right-input');
const status = document.getElementById('status');
const compareButton = document.getElementById('compare');
const cancelButton = document.getElementById('cancel');
const resultSection = document.querySelector('.result-section');
const resultScroll = document.getElementById('result-scroll');
const resultBody = document.getElementById('diff-rows');
const emptyState = document.getElementById('empty-state');
const ignoreWhitespace = document.getElementById('ignore-whitespace');
const wrapLines = document.getElementById('wrap-lines');
const previous = document.getElementById('previous');
const next = document.getElementById('next');
const position = document.getElementById('diff-position');
let worker = null;
let timeout = null;
let revision = 0;
let changes = [];
let selectedChange = -1;

function announce(text, error = false) {
  status.textContent = text;
  status.dataset.error = String(error);
}

function setBusy(busy) {
  compareButton.disabled = busy;
  cancelButton.hidden = !busy;
  resultSection.setAttribute('aria-busy', String(busy));
}

function stopWork() {
  revision++;
  worker?.terminate();
  worker = null;
  clearTimeout(timeout);
  timeout = null;
  setBusy(false);
}

function resetResult() {
  resultBody.replaceChildren();
  changes = [];
  selectedChange = -1;
  previous.disabled = true;
  next.disabled = true;
  position.textContent = '';
  resultScroll.hidden = true;
  emptyState.hidden = false;
}

function updateCounts() {
  for (const [input, id] of [[left, 'left-count'], [right, 'right-count']]) {
    const lines = input.value === '' ? 0 : input.value.split('\n').length;
    document.getElementById(id).textContent = `${input.value.length.toLocaleString()} ${message.chars} · ${lines.toLocaleString()} ${message.lines}`;
  }
}

function invalidate() {
  stopWork();
  resetResult();
  updateCounts();
  announce(message.changed);
}

function createCell(row, side, cell, changed) {
  const number = document.createElement('td');
  number.className = 'line-number';
  number.textContent = cell === null ? '' : String(cell.number);
  number.setAttribute('aria-hidden', 'true');
  const text = document.createElement('td');
  text.className = `line-text ${side}-text`;
  if (cell === null) {
    text.classList.add('absent');
    text.setAttribute('aria-label', en ? 'No corresponding line' : '此侧无对应行');
  } else {
    if (changed) {
      text.classList.add(side === 'left' ? 'removed' : 'added');
      number.textContent = `${side === 'left' ? '−' : '+'} ${cell.number}`;
    }
    if (cell.text === '') {
      const blank = document.createElement('span');
      blank.className = 'empty-line';
      blank.textContent = message.blank;
      text.appendChild(blank);
    } else {
      for (const part of cell.parts) {
        if (part.changed) {
          const mark = document.createElement('mark');
          mark.textContent = part.text;
          text.appendChild(mark);
        } else text.appendChild(document.createTextNode(part.text));
      }
    }
  }
  row.append(number, text);
}

async function renderResult(result, generation) {
  announce(message.rendering);
  const blocks = [];
  let previousChanged = false;
  for (let i = 0; i < result.rows.length; i += 100) {
    if (generation !== revision) return;
    const fragment = document.createDocumentFragment();
    for (const data of result.rows.slice(i, i + 100)) {
      const row = document.createElement('tr');
      const changed = data.kind !== 'equal';
      createCell(row, 'left', data.left, changed);
      createCell(row, 'right', data.right, changed);
      if (changed && !previousChanged) blocks.push(row);
      previousChanged = changed;
      fragment.appendChild(row);
    }
    resultBody.appendChild(fragment);
    // Yield between batches so typing, clearing and cancelling remain responsive.
    await new Promise(resolve => requestAnimationFrame(resolve));
  }
  if (generation !== revision) return;
  changes = blocks;
  resultScroll.hidden = result.rows.length === 0;
  emptyState.hidden = result.rows.length !== 0;
  resultScroll.scrollTop = 0;
  resultScroll.scrollLeft = 0;
  previous.disabled = changes.length === 0;
  next.disabled = changes.length === 0;
  position.textContent = changes.length ? message.position(0, changes.length) : '';
  setBusy(false);
  let summary = result.changed ? message.summary(result.added, result.removed, blocks.length)
    : result.rows.length ? message.identical : message.empty;
  if (result.coarse) summary += message.coarse;
  else if (result.detailLimited) summary += message.detail;
  announce(summary);
}

function compare() {
  stopWork();
  resetResult();
  const inputs = [left.value, right.value];
  if (inputs.some(text => text.length > LIMITS.characters || (text && text.split('\n').length > LIMITS.lines))) {
    announce(message.limit, true);
    return;
  }
  const generation = revision;
  setBusy(true);
  announce(message.working);
  try {
    worker = new Worker(workspace.dataset.worker, { type: 'module' });
    worker.onmessage = ({ data }) => {
      if (generation !== revision) return;
      worker.terminate();
      worker = null;
      clearTimeout(timeout);
      timeout = null;
      if (data.error) {
        stopWork();
        announce(['INPUT_LIMIT', 'LINE_LIMIT'].includes(data.error) ? message.limit : message.failed, true);
        return;
      }
      renderResult(data.result, generation).catch(() => {
        if (generation !== revision) return;
        stopWork();
        resetResult();
        announce(message.failed, true);
      });
    };
    worker.onerror = event => {
      event.preventDefault();
      if (generation !== revision) return;
      stopWork();
      announce(message.unavailable, true);
    };
    timeout = setTimeout(() => {
      if (generation !== revision) return;
      stopWork();
      resetResult();
      announce(message.timeout, true);
    }, 5000);
    worker.postMessage({ left: inputs[0], right: inputs[1], options: { ignoreWhitespace: ignoreWhitespace.checked } });
  } catch {
    stopWork();
    announce(message.unavailable, true);
  }
}

function navigate(direction) {
  if (!changes.length) return;
  changes[selectedChange]?.classList.remove('selected');
  selectedChange = selectedChange === -1 ? (direction > 0 ? 0 : changes.length - 1)
    : (selectedChange + direction + changes.length) % changes.length;
  const target = changes[selectedChange];
  target.classList.add('selected');
  resultScroll.scrollTop = target.offsetTop - resultBody.offsetTop;
  position.textContent = message.position(selectedChange + 1, changes.length);
}

function clearTexts() {
  stopWork();
  left.value = '';
  right.value = '';
  resetResult();
  updateCounts();
  announce(message.cleared);
}

function initialize() {
  for (const input of [left, right]) {
    input.value = '';
    input.addEventListener('input', invalidate);
    input.addEventListener('paste', event => {
      const pasted = event.clipboardData?.getData('text/plain');
      if (pasted !== undefined && input.value.length - (input.selectionEnd - input.selectionStart) + pasted.length > LIMITS.characters) {
        event.preventDefault();
        announce(message.pasteLimit, true);
      }
    });
  }
  document.getElementById('compare').addEventListener('click', compare);
  cancelButton.addEventListener('click', () => {
    stopWork();
    resetResult();
    announce(message.cancelled);
  });
  document.getElementById('swap').addEventListener('click', () => {
    [left.value, right.value] = [right.value, left.value];
    invalidate();
    compare();
  });
  document.getElementById('clear').addEventListener('click', () => { clearTexts(); left.focus(); });
  document.getElementById('example').addEventListener('click', () => {
    left.value = en ? 'Project notes\nStatus: draft\nBudget: 120\nReview before Friday.\n'
      : '项目笔记\n状态：草稿\n预算：120\n周五前完成评审。\n';
    right.value = en ? 'Project notes\nStatus: ready\nBudget: 150\nAdd a privacy check.\nReview before Friday.\n'
      : '项目笔记\n状态：就绪\n预算：150\n新增隐私检查。\n周五前完成评审。\n';
    invalidate();
    compare();
  });
  ignoreWhitespace.addEventListener('change', invalidate);
  wrapLines.addEventListener('change', () => resultScroll.classList.toggle('wrap', wrapLines.checked));
  previous.addEventListener('click', () => navigate(-1));
  next.addEventListener('click', () => navigate(1));
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && !event.isComposing) {
      event.preventDefault();
      compare();
    }
  });
  for (const button of document.querySelectorAll('[data-copy]')) {
    const input = button.dataset.copy === 'left' ? left : right;
    button.setAttribute('aria-label', en ? `Copy ${button.dataset.copy === 'left' ? 'original' : 'modified'} text`
      : `复制${button.dataset.copy === 'left' ? '原始' : '更改后'}文本`);
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(input.value);
        announce(message.copied);
      } catch {
        input.focus();
        input.select();
        announce(message.copyFailed, true);
      }
    });
  }
  document.getElementById('theme-toggle').addEventListener('click', () => {
    document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  });
  // Clear memory and DOM on navigation, including pages retained in the back/forward cache.
  window.addEventListener('pagehide', clearTexts);
  window.addEventListener('pageshow', event => { if (event.persisted) clearTexts(); });
  document.querySelectorAll('button[disabled], textarea[disabled], input[disabled]').forEach(control => { control.disabled = false; });
  previous.disabled = true;
  next.disabled = true;
  updateCounts();
  announce(message.ready);
}

// A meta CSP cannot enforce frame-ancestors. Refuse embedded operation as a
// clickjacking mitigation; deployments should still set that response header.
if (window.top === window.self) initialize();
else announce(en ? 'Open this tool directly to compare text. Embedded use is disabled.'
  : '请直接打开本工具页面使用，嵌入页面中的对比功能已禁用。', true);
