import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// Run the actual template script; replace only its external library import.
const partial = readFileSync(new URL('../layouts/partials/extend_footer.html', import.meta.url), 'utf8');
const source = partial.match(/<script type="module">([\s\S]*?)<\/script>/)[1]
  .replace(/^\s*import mermaid from [^;]+;/m, '');
const settle = async () => { for (let i = 0; i < 15; i++) await Promise.resolve(); };

function renderer({ diagram = false, render } = {}) {
  let dark = false;
  let reloads = 0;
  const callbacks = [];
  const timers = new Map();
  const runs = [];
  const configurations = [];
  const replacements = [];
  const errors = [];
  const element = () => ({
    style: {}, textContent: '', isConnected: true,
    attributes: new Map(), children: [],
    appendChild(node) { this.children.push(node); },
    removeAttribute(name) { this.attributes.delete(name); },
  });
  const block = { textContent: 'graph TD\n A-->B', parentElement: { parentNode: { replaceChild: node => replacements.push(node) } } };
  const mermaid = {
    initialize: config => configurations.push(config),
    run: async options => {
      const node = options.nodes?.[0] ?? replacements.at(-1)?.children[0].children[0];
      runs.push({ text: node?.textContent, processed: node?.attributes.has('data-processed') });
      if (render) await render(runs.length);
      if (node) { node.textContent = '<svg>rendered</svg>'; node.attributes.set('data-processed', 'true'); }
    },
  };
  vm.runInNewContext(source, {
    mermaid,
    document: {
      body: { classList: { contains: () => dark } },
      readyState: 'complete',
      getElementById: () => ({}),
      querySelectorAll: () => diagram ? [block] : [],
      createElement: element,
    },
    MutationObserver: class { constructor(callback) { callbacks.push(callback); } observe() {} },
    setTimeout: callback => { const id = {}; timers.set(id, callback); return id; },
    clearTimeout: id => timers.delete(id),
    location: { reload: () => reloads++ },
    console: { error: (...args) => errors.push(args) },
  });
  const change = (nextDark = !dark) => {
    dark = nextDark;
    callbacks[0]([{ attributeName: 'class' }]);
    for (const [id, callback] of timers) { timers.delete(id); callback(); }
  };
  return { change, runs, configurations, replacements, errors, reloads: () => reloads };
}

test('theme change on a page without diagrams never reloads or initializes Mermaid', async () => {
  const state = renderer();
  state.change(true);
  await settle();
  assert.equal(state.reloads(), 0, 'appearance must not reset the whole document and its inputs');
  assert.equal(state.configurations.length, 0);
});

test('theme change redraws the existing diagram from original source without replacing its wrapper', async () => {
  const state = renderer({ diagram: true });
  await settle();
  const wrapper = state.replacements[0];
  state.change(true);
  await settle();
  assert.equal(state.runs.length, 2);
  assert.deepEqual(state.runs.map(run => run.text), ['graph TD\n A-->B', 'graph TD\n A-->B']);
  assert.equal(state.runs[1].processed, false);
  assert.equal(state.replacements.length, 1);
  assert.equal(state.replacements[0], wrapper);
  assert.equal(state.configurations.at(-1).themeVariables.background, '#1d1e20');
  assert.equal(state.reloads(), 0);
});

test('rapid changes during initial drawing serialize and repaint the latest theme', async () => {
  let release;
  const blocked = new Promise(resolve => { release = resolve; });
  const state = renderer({ diagram: true, render: count => count === 1 ? blocked : undefined });
  state.change(true);
  state.change(false);
  state.change(true);
  assert.equal(state.runs.length, 1, 'third-party rendering must not run concurrently');
  release();
  await settle();
  assert.equal(state.runs.length, 2);
  assert.equal(state.configurations.at(-1).themeVariables.background, '#1d1e20');
  assert.equal(state.reloads(), 0);
});

test('unrelated body class mutations do not trigger repaint', async () => {
  const state = renderer({ diagram: true });
  await settle();
  state.change(false);
  await settle();
  assert.equal(state.runs.length, 1);
});

test('a chart failure does not prevent the next theme repaint', async () => {
  const state = renderer({ diagram: true, render: count => { if (count === 1) throw Error('synthetic chart failure'); } });
  await settle();
  state.change(true);
  await settle();
  assert.equal(state.errors.length, 1);
  assert.equal(state.runs.length, 2);
  assert.equal(state.reloads(), 0);
});
