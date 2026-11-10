import { afterEach, describe, expect, it, vi } from 'vitest';
import { defaultPrefs, loadPrefs } from '../src/prefs';

afterEach(() => vi.unstubAllGlobals());
describe('YDD preview defaults', () => {
  it('starts with precise character highlights, wrapping, and no text retention', () => {
    vi.stubGlobal('localStorage', { getItem: () => null });
    expect(defaultPrefs).toMatchObject({ granularity: 'char', wrap: true, history: false, remember: false });
    expect(loadPrefs()).toMatchObject({ granularity: 'char', wrap: true, history: false, remember: false });
  });
  it('does not inherit preferences from an unrelated text.compare installation', () => {
    vi.stubGlobal('localStorage', { getItem: (key: string) => key === 'text-compare:prefs' ? '{"history":true,"remember":true}' : null });
    expect(loadPrefs()).toMatchObject({ history: false, remember: false });
  });
});
