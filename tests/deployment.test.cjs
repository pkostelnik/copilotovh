const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { prepareSite, files } = require('../.github/scripts/prepare-site.cjs');
const { verifyDeployment } = require('../.github/scripts/verify-deployment.cjs');

test('deployment artifact contains only allowlisted site files with working local references', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'copilot-site-test-'));
  const target = path.join(temp, 'site');
  try {
    prepareSite(target);
    assert.deepEqual(fs.readdirSync(target).sort(), [...files].sort());
    assert.ok(!fs.existsSync(path.join(target, 'README.md')));
    assert.ok(!fs.existsSync(path.join(target, '.github')));
    assert.throws(() => prepareSite(target), /EEXIST/);
    for (const file of files.filter(file => file.endsWith('.html'))) {
      const html = fs.readFileSync(path.join(target, file), 'utf8');
      for (const [, value] of html.matchAll(/(?:href|src|data-src)="([^"#?]+)(?:[?#][^"]*)?"/g)) {
        if (/^(?:https?:|mailto:)/.test(value) || value === '/') continue;
        assert.ok(fs.existsSync(path.join(target, value.replace(/^\//, ''))), `${file}: missing ${value}`);
      }
    }
    const config = JSON.parse(fs.readFileSync(path.join(target, 'staticwebapp.config.json')));
    for (const route of ['/pk', '/pk.html']) {
      const rule = config.routes.find(rule => rule.route === route);
      assert.equal(rule.statusCode, 404);
      assert.equal(rule.rewrite, undefined);
    }
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('Azure routes are unique after trailing-slash normalization', () => {
  const config = require('../staticwebapp.config.json');
  const seen = new Map();
  for (const rule of config.routes) {
    // Azure rejects /pk and /pk/ as duplicate rules, even with identical status codes.
    const normalized = rule.route.replace(/\/+$/, '') || '/';
    assert.ok(!seen.has(normalized), `${rule.route}: duplicate of ${seen.get(normalized)}`);
    seen.set(normalized, rule.route);
  }
});

test('Azure route rules never combine rewrite with statusCode or redirect', () => {
  const config = require('../staticwebapp.config.json');
  // This restriction is for routes, not the separate responseOverrides API.
  for (const rule of config.routes) {
    if (Object.hasOwn(rule, 'rewrite')) {
      assert.ok(!Object.hasOwn(rule, 'statusCode'), `${rule.route}: rewrite cannot specify statusCode`);
      assert.ok(!Object.hasOwn(rule, 'redirect'), `${rule.route}: rewrite cannot specify redirect`);
    }
  }
});

test('live deployment check requires exactly 404 for every removed-page alias', async t => {
  const config = require('../staticwebapp.config.json');
  for (const alias of ['/pk.html', '/pk', '/pk/']) {
    for (const wrongStatus of [200, 410, 500]) {
      await t.test(`${alias} rejects ${wrongStatus}`, async t => {
        t.mock.method(global, 'fetch', async url => {
          const route = new URL(url).pathname;
          const status = route === alias ? wrongStatus : route.startsWith('/pk') ? 404 : 200;
          return new Response('', { status, headers: config.globalHeaders });
        });
        await assert.rejects(verifyDeployment('https://example.invalid'), error => {
          assert.equal(error.message.split('\n')[0], `${alias}: HTTP status`);
          return true;
        });
      });
    }
  }
});

test('live deployment check accepts the complete expected deployment', async t => {
  const config = require('../staticwebapp.config.json');
  t.mock.method(global, 'fetch', async url => {
    const route = new URL(url).pathname;
    const asset = ['/init.js', '/styles.css'].includes(route);
    const status = asset || ['/', '/index_en.html', '/disclaimer.html'].includes(route) ? 200 : 404;
    const headers = { ...config.globalHeaders };
    if (asset) {
      headers['Content-Type'] = route.endsWith('.js') ? 'text/javascript' : 'text/css';
      headers['Cache-Control'] = 'public, max-age=86400, must-revalidate';
    }
    return new Response('<script src="/init.js"></script><link href="/styles.css">', { status, headers });
  });
  await verifyDeployment('https://example.invalid');
});

test('live deployment check rejects published documentation even with correct security headers', async t => {
  const config = require('../staticwebapp.config.json');
  t.mock.method(global, 'fetch', async url => {
    const route = new URL(url).pathname;
    const status = route.startsWith('/pk') ? 404 :
      ['/remotion/deployment-check', '/deployment-check/missing-page', '/staticwebapp.config.json'].includes(route) ? 404 : 200;
    return new Response('<script src="/init.js"></script><link href="/styles.css">', { status, headers: config.globalHeaders });
  });
  await assert.rejects(verifyDeployment('https://example.invalid'), /\/README.md: HTTP status/);
});
