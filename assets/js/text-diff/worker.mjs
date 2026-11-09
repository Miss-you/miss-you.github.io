import { compareTexts } from './engine.mjs';

self.onmessage = ({ data }) => {
  try {
    self.postMessage({ result: compareTexts(data.left, data.right, data.options) });
  } catch (error) {
    self.postMessage({ error: ['INPUT_LIMIT', 'LINE_LIMIT'].includes(error.message) ? error.message : 'COMPARE_ERROR' });
  }
};
