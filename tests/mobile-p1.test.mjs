import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const page = await readFile(new URL('../src/routes/+page.svelte', import.meta.url), 'utf8');
const between = (open, close) => {
  const start = page.indexOf(open);
  assert.ok(start >= 0, 'missing '+open);
  const end = page.indexOf(close, start);
  assert.ok(end >= 0, 'missing '+close);
  return page.slice(start, end + close.length);
};
const fnv1a = (s) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0).toString(16);
};

test('Approved header and hero markup remain exactly unchanged', () => {
  assert.equal(fnv1a(between('<header class="topbar"', '</header>')), 'de0df732');
  assert.equal(fnv1a(between('<section class="hero"', '</section>')), '56bc0bfc');
});

test('Mobile P1 changes target form zoom and do not globally hide page overflow', () => {
  assert.match(page, /\.site-shell\{min-width:0\}/);
  assert.doesNotMatch(page, /\.site-shell\{overflow:(?:hidden|clip)/);
  assert.doesNotMatch(page, /\.site-shell\{overflow-x:(?:hidden|clip)/);
  assert.match(page, /@media\(max-width:760px\)\{[\s\S]*?\.form-col input,\.form-col textarea,\.form-col select\{font-size:16px\}/);
});

test('Mobile edit form offers direct live preview and back navigation with accessible targets', () => {
  assert.match(page, /id="menu-edit-form"/);
  assert.match(page, /id="menu-live-preview"/);
  assert.match(page, /aria-controls="menu-live-preview"/);
  assert.match(page, /jump\("menu-live-preview"\)/);
  assert.match(page, /jump\("menu-edit-form"\)/);
  assert.match(page, /\.mobile-preview-jump\{position:sticky;top:0/);
  assert.match(page, /\.mobile-preview-jump,\.mobile-edit-back\{display:none\}/);
});
