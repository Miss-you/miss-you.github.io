import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../assets/js/site-header.js', import.meta.url), 'utf8');

function header({ isolated = true, saved, blockedStorage = false, framed = false, defaultTheme = 'light', systemDark = false, loading = false } = {}) {
  const classes = new Set();
  const listeners = new Map();
  const events = new Map();
  const writes = [];
  const callbacks = [];
  const windowEvents = new Map();
  const root = { dataset: {} };
  const body = { classList: {
    contains: name => classes.has(name),
    toggle: (name, value) => value ? classes.add(name) : classes.delete(name),
  } };
  const button = { disabled: isolated, addEventListener: (name, callback) => listeners.set(name, callback) };
  const window = { matchMedia: () => ({ matches: systemDark }), addEventListener: (name, callback) => windowEvents.set(name, callback) };
  window.self = window;
  window.top = framed ? {} : window;
  vm.runInNewContext(source, {
    window,
    document: {
      currentScript: { dataset: { isolated: String(isolated), defaultTheme } },
      documentElement: root,
      body,
      readyState: loading ? 'loading' : 'interactive',
      addEventListener: (name, callback) => events.set(name, callback),
      getElementById: id => id === 'theme-toggle' ? button : null,
    },
    localStorage: {
      getItem: key => { assert.equal(key, 'pref-theme'); if (blockedStorage) throw Error('blocked'); return saved; },
      setItem: (key, value) => { if (blockedStorage) throw Error('blocked'); writes.push([key, value]); },
    },
    MutationObserver: class {
      constructor(callback) { callbacks.push(callback); }
      observe() {}
    },
  });
  return { classes, listeners, events, writes, callbacks, root, button, windowEvents, setSaved: value => { saved = value; } };
}

test('isolated page initializes from the same saved preference as ordinary pages', () => {
  const state = header({ saved: 'dark' });
  assert.equal(state.classes.has('dark'), true);
  assert.equal(state.root.dataset.theme, 'dark');
  assert.equal(state.button.disabled, false);
  state.listeners.get('click')();
  assert.equal(state.classes.has('dark'), false);
  assert.equal(state.root.dataset.theme, 'light');
  assert.deepEqual(state.writes, [['pref-theme', 'light']]);
});

test('blocked storage does not break local theme switching', () => {
  const state = header({ blockedStorage: true });
  state.listeners.get('click')();
  assert.equal(state.root.dataset.theme, 'dark');
  assert.equal(state.classes.has('dark'), true);
  assert.equal(state.writes.length, 0);
});

test('ordinary page leaves theme clicks with PaperMod and observes its changes', () => {
  const state = header({ isolated: false });
  assert.equal(state.listeners.size, 0, 'must not double-toggle the existing button');
  state.classes.add('dark');
  state.callbacks[0]();
  assert.equal(state.root.dataset.theme, 'dark');
});

test('embedded isolated page does not enable controls or bind a theme click', () => {
  const state = header({ framed: true });
  assert.equal(state.button.disabled, true);
  assert.equal(state.listeners.size, 0);
  assert.equal(state.writes.length, 0);
});

test('auto default follows the system until an explicit saved preference exists', () => {
  assert.equal(header({ defaultTheme: 'auto', systemDark: true }).root.dataset.theme, 'dark');
  assert.equal(header({ defaultTheme: 'auto', systemDark: true, saved: 'light' }).root.dataset.theme, 'light');
});

test('loading document initializes its controls when DOM readiness arrives', () => {
  const state = header({ loading: true, saved: 'dark' });
  assert.equal(state.root.dataset.theme, 'dark');
  assert.equal(state.listeners.size, 0);
  state.events.get('DOMContentLoaded')();
  assert.equal(state.listeners.size, 1);
  assert.equal(state.classes.has('dark'), true);
});

test('restoring a cached page refreshes changed appearance without rebinding controls', () => {
  const state = header({ saved: 'dark' });
  const click = state.listeners.get('click');
  state.setSaved('light');
  state.windowEvents.get('pageshow')({ persisted: true });
  assert.equal(state.classes.has('dark'), false);
  assert.equal(state.root.dataset.theme, 'light');
  assert.equal(state.listeners.get('click'), click);
  assert.equal(state.writes.length, 0);
});

test('appearance changes in another tab refresh only for the preference key', () => {
  const state = header();
  state.setSaved('dark');
  state.windowEvents.get('storage')({ key: 'unrelated' });
  assert.equal(state.classes.has('dark'), false);
  state.windowEvents.get('storage')({ key: 'pref-theme' });
  assert.equal(state.classes.has('dark'), true);
});
