// Exercise real UI event handlers with deterministic worker/timer scheduling.
// Browser rendering, clipboard and CSP are checked separately in the browser.
import test from 'node:test';
import assert from 'node:assert/strict';
import { compareTexts } from '../assets/js/text-diff/engine.mjs';

class Element {
  constructor() {
    this.value = '';
    this.textContent = '';
    this.dataset = {};
    this.children = [];
    this.listeners = new Map();
    this.disabled = false;
    this.hidden = false;
    this.checked = false;
    this.classList = { add() {}, remove() {}, toggle() {} };
  }
  addEventListener(name, handler) { this.listeners.set(name, handler); }
  dispatch(name, event = {}) { return this.listeners.get(name)?.(event); }
  setAttribute(name, value) { this[name] = value; }
  replaceChildren(...children) { this.children = children; }
  append(...children) { this.children.push(...children); }
  appendChild(child) { this.children.push(child); }
  focus() {}
}

const elements = new Map();
const get = id => {
  if (!elements.has(id)) elements.set(id, new Element());
  return elements.get(id);
};
get('workspace').dataset = { lang: 'en', worker: '/worker.js' };
const windows = new Map();
globalThis.window = { addEventListener: (name, handler) => windows.set(name, handler) };
window.top = window.self = window;
globalThis.document = {
  getElementById: get,
  querySelector: get,
  querySelectorAll: () => [],
  addEventListener() {},
  createElement: () => new Element(),
  createTextNode: text => ({ textContent: text }),
  createDocumentFragment: () => new Element(),
};
const workers = [];
globalThis.Worker = class {
  constructor() { this.terminated = false; workers.push(this); }
  postMessage(data) { this.input = data; }
  terminate() { this.terminated = true; }
};
const timers = new Map();
let timerId = 0;
globalThis.setTimeout = (handler, milliseconds) => { timers.set(++timerId, { handler, milliseconds }); return timerId; };
globalThis.clearTimeout = id => timers.delete(id);
const frames = [];
globalThis.requestAnimationFrame = callback => frames.push(callback);
await import('../assets/js/text-diff/ui.mjs');

const start = () => {
  get('clear').dispatch('click');
  get('left-input').value = 'before';
  get('right-input').value = 'after';
  get('compare').dispatch('click');
  return workers.at(-1);
};

test('comparison timeout terminates the actual pending worker and restores controls', () => {
  const worker = start();
  const [timer] = timers.values();
  assert.equal(timer.milliseconds, 5000);
  timer.handler();
  assert.equal(worker.terminated, true);
  assert.equal(get('compare').disabled, false);
  assert.equal(get('cancel').hidden, true);
  assert.match(get('status').textContent, /exceeded 5 seconds/);
});

test('a late worker response cannot restore a result after clearing', () => {
  const worker = start();
  const result = compareTexts(worker.input.left, worker.input.right);
  get('clear').dispatch('click');
  worker.onmessage({ data: { result } });
  assert.equal(worker.terminated, true);
  assert.equal(get('left-input').value, '');
  assert.equal(get('right-input').value, '');
  assert.equal(get('diff-rows').children.length, 0);
  assert.match(get('status').textContent, /cleared/);
});

test('clearing during a render batch cancels remaining scheduled DOM updates', async () => {
  const worker = start();
  const result = compareTexts(Array(250).fill('same').join('\n'), Array(250).fill('same').join('\n'));
  worker.onmessage({ data: { result } });
  assert.equal(get('diff-rows').children.length, 1);
  get('clear').dispatch('click');
  frames.shift()();
  await Promise.resolve();
  assert.equal(get('diff-rows').children.length, 0);
  assert.equal(get('result-scroll').hidden, true);
  assert.match(get('status').textContent, /cleared/);
});

test('navigation clears text and terminates outstanding computation', () => {
  const worker = start();
  windows.get('pagehide')();
  assert.equal(worker.terminated, true);
  assert.equal(get('left-input').value, '');
  assert.equal(get('right-input').value, '');
  assert.equal(timers.size, 0);
});
