const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const script = fs.readFileSync(path.join(__dirname, '../init.js'), 'utf8');

function initialize(pathname, pref, browserLang = 'en-US', storageBlocked = false) {
  const redirects = [];
  const attributes = {};
  vm.runInNewContext(script, {
    document: { documentElement: { classList: { add() {} }, setAttribute(k, v) { attributes[k] = v; } } },
    localStorage: { getItem(key) { if (storageBlocked) throw new Error('Storage blocked'); return key === 'langPref' ? pref : 'auto'; } },
    navigator: { language: browserLang },
    window: { location: { pathname, search: '?campaign=test', hash: '#faq', replace(url) { redirects.push(url); } } }
  });
  return { redirects, attributes };
}

test('saved language applies to canonical and normalized landing URLs', () => {
  for (const route of ['/index_en.html', '/index_en', '/index_en/']) {
    assert.deepEqual(initialize(route, 'de').redirects, ['/index.html?campaign=test#faq']);
    assert.deepEqual(initialize(route, 'en').redirects, []);
  }
  for (const route of ['/', '/index.html', '/index', '/index/']) {
    assert.deepEqual(initialize(route, 'en').redirects, ['/index_en.html?campaign=test#faq']);
    assert.deepEqual(initialize(route, 'de').redirects, []);
  }
});

test('404 routes, disclaimer and removed pages never trigger landing redirects', () => {
  for (const route of ['/missing/', '/missing/index.html', '/missing/index_en', '/disclaimer', '/disclaimer.html', '/410.html', '/pk']) {
    assert.deepEqual(initialize(route, 'en').redirects, []);
    assert.deepEqual(initialize(route, 'de').redirects, []);
  }
});

test('invalid or unavailable storage falls back to browser language safely', () => {
  assert.deepEqual(initialize('/index_en', 'https://evil.invalid', 'de-DE').redirects, ['/index.html?campaign=test#faq']);
  assert.deepEqual(initialize('/', null, 'fr-FR', true).redirects, ['/index_en.html?campaign=test#faq']);
  assert.deepEqual(initialize('/', null, 'de-AT', true).redirects, []);
});
