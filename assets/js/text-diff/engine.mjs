// Pure comparison code: no DOM, network, storage or executable user input.
export const LIMITS = Object.freeze({ characters: 200000, lines: 3000 });
const MAX_LINE_WORK = 1000000;
const MAX_TRACE = 120000;
const MAX_CHARACTER_WORK = 400000;

function splitLines(text) {
  if (typeof text !== 'string' || text.length > LIMITS.characters) throw new Error('INPUT_LIMIT');
  const lines = text === '' ? [] : text.replace(/\r\n?/g, '\n').split('\n');
  if (lines.length > LIMITS.lines) throw new Error('LINE_LIMIT');
  return lines;
}

function backtrack(trace, a, b) {
  let x = a.length;
  let y = b.length;
  const operations = [];
  for (let d = trace.length - 1; d >= 0; d--) {
    const v = trace[d];
    const k = x - y;
    const previousK = k === -d || (k !== d && (v.get(k - 1) ?? -1) < (v.get(k + 1) ?? -1)) ? k + 1 : k - 1;
    const previousX = v.get(previousK) ?? 0;
    const previousY = previousX - previousK;
    while (x > previousX && y > previousY) {
      operations.push({ kind: 'equal', a: --x, b: --y });
    }
    if (d > 0) {
      if (x === previousX) operations.push({ kind: 'insert', b: --y });
      else operations.push({ kind: 'delete', a: --x });
    }
  }
  return operations.reverse();
}

function alignLines(a, b) {
  const v = new Map([[1, 0]]);
  const trace = [];
  let work = 0;
  let states = 0;
  for (let d = 0; d <= a.length + b.length; d++) {
    states += v.size;
    if (states > MAX_TRACE) return null;
    trace.push(new Map(v));
    for (let k = -d; k <= d; k += 2) {
      if (++work > MAX_LINE_WORK) return null;
      let x = k === -d || (k !== d && (v.get(k - 1) ?? -1) < (v.get(k + 1) ?? -1))
        ? v.get(k + 1) ?? 0 : (v.get(k - 1) ?? 0) + 1;
      let y = x - k;
      while (x < a.length && y < b.length && a[x] === b[y]) {
        x++;
        y++;
        if (++work > MAX_LINE_WORK) return null;
      }
      v.set(k, x);
      if (x >= a.length && y >= b.length) return backtrack(trace, a, b);
    }
  }
  return null;
}

function appendPart(parts, text, changed) {
  if (!text) return;
  const last = parts.at(-1);
  if (last && last.changed === changed) last.text += text;
  else parts.push({ text, changed });
}

function restoreWhitespace(original, normalizedParts) {
  const output = [];
  let partIndex = 0;
  let offset = 0;
  for (const character of original) {
    if (character === ' ' || character === '\t') {
      appendPart(output, character, false);
      continue;
    }
    while (partIndex < normalizedParts.length && offset >= normalizedParts[partIndex].text.length) {
      offset -= normalizedParts[partIndex++].text.length;
    }
    appendPart(output, character, normalizedParts[partIndex]?.changed ?? true);
    offset += character.length;
  }
  return output;
}

