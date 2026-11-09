import test from 'node:test';
import assert from 'node:assert/strict';
import { compareTexts, LIMITS } from '../assets/js/text-diff/engine.mjs';

const reconstruct = (result, side) => result.rows.filter(row => row[side] !== null).map(row => row[side].text).join('\n');

test('identical and empty texts do not invent differences', () => {
  assert.equal(compareTexts('', '').changed, 0);
  const result = compareTexts('你好\nworld', '你好\nworld');
  assert.equal(result.changed, 0);
  assert.equal(result.rows.length, 2);
});

test('aligns insertions and deletions without shifting unchanged following lines', () => {
  const result = compareTexts('a\nb\nc\nd', 'a\nnew\nb\nd');
  assert.equal(result.added, 1);
  assert.equal(result.removed, 1);
  assert.equal(result.rows.filter(row => row.kind === 'equal').length, 3);
  assert.equal(reconstruct(result, 'left'), 'a\nb\nc\nd');
  assert.equal(reconstruct(result, 'right'), 'a\nnew\nb\nd');
});

test('replacement lines have precise CJK and emoji highlights', () => {
  const result = compareTexts('你好👩‍💻，旧版本', '你好👩‍💻，新版本');
  assert.deepEqual(result.rows[0].left.parts.filter(p => p.changed).map(p => p.text), ['旧']);
  assert.deepEqual(result.rows[0].right.parts.filter(p => p.changed).map(p => p.text), ['新']);
  assert.equal(result.rows[0].left.parts.map(p => p.text).join(''), '你好👩‍💻，旧版本');
});

test('preserves final newline changes and normalizes CRLF/CR', () => {
  assert.equal(compareTexts('a\r\nb\r', 'a\nb\n').changed, 0);
  assert.equal(compareTexts('a', 'a\n').added, 1);
  assert.equal(compareTexts('a\n', 'a').removed, 1);
  assert.equal(compareTexts('', '\n').added, 2);
});

test('whitespace equivalence is opt-in and preserves displayed original strings', () => {
  assert.equal(compareTexts('a b\tC', 'abC').changed, 1);
  const result = compareTexts('a b\tC', 'abC', { ignoreWhitespace: true });
  assert.equal(result.changed, 0);
  assert.equal(result.rows[0].left.text, 'a b\tC');
  assert.equal(compareTexts('A', 'a').changed, 1);
});

test('treats HTML, script and URL payloads as ordinary text', () => {
  const attack = '<img src=x onerror=alert(1)>\n</script><script>alert(1)</script>\njavascript:alert(1)';
  const result = compareTexts(attack, attack + '\nnew');
  assert.equal(reconstruct(result, 'left'), attack);
  assert.equal(reconstruct(result, 'right'), attack + '\nnew');
});

test('ignoring whitespace also excludes whitespace from mixed real-change highlights', () => {
  const result = compareTexts('  a b\tX', 'abY', { ignoreWhitespace: true });
  assert.deepEqual(result.rows[0].left.parts.filter(p => p.changed).map(p => p.text), ['X']);
  assert.deepEqual(result.rows[0].right.parts.filter(p => p.changed).map(p => p.text), ['Y']);
  assert.equal(result.rows[0].left.parts.map(p => p.text).join(''), '  a b\tX');
  const unicode = compareTexts('👩‍💻 \t你好旧', '👩‍💻你 好新', { ignoreWhitespace: true });
  assert.deepEqual(unicode.rows[0].left.parts.filter(p => p.changed).map(p => p.text), ['旧']);
  assert.equal(unicode.rows[0].right.parts.map(p => p.text).join(''), '👩‍💻你 好新');
});

test('many mixed changes stay within highlight budgets without dropping text', () => {
  const left = Array(100).fill('a '.repeat(40)).join('\n');
  const right = Array(100).fill('b '.repeat(40)).join('\n');
  const result = compareTexts(left, right, { ignoreWhitespace: true });
  assert.equal(result.coarse, false);
  assert.equal(result.detailLimited, true);
  assert.ok(result.rows.flatMap(row => [row.left, row.right]).filter(Boolean).reduce((sum, cell) => sum + cell.parts.length, 0) <= 12000 + 2 * result.rows.length);
  for (const row of result.rows) for (const side of ['left', 'right']) {
    if (row[side]) assert.equal(row[side].parts.map(part => part.text).join(''), row[side].text);
  }
});

test('rejects oversized and excessive-line inputs before comparison', () => {
  assert.throws(() => compareTexts('x'.repeat(LIMITS.characters + 1), ''), /INPUT_LIMIT/);
  assert.throws(() => compareTexts('\n'.repeat(LIMITS.lines), ''), /LINE_LIMIT/);
});

test('work limits produce a truthful coarse diff instead of false equality', () => {
  const a = Array.from({ length: 1800 }, (_, i) => `old-${i}`).join('\n');
  const b = Array.from({ length: 1800 }, (_, i) => `new-${i}`).join('\n');
  const result = compareTexts(a, b);
  assert.equal(result.coarse, true);
  assert.equal(result.removed, 1800);
  assert.equal(result.added, 1800);
  assert.equal(reconstruct(result, 'left'), a);
  assert.equal(reconstruct(result, 'right'), b);
});

test('random small comparisons preserve exact ordering and agree with an independent LCS oracle', () => {
  let seed = 341;
  const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
  const lcs = (a, b) => {
    const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
    return dp[a.length][b.length];
  };
  for (let i = 0; i < 500; i++) {
    const a = Array.from({ length: 1 + Math.floor(random() * 12) }, () => String(Math.floor(random() * 4)));
    const b = Array.from({ length: 1 + Math.floor(random() * 12) }, () => String(Math.floor(random() * 4)));
    const result = compareTexts(a.join('\n'), b.join('\n'));
    assert.equal(reconstruct(result, 'left'), a.join('\n'));
    assert.equal(reconstruct(result, 'right'), b.join('\n'));
    assert.equal(result.removed + result.added, a.length + b.length - 2 * lcs(a, b));
  }
});