function highlightPair(left, right, budget, ignoreWhitespace = false) {
  const full = () => [[{ text: left, changed: true }], [{ text: right, changed: true }]];
  if (left.length > 4000 || right.length > 4000) {
    budget.limited = true;
    return full();
  }
  if (ignoreWhitespace) {
    const normalized = highlightPair(left.replace(/[\t ]/g, ''), right.replace(/[\t ]/g, ''), budget);
    return [restoreWhitespace(left, normalized[0]), restoreWhitespace(right, normalized[1])];
  }
  const segmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;
  const tokens = text => segmenter ? Array.from(segmenter.segment(text), item => item.segment) : Array.from(text);
  const a = tokens(left);
  const b = tokens(right);
  let start = 0;
  let end = 0;
  while (start < a.length && start < b.length && a[start] === b[start]) start++;
  while (end < a.length - start && end < b.length - start && a[a.length - end - 1] === b[b.length - end - 1]) end++;
  const n = a.length - start - end;
  const m = b.length - start - end;
  const output = [[], []];
  const prefix = a.slice(0, start).join('');
  appendPart(output[0], prefix, false);
  appendPart(output[1], prefix, false);
  if ((n + 1) * (m + 1) > Math.min(160000, budget.remaining)) {
    budget.limited = true;
    appendPart(output[0], a.slice(start, a.length - end).join(''), true);
    appendPart(output[1], b.slice(start, b.length - end).join(''), true);
  } else {
    budget.remaining -= (n + 1) * (m + 1);
    const width = m + 1;
    const dp = new Uint16Array((n + 1) * width);
    for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) {
      dp[i * width + j] = a[start + i] === b[start + j]
        ? 1 + dp[(i + 1) * width + j + 1]
        : Math.max(dp[(i + 1) * width + j], dp[i * width + j + 1]);
    }
    let i = 0;
    let j = 0;
    while (i < n || j < m) {
      if (i < n && j < m && a[start + i] === b[start + j]) {
        appendPart(output[0], a[start + i++], false);
        appendPart(output[1], b[start + j++], false);
      } else if (i < n && (j === m || dp[(i + 1) * width + j] >= dp[i * width + j + 1])) {
        appendPart(output[0], a[start + i++], true);
      } else appendPart(output[1], b[start + j++], true);
    }
  }
  const suffix = end ? a.slice(a.length - end).join('') : '';
  appendPart(output[0], suffix, false);
  appendPart(output[1], suffix, false);
  return output;
}

export function compareTexts(leftText, rightText, options = {}) {
  const left = splitLines(leftText);
  const right = splitLines(rightText);
  const key = text => options.ignoreWhitespace ? text.replace(/[\t ]/g, '') : text;
  const a = left.map(key);
  const b = right.map(key);
  let prefix = 0;
  let suffix = 0;
  while (prefix < a.length && prefix < b.length && a[prefix] === b[prefix]) prefix++;
  while (suffix < a.length - prefix && suffix < b.length - prefix && a[a.length - suffix - 1] === b[b.length - suffix - 1]) suffix++;
  const middleA = a.slice(prefix, a.length - suffix);
  const middleB = b.slice(prefix, b.length - suffix);
  const aligned = alignLines(middleA, middleB);
  const coarse = aligned === null;
  const operations = [];
  for (let i = 0; i < prefix; i++) operations.push({ kind: 'equal', a: i, b: i });
  const middle = aligned ?? [
    ...middleA.map((_, i) => ({ kind: 'delete', a: i })),
    ...middleB.map((_, i) => ({ kind: 'insert', b: i })),
  ];
  for (const op of middle) operations.push({ ...op, a: op.a === undefined ? undefined : op.a + prefix, b: op.b === undefined ? undefined : op.b + prefix });
  for (let i = suffix; i > 0; i--) operations.push({ kind: 'equal', a: a.length - i, b: b.length - i });

  const rows = [];
  const budget = { remaining: MAX_CHARACTER_WORK, parts: 12000, limited: false };
  let added = 0;
  let removed = 0;
  const cell = (text, index, changed = false) => ({ text, number: index + 1, parts: [{ text, changed }] });
  for (let i = 0; i < operations.length;) {
    const op = operations[i];
    if (op.kind === 'equal') {
      rows.push({ kind: 'equal', left: cell(left[op.a], op.a), right: cell(right[op.b], op.b) });
      i++;
      continue;
    }
    const deleted = [];
    const inserted = [];
    while (i < operations.length && operations[i].kind !== 'equal') {
      const current = operations[i++];
      if (current.kind === 'delete') deleted.push(current.a);
      else inserted.push(current.b);
    }
    added += inserted.length;
    removed += deleted.length;
    for (let j = 0; j < Math.max(deleted.length, inserted.length); j++) {
      const l = j < deleted.length ? cell(left[deleted[j]], deleted[j], true) : null;
      const r = j < inserted.length ? cell(right[inserted[j]], inserted[j], true) : null;
      if (l && r && !coarse) {
        const parts = highlightPair(l.text, r.text, budget, options.ignoreWhitespace);
        const count = parts[0].length + parts[1].length;
        if (count <= budget.parts) {
          [l.parts, r.parts] = parts;
          budget.parts -= count;
        } else budget.limited = true;
      }
      rows.push({ kind: 'change', left: l, right: r });
    }
  }
  return { rows, added, removed, changed: rows.filter(row => row.kind !== 'equal').length, coarse, detailLimited: budget.limited };
}
